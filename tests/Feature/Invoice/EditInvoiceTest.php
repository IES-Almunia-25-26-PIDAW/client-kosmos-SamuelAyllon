<?php

use App\Models\Invoice;

function makeDraftInvoice(\App\Models\User $professional, \App\Models\User $patient, array $overrides = []): Invoice
{
    return Invoice::create(array_merge([
        'workspace_id' => null,
        'patient_id' => $patient->id,
        'professional_id' => $professional->id,
        'invoice_number' => 'FAC-2026-90001',
        'status' => 'draft',
        'issued_at' => now(),
        'due_at' => now()->addDays(30),
        'subtotal' => 60,
        'tax_rate' => 0,
        'tax_amount' => 0,
        'total' => 60,
    ], $overrides));
}

it('renders edit page for draft invoices', function () {
    $professional = createProfessional();
    $patient = createPatient();
    $invoice = makeDraftInvoice($professional, $patient);

    $this->actingAs($professional)
        ->get("/professional/invoices/{$invoice->id}/edit")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('professional/invoices/edit')
            ->where('invoice.id', $invoice->id)
        );
});

it('forbids editing once invoice is sent', function () {
    $professional = createProfessional();
    $patient = createPatient();
    $invoice = makeDraftInvoice($professional, $patient, ['status' => 'sent']);

    $this->actingAs($professional)
        ->get("/professional/invoices/{$invoice->id}/edit")
        ->assertForbidden();
});

it('persists updated amount, due date and notes', function () {
    $professional = createProfessional();
    $patient = createPatient();
    $invoice = makeDraftInvoice($professional, $patient);

    $this->actingAs($professional)
        ->patch("/professional/invoices/{$invoice->id}", [
            'amount' => 80,
            'due_at' => now()->addDays(15)->toDateString(),
            'payment_method' => 'transfer',
            'notes' => 'Pago aplazado a fin de mes.',
        ])
        ->assertRedirect();

    $invoice->refresh();
    expect((float) $invoice->subtotal)->toBe(80.0)
        ->and((float) $invoice->total)->toBe(80.0)
        ->and($invoice->payment_method)->toBe('transfer')
        ->and($invoice->notes)->toBe('Pago aplazado a fin de mes.');
});

it('rejects edit from another professional', function () {
    $owner = createProfessional();
    $intruder = createProfessional();
    $patient = createPatient();
    $invoice = makeDraftInvoice($owner, $patient);

    $this->actingAs($intruder)
        ->patch("/professional/invoices/{$invoice->id}", [
            'amount' => 999,
            'due_at' => now()->addDays(30)->toDateString(),
        ])
        ->assertForbidden();
});

it('rejects updates to sent invoices', function () {
    $professional = createProfessional();
    $patient = createPatient();
    $invoice = makeDraftInvoice($professional, $patient, ['status' => 'sent']);

    $this->actingAs($professional)
        ->patch("/professional/invoices/{$invoice->id}", [
            'amount' => 999,
            'due_at' => now()->addDays(30)->toDateString(),
        ])
        ->assertForbidden();

    expect((float) $invoice->fresh()->total)->toBe(60.0);
});
