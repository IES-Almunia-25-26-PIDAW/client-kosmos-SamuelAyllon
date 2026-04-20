<?php

use App\Models\Availability;

it('guest cannot create availability slot', function () {
    $this->post(route('schedule.availability.store'), [
        'date' => now()->toDateString(),
        'start_time' => '09:00',
        'end_time' => '10:00',
    ])->assertRedirect(route('login'));
});

it('professional can create a one-time availability slot', function () {
    $professional = createProfessional();
    $date = now()->addDay()->toDateString();

    $this->actingAs($professional)
        ->post(route('schedule.availability.store'), [
            'date' => $date,
            'start_time' => '09:00',
            'end_time' => '10:00',
            'slot_duration_minutes' => 50,
            'is_recurring' => false,
        ])
        ->assertRedirect();

    $slot = Availability::where('professional_id', $professional->id)->first();

    expect($slot)->not->toBeNull()
        ->and($slot->specific_date->toDateString())->toBe($date)
        ->and($slot->day_of_week)->toBeNull()
        ->and(substr($slot->start_time, 0, 5))->toBe('09:00')
        ->and(substr($slot->end_time, 0, 5))->toBe('10:00');
});

it('professional can create a recurring weekly availability slot', function () {
    $professional = createProfessional();
    $tuesday = now()->next('Tuesday');
    $date = $tuesday->toDateString();

    $this->actingAs($professional)
        ->post(route('schedule.availability.store'), [
            'date' => $date,
            'start_time' => '10:00',
            'end_time' => '11:00',
            'slot_duration_minutes' => 50,
            'is_recurring' => true,
        ])
        ->assertRedirect();

    $slot = Availability::where('professional_id', $professional->id)->first();

    expect($slot)->not->toBeNull()
        ->and($slot->specific_date)->toBeNull()
        ->and($slot->day_of_week)->toBe(2);
});

it('validates required fields when creating slot', function () {
    $professional = createProfessional();

    $this->actingAs($professional)
        ->post(route('schedule.availability.store'), [])
        ->assertSessionHasErrors(['date', 'start_time', 'end_time']);
});

it('validates end_time must be after start_time', function () {
    $professional = createProfessional();

    $this->actingAs($professional)
        ->post(route('schedule.availability.store'), [
            'date' => now()->toDateString(),
            'start_time' => '10:00',
            'end_time' => '09:00',
        ])
        ->assertSessionHasErrors(['end_time']);
});
