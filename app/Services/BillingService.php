<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\User;

class BillingService
{
    /**
     * @todo Generate a unique invoice number for the user based on prefix and counter
     */
    public function generateInvoiceNumber(User $user): string
    {
        // @todo
        return '';
    }

    /**
     * @todo Generate a PDF invoice for the given payment and store it
     */
    public function createInvoiceForPayment(Payment $payment): void
    {
        // @todo
    }

    /**
     * @todo Mark a payment as paid, set paid_at and generate invoice if needed
     */
    public function markAsPaid(Payment $payment, string $method): void
    {
        // @todo
    }
}
