<?php

namespace App\Http\Controllers\Portal\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ConfirmAction extends Controller
{
    public function __invoke(Request $request, Appointment $appointment): RedirectResponse
    {
        abort_if($appointment->patient_id !== $request->user()->id, 403);

        if ($appointment->status !== 'pending') {
            return back()->withErrors(['status' => 'Solo las citas pendientes pueden confirmarse.']);
        }

        if ($appointment->starts_at->lessThan(now()->addHours(24))) {
            return back()->withErrors([
                'status' => 'Las citas deben confirmarse con al menos 24 horas de antelación.',
            ]);
        }

        $appointment->update([
            'status' => 'confirmed',
            'confirmed_at' => now(),
        ]);

        return back()->with('success', 'Cita confirmada.');
    }
}
