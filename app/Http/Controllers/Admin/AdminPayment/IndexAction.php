<?php

namespace App\Http\Controllers\Admin\AdminPayment;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(): Response
    {
        $payments = Payment::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $summary = [
            'total_completed' => Payment::where('status', 'completed')->sum('amount'),
            'total_pending' => Payment::where('status', 'pending')->count(),
            'total_failed' => Payment::where('status', 'failed')->count(),
        ];

        return Inertia::render('admin/payments/index', [
            'payments' => $payments,
            'summary' => $summary,
        ]);
    }
}
