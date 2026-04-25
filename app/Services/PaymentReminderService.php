<?php

namespace App\Services;

use App\Models\Invoice;
use App\Notifications\InvoiceOverdueNotification;
use Illuminate\Support\Facades\Log;

class PaymentReminderService
{
    /**
     * Send payment reminder notifications for all overdue invoices.
     */
    public function sendPendingReminders(): void
    {
        Invoice::where('status', 'overdue')
            ->where('due_at', '<', now())
            ->with('professional')
            ->each(function (Invoice $invoice): void {
                $invoice->professional->notify(new InvoiceOverdueNotification($invoice));

                Log::info('Payment reminder sent', [
                    'invoice_id' => $invoice->id,
                    'invoice_number' => $invoice->invoice_number,
                    'professional_id' => $invoice->professional_id,
                ]);
            });
    }

    /**
     * Mark an invoice as claimed (escalated) and log the action.
     */
    public function markAsClaimed(Invoice $invoice): void
    {
        Log::warning('Invoice escalated/claimed', [
            'invoice_id' => $invoice->id,
            'invoice_number' => $invoice->invoice_number,
            'due_at' => $invoice->due_at,
            'total' => $invoice->total,
        ]);
    }
}
