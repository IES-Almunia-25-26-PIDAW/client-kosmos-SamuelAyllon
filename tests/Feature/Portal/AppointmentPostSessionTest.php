<?php

use App\Models\Appointment;

it('patient can view the post-session page for a completed appointment', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
        'status' => 'completed',
    ]);

    $this->actingAs($patient)
        ->get(route('patient.appointments.post-session', $appointment))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('patient/appointments/post-session')
            ->has('appointment')
        );
});

it('patient cannot view the post-session page before the session finishes', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
        'status' => 'confirmed',
    ]);

    $this->actingAs($patient)
        ->get(route('patient.appointments.post-session', $appointment))
        ->assertForbidden();
});

it('another patient cannot view the post-session page', function () {
    $professional = createProfessional();
    $owner = createPatient();
    $stranger = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $owner->id,
        'workspace_id' => null,
        'status' => 'completed',
    ]);

    $this->actingAs($stranger)
        ->get(route('patient.appointments.post-session', $appointment))
        ->assertForbidden();
});
