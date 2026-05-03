<?php

use App\Models\Invoice;
use Spatie\Activitylog\Models\Activity;

it('[RNF-Audit] logs invoice show access via the rgpd.access_log middleware', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $invoice = Invoice::create([
        'workspace_id' => null,
        'patient_id' => $patient->id,
        'professional_id' => $professional->id,
        'invoice_number' => 'FAC-2026-99001',
        'status' => 'sent',
        'issued_at' => now(),
        'due_at' => now()->addDays(30),
        'subtotal' => 60,
        'tax_rate' => 0,
        'tax_amount' => 0,
        'total' => 60,
        'pdf_path' => 'invoices/stub.pdf',
    ]);

    $this->actingAs($patient)
        ->get(route('patient.invoices.show', $invoice));

    $activity = Activity::query()
        ->where('log_name', 'rgpd_access')
        ->where('event', 'invoice.show')
        ->latest('id')
        ->first();

    expect($activity)->not->toBeNull()
        ->and($activity->causer_id)->toBe($patient->id)
        ->and($activity->properties['route'])->toBe('patient.invoices.show')
        ->and($activity->properties['status'])->toBeInt();
});

it('[RNF-Audit] logs invoice download access with the rgpd_access log_name', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $invoice = Invoice::create([
        'workspace_id' => null,
        'patient_id' => $patient->id,
        'professional_id' => $professional->id,
        'invoice_number' => 'FAC-2026-99002',
        'status' => 'sent',
        'issued_at' => now(),
        'due_at' => now()->addDays(30),
        'subtotal' => 60,
        'tax_rate' => 0,
        'tax_amount' => 0,
        'total' => 60,
        'pdf_path' => 'invoices/stub.pdf',
    ]);

    $this->actingAs($patient)
        ->get(route('patient.invoices.download', $invoice));

    $this->assertDatabaseHas('activity_log', [
        'log_name' => 'rgpd_access',
        'event' => 'invoice.download',
        'causer_id' => $patient->id,
    ]);
});

it('[RNF-Audit] does not log access when no user is authenticated', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $invoice = Invoice::create([
        'workspace_id' => null,
        'patient_id' => $patient->id,
        'professional_id' => $professional->id,
        'invoice_number' => 'FAC-2026-99003',
        'status' => 'sent',
        'issued_at' => now(),
        'due_at' => now()->addDays(30),
        'subtotal' => 60,
        'tax_rate' => 0,
        'tax_amount' => 0,
        'total' => 60,
        'pdf_path' => 'invoices/stub.pdf',
    ]);

    $this->get(route('patient.invoices.show', $invoice));

    $this->assertDatabaseMissing('activity_log', [
        'log_name' => 'rgpd_access',
        'event' => 'invoice.show',
    ]);
});
