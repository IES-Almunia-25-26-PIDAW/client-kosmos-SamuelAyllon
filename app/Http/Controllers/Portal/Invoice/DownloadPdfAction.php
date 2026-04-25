<?php

namespace App\Http\Controllers\Portal\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Services\BillingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DownloadPdfAction extends Controller
{
    public function __invoke(Request $request, Invoice $invoice, BillingService $billing): RedirectResponse
    {
        abort_if($invoice->patient_id !== $request->user()->id, 403);

        // @todo Return StreamedResponse with PDF when BillingService::generatePdf is implemented
        $billing->generatePdf($invoice);

        return back()->with('success', 'PDF generado.');
    }
}
