<?php

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Inertia\Inertia;
use Inertia\Response;

class ReviewAction extends Controller
{
    public function __invoke(Invoice $invoice): Response
    {
        $this->authorize('view', $invoice);

        $invoice->load(['items', 'patient', 'professional', 'workspace']);

        return Inertia::render('professional/invoices/review', [
            'invoice' => $invoice,
        ]);
    }
}
