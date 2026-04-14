<?php

namespace App\Observers;

use App\Models\Payment;

class PaymentObserver
{
    public function saved(Payment $payment): void
    {
        // payment_status was removed from patient_profiles in v2.
        // Payment status is now computed dynamically from queries.
    }
}
