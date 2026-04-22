<?php

use App\Models\Appointment;

it('professional can view the closing success page for a completed appointment', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
        'status' => 'completed',
    ]);

    $this->actingAs($professional)
        ->get(route('professional.appointments.closing-success', $appointment))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('professional/appointments/closing-success')
            ->has('appointment')
        );
});

it('professional cannot view the closing success page for a non-finalized appointment', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
        'status' => 'confirmed',
    ]);

    $this->actingAs($professional)
        ->get(route('professional.appointments.closing-success', $appointment))
        ->assertForbidden();
});

it('another professional cannot view the closing success page', function () {
    $owner = createProfessional();
    $stranger = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $owner->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
        'status' => 'completed',
    ]);

    $this->actingAs($stranger)
        ->get(route('professional.appointments.closing-success', $appointment))
        ->assertForbidden();
});
