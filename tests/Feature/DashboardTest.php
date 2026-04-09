<?php

use App\Models\Patient;

it('redirects guests to login', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

it('authenticated professional can visit dashboard', function () {
    $user = createProfessional();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('dashboard'));
});

it('dashboard returns activePatients, todaySessions, alerts, dailyBriefing and stats', function () {
    $user = createProfessional();

    Patient::factory()->create([
        'user_id'   => $user->id,
        'is_active' => true,
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->has('activePatients')
            ->has('todaySessions')
            ->has('alerts')
            ->has('dailyBriefing')
            ->has('stats')
        );
});

it('dashboard stats include expected keys', function () {
    $user = createProfessional();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->has('stats.sessions_this_week')
            ->has('stats.pending_payments')
            ->has('stats.active_patients')
            ->has('stats.collection_rate')
        );
});

it('dashboard shows active patients count correctly', function () {
    $user = createProfessional();

    Patient::factory()->count(2)->create(['user_id' => $user->id, 'is_active' => true]);
    Patient::factory()->create(['user_id' => $user->id, 'is_active' => false]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->has('activePatients', 2)
        );
});

it('admin is redirected away from professional dashboard', function () {
    $admin = createAdmin();

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertRedirect(route('admin.users.index'));
});

it('dashboard alerts contain payment and consent keys', function () {
    $user = createProfessional();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->has('alerts.payment')
            ->has('alerts.consent')
        );
});
