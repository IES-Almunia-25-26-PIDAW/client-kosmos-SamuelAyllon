<?php

namespace App\Http\Controllers\Admin\Workspaces;

use App\Http\Controllers\Controller;
use App\Models\Workspace;
use App\Models\Invoice;
use Inertia\Inertia;
use Inertia\Response;

class ShowAction extends Controller
{
    public function __invoke(Workspace $workspace): Response
    {
        $workspace->load([
            'creator:id,name,email',
            'members' => fn ($q) => $q->withPivot(['role', 'is_active', 'joined_at']),
            'services',
        ]);

        $stats = [
            'revenue_total' => Invoice::where('workspace_id', $workspace->id)
                ->where('status', 'paid')
                ->sum('total'),
            'invoices_count' => Invoice::where('workspace_id', $workspace->id)->count(),
        ];

        return Inertia::render('admin/workspaces/show', [
            'workspace' => $workspace,
            'stats'  => $stats,
        ]);
    }
}
