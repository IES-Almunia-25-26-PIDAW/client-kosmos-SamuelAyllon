<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Fortify\Features;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered()
    {
        $response = $this->get(route('login'));

        $response->assertOk();
    }

    public function test_users_can_authenticate_using_the_login_screen()
    {
        $this->seed(RoleSeeder::class);
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $user = User::factory()->create(['tutorial_completed_at' => now()]);
        $user->assignRole('professional');

        $response = $this->post('/login', [
            'email'    => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_users_with_two_factor_enabled_are_redirected_to_two_factor_challenge()
    {
        if (! Features::canManageTwoFactorAuthentication()) {
            $this->markTestSkipped('Two-factor authentication is not enabled.');
        }

        Features::twoFactorAuthentication([
            'confirm'         => true,
            'confirmPassword' => true,
        ]);

        $this->seed(RoleSeeder::class);
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $user = User::factory()->create(['tutorial_completed_at' => now()]);
        $user->assignRole('professional');

        $user->forceFill([
            'two_factor_secret'         => encrypt('test-secret'),
            'two_factor_recovery_codes' => encrypt(json_encode(['code1', 'code2'])),
            'two_factor_confirmed_at'   => now(),
        ])->save();

        $response = $this->post('/login', [
            'email'    => $user->email,
            'password' => 'password',
        ]);

        $response->assertRedirect(route('two-factor.login'));
        $response->assertSessionHas('login.id', $user->id);
        $this->assertGuest();
    }

    public function test_users_can_not_authenticate_with_invalid_password()
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'email'    => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_logout()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('logout'));

        $this->assertGuest();
        $response->assertRedirect('/');
    }

    public function test_users_are_rate_limited()
    {
        $user = User::factory()->create();

        // Make 5 failed attempts to exhaust the Fortify rate limit
        for ($i = 0; $i < 5; $i++) {
            $this->post('/login', [
                'email'    => $user->email,
                'password' => 'wrong-password',
            ]);
        }

        // The 6th attempt should be throttled; Fortify returns 429.
        $response = $this->post('/login', [
            'email'    => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertTooManyRequests();
    }
}
