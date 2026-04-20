<?php

use App\Models\CaseAssignment;
use App\Models\PatientProfile;
use App\Models\User;
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
 * Crea un usuario paciente con tutorial completado.
 */
function createPatient(): User
{
    ensureRolesExist();

    $user = User::factory()->create([
        'tutorial_completed_at' => now(),
    ]);
    $user->assignRole('patient');

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
