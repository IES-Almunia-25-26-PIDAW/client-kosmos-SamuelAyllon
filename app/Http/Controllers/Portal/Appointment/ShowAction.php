<?php

namespace App\Http\Controllers\Portal\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowAction extends Controller
{
    public function __invoke(Request $request, Appointment $appointment): Response
    {
        abort_if($appointment->patient_id !== $request->user()->id, 403);

        $appointment->load(['professional:id,name', 'service:id,name,duration_minutes']);

        return Inertia::render('patient/appointments/show', [
            'appointment' => $appointment,
        ]);
    }
}
