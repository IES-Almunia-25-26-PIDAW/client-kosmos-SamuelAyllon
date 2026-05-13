<?php

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public static function statsCacheKey(int $professionalId): string
    {
        return "invoice-stats:{$professionalId}:".now()->format('Y-m');
    }

    /**
     * @return array{total_paid: float, total_pending: float, total_overdue: float}
     */
    /**
     * @return array{total_paid: float, total_pending: float, total_overdue: float}
     */
    private static function computeStats(int $professionalId): array
    {
        $monthStart = now()->startOfMonth();
        $nextMonthStart = now()->startOfMonth()->addMonth();

        $row = Invoice::query()
            ->where('professional_id', $professionalId)
            ->selectRaw(
                "COALESCE(SUM(CASE WHEN status = 'paid'
                    AND paid_at >= ? AND paid_at < ? THEN total END), 0) AS total_paid,
                COALESCE(SUM(CASE WHEN status IN ('draft', 'sent') THEN total END), 0) AS total_pending,
                COALESCE(SUM(CASE WHEN status = 'overdue' THEN total END), 0) AS total_overdue",
                [$monthStart, $nextMonthStart]
            )
            ->first();

        return [
            'total_paid' => (float) ($row->total_paid ?? 0),
            'total_pending' => (float) ($row->total_pending ?? 0),
            'total_overdue' => (float) ($row->total_overdue ?? 0),
        ];
    }

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

        $stats = Cache::remember(
            self::statsCacheKey($user->id),
            now()->addMinutes(5),
            fn () => self::computeStats($user->id),
        );

        $payments = $invoices->through(fn (Invoice $invoice) => [
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
            'stripe_checkout_pending' => $invoice->stripe_checkout_session_id !== null
                && $invoice->status === 'sent',
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

        $pendingBilling = Appointment::where('professional_id', $user->id)
            ->where('status', 'completed')
            ->whereDoesntHave('invoiceItems.invoice')
            ->with(['patient', 'service'])
            ->orderByDesc('ends_at')
            ->limit(20)
            ->get()
            ->map(fn (Appointment $appointment) => [
                'id' => $appointment->id,
                'patient_name' => $appointment->patient?->name,
                'service_name' => $appointment->service?->name,
                'price' => $appointment->service?->price !== null ? (float) $appointment->service->price : null,
                'ended_at' => $appointment->ends_at->toIso8601String(),
            ]);

        return Inertia::render('professional/invoices/index', [
            'payments' => $payments,
            'stats' => $stats,
            'filters' => $request->only(['status', 'patient_id']),
            'pendingBilling' => $pendingBilling,
        ]);
    }
}
