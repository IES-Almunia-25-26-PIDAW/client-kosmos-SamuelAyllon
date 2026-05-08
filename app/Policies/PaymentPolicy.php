<?php

namespace App\Policies;

use App\Models\Invoice;
use App\Models\User;

class PaymentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isProfessional();
    }

    public function view(User $user, Invoice $invoice): bool
    {
        return $user->id === $invoice->professional_id;
    }

    public function create(User $user): bool
    {
        return $user->isProfessional();
    }

    public function update(User $user, Invoice $invoice): bool
    {
        return $user->id === $invoice->professional_id;
    }

    public function delete(User $user, Invoice $invoice): bool
    {
        return $user->id === $invoice->professional_id;
    }

    /**
     * Authorize creating a Stripe Checkout session for the invoice.
     * Either the issuing professional or the billed patient may trigger payment,
     * and only while the invoice is in `sent` status.
     */
    public function pay(User $user, Invoice $invoice): bool
    {
        $isIssuer = $user->id === $invoice->professional_id;
        $isPayer = $user->id === $invoice->patient_id;

        return ($isIssuer || $isPayer) && $invoice->status === 'sent';
    }
}
