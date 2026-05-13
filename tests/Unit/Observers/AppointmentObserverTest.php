<?php

declare(strict_types=1);

use App\Actions\Billing\GenerateInvoiceForAppointment;
use App\Models\Appointment;
use App\Models\OfferedConsultation;
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

it('invokes GenerateInvoiceForAppointment when status transitions to completed', function () {
    $invoked = 0;
    $this->app->instance(
        GenerateInvoiceForAppointment::class,
        new class($invoked)
        {
            public function __construct(private int &$counter) {}

            public function __invoke(Appointment $appointment): void
            {
                $this->counter++;
            }
        },
    );

    $professional = createProfessional();
    $patient = User::factory()->create();
    $service = OfferedConsultation::factory()->create([
        'professional_profile_id' => $professional->professionalProfile->id,
    ]);

    $appointment = Appointment::factory()->confirmed()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'service_id' => $service->id,
    ]);

    $appointment->update(['status' => 'completed']);

    expect($invoked)->toBe(1);
});

it('does nothing on updates that do not change status', function () {
    $invoked = 0;
    $this->app->instance(
        GenerateInvoiceForAppointment::class,
        new class($invoked)
        {
            public function __construct(private int &$counter) {}

            public function __invoke(Appointment $appointment): void
            {
                $this->counter++;
            }
        },
    );

    $professional = createProfessional();
    $appointment = Appointment::factory()->confirmed()->create([
        'professional_id' => $professional->id,
    ]);

    $appointment->update(['notes' => 'just a note']);

    expect($invoked)->toBe(0);
});

it('does nothing when status transitions to a non-completed value', function () {
    $invoked = 0;
    $this->app->instance(
        GenerateInvoiceForAppointment::class,
        new class($invoked)
        {
            public function __construct(private int &$counter) {}

            public function __invoke(Appointment $appointment): void
            {
                $this->counter++;
            }
        },
    );

    $professional = createProfessional();
    $appointment = Appointment::factory()->confirmed()->create([
        'professional_id' => $professional->id,
    ]);

    $appointment->update(['status' => 'cancelled']);

    expect($invoked)->toBe(0);
});
