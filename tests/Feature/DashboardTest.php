<?php

use App\Models\PatientProfile;

it('redirects guests to login', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

it('authenticated professional can visit dashboard', function () {
    $user = createProfessional();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('dashboard/professional'));
});

it('dashboard returns activePatients, todayAppointments, alerts, dailyBriefing and stats', function () {
    $user = createProfessional();

    PatientProfile::factory()->create([
        'professional_id' => $user->id,
        'workspace_id' => null,
        'is_active' => true,
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/professional')
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
        ->get(route('dashboard'))
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/professional')
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
        ->get(route('dashboard'))
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/professional')
            ->has('activePatients', 2)
        );
});

it('authenticated patient can visit dashboard and sees patient view', function () {
    $patient = createPatient();

    $this->actingAs($patient)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/patient')
            ->has('upcomingAppointments')
            ->has('recentInvoices')
            ->has('stats')
            ->has('stats.upcoming_appointments')
            ->has('stats.completed_sessions')
            ->has('stats.pending_invoices')
        );
});

it('admin is redirected away from professional dashboard', function () {
    $admin = createAdmin();

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertRedirect(route('admin.users.index'));
});

it('dashboard alerts contain invoice and consent keys', function () {
    $user = createProfessional();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/professional')
            ->has('alerts.invoice')
            ->has('alerts.consent')
        );
});
