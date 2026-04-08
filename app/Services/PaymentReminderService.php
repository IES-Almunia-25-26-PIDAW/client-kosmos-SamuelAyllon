<?php

namespace App\Services;

use App\Models\Payment;

class PaymentReminderService
{
    /**
     * @todo Send payment reminder notifications for all overdue/pending payments
     *       that haven't been reminded recently
     */
    public function sendPendingReminders(): void
    {
        // @todo
    }

    /**
     * @todo Mark a payment as claimed (escalated) and log the action
     */
    public function markAsClaimed(Payment $payment): void
    {
        // @todo
    }
}
