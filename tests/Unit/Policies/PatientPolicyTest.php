<?php

declare(strict_types=1);

use App\Models\CaseAssignment;
use App\Models\PatientProfile;
use App\Models\User;
use App\Policies\PatientPolicy;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    $this->withoutVite();
    app()[PermissionRegistrar::class]->forgetCachedPermissions();
    $this->seed(RoleSeeder::class);
    $this->policy = new PatientPolicy;
});

it('viewAny allows admin and professional, denies patient', function () {
    expect($this->policy->viewAny(createAdmin()))->toBeTrue()
        ->and($this->policy->viewAny(createProfessional()))->toBeTrue()
        ->and($this->policy->viewAny(createPatient()))->toBeFalse();
});

it('view allows the patient themselves, the admin, and a professional with an active case assignment', function () {
    $professional = createProfessional();
    $portalPatient = User::factory()->create();
    $portalPatient->assignRole('patient');
    $profile = PatientProfile::factory()->create(['user_id' => $portalPatient->id]);

    CaseAssignment::create([
        'patient_id' => $portalPatient->id,
        'professional_id' => $professional->id,
        'is_primary' => true,
        'role' => 'primary',
        'status' => 'active',
        'started_at' => now(),
    ]);

    expect($this->policy->view(createAdmin(), $profile))->toBeTrue()
        ->and($this->policy->view($portalPatient, $profile))->toBeTrue()
        ->and($this->policy->view($professional, $profile))->toBeTrue()
        ->and($this->policy->view(createProfessional(), $profile))->toBeFalse();
});

it('update requires an active case assignment', function () {
    $professional = createProfessional();
    $patient = User::factory()->create();
    $patient->assignRole('patient');
    $profile = PatientProfile::factory()->create(['user_id' => $patient->id]);

    expect($this->policy->update($professional, $profile))->toBeFalse();

    CaseAssignment::create([
        'patient_id' => $patient->id,
        'professional_id' => $professional->id,
        'is_primary' => false,
        'role' => 'secondary',
        'status' => 'active',
        'started_at' => now(),
    ]);

    expect($this->policy->update($professional, $profile))->toBeTrue()
        ->and($this->policy->update(createAdmin(), $profile))->toBeTrue();
});

it('delete requires the primary case assignment, not just any active one', function () {
    $primary = createProfessional();
    $secondary = createProfessional();
    $patient = User::factory()->create();
    $patient->assignRole('patient');
    $profile = PatientProfile::factory()->create(['user_id' => $patient->id]);

    CaseAssignment::create([
        'patient_id' => $patient->id,
        'professional_id' => $primary->id,
        'is_primary' => true,
        'role' => 'primary',
        'status' => 'active',
        'started_at' => now(),
    ]);
    CaseAssignment::create([
        'patient_id' => $patient->id,
        'professional_id' => $secondary->id,
        'is_primary' => false,
        'role' => 'secondary',
        'status' => 'active',
        'started_at' => now(),
    ]);

    expect($this->policy->delete($primary, $profile))->toBeTrue()
        ->and($this->policy->delete($secondary, $profile))->toBeFalse()
        ->and($this->policy->delete(createAdmin(), $profile))->toBeTrue();
});

it('create requires the admin or professional role', function () {
    expect($this->policy->create(createProfessional()))->toBeTrue()
        ->and($this->policy->create(createAdmin()))->toBeTrue()
        ->and($this->policy->create(createPatient()))->toBeFalse();
});
