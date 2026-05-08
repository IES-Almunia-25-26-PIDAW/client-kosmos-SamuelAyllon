<?php

use App\Events\TranscriptionSegmentCreated;
use App\Listeners\AggregateTranscription;
use App\Models\Appointment;
use App\Models\SessionRecording;
use App\Models\TranscriptionSegment;

it('aggregates transcription segments ordered by started_at_ms into the recording transcription', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    $recording = SessionRecording::factory()->create(['appointment_id' => $appointment->id]);

    TranscriptionSegment::factory()->create([
        'session_recording_id' => $recording->id,
        'speaker_user_id' => $professional->id,
        'position' => 2,
        'started_at_ms' => 16000,
        'ended_at_ms' => 24000,
        'text' => 'tercera parte',
    ]);
    TranscriptionSegment::factory()->create([
        'session_recording_id' => $recording->id,
        'speaker_user_id' => $patient->id,
        'position' => 0,
        'started_at_ms' => 0,
        'ended_at_ms' => 8000,
        'text' => 'primera parte',
    ]);
    $latest = TranscriptionSegment::factory()->create([
        'session_recording_id' => $recording->id,
        'speaker_user_id' => $professional->id,
        'position' => 1,
        'started_at_ms' => 8000,
        'ended_at_ms' => 16000,
        'text' => 'segunda parte',
    ]);

    (new AggregateTranscription)->handle(
        TranscriptionSegmentCreated::fromSegment($latest, $appointment->id),
    );

    $aggregated = $recording->fresh()->transcription;

    expect($aggregated)->toBe("primera parte\nsegunda parte\ntercera parte");
});
