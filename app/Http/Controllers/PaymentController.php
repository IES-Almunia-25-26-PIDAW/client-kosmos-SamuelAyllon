<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaymentRequest;
use App\Models\Patient;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;

class PaymentController extends Controller
{
    public function store(StorePaymentRequest $request, Patient $patient): RedirectResponse
    {
        $this->authorize('view', $patient);

        $patient->payments()->create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Cobro registrado.');
    }

    public function update(StorePaymentRequest $request, Patient $patient, Payment $payment): RedirectResponse
    {
        $this->authorize('update', $payment);

        $payment->update($request->validated());

        return back()->with('success', 'Cobro actualizado.');
    }

    public function destroy(Patient $patient, Payment $payment): RedirectResponse
    {
        $this->authorize('delete', $payment);

        $payment->delete();

        return back()->with('success', 'Cobro eliminado.');
    }
}
