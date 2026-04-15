<?php

use App\Models\Invoice;
use App\Models\User;

it('redirects guests from invoices index to login', function () {
    $this->get(route('invoices.index'))->assertRedirect(route('login'));
});

it('professional can view invoices page', function () {
    $this->actingAs(createProfessional())
        ->get(route('invoices.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('invoices/index', false));
});

it('invoices page returns invoices, stats and filters', function () {
    $this->actingAs(createProfessional())
        ->get(route('invoices.index'))
        ->assertInertia(fn ($page) => $page
            ->component('invoices/index', false)
            ->has('invoices')
            ->has('stats')
            ->has('filters')
        );
});

it('invoice stats include total_paid, total_pending and total_overdue', function () {
    $this->actingAs(createProfessional())
        ->get(route('invoices.index'))
        ->assertInertia(fn ($page) => $page
            ->has('stats.total_paid')
            ->has('stats.total_pending')
            ->has('stats.total_overdue')
        );
});

it('invoices index only shows invoices belonging to authenticated professional', function () {
    $user = createProfessional();
    $other = createProfessional();

    $patientUser = User::factory()->create();
    $patientUserOther = User::factory()->create();

    Invoice::factory()->count(3)->create([
        'professional_id' => $user->id,
        'patient_id' => $patientUser->id,
    ]);
    Invoice::factory()->create([
        'professional_id' => $other->id,
        'patient_id' => $patientUserOther->id,
    ]);

    $this->actingAs($user)
        ->get(route('invoices.index'))
        ->assertInertia(fn ($page) => $page
            ->component('invoices/index', false)
            ->has('invoices.data', 3)
        );
});

it('invoices index can be filtered by invoice status', function () {
    $user = createProfessional();
    $patientUser = User::factory()->create();

    Invoice::factory()->create(['professional_id' => $user->id, 'patient_id' => $patientUser->id, 'status' => 'paid']);
    Invoice::factory()->create(['professional_id' => $user->id, 'patient_id' => $patientUser->id, 'status' => 'draft']);

    $this->actingAs($user)
        ->get(route('invoices.index', ['status' => 'paid']))
        ->assertInertia(fn ($page) => $page
            ->component('invoices/index', false)
            ->has('invoices.data', 1)
        );
});
