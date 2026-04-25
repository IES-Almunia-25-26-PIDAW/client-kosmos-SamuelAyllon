<?php

use App\Http\Controllers\Admin\DashboardIndexAction as AdminDashboardIndexAction;
use App\Http\Controllers\Admin\Users\CreateAction as AdminUserCreateAction;
use App\Http\Controllers\Admin\Users\DestroyAction as AdminUserDestroyAction;
use App\Http\Controllers\Admin\Users\IndexAction as AdminUserIndexAction;
use App\Http\Controllers\Admin\Users\ShowAction as AdminUserShowAction;
use App\Http\Controllers\Admin\Users\StoreAction as AdminUserStoreAction;
use App\Http\Controllers\Admin\Users\VerifyProfessionalAction as AdminVerifyProfessionalAction;
use App\Http\Controllers\Admin\Workspaces\IndexAction as AdminWorkspaceIndexAction;
use App\Http\Controllers\Admin\Workspaces\ShowAction as AdminWorkspaceShowAction;
use App\Http\Controllers\Agreement\DestroyAction as AgreementDestroyAction;
use App\Http\Controllers\Agreement\StoreAction as AgreementStoreAction;
use App\Http\Controllers\Agreement\UpdateAction as AgreementUpdateAction;
use App\Http\Controllers\Appointment\ClosingSuccessAction;
use App\Http\Controllers\Appointment\DestroyAction as AppointmentDestroyAction;
use App\Http\Controllers\Appointment\EndCallAction;
use App\Http\Controllers\Appointment\FinalizeAndNotifyAction;
use App\Http\Controllers\Appointment\GenerateInvoiceAction;
use App\Http\Controllers\Appointment\IndexAction as AppointmentIndexAction;
use App\Http\Controllers\Appointment\JoinWaitingRoomAction;
use App\Http\Controllers\Appointment\ShowAction as AppointmentShowAction;
use App\Http\Controllers\Appointment\StartCallAction;
use App\Http\Controllers\Appointment\StoreAction as AppointmentStoreAction;
use App\Http\Controllers\Appointment\SummarizeAction;
use App\Http\Controllers\Appointment\TranscribeAction;
use App\Http\Controllers\Appointment\UpdateAction as AppointmentUpdateAction;
use App\Http\Controllers\Appointment\UpdateStatusAction;
use App\Http\Controllers\Appointment\WaitingShowAction;
use App\Http\Controllers\Call\ShowRoomAction as CallShowRoomAction;
use App\Http\Controllers\CollaborationAgreement\DestroyAction as CollaborationDestroyAction;
use App\Http\Controllers\CollaborationAgreement\IndexAction as CollaborationIndexAction;
use App\Http\Controllers\CollaborationAgreement\StoreAction as CollaborationStoreAction;
use App\Http\Controllers\CollaborationAgreement\UpdateAction as CollaborationUpdateAction;
use App\Http\Controllers\ConsentForm\StoreAction as ConsentFormStoreAction;
use App\Http\Controllers\ConsentForm\UpdateAction as ConsentFormUpdateAction;
use App\Http\Controllers\Dashboard\IndexAction as DashboardIndexAction;
use App\Http\Controllers\Document\DestroyAction as DocumentDestroyAction;
use App\Http\Controllers\Document\StoreAction as DocumentStoreAction;
use App\Http\Controllers\Invoice\DestroyAction as InvoiceDestroyAction;
use App\Http\Controllers\Invoice\ExportPdfAction as InvoiceExportPdfAction;
use App\Http\Controllers\Invoice\IndexAction as InvoiceIndexAction;
use App\Http\Controllers\Invoice\ReviewAction as InvoiceReviewAction;
use App\Http\Controllers\Invoice\SendAction as InvoiceSendAction;
use App\Http\Controllers\Invoice\ShowAction as InvoiceShowAction;
use App\Http\Controllers\Invoice\StoreAction as InvoiceStoreAction;
use App\Http\Controllers\Invoice\UpdateAction as InvoiceUpdateAction;
use App\Http\Controllers\Kosmo\ChatAction as KosmoChatAction;
use App\Http\Controllers\Kosmo\IndexAction as KosmoIndexAction;
use App\Http\Controllers\Kosmo\MarkReadAction as KosmoMarkReadAction;
use App\Http\Controllers\Message\ConversationAction as MessageConversationAction;
use App\Http\Controllers\Message\IndexAction as MessageIndexAction;
use App\Http\Controllers\Message\StoreAction as MessageStoreAction;
use App\Http\Controllers\Note\DestroyAction as NoteDestroyAction;
use App\Http\Controllers\Note\StoreAction as NoteStoreAction;
use App\Http\Controllers\Note\UpdateAction as NoteUpdateAction;
use App\Http\Controllers\Onboarding\IndexAction as OnboardingIndexAction;
use App\Http\Controllers\Onboarding\StoreAction as OnboardingStoreAction;
use App\Http\Controllers\Patient\CreateAction as PatientCreateAction;
use App\Http\Controllers\Patient\DestroyAction as PatientDestroyAction;
use App\Http\Controllers\Patient\EditAction as PatientEditAction;
use App\Http\Controllers\Patient\IndexAction as PatientIndexAction;
use App\Http\Controllers\Patient\InviteAction as PatientInviteAction;
use App\Http\Controllers\Patient\PostSessionAction as PatientPostSessionAction;
use App\Http\Controllers\Patient\PreSessionAction as PatientPreSessionAction;
use App\Http\Controllers\Patient\ShowAction as PatientShowAction;
use App\Http\Controllers\Patient\StoreAction as PatientStoreAction;
use App\Http\Controllers\Patient\UpdateAction as PatientUpdateAction;
use App\Http\Controllers\Portal\Appointment\BookAction as PortalAppointmentBookAction;
use App\Http\Controllers\Portal\Appointment\CancelAction as PortalAppointmentCancelAction;
use App\Http\Controllers\Portal\Appointment\IndexAction as PortalAppointmentIndexAction;
use App\Http\Controllers\Portal\Appointment\JoinCallAction as PortalAppointmentJoinCallAction;
use App\Http\Controllers\Portal\Appointment\PostSessionShowAction as PortalAppointmentPostSessionShowAction;
use App\Http\Controllers\Portal\Appointment\RecordingConsentAction as PortalAppointmentRecordingConsentAction;
use App\Http\Controllers\Portal\Appointment\ShowAction as PortalAppointmentShowAction;
use App\Http\Controllers\Portal\Appointment\StoreAction as PortalAppointmentStoreAction;
use App\Http\Controllers\Portal\Appointment\WaitingShowAction as PortalAppointmentWaitingShowAction;
use App\Http\Controllers\Portal\ConsentForm\IndexAction as PortalConsentFormIndexAction;
use App\Http\Controllers\Portal\ConsentForm\SignAction as PortalConsentFormSignAction;
use App\Http\Controllers\Portal\Dashboard\IndexAction as PortalDashboardIndexAction;
use App\Http\Controllers\Portal\Document\IndexAction as PortalDocumentIndexAction;
use App\Http\Controllers\Portal\Document\ShowAction as PortalDocumentShowAction;
use App\Http\Controllers\Portal\Invoice\DownloadPdfAction as PortalInvoiceDownloadPdfAction;
use App\Http\Controllers\Portal\Invoice\IndexAction as PortalInvoiceIndexAction;
use App\Http\Controllers\Portal\Invoice\ShowAction as PortalInvoiceShowAction;
use App\Http\Controllers\Portal\Message\IndexAction as PortalMessageIndexAction;
use App\Http\Controllers\Portal\Message\StoreAction as PortalMessageStoreAction;
use App\Http\Controllers\Portal\Professional\IndexAction as PortalProfessionalIndexAction;
use App\Http\Controllers\Portal\Profile\ShowAction as PortalProfileShowAction;
use App\Http\Controllers\Portal\Profile\UpdateAction as PortalProfileUpdateAction;
use App\Http\Controllers\Referral\DestroyAction as ReferralDestroyAction;
use App\Http\Controllers\Referral\IndexAction as ReferralIndexAction;
use App\Http\Controllers\Referral\StoreAction as ReferralStoreAction;
use App\Http\Controllers\Referral\UpdateAction as ReferralUpdateAction;
use App\Http\Controllers\Schedule\Availability\DestroyAction as AvailabilityDestroyAction;
use App\Http\Controllers\Schedule\Availability\IndexAction as AvailabilityIndexAction;
use App\Http\Controllers\Schedule\Availability\StoreAction as AvailabilityStoreAction;
use App\Http\Controllers\Schedule\Availability\UpdateAction as AvailabilityUpdateAction;
use App\Http\Controllers\Schedule\IndexAction as ScheduleIndexAction;
use App\Http\Controllers\Settings\IndexAction as SettingsIndexAction;
use App\Http\Controllers\Settings\UpdateAction as SettingsUpdateAction;
use App\Http\Controllers\Workspace\Analytics\IndexAction as WorkspaceAnalyticsIndexAction;
use App\Http\Controllers\Workspace\Services\DestroyAction as WorkspaceServiceDestroyAction;
use App\Http\Controllers\Workspace\Services\IndexAction as WorkspaceServiceIndexAction;
use App\Http\Controllers\Workspace\Services\StoreAction as WorkspaceServiceStoreAction;
use App\Http\Controllers\Workspace\Services\UpdateAction as WorkspaceServiceUpdateAction;
use App\Http\Controllers\Workspace\Settings\IndexAction as WorkspaceSettingsIndexAction;
use App\Http\Controllers\Workspace\Settings\UpdateAction as WorkspaceSettingsUpdateAction;
use App\Http\Controllers\Workspace\Team\DestroyAction as WorkspaceTeamDestroyAction;
use App\Http\Controllers\Workspace\Team\IndexAction as WorkspaceTeamIndexAction;
use App\Http\Controllers\Workspace\Team\InviteAction as WorkspaceTeamInviteAction;
use App\Http\Controllers\Workspace\Team\UpdatePermissionsAction as WorkspaceTeamUpdatePermissionsAction;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('welcome'))->name('home');

