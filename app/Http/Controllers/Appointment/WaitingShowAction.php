<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class WaitingShowAction extends Controller
{
    public function __invoke(Appointment $appointment): Response|RedirectResponse
    {
        abort_unless($appointment->professional_id === auth()->id(), 403);

        // Room already open and start is ≤5 min away — skip the waiting room entirely.
        if (
            $appointment->meeting_room_id !== null
            && in_array($appointment->status, ['confirmed', 'in_progress'], strict: true)
            && now()->addMinutes(5)->greaterThanOrEqualTo($appointment->starts_at)
        ) {
            return redirect("/call/{$appointment->meeting_room_id}");
        }

        $appointment->load(['patient', 'professional']);

        return Inertia::render('professional/appointments/waiting', [
            'appointment' => $appointment,
        ]);
    }
}
