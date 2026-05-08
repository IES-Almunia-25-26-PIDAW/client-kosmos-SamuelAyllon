<?php

namespace App\Observers;

use App\Models\Invoice;
use App\Notifications\InvoicePaidNotification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PaymentObserver
{
    public function saved(Invoice $invoice): void
    {
        if (! $invoice->wasChanged('status')) {
            return;
        }

        if ($invoice->status === 'paid') {
            if ($invoice->paid_at === null) {
                $invoice->withoutEvents(fn () => $invoice->update(['paid_at' => now()]));
            }

            // Only act on the transition to paid, not on subsequent saves.
            if ($invoice->getOriginal('status') !== 'paid') {
                $this->invalidatePdfCache($invoice);
                $this->notifyPaidParties($invoice);
            }
        }

        if ($invoice->status === 'overdue') {
            Log::info('Invoice marked as overdue', [
                'invoice_id' => $invoice->id,
                'invoice_number' => $invoice->invoice_number,
                'due_at' => $invoice->due_at,
            ]);
        }
    }

    private function invalidatePdfCache(Invoice $invoice): void
    {
        if ($invoice->pdf_path === null) {
            return;
        }

        Storage::disk('private')->delete($invoice->pdf_path);
        $invoice->withoutEvents(fn () => $invoice->update(['pdf_path' => null]));
    }

    private function notifyPaidParties(Invoice $invoice): void
    {
        $notification = new InvoicePaidNotification($invoice);

        $invoice->patient?->notify($notification);
        $invoice->professional?->notify($notification);
    }
}
