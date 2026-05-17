<?php

namespace App\Http\Controllers\Admin\Debug;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\OfferedConsultation;
use App\Models\PatientProfile;
use App\Models\ProfessionalProfile;
use App\Models\User;
use App\Models\Workspace;
use App\Services\GoogleCalendarService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

/**
 * Endpoint de debug solo para admin: crea una cita confirmada AHORA entre dos
 * usuarios identificados por email. Útil para testear el flujo de videollamada
 * en producción sin tener que pasar por el booking real.
 *
 * Uso (logueado como admin):
 *   GET /admin/debug/create-test-appointment
 *     ?professional=samuelayllonsevilla86@gmail.com
 *     &patient=ayllonsevillasamuel62@gmail.com
 *
 * Si los emails se pasan al revés, se intercambian automáticamente según el rol.
 */
class CreateTestAppointmentAction extends Controller
{
    public function __invoke(Request $request, GoogleCalendarService $google): JsonResponse
    {
        $email1 = (string) $request->query('professional', 'samuelayllonsevilla86@gmail.com');
        $email2 = (string) $request->query('patient', 'ayllonsevillasamuel62@gmail.com');

        $user1 = User::where('email', $email1)->first();
        $user2 = User::where('email', $email2)->first();

        if (! $user1 || ! $user2) {
            return response()->json([
                'error' => 'Uno o ambos usuarios no existen.',
                'lookups' => [$email1 => (bool) $user1, $email2 => (bool) $user2],
            ], 404);
        }

        // Determinar quién es profesional y quién paciente por rol asignado.
        $professional = $user1->hasRole('professional') ? $user1 : ($user2->hasRole('professional') ? $user2 : null);
        $patient = $professional?->id === $user1->id ? $user2 : $user1;

        if ($professional === null) {
            return response()->json([
                'error' => 'Ninguno de los dos usuarios tiene rol professional.',
                'roles' => [
                    $email1 => $user1->roles->pluck('name')->all(),
                    $email2 => $user2->roles->pluck('name')->all(),
                ],
            ], 422);
        }

        $cleanup = $request->boolean('cleanup');
        $deletedZombieIds = [];

        $appointment = DB::transaction(function () use ($professional, $patient): Appointment {
            // Workspace: usamos el primero del profesional, o creamos uno mínimo.
            $workspace = $professional->workspaces()->first()
                ?? $professional->createdWorkspaces()->first()
                ?? Workspace::create([
                    'name' => $professional->name."'s workspace",
                    'slug' => Str::slug($professional->name.'-'.Str::random(6)),
                    'creator_id' => $professional->id,
                    'type' => 'personal',
                ]);
            if (! $professional->workspaces()->where('workspaces.id', $workspace->id)->exists()) {
                $professional->workspaces()->attach($workspace->id, [
                    'role' => 'owner',
                    'joined_at' => now(),
                    'is_active' => true,
                ]);
            }

            // ProfessionalProfile + OfferedConsultation mínimos (idempotente).
            $profile = ProfessionalProfile::firstOrCreate(
                ['user_id' => $professional->id],
                ['verification_status' => 'verified', 'verified_at' => now()],
            );

            $service = OfferedConsultation::firstOrCreate(
                [
                    'professional_profile_id' => $profile->id,
                    'name' => 'Sesión de prueba (debug)',
                ],
                [
                    'duration_minutes' => 60,
                    'price' => 0,
                    'modality' => 'video_call',
                    'is_active' => true,
                ],
            );

            // PatientProfile que vincula al paciente con este profesional.
            PatientProfile::firstOrCreate(
                [
                    'user_id' => $patient->id,
                    'professional_id' => $professional->id,
                ],
                [
                    'workspace_id' => $workspace->id,
                ],
            );

            // Reutilizar una cita de prueba existente entre estos dos users
            // si la hay (evita acumular zombis al llamar al endpoint varias veces).
            // La marcamos siempre con la nota distintiva para identificarla.
            $existing = Appointment::query()
                ->where('professional_id', $professional->id)
                ->where('patient_id', $patient->id)
                ->where('notes', 'like', '%create-test-appointment%')
                ->orderByDesc('id')
                ->first();

            if ($existing !== null) {
                // Refrescar ventana, estado y room_id si faltase. Mantiene el
                // meeting_url existente si ya estaba creado en Google Calendar.
                $existing->update([
                    'workspace_id' => $workspace->id,
                    'service_id' => $service->id,
                    'starts_at' => now()->subMinute(),
                    'ends_at' => now()->addHour(),
                    'modality' => 'video_call',
                    'status' => 'confirmed',
                    'confirmed_at' => now(),
                    'meeting_room_id' => $existing->meeting_room_id ?? (string) Str::uuid(),
                    'professional_joined_at' => null,
                    'patient_joined_at' => null,
                ]);

                return $existing->fresh();
            }

            return Appointment::create([
                'workspace_id' => $workspace->id,
                'patient_id' => $patient->id,
                'professional_id' => $professional->id,
                'service_id' => $service->id,
                'starts_at' => now()->subMinute(),
                'ends_at' => now()->addHour(),
                'modality' => 'video_call',
                'status' => 'confirmed',
                'confirmed_at' => now(),
                'meeting_room_id' => (string) Str::uuid(),
                'notes' => 'Cita de prueba generada por /admin/debug/create-test-appointment',
            ]);
        });

        // Cleanup opcional: borrar (forceDelete, no soft-delete) las citas test
        // previas entre este par de users excepto la que acabamos de reutilizar.
        // Útil para limpiar zombis acumulados en pruebas anteriores.
        if ($cleanup) {
            $deletedZombieIds = Appointment::withTrashed()
                ->where('professional_id', $professional->id)
                ->where('patient_id', $patient->id)
                ->where('notes', 'like', '%create-test-appointment%')
                ->where('id', '!=', $appointment->id)
                ->pluck('id')
                ->all();

            if ($deletedZombieIds !== []) {
                Appointment::withTrashed()
                    ->whereIn('id', $deletedZombieIds)
                    ->forceDelete();
            }
        }

        // Crear evento Google Meet si el profesional tiene Calendar vinculado.
        // Si la cita reutilizada ya tenía meeting_url, no creamos otro evento
        // (evita duplicar entradas en Google Calendar al llamar al endpoint
        // muchas veces). Sin Calendar vinculado, meeting_url queda en null.
        $meetWarning = null;
        if ($appointment->meeting_url !== null) {
            $meetWarning = 'Reutilizando meeting_url existente — no se ha creado un nuevo evento en Google Calendar.';
        } elseif ($professional->google_refresh_token === null) {
            $meetWarning = 'El profesional NO tiene Google Calendar vinculado: el meeting_url queda vacío. Loguéate como él y conecta Google Calendar en Settings antes de probar la videollamada.';
        } else {
            try {
                $meet = $google->createMeetEvent($appointment);
                $appointment->update([
                    'meeting_url' => $meet['meet_url'],
                    'external_calendar_event_id' => $meet['event_id'],
                ]);
            } catch (Throwable $e) {
                Log::warning('CreateTestAppointment: createMeetEvent failed', [
                    'appointment_id' => $appointment->id,
                    'error' => $e->getMessage(),
                ]);
                $meetWarning = 'Fallo al crear evento Meet: '.$e->getMessage();
            }
        }

        return response()->json(array_filter([
            'appointment_id' => $appointment->id,
            'starts_at' => $appointment->starts_at->toIso8601String(),
            'ends_at' => $appointment->ends_at->toIso8601String(),
            'status' => $appointment->status,
            'professional' => $professional->only(['id', 'email', 'name']),
            'patient' => $patient->only(['id', 'email', 'name']),
            'join_urls' => [
                'professional' => route('professional.appointments.show', $appointment),
                'patient' => route('patient.appointments.show', $appointment),
            ],
            'meeting_room_id' => $appointment->meeting_room_id,
            'meeting_url' => $appointment->fresh()->meeting_url,
            'meet_warning' => $meetWarning,
            'cleaned_up_zombie_ids' => $cleanup ? $deletedZombieIds : null,
        ]));
    }
}
