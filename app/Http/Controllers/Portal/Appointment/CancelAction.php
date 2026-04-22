<?php

namespace App\Http\Controllers\Portal\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CancelAction extends Controller
{
    public function __invoke(Request $request, Appointment $appointment): RedirectResponse
    {
        abort_if($appointment->patient_id !== $request->user()->id, 403);

        if (! in_array($appointment->status, ['pending', 'confirmed'])) {
            return back()->withErrors(['status' => 'Esta cita no puede cancelarse.']);
        }

        $request->validate([
            'cancellation_reason' => ['nullable', 'string'],
        ]);

        $appointment->update([
            'status'              => 'cancelled',
            'cancelled_by'        => $request->user()->id,
            'cancellation_reason' => $request->cancellation_reason,
        ]);

        return redirect()->route('patient.appointments.index')
            ->with('success', 'Cita cancelada.');
    }
}
