<?php

use App\Models\User;
use App\Notifications\QueuedResetPassword;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Notification;

it('queued reset password notification implements ShouldQueue', function () {
    expect(new QueuedResetPassword('fake-token'))->toBeInstanceOf(ShouldQueue::class);
});

it('user sendPasswordResetNotification dispatches the queued notification', function () {
    Notification::fake();

    $user = createProfessional();

    $user->sendPasswordResetNotification('test-token');

    Notification::assertSentTo($user, QueuedResetPassword::class);
});

it('user model overrides sendPasswordResetNotification to use the queued variant', function () {
    $reflection = new ReflectionMethod(User::class, 'sendPasswordResetNotification');

    expect($reflection->getDeclaringClass()->getName())
        ->toBe(User::class);
});
