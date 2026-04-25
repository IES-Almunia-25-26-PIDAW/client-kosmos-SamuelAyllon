<?php

namespace App\Jobs;

use App\Mail\InvoiceIssuedMail;
use App\Models\Invoice;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendInvoiceEmailJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $backoff = 30;

    public function __construct(
        public int $invoiceId,
    ) {}

    public function handle(): void
    {
        $invoice = Invoice::with(['patient', 'professional', 'items'])->find($this->invoiceId);

        if ($invoice === null) {
            Log::warning('SendInvoiceEmailJob: invoice not found', ['id' => $this->invoiceId]);

            return;
        }

        $patientEmail = $invoice->patient?->email;

        if ($patientEmail === null) {
            Log::warning('SendInvoiceEmailJob: patient has no email', ['invoice_id' => $this->invoiceId]);

            return;
        }

        Mail::to($patientEmail)->send(new InvoiceIssuedMail($invoice));
    }
}
