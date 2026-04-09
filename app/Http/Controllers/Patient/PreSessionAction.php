<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\KosmoBriefing;
use App\Models\Patient;
use Inertia\Inertia;
use Inertia\Response;

class PreSessionAction extends Controller
{
    public function __invoke(Patient $patient): Response
    {
        $this->authorize('view', $patient);

        $context = [
            'lastSessions'   => $patient->sessions()->orderByDesc('scheduled_at')->limit(3)->get(),
            'recentNotes'    => $patient->notes()->orderByDesc('created_at')->limit(5)->get(),
            'openAgreements' => $patient->agreements()->where('is_completed', false)->get(),
            'lastPayment'    => $patient->payments()->orderByDesc('due_date')->first(),
            'validConsent'   => $patient->consentForms()->where('status', 'signed')->first(),
        ];

        $briefing = KosmoBriefing::where('patient_id', $patient->id)
            ->where('type', 'pre_session')
            ->latest()
            ->first();

        return Inertia::render('patients/pre-session', [
            'patient'  => $patient,
            'context'  => $context,
            'briefing' => $briefing,
        ]);
    }
}
