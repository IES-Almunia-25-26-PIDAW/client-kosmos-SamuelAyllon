<?php

declare(strict_types=1);

use App\Models\Invoice;
use App\Policies\PaymentPolicy;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    $this->withoutVite();
    app()[PermissionRegistrar::class]->forgetCachedPermissions();
    $this->seed(RoleSeeder::class);
    $this->policy = new PaymentPolicy;
});

it('viewAny is allowed for admin and professional, denied for patient', function () {
    expect($this->policy->viewAny(createAdmin()))->toBeTrue()
        ->and($this->policy->viewAny(createProfessional()))->toBeTrue()
        ->and($this->policy->viewAny(createPatient()))->toBeFalse();
});

it('view/update/delete are only allowed to the issuing professional', function () {
    $professional = createProfessional();
    $other = createProfessional();
    $invoice = Invoice::factory()->sent()->create(['professional_id' => $professional->id]);

    expect($this->policy->view($professional, $invoice))->toBeTrue()
        ->and($this->policy->view($other, $invoice))->toBeFalse()
        ->and($this->policy->update($professional, $invoice))->toBeTrue()
        ->and($this->policy->update($other, $invoice))->toBeFalse()
        ->and($this->policy->delete($professional, $invoice))->toBeTrue()
        ->and($this->policy->delete($other, $invoice))->toBeFalse();
});

it('create is only allowed for a professional', function () {
    expect($this->policy->create(createProfessional()))->toBeTrue()
        ->and($this->policy->create(createAdmin()))->toBeFalse()
        ->and($this->policy->create(createPatient()))->toBeFalse();
});

it('pay allows the issuing professional when the invoice is in sent status', function () {
    $professional = createProfessional();
    $invoice = Invoice::factory()->sent()->create(['professional_id' => $professional->id]);

    expect($this->policy->pay($professional, $invoice))->toBeTrue();
});

it('pay allows the billed patient when the invoice is in sent status', function () {
    $patient = createPatient();
    $invoice = Invoice::factory()->sent()->create(['patient_id' => $patient->id]);

    expect($this->policy->pay($patient, $invoice))->toBeTrue();
});

it('pay denies any user that is neither issuer nor payer', function () {
    $stranger = createProfessional();
    $invoice = Invoice::factory()->sent()->create();

    expect($this->policy->pay($stranger, $invoice))->toBeFalse();
});

it('pay denies when the invoice is not in sent status (draft, paid, overdue)', function (string $state) {
    $professional = createProfessional();
    $invoice = Invoice::factory()->{$state}()->create(['professional_id' => $professional->id]);

    expect($this->policy->pay($professional, $invoice))->toBeFalse();
})->with(['draft', 'paid', 'overdue', 'cancelled']);
