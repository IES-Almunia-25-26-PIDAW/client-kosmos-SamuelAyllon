<?php

namespace App\Http\Controllers\Workspace\Analytics;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\CaseAssignment;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $workspaceId = $request->user()->currentWorkspaceId();

        $stats = [
            'total_patients' => CaseAssignment::where('workspace_id', $workspaceId)
                ->where('status', 'active')
                ->count(),
            'appointments_month' => Appointment::where('workspace_id', $workspaceId)
                ->whereYear('starts_at', now()->year)
                ->whereMonth('starts_at', now()->month)
                ->count(),
            'revenue_month' => Invoice::where('workspace_id', $workspaceId)
                ->where('status', 'paid')
                ->whereYear('paid_at', now()->year)
                ->whereMonth('paid_at', now()->month)
                ->sum('total'),
            'pending_invoices' => Invoice::where('workspace_id', $workspaceId)
                ->whereIn('status', ['draft', 'sent'])
                ->count(),
        ];

        return Inertia::render('professional/workspace/analytics/index', [
            'stats' => $stats,
        ]);
    }
}
