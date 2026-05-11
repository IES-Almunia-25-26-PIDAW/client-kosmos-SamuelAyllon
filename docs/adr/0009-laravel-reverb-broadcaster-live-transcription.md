---
adr: "0009"
title: Laravel Reverb como broadcaster para transcripción en vivo
date: 2026-04-22
status: Aceptado
---

# ADR-0009 — Laravel Reverb como broadcaster para transcripción en vivo

## Contexto

ADR-0008 dejó el backend de transcripción listo (`TranscribeChunkJob` persiste segmentos cada ~8 s), pero sin un mecanismo para empujar cada segmento a la UI del profesional en tiempo real. Las opciones son polling HTTP (latencia + carga), Server-Sent Events (sin reverse channel ni reconnect estándar), o WebSockets con un broker.

Laravel Reverb es la opción nativa del framework: servidor WebSocket compatible con el protocolo Pusher, sin dependencias externas (no Pusher cloud, no Soketi self-host), integrado con `ShouldBroadcast` y `routes/channels.php`. Para el flujo mínimo del 2026-05-14 esto encaja: sin coste recurrente, sin proveedor externo a contratar.

## Decisión

Se adopta **Laravel Reverb 1.x** como broadcaster por defecto (`BROADCAST_CONNECTION=reverb`):

| Pieza | Detalle |
|-------|---------|
| Backend | `composer require laravel/reverb`. `php artisan install:broadcasting --reverb` publica `config/reverb.php`, `config/broadcasting.php`, `routes/channels.php`. Variables `REVERB_APP_ID/KEY/SECRET/HOST/PORT/SCHEME` en `.env` y `.env.example`. |
| Frontend | `@laravel/echo-react` + `laravel-echo` + `pusher-js`. `configureEcho({ broadcaster: 'reverb' })` en [`resources/js/app.tsx`](../../resources/js/app.tsx). Variables `VITE_REVERB_*` interpoladas desde las del servidor. |
| Canal | `private-appointment.{appointmentId}` autorizado en [`routes/channels.php`](../../routes/channels.php) si el usuario es paciente o profesional de la cita. |
| Evento | [`App\Events\TranscriptionSegmentCreated`](../../app/Events/TranscriptionSegmentCreated.php) implementa `ShouldBroadcast`, alias `transcription.segment.created`. Despachado desde `TranscribeChunkJob` tras `updateOrCreate` del segmento. Payload: `segment_id`, `speaker_user_id`, `position`, `started_at_ms`, `ended_at_ms`, `text`. |
| Operación | El servidor Reverb se arranca con `php artisan reverb:start`. En desarrollo se añadirá al `composer dev` script (seguimiento). En producción → supervisor + healthcheck. |

## Alternativas consideradas

- **Pusher cloud**: descartado por coste recurrente y por sacar datos de salud fuera del perímetro propio.
- **Soketi self-host**: descartado — Reverb es la opción canónica del framework, mismo protocolo Pusher, sin necesidad de un proceso separado de comunidad.
- **Polling HTTP del endpoint `transcription_segments` cada 3 s**: descartado — latencia ≥ 3 s sumada a los 8 s del chunk hace la experiencia perezosa (>11 s p99); además genera carga innecesaria en la base de datos.
- **Server-Sent Events (SSE)**: descartado — no hay un canal de retorno y la reconexión + autenticación requieren plumbing manual que Echo ya resuelve.

## Consecuencias

**Positivas**
- Sin proveedor externo (Pusher, Ably) → cero coste recurrente y datos en infraestructura propia (relevante para sanidad/RGPD).
- Compatible con el protocolo Pusher → cliente Echo estándar, fácil migración futura a Pusher cloud si la operativa de Reverb resulta engorrosa.
- Autorización del canal reusa Eloquent + `auth()` — no hay un sistema paralelo de permisos que mantener.
- Idempotencia y orden: el cliente recibe `position` en cada segmento, así puede reordenar/dedup si llegan fuera de orden.

**Negativas / seguimiento**
- **Operación adicional**: hay un proceso más que mantener vivo (`reverb:start`). En desarrollo lo orquesta `composer dev` (pendiente añadirlo a [`composer.json`](../../composer.json)).
- **Sin TLS por defecto**: `REVERB_SCHEME=http`. En producción hay que terminar TLS en el reverse proxy (nginx/Caddy) y poner `REVERB_SCHEME=https` + `REVERB_PORT=443`. Documentar en deploy guide.
- **Tests sin Reverb corriendo**: las pruebas usan `Event::fake()` y `postJson('/broadcasting/auth')` para verificar autorización; nunca abren un WebSocket real.
- **No persistimos los segmentos broadcasted**: si un cliente reconecta a mitad de sesión perderá los segmentos previos. Mitigación: al montar `live-transcript-panel` el frontend hará un fetch inicial de `transcription_segments` recientes; los nuevos llegan por WS.
- **Sin presencia (`PresenceChannel`)**: el aviso "el otro usuario se ha unido" sigue como tarea P2 del tracker.
