<?php

use App\Models\Availability;

it('redirects guests to login', function () {
    $this->get(route('professional.schedule.availability.index'))->assertRedirect(route('login'));
});

it('professional can view availability index page with their slots', function () {
    $professional = createProfessional();
    session(['current_workspace_id' => null]);

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
        ->get(route('professional.schedule.availability.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('professional/schedule/availability/index', false)
            ->has('availabilities', 1)
        );
});
