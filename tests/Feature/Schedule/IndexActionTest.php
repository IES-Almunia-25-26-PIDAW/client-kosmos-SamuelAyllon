<?php

use App\Models\Appointment;
use App\Models\Availability;

it('redirects guests to login', function () {
    $this->get(route('professional.schedule.index'))->assertRedirect(route('login'));
});

it('professional can view schedule page', function () {
    $user = createProfessional();

    $this->actingAs($user)
        ->get(route('professional.schedule.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('professional/schedule/index')
            ->has('appointments')
            ->has('recurringSlots')
            ->has('specificSlots')
            ->has('from')
            ->has('to')
        );
});

it('schedule page returns appointments in the date range', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $now = now();

    Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
        'starts_at' => $now->copy()->startOfWeek()->addHours(9),
        'ends_at' => $now->copy()->startOfWeek()->addHours(10),
        'status' => 'pending',
    ]);

    $this->actingAs($professional)
        ->get(route('professional.schedule.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('professional/schedule/index')
            ->has('appointments', 1)
        );
});

it('schedule page returns recurring availability slots', function () {
    $professional = createProfessional();

    Availability::create([
        'professional_id' => $professional->id,
        'workspace_id' => null,
        'day_of_week' => 1,
        'specific_date' => null,
        'start_time' => '09:00',
        'end_time' => '10:00',
        'slot_duration_minutes' => 50,
        'is_active' => true,
    ]);

    $this->actingAs($professional)
        ->get(route('professional.schedule.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('professional/schedule/index')
            ->has('recurringSlots', 1)
        );
});

it('schedule page returns specific-date availability slots in range', function () {
    $professional = createProfessional();
    $today = now()->startOfWeek()->toDateString();

    Availability::create([
        'professional_id' => $professional->id,
        'workspace_id' => null,
        'day_of_week' => null,
        'specific_date' => $today,
        'start_time' => '14:00',
        'end_time' => '15:00',
        'slot_duration_minutes' => 50,
        'is_active' => true,
    ]);

    $this->actingAs($professional)
        ->get(route('professional.schedule.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('professional/schedule/index')
            ->has('specificSlots', 1)
        );
});

it('does not return appointments belonging to other professionals', function () {
    $professional = createProfessional();
    $other = createProfessional();
    $patient = createPatient();

    Appointment::factory()->create([
        'professional_id' => $other->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
        'starts_at' => now()->startOfWeek()->addHours(9),
        'ends_at' => now()->startOfWeek()->addHours(10),
    ]);

    $this->actingAs($professional)
        ->get(route('professional.schedule.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('professional/schedule/index')
            ->has('appointments', 0)
        );
});
