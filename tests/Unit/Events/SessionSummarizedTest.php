<?php

declare(strict_types=1);

use App\Events\SessionSummarized;
use Illuminate\Broadcasting\PrivateChannel;
use Tests\TestCase;

uses(TestCase::class);

it('broadcasts on a private appointment channel', function () {
    $event = new SessionSummarized(appointmentId: 42, aiSummaryRaw: '{"key":"v"}');

    $channels = $event->broadcastOn();

    expect($channels)->toHaveCount(1)
        ->and($channels[0])->toBeInstanceOf(PrivateChannel::class)
        ->and($channels[0]->name)->toBe('private-appointment.42');
});

it('uses the session.summarized broadcast name', function () {
    $event = new SessionSummarized(appointmentId: 1, aiSummaryRaw: '');

    expect($event->broadcastAs())->toBe('session.summarized');
});

it('exposes constructor properties as public state', function () {
    $event = new SessionSummarized(appointmentId: 7, aiSummaryRaw: 'raw-payload');

    expect($event->appointmentId)->toBe(7)
        ->and($event->aiSummaryRaw)->toBe('raw-payload');
});
