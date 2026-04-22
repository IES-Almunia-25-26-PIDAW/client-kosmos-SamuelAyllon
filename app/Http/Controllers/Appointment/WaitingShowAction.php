<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Inertia\Inertia;
use Inertia\Response;

class WaitingShowAction extends Controller
{
    public function __invoke(Appointment $appointment): Response
    {
        abort_unless($appointment->professional_id === auth()->id(), 403);

        $appointment->load(['patient', 'professional']);

        return Inertia::render('professional/appointments/waiting', [
            'appointment' => $appointment,
        ]);
    }
}
