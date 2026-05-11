---
adr: "0010"
title: "Migración Jitsi → Google Meet (videollamada)"
date: 2026-04-24
status: Aceptado
---

# ADR-0010 — Migración Jitsi → Google Meet (videollamada)

## Contexto

El SDK `@jitsi/react-sdk` requería un servidor Jitsi self-hosted (o `meet.jit.si` público sin garantías de uptime). El profesional ya dispone de Google Calendar y cuenta Google, y la API de Google Calendar puede crear eventos con `conferenceData.createRequest` que provee un enlace `hangoutsMeet` gratuito y robusto.

## Decisión

- Se desinstala `@jitsi/react-sdk`.
- La llamada de video se crea como evento de Google Calendar usando `GoogleCalendarService::createMeetEvent()`.
- El campo `appointments.meeting_url` almacena el `hangoutLink` devuelto por la API.
- Se añade `appointments.external_calendar_event_id` para poder actualizar/cancelar el evento Meet.
- `call/room.tsx` abre `meeting_url` en nueva pestaña; el panel lateral en ClientKosmos mantiene transcripción en vivo y botón "Finalizar".
- OAuth scope requerido: `https://www.googleapis.com/auth/calendar.events`.
- `users.google_refresh_token` ya existe en el esquema y se almacena cifrado (`encrypted` cast).

## Consecuencias

**Positivas**
- Sin infraestructura de video que operar.
- UX móvil excelente.
- Integración nativa con Calendar del profesional.

**Negativas**
- Dependencia de disponibilidad de Google Meet.
- No podemos embeber el video dentro de la app (trade-off aceptado en MVP).

**Deuda**
- Post-MVP: evaluar embed con `<iframe>` condicional. Si Google retira la API pública de conferencias, migrar a Daily.co o Whereby.
