<?php

declare(strict_types=1);

use App\Models\OfferedConsultation;
use App\Models\User;
use App\Policies\OfferedConsultationPolicy;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    $this->withoutVite();
    app()[PermissionRegistrar::class]->forgetCachedPermissions();
    $this->seed(RoleSeeder::class);
    $this->policy = new OfferedConsultationPolicy;
});

it('viewAny is allowed only for professionals', function () {
    expect($this->policy->viewAny(createProfessional()))->toBeTrue()
        ->and($this->policy->viewAny(createAdmin()))->toBeFalse()
        ->and($this->policy->viewAny(createPatient()))->toBeFalse();
});

it('create requires the professional role AND an existing professional profile', function () {
    $verified = createProfessional(verified: true);
    $withoutProfile = User::factory()->create();
    $withoutProfile->assignRole('professional');

    expect($this->policy->create($verified))->toBeTrue()
        ->and($this->policy->create($withoutProfile))->toBeFalse()
        ->and($this->policy->create(createPatient()))->toBeFalse();
});

it('view/update/delete are allowed only to the owning professional', function () {
    $owner = createProfessional();
    $stranger = createProfessional();

    $consultation = OfferedConsultation::factory()->create([
        'professional_profile_id' => $owner->professionalProfile->id,
    ]);

    expect($this->policy->view($owner, $consultation))->toBeTrue()
        ->and($this->policy->view($stranger, $consultation))->toBeFalse()
        ->and($this->policy->update($owner, $consultation))->toBeTrue()
        ->and($this->policy->update($stranger, $consultation))->toBeFalse()
        ->and($this->policy->delete($owner, $consultation))->toBeTrue()
        ->and($this->policy->delete($stranger, $consultation))->toBeFalse();
});

it('view returns false for a user without a professional profile', function () {
    $owner = createProfessional();
    $consultation = OfferedConsultation::factory()->create([
        'professional_profile_id' => $owner->professionalProfile->id,
    ]);
    $patient = createPatient();

    expect($this->policy->view($patient, $consultation))->toBeFalse();
});

it('view denies an admin without an attached professional profile', function () {
    $owner = createProfessional();
    $consultation = OfferedConsultation::factory()->create([
        'professional_profile_id' => $owner->professionalProfile->id,
    ]);

    expect($this->policy->view(createAdmin(), $consultation))->toBeFalse();
});
