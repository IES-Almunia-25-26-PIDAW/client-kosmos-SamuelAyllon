<?php

namespace App\Models;

/**
 * @deprecated Use PatientProfile instead.
 */
class Patient extends PatientProfile
{
    protected $table = 'patient_profiles';
}
