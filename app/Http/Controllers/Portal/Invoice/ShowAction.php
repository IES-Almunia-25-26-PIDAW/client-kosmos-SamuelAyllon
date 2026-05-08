<?php

namespace App\Http\Controllers\Portal\Invoice;

use App\Contracts\PaymentGateway;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Services\BillingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowAction extends Controller
{
    public function __invoke(Request $request, Invoice $invoice, PaymentGateway $gateway, BillingService $billing): Response
    {
        abort_if($invoice->patient_id !== $request->user()->id, 403);

        if (
            $request->query('checkout') === 'success'
            && $invoice->status !== 'paid'
            && $invoice->stripe_checkout_session_id !== null
        ) {
            $session = $gateway->retrieveCheckoutSession($invoice->stripe_checkout_session_id);

            if ($session->payment_status === 'paid') {
                $billing->markAsPaid($invoice, 'stripe');
            }
        }

        $invoice->load(['items', 'workspace']);

        return Inertia::render('patient/invoices/show', [
            'invoice' => $invoice,
        ]);
    }
}
