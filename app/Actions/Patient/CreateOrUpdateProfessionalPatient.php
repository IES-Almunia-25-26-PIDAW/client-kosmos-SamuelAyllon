<?php

namespace App\Actions\Patient;

use App\DTOs\PatientUpsertData;
use App\Models\CaseAssignment;
use App\Models\PatientProfile;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CreateOrUpdateProfessionalPatient
{
    public function __invoke(
        User $professional,
        ?Workspace $workspace,
        PatientUpsertData $data,
        ?User $patientUser = null,
    ): PatientProfile {
        return DB::transaction(function () use ($professional, $workspace, $data, $patientUser): PatientProfile {
            $patient = $patientUser ?? $this->resolveOrCreateUser($data);

            $this->syncUserAttributes($patient, $data);

            $workspaceId = $workspace?->id;

            $target = null;

            if ($workspaceId !== null) {
                $target = PatientProfile::where('user_id', $patient->id)
                    ->where('workspace_id', $workspaceId)
                    ->first();

                if (! $target) {
                    $target = PatientProfile::where('user_id', $patient->id)
                        ->whereNull('workspace_id')
                        ->first();
                }
            } else {
                $target = PatientProfile::where('user_id', $patient->id)
                    ->whereNull('workspace_id')
                    ->first();
            }

            if (! $target) {
                $target = new PatientProfile([
                    'user_id' => $patient->id,
                ]);
            }

            $target->fill([
                'user_id' => $patient->id,
                'workspace_id' => $workspaceId,
                'professional_id' => $target->professional_id ?? $professional->id,
                'is_active' => true,
                'status' => $target->status ?? 'active',
                'consultation_reason' => $data->consultationReason ?? $target->consultation_reason,
                'therapeutic_approach' => $data->therapeuticApproach ?? $target->therapeutic_approach,
            ])->save();

            CaseAssignment::firstOrCreate(
                [
                    'patient_id' => $patient->id,
                    'professional_id' => $professional->id,
                    'workspace_id' => $workspaceId,
                ],
                [
                    'is_primary' => true,
                    'role' => 'primary',
                    'status' => 'active',
                    'started_at' => now(),
                ],
            );

            return $target->fresh();
        });
    }

    private function resolveOrCreateUser(PatientUpsertData $data): User
    {
        if ($data->email !== null && $data->email !== '') {
            $existing = User::where('email', $data->email)->first();

            if ($existing) {
                return $existing;
            }
        }

        $email = ($data->email !== null && $data->email !== '')
            ? $data->email
            : Str::lower(Str::slug($data->name)).'.'.Str::random(8).'@patients.local';

        $user = User::create([
            'name' => $data->name,
            'email' => $email,
            'phone' => $data->phone,
            'password' => Hash::make(Str::random(32)),
        ]);
        $user->assignRole('patient');

        return $user;
    }

    private function syncUserAttributes(User $user, PatientUpsertData $data): void
    {
        $updates = array_filter([
            'name' => $data->name,
            'phone' => $data->phone,
        ], fn ($v) => $v !== null && $v !== '');

        if ($updates !== []) {
            $user->fill($updates)->save();
        }
    }
}
