<?php

namespace App\Http\Controllers\Portal\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowAction extends Controller
{
    public function __invoke(Request $request, Invoice $invoice): Response
    {
        abort_if($invoice->patient_id !== $request->user()->id, 403);

        $invoice->load(['items', 'workspace']);

        return Inertia::render('portal/invoices/show', [
            'invoice' => $invoice,
        ]);
    }
}
