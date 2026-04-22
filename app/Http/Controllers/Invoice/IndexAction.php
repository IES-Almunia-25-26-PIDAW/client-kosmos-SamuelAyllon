<?php

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $invoices = Invoice::where('professional_id', $user->id)
            ->with(['items', 'patient'])
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->when($request->patient_id, fn ($q, $p) => $q->where('patient_id', $p))
            ->orderByDesc('issued_at')
            ->paginate(20)
            ->withQueryString();

        $stats = [
            'total_paid' => Invoice::where('professional_id', $user->id)
                ->where('status', 'paid')
                ->whereYear('paid_at', now()->year)
                ->whereMonth('paid_at', now()->month)
                ->sum('total'),
            'total_pending' => Invoice::where('professional_id', $user->id)
                ->whereIn('status', ['draft', 'sent'])
                ->sum('total'),
            'total_overdue' => Invoice::where('professional_id', $user->id)
                ->where('status', 'overdue')
                ->sum('total'),
        ];

        $payments = $invoices->through(fn ($invoice) => [
            'id' => $invoice->id,
            'patient_id' => $invoice->patient_id,
            'user_id' => $invoice->professional_id,
            'consulting_session_id' => null,
            'amount' => (float) $invoice->total,
            'concept' => $invoice->notes,
            'payment_method' => $invoice->payment_method,
            'status' => match ($invoice->status) {
                'draft', 'sent' => 'pending',
                default => $invoice->status,
            },
            'due_date' => $invoice->due_at?->format('Y-m-d'),
            'paid_at' => $invoice->paid_at?->toIso8601String(),
            'invoice_number' => $invoice->invoice_number,
            'invoice_sent_at' => null,
            'reminder_count' => 0,
            'last_reminder_at' => null,
            'created_at' => $invoice->created_at?->toIso8601String(),
            'updated_at' => $invoice->updated_at?->toIso8601String(),
            'patient' => $invoice->patient ? [
                'id' => $invoice->patient->id,
                'project_name' => $invoice->patient->name,
            ] : null,
        ]);

        return Inertia::render('professional/invoices/index', [
            'payments' => $payments,
            'stats' => $stats,
            'filters' => $request->only(['status', 'patient_id']),
        ]);
    }
}
