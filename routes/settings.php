<?php

use App\Http\Controllers\Settings\Consent\RevokeAction as ConsentRevokeAction;
use App\Http\Controllers\Settings\Google\CallbackAction as GoogleCallbackAction;
use App\Http\Controllers\Settings\Google\DisconnectAction as GoogleDisconnectAction;
use App\Http\Controllers\Settings\Google\EditAction as GoogleEditAction;
use App\Http\Controllers\Settings\Google\RedirectAction as GoogleRedirectAction;
use App\Http\Controllers\Settings\Password\EditAction as PasswordEditAction;
use App\Http\Controllers\Settings\Password\UpdateAction as PasswordUpdateAction;
use App\Http\Controllers\Settings\Profile\DestroyAction as ProfileDestroyAction;
use App\Http\Controllers\Settings\Profile\EditAction as ProfileEditAction;
use App\Http\Controllers\Settings\Profile\UpdateAction as ProfileUpdateAction;
use App\Http\Controllers\Settings\TwoFactorAuthentication\ShowAction as TwoFactorShowAction;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth'])->group(function () {
    Route::get('settings/profile', ProfileEditAction::class)->name('profile.edit');
    Route::patch('settings/profile', ProfileUpdateAction::class)->name('profile.update');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', ProfileDestroyAction::class)->name('profile.destroy');

    Route::get('settings/password', PasswordEditAction::class)->name('user-password.edit');

    Route::put('settings/password', PasswordUpdateAction::class)
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance.edit');

    Route::get('settings/two-factor', TwoFactorShowAction::class)
        ->name('two-factor.show');

    Route::prefix('settings/google')->name('settings.google.')->group(function () {
        Route::get('/', GoogleEditAction::class)->name('edit');
        Route::get('/redirect', GoogleRedirectAction::class)->name('redirect');
        Route::get('/callback', GoogleCallbackAction::class)->name('callback');
        Route::delete('/', GoogleDisconnectAction::class)->name('disconnect');
    });

    Route::post('settings/consents/{consentForm}/revoke', ConsentRevokeAction::class)
        ->name('settings.consents.revoke');
});
