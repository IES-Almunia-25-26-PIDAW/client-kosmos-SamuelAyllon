<?php

use App\Models\User;
use App\Services\GoogleAuthService;
use Mockery\MockInterface;

beforeEach(function () {
    config()->set('services.google.client_id', 'test-client-id');
    config()->set('services.google.client_secret', 'test-secret');
    config()->set('services.google.redirect_uri', 'http://localhost/auth/google/callback');
});

/** @param array<string, mixed> $overrides */
function googleProfile(array $overrides = []): array
{
    return array_merge([
        'google_id' => '1234567890',
        'email' => 'jane@example.com',
        'name' => 'Jane Doe',
        'avatar_url' => null,
        'email_verified' => true,
        'refresh_token' => 'rt-abc',
    ], $overrides);
}

function mockGoogleService(array $profile): void
{
    test()->mock(GoogleAuthService::class, function (MockInterface $m) use ($profile) {
        $m->shouldReceive('createAuthUrl')->andReturn('https://accounts.google.com/o/oauth2/auth?...');
        $m->shouldReceive('handleCallback')->andReturn($profile);
    });
}

it('redirects to Google with state stored in session when registering as professional', function () {
    mockGoogleService(googleProfile());

    $response = $this->get('/auth/google/redirect?intent=register&type=professional');

    $response->assertRedirect();
    expect(session('google_oauth.state'))->not->toBeNull()
        ->and(session('google_oauth.intent'))->toBe('register')
        ->and(session('google_oauth.type'))->toBe('professional');
});

it('rejects register intent without role', function () {
    $response = $this->get('/auth/google/redirect?intent=register');

    $response->assertRedirect(route('register'));
    $response->assertSessionHasErrors(['google']);
});

it('rejects callback with mismatching state', function () {
    mockGoogleService(googleProfile());

    $this->withSession(['google_oauth' => ['state' => 'real', 'intent' => 'login', 'type' => null]]);

    $response = $this->get('/auth/google/callback?state=fake&code=abc');

    $response->assertRedirect(route('login'));
    $response->assertSessionHasErrors(['google']);
    $this->assertGuest();
});

it('logs in an existing user matched by google_id and goes straight to dashboard when calendar is already connected', function () {
    $user = createProfessional();
    $user->forceFill(['google_id' => '1234567890', 'google_refresh_token' => 'existing-rt'])->save();

    mockGoogleService(googleProfile());

    $this->withSession(['google_oauth' => ['state' => 's', 'intent' => 'login', 'type' => null]]);

    $response = $this->get('/auth/google/callback?state=s&code=abc');

    $response->assertRedirect(route('dashboard'));
    $this->assertAuthenticatedAs($user->fresh());
});

it('redirects professional without google_refresh_token to calendar connect after login', function () {
    $user = createProfessional();
    $user->forceFill(['google_id' => '1234567890', 'google_refresh_token' => null])->save();

    mockGoogleService(googleProfile(['refresh_token' => null]));

    $this->withSession(['google_oauth' => ['state' => 's', 'intent' => 'login', 'type' => null]]);

    $response = $this->get('/auth/google/callback?state=s&code=abc');

    $response->assertRedirect(route('settings.google.redirect'));
    $this->assertAuthenticatedAs($user->fresh());
});

it('links Google to an existing local account by email and stores the refresh token', function () {
    $user = createProfessional();
    $user->forceFill(['email' => 'jane@example.com', 'google_id' => null])->save();

    mockGoogleService(googleProfile());

    $this->withSession(['google_oauth' => ['state' => 's', 'intent' => 'login', 'type' => null]]);

    $this->get('/auth/google/callback?state=s&code=abc')
        ->assertRedirect(route('dashboard'));

    $fresh = $user->fresh();
    expect($fresh->google_id)->toBe('1234567890')
        ->and($fresh->google_refresh_token)->toBe('rt-abc');
    $this->assertAuthenticatedAs($fresh);
});

it('blocks role mismatch when registering with an email that belongs to another role', function () {
    $patient = createPatient();
    $patient->forceFill(['email' => 'jane@example.com'])->save();

    mockGoogleService(googleProfile());

    $this->withSession(['google_oauth' => ['state' => 's', 'intent' => 'register', 'type' => 'professional']]);

    $response = $this->get('/auth/google/callback?state=s&code=abc');

    $response->assertRedirect(route('login'));
    $response->assertSessionHasErrors(['google']);
    expect($patient->fresh()->google_id)->toBeNull();
    $this->assertGuest();
});

