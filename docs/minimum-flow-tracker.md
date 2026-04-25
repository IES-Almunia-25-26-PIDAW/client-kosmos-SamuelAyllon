# Minimum Flow Tracker — Deadline 2026-05-14

> Documento vivo de seguimiento del **flujo mínimo end-to-end** (paciente + profesional) que debe estar operativo antes del **14 de mayo de 2026**.
> Actualizar tras cada PR que mueva un estado.

Leyenda: ✅ completo · 🟡 parcial · ❌ falta

---

## 1. Objetivo

Entregar un flujo mínimo viable donde un paciente pueda reservar, asistir y cerrar una sesión; y un profesional pueda configurar disponibilidad, atender y cerrar con notas + resumen IA + factura. Deadline interno: **2026-05-14**.

## 2. Estado global

- **Paciente:** 6 ✅ · 1 🟡 · 0 ❌ — 7 pasos
- **Profesional:** 5 ✅ · 4 🟡 · 0 ❌ — 9 pasos
- **Capacidades técnicas:** 2 ✅ · 5 ❌

Resumen: aproximadamente **11/16** pasos completos, **5/16** parciales, **0/16** falta por completo.

---

## 3. Flujo Paciente

| # | Paso | Estado | Archivos / Notas |
|---|------|--------|------------------|
| P1 | Home sin citas (empty state) | ✅ | [resources/js/pages/patient/dashboard.tsx](../resources/js/pages/patient/dashboard.tsx), [app/Http/Controllers/Portal/Dashboard/IndexAction.php](../app/Http/Controllers/Portal/Dashboard/IndexAction.php) |
| P2 | Listar profesionales y reservar hoy | ✅ | Listado + modal de slots ([patient/professionals/index.tsx](../resources/js/pages/patient/professionals/index.tsx)), página de resumen ([patient/appointments/book.tsx](../resources/js/pages/patient/appointments/book.tsx)), lista ([patient/appointments/index.tsx](../resources/js/pages/patient/appointments/index.tsx)). Slots calculados en [AvailabilityService](../app/Services/AvailabilityService.php) |
| P3 | Cita visible en home | ✅ | [resources/js/pages/patient/dashboard.tsx](../resources/js/pages/patient/dashboard.tsx) |
| P4 | Sala de espera paciente | ✅ | [patient/appointments/waiting.tsx](../resources/js/pages/patient/appointments/waiting.tsx) + [Portal\Appointment\WaitingShowAction](../app/Http/Controllers/Portal/Appointment/WaitingShowAction.php); `JoinCallAction` ahora redirige a `patient.appointments.waiting` |
| P5 | Videollamada + transcripción automática | 🟡 | Jitsi OK ([resources/js/pages/call/room.tsx](../resources/js/pages/call/room.tsx)). Backend de transcripción chunked listo: `TranscribeChunkJob` dispatch desde `TranscribeAction` (Groq Whisper `whisper-large-v3-turbo`), tabla `transcription_segments`, consentimiento paciente (ADR-0008). **Falta**: Reverb broadcast (ADR-0009) + captura `MediaRecorder` en frontend + modal de consentimiento. |
| P6 | Pantalla de cierre (mensaje + aviso factura/acuerdos) | ✅ | [patient/appointments/post-session.tsx](../resources/js/pages/patient/appointments/post-session.tsx) + [Portal\Appointment\PostSessionShowAction](../app/Http/Controllers/Portal/Appointment/PostSessionShowAction.php); `CallShowRoomAction` redirige aquí al finalizar. Aviso factura + acuerdos. |
| P7 | Redirect automático a home | ✅ | Countdown 15s en `post-session.tsx` → `patient.dashboard` |

## 4. Flujo Profesional

| # | Paso | Estado | Archivos / Notas |
|---|------|--------|------------------|
| F1 | Configurar disponibilidad | ✅ | [resources/js/pages/professional/schedule/index.tsx](../resources/js/pages/professional/schedule/index.tsx), `AvailabilityStoreAction` |
| F2 | Dashboard con citas de hoy | ✅ | [resources/js/pages/professional/dashboard.tsx](../resources/js/pages/professional/dashboard.tsx) |
| F3 | Pre-sesión: contexto + recursos | ✅ | [resources/js/pages/professional/patients/pre-session.tsx](../resources/js/pages/professional/patients/pre-session.tsx), `PatientPreSessionAction` |
| F4 | Sala de espera | ✅ | [app/Http/Controllers/Appointment/WaitingShowAction.php](../app/Http/Controllers/Appointment/WaitingShowAction.php) |
| F5 | Video + transcripción al entrar paciente | 🟡 | Jitsi OK; backend de transcripción listo (ver P5). Falta UI live-transcript lateral + Reverb broadcast. |
| F6a | Notas + resumen IA automático | 🟡 | UI OK ([resources/js/pages/professional/patients/post-session.tsx](../resources/js/pages/professional/patients/post-session.tsx)). Resumen **no dispatched** — `@todo Llama 3.3` en [app/Http/Controllers/Appointment/SummarizeAction.php](../app/Http/Controllers/Appointment/SummarizeAction.php) |
| F6b | Revisar plantilla de factura (requisitos legales PSI) | 🟡 | `GenerateInvoiceAction` crea draft vía `BillingService`. **Falta pantalla de review** y validación de campos legales (datos fiscales, IVA exento art. 20.1.3º LIVA, número secuencial, etc.) |
| F6c | Confirmar cierre | 🟡 | `EndCallAction` marca `completed` pero no existe wizard explícito de 3 pasos |
| F7 | Pantalla de éxito (aviso envío a paciente) | ✅ | [professional/appointments/closing-success.tsx](../resources/js/pages/professional/appointments/closing-success.tsx) + [Appointment\ClosingSuccessAction](../app/Http/Controllers/Appointment/ClosingSuccessAction.php); `CallShowRoomAction` redirige aquí al finalizar. |
| F8 | Redirect automático al dashboard | ✅ | Countdown 15s en `closing-success.tsx` → `professional.dashboard` |

