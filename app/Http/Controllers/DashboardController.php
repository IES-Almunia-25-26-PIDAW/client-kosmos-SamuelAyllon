<?php

namespace App\Http\Controllers;

use App\Models\KosmoBriefing;
use App\Models\Patient;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $activePatients = Patient::where('user_id', $user->id)
            ->where('is_active', true)
            ->get();

        $todaySessions = $user->sessions()
            ->with('patient')
            ->whereDate('scheduled_at', today())
            ->orderBy('scheduled_at')
            ->get();

        $alerts = [
            'payment' => Patient::where('user_id', $user->id)
                ->whereIn('payment_status', ['pending', 'overdue'])
                ->get(['id', 'project_name', 'payment_status']),
            'consent' => Patient::where('user_id', $user->id)
                ->where('has_valid_consent', false)
                ->where('is_active', true)
                ->get(['id', 'project_name']),
        ];

        $dailyBriefing = KosmoBriefing::where('user_id', $user->id)
            ->where('type', 'daily')
            ->whereDate('for_date', today())
            ->first();

        $stats = [
            'sessions_this_week'  => $user->sessions()->whereBetween('scheduled_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'pending_payments'    => $user->payments()->whereIn('status', ['pending', 'overdue'])->sum('amount'),
            'active_patients'     => $activePatients->count(),
            'collection_rate'     => $this->getCollectionRate($user->id),
        ];

        return Inertia::render('dashboard', [
            'activePatients' => $activePatients,
            'todaySessions'  => $todaySessions,
            'alerts'         => $alerts,
            'dailyBriefing'  => $dailyBriefing,
            'stats'          => $stats,
        ]);
    }

    private function getCollectionRate(int $userId): float
    {
        $total = \App\Models\Payment::where('user_id', $userId)->count();
        if ($total === 0) return 100.0;
        $paid = \App\Models\Payment::where('user_id', $userId)->where('status', 'paid')->count();
        return round(($paid / $total) * 100, 1);
    }
}
