<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class BillingService
{
    /**
     * Sequential invoice number: FAC-{YEAR}-{NNNNN}.
     * Uses a transaction with lockForUpdate to prevent duplicates under concurrency.
     */
    public function generateSequentialInvoiceNumber(int $year): string
    {
        return DB::transaction(function () use ($year) {
            $prefix = "FAC-{$year}-";

            $last = Invoice::where('invoice_number', 'like', $prefix.'%')
                ->lockForUpdate()
                ->orderByDesc('invoice_number')
                ->value('invoice_number');

            $next = $last === null ? 1 : ((int) substr($last, strlen($prefix)) + 1);

            return $prefix.str_pad((string) $next, 5, '0', STR_PAD_LEFT);
        });
    }

    /**
     * @deprecated Use generateSequentialInvoiceNumber() — AEAT requires sequential numbering.
     */
    public function generateInvoiceNumber(User $user): string
    {
        return $this->generateSequentialInvoiceNumber(now()->year);
    }

    /**
     * Generate a PDF for the invoice and store it in the private disk.
     * Sets invoice->pdf_path after storing.
     */
    public function generatePdf(Invoice $invoice): void
    {
        $invoice->loadMissing(['professional', 'patient', 'items', 'workspace']);

        $pdf = Pdf::loadView('invoices.pdf', ['invoice' => $invoice])
            ->setPaper('a4', 'portrait')
            ->setOption('defaultFont', 'dejavu sans');

        $path = "invoices/{$invoice->id}.pdf";

        Storage::disk('private')->put($path, $pdf->output());

        $invoice->update(['pdf_path' => $path]);
    }

    /**
     * Mark an invoice as paid, recording the payment method and timestamp.
     */
    public function markAsPaid(Invoice $invoice, string $method): void
    {
        $allowed = ['cash', 'transfer', 'card', 'bizum', 'stripe', 'other'];

        if (! in_array($method, $allowed, strict: true)) {
            throw new \InvalidArgumentException("Payment method '{$method}' is not valid.");
        }

        $invoice->update([
            'status' => 'paid',
            'paid_at' => now(),
            'payment_method' => $method,
        ]);
    }
}
