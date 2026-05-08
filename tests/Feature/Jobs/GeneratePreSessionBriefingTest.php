<?php

use App\Jobs\GeneratePreSessionBriefing;
use App\Models\Appointment;
use App\Models\KosmoBriefing;

it('creates a pre-session briefing for appointments starting within 30 minutes', function () {
    $professional = createProfessional();
    $patient = createPatientProfileFor($professional);

    $appointment = Appointment::factory()->confirmed()->create([
        'patient_id' => $patient->user_id,
        'professional_id' => $professional->id,
        'starts_at' => now()->addMinutes(15),
        'ends_at' => now()->addMinutes(65),
    ]);

    (new GeneratePreSessionBriefing)->handle(app(\App\Services\KosmoService::class));

    expect(KosmoBriefing::where('appointment_id', $appointment->id)->where('type', 'pre_session')->exists())->toBeTrue();
});

it('does not duplicate briefings on repeated runs', function () {
    $professional = createProfessional();
    $patient = createPatientProfileFor($professional);

    $appointment = Appointment::factory()->confirmed()->create([
        'patient_id' => $patient->user_id,
        'professional_id' => $professional->id,
        'starts_at' => now()->addMinutes(10),
        'ends_at' => now()->addMinutes(60),
    ]);

    $job = new GeneratePreSessionBriefing;
    $service = app(\App\Services\KosmoService::class);

    $job->handle($service);
    $job->handle($service);

    expect(KosmoBriefing::where('appointment_id', $appointment->id)->where('type', 'pre_session')->count())->toBe(1);
});

it('skips appointments outside the 30-minute window', function () {
    $professional = createProfessional();
    $patient = createPatientProfileFor($professional);

    Appointment::factory()->confirmed()->create([
        'patient_id' => $patient->user_id,
        'professional_id' => $professional->id,
        'starts_at' => now()->addHours(3),
        'ends_at' => now()->addHours(4),
    ]);

    (new GeneratePreSessionBriefing)->handle(app(\App\Services\KosmoService::class));

    expect(KosmoBriefing::where('type', 'pre_session')->count())->toBe(0);
});