// ─── Dashboard catch-all (Fortify home, email verification redirect) ──────────
Route::middleware(['auth', 'verified'])
    ->get('/dashboard', function () {
        $user = auth()->user();
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }
        if ($user->isProfessional()) {
            return redirect()->route('professional.dashboard');
        }

        return redirect()->route('patient.dashboard');
    })->name('dashboard');

// ─── Professional routes ───────────────────────────────────────────────────────
Route::middleware(['auth', 'verified', 'professional'])
    ->prefix('professional')
    ->name('professional.')
    ->group(function () {

        Route::get('/dashboard', DashboardIndexAction::class)->name('dashboard');
        Route::get('/onboarding', OnboardingIndexAction::class)->name('onboarding');
        Route::post('/onboarding', OnboardingStoreAction::class);

        // Patients
        Route::get('/patients', PatientIndexAction::class)->name('patients.index');
        Route::get('/patients/create', PatientCreateAction::class)->name('patients.create');
        Route::post('/patients', PatientStoreAction::class)->name('patients.store');
        Route::get('/patients/{patient}', PatientShowAction::class)->name('patients.show');
        Route::get('/patients/{patient}/edit', PatientEditAction::class)->name('patients.edit');
        Route::match(['put', 'patch'], '/patients/{patient}', PatientUpdateAction::class)->name('patients.update');
        Route::delete('/patients/{patient}', PatientDestroyAction::class)->name('patients.destroy');

        Route::get('/patients/{patient}/pre-session', PatientPreSessionAction::class)->name('patients.pre-session');
        Route::get('/patients/{patient}/post-session', PatientPostSessionAction::class)->name('patients.post-session');
        Route::post('/patients/{patient}/invite', PatientInviteAction::class)->name('patients.invite');

        // Patient sub-resources: Notes
        Route::post('/patients/{patient}/notes', NoteStoreAction::class)->name('patients.notes.store');
        Route::match(['put', 'patch'], '/patients/{patient}/notes/{note}', NoteUpdateAction::class)->name('patients.notes.update');
        Route::delete('/patients/{patient}/notes/{note}', NoteDestroyAction::class)->name('patients.notes.destroy');

        // Patient sub-resources: Agreements
        Route::post('/patients/{patient}/agreements', AgreementStoreAction::class)->name('patients.agreements.store');
        Route::match(['put', 'patch'], '/patients/{patient}/agreements/{agreement}', AgreementUpdateAction::class)->name('patients.agreements.update');
        Route::delete('/patients/{patient}/agreements/{agreement}', AgreementDestroyAction::class)->name('patients.agreements.destroy');

        // Patient sub-resources: Invoices (replaces old payments routes)
        Route::post('/patients/{patient}/invoices', InvoiceStoreAction::class)->name('patients.invoices.store');
        Route::match(['put', 'patch'], '/patients/{patient}/invoices/{invoice}', InvoiceUpdateAction::class)->name('patients.invoices.update');
        Route::delete('/patients/{patient}/invoices/{invoice}', InvoiceDestroyAction::class)->name('patients.invoices.destroy');

        // Patient sub-resources: Documents
        Route::post('/patients/{patient}/documents', DocumentStoreAction::class)->name('patients.documents.store');
        Route::delete('/patients/{patient}/documents/{document}', DocumentDestroyAction::class)->name('patients.documents.destroy');

        // Patient sub-resources: Consent Forms
        Route::post('/patients/{patient}/consent-forms', ConsentFormStoreAction::class)->name('patients.consent-forms.store');
        Route::match(['put', 'patch'], '/patients/{patient}/consent-forms/{consentForm}', ConsentFormUpdateAction::class)->name('patients.consent-forms.update');

        // Invoices
        Route::get('/invoices', InvoiceIndexAction::class)->name('invoices.index');
        Route::get('/invoices/{invoice}', InvoiceShowAction::class)->name('invoices.show');
        Route::get('/invoices/{invoice}/review', InvoiceReviewAction::class)->name('invoices.review');
        Route::post('/invoices/{invoice}/send', InvoiceSendAction::class)->name('invoices.send');
        Route::get('/invoices/{invoice}/export-pdf', InvoiceExportPdfAction::class)->name('invoices.export-pdf');

        // Appointments
        Route::get('/appointments', AppointmentIndexAction::class)->name('appointments.index');
        Route::post('/appointments', AppointmentStoreAction::class)->name('appointments.store');
        Route::get('/appointments/{appointment}', AppointmentShowAction::class)->name('appointments.show');
        Route::get('/appointments/{appointment}/waiting', WaitingShowAction::class)->name('appointments.waiting');
        Route::get('/appointments/{appointment}/closing-success', ClosingSuccessAction::class)->name('appointments.closing-success');
        Route::post('/appointments/{appointment}/join-waiting', JoinWaitingRoomAction::class)->name('appointments.join-waiting');
        Route::match(['put', 'patch'], '/appointments/{appointment}', AppointmentUpdateAction::class)->name('appointments.update');
        Route::patch('/appointments/{appointment}/status', UpdateStatusAction::class)->name('appointments.status');
        Route::post('/appointments/{appointment}/start-call', StartCallAction::class)->name('appointments.start-call');
        Route::post('/appointments/{appointment}/end-call', EndCallAction::class)->name('appointments.end-call');
        Route::post('/appointments/{appointment}/finalize-and-notify', FinalizeAndNotifyAction::class)->name('appointments.finalize-and-notify');
        Route::post('/appointments/{appointment}/summarize', SummarizeAction::class)->name('appointments.summarize');
        Route::post('/appointments/{appointment}/generate-invoice', GenerateInvoiceAction::class)->name('appointments.generate-invoice');
        Route::delete('/appointments/{appointment}', AppointmentDestroyAction::class)->name('appointments.destroy');

        // Schedule
        Route::get('/schedule', ScheduleIndexAction::class)->name('schedule.index');
        Route::get('/schedule/availability', AvailabilityIndexAction::class)->name('schedule.availability.index');
        Route::post('/schedule/availability', AvailabilityStoreAction::class)->name('schedule.availability.store');
        Route::match(['put', 'patch'], '/schedule/availability/{availability}', AvailabilityUpdateAction::class)->name('schedule.availability.update');
        Route::delete('/schedule/availability/{availability}', AvailabilityDestroyAction::class)->name('schedule.availability.destroy');

        // Workspace management
        Route::prefix('workspace')->name('workspace.')->group(function () {
            Route::get('/settings', WorkspaceSettingsIndexAction::class)->name('settings.index');
            Route::put('/settings', WorkspaceSettingsUpdateAction::class)->name('settings.update');
            Route::get('/analytics', WorkspaceAnalyticsIndexAction::class)->name('analytics.index');

            Route::get('/team', WorkspaceTeamIndexAction::class)->name('team.index');
            Route::post('/team/invite', WorkspaceTeamInviteAction::class)->name('team.invite');
            Route::put('/team/{user}/permissions', WorkspaceTeamUpdatePermissionsAction::class)->name('team.permissions');
            Route::delete('/team/{user}', WorkspaceTeamDestroyAction::class)->name('team.destroy');

            Route::get('/services', WorkspaceServiceIndexAction::class)->name('services.index');
            Route::post('/services', WorkspaceServiceStoreAction::class)->name('services.store');
            Route::match(['put', 'patch'], '/services/{service}', WorkspaceServiceUpdateAction::class)->name('services.update');
            Route::delete('/services/{service}', WorkspaceServiceDestroyAction::class)->name('services.destroy');

            // Collaboration agreements
            Route::get('/collaborations', CollaborationIndexAction::class)->name('collaborations.index');
            Route::post('/collaborations', CollaborationStoreAction::class)->name('collaborations.store');
            Route::match(['put', 'patch'], '/collaborations/{collaboration}', CollaborationUpdateAction::class)->name('collaborations.update');
            Route::delete('/collaborations/{collaboration}', CollaborationDestroyAction::class)->name('collaborations.destroy');
        });

        // Messages
        Route::get('/messages', MessageIndexAction::class)->name('messages.index');
        Route::post('/messages', MessageStoreAction::class)->name('messages.store');
        Route::get('/messages/{user}', MessageConversationAction::class)->name('messages.conversation');

        // Kosmo AI
        Route::get('/kosmo', KosmoIndexAction::class)->name('kosmo');
        Route::post('/kosmo/chat', KosmoChatAction::class)->name('kosmo.chat');
        Route::post('/kosmo/briefings/{briefing}/read', KosmoMarkReadAction::class)->name('kosmo.briefings.read');

        Route::get('/settings', SettingsIndexAction::class)->name('settings');
        Route::put('/settings', SettingsUpdateAction::class);

        // Referrals
        Route::get('/referrals', ReferralIndexAction::class)->name('referrals.index');
        Route::post('/referrals', ReferralStoreAction::class)->name('referrals.store');
        Route::match(['put', 'patch'], '/referrals/{referral}', ReferralUpdateAction::class)->name('referrals.update');
        Route::delete('/referrals/{referral}', ReferralDestroyAction::class)->name('referrals.destroy');
    });

