<?php

namespace Tests\Feature\Security;

use App\Events\TranscriptionSegmentCreated;
use App\Jobs\TranscribeChunkJob;
use App\Models\Appointment;
use App\Models\ConsentForm;
use App\Models\PatientProfile;
use App\Models\SessionRecording;
use App\Models\User;
use App\Services\RgpdService;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Spatie\Activitylog\Models\Activity;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

class TranscribeChunkConsentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }

    private function makePatientWithConsent(string $status = 'signed'): array
    {
        $patient = User::factory()->create();
        $patient->assignRole('patient');
        $professional = User::factory()->create();
        $professional->assignRole('professional');

        $profile = PatientProfile::factory()->create(['user_id' => $patient->id]);

        $appointment = Appointment::factory()->create([
            'patient_id' => $patient->id,
            'professional_id' => $professional->id,
            'status' => 'in_progress',
        ]);

        $recording = SessionRecording::factory()->create([
            'appointment_id' => $appointment->id,
            'transcription_status' => 'pending',
        ]);

        if ($status !== 'none') {
            ConsentForm::create([
                'patient_id' => $profile->id,
                'user_id' => $patient->id,
                'consent_type' => RgpdService::CONSENT_RECORDING_GLOBAL,
                'template_version' => '1.0',
                'content_snapshot' => 'Autorizo...',
                'status' => $status,
                'signed_at' => $status === 'signed' ? now() : null,
                'signed_ip' => '127.0.0.1',
                'signature_data' => 'checkbox_registration',
            ]);
        }

        return [$recording, $patient];
    }

    public function test_transcription_is_skipped_when_consent_is_revoked(): void
    {
        Storage::fake('local');

        [$recording, $patient] = $this->makePatientWithConsent('revoked');

        $chunkPath = 'chunks/test-chunk.webm';
        Storage::disk('local')->put($chunkPath, Crypt::encryptString('fake-audio-data'));

        Http::fake();

        (new TranscribeChunkJob(
            sessionRecordingId: $recording->id,
            speakerUserId: null,
            position: 0,
            startedAtMs: 0,
            endedAtMs: 8000,
            chunkPath: $chunkPath,
        ))->handle(app(RgpdService::class));

        $this->assertEquals('rejected_no_consent', $recording->fresh()->transcription_status);
        Storage::disk('local')->assertMissing($chunkPath);
        Http::assertNothingSent();

        // [RNF-09] Audit log for RGPD: rejection MUST be recorded.
        $activity = Activity::query()
            ->where('event', 'chunk_rejected_no_consent')
            ->where('subject_type', $recording->getMorphClass())
            ->where('subject_id', $recording->id)
            ->latest('id')
            ->first();

        $this->assertNotNull($activity, 'Expected activity_log entry chunk_rejected_no_consent');
        $this->assertSame('rgpd_access', $activity->log_name);
        $this->assertSame($patient->id, $activity->causer_id);
        $this->assertSame(0, $activity->properties['position']);
    }

    public function test_transcription_is_skipped_when_no_consent_exists(): void
    {
        Storage::fake('local');

        [$recording] = $this->makePatientWithConsent('none');

        $chunkPath = 'chunks/test-chunk.webm';
        Storage::disk('local')->put($chunkPath, Crypt::encryptString('fake-audio-data'));

        Http::fake();

        (new TranscribeChunkJob(
            sessionRecordingId: $recording->id,
            speakerUserId: null,
            position: 0,
            startedAtMs: 0,
            endedAtMs: 8000,
            chunkPath: $chunkPath,
        ))->handle(app(RgpdService::class));

        $this->assertEquals('rejected_no_consent', $recording->fresh()->transcription_status);
        Http::assertNothingSent();

        // [RNF-09] Audit log for RGPD: rejection MUST be recorded even when no consent ever existed.
        $this->assertDatabaseHas('activity_log', [
            'event' => 'chunk_rejected_no_consent',
            'log_name' => 'rgpd_access',
            'subject_type' => $recording->getMorphClass(),
            'subject_id' => $recording->id,
        ]);
    }

    public function test_transcription_proceeds_when_consent_is_active(): void
    {
        Storage::fake('local');
        Event::fake([TranscriptionSegmentCreated::class]);

        [$recording] = $this->makePatientWithConsent('signed');

        $chunkPath = 'chunks/test-chunk.webm';
        Storage::disk('local')->put($chunkPath, Crypt::encryptString('fake-audio-data'));

        Http::fake([
            '*/audio/transcriptions' => Http::response(['text' => 'texto transcrito'], 200),
        ]);

        (new TranscribeChunkJob(
            sessionRecordingId: $recording->id,
            speakerUserId: null,
            position: 0,
            startedAtMs: 0,
            endedAtMs: 8000,
            chunkPath: $chunkPath,
        ))->handle(app(RgpdService::class));

        Http::assertSentCount(1);
        $this->assertEquals(1, $recording->transcriptionSegments()->count());
    }
}
