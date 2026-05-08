<?php

use App\Contracts\PaymentGateway;
use App\Models\Invoice;
use Tests\Support\FakeStripeGateway;

beforeEach(function () {
    $this->fake = new FakeStripeGateway;
    $this->app->instance(PaymentGateway::class, $this->fake);
});

it('marks invoice as paid when returning from stripe with successful payment', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $invoice = Invoice::factory()->sent()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'stripe_checkout_session_id' => 'cs_test_abc',
    ]);

    $this->fake->checkoutSessionPaymentStatus = 'paid';

    $this->actingAs($patient)
        ->get("/patient/invoices/{$invoice->id}?checkout=success")
        ->assertOk();

    $fresh = $invoice->fresh();
    expect($fresh->status)->toBe('paid');
    expect($fresh->payment_method)->toBe('stripe');
    expect($fresh->paid_at)->not->toBeNull();
});

it('does not mark invoice as paid when stripe session is unpaid', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $invoice = Invoice::factory()->sent()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'stripe_checkout_session_id' => 'cs_test_abc',
    ]);

    $this->fake->checkoutSessionPaymentStatus = 'unpaid';

    $this->actingAs($patient)
        ->get("/patient/invoices/{$invoice->id}?checkout=success")
        ->assertOk();

    expect($invoice->fresh()->status)->toBe('sent');
});

it('does not call stripe when checkout param is absent', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $invoice = Invoice::factory()->sent()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'stripe_checkout_session_id' => 'cs_test_abc',
    ]);

    $this->actingAs($patient)
        ->get("/patient/invoices/{$invoice->id}")
        ->assertOk();

    expect($invoice->fresh()->status)->toBe('sent');
});

it('skips stripe verification when invoice is already paid', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $invoice = Invoice::factory()->paid()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'stripe_checkout_session_id' => 'cs_test_abc',
    ]);

    $originalPaidAt = $invoice->paid_at;

    $this->actingAs($patient)
        ->get("/patient/invoices/{$invoice->id}?checkout=success")
        ->assertOk();

    expect($invoice->fresh()->paid_at->equalTo($originalPaidAt))->toBeTrue();
});

it('skips stripe verification when invoice has no checkout session id', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $invoice = Invoice::factory()->sent()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'stripe_checkout_session_id' => null,
    ]);

    $this->actingAs($patient)
        ->get("/patient/invoices/{$invoice->id}?checkout=success")
        ->assertOk();

    expect($invoice->fresh()->status)->toBe('sent');
});
