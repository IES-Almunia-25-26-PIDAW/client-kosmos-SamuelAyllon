<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentRequest;
use App\Models\Patient;
use Illuminate\Http\RedirectResponse;

class StoreAction extends Controller
{
    public function __invoke(StorePaymentRequest $request, Patient $patient): RedirectResponse
    {
        $this->authorize('view', $patient);

        $patient->payments()->create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Cobro registrado.');
    }
}
