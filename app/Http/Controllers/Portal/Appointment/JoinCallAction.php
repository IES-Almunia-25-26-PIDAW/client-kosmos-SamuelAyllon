<?php

namespace App\Http\Controllers\Portal\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class JoinCallAction extends Controller
{
    public function __invoke(Request $request, Appointment $appointment): RedirectResponse
    {
        abort_if($appointment->patient_id !== $request->user()->id, 403);

        abort_unless(
            in_array($appointment->status, ['confirmed', 'in_progress'], strict: true),
            422,
            'La cita no está activa.'
        );

        if (! $appointment->meeting_room_id) {
            return redirect()
                ->route('patient.appointments.show', $appointment)
                ->withErrors(['meeting' => 'La sala aún no ha sido iniciada por el profesional.']);
        }

        if ($appointment->patient_joined_at === null) {
            $appointment->update(['patient_joined_at' => now()]);
        }

        return redirect()->route('patient.appointments.waiting', $appointment);
    }
}
