<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Services\BillingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class GenerateInvoiceAction extends Controller
{
    public function __invoke(Request $request, Appointment $appointment, BillingService $billing): RedirectResponse
    {
        if ($appointment->invoiceItems()->whereHas('invoice')->exists()) {
            return back()->withErrors(['invoice' => 'Ya existe una factura para esta cita.']);
        }

        $service = $appointment->service;
        $amount = $service->price ?? 0;

        $invoice = Invoice::create([
            'workspace_id' => $appointment->workspace_id,
            'patient_id' => $appointment->patient_id,
            'professional_id' => $appointment->professional_id,
            'invoice_number' => $billing->generateSequentialInvoiceNumber(now()->year),
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

        return redirect()->route('professional.invoices.show', $invoice)
            ->with('success', 'Borrador de factura generado.');
    }
}
