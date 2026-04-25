<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SessionSummarized implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $appointmentId,
        public string $aiSummaryRaw,
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('appointment.'.$this->appointmentId)];
    }

    public function broadcastAs(): string
    {
        return 'session.summarized';
    }
}
