<?php

use App\Contracts\PaymentGateway;
use App\Models\Invoice;
use App\Models\User;
use Tests\Support\FakeStripeGateway;

beforeEach(function () {
    $this->fake = new FakeStripeGateway;
    $this->app->instance(PaymentGateway::class, $this->fake);
});

function stripeFixturePayload(string $sessionId, int $invoiceId): string
{
    $template = file_get_contents(base_path('tests/Fixtures/stripe/checkout-session-completed.json'));

    return strtr($template, [
        '{{SESSION_ID}}' => $sessionId,
        '{{INVOICE_ID}}' => (string) $invoiceId,
    ]);
}

it('webhook with valid signature marks invoice as paid', function () {
    $professional = createProfessional();
    $patient = User::factory()->create();

    $invoice = Invoice::factory()->sent()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'stripe_checkout_session_id' => 'cs_test_abc',
    ]);

    $payload = stripeFixturePayload('cs_test_abc', $invoice->id);

    $this->call(
        method: 'POST',
        uri: route('webhooks.stripe'),
        server: ['HTTP_STRIPE_SIGNATURE' => 'valid', 'CONTENT_TYPE' => 'application/json'],
        content: $payload,
    )->assertOk();

    $fresh = $invoice->fresh();
    expect($fresh->status)->toBe('paid');
    expect($fresh->payment_method)->toBe('stripe');
    expect($fresh->paid_at)->not->toBeNull();
    expect($fresh->stripe_payment_id)->toBe('pi_test_payment_intent_123');
});

it('webhook with invalid signature returns 400', function () {
    $invoice = Invoice::factory()->sent()->create([
        'stripe_checkout_session_id' => 'cs_test_abc',
    ]);

    $this->call(
        method: 'POST',
        uri: route('webhooks.stripe'),
        server: ['HTTP_STRIPE_SIGNATURE' => 'wrong', 'CONTENT_TYPE' => 'application/json'],
        content: stripeFixturePayload('cs_test_abc', $invoice->id),
    )->assertStatus(400);

    expect($invoice->fresh()->status)->toBe('sent');
});

it('webhook is idempotent — processing same event twice does not duplicate state', function () {
    $invoice = Invoice::factory()->sent()->create([
        'stripe_checkout_session_id' => 'cs_test_abc',
    ]);

    $payload = stripeFixturePayload('cs_test_abc', $invoice->id);
    $headers = ['HTTP_STRIPE_SIGNATURE' => 'valid', 'CONTENT_TYPE' => 'application/json'];

    $this->call('POST', route('webhooks.stripe'), server: $headers, content: $payload)->assertOk();
    $firstPaidAt = $invoice->fresh()->paid_at;

    $this->call('POST', route('webhooks.stripe'), server: $headers, content: $payload)->assertOk();
    $secondPaidAt = $invoice->fresh()->paid_at;

    expect($firstPaidAt->equalTo($secondPaidAt))->toBeTrue();
    expect($invoice->fresh()->status)->toBe('paid');
});

it('webhook returns 200 when invoice is not found', function () {
    $payload = stripeFixturePayload('cs_test_unknown', 99999);

    $this->call(
        method: 'POST',
        uri: route('webhooks.stripe'),
        server: ['HTTP_STRIPE_SIGNATURE' => 'valid', 'CONTENT_TYPE' => 'application/json'],
        content: $payload,
    )->assertOk();
});

it('webhook ignores unknown event types', function () {
    $invoice = Invoice::factory()->sent()->create([
        'stripe_checkout_session_id' => 'cs_test_abc',
    ]);

    $payload = json_encode([
        'id' => 'evt_test_other',
        'object' => 'event',
        'type' => 'payment_intent.created',
        'data' => ['object' => ['id' => 'pi_xyz', 'object' => 'payment_intent']],
    ]);

    $this->call(
        method: 'POST',
        uri: route('webhooks.stripe'),
        server: ['HTTP_STRIPE_SIGNATURE' => 'valid', 'CONTENT_TYPE' => 'application/json'],
        content: $payload,
    )->assertOk();

    expect($invoice->fresh()->status)->toBe('sent');
});
