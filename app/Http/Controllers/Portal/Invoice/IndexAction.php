<?php

namespace App\Http\Controllers\Portal\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $invoices = Invoice::where('patient_id', $request->user()->id)
            ->with('items')
            ->orderByDesc('issued_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('patient/invoices/index', [
            'invoices' => $invoices,
        ]);
    }
}
