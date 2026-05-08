<?php

namespace Tests\Feature\Security;

use App\Models\Note;
use App\Models\PatientProfile;
use App\Models\SessionRecording;
use App\Models\TranscriptionSegment;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

class EncryptedCastsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }

    public function test_user_google_tokens_are_stored_encrypted(): void
    {
        $user = User::factory()->create([
            'google_refresh_token' => 'plain-token-value',
        ]);

        $raw = DB::table('users')->where('id', $user->id)->value('google_refresh_token');
        $this->assertNotEquals('plain-token-value', $raw);
        $this->assertEquals('plain-token-value', $user->fresh()->google_refresh_token);
    }

    public function test_patient_profile_clinical_fields_are_stored_encrypted(): void
    {
        $user = User::factory()->create();
        $profile = PatientProfile::factory()->create([
            'user_id' => $user->id,
            'clinical_notes' => 'Paciente con ansiedad generalizada.',
            'diagnosis' => 'F41.1',
            'treatment_plan' => 'TCC semanal.',
        ]);

        $raw = DB::table('patient_profiles')->where('id', $profile->id)->first();
        $this->assertNotEquals('Paciente con ansiedad generalizada.', $raw->clinical_notes);
        $this->assertNotEquals('F41.1', $raw->diagnosis);
        $this->assertNotEquals('TCC semanal.', $raw->treatment_plan);

        $fresh = $profile->fresh();
        $this->assertEquals('Paciente con ansiedad generalizada.', $fresh->clinical_notes);
        $this->assertEquals('F41.1', $fresh->diagnosis);
    }

    public function test_note_content_is_stored_encrypted(): void
    {
        $user = User::factory()->create();
        $profile = PatientProfile::factory()->create(['user_id' => $user->id]);
        $note = Note::create([
            'patient_id' => $profile->id,
            'user_id' => $user->id,
            'content' => 'Sesión de terapia muy productiva.',
        ]);

        $raw = DB::table('notes')->where('id', $note->id)->value('content');
        $this->assertNotEquals('Sesión de terapia muy productiva.', $raw);
        $this->assertEquals('Sesión de terapia muy productiva.', $note->fresh()->content);
    }

    public function test_session_recording_transcription_is_stored_encrypted(): void
    {
        $recording = SessionRecording::factory()->create([
            'transcription' => 'Hoy hablamos sobre el estrés laboral.',
            'ai_summary' => 'Resumen: paciente experimenta estrés crónico.',
        ]);

        $raw = DB::table('session_recordings')->where('id', $recording->id)->first();
        $this->assertNotEquals('Hoy hablamos sobre el estrés laboral.', $raw->transcription);
        $this->assertNotEquals('Resumen: paciente experimenta estrés crónico.', $raw->ai_summary);

        $fresh = $recording->fresh();
        $this->assertEquals('Hoy hablamos sobre el estrés laboral.', $fresh->transcription);
    }

    public function test_transcription_segment_text_is_stored_encrypted(): void
    {
        $recording = SessionRecording::factory()->create();
        $segment = TranscriptionSegment::create([
            'session_recording_id' => $recording->id,
            'text' => 'Me siento mejor esta semana.',
            'position' => 0,
            'started_at_ms' => 0,
            'ended_at_ms' => 8000,
        ]);

        $raw = DB::table('transcription_segments')->where('id', $segment->id)->value('text');
        $this->assertNotEquals('Me siento mejor esta semana.', $raw);
        $this->assertEquals('Me siento mejor esta semana.', $segment->fresh()->text);
    }
}
