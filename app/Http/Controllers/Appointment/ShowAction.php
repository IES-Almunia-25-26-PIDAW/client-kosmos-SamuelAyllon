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
        $appointment->load([
            'patient',
            'patient.patientProfile',
            'patient.patientProfile.documents',
            'professional',
            'service',
            'sessionRecording',
            'notes',
            'agreements',
            'invoiceItems.invoice',
        ]);

        $lastClinicalNote = $appointment->patient?->patientProfile?->notes()
            ->latest('created_at')
            ->first();

        return Inertia::render('professional/appointments/show', [
            'appointment' => $appointment,
            'lastClinicalNote' => $lastClinicalNote,
        ]);
    }
}
