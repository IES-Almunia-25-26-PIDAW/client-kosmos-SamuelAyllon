<?php

use App\Models\User;
use App\Services\GoogleCalendarService;

beforeEach(function () {
    config([
        'services.google.client_id' => 'test-client-id',
        'services.google.client_secret' => 'test-client-secret',
        'services.google.redirect_uri' => 'http://localhost/settings/google/callback',
    ]);
});

it('renders the google settings page for an authenticated user', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('settings.google.edit'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('settings/google')
            ->where('connected', false)
        );
});

it('shows connected = true when the user already has a refresh token', function () {
    $user = User::factory()->create(['google_refresh_token' => 'existing-token']);

    $this->actingAs($user)
        ->get(route('settings.google.edit'))
        ->assertInertia(fn ($page) => $page->where('connected', true));
});

it('redirects to google with a state stored in session', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('settings.google.redirect'));

    $response->assertRedirect();
    expect($response->headers->get('Location'))->toContain('state=');
    expect(session('google_oauth_state'))->not->toBeNull();
});

it('rejects callback when state does not match the session value', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->withSession(['google_oauth_state' => 'expected-state'])
        ->get(route('settings.google.callback', ['state' => 'forged-state', 'code' => 'abc']))
        ->assertRedirect(route('settings.google.edit'))
        ->assertSessionHasErrors('google');

    expect($user->fresh()->google_refresh_token)->toBeNull();
});

it('persists the refresh_token on a successful callback', function () {
    $user = User::factory()->create();

    $this->mock(GoogleCalendarService::class)
        ->shouldReceive('exchangeCode')
        ->once()
        ->with('valid-code')
        ->andReturn('fresh-refresh-token');

    $this->actingAs($user)
        ->withSession(['google_oauth_state' => 'matching-state'])
        ->get(route('settings.google.callback', ['state' => 'matching-state', 'code' => 'valid-code']))
        ->assertRedirect(route('settings.google.edit'))
        ->assertSessionHas('success');

    expect($user->fresh()->google_refresh_token)->toBe('fresh-refresh-token');
});

it('clears the refresh_token and calls revoke on disconnect', function () {
    $user = User::factory()->create(['google_refresh_token' => 'token-to-revoke']);

    $this->mock(GoogleCalendarService::class)
        ->shouldReceive('revoke')
        ->once()
        ->with('token-to-revoke');

    $this->actingAs($user)
        ->delete(route('settings.google.disconnect'))
        ->assertRedirect(route('settings.google.edit'))
        ->assertSessionHas('success');

    expect($user->fresh()->google_refresh_token)->toBeNull();
});

it('does not call revoke when the user has no token', function () {
    $user = User::factory()->create(['google_refresh_token' => null]);

    $this->mock(GoogleCalendarService::class)
        ->shouldNotReceive('revoke');

    $this->actingAs($user)
        ->delete(route('settings.google.disconnect'))
        ->assertRedirect(route('settings.google.edit'));
});
