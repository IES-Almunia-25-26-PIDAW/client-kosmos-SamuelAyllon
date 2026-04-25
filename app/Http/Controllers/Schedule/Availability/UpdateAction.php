<?php

namespace App\Http\Controllers\Schedule\Availability;

use App\Http\Controllers\Controller;
use App\Models\Availability;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UpdateAction extends Controller
{
    public function __invoke(Request $request, Availability $availability): RedirectResponse
    {
        $validated = $request->validate([
            'date' => ['required', 'date'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'slot_duration_minutes' => ['nullable', 'integer', 'min:15', 'max:240'],
            'is_recurring' => ['boolean'],
            'is_active' => ['boolean'],
        ]);

        $isRecurring = (bool) ($validated['is_recurring'] ?? ($availability->day_of_week !== null));
        $date = Carbon::parse($validated['date']);

        $availability->update([
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'slot_duration_minutes' => $validated['slot_duration_minutes'] ?? $availability->slot_duration_minutes,
            'is_active' => $validated['is_active'] ?? $availability->is_active,
            'day_of_week' => $isRecurring ? $date->dayOfWeek : null,
            'specific_date' => $isRecurring ? null : $date->toDateString(),
        ]);

        return back()->with('success', 'Disponibilidad actualizada.');
    }
}
