<?php

namespace App\Http\Controllers\Workspace\Team;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $workspace = $request->user()->currentWorkspace();

        $members = $workspace->members()
            ->withPivot(['role', 'joined_at', 'is_active'])
            ->get();

        return Inertia::render('professional/workspace/team/index', [
            'workspace' => $workspace,
            'members' => $members,
        ]);
    }
}
