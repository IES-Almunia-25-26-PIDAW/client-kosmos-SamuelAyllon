<?php

use App\Models\Appointment;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\RateLimiter;

it('rate-limits the transcribe endpoint to 30 requests per minute', function () {
    RateLimiter::clear('throttle:30,1');

    $professional = createProfessional();
    $patient = createPatient();
    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'status' => 'in_progress',
        'workspace_id' => null,
        'starts_at' => now()->subMinutes(5),
        'ends_at' => now()->addMinutes(45),
    ]);

    $this->actingAs($professional);

    for ($i = 0; $i < 30; $i++) {
        $response = $this->post(
            "/appointments/{$appointment->id}/transcribe",
            ['chunk' => UploadedFile::fake()->create("c{$i}.webm", 50, 'audio/webm')],
        );
        expect($response->status())->not->toBe(429);
    }

    $blocked = $this->post(
        "/appointments/{$appointment->id}/transcribe",
        ['chunk' => UploadedFile::fake()->create('over.webm', 50, 'audio/webm')],
    );

    expect($blocked->status())->toBe(429);
});
