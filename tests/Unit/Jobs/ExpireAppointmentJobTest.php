<?php

use App\Jobs\ExpireAppointmentJob;
use App\Models\Appointment;
use App\Services\GoogleCalendarService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    $this->google = Mockery::mock(GoogleCalendarService::class);
    $this->app->instance(GoogleCalendarService::class, $this->google);
});

it('expires a past appointment, deletes the Meet event and clears meeting fields', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
        'status' => 'confirmed',
        'starts_at' => now()->subHour(),
        'ends_at' => now()->subMinute(),
        'meeting_url' => 'https://meet.google.com/abc-defg-hij',
        'meeting_room_id' => 'abc-defg-hij',
        'external_calendar_event_id' => 'event-123',
    ]);

    $this->google->shouldReceive('deleteMeetEvent')->once();

    (new ExpireAppointmentJob($appointment->id))->handle($this->google);

    $appointment->refresh();

    expect($appointment->status)->toBe('completed')
        ->and($appointment->meeting_url)->toBeNull()
        ->and($appointment->meeting_room_id)->toBeNull()
        ->and($appointment->external_calendar_event_id)->toBeNull();
});

it('does nothing when the appointment is already in a terminal status', function () {
    $appointment = Appointment::factory()->create([
        'professional_id' => createProfessional()->id,
        'patient_id' => createPatient()->id,
        'workspace_id' => null,
        'status' => 'completed',
        'ends_at' => now()->subHour(),
        'meeting_url' => null,
    ]);

    $this->google->shouldNotReceive('deleteMeetEvent');

    (new ExpireAppointmentJob($appointment->id))->handle($this->google);

    expect($appointment->fresh()->status)->toBe('completed');
});

it('reschedules itself when ends_at has moved into the future', function () {
    Queue::fake();

    $newEnd = now()->addHour();

    $appointment = Appointment::factory()->create([
        'professional_id' => createProfessional()->id,
        'patient_id' => createPatient()->id,
        'workspace_id' => null,
        'status' => 'confirmed',
        'starts_at' => now()->addMinutes(30),
        'ends_at' => $newEnd,
    ]);

    $this->google->shouldNotReceive('deleteMeetEvent');

    (new ExpireAppointmentJob($appointment->id))->handle($this->google);

    Queue::assertPushed(ExpireAppointmentJob::class, fn ($job) => $job->appointmentId === $appointment->id);

    expect($appointment->fresh()->status)->toBe('confirmed');
});

it('returns silently when the appointment no longer exists', function () {
    $this->google->shouldNotReceive('deleteMeetEvent');

    (new ExpireAppointmentJob(999_999))->handle($this->google);

    expect(Appointment::find(999_999))->toBeNull();
});
