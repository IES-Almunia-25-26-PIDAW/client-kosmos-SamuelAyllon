<?php

namespace App\Http\Controllers\Portal\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StoreAction extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $profile = $request->user()->patientProfile()->firstOrFail();

        $validated = $request->validate([
            'service_id'      => ['required', Rule::exists('services', 'id')->where('workspace_id', $profile->workspace_id)],
            'professional_id' => ['required', Rule::exists('workspace_members', 'user_id')->where('workspace_id', $profile->workspace_id)->where('is_active', true)],
            'starts_at'       => ['required', 'date', 'after:now'],
            'modality'        => ['required', 'in:in_person,video_call'],
        ]);

        $service = \App\Models\Service::findOrFail($validated['service_id']);

        Appointment::create([
            'workspace_id'       => $profile->workspace_id,
            'patient_id'      => $request->user()->id,
            'professional_id' => $validated['professional_id'],
            'service_id'      => $validated['service_id'],
            'starts_at'       => $validated['starts_at'],
            'ends_at'         => \Carbon\Carbon::parse($validated['starts_at'])->addMinutes($service->duration_minutes),
            'modality'        => $validated['modality'],
            'status'          => 'pending',
        ]);

        return redirect()->route('portal.appointments.index')
            ->with('success', 'Cita solicitada.');
    }
}
