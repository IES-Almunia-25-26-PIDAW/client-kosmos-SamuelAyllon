---
adr: "0008"
title: "Transcripción chunked con Groq Whisper + captura independiente de Jitsi + consentimiento RGPD"
date: 2026-04-22
status: Aceptado
---

# ADR-0008 — Transcripción chunked con Groq Whisper + captura independiente de Jitsi + consentimiento RGPD

## Contexto

El flujo mínimo (P5/F5 del tracker) exige transcripción automática de la videoconsulta para poder alimentar el resumen IA posterior (F6a). La API de Groq Whisper (`whisper-large-v3-turbo`) es **batch**, no streaming, por lo que "transcripción en vivo" debe implementarse como sucesión de trozos cortos.

Dos restricciones técnicas condicionan el diseño:

1. **Jitsi corre en iframe** ([`@jitsi/react-sdk`](../../resources/js/pages/call/room.tsx)). No tenemos acceso al `MediaStream` local desde el host. Las alternativas — grabación server-side con Jibri, capturar el stream mediante `RTCPeerConnection` propia, o inyectar código en el iframe — requieren infraestructura adicional o bypass del dominio Jitsi.
2. **Obligación RGPD** (art. 6 y 9 RGPD + LOPDGDD) de consentimiento explícito del paciente antes de cualquier tratamiento automatizado de datos de voz/salud. El consentimiento debe ser previo al envío de audio, auditable (timestamp), y revocable.

## Decisión

**Captura de audio independiente de Jitsi** mediante `navigator.mediaDevices.getUserMedia({ audio: true })` + `MediaRecorder` con `timeslice: 8000` (8 s por chunk). El navegador permite múltiples consumidores del mismo micrófono, de modo que el audio llega duplicado a Jitsi (para la videollamada) y al pipeline de transcripción (vía nuestro endpoint). Contrapartida: un pequeño overhead de CPU/memoria por la codificación WebM/Opus paralela, aceptable en hardware moderno.

**Pipeline backend:**

| Pieza | Responsabilidad |
|-------|-----------------|
| `POST /appointments/{id}/transcribe` — [`TranscribeAction`](../../app/Http/Controllers/Appointment/TranscribeAction.php) | Ruta compartida paciente/profesional. Valida que el uploader sea paciente **con consentimiento** o profesional de la cita. Almacena el chunk en `storage/app/transcription-chunks/{recording_id}/` y despacha `TranscribeChunkJob`. |
| [`TranscribeChunkJob`](../../app/Jobs/TranscribeChunkJob.php) | POST multipart al endpoint OpenAI-compatible de Groq (`/audio/transcriptions`), modelo `whisper-large-v3-turbo`, `language=es`. Persiste el texto devuelto como `TranscriptionSegment`. Borra el chunk del disco tras procesarlo (transcripción efímera). |
| Tabla `transcription_segments` | Un registro por chunk. Claves: `session_recording_id`, `speaker_user_id`, `position`, `started_at_ms`, `ended_at_ms`, `text`. `UNIQUE(session_recording_id, speaker_user_id, position)` garantiza idempotencia ante reintentos. |
| `POST /patient/appointments/{id}/recording-consent` — [`RecordingConsentAction`](../../app/Http/Controllers/Portal/Appointment/RecordingConsentAction.php) | Solo paciente. Crea/recupera `SessionRecording` y sella `patient_consent_given_at`. Idempotente — segundas llamadas no sobreescriben el timestamp original. |

**Audio efímero:** los chunks se borran tras transcribir. No se persiste audio crudo en base de datos ni en storage permanente. `SessionRecording.audio_path` queda nullable para una posible integración futura con Jibri.

## Alternativas consideradas

- **Jibri (grabación server-side de Jitsi) + transcripción batch al colgar:** descartada — requiere infraestructura Jitsi propia, rompe el "casi en vivo" requerido para que el profesional vea transcripción en pantalla durante la sesión, y el audio crudo es una superficie RGPD que preferimos evitar.
- **OpenAI Realtime API / Deepgram streaming (WebSocket):** descartadas por coste (Deepgram) y por evitar nueva dependencia (OpenAI Realtime) cuando Groq Whisper ya está configurado. Revisitar si la latencia de 8-10 s resulta insuficiente en UAT.
- **Tap del `RTCPeerConnection` de Jitsi desde el iframe host:** descartada — Jitsi no expone la conexión al host, y hackearlo acoplaría el código a la implementación interna de una versión concreta del SDK.
- **Conservar el chunk en storage permanente:** descartada — el dato útil es el texto, no el audio. Minimización RGPD (art. 5.1.c).

## Consecuencias

**Positivas**
- Transcripción "casi en vivo" con latencia ≤ 10 s por segmento (8 s de chunk + ~1 s round-trip Groq Whisper turbo).
- Desacopla totalmente el pipeline de IA de la infraestructura Jitsi — si mañana se cambia el proveedor de video, el pipeline no se toca.
- Consentimiento explícito + auditable satisface RGPD art. 6.1.a y art. 9.2.a.
- Idempotencia por `(recording_id, speaker_id, position)` permite reintentos sin duplicados (crítico para `Queueable` con `$tries = 3`).
- Audio efímero reduce superficie de cumplimiento: no hay audio a borrar, pseudoanonimizar ni transferir en solicitudes ARCO.

**Negativas / seguimiento**
- **Doble captura del micrófono**: CPU codifica dos streams Opus en paralelo. Aceptable en hardware moderno; a monitorizar en equipos de gama baja.
- **No hay transcripción offline**: si Groq cae, se pierde la transcripción de ese chunk (job falla tras 3 reintentos).
- **Broadcasting de segmentos a la UI del profesional** queda para ADR-0009 (Laravel Reverb).
- **Revocación de consentimiento durante la llamada**: no hay UI para revocar en medio de la sesión. Seguimiento en post-mortem de la deadline 2026-05-14.
- **Concatenación a `SessionRecording.transcription`**: los segmentos viven en su tabla propia; la columna `transcription` se rellenará al finalizar la llamada (`EndCallAction`).
