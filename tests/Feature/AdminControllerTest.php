<?php

use App\Models\Payment;
use App\Models\Subscription;
use App\Models\User;

// ── AdminDashboardController ─────────────────────────────────────────────────

it('redirects guests from admin dashboard to login', function () {
    $this->get(route('admin.dashboard'))->assertRedirect(route('login'));
});

it('free user cannot access admin dashboard', function () {
    $this->actingAs(createFreeUser())
        ->get(route('admin.dashboard'))
        ->assertForbidden();
});

it('premium user cannot access admin dashboard', function () {
    $this->actingAs(createPremiumUser())
        ->get(route('admin.dashboard'))
        ->assertForbidden();
});

it('admin can access admin dashboard', function () {
    $this->actingAs(createAdmin())
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('admin/dashboard'));
});

it('admin dashboard contains stats', function () {
    $this->actingAs(createAdmin())
        ->get(route('admin.dashboard'))
        ->assertInertia(fn ($page) => $page
            ->component('admin/dashboard')
            ->has('stats')
            ->has('recentPayments')
            ->has('recentUsers')
        );
});

// ── AdminUserController ──────────────────────────────────────────────────────

it('redirects guests from admin users to login', function () {
    $this->get(route('admin.users.index'))->assertRedirect(route('login'));
});

it('free user cannot access admin users index', function () {
    $this->actingAs(createFreeUser())
        ->get(route('admin.users.index'))
        ->assertForbidden();
});

it('admin can view users index', function () {
    $this->actingAs(createAdmin())
        ->get(route('admin.users.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('admin/users/index'));
});

it('admin users index is paginated', function () {
    $admin = createAdmin();

    $this->actingAs($admin)
        ->get(route('admin.users.index'))
        ->assertInertia(fn ($page) => $page
            ->component('admin/users/index')
            ->has('users')
        );
});

it('admin can view a specific user', function () {
    $admin = createAdmin();
    $user = createFreeUser();

    $this->actingAs($admin)
        ->get(route('admin.users.show', $user))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('admin/users/show'));
});

it('admin can delete a user', function () {
    $admin = createAdmin();
    $user = createFreeUser();

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $user))
        ->assertRedirect(route('admin.users.index'));

    $this->assertDatabaseMissing('users', ['id' => $user->id]);
});

// ── AdminPaymentController ───────────────────────────────────────────────────

it('redirects guests from admin payments to login', function () {
    $this->get(route('admin.payments.index'))->assertRedirect(route('login'));
});

it('free user cannot access admin payments', function () {
    $this->actingAs(createFreeUser())
        ->get(route('admin.payments.index'))
        ->assertForbidden();
});

it('admin can view payments index', function () {
    $this->actingAs(createAdmin())
        ->get(route('admin.payments.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/payments/index')
            ->has('payments')
            ->has('summary')
        );
});

// ── AdminSubscriptionController ──────────────────────────────────────────────

it('redirects guests from admin subscriptions to login', function () {
    $this->get(route('admin.subscriptions.index'))->assertRedirect(route('login'));
});

it('free user cannot access admin subscriptions', function () {
    $this->actingAs(createFreeUser())
        ->get(route('admin.subscriptions.index'))
        ->assertForbidden();
});

it('admin can view subscriptions index', function () {
    $this->actingAs(createAdmin())
        ->get(route('admin.subscriptions.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/subscriptions/index')
            ->has('subscriptions')
            ->has('summary')
        );
});
