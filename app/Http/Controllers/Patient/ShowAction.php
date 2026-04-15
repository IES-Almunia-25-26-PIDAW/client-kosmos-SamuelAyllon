<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\PatientProfile;
use Inertia\Inertia;
use Inertia\Response;

class ShowAction extends Controller
{
    public function __invoke(PatientProfile $patient): Response
    {
        $this->authorize('view', $patient);

        $patient->load([
            'appointments' => fn ($q) => $q->orderByDesc('starts_at')->limit(10),
            'notes' => fn ($q) => $q->orderByDesc('created_at')->limit(20),
            'agreements' => fn ($q) => $q->orderByDesc('created_at'),
            'invoices' => fn ($q) => $q->orderByDesc('due_at'),
            'documents',
            'consentForms',
        ]);

        return Inertia::render('patients/show', [
            'patient' => $patient,
        ]);
    }
}
