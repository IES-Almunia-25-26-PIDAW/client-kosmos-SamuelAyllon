<?php

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentRequest;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\PatientProfile;
use App\Services\BillingService;
use Illuminate\Http\RedirectResponse;

class StoreAction extends Controller
{
    public function __invoke(StorePaymentRequest $request, PatientProfile $patient, BillingService $billing): RedirectResponse
    {
        $this->authorize('view', $patient);

        $validated = $request->validated();

        $invoice = Invoice::create([
            'workspace_id' => $request->user()->currentWorkspaceId(),
            'patient_id' => $patient->user_id,
            'professional_id' => $request->user()->id,
            'invoice_number' => $billing->generateInvoiceNumber($request->user()),
            'status' => 'draft',
            'issued_at' => now(),
            'subtotal' => $validated['amount'],
            'tax_rate' => 0,
            'tax_amount' => 0,
            'total' => $validated['amount'],
            'payment_method' => $validated['payment_method'] ?? null,
            'due_at' => $validated['due_at'],
            'notes' => $validated['notes'] ?? null,
        ]);

        InvoiceItem::create([
            'invoice_id' => $invoice->id,
            'description' => $validated['notes'] ?? 'Sesión',
            'quantity' => 1,
            'unit_price' => $validated['amount'],
            'total' => $validated['amount'],
            'appointment_id' => $validated['appointment_id'] ?? null,
        ]);

        return back()->with('success', 'Factura creada.');
    }
}
