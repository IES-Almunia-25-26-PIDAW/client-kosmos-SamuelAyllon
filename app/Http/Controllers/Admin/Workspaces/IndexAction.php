<?php

namespace App\Http\Controllers\Admin\Workspaces;

use App\Http\Controllers\Controller;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $workspaces = Workspace::withCount(['members', 'services'])
            ->with('creator:id,name,email')
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/workspaces/index', [
            'workspaces' => $workspaces,
            'filters' => $request->only(['search']),
        ]);
    }
}
