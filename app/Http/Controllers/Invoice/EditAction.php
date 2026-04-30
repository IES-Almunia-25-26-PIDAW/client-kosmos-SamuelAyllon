<?php

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Inertia\Inertia;
use Inertia\Response;

class EditAction extends Controller
{
    public function __invoke(Invoice $invoice): Response
    {
        $this->authorize('update', $invoice);

        abort_unless(
            $invoice->status === 'draft',
            403,
            'Solo se pueden editar facturas en borrador.',
        );

        $invoice->load(['items', 'patient', 'professional', 'workspace']);

        return Inertia::render('professional/invoices/edit', [
            'invoice' => $invoice,
        ]);
    }
}
