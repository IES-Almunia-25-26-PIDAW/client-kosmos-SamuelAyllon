<?php

declare(strict_types=1);

use App\Models\CaseAssignment;
use App\Models\Document;
use App\Models\PatientProfile;
use App\Models\User;
use App\Policies\DocumentPolicy;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    $this->withoutVite();
    app()[PermissionRegistrar::class]->forgetCachedPermissions();
    $this->seed(RoleSeeder::class);
    $this->policy = new DocumentPolicy;
});

it('view is allowed for the patient owner of the document', function () {
    $patient = User::factory()->create();
    $patient->assignRole('patient');
    $profile = PatientProfile::factory()->create(['user_id' => $patient->id]);
    $document = Document::factory()->create([
        'patient_id' => $profile->id,
        'user_id' => $patient->id,
    ]);

    expect($this->policy->view($patient, $document))->toBeTrue();
});

it('view is allowed for a professional with an active case assignment to the patient', function () {
    $professional = createProfessional();
    $patient = User::factory()->create();
    $patient->assignRole('patient');
    $profile = PatientProfile::factory()->create(['user_id' => $patient->id]);
    $document = Document::factory()->create([
        'patient_id' => $profile->id,
        'user_id' => $patient->id,
    ]);

    CaseAssignment::create([
        'patient_id' => $patient->id,
        'professional_id' => $professional->id,
        'is_primary' => true,
        'role' => 'primary',
        'status' => 'active',
        'started_at' => now(),
    ]);

    expect($this->policy->view($professional, $document))->toBeTrue()
        ->and($this->policy->view(createProfessional(), $document))->toBeFalse();
});

it('view is denied for a non-related patient or guest role', function () {
    $owner = User::factory()->create();
    $owner->assignRole('patient');
    $profile = PatientProfile::factory()->create(['user_id' => $owner->id]);
    $document = Document::factory()->create([
        'patient_id' => $profile->id,
        'user_id' => $owner->id,
    ]);
    $stranger = createPatient();

    expect($this->policy->view($stranger, $document))->toBeFalse();
});

it('create is restricted to professional or admin', function () {
    expect($this->policy->create(createProfessional()))->toBeTrue()
        ->and($this->policy->create(createAdmin()))->toBeTrue()
        ->and($this->policy->create(createPatient()))->toBeFalse();
});

it('update and delete allow document owner and admin only', function () {
    $owner = User::factory()->create();
    $owner->assignRole('patient');
    $profile = PatientProfile::factory()->create(['user_id' => $owner->id]);
    $document = Document::factory()->create([
        'patient_id' => $profile->id,
        'user_id' => $owner->id,
    ]);
    $other = createProfessional();

    expect($this->policy->update($owner, $document))->toBeTrue()
        ->and($this->policy->update(createAdmin(), $document))->toBeTrue()
        ->and($this->policy->update($other, $document))->toBeFalse();

    expect($this->policy->delete($owner, $document))->toBeTrue()
        ->and($this->policy->delete(createAdmin(), $document))->toBeTrue()
        ->and($this->policy->delete($other, $document))->toBeFalse();
});

it('download mirrors view authorization', function () {
    $owner = User::factory()->create();
    $owner->assignRole('patient');
    $profile = PatientProfile::factory()->create(['user_id' => $owner->id]);
    $document = Document::factory()->create([
        'patient_id' => $profile->id,
        'user_id' => $owner->id,
    ]);

    expect($this->policy->download($owner, $document))->toBeTrue()
        ->and($this->policy->download(createProfessional(), $document))->toBeFalse();
});
