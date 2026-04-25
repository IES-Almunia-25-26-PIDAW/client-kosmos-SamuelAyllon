<?php

use App\Jobs\SendAgreementsEmailJob;
use App\Jobs\SendInvoiceEmailJob;
use App\Jobs\SendPostSessionEmailJob;
use App\Models\Appointment;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Support\Facades\Queue;

it('dispatches agreements and post-session jobs when finalizing without invoice', function () {
    Queue::fake();

    $professional = createProfessional();
    $patient = createPatient();
    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'status' => 'completed',
        'workspace_id' => null,
        'starts_at' => now()->subMinutes(60),
        'ends_at' => now()->subMinutes(10),
    ]);

    $this->actingAs($professional)
        ->post("/professional/appointments/{$appointment->id}/finalize-and-notify")
        ->assertRedirect();

    Queue::assertPushed(SendAgreementsEmailJob::class);
    Queue::assertPushed(SendPostSessionEmailJob::class);
    Queue::assertNotPushed(SendInvoiceEmailJob::class);
});

it('also dispatches invoice job and marks invoice as sent when invoice exists', function () {
    Queue::fake();

    $professional = createProfessional();
    $patient = createPatient();
    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'status' => 'completed',
        'workspace_id' => null,
        'starts_at' => now()->subMinutes(60),
        'ends_at' => now()->subMinutes(10),
    ]);

    $invoice = Invoice::create([
        'workspace_id' => null,
        'patient_id' => $patient->id,
        'professional_id' => $professional->id,
        'invoice_number' => 'FAC-2026-00001',
        'status' => 'draft',
        'issued_at' => now(),
        'due_at' => now()->addDays(30),
        'subtotal' => 60,
        'tax_rate' => 0,
        'tax_amount' => 0,
        'total' => 60,
        'pdf_path' => 'invoices/stub.pdf',
    ]);

    InvoiceItem::create([
        'invoice_id' => $invoice->id,
        'appointment_id' => $appointment->id,
        'description' => 'Sesión',
        'quantity' => 1,
        'unit_price' => 60,
        'total' => 60,
    ]);

    $this->actingAs($professional)
        ->post("/professional/appointments/{$appointment->id}/finalize-and-notify")
        ->assertRedirect();

    expect($invoice->fresh()->status)->toBe('sent');
    Queue::assertPushed(SendInvoiceEmailJob::class);
    Queue::assertPushed(SendAgreementsEmailJob::class);
    Queue::assertPushed(SendPostSessionEmailJob::class);
});

it('denies finalize when user is not the appointment professional', function () {
    $professional = createProfessional();
    $otherProfessional = createProfessional();
    $patient = createPatient();
    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'status' => 'completed',
        'workspace_id' => null,
    ]);

    $this->actingAs($otherProfessional)
        ->post("/professional/appointments/{$appointment->id}/finalize-and-notify")
        ->assertForbidden();
});
