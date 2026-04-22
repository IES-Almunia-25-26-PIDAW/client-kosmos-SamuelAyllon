<?php

namespace App\Http\Controllers\Workspace\Services;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $workspace = $request->user()->currentWorkspace();
        $services = $workspace->services()->orderBy('name')->get();

        return Inertia::render('professional/workspace/services/index', [
            'workspace' => $workspace,
            'services' => $services,
        ]);
    }
}
