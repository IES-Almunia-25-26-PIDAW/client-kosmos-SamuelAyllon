<?php

namespace App\Http\Controllers\Portal\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Availability;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $workspaceId = $request->user()->patientProfile?->workspace_id;

        $services      = Service::where('workspace_id', $workspaceId)->where('is_active', true)->get();
        $availabilities = Availability::where('workspace_id', $workspaceId)->where('is_active', true)->get();

        return Inertia::render('portal/appointments/book', [
            'services'       => $services,
            'availabilities' => $availabilities,
        ]);
    }
}
