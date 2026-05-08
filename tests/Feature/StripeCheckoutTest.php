<?php

use App\Contracts\PaymentGateway;
use App\Models\Invoice;
use App\Models\User;
use Tests\Support\FakeStripeGateway;

beforeEach(function () {
    $this->fake = new FakeStripeGateway;
    $this->app->instance(PaymentGateway::class, $this->fake);
});

it('professional can create checkout session for sent invoice', function () {
    $professional = createProfessional();
    $patient = User::factory()->create();

    $invoice = Invoice::factory()->sent()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
    ]);

    $response = $this->actingAs($professional)
        ->withHeader('X-Inertia', 'true')
        ->post(route('professional.invoices.checkout', $invoice));

    $response->assertStatus(409);
    expect($response->headers->get('X-Inertia-Location'))->toBe($this->fake->sessionUrl);

    expect($invoice->fresh()->stripe_checkout_session_id)->toBe($this->fake->sessionId);
    expect($this->fake->lastInvoice?->id)->toBe($invoice->id);
});

it('cannot create checkout for already-paid invoice', function () {
    $professional = createProfessional();
    $patient = User::factory()->create();

    $invoice = Invoice::factory()->paid()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
    ]);

    $this->actingAs($professional)
        ->post(route('professional.invoices.checkout', $invoice))
        ->assertForbidden();

    expect($this->fake->lastInvoice)->toBeNull();
});

it('cannot create checkout for draft invoice', function () {
    $professional = createProfessional();
    $patient = User::factory()->create();

    $invoice = Invoice::factory()->draft()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
    ]);

    $this->actingAs($professional)
        ->post(route('professional.invoices.checkout', $invoice))
        ->assertForbidden();
});

it("cannot create checkout for another professional's invoice", function () {
    $owner = createProfessional();
    $intruder = createProfessional();
    $patient = User::factory()->create();

    $invoice = Invoice::factory()->sent()->create([
        'professional_id' => $owner->id,
        'patient_id' => $patient->id,
    ]);

    $this->actingAs($intruder)
        ->post(route('professional.invoices.checkout', $invoice))
        ->assertForbidden();
});

it('guest cannot create checkout', function () {
    $invoice = Invoice::factory()->sent()->create();

    $this->post(route('professional.invoices.checkout', $invoice))
        ->assertRedirect(route('login'));
});
