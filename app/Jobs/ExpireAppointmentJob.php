<?php

namespace App\Jobs;

use App\Models\Appointment;
use App\Services\GoogleCalendarService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ExpireAppointmentJob implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly int $appointmentId) {}

    public function handle(GoogleCalendarService $google): void
    {
        $appointment = Appointment::find($this->appointmentId);

        if ($appointment === null) {
            return;
        }

        if (in_array($appointment->status, ['completed', 'cancelled', 'no_show'], strict: true)) {
            return;
        }

        // ends_at moved into the future (cita reprogramada): reagendar el job al nuevo fin.
        if ($appointment->ends_at->isFuture()) {
            self::dispatch($appointment->id)->delay($appointment->ends_at);

            return;
        }

        $google->deleteMeetEvent($appointment);

        $appointment->update([
            'status' => 'completed',
            'meeting_url' => null,
            'meeting_room_id' => null,
            'external_calendar_event_id' => null,
        ]);
    }
}
