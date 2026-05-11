---
adr: "0023"
title: "Sección Settings Google: UI de conexión, CSRF state y revoke explícito"
date: 2026-05-04
status: Aprobado
---

# ADR-0023 — Sección Settings Google: UI de conexión, CSRF state y revoke explícito

## Contexto

El backend OAuth de Google Calendar ya estaba implementado (`App\Services\GoogleCalendarService` + `Settings\Google\ConnectAction`/`CallbackAction`), pero `/settings/google/connect` era un redirect ciego sin pantalla intermedia. Profesionales y pacientes no tenían un sitio donde ver su estado de conexión, conectar o desconectar. Además, el callback no validaba ningún `state`, dejando el flujo expuesto a CSRF de OAuth.

## Decisión

1. Reestructurar el grupo de rutas a `settings/google/{,redirect,callback}` + `DELETE settings/google` con nombres `settings.google.{edit,redirect,callback,disconnect}`. La URL `/settings/google` pasa a renderizar una página Inertia (`settings/google.tsx`) con estado de conexión y botones Conectar / Desconectar.
2. Habilitar la conexión para **profesional y paciente** con el mismo scope `Calendar::CALENDAR_EVENTS`. El profesional usa el token para crear eventos Meet; el paciente lo usa para recibir invitaciones en su calendario.
3. Endurecer el flujo OAuth con un parámetro `state` aleatorio (`Str::random(40)`) almacenado en sesión y validado con `hash_equals` en el callback. Si falta o difiere, se rechaza la conexión.
4. Disconnect = `GoogleCalendarService::revoke($refreshToken)` (que llama al endpoint de revoke de Google) + `users.google_refresh_token = null`. El borrado local se ejecuta siempre, aunque la llamada a Google falle (se loguea como warning).

## Consecuencias

**Positivas**
- Cumplimiento RGPD: el usuario controla efectivamente la revocación del consentimiento; el token deja de ser válido también en Google, no solo localmente.
- Cierra el vector CSRF en el callback OAuth.
- Pantalla unificada para profesional y paciente — mismo punto de gestión.

**Negativas / seguimiento**
- La URL pública `/settings/google/connect` ya no existe; cualquier enlace externo pre-existente queda obsoleto (no había ninguno publicado).
- El revoke remoto añade una llamada de red en disconnect; mitigado capturando excepciones y procediendo igualmente con el borrado local.
