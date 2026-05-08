<?php

use App\Jobs\TranscribeChunkJob;
use App\Models\Appointment;
use App\Models\SessionRecording;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;

function fakeAudioChunk(): UploadedFile
{
    return UploadedFile::fake()->createWithContent('chunk.webm', random_bytes(1024));
}

it('professional can upload a chunk and dispatches the transcription job', function () {
    Queue::fake();

    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    $this->actingAs($professional)
        ->post(route('appointments.transcribe', $appointment), [
            'chunk' => fakeAudioChunk(),
            'position' => 0,
            'started_at_ms' => 0,
            'ended_at_ms' => 8000,
        ])
        ->assertOk()
        ->assertJson(['status' => 'queued', 'position' => 0]);

    Queue::assertPushed(TranscribeChunkJob::class, function ($job) use ($professional) {
        return $job->speakerUserId === $professional->id
            && $job->position === 0
            && $job->startedAtMs === 0
            && $job->endedAtMs === 8000;
    });

    expect(SessionRecording::where('appointment_id', $appointment->id)->exists())->toBeTrue();
});

it('patient cannot upload a chunk without giving consent first', function () {
    Queue::fake();

    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    $this->actingAs($patient)
        ->post(route('appointments.transcribe', $appointment), [
            'chunk' => fakeAudioChunk(),
            'position' => 0,
            'started_at_ms' => 0,
            'ended_at_ms' => 8000,
        ])
        ->assertForbidden();

    Queue::assertNothingPushed();
});

it('patient can upload a chunk after granting consent', function () {
    Queue::fake();

    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    SessionRecording::factory()->withPatientConsent()->create([
        'appointment_id' => $appointment->id,
    ]);

    $this->actingAs($patient)
        ->post(route('appointments.transcribe', $appointment), [
            'chunk' => fakeAudioChunk(),
            'position' => 3,
            'started_at_ms' => 24000,
            'ended_at_ms' => 32000,
        ])
        ->assertOk();

    Queue::assertPushed(TranscribeChunkJob::class, fn ($job) => $job->speakerUserId === $patient->id);
});

it('a third-party user cannot transcribe', function () {
    Queue::fake();

    $stranger = createProfessional();
    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    $this->actingAs($stranger)
        ->post(route('appointments.transcribe', $appointment), [
            'chunk' => fakeAudioChunk(),
            'position' => 0,
            'started_at_ms' => 0,
            'ended_at_ms' => 8000,
        ])
        ->assertForbidden();

    Queue::assertNothingPushed();
});

it('stores the chunk encrypted on disk and not as raw bytes', function () {
    Storage::fake('local');
    Queue::fake();

    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    $rawBytes = "RIFFmarker\x00WEBM-fake-payload-bytes";
    $upload = UploadedFile::fake()->createWithContent('chunk.webm', $rawBytes);

    $this->actingAs($professional)
        ->post(route('appointments.transcribe', $appointment), [
            'chunk' => $upload,
            'position' => 0,
            'started_at_ms' => 0,
            'ended_at_ms' => 8000,
        ])
        ->assertOk();

    $files = Storage::disk('local')->allFiles();
    $chunkFile = collect($files)->first(fn (string $f) => str_contains($f, 'transcription-chunks/'));

    expect($chunkFile)->not->toBeNull();
    expect($chunkFile)->toEndWith('.enc');

    $stored = Storage::disk('local')->get($chunkFile);
    expect($stored)->not->toContain($rawBytes);
    expect(Crypt::decryptString($stored))->toBe($rawBytes);
});

it('validates chunk, position and timestamps', function () {
    $professional = createProfessional();
    $patient = createPatient();

    $appointment = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'workspace_id' => null,
    ]);

    $this->actingAs($professional)
        ->post(route('appointments.transcribe', $appointment), [
            'chunk' => fakeAudioChunk(),
            'position' => 0,
            'started_at_ms' => 5000,
            'ended_at_ms' => 3000,
        ])
        ->assertSessionHasErrors('ended_at_ms');
});
