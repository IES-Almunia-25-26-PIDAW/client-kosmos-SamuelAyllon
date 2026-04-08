<?php

namespace App\Policies;

use App\Models\User;

class AdminPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function impersonate(User $admin, User $target): bool
    {
        return $admin->isAdmin() && $target->isProfessional();
    }

    public function updateRole(User $admin, User $target): bool
    {
        return $admin->isAdmin() && $admin->id !== $target->id;
    }
}
