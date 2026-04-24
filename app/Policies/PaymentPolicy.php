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
}
