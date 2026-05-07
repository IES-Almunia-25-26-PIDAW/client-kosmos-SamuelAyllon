<?php

use App\Jobs\SummarizeSessionJob;
use App\Models\Appointment;
use App\Models\SessionRecording;
use Illuminate\Support\Facades\Queue;

it('end-call dispatches SummarizeSessionJob with delay even if transcription is empty', function () {
    Queue::fake();

    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'status' => 'in_progress',
        'workspace_id' => null,
    ]);

    SessionRecording::factory()->create([
        'appointment_id' => $appointment->id,
        'transcription' => null,
    ]);

    $this->actingAs($professional)
        ->postJson("/professional/appointments/{$appointment->id}/end-call")
        ->assertOk()
        ->assertJson(['status' => 'completed']);

    Queue::assertPushed(SummarizeSessionJob::class, function (SummarizeSessionJob $job) use ($appointment) {
        return $job->sessionRecordingId === $appointment->sessionRecording->id
            && $job->delay !== null;
    });
});

it('end-call does not dispatch if no recording exists', function () {
    Queue::fake();

    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'status' => 'in_progress',
        'workspace_id' => null,
    ]);

    $this->actingAs($professional)
        ->postJson("/professional/appointments/{$appointment->id}/end-call")
        ->assertOk();

    Queue::assertNotPushed(SummarizeSessionJob::class);
});
