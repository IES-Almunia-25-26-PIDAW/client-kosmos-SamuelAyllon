<?php

namespace App\Services;

use App\Models\ConsentForm;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Support\Collection;

class RgpdService
{
    /**
     * @todo Check if the patient has a valid (signed, non-expired) consent form
     */
    public function hasValidConsent(Patient $patient): bool
    {
        // @todo
        return false;
    }

    /**
     * @todo Return consent forms expiring within $daysAhead days for the user
     */
    public function getExpiringConsents(User $user, int $daysAhead = 30): Collection
    {
        // @todo
        return collect();
    }

    /**
     * @todo Revoke a signed consent form and update patient has_valid_consent flag
     */
    public function revokeConsent(ConsentForm $form): void
    {
        // @todo
    }
}
