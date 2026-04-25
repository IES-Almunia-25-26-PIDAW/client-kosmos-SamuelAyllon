<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UpdateAction extends Controller
{
    public function __invoke(Request $request, Appointment $appointment): RedirectResponse
    {
        $validated = $request->validate([
            'service_id' => ['nullable', 'exists:services,id'],
            'starts_at'  => ['required', 'date'],
            'ends_at'    => ['required', 'date', 'after:starts_at'],
            'modality'   => ['required', 'in:in_person,video_call'],
            'notes'      => ['nullable', 'string'],
        ]);

        $appointment->update($validated);

        return back()->with('success', 'Cita actualizada.');
    }
}
