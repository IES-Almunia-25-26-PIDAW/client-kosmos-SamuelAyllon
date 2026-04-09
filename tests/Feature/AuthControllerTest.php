<?php

use App\Models\User;

// ── Login con rol válido ──────────────────────────────────────────────────────

it('admin can log in and is redirected to admin users index', function () {
    $user = createAdmin();

    $this->post('/login', [
        'email'    => $user->email,
        'password' => 'password',
    ])->assertRedirect(route('admin.users.index'));

    $this->assertAuthenticatedAs($user);
});

it('professional can log in and is redirected to dashboard', function () {
    $user = createProfessional();

    $this->post('/login', [
        'email'    => $user->email,
        'password' => 'password',
    ])->assertRedirect(route('dashboard'));

    $this->assertAuthenticatedAs($user);
});

it('professional without completed tutorial is redirected to onboarding', function () {
    ensureRolesExist();
    $user = User::factory()->create(['tutorial_completed_at' => null]);
    $user->assignRole('professional');

    $this->post('/login', [
        'email'    => $user->email,
        'password' => 'password',
    ])->assertRedirect(route('onboarding'));

    $this->assertAuthenticatedAs($user);
});

// ── Login bloqueado ───────────────────────────────────────────────────────────

it('user without any role cannot log in', function () {
    $user = User::factory()->create();

    $this->post('/login', [
        'email'    => $user->email,
        'password' => 'password',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});

it('login fails with wrong password', function () {
    $user = createProfessional();

    $this->post('/login', [
        'email'    => $user->email,
        'password' => 'wrong-password',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});

it('login fails with non-existent email', function () {
    $this->post('/login', [
        'email'    => 'noexiste@clientkosmos.test',
        'password' => 'password',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});
