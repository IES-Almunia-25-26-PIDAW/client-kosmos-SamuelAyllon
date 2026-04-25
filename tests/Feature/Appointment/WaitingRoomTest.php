<?php

use App\Models\Appointment;

it('patient sees waiting page with their appointment', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $appointment = \App\Models\Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    $this->actingAs($patient)
        ->get(route('patient.appointments.waiting', $appointment))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('patient/appointments/waiting')
            ->has('appointment')
        );
});

it('professional can view the waiting room for their appointment', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    $this->actingAs($professional)
        ->get(route('professional.appointments.waiting', $appointment))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('professional/appointments/waiting')
            ->has('appointment')
        );
});

it('another professional cannot view the waiting room', function () {
    $owner = createProfessional();
    $stranger = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $owner->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    $this->actingAs($stranger)
        ->get(route('professional.appointments.waiting', $appointment))
        ->assertForbidden();
});

it('joining the waiting room stamps professional_joined_at and redirects', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
        'professional_joined_at' => null,
    ]);

    $this->actingAs($professional)
        ->post(route('professional.appointments.join-waiting', $appointment))
        ->assertRedirect(route('professional.appointments.waiting', $appointment));

    expect($appointment->fresh()->professional_joined_at)->not->toBeNull();
});

it('joining the waiting room does not overwrite existing timestamp', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $originalTimestamp = now()->subMinutes(10);

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
        'professional_joined_at' => $originalTimestamp,
    ]);

    $this->actingAs($professional)
        ->post(route('professional.appointments.join-waiting', $appointment))
        ->assertRedirect();

    expect($appointment->fresh()->professional_joined_at->timestamp)
        ->toBe($originalTimestamp->timestamp);
});

it('non-owner cannot join the waiting room', function () {
    $owner = createProfessional();
    $stranger = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $owner->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    $this->actingAs($stranger)
        ->post(route('professional.appointments.join-waiting', $appointment))
        ->assertForbidden();

    expect($appointment->fresh()->professional_joined_at)->toBeNull();
});
