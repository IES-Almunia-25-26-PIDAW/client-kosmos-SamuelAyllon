<?php

use App\Models\Patient;
use App\Models\Payment;

it('redirects guests from billing to login', function () {
    $this->get(route('billing'))->assertRedirect(route('login'));
});

it('professional can view billing page', function () {
    $this->actingAs(createProfessional())
        ->get(route('billing'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('billing/index'));
});

it('billing page returns payments, stats and filters', function () {
    $this->actingAs(createProfessional())
        ->get(route('billing'))
        ->assertInertia(fn ($page) => $page
            ->component('billing/index')
            ->has('payments')
            ->has('stats')
            ->has('filters')
        );
});

it('billing stats include total_paid, total_pending and total_overdue', function () {
    $this->actingAs(createProfessional())
        ->get(route('billing'))
        ->assertInertia(fn ($page) => $page
            ->has('stats.total_paid')
            ->has('stats.total_pending')
            ->has('stats.total_overdue')
        );
});

it('billing only shows payments belonging to authenticated user', function () {
    $user = createProfessional();
    $other = createProfessional();

    $patientOwn = Patient::factory()->create(['user_id' => $user->id]);
    $patientOther = Patient::factory()->create(['user_id' => $other->id]);

    Payment::factory()->count(3)->create([
        'user_id'    => $user->id,
        'patient_id' => $patientOwn->id,
    ]);
    Payment::factory()->create([
        'user_id'    => $other->id,
        'patient_id' => $patientOther->id,
    ]);

    $this->actingAs($user)
        ->get(route('billing'))
        ->assertInertia(fn ($page) => $page
            ->component('billing/index')
            ->has('payments.data', 3)
        );
});

it('billing can be filtered by payment status', function () {
    $user = createProfessional();
    $patient = Patient::factory()->create(['user_id' => $user->id]);

    Payment::factory()->create(['user_id' => $user->id, 'patient_id' => $patient->id, 'status' => 'paid']);
    Payment::factory()->create(['user_id' => $user->id, 'patient_id' => $patient->id, 'status' => 'pending']);

    $this->actingAs($user)
        ->get(route('billing', ['status' => 'paid']))
        ->assertInertia(fn ($page) => $page
            ->component('billing/index')
            ->has('payments.data', 1)
        );
});
