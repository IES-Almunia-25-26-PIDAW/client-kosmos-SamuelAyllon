<?php

use App\Models\Appointment;
use App\Services\GoogleCalendarService;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Str;

it('nullifies meeting fields and marks appointment completed on end-call', function () {
    Queue::fake();

    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'status' => 'in_progress',
        'workspace_id' => null,
        'meeting_url' => 'https://meet.google.com/abc-defg-hij',
        'meeting_room_id' => 'kosmos-'.Str::uuid(),
        'external_calendar_event_id' => 'evt_123',
    ]);

    $this->mock(GoogleCalendarService::class)
        ->shouldReceive('deleteMeetEvent')
        ->once();

    $this->actingAs($professional)
        ->postJson("/professional/appointments/{$appointment->id}/end-call")
        ->assertOk()
        ->assertJson(['status' => 'completed']);

    $fresh = $appointment->fresh();
    expect($fresh->status)->toBe('completed')
        ->and($fresh->meeting_url)->toBeNull()
        ->and($fresh->meeting_room_id)->toBeNull()
        ->and($fresh->external_calendar_event_id)->toBeNull();
});

it('returns 410 when accessing the room of a completed appointment', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $roomId = 'kosmos-legacy-'.Str::uuid();

    Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'status' => 'completed',
        'workspace_id' => null,
        'meeting_room_id' => $roomId,
        'starts_at' => now()->subMinutes(30),
        'ends_at' => now()->subMinutes(5),
    ]);

    $this->actingAs($professional)
        ->get("/call/{$roomId}")
        ->assertStatus(410);
});

it('returns 410 when patient tries to join a completed appointment', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'status' => 'completed',
        'workspace_id' => null,
        'starts_at' => now()->subMinutes(10),
        'ends_at' => now()->addMinutes(30),
    ]);

    $this->actingAs($patient)
        ->postJson(route('patient.appointments.join', $appointment))
        ->assertStatus(410);
});
