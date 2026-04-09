<?php

use App\Http\Controllers\Agreement\DestroyAction as AgreementDestroyAction;
use App\Http\Controllers\Agreement\StoreAction as AgreementStoreAction;
use App\Http\Controllers\Agreement\UpdateAction as AgreementUpdateAction;
use App\Http\Controllers\Billing\IndexAction as BillingIndexAction;
use App\Http\Controllers\ConsentForm\StoreAction as ConsentFormStoreAction;
use App\Http\Controllers\ConsentForm\UpdateAction as ConsentFormUpdateAction;
use App\Http\Controllers\Dashboard\IndexAction as DashboardIndexAction;
use App\Http\Controllers\Document\DestroyAction as DocumentDestroyAction;
use App\Http\Controllers\Document\StoreAction as DocumentStoreAction;
use App\Http\Controllers\Kosmo\ChatAction as KosmoChatAction;
use App\Http\Controllers\Kosmo\IndexAction as KosmoIndexAction;
use App\Http\Controllers\Kosmo\MarkReadAction as KosmoMarkReadAction;
use App\Http\Controllers\Note\DestroyAction as NoteDestroyAction;
use App\Http\Controllers\Note\StoreAction as NoteStoreAction;
use App\Http\Controllers\Note\UpdateAction as NoteUpdateAction;
use App\Http\Controllers\Onboarding\IndexAction as OnboardingIndexAction;
use App\Http\Controllers\Onboarding\StoreAction as OnboardingStoreAction;
use App\Http\Controllers\Patient\CreateAction as PatientCreateAction;
use App\Http\Controllers\Patient\DestroyAction as PatientDestroyAction;
use App\Http\Controllers\Patient\EditAction as PatientEditAction;
use App\Http\Controllers\Patient\IndexAction as PatientIndexAction;
use App\Http\Controllers\Patient\PostSessionAction as PatientPostSessionAction;
use App\Http\Controllers\Patient\PreSessionAction as PatientPreSessionAction;
use App\Http\Controllers\Patient\ShowAction as PatientShowAction;
use App\Http\Controllers\Patient\StoreAction as PatientStoreAction;
use App\Http\Controllers\Patient\UpdateAction as PatientUpdateAction;
use App\Http\Controllers\Payment\DestroyAction as PaymentDestroyAction;
use App\Http\Controllers\Payment\StoreAction as PaymentStoreAction;
use App\Http\Controllers\Payment\UpdateAction as PaymentUpdateAction;
use App\Http\Controllers\Settings\IndexAction as SettingsIndexAction;
use App\Http\Controllers\Settings\UpdateAction as SettingsUpdateAction;
use App\Http\Controllers\Admin\Users\CreateAction as AdminUserCreateAction;
use App\Http\Controllers\Admin\Users\DestroyAction as AdminUserDestroyAction;
use App\Http\Controllers\Admin\Users\IndexAction as AdminUserIndexAction;
use App\Http\Controllers\Admin\Users\ShowAction as AdminUserShowAction;
use App\Http\Controllers\Admin\Users\StoreAction as AdminUserStoreAction;
use App\Http\Controllers\Admin\Users\UpdateRoleAction as AdminUserUpdateRoleAction;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('welcome'))->name('home');

