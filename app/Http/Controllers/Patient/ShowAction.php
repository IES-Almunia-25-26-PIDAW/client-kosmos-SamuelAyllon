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

        $sessions = $patient->appointments->map(fn ($a) => [
            'id' => $a->id,
            'patient_id' => $a->patient_id,
            'user_id' => $a->professional_id,
            'scheduled_at' => $a->starts_at->toIso8601String(),
            'started_at' => $a->starts_at->toIso8601String(),
            'ended_at' => $a->ends_at->toIso8601String(),
            'duration_minutes' => (int) $a->starts_at->diffInMinutes($a->ends_at),
            'status' => $a->status,
            'ai_summary' => null,
            'ai_summary_generated' => false,
            'created_at' => $a->created_at?->toIso8601String(),
            'updated_at' => $a->updated_at?->toIso8601String(),
        ]);

        $payments = $patient->invoices->map(fn ($i) => [
            'id' => $i->id,
            'patient_id' => $i->patient_id,
            'user_id' => $i->professional_id,
            'consulting_session_id' => null,
            'amount' => (float) $i->total,
            'concept' => $i->notes,
            'payment_method' => $i->payment_method,
            'status' => match ($i->status) {
                'draft', 'sent' => 'pending',
                default => $i->status,
            },
            'due_date' => $i->due_at?->format('Y-m-d'),
            'paid_at' => $i->paid_at?->toIso8601String(),
            'invoice_number' => $i->invoice_number,
            'invoice_sent_at' => null,
            'reminder_count' => 0,
            'last_reminder_at' => null,
            'created_at' => $i->created_at?->toIso8601String(),
            'updated_at' => $i->updated_at?->toIso8601String(),
        ]);

        return Inertia::render('professional/patients/show', [
            'patient' => array_merge($patient->toArray(), [
                'sessions' => $sessions,
                'payments' => $payments,
            ]),
        ]);
    }
}
