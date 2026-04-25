<?php

use App\Models\CaseAssignment;
use App\Models\ConsentForm;
use App\Models\PatientProfile;
use App\Models\User;
use App\Services\RgpdService;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case + Traits globales para todos los tests Feature de Pest
|--------------------------------------------------------------------------
*/
uses(TestCase::class, RefreshDatabase::class)->in('Feature');

/*
|--------------------------------------------------------------------------
| Antes de cada test: sembrar roles de Spatie y limpiar caché
|--------------------------------------------------------------------------
*/
beforeEach(function () {
    $this->withoutVite();
    app()[PermissionRegistrar::class]->forgetCachedPermissions();
    $this->seed(RoleSeeder::class);
    app()[PermissionRegistrar::class]->forgetCachedPermissions();
})->in('Feature');

/*
|--------------------------------------------------------------------------
| Helpers de usuarios con rol
|--------------------------------------------------------------------------
*/

function ensureRolesExist(): void
{
    foreach (['admin', 'owner', 'professional', 'patient'] as $role) {
        Role::firstOrCreate(
            ['name' => $role, 'guard_name' => 'web']
        );
    }
    app()[PermissionRegistrar::class]->forgetCachedPermissions();
}

/**
 * Crea un usuario administrador con tutorial completado.
 */
function createAdmin(): User
{
    ensureRolesExist();

    $user = User::factory()->create([
        'tutorial_completed_at' => now(),
    ]);
    $user->assignRole('admin');

    return $user;
}

/**
 * Crea un usuario profesional con tutorial completado.
 */
function createProfessional(): User
{
    ensureRolesExist();

    $user = User::factory()->create([
        'tutorial_completed_at' => now(),
    ]);
    $user->assignRole('professional');

    return $user;
}

/**
 * Crea un usuario paciente con tutorial completado, PatientProfile y consentimiento de grabación.
 */
function createPatient(bool $withRecordingConsent = true): User
{
    ensureRolesExist();

    $user = User::factory()->create([
        'tutorial_completed_at' => now(),
    ]);
    $user->assignRole('patient');

    $profile = PatientProfile::factory()->create(['user_id' => $user->id]);

    if ($withRecordingConsent) {
        ConsentForm::create([
            'patient_id' => $profile->id,
            'user_id' => $user->id,
            'consent_type' => RgpdService::CONSENT_RECORDING_GLOBAL,
            'template_version' => '1.0',
            'content_snapshot' => 'Autorizo la grabación de audio de mis sesiones.',
            'status' => 'signed',
            'signed_at' => now(),
            'signed_ip' => '127.0.0.1',
            'signature_data' => 'checkbox_registration',
        ]);
    }

    return $user;
}

/**
 * Perfil clínico vinculado a un profesional (y usuario portal paciente).
 */
function createPatientProfileFor(User $professional, array $overrides = []): PatientProfile
{
    Role::firstOrCreate(['name' => 'patient', 'guard_name' => 'web']);
    app()[PermissionRegistrar::class]->forgetCachedPermissions();

    $portalUser = User::factory()->create();
    $portalUser->assignRole('patient');

    $profile = PatientProfile::factory()->create(array_merge([
        'user_id' => $portalUser->id,
        'professional_id' => $professional->id,
        'workspace_id' => null,
        'is_active' => true,
    ], $overrides));

    CaseAssignment::create([
        'patient_id' => $portalUser->id,
        'professional_id' => $professional->id,
        'is_primary' => true,
        'role' => 'primary',
        'status' => 'active',
        'started_at' => now(),
    ]);

    return $profile;
}
