<?php

use App\Models\Appointment;
use App\Models\Workspace;

// ─── Helpers ───────────────────────────────────────────────────────────────

function startableAppointment(array $overrides = []): Appointment
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

it('returns meeting_url and generates a Kosmos room_id for Google Meet appointments', function () {
    $appointment = startableAppointment([
        'meeting_url' => 'https://meet.google.com/abc-defg-hij',
        'meeting_room_id' => null,
    ]);

    $response = $this->actingAs($appointment->professional)
        ->postJson(route('professional.appointments.start-call', $appointment))
        ->assertOk()
        ->assertJsonFragment([
            'meeting_url' => 'https://meet.google.com/abc-defg-hij',
        ]);

    expect($response->json('room_id'))->toStartWith('kosmos-')
        ->and($appointment->fresh()->meeting_room_id)->toStartWith('kosmos-');
});

it('sets status to in_progress and records professional_joined_at for Google Meet', function () {
    $appointment = startableAppointment([
        'meeting_url' => 'https://meet.google.com/abc-defg-hij',
        'meeting_room_id' => null,
    ]);

    $this->actingAs($appointment->professional)
        ->postJson(route('professional.appointments.start-call', $appointment));

    $fresh = $appointment->fresh();
    expect($fresh->status)->toBe('in_progress')
        ->and($fresh->professional_joined_at)->not->toBeNull();
});

// ─── Internal Kosmos room path ──────────────────────────────────────────────

it('creates an internal Kosmos room when no Google Meet URL is set', function () {
    $appointment = startableAppointment([
        'meeting_url' => null,
        'meeting_room_id' => null,
    ]);

    $response = $this->actingAs($appointment->professional)
        ->postJson(route('professional.appointments.start-call', $appointment))
        ->assertOk();

    expect($response->json('room_id'))->toStartWith('kosmos-')
        ->and($appointment->fresh()->meeting_room_id)->toStartWith('kosmos-');
});

it('reuses an existing Kosmos room on re-entry', function () {
    $appointment = startableAppointment([
        'meeting_url' => null,
        'meeting_room_id' => 'kosmos-existing-room',
        'status' => 'in_progress',
    ]);

    $response = $this->actingAs($appointment->professional)
        ->postJson(route('professional.appointments.start-call', $appointment));

    expect($response->json('room_id'))->toBe('kosmos-existing-room');
});

// ─── Guard rails ────────────────────────────────────────────────────────────

it('rejects starting a pending appointment', function () {
    $appointment = startableAppointment(['status' => 'pending']);

    $this->actingAs($appointment->professional)
        ->postJson(route('professional.appointments.start-call', $appointment))
        ->assertUnprocessable();
});

it('rejects starting outside the join window', function () {
    $appointment = startableAppointment([
        'starts_at' => now()->addHours(2),
        'ends_at' => now()->addHours(3),
    ]);

    $this->actingAs($appointment->professional)
        ->postJson(route('professional.appointments.start-call', $appointment))
        ->assertForbidden();
});
