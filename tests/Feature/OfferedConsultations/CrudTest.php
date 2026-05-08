<?php

use App\Models\OfferedConsultation;
use App\Models\ProfessionalProfile;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;

beforeEach(function () {
    $this->seed(\Database\Seeders\RoleSeeder::class);
    $this->seed(\Database\Seeders\PermissionSeeder::class);

    $this->professional = User::factory()->create();
    $this->professional->assignRole('professional');
    $this->profile = ProfessionalProfile::factory()->create([
        'user_id' => $this->professional->id,
        'verification_status' => 'verified',
        'verified_at' => now(),
    ]);
});

it('lists owned consultations on index', function () {
    OfferedConsultation::factory()->for($this->profile, 'professionalProfile')->count(2)->create();

    actingAs($this->professional)
        ->get('/professional/offered-consultations')
        ->assertOk()
        ->assertInertia(fn ($p) => $p
            ->component('professional/offeredConsultations/index')
            ->has('consultations', 2));
});

it('stores a new consultation', function () {
    actingAs($this->professional)
        ->post('/professional/offered-consultations', [
            'name' => 'Sesión inicial',
            'description' => 'Una primera consulta',
            'duration_minutes' => 50,
            'price' => 70,
            'color' => '#6366f1',
            'is_active' => true,
            'modality' => 'video_call',
        ])
        ->assertRedirect('/professional/offered-consultations');

    assertDatabaseHas('offered_consultations', [
        'professional_profile_id' => $this->profile->id,
        'name' => 'Sesión inicial',
        'modality' => 'video_call',
    ]);
});

it('rejects invalid color', function () {
    actingAs($this->professional)
        ->post('/professional/offered-consultations', [
            'name' => 'X',
            'duration_minutes' => 50,
            'modality' => 'both',
            'color' => 'not-a-hex',
        ])
        ->assertSessionHasErrors(['color', 'name']);
});

it('updates an owned consultation', function () {
    $consultation = OfferedConsultation::factory()->for($this->profile, 'professionalProfile')->create();

    actingAs($this->professional)
        ->put("/professional/offered-consultations/{$consultation->id}", [
            'name' => 'Nuevo nombre',
            'duration_minutes' => 60,
            'modality' => 'in_person',
        ])
        ->assertRedirect('/professional/offered-consultations');

    expect($consultation->fresh()->name)->toBe('Nuevo nombre')
        ->and($consultation->fresh()->modality)->toBe('in_person');
});

it('forbids updating a foreign consultation', function () {
    $other = User::factory()->create();
    $other->assignRole('professional');
    $otherProfile = ProfessionalProfile::factory()->create(['user_id' => $other->id]);
    $consultation = OfferedConsultation::factory()->for($otherProfile, 'professionalProfile')->create();

    actingAs($this->professional)
        ->put("/professional/offered-consultations/{$consultation->id}", [
            'name' => 'Hijack',
            'duration_minutes' => 60,
            'modality' => 'both',
        ])
        ->assertForbidden();
});

it('deletes an owned consultation', function () {
    $consultation = OfferedConsultation::factory()->for($this->profile, 'professionalProfile')->create();

    actingAs($this->professional)
        ->delete("/professional/offered-consultations/{$consultation->id}")
        ->assertRedirect('/professional/offered-consultations');

    assertDatabaseMissing('offered_consultations', ['id' => $consultation->id]);
});
