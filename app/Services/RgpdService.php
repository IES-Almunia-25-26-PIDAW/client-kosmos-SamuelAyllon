<?php

namespace App\Services;

use App\Models\ConsentForm;
use App\Models\PatientProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class RgpdService
{
    public const CONSENT_PRIVACY_POLICY = 'privacy_policy';

    public const CONSENT_TERMS_OF_SERVICE = 'terms_of_service';

    public const CONSENT_HEALTH_DATA = 'health_data';

    public const CONSENT_RECORDING_GLOBAL = 'recording_global';

    public const REGISTRATION_CONSENT_TYPES = [
        self::CONSENT_PRIVACY_POLICY,
        self::CONSENT_TERMS_OF_SERVICE,
        self::CONSENT_HEALTH_DATA,
        self::CONSENT_RECORDING_GLOBAL,
    ];

    private const CONSENT_SNAPSHOTS = [
        self::CONSENT_PRIVACY_POLICY => 'He leído y acepto la política de privacidad de ClientKosmos.',
        self::CONSENT_TERMS_OF_SERVICE => 'He leído y acepto los términos del servicio de ClientKosmos.',
        self::CONSENT_HEALTH_DATA => 'Consiento el tratamiento de mis datos de salud para la finalidad terapéutica indicada. (RGPD Art. 9.2.h)',
        self::CONSENT_RECORDING_GLOBAL => 'Autorizo la grabación de audio de mis sesiones y su procesamiento automatizado por la IA de ClientKosmos para generar resúmenes clínicos destinados exclusivamente a mi profesional. (RGPD Art. 22)',
    ];

    private const TEMPLATE_VERSION = '1.0';

    /**
     * Check if a patient has a valid, non-revoked, non-expired recording consent.
     * Used by TranscribeChunkJob before sending audio to Groq.
     */
    public function hasActiveRecordingConsent(User $patient): bool
    {
        $profile = $patient->patientProfile;

        if ($profile === null) {
            return false;
        }

        return $profile->consentForms()
            ->where('consent_type', self::CONSENT_RECORDING_GLOBAL)
            ->where('status', 'signed')
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->exists();
    }

    /**
     * Create the 4 mandatory RGPD consent records at patient registration.
     */
    public function storeRegistrationConsents(User $patient, Request $request): void
    {
        $profile = $patient->patientProfile;

        if ($profile === null) {
            return;
        }

        foreach (self::REGISTRATION_CONSENT_TYPES as $type) {
            $profile->consentForms()->create([
                'user_id' => $patient->id,
                'consent_type' => $type,
                'template_version' => self::TEMPLATE_VERSION,
                'content_snapshot' => self::CONSENT_SNAPSHOTS[$type],
                'status' => 'signed',
                'signed_at' => now(),
                'signed_ip' => $request->ip(),
                'signature_data' => 'checkbox_registration',
                'expires_at' => null,
            ]);
        }
    }

    /**
     * Check if the patient has a valid (signed, non-expired) consent form of any type.
     */
    public function hasValidConsent(PatientProfile $patient): bool
    {
        return $patient->consentForms()
            ->where('status', 'signed')
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->exists();
    }

    /**
     * Return consent forms expiring within $daysAhead days for the given patient.
     */
    public function getExpiringConsents(PatientProfile $patient, int $daysAhead = 30): Collection
    {
        return $patient->consentForms()
            ->where('status', 'signed')
            ->whereNotNull('expires_at')
            ->whereBetween('expires_at', [now(), now()->addDays($daysAhead)])
            ->get();
    }

    /**
     * Revoke a signed consent form.
     */
    public function revokeConsent(ConsentForm $form): void
    {
        $form->update([
            'status' => 'revoked',
            'signed_at' => null,
        ]);
    }
}
