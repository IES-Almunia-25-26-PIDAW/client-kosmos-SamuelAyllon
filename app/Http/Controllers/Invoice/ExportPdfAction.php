<?php

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Services\BillingService;
use Illuminate\Http\RedirectResponse;

class ExportPdfAction extends Controller
{
    public function __invoke(Invoice $invoice, BillingService $billing): RedirectResponse
    {
        $this->authorize('view', $invoice);

        // @todo Return StreamedResponse with generated PDF
        $billing->generatePdf($invoice);

        return back()->with('success', 'PDF generado.');
    }
}
