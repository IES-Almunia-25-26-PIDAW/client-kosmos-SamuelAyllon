<?php

namespace App\Observers;

use App\Models\Patient;

class PatientObserver
{
    public function saved(Patient $patient): void
    {
        $hasConsent = $patient->consentForms()
            ->where('status', 'signed')
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->exists();

        $hasOpenAgreement = $patient->agreements()
            ->where('is_completed', false)
            ->exists();

        $patient->updateQuietly([
            'has_valid_consent'  => $hasConsent,
            'has_open_agreement' => $hasOpenAgreement,
        ]);
    }
}
