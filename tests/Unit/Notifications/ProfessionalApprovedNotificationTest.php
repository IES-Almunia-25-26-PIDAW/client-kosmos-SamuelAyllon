<?php

declare(strict_types=1);

use App\Models\ProfessionalProfile;
use App\Models\User;
use App\Notifications\ProfessionalApprovedNotification;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    $this->withoutVite();
    app()[PermissionRegistrar::class]->forgetCachedPermissions();
    $this->seed(RoleSeeder::class);
});

it('routes via both mail and database', function () {
    $notification = new ProfessionalApprovedNotification;

    expect($notification->via(new User))->toBe(['mail', 'database']);
});

it('greets the professional by name in the email', function () {
    $professional = User::factory()->create(['name' => 'Lucía Pérez']);

    $mail = (new ProfessionalApprovedNotification)->toMail($professional);

    expect($mail->subject)->toBe('Tu cuenta de Kosmos ha sido aprobada')
        ->and($mail->greeting)->toBe('¡Bienvenido, Lucía Pérez!')
        ->and($mail->actionText)->toBe('Ir a mi panel');
});

it('includes verified_at iso string in the database payload when the profile has a date', function () {
    $professional = createProfessional(); // already builds verified ProfessionalProfile
    $verifiedAt = $professional->professionalProfile?->verified_at;

    expect($verifiedAt)->not->toBeNull();

    $payload = (new ProfessionalApprovedNotification)->toDatabase($professional);

    expect($payload['type'])->toBe('professional_approved')
        ->and($payload['message'])->toContain('aprobada')
        ->and($payload['verified_at'])->toBe($verifiedAt->toIso8601String());
});

it('returns a null verified_at when the user has no professional profile', function () {
    $user = User::factory()->create();

    $payload = (new ProfessionalApprovedNotification)->toDatabase($user);

    expect($payload['verified_at'])->toBeNull();
});

it('returns a null verified_at when the notifiable is not a User instance', function () {
    $payload = (new ProfessionalApprovedNotification)->toDatabase(new stdClass);

    expect($payload['verified_at'])->toBeNull();
});
