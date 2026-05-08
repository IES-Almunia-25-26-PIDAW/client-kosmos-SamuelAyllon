<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Jobs\TranscribeChunkJob;
use App\Models\Appointment;
use App\Models\SessionRecording;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TranscribeAction extends Controller
{
    public function __invoke(Request $request, Appointment $appointment): JsonResponse
    {
        $user = $request->user();

        abort_unless(
            $user->id === $appointment->patient_id || $user->id === $appointment->professional_id,
            403,
        );

        $data = $request->validate([
            'chunk' => ['required', 'file', 'mimes:mp3,mp4,webm,ogg,wav,m4a', 'max:20480'],
            'position' => ['required', 'integer', 'min:0'],
            'started_at_ms' => ['required', 'integer', 'min:0'],
            'ended_at_ms' => ['required', 'integer', 'gt:started_at_ms'],
        ]);

        $recording = SessionRecording::firstOrCreate(
            ['appointment_id' => $appointment->id],
            ['transcription_status' => 'processing', 'language' => 'es'],
        );

        if ($user->id === $appointment->patient_id && ! $recording->hasPatientConsent()) {
            abort(403, 'El paciente debe otorgar el consentimiento antes de transcribir.');
        }

        if ($recording->transcription_status === 'pending') {
            $recording->update(['transcription_status' => 'processing']);
        }

        $uploaded = $request->file('chunk');
        $extension = $uploaded->getClientOriginalExtension() ?: 'webm';
        $chunkPath = sprintf(
            'transcription-chunks/%d/%s.%s.enc',
            $recording->id,
            Str::ulid(),
            $extension,
        );

        Storage::disk('local')->put(
            $chunkPath,
            Crypt::encryptString((string) $uploaded->get()),
        );

        TranscribeChunkJob::dispatch(
            sessionRecordingId: $recording->id,
            speakerUserId: $user->id,
            position: (int) $data['position'],
            startedAtMs: (int) $data['started_at_ms'],
            endedAtMs: (int) $data['ended_at_ms'],
            chunkPath: $chunkPath,
        );

        return response()->json([
            'status' => 'queued',
            'recording_id' => $recording->id,
            'position' => (int) $data['position'],
        ]);
    }
}
