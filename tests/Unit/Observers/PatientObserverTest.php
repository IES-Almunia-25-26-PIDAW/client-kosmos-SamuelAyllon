<?php

declare(strict_types=1);

use App\Models\CaseAssignment;
use App\Models\PatientProfile;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    $this->withoutVite();
    app()[PermissionRegistrar::class]->forgetCachedPermissions();
    $this->seed(RoleSeeder::class);
});

function patientWithProfessional(): array
{
    $professional = createProfessional();
    $portalUser = User::factory()->create();
    $portalUser->assignRole('patient');
    $profile = PatientProfile::factory()->create([
        'user_id' => $portalUser->id,
        'status' => 'active',
    ]);

    $assignment = CaseAssignment::create([
        'patient_id' => $portalUser->id,
        'professional_id' => $professional->id,
        'is_primary' => true,
        'role' => 'primary',
        'status' => 'active',
        'started_at' => now(),
    ]);

    return [$profile, $assignment];
}

it('closes primary active case assignments when the patient is discharged', function () {
    [$profile, $assignment] = patientWithProfessional();

    $profile->update(['status' => 'discharged']);

    $assignment->refresh();
    expect($assignment->status)->toBe('ended')
        ->and($assignment->ended_at)->not->toBeNull();
});

it('leaves case assignments untouched on unrelated status changes', function () {
    [$profile, $assignment] = patientWithProfessional();

    $profile->update(['status' => 'inactive']);

    $assignment->refresh();
    expect($assignment->status)->toBe('active');
});

it('does not touch non-primary assignments when discharging', function () {
    $primary = createProfessional();
    $secondary = createProfessional();
    $portalUser = User::factory()->create();
    $portalUser->assignRole('patient');
    $profile = PatientProfile::factory()->create([
        'user_id' => $portalUser->id,
        'status' => 'active',
    ]);

    $primaryAssignment = CaseAssignment::create([
        'patient_id' => $portalUser->id,
        'professional_id' => $primary->id,
        'is_primary' => true,
        'role' => 'primary',
        'status' => 'active',
        'started_at' => now(),
    ]);
    $secondaryAssignment = CaseAssignment::create([
        'patient_id' => $portalUser->id,
        'professional_id' => $secondary->id,
        'is_primary' => false,
        'role' => 'secondary',
        'status' => 'active',
        'started_at' => now(),
    ]);

    $profile->update(['status' => 'discharged']);

    expect($primaryAssignment->fresh()->status)->toBe('ended')
        ->and($secondaryAssignment->fresh()->status)->toBe('active');
});
