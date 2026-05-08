<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\KosmoBriefing;
use App\Models\PatientProfile;
use Inertia\Inertia;
use Inertia\Response;

class PreSessionAction extends Controller
{
    public function __invoke(PatientProfile $patient): Response
    {
        $this->authorize('view', $patient);

        $lastAppointments = $patient->appointments()->orderByDesc('starts_at')->limit(3)->get();
        $lastInvoice = $patient->invoices()->orderByDesc('due_at')->first();

        $context = [
            'lastSessions' => $lastAppointments->map(fn ($a) => [
                'id' => $a->id,
                'patient_id' => $a->patient_id,
                'user_id' => $a->professional_id,
                'scheduled_at' => optional($a->starts_at)->toIso8601String(),
                'started_at' => optional($a->patient_joined_at)->toIso8601String(),
                'ended_at' => optional($a->ends_at)->toIso8601String(),
                'duration_minutes' => (int) $a->starts_at->diffInMinutes($a->ends_at),
                'status' => $a->status,
                'ai_summary' => null,
                'ai_summary_generated' => false,
                'created_at' => optional($a->created_at)->toIso8601String(),
                'updated_at' => optional($a->updated_at)->toIso8601String(),
            ])->values(),
            'recentNotes' => $patient->notes()->orderByDesc('created_at')->limit(5)->get(),
            'openAgreements' => $patient->agreements()->where('is_completed', false)->get(),
            'lastPayment' => $lastInvoice ? [
                'id' => $lastInvoice->id,
                'patient_id' => $patient->id,
                'amount' => (float) $lastInvoice->total,
                'status' => $lastInvoice->status,
                'due_date' => optional($lastInvoice->due_at)->toIso8601String(),
                'paid_at' => optional($lastInvoice->paid_at)->toIso8601String(),
                'invoice_number' => $lastInvoice->invoice_number,
            ] : null,
            'validConsent' => $patient->consentForms()->where('status', 'signed')->first(),
        ];

        $briefing = KosmoBriefing::where('patient_id', $patient->id)
            ->where('type', 'pre_session')
            ->latest()
            ->first();

        return Inertia::render('professional/patients/pre-session', [
            'patient' => $patient,
            'context' => $context,
            'briefing' => $briefing,
        ]);
    }
}
