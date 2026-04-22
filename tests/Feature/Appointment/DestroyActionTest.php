<?php

use App\Models\Appointment;

it('guest cannot delete an appointment', function () {
    $patient = createPatient();
    $professional = createProfessional();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    $this->delete(route('professional.appointments.destroy', $appointment))
        ->assertRedirect(route('login'));
});

it('professional can soft-delete their own appointment', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    $this->actingAs($professional)
        ->delete(route('professional.appointments.destroy', $appointment))
        ->assertRedirect();

    $this->assertSoftDeleted('appointments', ['id' => $appointment->id]);
});

it('deleted appointment no longer appears in schedule', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
        'starts_at' => now()->startOfWeek()->addHours(9),
        'ends_at' => now()->startOfWeek()->addHours(10),
    ]);

    $appointment->delete();

    $this->actingAs($professional)
        ->get(route('professional.schedule.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('professional/schedule/index')
            ->has('appointments', 0)
        );
});
