<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\PatientProfile;
use Inertia\Inertia;
use Inertia\Response;

class PostSessionAction extends Controller
{
    public function __invoke(PatientProfile $patient): Response
    {
        $this->authorize('view', $patient);

        $lastAppointment = $patient->appointments()
            ->orderByDesc('starts_at')
            ->first();

        return Inertia::render('patients/post-session', [
            'patient' => $patient,
            'lastAppointment' => $lastAppointment,
            'lastInvoice' => $patient->invoices()->orderByDesc('due_at')->first(),
        ]);
    }
}
