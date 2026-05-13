<?php

declare(strict_types=1);

use App\Models\Appointment;
use App\Models\User;
use App\Policies\AppointmentPolicy;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    $this->withoutVite();
    app()[PermissionRegistrar::class]->forgetCachedPermissions();
    $this->seed(RoleSeeder::class);
    $this->policy = new AppointmentPolicy;
});

function appointmentFor(User $professional, User $patient): Appointment
{
    return Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
    ]);
}

it('viewAny is allowed for admin and professional, denied for patient', function () {
    expect($this->policy->viewAny(createAdmin()))->toBeTrue()
        ->and($this->policy->viewAny(createProfessional()))->toBeTrue()
        ->and($this->policy->viewAny(createPatient()))->toBeFalse();
});

it('view is allowed for admin, professional owner, and the patient', function () {
    $professional = createProfessional();
    $patient = createPatient();
    $appointment = appointmentFor($professional, $patient);

    expect($this->policy->view(createAdmin(), $appointment))->toBeTrue()
        ->and($this->policy->view($professional, $appointment))->toBeTrue()
        ->and($this->policy->view($patient, $appointment))->toBeTrue();
});

it('view is denied for an unrelated professional or patient', function () {
    $professional = createProfessional();
    $patient = createPatient();
    $appointment = appointmentFor($professional, $patient);

    expect($this->policy->view(createProfessional(), $appointment))->toBeFalse()
        ->and($this->policy->view(createPatient(), $appointment))->toBeFalse();
});

it('update and delete are allowed only for the owning professional or an admin', function () {
    $professional = createProfessional();
    $patient = createPatient();
    $appointment = appointmentFor($professional, $patient);
    $other = createProfessional();

    expect($this->policy->update(createAdmin(), $appointment))->toBeTrue()
        ->and($this->policy->update($professional, $appointment))->toBeTrue()
        ->and($this->policy->update($other, $appointment))->toBeFalse()
        ->and($this->policy->update($patient, $appointment))->toBeFalse();

    expect($this->policy->delete(createAdmin(), $appointment))->toBeTrue()
        ->and($this->policy->delete($professional, $appointment))->toBeTrue()
        ->and($this->policy->delete($other, $appointment))->toBeFalse()
        ->and($this->policy->delete($patient, $appointment))->toBeFalse();
});
