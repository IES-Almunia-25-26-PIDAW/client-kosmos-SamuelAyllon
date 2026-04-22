<?php

use App\Models\Appointment;
use App\Models\SessionRecording;

it('patient can grant recording consent and creates the session recording', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    $this->actingAs($patient)
        ->post(route('patient.appointments.recording-consent', $appointment))
        ->assertOk()
        ->assertJsonStructure(['recording_id', 'patient_consent_given_at']);

    $recording = SessionRecording::where('appointment_id', $appointment->id)->first();
    expect($recording)->not->toBeNull();
    expect($recording->patient_consent_given_at)->not->toBeNull();
});

it('granting consent twice is idempotent', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    $this->actingAs($patient)->post(route('patient.appointments.recording-consent', $appointment))->assertOk();
    $firstTimestamp = SessionRecording::where('appointment_id', $appointment->id)->first()->patient_consent_given_at;

    $this->travel(5)->minutes();

    $this->actingAs($patient)->post(route('patient.appointments.recording-consent', $appointment))->assertOk();
    $secondTimestamp = SessionRecording::where('appointment_id', $appointment->id)->first()->patient_consent_given_at;

    expect($secondTimestamp->timestamp)->toBe($firstTimestamp->timestamp);
});

it('professional cannot grant consent on behalf of the patient', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    $this->actingAs($professional)
        ->post(route('patient.appointments.recording-consent', $appointment))
        ->assertForbidden();

    expect(SessionRecording::where('appointment_id', $appointment->id)->exists())->toBeFalse();
});
