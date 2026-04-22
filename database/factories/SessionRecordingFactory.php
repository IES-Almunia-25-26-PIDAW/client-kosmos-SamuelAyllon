<?php

namespace Database\Factories;

use App\Models\Appointment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SessionRecording>
 */
class SessionRecordingFactory extends Factory
{
    public function definition(): array
    {
        return [
            'appointment_id' => Appointment::factory(),
            'audio_path' => null,
            'transcription' => null,
            'ai_summary' => null,
            'transcription_status' => 'pending',
            'language' => 'es',
            'duration_seconds' => null,
        ];
    }

    public function withPatientConsent(): static
    {
        return $this->state(['patient_consent_given_at' => now()]);
    }
}
