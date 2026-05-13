<?php

declare(strict_types=1);

use App\Policies\AdminPolicy;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    $this->withoutVite();
    app()[PermissionRegistrar::class]->forgetCachedPermissions();
    $this->seed(RoleSeeder::class);
    $this->policy = new AdminPolicy;
});

it('viewAny allows admins and denies everyone else', function () {
    expect($this->policy->viewAny(createAdmin()))->toBeTrue()
        ->and($this->policy->viewAny(createProfessional()))->toBeFalse()
        ->and($this->policy->viewAny(createPatient()))->toBeFalse();
});

it('impersonate allows admin over professional but not over a patient', function () {
    $admin = createAdmin();
    $professional = createProfessional();
    $patient = createPatient();

    expect($this->policy->impersonate($admin, $professional))->toBeTrue()
        ->and($this->policy->impersonate($admin, $patient))->toBeFalse()
        ->and($this->policy->impersonate($professional, $professional))->toBeFalse();
});

it('updateRole forbids self-editing even for admins', function () {
    $admin = createAdmin();
    $otherAdmin = createAdmin();
    $professional = createProfessional();

    expect($this->policy->updateRole($admin, $otherAdmin))->toBeTrue()
        ->and($this->policy->updateRole($admin, $professional))->toBeTrue()
        ->and($this->policy->updateRole($admin, $admin))->toBeFalse()
        ->and($this->policy->updateRole($professional, $admin))->toBeFalse();
});
