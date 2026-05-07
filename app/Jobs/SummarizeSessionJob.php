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

    public int $tries = 5;

    /**
     * @var array<int,int>
     */
    public array $backoff = [15, 30, 60, 120, 240];

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
            if ($this->attempts() < $this->tries) {
                Log::info('SummarizeSessionJob: transcription not ready, retrying', [
                    'id' => $this->sessionRecordingId,
                    'attempt' => $this->attempts(),
                ]);
                $this->release(30);

                return;
            }

            Log::warning('SummarizeSessionJob: transcription still empty after retries, marking failed', [
                'id' => $this->sessionRecordingId,
            ]);
            $recording->update(['transcription_status' => 'failed']);

            return;
        }

        $summary = $kosmo->summarizeSession($recording);

        $recording->update([
            'ai_summary' => $summary['raw'],
            'summarized_at' => now(),
            'transcription_status' => 'completed',
        ]);

        event(new SessionSummarized(
            appointmentId: (int) $recording->appointment_id,
            aiSummaryRaw: $summary['raw'],
        ));
    }
}
