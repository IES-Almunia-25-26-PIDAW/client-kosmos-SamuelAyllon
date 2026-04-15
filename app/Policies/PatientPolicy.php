<?php

namespace App\Policies;

use App\Models\CaseAssignment;
use App\Models\CollaborationAgreement;
use App\Models\PatientProfile;
use App\Models\User;

class PatientPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'professional']);
    }

    public function view(User $user, PatientProfile $patient): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->id === $patient->user_id) {
            return true;
        }

        return CaseAssignment::where('patient_id', $patient->user_id)
            ->where('professional_id', $user->id)
            ->where('status', 'active')
            ->exists();
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'professional']);
    }

    public function update(User $user, PatientProfile $patient): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return CaseAssignment::where('patient_id', $patient->user_id)
            ->where('professional_id', $user->id)
            ->where('status', 'active')
            ->exists();
    }

    public function delete(User $user, PatientProfile $patient): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return CaseAssignment::where('patient_id', $patient->user_id)
            ->where('professional_id', $user->id)
            ->where('is_primary', true)
            ->where('status', 'active')
            ->exists();
    }
}
