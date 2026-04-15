<?php

namespace App\Http\Controllers\Schedule\Availability;

use App\Http\Controllers\Controller;
use App\Models\Availability;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class StoreAction extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'day_of_week'           => ['required', 'integer', 'between:0,6'],
            'start_time'            => ['required', 'date_format:H:i'],
            'end_time'              => ['required', 'date_format:H:i', 'after:start_time'],
            'slot_duration_minutes' => ['required', 'integer', 'min:15', 'max:240'],
        ]);

        Availability::create([
            ...$validated,
            'professional_id' => $request->user()->id,
            'workspace_id'       => $request->user()->currentWorkspaceId(),
            'is_active'       => true,
        ]);

        return back()->with('success', 'Disponibilidad creada.');
    }
}
