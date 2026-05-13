<?php

declare(strict_types=1);

use App\Http\Controllers\Invoice\IndexAction;
use App\Models\Invoice;
use App\Models\User;
use App\Notifications\InvoicePaidNotification;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    $this->withoutVite();
    app()[PermissionRegistrar::class]->forgetCachedPermissions();
    $this->seed(RoleSeeder::class);
    Notification::fake();
    Storage::fake('private');
});

it('forgets the stats cache on every save', function () {
    $professional = createProfessional();
    $cacheKey = IndexAction::statsCacheKey($professional->id);
    Cache::put($cacheKey, ['stub' => 1], 60);

    Invoice::factory()->sent()->create(['professional_id' => $professional->id]);

    expect(Cache::has($cacheKey))->toBeFalse();
});

it('back-fills paid_at when transitioning to paid without one', function () {
    $professional = createProfessional();
    $patient = User::factory()->create();
    $invoice = Invoice::factory()->sent()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
    ]);

    $invoice->update(['status' => 'paid', 'paid_at' => null]);

    expect($invoice->fresh()->paid_at)->not->toBeNull();
});

it('notifies patient and professional when transitioning to paid (paid_at preset)', function () {
    $professional = createProfessional();
    $patient = User::factory()->create();
    $invoice = Invoice::factory()->sent()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
    ]);

    Notification::fake();
    $invoice->update(['status' => 'paid', 'paid_at' => now()]);

    Notification::assertSentTo($patient, InvoicePaidNotification::class);
    Notification::assertSentTo($professional, InvoicePaidNotification::class);
});

it('deletes the PDF when transitioning to paid and clears pdf_path (paid_at preset)', function () {
    $professional = createProfessional();
    $patient = User::factory()->create();
    $invoice = Invoice::factory()->sent()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'pdf_path' => 'invoices/temp.pdf',
    ]);
    Storage::disk('private')->put('invoices/temp.pdf', 'fake-content');

    $invoice->update(['status' => 'paid', 'paid_at' => now()]);

    expect(Storage::disk('private')->exists('invoices/temp.pdf'))->toBeFalse()
        ->and($invoice->fresh()->pdf_path)->toBeNull();
});

it('does not re-send notifications when a paid invoice is saved again', function () {
    $professional = createProfessional();
    $patient = User::factory()->create();
    $invoice = Invoice::factory()->paid()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
    ]);

    Notification::fake(); // reset after factory-side events
    $invoice->update(['notes' => 'updated note']);
    $invoice->update(['status' => 'paid']);

    Notification::assertNothingSent();
});

it('does nothing on saves that do not change status', function () {
    $professional = createProfessional();
    $invoice = Invoice::factory()->sent()->create(['professional_id' => $professional->id]);

    Notification::fake();
    $invoice->update(['notes' => 'just a note']);

    Notification::assertNothingSent();
});
