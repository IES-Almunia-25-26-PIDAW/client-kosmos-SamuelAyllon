<?php

namespace App\Observers;

use App\Models\PatientProfile;

class PatientObserver
{
    public function saved(PatientProfile $patient): void
    {
        // When a patient is discharged, close all active primary case assignments.
        if ($patient->wasChanged('status') && $patient->status === 'discharged') {
            $patient->caseAssignments()
                ->where('status', 'active')
                ->where('is_primary', true)
                ->update([
                    'status' => 'ended',
                    'ended_at' => now()->toDateString(),
                ]);
        }
    }
}
