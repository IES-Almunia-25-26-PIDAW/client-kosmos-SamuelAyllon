<?php

namespace App\Actions\Patient;

use App\Models\CaseAssignment;
use App\Models\PatientDelegation;
use App\Models\PatientProfile;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DelegatePatientToProfessional
{
    public function __invoke(
        PatientProfile $profile,
        User $fromProfessional,
        User $toProfessional,
        ?string $reason = null,
    ): PatientDelegation {
        if ($fromProfessional->id === $toProfessional->id) {
            throw ValidationException::withMessages([
                'to_professional_id' => 'No puedes delegar el paciente a ti mismo.',
            ]);
        }

        return DB::transaction(function () use ($profile, $fromProfessional, $toProfessional, $reason): PatientDelegation {
            $delegation = PatientDelegation::create([
                'patient_profile_id' => $profile->id,
                'from_professional_id' => $fromProfessional->id,
                'to_professional_id' => $toProfessional->id,
                'workspace_id' => $profile->workspace_id,
                'reason' => $reason,
                'delegated_at' => now(),
            ]);

            $profile->update(['professional_id' => $toProfessional->id]);

            CaseAssignment::where('patient_id', $profile->user_id)
                ->where('professional_id', $fromProfessional->id)
                ->where('workspace_id', $profile->workspace_id)
                ->where('status', 'active')
                ->update(['status' => 'ended', 'ended_at' => now()]);

            CaseAssignment::firstOrCreate(
                [
                    'patient_id' => $profile->user_id,
                    'professional_id' => $toProfessional->id,
                    'workspace_id' => $profile->workspace_id,
                ],
                [
                    'is_primary' => true,
                    'role' => 'primary',
                    'status' => 'active',
                    'started_at' => now(),
                ],
            );

            return $delegation;
        });
    }
}
