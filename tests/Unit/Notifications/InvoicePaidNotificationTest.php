<?php

declare(strict_types=1);

use App\Models\Invoice;
use App\Models\User;
use App\Notifications\InvoicePaidNotification;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Notifications\Messages\MailMessage;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    $this->withoutVite();
    app()[PermissionRegistrar::class]->forgetCachedPermissions();
    $this->seed(RoleSeeder::class);
});

it('only routes via mail', function () {
    $invoice = Invoice::factory()->paid()->create();
    $notification = new InvoicePaidNotification($invoice);

    expect($notification->via(new User))->toBe(['mail']);
});

it('uses the patient subject and action route when notifiable is the payer', function () {
    $patient = User::factory()->create();
    $invoice = Invoice::factory()->paid()->create([
        'patient_id' => $patient->id,
        'total' => 80.50,
        'invoice_number' => 'FAC-2026-00010',
    ]);

    $mail = (new InvoicePaidNotification($invoice))->toMail($patient);

    expect($mail)->toBeInstanceOf(MailMessage::class)
        ->and($mail->subject)->toBe('Pago confirmado: FAC-2026-00010')
        ->and($mail->greeting)->toBe('¡Pago recibido!')
        ->and($mail->actionUrl)->toContain('/patient/invoices/'.$invoice->id);

    expect(implode(' ', $mail->introLines))->toContain('80,50 €');
});

it('uses the professional subject and review route when notifiable is not the payer', function () {
    $professional = User::factory()->create();
    $invoice = Invoice::factory()->paid()->create([
        'professional_id' => $professional->id,
        'total' => 120,
        'invoice_number' => 'FAC-2026-00011',
    ]);

    $mail = (new InvoicePaidNotification($invoice))->toMail($professional);

    expect($mail->subject)->toBe('Cobro recibido: FAC-2026-00011')
        ->and($mail->greeting)->toBe('Pago registrado')
        ->and($mail->actionUrl)->toContain('/invoices/'.$invoice->id.'/review');
});
