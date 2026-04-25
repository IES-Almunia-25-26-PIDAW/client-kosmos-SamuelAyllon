<?php

it('redirects guests from settings to login', function () {
    $this->get(route('professional.settings'))->assertRedirect(route('login'));
});

it('professional can view settings page', function () {
    $this->actingAs(createProfessional())
        ->get(route('professional.settings'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('settings/index'));
});

it('settings page returns the authenticated user', function () {
    $user = createProfessional();

    $this->actingAs($user)
        ->get(route('professional.settings'))
        ->assertInertia(fn ($page) => $page
            ->component('settings/index')
            ->has('user')
        );
});

it('professional can update profile name and phone from settings', function () {
    $user = createProfessional();

    $this->actingAs($user)
        ->put('/professional/settings', [
            'name' => 'Dr. Prueba Actualizado',
            'phone' => '+34 600 000 999',
        ])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    $user->refresh();
    expect($user->name)->toBe('Dr. Prueba Actualizado');
    expect($user->phone)->toBe('+34 600 000 999');
});

it('admin cannot access professional settings (is redirected)', function () {
    $admin = createAdmin();

    $this->actingAs($admin)
        ->get(route('professional.settings'))
        ->assertRedirect(route('admin.users.index'));
});
