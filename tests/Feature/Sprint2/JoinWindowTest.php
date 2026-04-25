<?php

use App\Jobs\MarkNoShowAppointments;
use App\Jobs\SummarizeSessionJob;
use App\Models\Appointment;
use App\Models\SessionRecording;
use Illuminate\Support\Facades\Queue;

// ─── Appointment::canBeJoinedNow() ────────────────────────────────────────────

it('allows joining exactly at starts_at minus 10 minutes', function () {
    $appointment = Appointment::factory()->make([
        'status' => 'confirmed',
        'starts_at' => now()->addMinutes(10),
        'ends_at' => now()->addMinutes(60),
    ]);

    expect($appointment->canBeJoinedNow())->toBeTrue();
});

it('denies joining before the 10-minute window', function () {
    $appointment = Appointment::factory()->make([
        'status' => 'confirmed',
        'starts_at' => now()->addMinutes(11),
        'ends_at' => now()->addMinutes(61),
    ]);

    expect($appointment->canBeJoinedNow())->toBeFalse();
});

it('denies joining after ends_at plus 15 minutes', function () {
    $appointment = Appointment::factory()->make([
        'status' => 'confirmed',
        'starts_at' => now()->subMinutes(75),
        'ends_at' => now()->subMinutes(16),
    ]);

    expect($appointment->canBeJoinedNow())->toBeFalse();
});

it('allows joining within the extended post-session window', function () {
    $appointment = Appointment::factory()->make([
        'status' => 'in_progress',
        'starts_at' => now()->subMinutes(60),
        'ends_at' => now()->subMinutes(5),
    ]);

    expect($appointment->canBeJoinedNow())->toBeTrue();
});

it('denies joining when status is cancelled', function () {
    $appointment = Appointment::factory()->make([
        'status' => 'cancelled',
        'starts_at' => now()->subMinutes(5),
        'ends_at' => now()->addMinutes(45),
    ]);

    expect($appointment->canBeJoinedNow())->toBeFalse();
});

// ─── StartCallAction 10-min guard ─────────────────────────────────────────────

it('returns 403 when professional tries to start call too early', function () {
    $professional = createProfessional();
    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => createPatient()->id,
        'status' => 'confirmed',
        'workspace_id' => null,
        'starts_at' => now()->addMinutes(30),
        'ends_at' => now()->addMinutes(80),
    ]);

    $this->actingAs($professional)
        ->postJson("/professional/appointments/{$appointment->id}/start-call")
        ->assertStatus(403);
});

it('allows professional to start call within 10-minute window', function () {
    $professional = createProfessional();
    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => createPatient()->id,
        'status' => 'confirmed',
        'workspace_id' => null,
        'starts_at' => now()->addMinutes(5),
        'ends_at' => now()->addMinutes(55),
    ]);

    $this->actingAs($professional)
        ->postJson("/professional/appointments/{$appointment->id}/start-call")
        ->assertOk()
        ->assertJsonStructure(['room_id']);
});

// ─── JoinCallAction 10-min guard ──────────────────────────────────────────────

it('returns 403 when patient tries to join call too early', function () {
    $professional = createProfessional();
    $patient = createPatient();
    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'status' => 'confirmed',
        'workspace_id' => null,
        'starts_at' => now()->addMinutes(30),
        'ends_at' => now()->addMinutes(80),
    ]);

    $this->actingAs($patient)
        ->postJson("/patient/appointments/{$appointment->id}/join")
        ->assertStatus(403);
});

// ─── MarkNoShowAppointments ───────────────────────────────────────────────────

it('marks confirmed appointments as no_show after 20 minutes without professional', function () {
    $appointment = Appointment::factory()->create([
        'professional_id' => createProfessional()->id,
        'patient_id' => createPatient()->id,
        'status' => 'confirmed',
        'workspace_id' => null,
        'starts_at' => now()->subMinutes(21),
        'ends_at' => now()->addMinutes(29),
        'professional_joined_at' => null,
    ]);

    (new MarkNoShowAppointments)->handle();

    expect($appointment->fresh()->status)->toBe('no_show');
});

it('does not mark confirmed appointments as no_show before 20 minutes', function () {
    $appointment = Appointment::factory()->create([
        'professional_id' => createProfessional()->id,
        'patient_id' => createPatient()->id,
        'status' => 'confirmed',
        'workspace_id' => null,
        'starts_at' => now()->subMinutes(19),
        'ends_at' => now()->addMinutes(31),
        'professional_joined_at' => null,
    ]);

    (new MarkNoShowAppointments)->handle();

    expect($appointment->fresh()->status)->toBe('confirmed');
});

// ─── EndCallAction → SummarizeSessionJob dispatch ────────────────────────────

it('dispatches SummarizeSessionJob when ending call with transcription', function () {
    Queue::fake();

    $professional = createProfessional();
    $patient = createPatient();
    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'status' => 'in_progress',
        'workspace_id' => null,
        'starts_at' => now()->subMinutes(30),
        'ends_at' => now()->addMinutes(20),
    ]);

    SessionRecording::factory()->create([
        'appointment_id' => $appointment->id,
        'transcription' => 'Hola, ¿cómo estás hoy?',
        'transcription_status' => 'completed',
    ]);

    $this->actingAs($professional)
        ->postJson("/professional/appointments/{$appointment->id}/end-call")
        ->assertOk();

    Queue::assertPushed(SummarizeSessionJob::class);
});

it('does not dispatch SummarizeSessionJob when transcription is empty', function () {
    Queue::fake();

    $professional = createProfessional();
    $patient = createPatient();
    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'status' => 'in_progress',
        'workspace_id' => null,
        'starts_at' => now()->subMinutes(30),
        'ends_at' => now()->addMinutes(20),
    ]);

    SessionRecording::factory()->create([
        'appointment_id' => $appointment->id,
        'transcription' => null,
    ]);

    $this->actingAs($professional)
        ->postJson("/professional/appointments/{$appointment->id}/end-call")
        ->assertOk();

    Queue::assertNotPushed(SummarizeSessionJob::class);
});
