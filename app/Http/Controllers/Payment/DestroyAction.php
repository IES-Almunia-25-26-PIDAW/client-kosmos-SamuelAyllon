<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;

class DestroyAction extends Controller
{
    public function __invoke(Patient $patient, Payment $payment): RedirectResponse
    {
        $this->authorize('delete', $payment);

        $payment->delete();

        return back()->with('success', 'Cobro eliminado.');
    }
}
