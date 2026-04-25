<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\RedirectResponse;

class JoinWaitingRoomAction extends Controller
{
    public function __invoke(Appointment $appointment): RedirectResponse
    {
        abort_unless($appointment->professional_id === auth()->id(), 403);

        if ($appointment->professional_joined_at === null) {
            $appointment->update(['professional_joined_at' => now()]);
        }

        return redirect()->route('professional.appointments.waiting', $appointment);
    }
}
