<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Jobs\SummarizeSessionJob;
use App\Models\Appointment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SummarizeAction extends Controller
{
    public function __invoke(Request $request, Appointment $appointment): JsonResponse
    {
        $user = $request->user();

        abort_unless(
            $user !== null && $user->id === $appointment->professional_id,
            403,
        );

        $recording = $appointment->sessionRecording;

        if ($recording === null) {
            return response()->json([
                'error' => 'transcription_pending',
                'message' => 'No hay grabación asociada a esta cita.',
            ], 409);
        }

        if (trim((string) $recording->transcription) === '') {
            return response()->json([
                'error' => 'transcription_pending',
                'message' => 'La transcripción aún no está lista.',
            ], 409);
        }

        SummarizeSessionJob::dispatch($recording->id);

        return response()->json([
            'status' => 'queued',
            'recording_id' => $recording->id,
        ]);
    }
}
