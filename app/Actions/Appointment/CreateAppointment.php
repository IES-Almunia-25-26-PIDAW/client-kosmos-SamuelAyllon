<?php

namespace App\Actions\Appointment;

use App\Actions\Patient\CreateOrUpdateProfessionalPatient;
use App\DTOs\PatientUpsertData;
use App\Models\Appointment;
use App\Models\OfferedConsultation;
use App\Models\ProfessionalProfile;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CreateAppointment
{
    public function __construct(
        private CreateOrUpdateProfessionalPatient $upsertPatient,
    ) {}

    private function assertNoProfessionalConflict(int $professionalId, CarbonImmutable $startsAt, CarbonImmutable $endsAt): void
    {
        $conflict = Appointment::query()
            ->where('professional_id', $professionalId)
            ->whereNotIn('status', ['cancelled', 'no_show'])
            ->where('starts_at', '<', $endsAt)
            ->where('ends_at', '>', $startsAt)
            ->lockForUpdate()
            ->exists();

        if ($conflict) {
            throw ValidationException::withMessages([
                'starts_at' => 'El profesional ya tiene una cita en ese horario.',
            ]);
        }
    }

    private function assertNoPatientConflict(int $patientId, CarbonImmutable $startsAt, CarbonImmutable $endsAt): void
    {
        $conflict = Appointment::query()
            ->where('patient_id', $patientId)
            ->whereNotIn('status', ['cancelled', 'no_show'])
            ->where('starts_at', '<', $endsAt)
            ->where('ends_at', '>', $startsAt)
            ->lockForUpdate()
            ->exists();

        if ($conflict) {
            throw ValidationException::withMessages([
                'starts_at' => 'Ya tienes una cita reservada en ese horario.',
            ]);
        }
    }

    /**
     * @param  array{professional_id:int,service_id:int,starts_at:string,modality:string,notes?:?string}  $data
     */
    public function __invoke(User $patient, array $data): Appointment
    {
        $professional = User::find($data['professional_id']);

        if (! $professional) {
            throw ValidationException::withMessages([
                'professional_id' => 'Profesional no disponible.',
            ]);
        }

        $workspace = $professional->workspaces()->first();

        if (! $workspace) {
            throw ValidationException::withMessages([
                'professional_id' => 'El profesional no tiene workspace configurado.',
            ]);
        }

        $profile = ProfessionalProfile::where('user_id', $professional->id)->first();

        $service = $profile
            ? OfferedConsultation::query()
                ->where('id', $data['service_id'])
                ->where('professional_profile_id', $profile->id)
                ->where('is_active', true)
                ->first()
            : null;

        if (! $service) {
            throw ValidationException::withMessages([
                'service_id' => 'Servicio no disponible.',
            ]);
        }

        $startsAt = CarbonImmutable::parse($data['starts_at']);
        $endsAt = $startsAt->addMinutes($service->duration_minutes);

        return DB::transaction(function () use ($patient, $professional, $workspace, $service, $data, $startsAt, $endsAt): Appointment {
            $this->assertNoProfessionalConflict($professional->id, $startsAt, $endsAt);
            $this->assertNoPatientConflict($patient->id, $startsAt, $endsAt);

            ($this->upsertPatient)(
                $professional,
                $workspace,
                new PatientUpsertData(
                    name: $patient->name,
                    email: $patient->email,
                    phone: $patient->phone,
                    consultationReason: $data['notes'] ?? null,
                ),
                $patient,
            );

            return Appointment::create([
                'workspace_id' => $workspace->id,
                'patient_id' => $patient->id,
                'professional_id' => $professional->id,
                'service_id' => $service->id,
                'starts_at' => $startsAt,
                'ends_at' => $endsAt,
                'modality' => $data['modality'],
                'status' => 'pending',
                'notes' => $data['notes'] ?? null,
            ]);
        });
    }
}