// ─── Admin routes ──────────────────────────────────────────────────────────────
Route::middleware(['auth', 'verified', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', AdminDashboardIndexAction::class)->name('dashboard');
        Route::get('/users', AdminUserIndexAction::class)->name('users.index');
        Route::get('/users/create', AdminUserCreateAction::class)->name('users.create');
        Route::post('/users', AdminUserStoreAction::class)->name('users.store');
        Route::get('/users/{user}', AdminUserShowAction::class)->name('users.show');
        Route::delete('/users/{user}', AdminUserDestroyAction::class)->name('users.destroy');
        Route::patch('/users/{user}/verify', AdminVerifyProfessionalAction::class)->name('users.verify');

        Route::get('/workspaces', AdminWorkspaceIndexAction::class)->name('workspaces.index');
        Route::get('/workspaces/{workspace}', AdminWorkspaceShowAction::class)->name('workspaces.show');
    });

// ─── Patient routes ─────────────────────────────────────────────────────
Route::middleware(['auth', 'verified'])
    ->prefix('patient')
    ->name('patient.')
    ->group(function () {
        Route::get('/', PortalDashboardIndexAction::class)->name('dashboard');

        Route::get('/professionals', PortalProfessionalIndexAction::class)->name('professionals.index');

        Route::get('/appointments', PortalAppointmentIndexAction::class)->name('appointments.index');
        Route::get('/appointments/book', PortalAppointmentBookAction::class)->name('appointments.book');
        Route::post('/appointments', PortalAppointmentStoreAction::class)->name('appointments.store');
        Route::get('/appointments/{appointment}', PortalAppointmentShowAction::class)->name('appointments.show');
        Route::post('/appointments/{appointment}/cancel', PortalAppointmentCancelAction::class)->name('appointments.cancel');
        Route::post('/appointments/{appointment}/join', PortalAppointmentJoinCallAction::class)->name('appointments.join');
        Route::get('/appointments/{appointment}/waiting', PortalAppointmentWaitingShowAction::class)->name('appointments.waiting');
        Route::post('/appointments/{appointment}/recording-consent', PortalAppointmentRecordingConsentAction::class)->name('appointments.recording-consent');
        Route::get('/appointments/{appointment}/post-session', PortalAppointmentPostSessionShowAction::class)->name('appointments.post-session');

        Route::get('/invoices', PortalInvoiceIndexAction::class)->name('invoices.index');
        Route::get('/invoices/{invoice}', PortalInvoiceShowAction::class)->name('invoices.show');
        Route::get('/invoices/{invoice}/download', PortalInvoiceDownloadPdfAction::class)->name('invoices.download');

        Route::get('/documents', PortalDocumentIndexAction::class)->name('documents.index');
        Route::get('/documents/{document}', PortalDocumentShowAction::class)
            ->middleware('signed')
            ->name('documents.show');

        Route::get('/consent-forms', PortalConsentFormIndexAction::class)->name('consent-forms.index');
        Route::post('/consent-forms/{consentForm}/sign', PortalConsentFormSignAction::class)->name('consent-forms.sign');

        Route::get('/messages', PortalMessageIndexAction::class)->name('messages.index');
        Route::post('/messages', PortalMessageStoreAction::class)->name('messages.store');

        Route::get('/profile', PortalProfileShowAction::class)->name('profile.show');
        Route::match(['put', 'patch'], '/profile', PortalProfileUpdateAction::class)->name('profile.update');
    });

// ─── Video call room (accesible por profesional y paciente autenticados) ──────
Route::middleware(['auth', 'verified'])
    ->group(function () {
        Route::get('/call/{roomId}', CallShowRoomAction::class)
            ->name('call.room')
            ->where('roomId', '[a-z0-9-]+');

        Route::post('/appointments/{appointment}/transcribe', TranscribeAction::class)
            ->middleware('throttle:30,1')
            ->name('appointments.transcribe');
    });

require __DIR__.'/settings.php';
