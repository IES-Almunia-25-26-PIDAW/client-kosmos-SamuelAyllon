<?php

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use App\Jobs\SendInvoiceEmailJob;
use App\Models\Invoice;
use App\Services\BillingService;
use Illuminate\Http\RedirectResponse;

class SendAction extends Controller
{
    public function __invoke(Invoice $invoice, BillingService $billing): RedirectResponse
    {
        $this->authorize('update', $invoice);

        if ($invoice->pdf_path === null) {
            $billing->generatePdf($invoice);
        }

        $invoice->update(['status' => 'sent']);

        SendInvoiceEmailJob::dispatch($invoice->id);

        return back()->with('success', 'Factura enviada al paciente.');
    }
}
