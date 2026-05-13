<?php

declare(strict_types=1);

use App\Events\TranscriptionSegmentCreated;
use App\Models\TranscriptionSegment;
use Database\Seeders\RoleSeeder;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    $this->withoutVite();
    app()[PermissionRegistrar::class]->forgetCachedPermissions();
    $this->seed(RoleSeeder::class);
});

it('broadcasts on the appointment private channel', function () {
    $event = new TranscriptionSegmentCreated(
        appointmentId: 99,
        segmentId: 1,
        speakerUserId: null,
        position: 0,
        startedAtMs: 0,
        endedAtMs: 1000,
        text: 'hello',
    );

    $channels = $event->broadcastOn();

    expect($channels)->toHaveCount(1)
        ->and($channels[0])->toBeInstanceOf(PrivateChannel::class)
        ->and($channels[0]->name)->toBe('private-appointment.99');
});

it('uses the transcription.segment.created broadcast name', function () {
    $event = new TranscriptionSegmentCreated(
        appointmentId: 1,
        segmentId: 1,
        speakerUserId: null,
        position: 0,
        startedAtMs: 0,
        endedAtMs: 0,
        text: '',
    );

    expect($event->broadcastAs())->toBe('transcription.segment.created');
});

it('builds the broadcast payload without sensitive ids', function () {
    $event = new TranscriptionSegmentCreated(
        appointmentId: 99,
        segmentId: 12,
        speakerUserId: 7,
        position: 3,
        startedAtMs: 1000,
        endedAtMs: 4000,
        text: 'fragmento',
    );

    expect($event->broadcastWith())->toBe([
        'segment_id' => 12,
        'speaker_user_id' => 7,
        'position' => 3,
        'started_at_ms' => 1000,
        'ended_at_ms' => 4000,
        'text' => 'fragmento',
    ]);
});

it('builds an event from a persisted TranscriptionSegment via fromSegment', function () {
    $segment = TranscriptionSegment::factory()->create([
        'speaker_user_id' => null,
        'position' => 5,
        'started_at_ms' => 2000,
        'ended_at_ms' => 8000,
        'text' => 'paciente comenta avances',
    ]);

    $event = TranscriptionSegmentCreated::fromSegment($segment, appointmentId: 321);

    expect($event->appointmentId)->toBe(321)
        ->and($event->segmentId)->toBe($segment->id)
        ->and($event->speakerUserId)->toBeNull()
        ->and($event->position)->toBe(5)
        ->and($event->startedAtMs)->toBe(2000)
        ->and($event->endedAtMs)->toBe(8000)
        ->and($event->text)->toBe('paciente comenta avances');
});
