<?php

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentRequest;
use App\Models\Invoice;
use App\Models\PatientProfile;
use Illuminate\Http\RedirectResponse;

class UpdateAction extends Controller
{
    public function __invoke(StorePaymentRequest $request, PatientProfile $patient, Invoice $invoice): RedirectResponse
    {
        $this->authorize('update', $invoice);

        $validated = $request->validated();

        $invoice->update([
            'payment_method' => $validated['payment_method'] ?? $invoice->payment_method,
            'due_at' => $validated['due_at'],
            'notes' => $validated['notes'] ?? $invoice->notes,
            'subtotal' => $validated['amount'],
            'total' => $validated['amount'],
        ]);

        return back()->with('success', 'Factura actualizada.');
    }
}
