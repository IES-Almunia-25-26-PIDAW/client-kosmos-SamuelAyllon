<?php

use App\Models\Agreement;
use App\Models\Appointment;
use App\Models\KosmoBriefing;
use App\Models\Note;
use App\Models\SessionRecording;
use App\Services\KosmoService;

it('creates a post-session briefing with parsed AI summary, notes and agreements', function () {
    $professional = createProfessional();
    $patient = createPatientProfileFor($professional);

    $appointment = Appointment::factory()->completed()->create([
        'patient_id' => $patient->user_id,
        'professional_id' => $professional->id,
    ]);

    SessionRecording::factory()->create([
        'appointment_id' => $appointment->id,
        'ai_summary' => json_encode([
            'key_points' => ['punto a', 'punto b'],
            'patient_state' => 'estable',
            'next_actions' => ['tarea x'],
        ]),
    ]);

    Note::create([
        'patient_id' => $patient->id,
        'user_id' => $professional->id,
        'appointment_id' => $appointment->id,
        'content' => 'Avance significativo en exposición.',
        'type' => 'session_note',
    ]);

    Agreement::create([
        'patient_id' => $patient->id,
        'user_id' => $professional->id,
        'appointment_id' => $appointment->id,
        'is_completed' => false,
        'content' => 'Practicar respiración 5 min al día.',
    ]);

    app(KosmoService::class)->generatePostSessionBriefing($appointment);

    $briefing = KosmoBriefing::where('appointment_id', $appointment->id)
        ->where('type', 'post_session')
        ->first();

    expect($briefing)->not->toBeNull()
        ->and($briefing->user_id)->toBe($professional->id)
        ->and($briefing->patient_id)->toBe($patient->id)
        ->and($briefing->content['key_points'])->toBe(['punto a', 'punto b'])
        ->and($briefing->content['patient_state'])->toBe('estable')
        ->and($briefing->content['next_actions'])->toBe(['tarea x'])
        ->and($briefing->content['session_notes'])->toContain('Avance significativo en exposición.')
        ->and($briefing->content['open_agreements'])->toContain('Practicar respiración 5 min al día.')
        ->and($briefing->content['summary_status'])->toBe('ready');
});

it('is idempotent across multiple calls', function () {
    $professional = createProfessional();
    $patient = createPatientProfileFor($professional);

    $appointment = Appointment::factory()->completed()->create([
        'patient_id' => $patient->user_id,
        'professional_id' => $professional->id,
    ]);

    $service = app(KosmoService::class);
    $service->generatePostSessionBriefing($appointment);
    $service->generatePostSessionBriefing($appointment);

    expect(KosmoBriefing::where('appointment_id', $appointment->id)->where('type', 'post_session')->count())->toBe(1);
});