## 5. Capacidades técnicas transversales

| Capacidad | Estado | Notas |
|-----------|--------|-------|
| Jitsi video | ✅ | `@jitsi/react-sdk` 1.4.4 |
| Transcripción (Groq Whisper) | 🟡 | `TranscribeChunkJob` + `TranscribeAction` + tabla `transcription_segments` implementados (ADR-0008). Pendiente: broadcast en vivo al profesional (Reverb) y captura de audio en el cliente. |
| Resumen IA (Llama/OpenAI) | ❌ | `openai-php/client` disponible; job no implementado |
| Factura (generación draft) | ✅ | `BillingService`, tablas `invoices` / `invoice_items` |
| Envío email factura (Gmail API) | ❌ | `@todo` en [app/Http/Controllers/Invoice/SendAction.php](../app/Http/Controllers/Invoice/SendAction.php) |
| Acuerdos — entrega al paciente | ❌ | CRUD existe, delivery no |
| Notificación email post-sesión | ❌ | `InvoiceOverdueNotification` existe, pero no una de post-sesión |

---

## 6. Backlog priorizado hacia 2026-05-14

### P0 — Bloquea flujo end-to-end
- [x] Páginas Inertia `patient/appointments/book.tsx` e `index.tsx` (P2) — 2026-04-22
- [x] Página `patient/appointments/waiting.tsx` + `JoinCallAction` → waiting room (P4) — 2026-04-22
- [~] `app/Jobs/TranscribeChunkJob.php` (Groq Whisper) y dispatch desde `TranscribeAction` (P5/F5) — 2026-04-22 backend listo; falta Reverb + frontend
- [ ] `app/Jobs/SummarizeSessionJob.php` y dispatch desde `SummarizeAction` (F6a)
- [x] Página `patient/appointments/post-session.tsx` (mensaje motivador + aviso factura/acuerdos) (P6) — 2026-04-22
- [x] Página `professional/appointments/closing-success.tsx` (F7) — 2026-04-22
- [ ] Jobs `SendInvoiceEmailJob` + `SendAgreementsEmailJob` (factura + acuerdos al paciente)

### P1 — Calidad del flujo
- [ ] Wizard explícito de 3 pasos de cierre (notas → factura → confirmación) (F6)
- [ ] Review UI de factura con validación legal PSI (datos fiscales, IVA exento art. 20.1.3º LIVA, numeración secuencial)
- [x] Redirects finales: paciente → dashboard (P7); profesional → dashboard (F8) — 2026-04-22 (countdown 15s en ambas pantallas de cierre)

### P2 — Mejoras
- [ ] Skeletons/Deferred props en listados de reserva y dashboard
- [ ] Notificaciones en tiempo real (broadcasting) de "el otro usuario se ha unido"
- [ ] Tests Pest feature + E2E del flujo completo paciente/profesional

## 7. Definition of Done por paso

- Ruta Wayfinder generada y usada (nada de strings hardcoded).
- Componentes Chakra UI v3 (sin Tailwind); tokens de `chakra-system.ts`.
- Test Pest feature cubriendo el happy path + al menos un edge case.
- Gate local verde: `pint --dirty`, `php artisan test --compact`, `npm run lint`, `npm run types`, `npm run build`.
- ADR en `docs/decision-log.md` si introduce nueva dependencia o patrón.
- PR con screenshots para cambios de UI y checklist del gate.

## 8. Log de avance

| Fecha | Responsable | Cambio | PR |
|-------|-------------|--------|----|
| 2026-04-22 | Samuel Ayllón | Creación del tracker | — |
| 2026-04-22 | Claude (Opus 4.7) | P2 completo (book + appointments index + modal slots) y P4 completo (waiting paciente) | — |
| 2026-04-22 | Claude (Opus 4.7) | Fase A — P6 + F7 + redirects P7/F8: pantallas de cierre con countdown y Pest tests (6/6 passing) | — |
| 2026-04-22 | Claude (Opus 4.7) | Sprint 1 commit 1 — Backend transcripción chunked: ADR-0008, `transcription_segments`, `TranscribeChunkJob` (Groq Whisper), `RecordingConsentAction`, rutas compartidas y Pest tests (11/11 passing) | — |
| 2026-04-22 | Claude (Opus 4.7) | Sprint 1 commit 2 — Reverb broadcasting: ADR-0009, `laravel/reverb`, `@laravel/echo-react`+`pusher-js`, evento `TranscriptionSegmentCreated`, canal privado `appointment.{id}` con auth + 3 Pest tests (14/14 passing) | — |
