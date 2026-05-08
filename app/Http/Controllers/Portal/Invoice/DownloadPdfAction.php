<?php

namespace App\Http\Controllers\Portal\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Services\BillingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DownloadPdfAction extends Controller
{
    public function __invoke(Request $request, Invoice $invoice, BillingService $billing): StreamedResponse
    {
        abort_if($invoice->patient_id !== $request->user()->id, 403);

        if ($invoice->pdf_path === null || ! Storage::disk('private')->exists($invoice->pdf_path)) {
            $billing->generatePdf($invoice);
            $invoice->refresh();
        }

        return Storage::disk('private')->download(
            $invoice->pdf_path,
            "factura-{$invoice->invoice_number}.pdf",
            ['Content-Type' => 'application/pdf'],
        );
    }
}
