<?php

namespace App\Policies;

use App\Models\OfferedConsultation;
use App\Models\User;

class OfferedConsultationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isProfessional();
    }

    public function view(User $user, OfferedConsultation $consultation): bool
    {
        return $this->ownsConsultation($user, $consultation);
    }

    public function create(User $user): bool
    {
        return $user->isProfessional() && $user->professionalProfile !== null;
    }

    public function update(User $user, OfferedConsultation $consultation): bool
    {
        return $this->ownsConsultation($user, $consultation);
    }

    public function delete(User $user, OfferedConsultation $consultation): bool
    {
        return $this->ownsConsultation($user, $consultation);
    }

    private function ownsConsultation(User $user, OfferedConsultation $consultation): bool
    {
        return $user->professionalProfile?->id === $consultation->professional_profile_id;
    }
}
