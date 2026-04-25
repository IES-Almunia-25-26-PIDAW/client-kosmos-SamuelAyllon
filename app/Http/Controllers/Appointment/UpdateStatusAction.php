<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UpdateStatusAction extends Controller
{
    private const ALLOWED_TRANSITIONS = [
        'pending' => ['confirmed', 'cancelled'],
        'confirmed' => ['in_progress', 'cancelled', 'no_show'],
        'in_progress' => ['completed'],
        'completed' => [],
        'cancelled' => [],
        'no_show' => [],
    ];

    public function __invoke(Request $request, Appointment $appointment): RedirectResponse
    {
        $request->validate([
            'status' => ['required', 'string'],
            'cancellation_reason' => ['nullable', 'string'],
        ]);

        $newStatus = $request->status;
        $allowed = self::ALLOWED_TRANSITIONS[$appointment->status] ?? [];

        if (! in_array($newStatus, $allowed)) {
            return back()->withErrors(['status' => 'Transición de estado no permitida.']);
        }

        $appointment->update([
            'status' => $newStatus,
            'cancellation_reason' => $request->cancellation_reason,
            'cancelled_by' => in_array($newStatus, ['cancelled']) ? $request->user()->id : $appointment->cancelled_by,
        ]);

        return back()->with('success', 'Estado actualizado.');
    }
}
