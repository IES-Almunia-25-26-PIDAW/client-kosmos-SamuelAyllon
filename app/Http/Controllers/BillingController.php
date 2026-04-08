<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BillingController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $payments = Payment::where('user_id', $user->id)
            ->with('patient:id,project_name')
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->when($request->patient_id, fn ($q, $p) => $q->where('patient_id', $p))
            ->orderByDesc('due_date')
            ->paginate(20)
            ->withQueryString();

        $stats = [
            'total_paid'    => Payment::where('user_id', $user->id)->where('status', 'paid')->whereMonth('paid_at', now()->month)->sum('amount'),
            'total_pending' => Payment::where('user_id', $user->id)->whereIn('status', ['pending', 'overdue'])->sum('amount'),
            'total_overdue' => Payment::where('user_id', $user->id)->where('status', 'overdue')->sum('amount'),
        ];

        return Inertia::render('billing/index', [
            'payments' => $payments,
            'stats'    => $stats,
            'filters'  => $request->only(['status', 'patient_id']),
        ]);
    }
}
