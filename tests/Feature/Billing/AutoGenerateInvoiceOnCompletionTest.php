<?php

use App\Models\Appointment;
use App\Models\Invoice;
use App\Models\OfferedConsultation;
use App\Models\ProfessionalProfile;

it('creates a draft invoice when an appointment transitions to completed', function () {
    $professional = createProfessional();
    $patient = createPatient();
    $profProfile = ProfessionalProfile::factory()->create(['user_id' => $professional->id]);
    $service = OfferedConsultation::factory()->create([
        'professional_profile_id' => $profProfile->id,
        'price' => 60,
        'name' => 'Sesión EMDR',
    ]);

    $appointment = Appointment::factory()->inProgress()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'service_id' => $service->id,
        'workspace_id' => null,
    ]);

    expect(Invoice::count())->toBe(0);

    $appointment->update(['status' => 'completed']);

    $invoice = Invoice::first();
    expect($invoice)->not->toBeNull()
        ->and($invoice->status)->toBe('draft')
        ->and((float) $invoice->total)->toBe(60.0)
        ->and($invoice->patient_id)->toBe($patient->id)
        ->and($invoice->professional_id)->toBe($professional->id);

    expect($invoice->items()->first()->appointment_id)->toBe($appointment->id);
    expect($invoice->items()->first()->description)->toBe('Sesión EMDR');
});

it('is idempotent: does not duplicate invoice when status is set to completed twice', function () {
    $professional = createProfessional();
    $patient = createPatient();
    $profProfile = ProfessionalProfile::factory()->create(['user_id' => $professional->id]);
    $service = OfferedConsultation::factory()->create([
        'professional_profile_id' => $profProfile->id,
        'price' => 50,
    ]);

    $appointment = Appointment::factory()->inProgress()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'service_id' => $service->id,
        'workspace_id' => null,
    ]);

    $appointment->update(['status' => 'completed']);
    $appointment->update(['status' => 'in_progress']);
    $appointment->update(['status' => 'completed']);

    expect(Invoice::count())->toBe(1);
});

it('does not generate an invoice for non-completed status changes', function () {
    $professional = createProfessional();
    $patient = createPatient();
    $profProfile = ProfessionalProfile::factory()->create(['user_id' => $professional->id]);
    $service = OfferedConsultation::factory()->create([
        'professional_profile_id' => $profProfile->id,
        'price' => 60,
    ]);

    $appointment = Appointment::factory()->confirmed()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'service_id' => $service->id,
        'workspace_id' => null,
    ]);

    $appointment->update(['status' => 'cancelled']);
    $appointment->update(['status' => 'in_progress']);

    expect(Invoice::count())->toBe(0);
});

it('skips generation gracefully when appointment has no service', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->inProgress()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'service_id' => null,
        'workspace_id' => null,
    ]);

    $appointment->update(['status' => 'completed']);

    expect(Invoice::count())->toBe(0);
});
