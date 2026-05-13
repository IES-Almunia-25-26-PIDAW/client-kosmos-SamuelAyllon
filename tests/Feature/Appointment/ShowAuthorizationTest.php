<?php

use App\Models\Appointment;

it('owning professional can view their appointment', function () {
    $professional = createProfessional();
    $patient = createPatient();
    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    $this->actingAs($professional)
        ->get(route('professional.appointments.show', $appointment))
        ->assertOk();
});

it('another professional cannot view someone else appointment', function () {
    $owner = createProfessional();
    $intruder = createProfessional();
    $patient = createPatient();
    $appointment = Appointment::factory()->create([
        'professional_id' => $owner->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    $this->actingAs($intruder)
        ->get(route('professional.appointments.show', $appointment))
        ->assertForbidden();
});

it('policy grants admin view of any appointment', function () {
    $admin = createAdmin();
    $appointment = Appointment::factory()->create([
        'professional_id' => createProfessional()->id,
        'patient_id' => createPatient()->id,
        'workspace_id' => null,
    ]);

    expect($admin->can('view', $appointment))->toBeTrue();
});

it('guest is redirected to login', function () {
    $appointment = Appointment::factory()->create([
        'professional_id' => createProfessional()->id,
        'patient_id' => createPatient()->id,
        'workspace_id' => null,
    ]);

    $this->get(route('professional.appointments.show', $appointment))
        ->assertRedirect(route('login'));
});
