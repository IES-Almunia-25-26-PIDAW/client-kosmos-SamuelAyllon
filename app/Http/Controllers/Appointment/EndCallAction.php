<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Jobs\SummarizeSessionJob;
use App\Models\Appointment;
use Illuminate\Http\JsonResponse;

class EndCallAction extends Controller
{
    public function __invoke(Appointment $appointment): JsonResponse
    {
        abort_if(
            $appointment->status !== 'in_progress',
            422,
            'Solo se puede finalizar una llamada que está en progreso.'
        );

        $appointment->update(['status' => 'completed']);

        $recording = $appointment->sessionRecording;

        if ($recording !== null && trim((string) $recording->transcription) !== '') {
            SummarizeSessionJob::dispatch($recording->id);
        }

        return response()->json(['status' => 'completed']);
    }
}
