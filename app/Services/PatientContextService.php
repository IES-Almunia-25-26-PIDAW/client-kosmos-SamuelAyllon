<?php

namespace App\Services;

use App\Models\PatientProfile;

class PatientContextService
{
    /**
     * Return context data for the pre-session view.
     *
     * Eager-loads: last 3 completed sessions (with notes), 5 recent notes,
     * open agreements, last invoice, and current valid (signed, non-expired) consent.
     */
    public function getPreSessionContext(PatientProfile $patient): array
    {
        return [
            'last_sessions' => $patient->appointments()
                ->where('status', 'completed')
                ->latest('starts_at')
                ->limit(3)
                ->with('notes')
                ->get(),

            'recent_notes' => $patient->notes()
                ->latest()
                ->limit(5)
                ->get(),

            'open_agreements' => $patient->agreements()
                ->where('is_completed', false)
                ->latest()
                ->get(),

            'last_invoice' => $patient->invoices()
                ->latest()
                ->first(),

            'valid_consent' => $patient->consentForms()
                ->where('status', 'signed')
                ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
                ->latest()
                ->first(),
        ];
    }
}
