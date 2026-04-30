<?php

namespace App\Services\Payments;

use App\Contracts\PaymentGateway;
use App\Models\Invoice;
use Stripe\Checkout\Session as CheckoutSession;
use Stripe\Event;
use Stripe\StripeClient;
use Stripe\Webhook;

class StripeGateway implements PaymentGateway
{
    private StripeClient $client;

    public function __construct(
        private readonly string $secret,
        private readonly string $webhookSecret,
    ) {
        $this->client = new StripeClient($this->secret);
    }

    /**
     * Create a Stripe Checkout Session for the given invoice and return its URL.
     */
    public function createCheckoutSession(Invoice $invoice, string $successUrl, string $cancelUrl): CheckoutSession
    {
        $amountCents = (int) round(((float) $invoice->total) * 100);

        return $this->client->checkout->sessions->create([
            'mode' => 'payment',
            'success_url' => $successUrl,
            'cancel_url' => $cancelUrl,
            'client_reference_id' => (string) $invoice->id,
            'line_items' => [[
                'quantity' => 1,
                'price_data' => [
                    'currency' => strtolower($invoice->currency ?? 'eur'),
                    'unit_amount' => $amountCents,
                    'product_data' => [
                        'name' => $invoice->invoice_number,
                    ],
                ],
            ]],
            'metadata' => [
                'invoice_id' => (string) $invoice->id,
            ],
        ]);
    }

    /**
     * Verify the Stripe webhook signature and return the parsed event.
     *
     * @throws \Stripe\Exception\SignatureVerificationException
     */
    public function verifyWebhookSignature(string $payload, string $signature): Event
    {
        return Webhook::constructEvent($payload, $signature, $this->webhookSecret);
    }
}
