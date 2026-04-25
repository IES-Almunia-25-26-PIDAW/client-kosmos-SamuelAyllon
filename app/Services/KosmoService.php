<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\PatientProfile;
use App\Models\SessionRecording;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class KosmoService
{
    /**
     * @todo Generate a daily briefing for the user with appointment agenda, alerts, and key reminders
     */
    public function generateDailyBriefing(User $user): void
    {
        // @todo
    }

    /**
     * @todo Generate a pre-session briefing for the patient, summarizing last appointment,
     *       open agreements, invoice status and key notes
     */
    public function generatePreSessionBriefing(PatientProfile $patient, Appointment $appointment): void
    {
        // @todo
    }

    /**
     * @todo Generate a post-session briefing summarizing what was discussed and agreed
     */
    public function generatePostSessionBriefing(Appointment $appointment): void
    {
        // @todo
    }

    /**
     * @todo Handle a chat message from the user, returning Kosmo's response
     */
    public function chat(User $user, string $message): string
    {
        // @todo
        return '';
    }

    /**
     * Summarize a session recording using Groq LLM.
     *
     * @return array{key_points: string[], patient_state: string, next_actions: string[], raw: string}
     */
    public function summarizeSession(SessionRecording $recording): array
    {
        $transcription = $recording->transcription ?? '';

        if (trim($transcription) === '') {
            return ['key_points' => [], 'patient_state' => '', 'next_actions' => [], 'raw' => ''];
        }

        $systemPrompt = <<<'PROMPT'
Eres un asistente clínico para psicólogos. Recibirás la transcripción de una sesión terapéutica.
Responde ÚNICAMENTE con un JSON válido con exactamente estas claves:
{
  "key_points": ["punto 1", "punto 2", ...],
  "patient_state": "descripción breve del estado emocional del paciente",
  "next_actions": ["acción 1", "acción 2", ...]
}
Sé conciso, clínico y neutral. Máximo 5 key_points y 3 next_actions.
PROMPT;

        $response = Http::withToken(config('services.groq.api_key'))
            ->post(rtrim((string) config('services.groq.base_url'), '/').'/chat/completions', [
                'model' => config('services.groq.model', 'llama-3.3-70b-versatile'),
                'response_format' => ['type' => 'json_object'],
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => "Transcripción:\n\n".$transcription],
                ],
                'temperature' => 0.3,
                'max_tokens' => 800,
            ]);

        if ($response->failed()) {
            Log::error('KosmoService::summarizeSession Groq failed', [
                'status' => $response->status(),
                'body' => $response->body(),
                'recording_id' => $recording->id,
            ]);
            throw new \RuntimeException('Groq summarization failed');
        }

        $raw = trim((string) $response->json('choices.0.message.content', ''));
        $parsed = json_decode($raw, true) ?? [];

        return [
            'key_points' => (array) ($parsed['key_points'] ?? []),
            'patient_state' => (string) ($parsed['patient_state'] ?? ''),
            'next_actions' => (array) ($parsed['next_actions'] ?? []),
            'raw' => $raw,
        ];
    }
}
