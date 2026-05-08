<?php

namespace App\Jobs;

use App\Models\Appointment;
use App\Services\KosmoService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class GeneratePreSessionBriefing implements ShouldQueue
{
    use Queueable;

    public function handle(KosmoService $kosmo): void
    {
        $upcoming = Appointment::query()
            ->whereIn('status', ['pending', 'confirmed'])
            ->whereBetween('starts_at', [now(), now()->addMinutes(30)])
            ->whereDoesntHave('kosmoBriefings', fn ($q) => $q->where('type', 'pre_session'))
            ->with('service')
            ->get();

        foreach ($upcoming as $appointment) {
            $patient = \App\Models\PatientProfile::where('user_id', $appointment->patient_id)->first();

            if (! $patient) {
                continue;
            }

            try {
                $kosmo->generatePreSessionBriefing($patient, $appointment);
            } catch (\Throwable $e) {
                Log::error('GeneratePreSessionBriefing failed', [
                    'appointment_id' => $appointment->id,
                    'message' => $e->getMessage(),
                ]);
            }
        }
    }
}
