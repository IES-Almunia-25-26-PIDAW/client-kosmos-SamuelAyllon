<?php

use App\Models\CaseAssignment;
use App\Models\ConsentForm;
use App\Models\PatientProfile;
use App\Models\ProfessionalProfile;
use App\Models\User;
use App\Services\RgpdService;
use Database\Seeders\RoleSeeder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Assert;
use Spatie\Activitylog\Models\Activity;
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
function createProfessional(bool $verified = true): User
{
    ensureRolesExist();

    $user = User::factory()->create([
        'tutorial_completed_at' => now(),
    ]);
    $user->assignRole('professional');

    if ($verified) {
        ProfessionalProfile::factory()->verified()->create(['user_id' => $user->id]);
    }

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

/*
|--------------------------------------------------------------------------
| Audit log assertions (Spatie ActivityLog)
|--------------------------------------------------------------------------
*/

/**
 * Asserts that an activity_log row matches the given filter.
 *
 * @param  array<string, mixed>  $filter  Keys: event, log_name, description, subject_type, subject_id, causer_id.
 */
function assertActivityLogged(array $filter): Activity
{
    $query = Activity::query();

    foreach ($filter as $column => $value) {
        $query->where($column, $value);
    }

    /** @var Activity|null $activity */
    $activity = $query->latest('id')->first();

    Assert::assertNotNull(
        $activity,
        'Failed asserting that an activity_log row exists matching: '.json_encode($filter, JSON_UNESCAPED_SLASHES)
    );

    return $activity;
}

/**
 * Asserts that the latest activity_log row for the given subject matches the description.
 */
function assertActivityLoggedFor(Model $subject, string $description): Activity
{
    return assertActivityLogged([
        'subject_type' => $subject->getMorphClass(),
        'subject_id' => $subject->getKey(),
        'description' => $description,
    ]);
}