it('creates a professional account on first Google sign-up', function () {
    ensureRolesExist();
    mockGoogleService(googleProfile());

    $this->withSession(['google_oauth' => ['state' => 's', 'intent' => 'register', 'type' => 'professional']]);

    $this->get('/auth/google/callback?state=s&code=abc')
        ->assertRedirect(route('dashboard'));

    $user = User::query()->where('email', 'jane@example.com')->firstOrFail();

    expect($user->google_id)->toBe('1234567890')
        ->and($user->hasRole('professional'))->toBeTrue()
        ->and($user->professionalProfile)->not->toBeNull()
        ->and($user->professionalProfile->verification_status)->toBe('pending')
        ->and($user->google_refresh_token)->toBe('rt-abc');
});

it('redirects new patient to consents page without creating the user yet', function () {
    ensureRolesExist();
    mockGoogleService(googleProfile());

    $this->withSession(['google_oauth' => ['state' => 's', 'intent' => 'register', 'type' => 'patient']]);

    $response = $this->get('/auth/google/callback?state=s&code=abc');

    $response->assertRedirect(route('auth.google.patient-consents'));
    expect(User::query()->where('email', 'jane@example.com')->exists())->toBeFalse()
        ->and(session('pending_google_patient.google_id'))->toBe('1234567890');
    $this->assertGuest();
});

it('refuses to log in unknown users on login intent', function () {
    ensureRolesExist();
    mockGoogleService(googleProfile());

    $this->withSession(['google_oauth' => ['state' => 's', 'intent' => 'login', 'type' => null]]);

    $response = $this->get('/auth/google/callback?state=s&code=abc');

    $response->assertRedirect(route('register'));
    $response->assertSessionHasErrors(['google']);
    $this->assertGuest();
});

it('finalises patient account only after submitting all consents', function () {
    ensureRolesExist();

    $this->withSession([
        'pending_google_patient' => [
            ...googleProfile(),
            'expires_at' => now()->addMinutes(10)->toIso8601String(),
        ],
    ]);

    $this->get('/auth/google/patient-consents')->assertOk();

    $response = $this->post('/auth/google/patient-consents', [
        'consent_privacy_policy' => true,
        'consent_terms_of_service' => true,
        'consent_health_data' => true,
        'consent_recording_global' => true,
    ]);

    $response->assertRedirect(route('dashboard'));

    $user = User::query()->where('email', 'jane@example.com')->firstOrFail();

    expect($user->hasRole('patient'))->toBeTrue()
        ->and($user->google_id)->toBe('1234567890')
        ->and($user->google_refresh_token)->toBe('rt-abc')
        ->and($user->patientProfile)->not->toBeNull()
        ->and($user->patientProfile->consentForms()->count())->toBe(4);
    $this->assertAuthenticatedAs($user);
});

it('rejects patient consents submission when any consent is missing', function () {
    ensureRolesExist();

    $this->withSession([
        'pending_google_patient' => [
            ...googleProfile(),
            'expires_at' => now()->addMinutes(10)->toIso8601String(),
        ],
    ]);

    $response = $this->post('/auth/google/patient-consents', [
        'consent_privacy_policy' => true,
        'consent_terms_of_service' => true,
        'consent_health_data' => true,
        'consent_recording_global' => false,
    ]);

    $response->assertSessionHasErrors(['consent_recording_global']);
    expect(User::query()->where('email', 'jane@example.com')->exists())->toBeFalse();
});

it('redirects expired patient consent sessions back to register', function () {
    $this->withSession([
        'pending_google_patient' => [
            ...googleProfile(),
            'expires_at' => now()->subMinute()->toIso8601String(),
        ],
    ]);

    $response = $this->get('/auth/google/patient-consents');

    $response->assertRedirect(route('register'));
    $response->assertSessionHasErrors(['google']);
});

it('handles user cancellation at Google with a friendly error', function () {
    $this->withSession(['google_oauth' => ['state' => 's', 'intent' => 'login', 'type' => null]]);

    $response = $this->get('/auth/google/callback?state=s&error=access_denied');

    $response->assertRedirect(route('login'));
    $response->assertSessionHasErrors(['google']);
});
