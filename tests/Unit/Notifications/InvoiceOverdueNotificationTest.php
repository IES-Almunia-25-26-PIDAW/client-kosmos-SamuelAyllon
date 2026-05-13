<?php

declare(strict_types=1);

use App\Models\Invoice;
use App\Models\User;
use App\Notifications\InvoiceOverdueNotification;
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

it('only routes via mail', function () {
    $invoice = Invoice::factory()->overdue()->create();

    expect((new InvoiceOverdueNotification($invoice))->via(new User))->toBe(['mail']);
});

it('builds a mail message with the invoice number, due date and formatted total', function () {
    $invoice = Invoice::factory()->overdue()->create([
        'invoice_number' => 'FAC-2026-00099',
        'due_at' => '2026-03-15',
        'total' => 150.00,
    ]);

    $mail = (new InvoiceOverdueNotification($invoice))->toMail(new User);
    $body = implode("\n", $mail->introLines);

    expect($mail->subject)->toBe('Factura vencida: FAC-2026-00099')
        ->and($body)->toContain('FAC-2026-00099')
        ->and($body)->toContain('15/03/2026')
        ->and($body)->toContain('150.00 €')
        ->and($mail->actionUrl)->toContain('/invoices/'.$invoice->id);
});

it('renders an em dash when due_at is null', function () {
    $invoice = Invoice::factory()->create([
        'invoice_number' => 'FAC-2026-00100',
        'due_at' => null,
        'total' => 60,
    ]);

    $mail = (new InvoiceOverdueNotification($invoice))->toMail(new User);

    expect(implode("\n", $mail->introLines))->toContain('—');
});
