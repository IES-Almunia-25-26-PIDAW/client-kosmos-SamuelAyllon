<?php

namespace App\Events;

use App\Models\TranscriptionSegment;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TranscriptionSegmentCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $appointmentId,
        public int $segmentId,
        public ?int $speakerUserId,
        public int $position,
        public int $startedAtMs,
        public int $endedAtMs,
        public string $text,
    ) {}

    public static function fromSegment(TranscriptionSegment $segment, int $appointmentId): self
    {
        return new self(
            appointmentId: $appointmentId,
            segmentId: $segment->id,
            speakerUserId: $segment->speaker_user_id,
            position: $segment->position,
            startedAtMs: $segment->started_at_ms,
            endedAtMs: $segment->ended_at_ms,
            text: $segment->text,
        );
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("appointment.{$this->appointmentId}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'transcription.segment.created';
    }

    public function broadcastWith(): array
    {
        return [
            'segment_id' => $this->segmentId,
            'speaker_user_id' => $this->speakerUserId,
            'position' => $this->position,
            'started_at_ms' => $this->startedAtMs,
            'ended_at_ms' => $this->endedAtMs,
            'text' => $this->text,
        ];
    }
}
