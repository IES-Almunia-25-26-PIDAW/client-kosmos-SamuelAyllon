<?php

namespace Tests\Feature\Security;

use App\Models\ConsentForm;
use App\Models\PatientProfile;
use App\Models\User;
use App\Services\RgpdService;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

class RgpdConsentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }

    public function test_patient_registration_requires_all_four_consents(): void
    {
        $payload = [
            'type' => 'patient',
            'name' => 'Ana Test',
            'email' => 'ana@test.com',
            'password' => 'Password1!',
            'password_confirmation' => 'Password1!',
            // Sin los 4 checkboxes
        ];

        $response = $this->post(route('register'), $payload);
        $response->assertSessionHasErrors([
            'consent_privacy_policy',
            'consent_terms_of_service',
            'consent_health_data',
            'consent_recording_global',
        ]);
        $this->assertGuest();
    }

    public function test_patient_registration_stores_four_consent_forms(): void
    {
        $response = $this->post(route('register'), [
            'type' => 'patient',
            'name' => 'Ana Test',
            'email' => 'ana@test.com',
            'password' => 'Password1!',
            'password_confirmation' => 'Password1!',
            'consent_privacy_policy' => '1',
            'consent_terms_of_service' => '1',
            'consent_health_data' => '1',
            'consent_recording_global' => '1',
        ]);

        $this->assertAuthenticated();

        $user = User::where('email', 'ana@test.com')->first();
        $profile = $user->patientProfile;

        $this->assertNotNull($profile);
        $this->assertEquals(4, $profile->consentForms()->where('status', 'signed')->count());
        $this->assertTrue($profile->consentForms()->where('consent_type', 'recording_global')->where('status', 'signed')->exists());
    }

    public function test_has_active_recording_consent_returns_true_when_signed(): void
    {
        $user = User::factory()->create();
        $user->assignRole('patient');
        $profile = PatientProfile::factory()->create(['user_id' => $user->id]);

        ConsentForm::create([
            'patient_id' => $profile->id,
            'user_id' => $user->id,
            'consent_type' => RgpdService::CONSENT_RECORDING_GLOBAL,
            'template_version' => '1.0',
            'content_snapshot' => 'Autorizo grabación...',
            'status' => 'signed',
            'signed_at' => now(),
            'signed_ip' => '127.0.0.1',
            'signature_data' => 'checkbox_registration',
        ]);

        $service = app(RgpdService::class);
        $this->assertTrue($service->hasActiveRecordingConsent($user));
    }

    public function test_has_active_recording_consent_returns_false_when_revoked(): void
    {
        $user = User::factory()->create();
        $user->assignRole('patient');
        $profile = PatientProfile::factory()->create(['user_id' => $user->id]);

        ConsentForm::create([
            'patient_id' => $profile->id,
            'user_id' => $user->id,
            'consent_type' => RgpdService::CONSENT_RECORDING_GLOBAL,
            'template_version' => '1.0',
            'content_snapshot' => 'Autorizo grabación...',
            'status' => 'revoked',
            'signed_at' => null,
            'signed_ip' => '127.0.0.1',
            'signature_data' => 'checkbox_registration',
        ]);

        $service = app(RgpdService::class);
        $this->assertFalse($service->hasActiveRecordingConsent($user));
    }

    public function test_has_active_recording_consent_returns_false_when_no_consent(): void
    {
        $user = User::factory()->create();
        $user->assignRole('patient');
        PatientProfile::factory()->create(['user_id' => $user->id]);

        $service = app(RgpdService::class);
        $this->assertFalse($service->hasActiveRecordingConsent($user));
    }
}
