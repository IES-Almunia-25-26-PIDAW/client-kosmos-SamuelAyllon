<?php

it('redirects guests from settings to login', function () {
    $this->get(route('profile.edit'))->assertRedirect(route('login'));
});

it('professional can view settings page', function () {
    $this->actingAs(createProfessional())
        ->get(route('profile.edit'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('settings/profile'));
});

it('settings page returns the authenticated user', function () {
    $user = createProfessional();

    $this->actingAs($user)
        ->get(route('profile.edit'))
        ->assertInertia(fn ($page) => $page
            ->component('settings/profile')
            ->has('user')
        );
});

it('professional can update profile name from settings', function () {
    $user = createProfessional();

    $this->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Dr. Prueba Actualizado',
            'email' => $user->email,
        ])
        ->assertRedirect(route('profile.edit'))
        ->assertSessionHasNoErrors();

    expect($user->fresh()->name)->toBe('Dr. Prueba Actualizado');
});
