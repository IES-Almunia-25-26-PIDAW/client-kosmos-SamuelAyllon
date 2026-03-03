<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVoiceRecordingRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use OpenAI;

class VoiceRecordingController extends Controller
{
    public function transcribe(StoreVoiceRecordingRequest $request): JsonResponse
    {
        $user = Auth::user();

        $path = $request->file('audio')->store(
            "voice-recordings/{$user->id}",
            'local'
        );

        $recording = $user->voiceRecordings()->create([
            'file_path' => $path,
            'status' => 'pending',
        ]);

        $recording->markAsProcessing();

        try {
            $client = OpenAI::client(config('services.openai.key'));

            $response = $client->audio()->transcribe([
                'model' => 'whisper-1',
                'file' => fopen(Storage::disk('local')->path($path), 'r'),
                'response_format' => 'json',
            ]);

            $transcription = trim($response->text);

            $recording->markAsCompleted($transcription);

            return response()->json([
                'transcription' => $transcription,
                'recording_id' => $recording->id,
            ]);
        } catch (\Throwable $e) {
            $recording->markAsFailed($e->getMessage());

            return response()->json([
                'error' => 'Error al transcribir el audio. Inténtalo de nuevo.',
            ], 422);
        }
    }
}
