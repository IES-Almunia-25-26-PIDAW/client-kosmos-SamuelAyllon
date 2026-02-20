<?php

use App\Models\Subscription;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use \Spatie\Permission\Models\Role;
use \Spatie\Permission\PermissionRegistrar;

/*
|--------------------------------------------------------------------------
| Test Case + Traits globales para todos los tests Feature de Pest
|--------------------------------------------------------------------------
*/
uses(TestCase::class, RefreshDatabase::class)->in('Feature');

/*
|--------------------------------------------------------------------------
| Antes de cada test: sembrar roles de Spatie (necesarios para middleware)
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
    foreach (['admin', 'premium_user', 'free_user'] as $role) {
        Role::firstOrCreate(
            ['name' => $role, 'guard_name' => 'web']
        );
    }
    app()[PermissionRegistrar::class]->forgetCachedPermissions();
}

function createAdmin(): User
{
    ensureRolesExist();
    $user = User::factory()->create();
    $user->assignRole('admin');

    return $user;
}

function createPremiumUser(): User
{
    ensureRolesExist();
    $user = User::factory()->create();
    $user->assignRole('premium_user');

    Subscription::create([
        'user_id'    => $user->id,
        'plan'       => 'premium_monthly',
        'status'     => 'active',
        'started_at' => now(),
        'expires_at' => now()->addDays(30),
    ]);

    return $user;
}

function createFreeUser(): User
{
    ensureRolesExist();
    $user = User::factory()->create();
    $user->assignRole('free_user');

    Subscription::create([
        'user_id'    => $user->id,
        'plan'       => 'free',
        'status'     => 'active',
        'started_at' => now(),
        'expires_at' => null,
    ]);

    return $user;
}
