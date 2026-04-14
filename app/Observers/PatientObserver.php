<?php

namespace App\Observers;

use App\Models\PatientProfile;

class PatientObserver
{
    public function saved(PatientProfile $patient): void
    {
        // has_valid_consent and has_open_agreement were removed from patient_profiles in v2.
        // These values are now computed dynamically from queries.
    }
}
