<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class StoreAction extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'patient_id'      => ['required', 'exists:users,id'],
            'service_id'      => ['nullable', 'exists:services,id'],
            'starts_at'       => ['required', 'date'],
            'ends_at'         => ['required', 'date', 'after:starts_at'],
            'modality'        => ['required', 'in:in_person,video_call'],
            'notes'           => ['nullable', 'string'],
        ]);

        $appointment = Appointment::create([
            ...$validated,
            'workspace_id'       => $request->user()->currentWorkspaceId(),
            'professional_id' => $request->user()->id,
            'status'          => 'pending',
        ]);

        return redirect()->route('professional.appointments.show', $appointment)
            ->with('success', 'Cita creada.');
    }
}
