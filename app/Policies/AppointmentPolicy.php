<?php

namespace App\Policies;

use App\Models\Appointment;
use App\Models\User;

class AppointmentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isProfessional();
    }

    public function view(User $user, Appointment $appointment): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->id === $appointment->professional_id
            || $user->id === $appointment->patient_id;
    }

    public function update(User $user, Appointment $appointment): bool
    {
        return $user->isAdmin() || $user->id === $appointment->professional_id;
    }

    public function delete(User $user, Appointment $appointment): bool
    {
        return $user->isAdmin() || $user->id === $appointment->professional_id;
    }
}
