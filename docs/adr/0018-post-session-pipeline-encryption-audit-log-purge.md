---
adr: "0018"
title: "Cierre del flujo Post-Sesión: cifrado at-rest, agregación de transcripción, audit log de acceso, purga programada"
date: 2026-04-30
status: Aceptado
related: "ADR-0008, ADR-0013, ADR-0015"
---

# ADR-0018 — Cierre del flujo Post-Sesión: cifrado at-rest, agregación de transcripción, audit log de acceso, purga programada

## Contexto

Auditoría arquitectónica del flujo post-sesión (grabación → Whisper → resumen → hub → factura) detecta cuatro brechas que impiden el go-live con datos reales (categoría especial RGPD art. 9):

1. **`SummarizeAction` es un stub** — devuelve `{status: 'queued'}` sin disparar `SummarizeSessionJob`. El profesional puede firmar una nota clínica sin contenido.
2. **`TranscriptionSegment` no se concatena en `session_recordings.transcription`** — la columna canónica del hub queda `NULL`, aunque el job de resumen depende de ella.
3. **Audio crudo en plano en disco** — `TranscribeAction` guarda chunks WebM sin cifrar bajo `storage/app/transcription-chunks/`. RGPD art. 32 obliga a cifrado at-rest para categoría especial.
4. **Sin audit log granular de acceso** — `LogsActivity` (Spatie) solo registra cambios ORM; no hay trazabilidad de quién leyó/descargó transcripciones, PDFs de factura o documentos. Incumple art. 30 + 32.
5. **Sin purga programada** — `docs/data-retention-policy.md` declara TTLs pero no hay command que los aplique.

## Decisión

Se cierra el pipeline en una sola serie de cambios con tests en cada paso:

| Brecha | Cambio | Archivos clave |
|--------|--------|----------------|
| Stack IA | Ratifica ADR-0008: Groq Whisper (`whisper-large-v3-turbo`) + Llama 3.3 vía `KosmoService::summarizeSession()`. **No** se usa OpenAI Whisper directo. | `config/services.php` (groq) |
| Cifrado at-rest | `Crypt::encryptString()` sobre el blob del chunk antes de `Storage::put()`. Extensión `.enc`. Lectura simétrica en `TranscribeChunkJob`. | `app/Http/Controllers/Appointment/TranscribeAction.php`, `app/Jobs/TranscribeChunkJob.php` |
| Agregación transcripción | Listener `AggregateTranscription` engancha al evento existente `TranscriptionSegmentCreated` (ADR-0009) y reescribe `session_recordings.transcription` concatenando segmentos ordenados por `started_at_ms`. Reusa el cast `encrypted` ya existente. | nuevo `app/Listeners/AggregateTranscription.php`, `app/Providers/EventServiceProvider.php` |
| Stub de resumen | `SummarizeAction` despacha `SummarizeSessionJob::dispatch()` cuando hay transcripción agregada. Si la transcripción está vacía, devuelve `409 Conflict {reason: 'transcription_pending'}`. | `app/Http/Controllers/Appointment/SummarizeAction.php` |
| Audit log acceso | Middleware `LogTranscriptionAccess` registra `user_id`, `ip`, `action`, `subject_id` en `activity_log` antes de servir transcripción/PDF/audio. Aplicado al grupo de rutas sensibles. | nuevo `app/Http/Middleware/LogTranscriptionAccess.php`, `bootstrap/app.php` |
| Log de chunks rechazados | `TranscribeChunkJob` registra entrada `chunk_rejected_no_consent` en `activity_log` cuando `RgpdService::hasActiveRecordingConsent()` falla. | `app/Jobs/TranscribeChunkJob.php` |
| Purga programada | Command `purge:expired-session-data` ejecuta diariamente a 03:00 borrando: PDFs de factura caducados (>5 años), transcripciones de recordings revocados, audit logs >2 años. Reusa `CleanupAudioChunks` para chunks >24h. | nuevo `app/Console/Commands/PurgeExpiredSessionData.php`, `routes/console.php` |

## Alternativas consideradas

- **Cifrado en filesystem (LUKS) en lugar de Crypt::encryptString:** descartado — mezcla responsabilidad del SO con la de la app, complica deploys y no protege contra accesos a nivel app.
- **Append en lugar de reescritura completa:** descartado por incompatibilidad con cast `encrypted` (no se puede concatenar un blob cifrado).
- **Trigger DB en lugar de listener PHP:** descartado — la lógica de descifrado vive en Eloquent, no en MySQL.
- **Servicio externo de audit (Sentry, Datadog):** descartado — duplica `activity_log` ya instalado y saca datos de salud del perímetro.

## Consecuencias

**Positivas**
- Cumplimiento RGPD art. 9, 30 y 32 alineado con la política declarada en `docs/data-retention-policy.md`.
- Transcripción siempre disponible para `SummarizeSessionJob` (no más NULL en columna canónica).
- Trazabilidad completa de accesos a datos de salud (quién/cuándo/desde-dónde).
- Borrado seguro automatizado, sin intervención manual.

**Negativas / seguimiento**
- El cifrado de chunks WebM añade ~10% de overhead CPU en el endpoint de upload. Aceptable dado el tamaño máximo (20 MB).
- El listener `AggregateTranscription` reescribe la transcripción completa cada vez que llega un segmento — coste O(n) por chunk. Si supone problema en UAT, mover a streaming append en columna `text` y descifrar al leer.
- Pendiente: rate-limit por paciente en transcripción (actual: `throttle:30,1` por usuario).
