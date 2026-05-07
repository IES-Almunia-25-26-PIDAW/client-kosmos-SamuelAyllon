<?php

use App\Models\Appointment;
use App\Models\CaseAssignment;
use App\Models\PatientProfile;
use App\Models\Workspace;

function pendingAppointment(array $overrides = []): Appointment
{
    $professional = createProfessional();
    $patient = createPatient();
    $workspace = Workspace::factory()->create(['creator_id' => $professional->id]);

    return Appointment::factory()->create(array_merge([
        'workspace_id' => $workspace->id,
        'patient_id' => $patient->id,
        'professional_id' => $professional->id,
        'status' => 'pending',
        'starts_at' => now()->addDays(2),
        'ends_at' => now()->addDays(2)->addMinutes(50),
    ], $overrides));
}

it('lets the patient confirm a pending appointment more than 24h ahead', function () {
    $appointment = pendingAppointment();

    $this->actingAs($appointment->patient)
        ->post(route('patient.appointments.confirm', $appointment))
        ->assertRedirect();

    $appointment->refresh();
    expect($appointment->status)->toBe('confirmed');
    expect($appointment->confirmed_at)->not->toBeNull();
});

it('rejects confirmation when less than 24h remain before start', function () {
    $appointment = pendingAppointment([
        'starts_at' => now()->addHours(12),
        'ends_at' => now()->addHours(12)->addMinutes(50),
    ]);

    $this->actingAs($appointment->patient)
        ->from(route('patient.appointments.show', $appointment))
        ->post(route('patient.appointments.confirm', $appointment))
        ->assertRedirect(route('patient.appointments.show', $appointment))
        ->assertSessionHasErrors('status');

    expect($appointment->fresh()->status)->toBe('pending');
});

it('rejects confirmation from a user who is not the patient', function () {
    $appointment = pendingAppointment();
    $intruder = createPatient();

    $this->actingAs($intruder)
        ->post(route('patient.appointments.confirm', $appointment))
        ->assertForbidden();

    expect($appointment->fresh()->status)->toBe('pending');
});

it('rejects confirmation when status is not pending', function () {
    $appointment = pendingAppointment(['status' => 'confirmed']);

    $this->actingAs($appointment->patient)
        ->from(route('patient.appointments.show', $appointment))
        ->post(route('patient.appointments.confirm', $appointment))
        ->assertSessionHasErrors('status');

    expect($appointment->fresh()->status)->toBe('confirmed');
});

it('creates the PatientProfile in the professional workspace upon confirmation', function () {
    $appointment = pendingAppointment();

    expect(PatientProfile::where('user_id', $appointment->patient_id)
        ->where('workspace_id', $appointment->workspace_id)
        ->count())->toBe(0);

    $this->actingAs($appointment->patient)
        ->post(route('patient.appointments.confirm', $appointment))
        ->assertRedirect();

    $linked = PatientProfile::where('user_id', $appointment->patient_id)
        ->where('workspace_id', $appointment->workspace_id)
        ->first();

    expect($linked)->not->toBeNull()
        ->and($linked->professional_id)->toBe($appointment->professional_id)
        ->and($linked->is_active)->toBeTrue()
        ->and($linked->status)->toBe('active');

    expect(CaseAssignment::where([
        'patient_id' => $appointment->patient_id,
        'professional_id' => $appointment->professional_id,
        'workspace_id' => $appointment->workspace_id,
    ])->count())->toBe(1);
});

it('does NOT create a PatientProfile when confirmation is rejected (less than 24h)', function () {
    $appointment = pendingAppointment([
        'starts_at' => now()->addHours(12),
        'ends_at' => now()->addHours(12)->addMinutes(50),
    ]);

    $this->actingAs($appointment->patient)
        ->from(route('patient.appointments.show', $appointment))
        ->post(route('patient.appointments.confirm', $appointment))
        ->assertSessionHasErrors('status');

    expect(PatientProfile::where('user_id', $appointment->patient_id)
        ->where('workspace_id', $appointment->workspace_id)
        ->count())->toBe(0);
});
