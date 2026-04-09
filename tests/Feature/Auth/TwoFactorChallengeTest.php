<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Features;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

class TwoFactorChallengeTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_two_factor_challenge_redirects_to_login_when_not_authenticated(): void
    {
        if (! Features::canManageTwoFactorAuthentication()) {
            $this->markTestSkipped('Two-factor authentication is not enabled.');
        }

        $response = $this->get(route('two-factor.login'));

        $response->assertRedirect(route('login'));
    }

    public function test_two_factor_challenge_can_be_rendered(): void
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

        $this->post('/login', [
            'email'    => $user->email,
            'password' => 'password',
        ]);

        $this->get(route('two-factor.login'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('auth/two-factor-challenge')
            );
    }
}
