<?php

use App\Events\TranscriptionSegmentCreated;
use App\Jobs\TranscribeChunkJob;
use App\Models\Appointment;
use App\Models\SessionRecording;
use App\Models\TranscriptionSegment;
use App\Services\RgpdService;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

it('calls Groq Whisper and persists the transcription segment', function () {
    Storage::fake('local');
    Event::fake([TranscriptionSegmentCreated::class]);
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

    $chunkPath = "transcription-chunks/{$recording->id}/chunk-0.webm.enc";
    Storage::disk('local')->put($chunkPath, Crypt::encryptString('fake-audio-bytes'));

    (new TranscribeChunkJob(
        sessionRecordingId: $recording->id,
        speakerUserId: $professional->id,
        position: 0,
        startedAtMs: 0,
        endedAtMs: 8000,
        chunkPath: $chunkPath,
    ))->handle(app(RgpdService::class));

    $segment = TranscriptionSegment::where('session_recording_id', $recording->id)->first();

    expect($segment)->not->toBeNull()
        ->and($segment->text)->toBe('Hola, buenos días, ¿cómo te encuentras?')
        ->and($segment->speaker_user_id)->toBe($professional->id)
        ->and($segment->position)->toBe(0);

    expect(Storage::disk('local')->exists($chunkPath))->toBeFalse();

    Http::assertSent(fn (Request $request) => str_contains($request->url(), '/audio/transcriptions'));

    Event::assertDispatched(TranscriptionSegmentCreated::class, fn ($event) => $event->appointmentId === $appointment->id
        && $event->text === 'Hola, buenos días, ¿cómo te encuentras?'
        && $event->position === 0);
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

    $chunkPath = "transcription-chunks/{$recording->id}/chunk-silence.webm.enc";
    Storage::disk('local')->put($chunkPath, Crypt::encryptString('silent-bytes'));

    (new TranscribeChunkJob(
        sessionRecordingId: $recording->id,
        speakerUserId: $professional->id,
        position: 0,
        startedAtMs: 0,
        endedAtMs: 8000,
        chunkPath: $chunkPath,
    ))->handle(app(RgpdService::class));

    expect(TranscriptionSegment::count())->toBe(0);
    expect(Storage::disk('local')->exists($chunkPath))->toBeFalse();
});

it('discards Whisper hallucinations without persisting a segment', function (string $hallucinated) {
    Storage::fake('local');
    Event::fake([TranscriptionSegmentCreated::class]);
    Http::fake([
        '*/audio/transcriptions' => Http::response(['text' => $hallucinated], 200),
    ]);

    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    $recording = SessionRecording::factory()->create(['appointment_id' => $appointment->id]);

    $chunkPath = "transcription-chunks/{$recording->id}/chunk-halluc.webm.enc";
    Storage::disk('local')->put($chunkPath, Crypt::encryptString('silent-bytes'));

    (new TranscribeChunkJob(
        sessionRecordingId: $recording->id,
        speakerUserId: $professional->id,
        position: 0,
        startedAtMs: 0,
        endedAtMs: 8000,
        chunkPath: $chunkPath,
    ))->handle(app(RgpdService::class));

    expect(TranscriptionSegment::count())->toBe(0);
    Event::assertNotDispatched(TranscriptionSegmentCreated::class);
})->with([
    'gracias dot' => 'Gracias.',
    'gracias bang' => '¡Gracias!',
    'muchas gracias' => 'Muchas gracias.',
    'gracias por ver' => 'Gracias por ver el video.',
    'amara' => 'Subtítulos por la comunidad de Amara.org',
    'suscribete' => '¡Suscríbete al canal!',
    'subtitulado' => 'Subtitulado por la comunidad',
    'just dots' => '...',
    'punctuation only' => ' . . ! ',
]);

it('sends temperature=0 and a clinical prompt to Groq Whisper', function () {
    Storage::fake('local');
    Event::fake([TranscriptionSegmentCreated::class]);
    Http::fake([
        '*/audio/transcriptions' => Http::response(['text' => 'Hola, doctor.'], 200),
    ]);

    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    $recording = SessionRecording::factory()->create(['appointment_id' => $appointment->id]);

    $chunkPath = "transcription-chunks/{$recording->id}/chunk-prompt.webm.enc";
    Storage::disk('local')->put($chunkPath, Crypt::encryptString('audio'));

    (new TranscribeChunkJob(
        sessionRecordingId: $recording->id,
        speakerUserId: $professional->id,
        position: 0,
        startedAtMs: 0,
        endedAtMs: 8000,
        chunkPath: $chunkPath,
    ))->handle(app(RgpdService::class));

    Http::assertSent(function (Request $request) {
        $body = (string) $request->body();

        return str_contains($request->url(), '/audio/transcriptions')
            && str_contains($body, 'name="temperature"')
            && str_contains($body, "\r\n\r\n0\r\n")
            && str_contains($body, 'name="prompt"')
            && str_contains($body, 'profesional sanitario');
    });
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

    $chunkPath = "transcription-chunks/{$recording->id}/chunk-fail.webm.enc";
    Storage::disk('local')->put($chunkPath, Crypt::encryptString('bytes'));

    expect(fn () => (new TranscribeChunkJob(
        sessionRecordingId: $recording->id,
        speakerUserId: $professional->id,
        position: 0,
        startedAtMs: 0,
        endedAtMs: 8000,
        chunkPath: $chunkPath,
    ))->handle(app(RgpdService::class)))->toThrow(RuntimeException::class);
});
