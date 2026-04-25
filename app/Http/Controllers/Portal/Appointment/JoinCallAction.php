<?php

namespace App\Http\Controllers\Portal\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class JoinCallAction extends Controller
{
    public function __invoke(Request $request, Appointment $appointment): JsonResponse|RedirectResponse
    {
        abort_if($appointment->patient_id !== $request->user()->id, 403);

        abort_unless(
            $appointment->canBeJoinedNow(),
            403,
            'Fuera de la ventana de acceso (10 min antes — 15 min después).'
        );

        if ($appointment->patient_joined_at === null) {
            $appointment->update(['patient_joined_at' => now()]);
        }

        if ($appointment->meeting_room_id !== null) {
            return response()->json([
                'room_id' => $appointment->meeting_room_id,
                'meeting_url' => $appointment->meeting_url,
            ]);
        }

        return redirect()->route('patient.appointments.waiting', $appointment);
    }
}
