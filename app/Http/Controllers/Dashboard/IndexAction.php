<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\ConsentForm;
use App\Models\KosmoBriefing;
use App\Models\PatientProfile;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        // Legacy query using user_id (professional) — will be refactored in S7
        $activePatients = PatientProfile::withoutGlobalScopes()
            ->where('user_id', $user->id)
            ->where('is_active', true)
            ->get();

        $todaySessions = $user->sessions()
            ->with('patient')
            ->whereDate('scheduled_at', today())
            ->orderBy('scheduled_at')
            ->get();

        $alerts = [
            'payment' => PatientProfile::withoutGlobalScopes()
                ->where('user_id', $user->id)
                ->whereHas('payments', fn ($q) => $q->whereIn('status', ['pending', 'overdue']))
                ->where('is_active', true)
                ->get(['id', 'user_id']),
            'consent' => PatientProfile::withoutGlobalScopes()
                ->where('user_id', $user->id)
                ->whereDoesntHave('consentForms', fn ($q) => $q
                    ->where('status', 'signed')
                    ->where(fn ($q2) => $q2->whereNull('expires_at')->orWhere('expires_at', '>', now())))
                ->where('is_active', true)
                ->get(['id', 'user_id']),
        ];

        $dailyBriefing = KosmoBriefing::where('user_id', $user->id)
            ->where('type', 'daily')
            ->whereDate('for_date', today())
            ->first();

        $stats = [
            'sessions_this_week' => $user->sessions()->whereBetween('scheduled_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'pending_payments'   => $user->payments()->whereIn('status', ['pending', 'overdue'])->sum('amount'),
            'active_patients'    => $activePatients->count(),
            'collection_rate'    => $this->getCollectionRate($user->id),
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
        $total = Payment::where('user_id', $userId)->count();
        if ($total === 0) {
            return 100.0;
        }
        $paid = Payment::where('user_id', $userId)->where('status', 'paid')->count();

        return round(($paid / $total) * 100, 1);
    }
}
