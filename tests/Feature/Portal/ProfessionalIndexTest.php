<?php

use App\Models\ProfessionalProfile;
use App\Models\User;

it('redirects guests to login', function () {
    $this->get(route('patient.professionals.index'))->assertRedirect(route('login'));
});

it('patient can view the verified professionals listing', function () {
    $patient = createPatient();

    $verified = User::factory()->create(['name' => 'Dra. Marta Verificada']);
    ProfessionalProfile::factory()->verified()->create(['user_id' => $verified->id]);

    $this->actingAs($patient)
        ->get(route('patient.professionals.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('patient/professionals/index')
            ->has('professionals', 1)
            ->where('professionals.0.name', 'Dra. Marta Verificada')
            ->where('professionals.0.is_verified', true)
        );
});

it('does not include pending or rejected professionals', function () {
    $patient = createPatient();

    ProfessionalProfile::factory()->verified()->create([
        'user_id' => User::factory()->create()->id,
    ]);
    ProfessionalProfile::factory()->pending()->create([
        'user_id' => User::factory()->create()->id,
    ]);
    ProfessionalProfile::factory()->rejected()->create([
        'user_id' => User::factory()->create()->id,
    ]);

    $this->actingAs($patient)
        ->get(route('patient.professionals.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('patient/professionals/index')
            ->has('professionals', 1)
        );
});

it('returns empty list when no professionals are verified', function () {
    $patient = createPatient();

    ProfessionalProfile::factory()->pending()->create([
        'user_id' => User::factory()->create()->id,
    ]);

    $this->actingAs($patient)
        ->get(route('patient.professionals.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('patient/professionals/index')
            ->has('professionals', 0)
        );
});
