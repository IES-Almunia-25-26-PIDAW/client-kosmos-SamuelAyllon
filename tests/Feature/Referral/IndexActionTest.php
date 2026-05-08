<?php

use App\Models\PatientProfile;
use App\Models\Referral;

it('redirects guests to login', function () {
    $this->get(route('professional.referrals.index'))->assertRedirect(route('login'));
});

it('professional can view referrals page with sent and received items', function () {
    $professional = createProfessional();
    $other = createProfessional();
    $patient = PatientProfile::factory()->create();

    Referral::factory()->create([
        'from_professional_id' => $professional->id,
        'to_professional_id' => $other->id,
        'patient_id' => $patient->id,
    ]);

    Referral::factory()->create([
        'from_professional_id' => $other->id,
        'to_professional_id' => $professional->id,
        'patient_id' => $patient->id,
    ]);

    $this->actingAs($professional)
        ->get(route('professional.referrals.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('professional/referrals/index', false)
            ->has('sent', 1)
            ->has('received', 1)
        );
});
