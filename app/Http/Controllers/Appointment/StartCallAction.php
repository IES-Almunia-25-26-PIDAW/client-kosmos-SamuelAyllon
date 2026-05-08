<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Services\GoogleCalendarService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class StartCallAction extends Controller
{
    public function __invoke(Request $request, Appointment $appointment, GoogleCalendarService $google): JsonResponse
    {
        abort_if(
            ! in_array($appointment->status, ['confirmed', 'in_progress'], strict: true),
            422,
            'Solo se puede iniciar una llamada en citas confirmadas o en curso.'
        );

        abort_unless(
            $appointment->canBeJoinedNow(),
            403,
            'Fuera de la ventana de acceso (10 min antes — 15 min después).'
        );

        if (
            $appointment->modality === 'video_call'
            && $appointment->meeting_url === null
            && $request->user()->google_refresh_token !== null
        ) {
            try {
                $meet = $google->createMeetEvent($appointment);
                $appointment->update([
                    'meeting_url' => $meet['meet_url'],
                    'external_calendar_event_id' => $meet['event_id'],
                ]);
            } catch (\Throwable $e) {
                Log::error('StartCallAction: lazy createMeetEvent failed', [
                    'appointment_id' => $appointment->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $roomId = $appointment->meeting_room_id ?? 'kosmos-'.Str::uuid();

        $appointment->update([
            'status' => 'in_progress',
            'professional_joined_at' => now(),
            'meeting_room_id' => $roomId,
        ]);

        return response()->json([
            'room_id' => $roomId,
            'meeting_url' => $appointment->meeting_url,
        ]);
    }
}
