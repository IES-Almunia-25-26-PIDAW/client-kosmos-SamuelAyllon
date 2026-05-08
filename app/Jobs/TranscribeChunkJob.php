<?php

namespace App\Jobs;

use App\Events\TranscriptionSegmentCreated;
use App\Models\SessionRecording;
use App\Models\TranscriptionSegment;
use App\Services\RgpdService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class TranscribeChunkJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $backoff = 5;

    public function __construct(
        public int $sessionRecordingId,
        public ?int $speakerUserId,
        public int $position,
        public int $startedAtMs,
        public int $endedAtMs,
        public string $chunkPath,
    ) {}

    public function handle(RgpdService $rgpdService): void
    {
        $recording = SessionRecording::with('appointment.patient')->find($this->sessionRecordingId);

        if ($recording === null) {
            Log::warning('TranscribeChunkJob: recording not found', ['id' => $this->sessionRecordingId]);
            Storage::disk('local')->delete($this->chunkPath);

            return;
        }

        $patient = $recording->appointment?->patient;

        if ($patient !== null && ! $rgpdService->hasActiveRecordingConsent($patient)) {
            Storage::disk('local')->delete($this->chunkPath);
            Log::info('TranscribeChunkJob: skipped — no active recording consent', [
                'session_recording_id' => $this->sessionRecordingId,
                'patient_id' => $patient->id,
            ]);
            $recording->update(['transcription_status' => 'rejected_no_consent']);

            activity('rgpd_access')
                ->performedOn($recording)
                ->causedBy($patient)
                ->withProperties([
                    'recording_id' => $recording->id,
                    'patient_id' => $patient->id,
                    'position' => $this->position,
                ])
                ->event('chunk_rejected_no_consent')
                ->log('chunk_rejected_no_consent');

            return;
        }

        $disk = Storage::disk('local');

        if (! $disk->exists($this->chunkPath)) {
            Log::warning('TranscribeChunkJob: chunk missing', ['path' => $this->chunkPath]);

            return;
        }

        try {
            $contents = Crypt::decryptString((string) $disk->get($this->chunkPath));
        } catch (\Throwable $e) {
            Log::error('TranscribeChunkJob: failed to decrypt chunk', [
                'path' => $this->chunkPath,
                'error' => $e->getMessage(),
            ]);
            $disk->delete($this->chunkPath);

            return;
        }

        $filename = preg_replace('/\.enc$/', '', basename($this->chunkPath)) ?? basename($this->chunkPath);

        $response = Http::withToken(config('services.groq.api_key'))
            ->attach('file', $contents, $filename)
            ->asMultipart()
            ->post(rtrim((string) config('services.groq.base_url'), '/').'/audio/transcriptions', [
                ['name' => 'model',           'contents' => 'whisper-large-v3-turbo'],
                ['name' => 'language',        'contents' => 'es'],
                ['name' => 'response_format', 'contents' => 'json'],
                ['name' => 'temperature',     'contents' => '0'],
                ['name' => 'prompt',          'contents' => 'Conversación clínica entre profesional sanitario y paciente, en español de España. Vocabulario médico habitual.'],
            ]);

        $disk->delete($this->chunkPath);

        if ($response->failed()) {
            Log::error('TranscribeChunkJob: Groq Whisper failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            throw new \RuntimeException('Groq Whisper transcription failed');
        }

        $text = trim((string) $response->json('text', ''));

        if ($text === '' || $this->isHallucination($text)) {
            Log::info('TranscribeChunkJob: discarded chunk (empty or hallucination)', [
                'session_recording_id' => $this->sessionRecordingId,
                'position' => $this->position,
                'text' => $text,
            ]);

            return;
        }

        $segment = TranscriptionSegment::updateOrCreate(
            [
                'session_recording_id' => $this->sessionRecordingId,
                'speaker_user_id' => $this->speakerUserId,
                'position' => $this->position,
            ],
            [
                'text' => $text,
                'started_at_ms' => $this->startedAtMs,
                'ended_at_ms' => $this->endedAtMs,
            ],
        );

        event(TranscriptionSegmentCreated::fromSegment($segment, $recording->appointment_id));
    }

    private function isHallucination(string $text): bool
    {
        $lower = mb_strtolower(trim($text));
        $stripped = trim((string) preg_replace('/\s+/u', ' ', (string) preg_replace('/[\p{P}\p{S}]+/u', ' ', $lower)));

        if ($stripped === '') {
            return true;
        }

        $patterns = [
            '/^gracias$/u',
            '/^muchas gracias$/u',
            '/^gracias por (ver|escuchar)/u',
            '/subt[ií]tulos? (por|realizad|creados?)/u',
            '/amara\s*org/u',
            '/^suscr[ií]b/u',
            '/^subtitulado por/u',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $stripped) === 1) {
                return true;
            }
        }

        return false;
    }
}
