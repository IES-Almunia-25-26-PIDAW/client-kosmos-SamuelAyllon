<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class StartCallAction extends Controller
{
    public function __invoke(Request $request, Appointment $appointment): JsonResponse
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

        // Google Meet appointments keep meeting_room_id null; only create internal room otherwise.
        $roomId = $appointment->meeting_url !== null
            ? $appointment->meeting_room_id
            : ($appointment->meeting_room_id ?? 'kosmos-'.Str::uuid());

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
