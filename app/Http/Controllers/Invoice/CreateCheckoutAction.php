<?php

namespace App\Http\Controllers\Invoice;

use App\Contracts\PaymentGateway;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Symfony\Component\HttpFoundation\Response;

class CreateCheckoutAction extends Controller
{
    public function __invoke(Invoice $invoice, PaymentGateway $gateway): Response|RedirectResponse|InertiaResponse
    {
        $this->authorize('pay', $invoice);

        $session = $gateway->createCheckoutSession(
            $invoice,
            successUrl: route('professional.invoices.review', $invoice).'?checkout=success',
            cancelUrl: route('professional.invoices.review', $invoice).'?checkout=cancel',
        );

        $invoice->update(['stripe_checkout_session_id' => $session->id]);

        return Inertia::location($session->url);
    }
}
