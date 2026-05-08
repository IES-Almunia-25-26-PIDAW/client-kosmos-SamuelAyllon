<?php

namespace App\Listeners;

use App\Events\SessionSummarized;
use App\Models\Appointment;
use App\Services\KosmoService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class GeneratePostSessionBriefingOnSummarized implements ShouldQueue
{
    public string $queue = 'default';

    public function __construct(private readonly KosmoService $kosmo) {}

    public function handle(SessionSummarized $event): void
    {
        $appointment = Appointment::find($event->appointmentId);

        if ($appointment === null) {
            Log::warning('GeneratePostSessionBriefingOnSummarized: appointment not found', [
                'appointment_id' => $event->appointmentId,
            ]);

            return;
        }

        $this->kosmo->generatePostSessionBriefing($appointment);
    }
}
