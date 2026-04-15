<?php

namespace App\Services;

use App\Models\PatientProfile;

class PatientContextService
{
    /**
     * @todo Return context data for the pre-session view.
     *       Eager-loads: last 3 sessions, recent notes, open agreements,
     *       last payment, and current valid consent.
     */
    public function getPreSessionContext(PatientProfile $patient): array
    {
        // @todo
        return [];
    }
}
