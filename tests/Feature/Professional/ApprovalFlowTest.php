<?php

use App\Models\ProfessionalProfile;
use App\Notifications\ProfessionalApprovedNotification;
use Illuminate\Support\Facades\Notification;

// ── Bloqueo del middleware ───────────────────────────────────────────────────

it('redirects an unverified professional from the dashboard to pending-approval', function () {
    $professional = createProfessional(false);
    ProfessionalProfile::factory()->create([
        'user_id' => $professional->id,
        'verification_status' => 'unverified',
    ]);

    $this->actingAs($professional)
        ->get(route('professional.dashboard'))
        ->assertRedirect(route('professional.pending-approval'));
});

it('also blocks a professional whose status is pending or rejected', function () {
    foreach (['pending', 'rejected'] as $status) {
        $professional = createProfessional(false);
        ProfessionalProfile::factory()->create([
            'user_id' => $professional->id,
            'verification_status' => $status,
        ]);

        $this->actingAs($professional)
            ->get(route('professional.dashboard'))
            ->assertRedirect(route('professional.pending-approval'));
    }
});

it('blocks a professional with no professional profile at all', function () {
    $professional = createProfessional(false);

    $this->actingAs($professional)
        ->get(route('professional.dashboard'))
        ->assertRedirect(route('professional.pending-approval'));
});

it('lets a verified professional reach the dashboard', function () {
    $professional = createProfessional(false);
    ProfessionalProfile::factory()->verified()->create([
        'user_id' => $professional->id,
    ]);

    $this->actingAs($professional)
        ->get(route('professional.dashboard'))
        ->assertOk();
});

// ── Pantalla de pendiente ────────────────────────────────────────────────────

it('renders the pending-approval screen with the exact required message', function () {
    $professional = createProfessional(false);
    ProfessionalProfile::factory()->create([
        'user_id' => $professional->id,
        'verification_status' => 'unverified',
    ]);

    $this->actingAs($professional)
        ->get(route('professional.pending-approval'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('professional/pending-approval')
            ->where('email', $professional->email)
        );
});

it('redirects an already verified professional away from the pending screen', function () {
    $professional = createProfessional(false);
    ProfessionalProfile::factory()->verified()->create([
        'user_id' => $professional->id,
    ]);

    $this->actingAs($professional)
        ->get(route('professional.pending-approval'))
        ->assertRedirect(route('professional.dashboard'));
});

// ── Aprobación admin + notificación ──────────────────────────────────────────

it('admin approval sets verified_at and dispatches mail + database notification', function () {
    Notification::fake();

    $admin = createAdmin();
    $professional = createProfessional(false);
    ProfessionalProfile::factory()->create([
        'user_id' => $professional->id,
        'verification_status' => 'pending',
    ]);

    $this->actingAs($admin)
        ->patch(route('admin.users.verify', $professional), ['status' => 'verified'])
        ->assertRedirect();

    $professional->refresh();
    $professional->professionalProfile->refresh();

    expect($professional->professionalProfile->verification_status)->toBe('verified');
    expect($professional->professionalProfile->verified_at)->not->toBeNull();

    Notification::assertSentTo($professional, ProfessionalApprovedNotification::class);
});

it('does not re-notify when the professional was already verified', function () {
    Notification::fake();

    $admin = createAdmin();
    $professional = createProfessional(false);
    ProfessionalProfile::factory()->verified()->create([
        'user_id' => $professional->id,
    ]);

    $this->actingAs($admin)
        ->patch(route('admin.users.verify', $professional), ['status' => 'verified']);

    Notification::assertNothingSentTo($professional);
});

it('does not notify when the admin sets status to rejected', function () {
    Notification::fake();

    $admin = createAdmin();
    $professional = createProfessional(false);
    ProfessionalProfile::factory()->create([
        'user_id' => $professional->id,
        'verification_status' => 'pending',
    ]);

    $this->actingAs($admin)
        ->patch(route('admin.users.verify', $professional), ['status' => 'rejected']);

    $professional->professionalProfile->refresh();
    expect($professional->professionalProfile->verification_status)->toBe('rejected');
    expect($professional->professionalProfile->verified_at)->toBeNull();

    Notification::assertNothingSentTo($professional);
});

it('blocks a non-admin from triggering the verification endpoint', function () {
    $professional = createProfessional(false);
    ProfessionalProfile::factory()->verified()->create(['user_id' => $professional->id]);

    $other = createProfessional(false);
    ProfessionalProfile::factory()->create([
        'user_id' => $other->id,
        'verification_status' => 'pending',
    ]);

    $this->actingAs($professional)
        ->patch(route('admin.users.verify', $other), ['status' => 'verified'])
        ->assertForbidden();
});

// ── Notificación in-app: shared via Inertia + mark as read ───────────────────

it('shares unread approval notifications to inertia for the professional', function () {
    $professional = createProfessional(false);
    ProfessionalProfile::factory()->verified()->create(['user_id' => $professional->id]);

    $professional->notify(new ProfessionalApprovedNotification);

    $this->actingAs($professional)
        ->get(route('professional.dashboard'))
        ->assertInertia(fn ($page) => $page
            ->where('notifications.unread_count', 1)
            ->has('notifications.recent', 1, fn ($n) => $n
                ->where('type', ProfessionalApprovedNotification::class)
                ->where('data.type', 'professional_approved')
                ->etc()
            )
        );
});

it('marks an in-app notification as read via the notifications.read endpoint', function () {
    $professional = createProfessional(false);
    ProfessionalProfile::factory()->verified()->create(['user_id' => $professional->id]);

    $professional->notify(new ProfessionalApprovedNotification);
    $notification = $professional->fresh()->notifications()->first();

    expect($notification->read_at)->toBeNull();

    $this->actingAs($professional)
        ->from(route('professional.dashboard'))
        ->post(route('notifications.read', $notification->id))
        ->assertRedirect(route('professional.dashboard'));

    $notification->refresh();
    expect($notification->read_at)->not->toBeNull();
});

it('refuses to mark a notification belonging to another user', function () {
    $owner = createProfessional(false);
    ProfessionalProfile::factory()->verified()->create(['user_id' => $owner->id]);
    $owner->notify(new ProfessionalApprovedNotification);
    $notification = $owner->fresh()->notifications()->first();

    $intruder = createProfessional(false);
    ProfessionalProfile::factory()->verified()->create(['user_id' => $intruder->id]);

    $this->actingAs($intruder)
        ->post(route('notifications.read', $notification->id))
        ->assertNotFound();

    expect($notification->fresh()->read_at)->toBeNull();
});
