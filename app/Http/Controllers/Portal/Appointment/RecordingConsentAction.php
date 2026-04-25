<?php

namespace App\Http\Controllers\Portal\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\SessionRecording;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RecordingConsentAction extends Controller
{
    public function __invoke(Request $request, Appointment $appointment): JsonResponse
    {
        abort_if($appointment->patient_id !== $request->user()->id, 403);

        $recording = SessionRecording::firstOrCreate(
            ['appointment_id' => $appointment->id],
            ['transcription_status' => 'pending', 'language' => 'es'],
        );

        if (! $recording->hasPatientConsent()) {
            $recording->update(['patient_consent_given_at' => now()]);
        }

        return response()->json([
            'recording_id' => $recording->id,
            'patient_consent_given_at' => $recording->patient_consent_given_at?->toIso8601String(),
        ]);
    }
}
