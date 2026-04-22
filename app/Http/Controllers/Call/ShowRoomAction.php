<?php

namespace App\Http\Controllers\Call;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowRoomAction extends Controller
{
    // Margen de tolerancia antes/después de la cita (en minutos)
    private const JOIN_BEFORE_MINUTES = 15;

    private const JOIN_AFTER_MINUTES = 30;

    public function __invoke(Request $request, string $roomId): Response
    {
        $appointment = Appointment::where('meeting_room_id', $roomId)
            ->with(['patient', 'professional'])
            ->firstOrFail();

        $user = $request->user();

        $isPatient = $user->id === $appointment->patient_id;
        $isProfessional = $user->id === $appointment->professional_id;

        abort_unless($isPatient || $isProfessional, 403);

        abort_unless(
            in_array($appointment->status, ['confirmed', 'in_progress'], strict: true),
            403,
            'La cita no está activa.'
        );

        abort_unless($this->isWithinAllowedWindow($appointment), 403, 'Fuera del horario permitido para esta cita.');

        return Inertia::render('call/room', [
            'appointment' => $appointment,
            'jitsiDomain' => 'meet.jit.si',
            'jitsiRoomName' => $appointment->meeting_room_id,
            'exitUrl' => $isPatient
                ? route('portal.appointments.show', $appointment)
                : route('appointments.show', $appointment),
        ]);
    }

    private function isWithinAllowedWindow(Appointment $appointment): bool
    {
        return now()->between(
            $appointment->starts_at->subMinutes(self::JOIN_BEFORE_MINUTES),
            $appointment->ends_at->addMinutes(self::JOIN_AFTER_MINUTES),
        );
    }
}
