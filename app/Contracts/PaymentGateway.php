<?php

namespace App\Contracts;

use App\Models\Invoice;
use Stripe\Checkout\Session as CheckoutSession;
use Stripe\Event;

interface PaymentGateway
{
    public function createCheckoutSession(Invoice $invoice, string $successUrl, string $cancelUrl): CheckoutSession;

    public function retrieveCheckoutSession(string $sessionId): CheckoutSession;

    public function verifyWebhookSignature(string $payload, string $signature): Event;
}
