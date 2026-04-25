<?php

namespace App\Jobs;

use App\Events\SessionSummarized;
use App\Models\SessionRecording;
use App\Services\KosmoService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class SummarizeSessionJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 2;

    public int $backoff = 10;

    public function __construct(
        public int $sessionRecordingId,
    ) {}

    public function handle(KosmoService $kosmo): void
    {
        $recording = SessionRecording::find($this->sessionRecordingId);

        if ($recording === null) {
            Log::warning('SummarizeSessionJob: recording not found', ['id' => $this->sessionRecordingId]);

            return;
        }

        if (trim((string) $recording->transcription) === '') {
            Log::info('SummarizeSessionJob: no transcription to summarize', ['id' => $this->sessionRecordingId]);

            return;
        }

        $summary = $kosmo->summarizeSession($recording);

        $recording->update([
            'ai_summary' => $summary['raw'],
            'summarized_at' => now(),
        ]);

        event(new SessionSummarized(
            appointmentId: (int) $recording->appointment_id,
            aiSummaryRaw: $summary['raw'],
        ));
    }
}
