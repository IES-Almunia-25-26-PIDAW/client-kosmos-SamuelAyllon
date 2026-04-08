<?php

namespace App\Observers;

use App\Models\Payment;

class PaymentObserver
{
    public function saved(Payment $payment): void
    {
        $latestStatus = $payment->patient
            ->payments()
            ->orderByDesc('due_date')
            ->value('status') ?? 'paid';

        $payment->patient->updateQuietly(['payment_status' => $latestStatus]);
    }
}
