<?php

namespace App\Http\Controllers\Webhook;

use App\Contracts\PaymentGateway;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Services\BillingService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\SignatureVerificationException;

class StripeWebhookAction extends Controller
{
    public function __invoke(Request $request, PaymentGateway $gateway, BillingService $billing): Response
    {
        $payload = $request->getContent();
        $signature = (string) $request->header('Stripe-Signature', '');

        try {
            $event = $gateway->verifyWebhookSignature($payload, $signature);
        } catch (SignatureVerificationException) {
            return response('invalid signature', 400);
        }

        if ($event->type === 'checkout.session.completed') {
            /** @var \Stripe\Checkout\Session $session */
            $session = $event->data->object;

            $invoice = Invoice::where('stripe_checkout_session_id', $session->id)->first();

            if ($invoice === null) {
                Log::warning('Stripe webhook: invoice not found', ['session_id' => $session->id]);

                return response('ok', 200);
            }

            if ($invoice->status !== 'paid') {
                $billing->markAsPaid($invoice, 'stripe');
            }

            $paymentIntent = $session->payment_intent;
            if (is_string($paymentIntent) && $paymentIntent !== '') {
                $invoice->update(['stripe_payment_id' => $paymentIntent]);
            }
        }

        return response('ok', 200);
    }
}
