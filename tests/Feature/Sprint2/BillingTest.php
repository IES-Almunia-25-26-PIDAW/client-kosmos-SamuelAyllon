<?php

use App\Jobs\SendInvoiceEmailJob;
use App\Models\Invoice;
use App\Services\BillingService;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;

// ─── Sequential invoice numbering ─────────────────────────────────────────────

it('generates first invoice number for the year as FAC-{YEAR}-00001', function () {
    $service = app(BillingService::class);
    $number = $service->generateSequentialInvoiceNumber(2030);

    expect($number)->toBe('FAC-2030-00001');
});

it('increments sequential invoice number correctly', function () {
    Invoice::factory()->create([
        'invoice_number' => 'FAC-2030-00001',
        'workspace_id' => null,
    ]);
    Invoice::factory()->create([
        'invoice_number' => 'FAC-2030-00002',
        'workspace_id' => null,
    ]);

    $service = app(BillingService::class);
    $number = $service->generateSequentialInvoiceNumber(2030);

    expect($number)->toBe('FAC-2030-00003');
});

it('does not cross-contaminate years in sequential numbering', function () {
    Invoice::factory()->create([
        'invoice_number' => 'FAC-2029-00005',
        'workspace_id' => null,
    ]);

    $service = app(BillingService::class);
    $number = $service->generateSequentialInvoiceNumber(2030);

    expect($number)->toBe('FAC-2030-00001');
});

// ─── BillingService::generatePdf ─────────────────────────────────────────────

it('generates a PDF and stores it in the private disk', function () {
    Storage::fake('private');

    $professional = createProfessional();
    $patient = createPatient();

    $invoice = Invoice::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'invoice_number' => 'FAC-2026-00001',
        'workspace_id' => null,
    ]);

    $service = app(BillingService::class);
    $service->generatePdf($invoice);

    Storage::disk('private')->assertExists("invoices/{$invoice->id}.pdf");
    expect($invoice->fresh()->pdf_path)->toBe("invoices/{$invoice->id}.pdf");
});

// ─── SendInvoiceEmailJob ───────────────────────────────────────────────────────

it('dispatches SendInvoiceEmailJob from InvoiceSendAction', function () {
    Queue::fake();
    Storage::fake('private');

    $professional = createProfessional();
    $patient = createPatient();

    $invoice = Invoice::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'status' => 'draft',
        'workspace_id' => null,
    ]);

    $this->actingAs($professional)
        ->postJson("/professional/invoices/{$invoice->id}/send")
        ->assertRedirect();

    Queue::assertPushed(SendInvoiceEmailJob::class, function ($job) use ($invoice) {
        return $job->invoiceId === $invoice->id;
    });
    expect($invoice->fresh()->status)->toBe('sent');
});
