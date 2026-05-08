<?php

use App\Events\SessionSummarized;
use App\Listeners\GeneratePostSessionBriefingOnSummarized;
use App\Models\Appointment;
use App\Models\KosmoBriefing;
use App\Models\SessionRecording;
use App\Services\KosmoService;

it('creates a post-session briefing when SessionSummarized fires', function () {
    $professional = createProfessional();
    $patient = createPatientProfileFor($professional);

    $appointment = Appointment::factory()->completed()->create([
        'patient_id' => $patient->user_id,
        'professional_id' => $professional->id,
    ]);

    SessionRecording::factory()->create([
        'appointment_id' => $appointment->id,
        'ai_summary' => json_encode(['key_points' => ['x'], 'patient_state' => 'ok', 'next_actions' => []]),
    ]);

    $listener = new GeneratePostSessionBriefingOnSummarized(app(KosmoService::class));
    $listener->handle(new SessionSummarized($appointment->id, '{"key_points":["x"]}'));

    expect(KosmoBriefing::where('appointment_id', $appointment->id)->where('type', 'post_session')->exists())->toBeTrue();
});
