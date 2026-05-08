<?php

namespace App\Http\Controllers\Invoice;

use App\Contracts\PaymentGateway;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Symfony\Component\HttpFoundation\Response;

class CreateCheckoutAction extends Controller
{
    public function __invoke(Invoice $invoice, PaymentGateway $gateway): Response|RedirectResponse|InertiaResponse
    {
        $this->authorize('pay', $invoice);

        [$successUrl, $cancelUrl] = $this->resolveReturnUrls($invoice);

        $session = $gateway->createCheckoutSession(
            $invoice,
            successUrl: $successUrl,
            cancelUrl: $cancelUrl,
        );

        $invoice->update(['stripe_checkout_session_id' => $session->id]);

        return Inertia::location($session->url);
    }

    /**
     * Resolve success/cancel URLs based on whether the payer is the patient or the issuing professional.
     *
     * @return array{0: string, 1: string}
     */
    private function resolveReturnUrls(Invoice $invoice): array
    {
        $userId = Auth::id();

        if ($userId === $invoice->patient_id) {
            $base = route('patient.invoices.show', $invoice);
        } else {
            $base = route('professional.invoices.review', $invoice);
        }

        return [
            $base.'?checkout=success',
            $base.'?checkout=cancel',
        ];
    }
}
