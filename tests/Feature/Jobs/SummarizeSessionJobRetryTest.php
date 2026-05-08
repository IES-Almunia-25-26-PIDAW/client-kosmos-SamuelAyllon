<?php

use App\Events\SessionSummarized;
use App\Jobs\SummarizeSessionJob;
use App\Models\Appointment;
use App\Models\SessionRecording;
use App\Services\KosmoService;
use Illuminate\Contracts\Queue\Job;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Http;

it('summarizes when transcription is ready and marks status completed', function () {
    Event::fake([SessionSummarized::class]);

    Http::fake([
        '*/chat/completions' => Http::response([
            'choices' => [
                ['message' => ['content' => json_encode([
                    'key_points' => ['punto 1', 'punto 2'],
                    'patient_state' => 'tranquilo',
                    'next_actions' => ['tarea 1'],
                ])]],
            ],
        ], 200),
    ]);

    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    $recording = SessionRecording::factory()->create([
        'appointment_id' => $appointment->id,
        'transcription' => 'Sesión completa transcrita.',
        'transcription_status' => 'processing',
    ]);

    (new SummarizeSessionJob($recording->id))->handle(app(KosmoService::class));

    $recording->refresh();

    expect($recording->ai_summary)->not->toBeNull()
        ->and($recording->summarized_at)->not->toBeNull()
        ->and($recording->transcription_status)->toBe('completed');

    Event::assertDispatched(SessionSummarized::class, fn ($e) => $e->appointmentId === $appointment->id);
});

it('marks recording as failed when transcription stays empty across retries', function () {
    Event::fake([SessionSummarized::class]);

    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    $recording = SessionRecording::factory()->create([
        'appointment_id' => $appointment->id,
        'transcription' => null,
        'transcription_status' => 'processing',
    ]);

    $job = new SummarizeSessionJob($recording->id);
    $fakeJob = Mockery::mock(Job::class);
    $fakeJob->shouldReceive('attempts')->andReturn(5);
    $fakeJob->shouldReceive('uuid')->andReturn('test-uuid');
    $fakeJob->shouldReceive('release')->andReturnNull();
    $fakeJob->shouldReceive('hasFailed')->andReturn(false);
    $fakeJob->shouldReceive('isReleased')->andReturn(false);
    $fakeJob->shouldReceive('isDeletedOrReleased')->andReturn(false);
    $fakeJob->shouldReceive('getName')->andReturn(SummarizeSessionJob::class);
    $job->setJob($fakeJob);

    $job->handle(app(KosmoService::class));

    expect($recording->fresh()->transcription_status)->toBe('failed');
    Event::assertNotDispatched(SessionSummarized::class);
});
