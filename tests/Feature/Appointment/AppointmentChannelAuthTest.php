<?php

use App\Models\Appointment;

it('patient is authorized on the appointment channel', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id'      => $patient->id,
        'workspace_id'    => null,
    ]);

    $this->actingAs($patient)
        ->postJson('/broadcasting/auth', [
            'channel_name' => "private-appointment.{$appointment->id}",
            'socket_id'    => '1234.5678',
        ])
        ->assertOk();
});

it('professional is authorized on the appointment channel', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id'      => $patient->id,
        'workspace_id'    => null,
    ]);

    $this->actingAs($professional)
        ->postJson('/broadcasting/auth', [
            'channel_name' => "private-appointment.{$appointment->id}",
            'socket_id'    => '1234.5678',
        ])
        ->assertOk();
});

it('a third-party user is denied on the appointment channel', function () {
    $stranger = createProfessional();
    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id'      => $patient->id,
        'workspace_id'    => null,
    ]);

    $this->actingAs($stranger)
        ->postJson('/broadcasting/auth', [
            'channel_name' => "private-appointment.{$appointment->id}",
            'socket_id'    => '1234.5678',
        ])
        ->assertForbidden();
});
