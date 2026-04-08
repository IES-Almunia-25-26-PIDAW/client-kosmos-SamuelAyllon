<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendPaymentReminder implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        // @todo Send payment reminders for overdue/pending payments
    }
}
