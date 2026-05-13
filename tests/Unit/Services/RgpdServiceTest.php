<?php

declare(strict_types=1);

use App\Models\ConsentForm;
use App\Models\PatientProfile;
use App\Models\User;
use App\Services\RgpdService;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    $this->withoutVite();
    app()[PermissionRegistrar::class]->forgetCachedPermissions();
    $this->seed(RoleSeeder::class);
    $this->service = new RgpdService;
});

function makeRgpdConsent(PatientProfile $profile, array $overrides = []): ConsentForm
{
    return ConsentForm::create(array_merge([
        'patient_id' => $profile->id,
        'user_id' => $profile->user_id,
        'consent_type' => RgpdService::CONSENT_HEALTH_DATA,
        'template_version' => '1.0',
        'content_snapshot' => 'snapshot',
        'status' => 'signed',
        'signed_at' => now(),
        'signed_ip' => '127.0.0.1',
        'signature_data' => 'checkbox_test',
    ], $overrides));
}

it('hasValidConsent returns true when at least one signed non-expired consent exists', function () {
    $user = User::factory()->create();
    $profile = PatientProfile::factory()->create(['user_id' => $user->id]);
    makeRgpdConsent($profile);

    expect($this->service->hasValidConsent($profile))->toBeTrue();
});

it('hasValidConsent returns false when all consents are revoked', function () {
    $user = User::factory()->create();
    $profile = PatientProfile::factory()->create(['user_id' => $user->id]);
    makeRgpdConsent($profile, ['status' => 'revoked']);

    expect($this->service->hasValidConsent($profile))->toBeFalse();
});

it('hasValidConsent returns false when the consent is expired', function () {
    $user = User::factory()->create();
    $profile = PatientProfile::factory()->create(['user_id' => $user->id]);
    makeRgpdConsent($profile, ['expires_at' => Carbon::now()->subDay()]);

    expect($this->service->hasValidConsent($profile))->toBeFalse();
});

it('getExpiringConsents returns only consents expiring inside the window', function () {
    $user = User::factory()->create();
    $profile = PatientProfile::factory()->create(['user_id' => $user->id]);

    $insideWindow = makeRgpdConsent($profile, ['expires_at' => Carbon::now()->addDays(10)]);
    makeRgpdConsent($profile, ['expires_at' => Carbon::now()->addDays(45)]); // outside
    makeRgpdConsent($profile, ['expires_at' => null]); // never expires
    makeRgpdConsent($profile, [
        'status' => 'revoked',
        'expires_at' => Carbon::now()->addDays(5),
    ]); // not signed

    $expiring = $this->service->getExpiringConsents($profile, daysAhead: 30);

    expect($expiring)->toHaveCount(1)
        ->and($expiring->first()->id)->toBe($insideWindow->id);
});

it('revokeConsent flips status to revoked and clears signed_at', function () {
    $user = User::factory()->create();
    $profile = PatientProfile::factory()->create(['user_id' => $user->id]);
    $form = makeRgpdConsent($profile);

    $this->service->revokeConsent($form);

    $form->refresh();
    expect($form->status)->toBe('revoked')
        ->and($form->signed_at)->toBeNull();
});

it('exposes the four registration consent types as a public constant', function () {
    expect(RgpdService::REGISTRATION_CONSENT_TYPES)->toHaveCount(4)
        ->and(RgpdService::REGISTRATION_CONSENT_TYPES)->toContain(
            RgpdService::CONSENT_PRIVACY_POLICY,
            RgpdService::CONSENT_TERMS_OF_SERVICE,
            RgpdService::CONSENT_HEALTH_DATA,
            RgpdService::CONSENT_RECORDING_GLOBAL,
        );
});
