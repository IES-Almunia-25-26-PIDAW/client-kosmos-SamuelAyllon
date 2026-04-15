<?php

namespace App\Http\Controllers\Schedule\Availability;

use App\Http\Controllers\Controller;
use App\Models\Availability;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $availabilities = Availability::where('professional_id', $request->user()->id)
            ->where('workspace_id', $request->user()->currentWorkspaceId())
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        return Inertia::render('schedule/availability/index', [
            'availabilities' => $availabilities,
        ]);
    }
}
