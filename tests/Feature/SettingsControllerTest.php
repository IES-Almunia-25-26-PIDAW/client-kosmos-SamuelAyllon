<?php

it('redirects guests from settings to login', function () {
    $this->get(route('settings'))->assertRedirect(route('login'));
});

it('professional can view settings page', function () {
    $this->actingAs(createProfessional())
        ->get(route('settings'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('settings/index'));
});

it('settings page returns the authenticated user', function () {
    $user = createProfessional();

    $this->actingAs($user)
        ->get(route('settings'))
        ->assertInertia(fn ($page) => $page
            ->component('settings/index')
            ->has('user')
        );
});

it('professional can update practice settings', function () {
    $user = createProfessional();

    $this->actingAs($user)
        ->put('/settings', [
            'practice_name' => 'Consulta Psicología Kosmos',
            'specialty'     => 'Psicología clínica',
            'city'          => 'Madrid',
        ])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    $user->refresh();
    $this->assertSame('Consulta Psicología Kosmos', $user->practice_name);
    $this->assertSame('Psicología clínica', $user->specialty);
});

it('professional can update fiscal settings', function () {
    $user = createProfessional();

    $this->actingAs($user)
        ->put('/settings', [
            'nif'             => '12345678Z',
            'default_rate'    => 75.50,
            'invoice_prefix'  => 'CK',
        ])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    $user->refresh();
    $this->assertSame('12345678Z', $user->nif);
    $this->assertSame('CK', $user->invoice_prefix);
});

it('professional can update rgpd settings', function () {
    $user = createProfessional();

    $this->actingAs($user)
        ->put('/settings', [
            'rgpd_template'         => 'Texto de consentimiento RGPD personalizado.',
            'data_retention_months' => 60,
        ])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    $user->refresh();
    $this->assertSame(60, $user->data_retention_months);
});

it('admin cannot access professional settings (is redirected)', function () {
    $admin = createAdmin();

    $this->actingAs($admin)
        ->get(route('settings'))
        ->assertRedirect(route('admin.users.index'));
});
