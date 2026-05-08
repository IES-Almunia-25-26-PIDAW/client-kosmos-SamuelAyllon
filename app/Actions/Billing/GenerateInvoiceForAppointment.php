<?php

namespace App\Actions\Billing;

use App\Models\Appointment;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Services\BillingService;
use Illuminate\Support\Facades\Log;

class GenerateInvoiceForAppointment
{
    public function __construct(private readonly BillingService $billing) {}

    public function __invoke(Appointment $appointment): ?Invoice
    {
        $existing = Invoice::whereHas(
            'items',
            fn ($q) => $q->where('appointment_id', $appointment->id)
        )->latest()->first();

        if ($existing !== null) {
            return $existing;
        }

        $service = $appointment->service;

        if ($service === null) {
            Log::warning('Cannot auto-generate invoice: appointment has no service', [
                'appointment_id' => $appointment->id,
            ]);

            return null;
        }

        $amount = $service->price ?? 0;

        $invoice = Invoice::create([
            'workspace_id' => $appointment->workspace_id,
            'patient_id' => $appointment->patient_id,
            'professional_id' => $appointment->professional_id,
            'invoice_number' => $this->billing->generateSequentialInvoiceNumber(now()->year),
            'status' => 'draft',
            'issued_at' => now(),
            'due_at' => now()->addDays(30),
            'subtotal' => $amount,
            'tax_rate' => 0,
            'tax_amount' => 0,
            'total' => $amount,
        ]);

        InvoiceItem::create([
            'invoice_id' => $invoice->id,
            'description' => $service->name ?? 'Sesión',
            'quantity' => 1,
            'unit_price' => $amount,
            'total' => $amount,
            'appointment_id' => $appointment->id,
        ]);

        return $invoice;
    }
}
