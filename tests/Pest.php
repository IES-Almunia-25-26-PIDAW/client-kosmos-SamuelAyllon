<?php

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
})->in('Feature');

/*
|--------------------------------------------------------------------------
| Helpers de usuarios con rol
|--------------------------------------------------------------------------
*/

function ensureRolesExist(): void
{
    foreach (['admin', 'professional'] as $role) {
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
