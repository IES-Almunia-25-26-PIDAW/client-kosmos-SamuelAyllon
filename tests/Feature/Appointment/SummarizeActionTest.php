<?php

use App\Jobs\SummarizeSessionJob;
use App\Models\Appointment;
use App\Models\SessionRecording;
use Illuminate\Support\Facades\Queue;

it('returns 409 when there is no recording yet', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    $this->actingAs($professional)
        ->postJson(route('professional.appointments.summarize', $appointment))
        ->assertStatus(409)
        ->assertJson(['error' => 'transcription_pending']);
});

it('returns 409 when transcription is empty', function () {
    Queue::fake();

    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    SessionRecording::factory()->create([
        'appointment_id' => $appointment->id,
        'transcription' => null,
    ]);

    $this->actingAs($professional)
        ->postJson(route('professional.appointments.summarize', $appointment))
        ->assertStatus(409);

    Queue::assertNotPushed(SummarizeSessionJob::class);
});

it('queues SummarizeSessionJob when transcription is ready', function () {
    Queue::fake();

    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    $recording = SessionRecording::factory()->create([
        'appointment_id' => $appointment->id,
        'transcription' => 'Sesión completa con texto suficiente para resumir.',
    ]);

    $this->actingAs($professional)
        ->postJson(route('professional.appointments.summarize', $appointment))
        ->assertOk()
        ->assertJson(['status' => 'queued', 'recording_id' => $recording->id]);

    Queue::assertPushed(SummarizeSessionJob::class, fn ($job) => $job->sessionRecordingId === $recording->id);
});
