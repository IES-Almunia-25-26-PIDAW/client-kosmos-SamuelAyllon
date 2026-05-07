<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\KosmoBriefing;
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
     * Generate a deterministic pre-session briefing aggregating last appointment,
     * open agreements, last invoice status and recent notes. Idempotent per appointment.
     */
    public function generatePreSessionBriefing(PatientProfile $patient, Appointment $appointment): void
    {
        $exists = KosmoBriefing::query()
            ->where('patient_id', $patient->id)
            ->where('appointment_id', $appointment->id)
            ->where('type', 'pre_session')
            ->exists();

        if ($exists) {
            return;
        }

        $previousAppointment = $patient->appointments()
            ->where('id', '!=', $appointment->id)
            ->where('starts_at', '<', $appointment->starts_at)
            ->orderByDesc('starts_at')
            ->first();

        $openAgreements = $patient->agreements()->where('is_completed', false)->limit(5)->get();
        $recentNotes = $patient->notes()->orderByDesc('created_at')->limit(3)->get();
        $lastInvoice = $patient->invoices()->orderByDesc('due_at')->first();

        $content = [
            'next_session' => 'Próxima sesión: '.$appointment->starts_at->format('d/m/Y H:i'),
            'previous_session' => $previousAppointment
                ? 'Última sesión: '.$previousAppointment->starts_at->format('d/m/Y')
                : 'Es la primera sesión registrada con este paciente.',
            'open_agreements' => $openAgreements->isEmpty()
                ? 'Sin acuerdos pendientes.'
                : 'Acuerdos pendientes: '.$openAgreements->pluck('content')->implode(' · '),
            'recent_notes' => $recentNotes->isEmpty()
                ? 'Sin notas recientes.'
                : 'Notas recientes: '.$recentNotes->pluck('content')->map(fn ($c) => str($c)->limit(80))->implode(' / '),
            'payment_status' => $lastInvoice
                ? 'Última factura: '.$lastInvoice->status.' ('.number_format((float) $lastInvoice->total, 2).' €)'
                : 'Sin facturas registradas.',
            'consent_status' => $patient->consentForms()->where('status', 'signed')->exists()
                ? 'Consentimiento RGPD vigente.'
                : 'Atención: paciente sin consentimiento RGPD firmado.',
        ];

        KosmoBriefing::create([
            'user_id' => $appointment->professional_id,
            'patient_id' => $patient->id,
            'appointment_id' => $appointment->id,
            'type' => 'pre_session',
            'content' => $content,
            'is_read' => false,
            'for_date' => $appointment->starts_at->toDateString(),
        ]);
    }

    /**
     * Generate a post-session briefing aggregating AI summary, session notes,
     * and open agreements. Idempotent per appointment.
     */
    public function generatePostSessionBriefing(Appointment $appointment): void
    {
        $patient = PatientProfile::where('user_id', $appointment->patient_id)->first();

        if ($patient === null) {
            return;
        }

        $exists = KosmoBriefing::query()
            ->where('patient_id', $patient->id)
            ->where('appointment_id', $appointment->id)
            ->where('type', 'post_session')
            ->exists();

        if ($exists) {
            return;
        }

        $recording = $appointment->sessionRecording;
        $parsed = json_decode((string) ($recording?->ai_summary ?? ''), true);
        $parsed = is_array($parsed) ? $parsed : [];

        $sessionNotes = $appointment->notes()->orderByDesc('created_at')->limit(5)->get();
        $sessionAgreements = $appointment->agreements()->where('is_completed', false)->limit(5)->get();

        $content = [
            'session_date' => $appointment->starts_at->format('d/m/Y H:i'),
            'key_points' => array_values(array_map('strval', (array) ($parsed['key_points'] ?? []))),
            'patient_state' => (string) ($parsed['patient_state'] ?? ''),
            'next_actions' => array_values(array_map('strval', (array) ($parsed['next_actions'] ?? []))),
            'session_notes' => $sessionNotes->pluck('content')
                ->map(fn ($c) => (string) str($c)->limit(120))
                ->values()
                ->all(),
            'open_agreements' => $sessionAgreements->pluck('content')->map(fn ($c) => (string) $c)->values()->all(),
            'summary_status' => $recording?->ai_summary ? 'ready' : 'pending',
        ];

        KosmoBriefing::create([
            'user_id' => $appointment->professional_id,
            'patient_id' => $patient->id,
            'appointment_id' => $appointment->id,
            'type' => 'post_session',
            'content' => $content,
            'is_read' => false,
            'for_date' => $appointment->starts_at->toDateString(),
        ]);
    }

    /**
     * Handle a chat message from the user via Groq LLM.
     */
    public function chat(User $user, string $message): string
    {
        $systemPrompt = <<<'PROMPT'
Eres Kosmo, asistente clínico para psicólogos en una plataforma de gestión de pacientes.
Responde en español, de forma breve, profesional y empática. Nunca des consejos médicos
fuera de tu ámbito; deriva al criterio del profesional cuando proceda.
PROMPT;

        $response = Http::withToken(config('services.groq.api_key'))
            ->post(rtrim((string) config('services.groq.base_url'), '/').'/chat/completions', [
                'model' => config('services.groq.model', 'llama-3.3-70b-versatile'),
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $message],
                ],
                'temperature' => 0.5,
                'max_tokens' => 600,
            ]);

        if ($response->failed()) {
            Log::error('KosmoService::chat Groq failed', [
                'status' => $response->status(),
                'body' => $response->body(),
                'user_id' => $user->id,
            ]);

            return 'No he podido procesar tu mensaje en este momento. Inténtalo de nuevo en unos instantes.';
        }

        return trim((string) $response->json('choices.0.message.content', ''));
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
