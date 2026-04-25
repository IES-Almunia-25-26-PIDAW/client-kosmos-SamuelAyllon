<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Services\KosmoService;
use Illuminate\Http\JsonResponse;

class SummarizeAction extends Controller
{
    public function __invoke(Appointment $appointment, KosmoService $kosmo): JsonResponse
    {
        $recording = $appointment->sessionRecording;

        if (! $recording || ! $recording->transcription) {
            return response()->json(['error' => 'No hay transcripción disponible.'], 422);
        }

        // @todo Dispatch Llama 3.3 summarization job
        // SummarizeRecording::dispatch($recording);

        return response()->json(['status' => 'queued', 'recording_id' => $recording->id]);
    }
}
