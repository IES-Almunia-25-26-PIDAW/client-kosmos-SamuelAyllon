<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Services\GoogleCalendarService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StoreAction extends Controller
{
    public function __invoke(Request $request, GoogleCalendarService $google): RedirectResponse
    {
        $validated = $request->validate([
            'patient_id' => ['required', 'exists:users,id'],
            'service_id' => ['nullable', 'exists:offered_consultations,id'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['required', 'date', 'after:starts_at'],
            'modality' => ['required', 'in:in_person,video_call'],
            'notes' => ['nullable', 'string'],
        ]);

        $appointment = Appointment::create([
            ...$validated,
            'workspace_id' => $request->user()->currentWorkspaceId(),
            'professional_id' => $request->user()->id,
            'status' => 'pending',
        ]);

        // Create Google Meet event if professional has Google connected and modality is video_call
        if ($validated['modality'] === 'video_call' && $request->user()->google_refresh_token !== null) {
            try {
                $meet = $google->createMeetEvent($appointment);
                $appointment->update([
                    'meeting_url' => $meet['meet_url'],
                    'external_calendar_event_id' => $meet['event_id'],
                ]);
            } catch (\Throwable $e) {
                Log::error('GoogleCalendarService::createMeetEvent failed', [
                    'appointment_id' => $appointment->id,
                    'error' => $e->getMessage(),
                ]);
                // Non-fatal: appointment is created, Meet link can be added manually
            }
        }

        return redirect()->route('professional.appointments.show', $appointment)
            ->with('success', 'Cita creada.');
    }
}
