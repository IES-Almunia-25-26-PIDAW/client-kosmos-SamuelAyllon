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
            $appointment->status !== 'confirmed',
            422,
            'Solo se puede iniciar una llamada en citas confirmadas.'
        );

        $roomId = 'kosmos-'.Str::uuid();
        $meetUrl = route('call.room', ['roomId' => $roomId]);

        $appointment->update([
            'status' => 'in_progress',
            'meeting_room_id' => $roomId,
            'meeting_url' => $meetUrl,
        ]);

        return response()->json([
            'meeting_url' => $meetUrl,
            'room_id' => $roomId,
        ]);
    }
}
