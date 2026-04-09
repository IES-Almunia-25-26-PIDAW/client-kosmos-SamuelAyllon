<?php

namespace Tests\Feature\Auth;

use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered()
    {
        $response = $this->get(route('register'));

        $response->assertOk();
    }

    public function test_new_users_can_register()
    {
        $this->seed(RoleSeeder::class);
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $response = $this->post(route('register'), [
            'name'                  => 'Test User',
            'email'                 => 'test@example.com',
            'password'              => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_new_user_gets_professional_role_on_register()
    {
        $this->seed(RoleSeeder::class);
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $this->post(route('register'), [
            'name'                  => 'Test User',
            'email'                 => 'test@example.com',
            'password'              => 'password',
            'password_confirmation' => 'password',
        ]);

        $user = \App\Models\User::where('email', 'test@example.com')->first();
        $this->assertTrue($user->hasRole('professional'));
    }
}
