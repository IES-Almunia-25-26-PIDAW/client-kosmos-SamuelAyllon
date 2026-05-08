<?php

namespace Tests\Support;

use App\Contracts\PaymentGateway;
use App\Models\Invoice;
use Stripe\Checkout\Session as CheckoutSession;
use Stripe\Event;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Util\Util;

/**
 * In-memory stand-in for StripeGateway used in tests.
 * Avoids real network calls and lets the test assert on captured arguments.
 */
class FakeStripeGateway implements PaymentGateway
{
    public ?Invoice $lastInvoice = null;

    public ?string $lastSuccessUrl = null;

    public ?string $lastCancelUrl = null;

    public string $sessionId = 'cs_test_fake_session';

    public string $sessionUrl = 'https://checkout.stripe.com/pay/cs_test_fake_session';

    public string $expectedSignature = 'valid';

    public string $checkoutSessionPaymentStatus = 'paid';

    public function createCheckoutSession(Invoice $invoice, string $successUrl, string $cancelUrl): CheckoutSession
    {
        $this->lastInvoice = $invoice;
        $this->lastSuccessUrl = $successUrl;
        $this->lastCancelUrl = $cancelUrl;

        return CheckoutSession::constructFrom([
            'id' => $this->sessionId,
            'url' => $this->sessionUrl,
            'object' => 'checkout.session',
        ]);
    }

    public function retrieveCheckoutSession(string $sessionId): CheckoutSession
    {
        return CheckoutSession::constructFrom([
            'id' => $sessionId,
            'object' => 'checkout.session',
            'payment_status' => $this->checkoutSessionPaymentStatus,
        ]);
    }

    public function verifyWebhookSignature(string $payload, string $signature): Event
    {
        if ($signature !== $this->expectedSignature) {
            throw SignatureVerificationException::factory('invalid signature');
        }

        $data = json_decode($payload, true, flags: JSON_THROW_ON_ERROR);

        return Util::convertToStripeObject($data, []);
    }
}
