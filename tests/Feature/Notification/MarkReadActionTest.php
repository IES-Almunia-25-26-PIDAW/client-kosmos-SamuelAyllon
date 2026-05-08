<?php

use App\Notifications\ProfessionalApprovedNotification;

it('redirects guests to login when marking notification as read', function () {
    $this->post(route('notifications.read', ['notification' => 'fake-uuid']))->assertRedirect(route('login'));
});

it('marks notification as read and redirects back', function () {
    $professional = createProfessional();
    $professional->notify(new ProfessionalApprovedNotification);

    $notification = $professional->notifications()->first();
    expect($notification->read_at)->toBeNull();

    $this->actingAs($professional)
        ->post(route('notifications.read', ['notification' => $notification->id]))
        ->assertRedirect();

    expect($notification->fresh()->read_at)->not->toBeNull();
});

it('returns 404 when notification does not belong to user', function () {
    $user = createProfessional();
    $other = createProfessional();

    $other->notify(new ProfessionalApprovedNotification);
    $notification = $other->notifications()->first();

    $this->actingAs($user)
        ->post(route('notifications.read', ['notification' => $notification->id]))
        ->assertNotFound();
});

it('does not fail if notification is already read', function () {
    $professional = createProfessional();
    $professional->notify(new ProfessionalApprovedNotification);

    $notification = $professional->notifications()->first();
    $notification->markAsRead();

    $this->actingAs($professional)
        ->post(route('notifications.read', ['notification' => $notification->id]))
        ->assertRedirect();
});
