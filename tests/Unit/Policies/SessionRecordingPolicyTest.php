<?php

declare(strict_types=1);

use App\Models\Appointment;
use App\Models\SessionRecording;
use App\Policies\SessionRecordingPolicy;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    $this->withoutVite();
    app()[PermissionRegistrar::class]->forgetCachedPermissions();
    $this->seed(RoleSeeder::class);
    $this->policy = new SessionRecordingPolicy;
});

it('view is allowed for the owning professional and any admin, denied for everyone else', function () {
    $professional = createProfessional();
    $patient = createPatient();
    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
    ]);
    $recording = SessionRecording::factory()->create(['appointment_id' => $appointment->id]);

    expect($this->policy->view($professional, $recording))->toBeTrue()
        ->and($this->policy->view(createAdmin(), $recording))->toBeTrue()
        ->and($this->policy->view($patient, $recording))->toBeFalse()
        ->and($this->policy->view(createProfessional(), $recording))->toBeFalse();
});

it('transcribe is allowed only for the owning professional, not even for admin', function () {
    $professional = createProfessional();
    $appointment = Appointment::factory()->create(['professional_id' => $professional->id]);
    $recording = SessionRecording::factory()->create(['appointment_id' => $appointment->id]);

    expect($this->policy->transcribe($professional, $recording))->toBeTrue()
        ->and($this->policy->transcribe(createAdmin(), $recording))->toBeFalse()
        ->and($this->policy->transcribe(createProfessional(), $recording))->toBeFalse();
});

it('view returns false when the recording has no appointment loaded', function () {
    $orphan = new SessionRecording;
    $orphan->setRelation('appointment', null);

    expect($this->policy->view(createProfessional(), $orphan))->toBeFalse();
});
