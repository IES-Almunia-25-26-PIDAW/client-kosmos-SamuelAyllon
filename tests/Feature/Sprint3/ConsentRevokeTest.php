<?php

use App\Models\ConsentForm;

it('allows patient to revoke their own signed consent', function () {
    $patient = createPatient();
    $profile = $patient->patientProfile;

    $consent = ConsentForm::create([
        'patient_id' => $profile->id,
        'user_id' => $patient->id,
        'status' => 'signed',
        'consent_type' => 'privacy_policy',
        'template_version' => '1.0',
        'content_snapshot' => 'Texto del consentimiento.',
        'signed_at' => now(),
    ]);

    $this->actingAs($patient)
        ->post("/settings/consents/{$consent->id}/revoke")
        ->assertRedirect();

    expect($consent->fresh()->status)->toBe('revoked');
});

it('forbids user from revoking a consent they do not own', function () {
    $patient = createPatient();
    $otherPatient = createPatient();
    $otherProfile = $otherPatient->patientProfile;

    $consent = ConsentForm::create([
        'patient_id' => $otherProfile->id,
        'user_id' => $otherPatient->id,
        'status' => 'signed',
        'consent_type' => 'privacy_policy',
        'template_version' => '1.0',
        'content_snapshot' => 'Texto del consentimiento.',
        'signed_at' => now(),
    ]);

    $this->actingAs($patient)
        ->post("/settings/consents/{$consent->id}/revoke")
        ->assertForbidden();

    expect($consent->fresh()->status)->toBe('signed');
});

it('rejects revoking an already revoked consent', function () {
    $patient = createPatient();
    $profile = $patient->patientProfile;

    $consent = ConsentForm::create([
        'patient_id' => $profile->id,
        'user_id' => $patient->id,
        'status' => 'revoked',
        'consent_type' => 'privacy_policy',
        'template_version' => '1.0',
        'content_snapshot' => 'Texto del consentimiento.',
        'signed_at' => now(),
    ]);

    $this->actingAs($patient)
        ->post("/settings/consents/{$consent->id}/revoke")
        ->assertStatus(422);
});
