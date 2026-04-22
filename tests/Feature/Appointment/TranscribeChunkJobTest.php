<?php

use App\Jobs\TranscribeChunkJob;
use App\Models\Appointment;
use App\Models\SessionRecording;
use App\Models\TranscriptionSegment;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

it('calls Groq Whisper and persists the transcription segment', function () {
    Storage::fake('local');
    Http::fake([
        '*/audio/transcriptions' => Http::response([
            'text' => 'Hola, buenos días, ¿cómo te encuentras?',
        ], 200),
    ]);

    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    $recording = SessionRecording::factory()->create(['appointment_id' => $appointment->id]);

    $chunkPath = "transcription-chunks/{$recording->id}/chunk-0.webm";
    Storage::disk('local')->put($chunkPath, 'fake-audio-bytes');

    (new TranscribeChunkJob(
        sessionRecordingId: $recording->id,
        speakerUserId: $professional->id,
        position: 0,
        startedAtMs: 0,
        endedAtMs: 8000,
        chunkPath: $chunkPath,
    ))->handle();

    $segment = TranscriptionSegment::where('session_recording_id', $recording->id)->first();

    expect($segment)->not->toBeNull()
        ->and($segment->text)->toBe('Hola, buenos días, ¿cómo te encuentras?')
        ->and($segment->speaker_user_id)->toBe($professional->id)
        ->and($segment->position)->toBe(0);

    expect(Storage::disk('local')->exists($chunkPath))->toBeFalse();

    Http::assertSent(fn (Request $request) => str_contains($request->url(), '/audio/transcriptions'));
});

it('does not persist a segment when Whisper returns empty text', function () {
    Storage::fake('local');
    Http::fake([
        '*/audio/transcriptions' => Http::response(['text' => ''], 200),
    ]);

    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    $recording = SessionRecording::factory()->create(['appointment_id' => $appointment->id]);

    $chunkPath = "transcription-chunks/{$recording->id}/chunk-silence.webm";
    Storage::disk('local')->put($chunkPath, 'silent-bytes');

    (new TranscribeChunkJob(
        sessionRecordingId: $recording->id,
        speakerUserId: $professional->id,
        position: 0,
        startedAtMs: 0,
        endedAtMs: 8000,
        chunkPath: $chunkPath,
    ))->handle();

    expect(TranscriptionSegment::count())->toBe(0);
    expect(Storage::disk('local')->exists($chunkPath))->toBeFalse();
});

it('throws when Groq Whisper returns a failure', function () {
    Storage::fake('local');
    Http::fake([
        '*/audio/transcriptions' => Http::response(['error' => 'rate_limited'], 429),
    ]);

    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    $recording = SessionRecording::factory()->create(['appointment_id' => $appointment->id]);

    $chunkPath = "transcription-chunks/{$recording->id}/chunk-fail.webm";
    Storage::disk('local')->put($chunkPath, 'bytes');

    expect(fn () => (new TranscribeChunkJob(
        sessionRecordingId: $recording->id,
        speakerUserId: $professional->id,
        position: 0,
        startedAtMs: 0,
        endedAtMs: 8000,
        chunkPath: $chunkPath,
    ))->handle())->toThrow(RuntimeException::class);
});
