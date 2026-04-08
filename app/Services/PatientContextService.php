<?php

namespace App\Services;

use App\Models\Patient;

class PatientContextService
{
    /**
     * @todo Return context data for the pre-session view.
     *       Eager-loads: last 3 sessions, recent notes, open agreements,
     *       last payment, and current valid consent.
     */
    public function getPreSessionContext(Patient $patient): array
    {
        // @todo
        return [];
    }
}
