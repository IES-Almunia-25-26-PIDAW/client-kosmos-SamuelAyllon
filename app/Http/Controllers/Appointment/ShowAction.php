<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Inertia\Inertia;
use Inertia\Response;

class ShowAction extends Controller
{
    public function __invoke(Appointment $appointment): Response
    {
        $this->authorize('view', $appointment);

        $appointment->load([
            'patient',
            'patient.patientProfile',
            'professional',
            'service',
            'agreements',
        ]);

        return Inertia::render('professional/appointments/show', [
            'appointment' => $appointment,
            'documents' => Inertia::defer(
                fn () => $appointment->patient?->patientProfile?->documents()->get() ?? []
            ),
            'lastClinicalNote' => Inertia::defer(
                fn () => $appointment->patient?->patientProfile?->notes()
                    ->latest('created_at')
                    ->first()
            ),
        ]);
    }
}
