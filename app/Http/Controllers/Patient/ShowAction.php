<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Inertia\Inertia;
use Inertia\Response;

class ShowAction extends Controller
{
    public function __invoke(Patient $patient): Response
    {
        $this->authorize('view', $patient);

        $patient->load([
            'sessions'    => fn ($q) => $q->orderByDesc('scheduled_at')->limit(10),
            'notes'       => fn ($q) => $q->orderByDesc('created_at')->limit(20),
            'agreements'  => fn ($q) => $q->orderByDesc('created_at'),
            'payments'    => fn ($q) => $q->orderByDesc('due_date'),
            'documents',
            'consentForms',
        ]);

        return Inertia::render('patients/show', [
            'patient' => $patient,
        ]);
    }
}
