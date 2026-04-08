<?php

use App\Http\Controllers\AgreementController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\ConsentFormController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\KosmoController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\Admin\AdminController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('welcome'))->name('home');

Route::middleware(['auth', 'verified', 'professional'])->group(function () {

    Route::get('/dashboard',  [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/onboarding', [OnboardingController::class, 'index'])->name('onboarding');
    Route::post('/onboarding', [OnboardingController::class, 'store']);

    Route::resource('patients', PatientController::class);
    Route::get('/patients/{patient}/pre-session',  [PatientController::class, 'preSession'])->name('patients.pre-session');
    Route::get('/patients/{patient}/post-session', [PatientController::class, 'postSession'])->name('patients.post-session');

    Route::resource('patients.notes',         NoteController::class)->only(['store', 'update', 'destroy']);
    Route::resource('patients.agreements',    AgreementController::class)->only(['store', 'update', 'destroy']);
    Route::resource('patients.payments',      PaymentController::class)->only(['store', 'update', 'destroy']);
    Route::resource('patients.documents',     DocumentController::class)->only(['store', 'destroy']);
    Route::resource('patients.consent-forms', ConsentFormController::class)->only(['store', 'update']);

    Route::get('/billing',                               [BillingController::class, 'index'])->name('billing');
    Route::get('/kosmo',                                 [KosmoController::class, 'index'])->name('kosmo');
    Route::post('/kosmo/chat',                           [KosmoController::class, 'chat'])->name('kosmo.chat');
    Route::post('/kosmo/briefings/{briefing}/read',      [KosmoController::class, 'markRead'])->name('kosmo.briefings.read');

    Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
    Route::put('/settings', [SettingsController::class, 'update']);
});

Route::middleware(['auth', 'verified', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/users',              [AdminController::class, 'users'])->name('users.index');
        Route::get('/users/create',       [AdminController::class, 'create'])->name('users.create');
        Route::post('/users',             [AdminController::class, 'store'])->name('users.store');
        Route::get('/users/{user}',       [AdminController::class, 'showUser'])->name('users.show');
        Route::put('/users/{user}/role',  [AdminController::class, 'updateRole'])->name('users.role');
        Route::delete('/users/{user}',    [AdminController::class, 'destroy'])->name('users.destroy');
    });

require __DIR__.'/settings.php';
