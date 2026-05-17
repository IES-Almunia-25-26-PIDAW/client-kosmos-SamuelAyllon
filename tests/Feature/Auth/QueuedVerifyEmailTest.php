<?php

use App\Models\User;
use App\Notifications\QueuedVerifyEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Notification;

it('queued verify email notification implements ShouldQueue', function () {
    expect(new QueuedVerifyEmail)->toBeInstanceOf(ShouldQueue::class);
});

it('user sendEmailVerificationNotification dispatches the queued notification', function () {
    Notification::fake();

    $user = createProfessional();

    $user->sendEmailVerificationNotification();

    Notification::assertSentTo($user, QueuedVerifyEmail::class);
});

it('user model overrides sendEmailVerificationNotification to use the queued variant', function () {
    $reflection = new ReflectionMethod(User::class, 'sendEmailVerificationNotification');

    expect($reflection->getDeclaringClass()->getName())
        ->toBe(User::class);
});
