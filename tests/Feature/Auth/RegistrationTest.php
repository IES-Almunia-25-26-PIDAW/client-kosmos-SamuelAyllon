<?php

namespace Tests\Feature\Auth;

use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get(route('register'));

        $response->assertOk();
    }

    public function test_professional_registration_creates_user_with_professional_role_and_profile(): void
    {
        $response = $this->post(route('register'), [
            'type' => 'professional',
            'name' => 'Dr. Test',
            'email' => 'pro@example.com',
            'password' => 'Password1!',
            'password_confirmation' => 'Password1!',
            'collegiate_number' => 'M-12345',
            'license_number' => 'LIC-99',
            'specialties' => ['clinical', 'trauma'],
            'bio' => 'Psicólogo clínico con 10 años de experiencia.',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));

        $user = \App\Models\User::where('email', 'pro@example.com')->first();
        $this->assertTrue($user->hasRole('professional'));
        $this->assertNotNull($user->professionalProfile);
        $this->assertEquals('M-12345', $user->professionalProfile->collegiate_number);
        $this->assertEquals(['clinical', 'trauma'], $user->professionalProfile->specialties);
    }

    public function test_patient_registration_creates_user_with_patient_role_and_profile(): void
    {
        $response = $this->post(route('register'), [
            'type' => 'patient',
            'name' => 'Paciente Test',
            'email' => 'patient@example.com',
            'password' => 'Password1!',
            'password_confirmation' => 'Password1!',
            'phone' => '+34600000000',
            'date_of_birth' => '1990-05-15',
            'consent_privacy_policy' => '1',
            'consent_terms_of_service' => '1',
            'consent_health_data' => '1',
            'consent_recording_global' => '1',
        ]);

        $this->assertAuthenticated();

        $user = \App\Models\User::where('email', 'patient@example.com')->first();
        $this->assertTrue($user->hasRole('patient'));
        $this->assertNotNull($user->patientProfile);
        $this->assertEquals('+34600000000', $user->phone);
    }

    public function test_weak_password_is_rejected(): void
    {
        $response = $this->post(route('register'), [
            'type' => 'professional',
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertSessionHasErrors('password');
        $this->assertGuest();
    }

    public function test_invalid_type_is_rejected(): void
    {
        $response = $this->post(route('register'), [
            'type' => 'admin',
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'Password1!',
            'password_confirmation' => 'Password1!',
        ]);

        $response->assertSessionHasErrors('type');
        $this->assertGuest();
    }
}
