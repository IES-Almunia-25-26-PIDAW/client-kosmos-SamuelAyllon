<?php

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\PatientProfile;
use Illuminate\Http\RedirectResponse;

class DestroyAction extends Controller
{
    public function __invoke(PatientProfile $patient, Invoice $invoice): RedirectResponse
    {
        $this->authorize('delete', $invoice);

        $invoice->delete();

        return back()->with('success', 'Factura eliminada.');
    }
}
