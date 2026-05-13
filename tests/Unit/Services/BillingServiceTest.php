<?php

declare(strict_types=1);

use App\Models\Invoice;
use App\Services\BillingService;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    $this->withoutVite();
    app()[PermissionRegistrar::class]->forgetCachedPermissions();
    $this->seed(RoleSeeder::class);
    $this->service = new BillingService;
});

it('marks an invoice as paid with a valid payment method', function () {
    $invoice = Invoice::factory()->sent()->create();

    $this->service->markAsPaid($invoice, 'transfer');

    $invoice->refresh();
    expect($invoice->status)->toBe('paid')
        ->and($invoice->payment_method)->toBe('transfer')
        ->and($invoice->paid_at)->not->toBeNull();
});

it('accepts every documented payment method', function (string $method) {
    $invoice = Invoice::factory()->sent()->create();

    $this->service->markAsPaid($invoice, $method);

    expect($invoice->fresh()->payment_method)->toBe($method);
})->with(['cash', 'transfer', 'card', 'bizum', 'stripe', 'other']);

it('rejects an unknown payment method with InvalidArgumentException', function () {
    $invoice = Invoice::factory()->sent()->create();

    expect(fn () => $this->service->markAsPaid($invoice, 'crypto'))
        ->toThrow(InvalidArgumentException::class, "Payment method 'crypto' is not valid.");

    expect($invoice->fresh()->status)->toBe('sent');
});

it('pads the sequential invoice number to 5 digits', function () {
    $number = $this->service->generateSequentialInvoiceNumber(2030);

    expect($number)->toBe('FAC-2030-00001');
});

it('keeps the FAC-{year}- prefix isolated per year', function () {
    $this->service->generateSequentialInvoiceNumber(2026);
    Invoice::factory()->create(['invoice_number' => 'FAC-2026-00001']);

    $first2027 = $this->service->generateSequentialInvoiceNumber(2027);
    Invoice::factory()->create(['invoice_number' => $first2027]);

    $second2027 = $this->service->generateSequentialInvoiceNumber(2027);

    expect($first2027)->toBe('FAC-2027-00001')
        ->and($second2027)->toBe('FAC-2027-00002');
});
