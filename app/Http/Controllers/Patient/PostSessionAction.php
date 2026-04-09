<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Inertia\Inertia;
use Inertia\Response;

class PostSessionAction extends Controller
{
    public function __invoke(Patient $patient): Response
    {
        $this->authorize('view', $patient);

        $lastSession = $patient->sessions()
            ->orderByDesc('scheduled_at')
            ->first();

        return Inertia::render('patients/post-session', [
            'patient'     => $patient,
            'lastSession' => $lastSession,
            'lastPayment' => $patient->payments()->orderByDesc('due_date')->first(),
        ]);
    }
}
