<?php

use App\Models\Appointment;
use App\Models\Workspace;

// ─── Helpers ───────────────────────────────────────────────────────────────

function joinableAppointment(array $overrides = []): Appointment
{
    $professional = createProfessional();
    $patient = createPatient();
    $workspace = Workspace::factory()->create();

    return Appointment::factory()->create(array_merge([
        'workspace_id' => $workspace->id,
        'patient_id' => $patient->id,
        'professional_id' => $professional->id,
        'status' => 'confirmed',
        'modality' => 'video_call',
        'starts_at' => now()->subMinutes(5),
        'ends_at' => now()->addMinutes(45),
    ], $overrides));
}

// ─── Google Meet path ───────────────────────────────────────────────────────

it('returns meeting_url as JSON when appointment has only a Google Meet URL', function () {
    $appointment = joinableAppointment([
        'meeting_url' => 'https://meet.google.com/abc-defg-hij',
        'meeting_room_id' => null,
    ]);

    $this->actingAs($appointment->patient)
        ->postJson(route('patient.appointments.join', $appointment))
        ->assertOk()
        ->assertJsonFragment([
            'meeting_url' => 'https://meet.google.com/abc-defg-hij',
            'room_id' => null,
        ]);
});

it('records patient_joined_at on first join for Google Meet appointment', function () {
    $appointment = joinableAppointment([
        'meeting_url' => 'https://meet.google.com/abc-defg-hij',
        'meeting_room_id' => null,
        'patient_joined_at' => null,
    ]);

    $this->actingAs($appointment->patient)
        ->postJson(route('patient.appointments.join', $appointment))
        ->assertOk();

    expect($appointment->fresh()->patient_joined_at)->not->toBeNull();
});

it('does not overwrite patient_joined_at on subsequent joins', function () {
    $joinedAt = now()->subMinutes(3);

    $appointment = joinableAppointment([
        'meeting_url' => 'https://meet.google.com/abc-defg-hij',
        'meeting_room_id' => null,
        'patient_joined_at' => $joinedAt,
    ]);

    $this->actingAs($appointment->patient)
        ->postJson(route('patient.appointments.join', $appointment))
        ->assertOk();

    // MySQL DATETIME truncates microseconds; diffInSeconds < 2 confirms it wasn't overwritten with now()
    expect(abs($appointment->fresh()->patient_joined_at->diffInSeconds($joinedAt)))->toBeLessThan(2);
});

// ─── Internal room path ─────────────────────────────────────────────────────

it('returns room_id and meeting_url as JSON when appointment has an internal room', function () {
    $appointment = joinableAppointment([
        'meeting_room_id' => 'room-abc-123',
        'meeting_url' => null,
    ]);

    $this->actingAs($appointment->patient)
        ->postJson(route('patient.appointments.join', $appointment))
        ->assertOk()
        ->assertJsonFragment([
            'room_id' => 'room-abc-123',
            'meeting_url' => null,
        ]);
});

// ─── No meeting setup path ──────────────────────────────────────────────────

it('redirects to waiting when no meeting has been set up yet', function () {
    $appointment = joinableAppointment([
        'meeting_url' => null,
        'meeting_room_id' => null,
    ]);

    $this->actingAs($appointment->patient)
        ->post(route('patient.appointments.join', $appointment))
        ->assertRedirect(route('patient.appointments.waiting', $appointment));
});

// ─── Access window enforcement ──────────────────────────────────────────────

it('forbids joining outside the 10-min-before / 15-min-after window', function () {
    $appointment = joinableAppointment([
        'starts_at' => now()->addHours(2),
        'ends_at' => now()->addHours(3),
        'meeting_url' => 'https://meet.google.com/abc-defg-hij',
    ]);

    $this->actingAs($appointment->patient)
        ->postJson(route('patient.appointments.join', $appointment))
        ->assertForbidden();
});

it('returns 410 when joining a completed appointment', function () {
    $appointment = joinableAppointment([
        'status' => 'completed',
        'meeting_url' => 'https://meet.google.com/abc-defg-hij',
    ]);

    $this->actingAs($appointment->patient)
        ->postJson(route('patient.appointments.join', $appointment))
        ->assertStatus(410);
});

// ─── Authorization ──────────────────────────────────────────────────────────

it('forbids another patient from joining a different appointment', function () {
    $appointment = joinableAppointment([
        'meeting_url' => 'https://meet.google.com/abc-defg-hij',
    ]);

    $otherPatient = createPatient();

    $this->actingAs($otherPatient)
        ->postJson(route('patient.appointments.join', $appointment))
        ->assertForbidden();
});

it('redirects unauthenticated users to login', function () {
    $appointment = joinableAppointment([
        'meeting_url' => 'https://meet.google.com/abc-defg-hij',
    ]);

    $this->postJson(route('patient.appointments.join', $appointment))
        ->assertUnauthorized();
});

// ─── Show page ──────────────────────────────────────────────────────────────

it('renders the appointment detail page for the correct patient', function () {
    $appointment = joinableAppointment();

    $this->actingAs($appointment->patient)
        ->get(route('patient.appointments.show', $appointment))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('patient/appointments/show')
            ->has('appointment')
            ->where('appointment.id', $appointment->id)
        );
});

it('forbids another patient from viewing an appointment', function () {
    $appointment = joinableAppointment();
    $otherPatient = createPatient();

    $this->actingAs($otherPatient)
        ->get(route('patient.appointments.show', $appointment))
        ->assertForbidden();
});
