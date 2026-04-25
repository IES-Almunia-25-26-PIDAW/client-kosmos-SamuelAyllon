<?php

namespace App\Observers;

use App\Models\Invoice;
use Illuminate\Support\Facades\Log;

class PaymentObserver
{
    public function saved(Invoice $invoice): void
    {
        if (! $invoice->wasChanged('status')) {
            return;
        }

        if ($invoice->status === 'paid' && $invoice->paid_at === null) {
            $invoice->withoutEvents(fn () => $invoice->update(['paid_at' => now()]));
        }

        if ($invoice->status === 'overdue') {
            Log::info('Invoice marked as overdue', [
                'invoice_id' => $invoice->id,
                'invoice_number' => $invoice->invoice_number,
                'due_at' => $invoice->due_at,
            ]);
        }
    }
}
