<?php

use App\Models\User;

// ── Login con rol válido ──────────────────────────────────────────────────────

it('admin can log in and is redirected to admin dashboard', function () {
    $user = createAdmin();

    $this->post('/login', [
        'email'    => $user->email,
        'password' => 'password',
    ])->assertRedirect(route('admin.dashboard'));

    $this->assertAuthenticatedAs($user);
});

it('premium user can log in and is redirected to dashboard', function () {
    $user = createPremiumUser();

    $this->post('/login', [
        'email'    => $user->email,
        'password' => 'password',
    ])->assertRedirect(route('dashboard'));

    $this->assertAuthenticatedAs($user);
});

it('free user can log in and is redirected to dashboard', function () {
    $user = createFreeUser();

    $this->post('/login', [
        'email'    => $user->email,
        'password' => 'password',
    ])->assertRedirect(route('dashboard'));

    $this->assertAuthenticatedAs($user);
});

// ── Login bloqueado ───────────────────────────────────────────────────────────

it('user without any role cannot log in', function () {
    // Usuario sin rol asignado
    $user = User::factory()->create();

    $this->post('/login', [
        'email'    => $user->email,
        'password' => 'password',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});

it('login fails with wrong password', function () {
    $user = createFreeUser();

    $this->post('/login', [
        'email'    => $user->email,
        'password' => 'wrong-password',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});

it('login fails with non-existent email', function () {
    $this->post('/login', [
        'email'    => 'noexiste@flowly.test',
        'password' => 'password',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});
