<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Jobs\SummarizeSessionJob;
use App\Models\Appointment;
use App\Services\GoogleCalendarService;
use Illuminate\Http\JsonResponse;

class EndCallAction extends Controller
{
    public function __construct(private readonly GoogleCalendarService $google) {}

    public function __invoke(Appointment $appointment): JsonResponse
    {
        $userId = auth()->id();

        abort_unless(
            $appointment->patient_id === $userId || $appointment->professional_id === $userId,
            403,
            'No tienes acceso a esta cita.'
        );

        abort_if(
            $appointment->status !== 'in_progress',
            422,
            'Solo se puede finalizar una llamada que está en progreso.'
        );

        $this->google->deleteMeetEvent($appointment);

        $appointment->update([
            'status' => 'completed',
            'meeting_url' => null,
            'meeting_room_id' => null,
            'external_calendar_event_id' => null,
        ]);

        $recording = $appointment->sessionRecording;

        if ($recording !== null) {
            SummarizeSessionJob::dispatch($recording->id)
                ->delay(now()->addSeconds(20));
        }

        return response()->json(['status' => 'completed']);
    }
}