Route::middleware(['auth', 'verified', 'professional'])->group(function () {

    Route::get('/dashboard',  DashboardIndexAction::class)->name('dashboard');
    Route::get('/onboarding', OnboardingIndexAction::class)->name('onboarding');
    Route::post('/onboarding', OnboardingStoreAction::class);

    // Patients (resource)
    Route::get('/patients',              PatientIndexAction::class)->name('patients.index');
    Route::get('/patients/create',       PatientCreateAction::class)->name('patients.create');
    Route::post('/patients',             PatientStoreAction::class)->name('patients.store');
    Route::get('/patients/{patient}',    PatientShowAction::class)->name('patients.show');
    Route::get('/patients/{patient}/edit', PatientEditAction::class)->name('patients.edit');
    Route::put('/patients/{patient}',    PatientUpdateAction::class)->name('patients.update');
    Route::patch('/patients/{patient}',  PatientUpdateAction::class);
    Route::delete('/patients/{patient}', PatientDestroyAction::class)->name('patients.destroy');

    Route::get('/patients/{patient}/pre-session',  PatientPreSessionAction::class)->name('patients.pre-session');
    Route::get('/patients/{patient}/post-session', PatientPostSessionAction::class)->name('patients.post-session');

    // Nested: Notes
    Route::post('/patients/{patient}/notes',            NoteStoreAction::class)->name('patients.notes.store');
    Route::put('/patients/{patient}/notes/{note}',      NoteUpdateAction::class)->name('patients.notes.update');
    Route::patch('/patients/{patient}/notes/{note}',    NoteUpdateAction::class);
    Route::delete('/patients/{patient}/notes/{note}',   NoteDestroyAction::class)->name('patients.notes.destroy');

    // Nested: Agreements
    Route::post('/patients/{patient}/agreements',               AgreementStoreAction::class)->name('patients.agreements.store');
    Route::put('/patients/{patient}/agreements/{agreement}',    AgreementUpdateAction::class)->name('patients.agreements.update');
    Route::patch('/patients/{patient}/agreements/{agreement}',  AgreementUpdateAction::class);
    Route::delete('/patients/{patient}/agreements/{agreement}', AgreementDestroyAction::class)->name('patients.agreements.destroy');

    // Nested: Payments
    Route::post('/patients/{patient}/payments',             PaymentStoreAction::class)->name('patients.payments.store');
    Route::put('/patients/{patient}/payments/{payment}',    PaymentUpdateAction::class)->name('patients.payments.update');
    Route::patch('/patients/{patient}/payments/{payment}',  PaymentUpdateAction::class);
    Route::delete('/patients/{patient}/payments/{payment}', PaymentDestroyAction::class)->name('patients.payments.destroy');

    // Nested: Documents
    Route::post('/patients/{patient}/documents',              DocumentStoreAction::class)->name('patients.documents.store');
    Route::delete('/patients/{patient}/documents/{document}', DocumentDestroyAction::class)->name('patients.documents.destroy');

    // Nested: Consent Forms
    Route::post('/patients/{patient}/consent-forms',                    ConsentFormStoreAction::class)->name('patients.consent-forms.store');
    Route::put('/patients/{patient}/consent-forms/{consentForm}',       ConsentFormUpdateAction::class)->name('patients.consent-forms.update');
    Route::patch('/patients/{patient}/consent-forms/{consentForm}',     ConsentFormUpdateAction::class);

    Route::get('/billing',                               BillingIndexAction::class)->name('billing');
    Route::get('/kosmo',                                 KosmoIndexAction::class)->name('kosmo');
    Route::post('/kosmo/chat',                           KosmoChatAction::class)->name('kosmo.chat');
    Route::post('/kosmo/briefings/{briefing}/read',      KosmoMarkReadAction::class)->name('kosmo.briefings.read');

    Route::get('/settings', SettingsIndexAction::class)->name('settings');
    Route::put('/settings', SettingsUpdateAction::class);
});

Route::middleware(['auth', 'verified', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/users',              AdminUserIndexAction::class)->name('users.index');
        Route::get('/users/create',       AdminUserCreateAction::class)->name('users.create');
        Route::post('/users',             AdminUserStoreAction::class)->name('users.store');
        Route::get('/users/{user}',       AdminUserShowAction::class)->name('users.show');
        Route::put('/users/{user}/role',  AdminUserUpdateRoleAction::class)->name('users.role');
        Route::delete('/users/{user}',    AdminUserDestroyAction::class)->name('users.destroy');
    });

require __DIR__.'/settings.php';
