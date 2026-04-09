<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentRequest;
use App\Models\Patient;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;

class UpdateAction extends Controller
{
    public function __invoke(StorePaymentRequest $request, Patient $patient, Payment $payment): RedirectResponse
    {
        $this->authorize('update', $payment);

        $payment->update($request->validated());

        return back()->with('success', 'Cobro actualizado.');
    }
}
