<?php

namespace App\Listeners;

use App\Events\TranscriptionSegmentCreated;
use App\Models\SessionRecording;
use App\Models\TranscriptionSegment;
use Illuminate\Contracts\Queue\ShouldQueue;

class AggregateTranscription implements ShouldQueue
{
    public string $queue = 'default';

    public function handle(TranscriptionSegmentCreated $event): void
    {
        $segment = TranscriptionSegment::find($event->segmentId);

        if ($segment === null) {
            return;
        }

        $recording = SessionRecording::find($segment->session_recording_id);

        if ($recording === null) {
            return;
        }

        $aggregated = $recording->transcriptionSegments()
            ->orderBy('started_at_ms')
            ->orderBy('position')
            ->get()
            ->map(fn (TranscriptionSegment $s): string => trim((string) $s->text))
            ->filter()
            ->implode("\n");

        $recording->forceFill(['transcription' => $aggregated])->save();
    }
}
