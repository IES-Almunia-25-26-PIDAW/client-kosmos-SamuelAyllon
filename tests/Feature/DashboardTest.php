<?php

use App\Models\PatientProfile;

it('redirects guests to login', function () {
    $this->get(route('professional.dashboard'))->assertRedirect(route('login'));
});

it('authenticated professional can visit dashboard', function () {
    $user = createProfessional();

    $this->actingAs($user)
        ->get(route('professional.dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('professional/dashboard'));
});

it('dashboard returns activePatients, todayAppointments, alerts, dailyBriefing and stats', function () {
    $user = createProfessional();

    PatientProfile::factory()->create([
        'professional_id' => $user->id,
        'workspace_id' => null,
        'is_active' => true,
    ]);

    $this->actingAs($user)
        ->get(route('professional.dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('professional/dashboard')
            ->has('activePatients')
            ->has('todayAppointments')
            ->has('alerts')
            ->has('dailyBriefing')
            ->has('stats')
        );
});

it('dashboard stats include expected keys', function () {
    $user = createProfessional();

    $this->actingAs($user)
        ->get(route('professional.dashboard'))
        ->assertInertia(fn ($page) => $page
            ->component('professional/dashboard')
            ->has('stats.appointments_this_week')
            ->has('stats.pending_invoices')
            ->has('stats.active_patients')
            ->has('stats.collection_rate')
        );
});

it('dashboard shows active patients count correctly', function () {
    $user = createProfessional();

    PatientProfile::factory()->count(2)->create([
        'professional_id' => $user->id,
        'workspace_id' => null,
        'is_active' => true,
    ]);
    PatientProfile::factory()->create([
        'professional_id' => $user->id,
        'workspace_id' => null,
        'is_active' => false,
    ]);

    $this->actingAs($user)
        ->get(route('professional.dashboard'))
        ->assertInertia(fn ($page) => $page
            ->component('professional/dashboard')
            ->has('activePatients', 2)
        );
});

it('authenticated patient can visit dashboard and sees patient view', function () {
    $patient = createPatient();

    $this->actingAs($patient)
        ->get(route('patient.dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('patient/dashboard')
            ->has('upcomingAppointments')
            ->has('recentInvoices')
            ->has('unreadMessages')
        );
});

it('patient dashboard exposes googleCalendarConnected reflecting refresh token state', function () {
    $unlinked = createPatient();
    $unlinked->forceFill(['google_refresh_token' => null])->save();

    $this->actingAs($unlinked)
        ->get(route('patient.dashboard'))
        ->assertInertia(fn ($page) => $page
            ->component('patient/dashboard')
            ->where('googleCalendarConnected', false)
        );

    $linked = createPatient();
    $linked->forceFill(['google_refresh_token' => 'rt-abc'])->save();

    $this->actingAs($linked)
        ->get(route('patient.dashboard'))
        ->assertInertia(fn ($page) => $page
            ->component('patient/dashboard')
            ->where('googleCalendarConnected', true)
        );
});

it('admin is redirected away from professional dashboard', function () {
    $admin = createAdmin();

    $this->actingAs($admin)
        ->get(route('professional.dashboard'))
        ->assertRedirect(route('admin.dashboard'));
});

it('dashboard alerts contain invoice and consent keys', function () {
    $user = createProfessional();

    $this->actingAs($user)
        ->get(route('professional.dashboard'))
        ->assertInertia(fn ($page) => $page
            ->component('professional/dashboard')
            ->has('alerts.invoice')
            ->has('alerts.consent')
        );
});
