<?php

use App\Models\Document;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

it('serves a document when accessed with a valid signed url', function () {
    Storage::fake('private');

    $patient = createPatient();
    $profile = $patient->patientProfile;

    Storage::disk('private')->put("patients/{$profile->id}/documents/test.pdf", '%PDF-1.4 fake');

    $document = Document::create([
        'patient_id' => $profile->id,
        'user_id' => $patient->id,
        'workspace_id' => null,
        'name' => 'test.pdf',
        'local_path' => "patients/{$profile->id}/documents/test.pdf",
        'mime_type' => 'application/pdf',
        'size_bytes' => 13,
        'category' => 'other',
        'is_rgpd' => false,
    ]);

    $url = URL::temporarySignedRoute(
        'patient.documents.show',
        now()->addMinutes(5),
        ['document' => $document->id],
    );

    $this->actingAs($patient)
        ->get($url)
        ->assertOk();
});

it('rejects access without a valid signature', function () {
    $patient = createPatient();
    $profile = $patient->patientProfile;

    $document = Document::create([
        'patient_id' => $profile->id,
        'user_id' => $patient->id,
        'workspace_id' => null,
        'name' => 'test.pdf',
        'local_path' => "patients/{$profile->id}/documents/test.pdf",
        'mime_type' => 'application/pdf',
        'size_bytes' => 13,
        'category' => 'other',
        'is_rgpd' => false,
    ]);

    $this->actingAs($patient)
        ->get(route('patient.documents.show', ['document' => $document->id]))
        ->assertStatus(403);
});

it('rejects access to a document owned by another patient even with valid signature', function () {
    Storage::fake('private');

    $patient = createPatient();
    $otherPatient = createPatient();
    $otherProfile = $otherPatient->patientProfile;

    Storage::disk('private')->put("patients/{$otherProfile->id}/documents/secret.pdf", '%PDF-1.4 secret');

    $document = Document::create([
        'patient_id' => $otherProfile->id,
        'user_id' => $otherPatient->id,
        'workspace_id' => null,
        'name' => 'secret.pdf',
        'local_path' => "patients/{$otherProfile->id}/documents/secret.pdf",
        'mime_type' => 'application/pdf',
        'size_bytes' => 14,
        'category' => 'other',
        'is_rgpd' => false,
    ]);

    $url = URL::temporarySignedRoute(
        'patient.documents.show',
        now()->addMinutes(5),
        ['document' => $document->id],
    );

    $this->actingAs($patient)
        ->get($url)
        ->assertForbidden();
});
