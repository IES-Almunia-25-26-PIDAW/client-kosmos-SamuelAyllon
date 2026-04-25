<?php

namespace App\Http\Controllers\Call;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowRoomAction extends Controller
{
    public function __invoke(Request $request, string $roomId): Response
    {
        $appointment = Appointment::where('meeting_room_id', $roomId)
            ->with(['patient', 'professional'])
            ->firstOrFail();

        $user = $request->user();

        $isPatient = $user->id === $appointment->patient_id;
        $isProfessional = $user->id === $appointment->professional_id;

        abort_unless($isPatient || $isProfessional, 403);

        abort_unless($appointment->canBeJoinedNow(), 403, 'Fuera del horario permitido para esta cita.');

        return Inertia::render('call/room', [
            'appointment' => $appointment,
            'exitUrl' => $isPatient
                ? route('patient.appointments.post-session', $appointment)
                : route('professional.appointments.closing-success', $appointment),
        ]);
    }
}
