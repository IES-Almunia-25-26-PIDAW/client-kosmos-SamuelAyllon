# ClientKosmos MVP — Roadmap funcional

> **Deadline:** 2026-05-14
> **Última actualización:** 2026-04-25
> **Objetivo:** cerrar el flujo mínimo end-to-end (paciente + profesional) con videollamada real, transcripción, resumen IA, factura y cierre de sesión, cumpliendo el mínimo legal RGPD para una consulta psicológica autónoma.
>
> Este documento complementa [minimum-flow-tracker.md](minimum-flow-tracker.md) incorporando dos decisiones de producto posteriores:
> 1. **Videollamadas:** Jitsi → **Google Meet**.
> 2. **Almacenamiento de datos de paciente:** Google Drive → **almacenamiento propio cifrado**.

---

## 1. Resumen ejecutivo

### 1.1 Estado actual (según tracker + auditoría)

> **Nota (2026-04-25):** las cifras siguientes son la línea base del 2026-04-24, antes de ejecutar Sprints 1-3. Tras el cierre del Sprint 3 + auditoría posterior + cierre de deudas RGPD/seguridad, el estado real es **16/16 pasos del flujo + 7/7 capacidades transversales** y todos los puntos de §6 Definition of Done están cubiertos salvo el despliegue (S3.5 pospuesto a AWS post-defensa por decisión del usuario). Ver §10.

- **Flujo paciente:** 6/7 ✅ · 1/7 🟡 (videollamada + transcripción).
- **Flujo profesional:** 5/9 ✅ · 4/9 🟡 (video, resumen IA, factura legal, cierre).
- **Capacidades transversales:** 2/7 ✅ · 5/7 ❌ (resumen IA, email factura, entrega de acuerdos, notificación post-sesión, broadcasting en vivo).

### 1.2 Cambios estructurales sobre el plan original

| Área | Antes | Ahora | Razón |
|---|---|---|---|
| Video | Jitsi (`@jitsi/react-sdk`) | **Google Meet** (Google Calendar API) | Alineación con ecosistema Google del usuario; reducción de carga operativa de Jitsi self-hosted; mejor UX móvil. |
| Documentos | Drive (`storage_type=gdrive`) | **Local cifrado en app** | Drive no garantiza control del responsable del tratamiento sobre datos de salud (RGPD Art. 9 + Art. 32). La app es el único sistema de registro confiable. |

### 1.3 Qué entra en el MVP

Un profesional autónomo puede:
1. Configurar su disponibilidad.
2. Recibir una reserva de paciente.
3. Preparar la sesión con contexto.
4. Iniciar videollamada (Google Meet) con transcripción y consentimiento.
5. Cerrar sesión con notas, resumen IA y factura legal válida (LIVA art. 20.1.3º).
6. Enviar factura y acuerdos al paciente por email.

### 1.4 Qué NO entra en el MVP

- Kosmo AI conversacional (chat libre) — solo resumen de sesión automático.
- Pagos online (Stripe) — factura se marca manualmente cobrada.
- Multi-tenant avanzado (1 workspace por profesional en MVP).
- Integración Google Drive (queda fuera por decisión de producto).
- Referrals, colaboraciones entre profesionales.
- App móvil nativa.

---

## 2. Cambios arquitectónicos

### 2.1 Migración Jitsi → Google Meet

**Decisión:** documentar en **ADR-0010** antes de ejecutar.

#### 2.1.1 Por qué Meet vs Jitsi

- El profesional ya dispone de cuenta Google (tokens ya modelados en `users.google_refresh_token`).
- Meet es robusto en móvil y low-bandwidth.
- Se elimina dependencia de Jitsi self-hosted (coste de infra + mantenimiento).
- **Trade-off asumido:** perdemos la capacidad de embeber el video en nuestro frame y dependemos de Google para disponibilidad.

#### 2.1.2 Arquitectura de la nueva integración

**Flujo de creación de la cita:**

1. `AppointmentStoreAction` recibe la reserva.
2. Nuevo `GoogleCalendarService` crea un evento en el calendario del profesional:
   - `conferenceData.createRequest.conferenceSolutionKey.type = "hangoutsMeet"`
   - Invitados: profesional + paciente (email).
   - Retorno: `hangoutLink` (la URL de Meet).
3. Se guarda en `appointments.meeting_url` (ya existe en el esquema) y `appointments.external_calendar_event_id` (columna nueva).

**Ventana de unión de 10 minutos (requisito de producto):**

- El botón **"Iniciar sesión"** (profesional) y **"Unirse a la llamada"** (paciente) se habilita **10 minutos antes de `appointment.starts_at`** y permanece disponible durante la duración de la cita.
- Antes de esa ventana: botón deshabilitado + countdown ("Disponible en 07:42").
- Guardia en backend: `CanJoinAppointment` form request o check en `Appointment\StartCallAction` / `Portal\Appointment\JoinCallAction` que valida `now() >= starts_at->subMinutes(10) && now() <= ends_at->addMinutes(15)`.
- Guardia en frontend: componente `<JoinCallButton>` con `useCountdown` que habilita el botón dinámicamente.

**Flujo de acceso a la llamada:**

- La página `call/room.tsx` se rehace: ya no renderiza Jitsi SDK. Al pulsar el botón, abre `meeting_url` en nueva pestaña y mantiene en ClientKosmos el panel lateral con transcripción en vivo, indicador de grabación y botón "Finalizar sesión".
- Alternativa futura: embed con `<iframe src="meeting_url">` (Meet lo permite condicionalmente; validar en ADR-0010).

**Transcripción con Meet (grabación desde el profesional):**

Por decisión de producto, **solo el profesional graba la sesión completa** — no hay captura dual cliente-paciente. Esto simplifica el UX del paciente (no pide permisos de micrófono), reduce riesgo de pérdida de chunks y centraliza la responsabilidad de captura en quien lidera la sesión.

**Arquitectura de captura:**

1. Tras pulsar "Iniciar sesión", el profesional ve en la pestaña de ClientKosmos un botón **"Comenzar grabación"**.
2. Se invoca `navigator.mediaDevices.getDisplayMedia({ video: true, audio: true, preferCurrentTab: false })` y el profesional selecciona la pestaña de Google Meet, habilitando "Compartir audio de la pestaña".
3. El `MediaStream` resultante se descarta de vídeo (`stream.getVideoTracks().forEach(t => t.stop())`) y se mantiene solo el audio.
4. `MediaRecorder` trocea en chunks de 15s y envía a `POST /appointments/{id}/transcribe` (endpoint ya existente).
5. `TranscribeChunkJob` transcribe vía Groq Whisper y crea `TranscriptionSegment` con `speaker_user_id = null` (audio mixto de ambas voces).
6. Al finalizar la sesión (`EndCallAction`), se dispara `SummarizeSessionJob` automáticamente con la transcripción completa.

**Nota sobre `speaker_user_id`:** en MVP queda `null` (audio no diarizado). Post-MVP se puede añadir diarización (pyannote o similar) sobre la transcripción ya existente.

**Requisitos de navegador:** Chrome / Edge / Opera desktop (son los que soportan `getDisplayMedia` con audio de pestaña). Safari y Firefox tienen soporte parcial — se acepta en MVP y se avisa al profesional al conectarse.

**Fallback sin captura de pestaña:** si el navegador no soporta tab audio (o el profesional no concede permiso), caer a `getUserMedia({ audio: true })` capturando solo el micrófono del profesional (pierde la voz del paciente pero la sesión sigue funcional).

#### 2.1.3 Tareas concretas

| # | Tarea | Archivo |
|---|-------|---------|
| M1 | ADR-0010: migración Jitsi → Meet | [docs/decision-log.md](decision-log.md) |
| M2 | `GoogleCalendarService::createMeetEvent()` | `app/Services/GoogleCalendarService.php` (nuevo) |
| M3 | Columna `appointments.external_calendar_event_id` | Nueva migración |
| M4 | Integrar `GoogleCalendarService` en `AppointmentStoreAction` | [app/Http/Controllers/Appointment/StoreAction.php](../app/Http/Controllers/Appointment/StoreAction.php) |
| M5 | Refactor `call/room.tsx`: eliminar `JitsiMeeting`, abrir `meeting_url` en nueva ventana | [resources/js/pages/call/room.tsx](../resources/js/pages/call/room.tsx) |
| M6 | Desinstalar `@jitsi/react-sdk` | `package.json` |
| M7 | Actualizar Pest tests (`ShowRoomActionTest`, `RecordingConsentTest`) | `tests/Feature/Call/`, `tests/Feature/Portal/Appointment/` |
| M8 | OAuth flow para conectar Google (si no está completo): endpoint `/settings/google/connect`, callback, guardar refresh token **cifrado** | `app/Http/Controllers/Settings/Google/*` (nuevo) |
| M9 | Guardia de ventana de 10 min en `StartCallAction` y `Portal\Appointment\JoinCallAction` (403 si fuera de rango) + Pest tests | [app/Http/Controllers/Appointment/StartCallAction.php](../app/Http/Controllers/Appointment/StartCallAction.php), [app/Http/Controllers/Portal/Appointment/JoinCallAction.php](../app/Http/Controllers/Portal/Appointment/JoinCallAction.php) |
| M10 | Componente `<JoinCallButton>` con countdown que habilita botón a `starts_at - 10min` | `resources/js/components/join-call-button.tsx` (nuevo) |
| M11 | Refactor `useAudioChunks` → `useProfessionalTabRecorder`: sustituir `getUserMedia` por `getDisplayMedia` con audio de pestaña, descartar pista de vídeo, iniciar/detener desde `call/room.tsx` | [resources/js/hooks/use-audio-chunks.ts](../resources/js/hooks/use-audio-chunks.ts) |
| M12 | `SummarizeSessionJob` dispatch automático desde `EndCallAction` cuando exista `session_recording.transcription` no vacía | [app/Http/Controllers/Appointment/EndCallAction.php](../app/Http/Controllers/Appointment/EndCallAction.php) |

#### 2.1.4 Librería sugerida

- `google/apiclient` (oficial PHP). Añadir en `composer.json` con ADR-0010.
- Scopes necesarios: `https://www.googleapis.com/auth/calendar.events`.
- **No se usa** ningún scope de Drive.

---

### 2.2 Migración Drive → almacenamiento local cifrado

**Decisión:** documentar en **ADR-0011**.

#### 2.2.1 Por qué almacenamiento propio

- Los archivos del paciente (consentimientos firmados, acuerdos, documentos clínicos, facturas PDF) son datos de categoría especial RGPD Art. 9.
- Con Drive, el profesional (responsable del tratamiento) pierde control granular sobre accesos, retención y borrado.
- ClientKosmos debe poder demostrar cadena de custodia: quién subió, cuándo, quién accedió, hash de integridad.

#### 2.2.2 Diseño de almacenamiento

**Estructura de discos Laravel (`config/filesystems.php`):**

```
disks:
  local         → storage/app/ (público interno, usos no sensibles)
  private       → storage/app/private/ (archivos cifrados AES-256)
  audio_chunks  → storage/app/chunks/ (TTL 24h, borrado tras transcribir)
```

**Cifrado en reposo:**

- **Archivos pequeños (<5 MB):** cifrado aplicación con `Crypt::encrypt()` de Laravel (usa `APP_KEY`, AES-256-CBC con HMAC). Consentimientos firmados, PDFs de factura, notas exportadas.
- **Archivos grandes (audio):** cifrado delegado a disco (filesystem LUKS a nivel servidor en producción) — para MVP se acepta disco plano con permisos `0600` y borrado automático post-transcripción.
- **Rotación de clave:** fuera de alcance MVP; documentar como deuda.

**Cambios en esquema:**

| Tabla | Cambio |
|---|---|
| `documents` | `storage_type` → pasar a tener solo `local`; deprecar `gdrive`, `gdrive_file_id`, `gdrive_url` (nullable, marcados deprecated). |
| `documents` | Añadir `content_hash` (sha256, string 64) para integridad. |
| `documents` | Añadir `encrypted` (boolean, default true). |
| `users` | `gdrive_refresh_token` → mantener como nullable, **cifrar** con `encrypted` cast. Deprecado funcionalmente. |

**Casts que faltan en los modelos:**

Cifrar en reposo a nivel ORM (Laravel `encrypted` cast):

- `User::casts()` → `google_refresh_token => 'encrypted'`, `gdrive_refresh_token => 'encrypted'`.
- `PatientProfile::casts()` → `clinical_notes => 'encrypted'`, `diagnosis => 'encrypted'`, `treatment_plan => 'encrypted'`.
- `Note::casts()` → `content => 'encrypted'`.
- `SessionRecording::casts()` → `transcription => 'encrypted'`, `ai_summary => 'encrypted'`.
- `TranscriptionSegment::casts()` → `text => 'encrypted'`.

**Impacto:** los campos cifrados no son buscables con `LIKE`. Para MVP no hay búsqueda full-text sobre estos campos — se acepta.

#### 2.2.3 Tareas concretas

| # | Tarea | Archivo |
|---|-------|---------|
| S1 | ADR-0011: almacenamiento propio cifrado + cifrado de campos clínicos | [docs/decision-log.md](decision-log.md) |
| S2 | Migración: añadir `content_hash`, `encrypted` en `documents`; marcar columnas gdrive como deprecated | `database/migrations/` |
| S3 | Migración: añadir `encrypted` casts a modelos sensibles | `app/Models/*.php` |
| S4 | `config/filesystems.php`: disco `private` y `audio_chunks` con rutas y permisos | [config/filesystems.php](../config/filesystems.php) |
| S5 | `Document\StoreAction`: eliminar rama `gdrive`, siempre usar disco `private` con cifrado + hash sha256 | [app/Http/Controllers/Document/StoreAction.php](../app/Http/Controllers/Document/StoreAction.php) |
| S6 | `Portal/Document/IndexAction`: generar URL temporal firmada (`URL::temporarySignedRoute`, 5 min) en lugar de path directo | [app/Http/Controllers/Portal/Document/IndexAction.php](../app/Http/Controllers/Portal/Document/IndexAction.php) |
| S7 | Comando `audio:cleanup` que borra chunks con >24h (para cron) | `app/Console/Commands/CleanupAudioChunks.php` (nuevo) |
| S8 | Desinstalar deps de Google Drive SDK si quedan | `composer.json` |

---

## 3. Flujo mínimo end-to-end consolidado

### 3.1 Vista unificada (paciente + profesional)

```
[Paciente] se registra → acepta consentimiento global de grabación (RGPD) ❌→✅
      ↓
[Profesional] configura disponibilidad (F1) ✅
      ↓
[Paciente] busca profesional (P2) ✅
      ↓
[Paciente] reserva → crea Appointment + evento Google Meet (P2 + M2-M4) 🟡→✅
      ↓
[Paciente] ve cita en home (P3) ✅       [Profesional] ve cita (F2) ✅
      ↓                                          ↓
[Profesional] revisa pre-sesión (F3) ✅
      ↓
  Botón "Iniciar/Unirse" deshabilitado hasta starts_at - 10 min (M9-M10)
      ↓
[Paciente] sala de espera (P4) ✅           [Profesional] sala de espera (F4) ✅
      ↓                                          ↓
  10 min antes: ambos pulsan botón → abre Google Meet en nueva pestaña
      ↓
[Profesional] pulsa "Comenzar grabación" → getDisplayMedia pestaña Meet (M11)
              chunks 15s → TranscribeChunkJob → Groq Whisper
              transcripción en vivo en panel lateral (Reverb) 🟡→✅
      ↓
[Profesional] pulsa "Finalizar sesión" → EndCallAction
              dispatch automático SummarizeSessionJob (M12) ❌→✅
      ↓
[Profesional] pantalla post-sesión:
      ├─ Notas manuales + resumen IA ya cargado (F6a) 🟡→✅
      ├─ Revisa factura legal (F6b) 🟡→✅
      └─ Confirma (F6c wizard) 🟡→✅
      ↓
[Sistema] envía email con factura + acuerdos al paciente ❌→✅
      ↓
[Paciente] recibe post-sesión + email (P6) ✅
[Paciente] redirect home 15s (P7) ✅
[Profesional] pantalla de éxito (F7) ✅
[Profesional] redirect dashboard 15s (F8) ✅
```

Estado tras MVP: **16/16 pasos del flujo + 7/7 capacidades transversales**.

### 3.2 Ventana de unión (10 minutos antes de la cita)

**Regla de negocio:**

- `canJoin(Appointment) = now >= starts_at - 10min AND now <= ends_at + 15min AND status IN (pending, confirmed)`
- El margen posterior de 15 min permite rejoins tras desconexiones.
- Si el profesional no ha iniciado a `starts_at + 20 min`, el sistema marca la cita como `no_show` automáticamente (job `MarkNoShowAppointments` cada 5 min).

**Implementación frontend (`waiting.tsx` paciente y profesional):**

```tsx
<JoinCallButton
  appointment={appointment}
  role={isProfessional ? 'professional' : 'patient'}
  opensAt={dayjs(appointment.starts_at).subtract(10, 'minute')}
/>
```

- Antes de la ventana: botón deshabilitado con texto "Disponible en HH:MM".
- Dentro de la ventana: botón activo "Iniciar sesión" (profesional) / "Unirse a la llamada" (paciente).
- Fuera de la ventana: mensaje "La sesión ya ha finalizado" + enlace a dashboard.

**Implementación backend:**

- Añadir método `Appointment::canBeJoinedNow(): bool`.
- Guardia en `StartCallAction` y `JoinCallAction`: retorna 403 `TooEarlyOrLateException` si `!canBeJoinedNow()`.
- Test Pest: `it_denies_join_before_10_minute_window`, `it_allows_join_exactly_at_minus_10`, `it_denies_join_after_end`.

---

## 4. Pendientes del MVP por capa

### 4.1 Backend

#### Jobs (nuevos)

| Job | Responsabilidad | Trigger |
|-----|-----------------|---------|
| **`SummarizeSessionJob`** | Llama a Groq (modelo `llama-3.3-70b-versatile`) con el texto completo de `session_recording.transcription` + contexto del `PatientContextService`. Guarda `ai_summary` y `summarized_at`. Emite `SessionSummarized` event para refrescar UI post-sesión. | Dispatch automático desde `EndCallAction` (no manual) |
| **`SendInvoiceEmailJob`** | Render PDF factura + envío con Laravel Mail (SMTP del profesional o Postmark/Resend en producción). Usa `Mail::to($invoice->patient)->send(new InvoiceIssuedMail($invoice))`. | `Invoice\SendAction` |
| **`SendAgreementsEmailJob`** | Envía todos los `agreements` marcados como `is_completed` al paciente post-sesión. | Desde wizard de cierre F6 |
| **`SendPostSessionEmailJob`** | Email al paciente con link al post-session screen (firmado temporalmente). | Desde wizard F6 |
| **`MarkNoShowAppointments`** | Marca como `no_show` las citas con `starts_at + 20min < now()` y sin `professional_joined_at`. | Scheduler cada 5 min |

#### Services

| Service | Método | Estado |
|---------|--------|--------|
| `BillingService` | `generatePdf(Invoice): void` (usando `barryvdh/laravel-dompdf`, ver ADR-0012) | ❌ → ✅ |
| `BillingService` | `generateSequentialInvoiceNumber()` — reemplazar `FAC-{YEAR}-{RANDOM}` por secuencial real (`FAC-{YEAR}-{NNNNN}`). La AEAT exige numeración **secuencial sin saltos**. | ⚠️ → ✅ |
| `KosmoService` | `summarizeSession(SessionRecording): array` — devuelve `{ key_points, patient_state, next_actions, raw }`. | ❌ → ✅ |
| `GoogleCalendarService` | `createMeetEvent(Appointment): array` — devuelve `{ event_id, meet_url }`. | nuevo |
| `DocumentCipherService` | `store(UploadedFile, ...): Document` — cifra con `Crypt::encrypt`, calcula sha256, guarda en disco `private`. | nuevo |
| `RgpdService` | `hasActiveRecordingConsent(User $patient): bool` — consulta el `ConsentForm` global firmado en registro, no revocado. Usar **dentro** de `TranscribeChunkJob` antes de enviar chunk a Groq. | nuevo |
| `RgpdService` | `storeRegistrationConsents(User $patient, array $acceptedTemplates, Request $request): void` — crea los 4 `ConsentForm` al completar registro con IP, timestamp y snapshot del texto legal. | nuevo |
| `Appointment` | `canBeJoinedNow(): bool` — `now() >= starts_at->subMinutes(10) && now() <= ends_at->addMinutes(15)`. | nuevo |

#### Policies — correcciones de autorización

| Policy | Método | Fix |
|--------|--------|-----|
| `PaymentPolicy` | `viewAny()` | `true` → `isAdmin() OR isProfessional()` |
| `PaymentPolicy` | `create()` | `true` → `isProfessional()` y workspace match |
| `DocumentPolicy` (nuevo) | Todos | `view/download` → paciente del documento O profesional con CaseAssignment activo. |
| `SessionRecordingPolicy` (nuevo) | `view/transcribe` | solo profesional responsable; paciente NO puede leer la transcripción completa en MVP. |

#### Form Requests nuevos

- `StoreInvoiceRequest` — valida `issued_at`, `due_at`, `tax_rate`, `payment_method`, items, número de factura único y secuencial.
- `TranscribeChunkRequest` — valida que el audio es menor de 10 MB, formato whitelisted, que hay consentimiento si es chunk del paciente.
- `StoreGoogleConnectionRequest` — OAuth callback.

#### Audit log (RGPD)

- Añadir `spatie/laravel-activitylog` en ADR-0013.
- Activar log en: `PatientProfile`, `Document`, `ConsentForm`, `SessionRecording`, `Invoice`.
- Eventos mínimos: `created`, `updated`, `deleted`, `viewed` (custom, vía observer en controladores `Show`).

### 4.2 Frontend

#### Pantallas a tocar

| Pantalla | Cambio |
|---|---|
| [auth/register.tsx](../resources/js/pages/auth/register.tsx) | 4 checkboxes obligatorios RGPD (ver §5.2). Botón "Registrarse" deshabilitado hasta marcar los 4. Crear 4 `ConsentForm` al hacer submit. |
| [call/room.tsx](../resources/js/pages/call/room.tsx) | Eliminar Jitsi. Botón "Abrir Google Meet" (nueva pestaña). Botón "Comenzar grabación" **solo visible para profesional** (invoca `getDisplayMedia`). Indicador "Grabando" persistente. Mantener `LiveTranscriptPanel`. |
| [patient/appointments/waiting.tsx](../resources/js/pages/patient/appointments/waiting.tsx) | `<JoinCallButton>` con countdown hasta `starts_at - 10 min`. Aviso informativo (§5.3) sobre grabación. Sin modal bloqueante. |
| [professional/appointments/waiting.tsx](../resources/js/pages/professional/appointments/waiting.tsx) | Mismo `<JoinCallButton>` en modo profesional ("Iniciar sesión"). |
| [professional/patients/post-session.tsx](../resources/js/pages/professional/patients/post-session.tsx) | Wizard de 3 pasos: **Paso 1** notas + resumen IA · **Paso 2** revisar factura · **Paso 3** confirmar envío. Resumen ya llega pre-cargado desde `SummarizeSessionJob`. |
| Nueva: `professional/invoices/review.tsx` | Formulario con campos legales PSI (IVA exento art. 20.1.3º LIVA, numeración secuencial, datos fiscales del profesional, NIF paciente opcional). |
| [settings/profile.tsx](../resources/js/pages/settings/profile.tsx) | Sección "Conectar Google" (botón → inicia OAuth para Calendar API). Sección "Mis consentimientos" con listado y botón "Revocar" (solo para paciente). |

#### Hooks / componentes nuevos

- **`useProfessionalTabRecorder`** (refactor de `useAudioChunks`): usa `getDisplayMedia({ video: true, audio: true })`, descarta pista de vídeo, trocea audio en chunks de 15s, envía a `POST /appointments/{id}/transcribe`. Gestiona estados `idle | permission_pending | recording | error`. Fallback a `getUserMedia` si no hay tab audio.
- **`<JoinCallButton>`**: countdown hasta `opensAt`, habilita/deshabilita automáticamente, dispara `StartCallAction` o `JoinCallAction` según rol.
- **`useCountdown(target: Date)`**: hook utilitario con `{ hh, mm, ss, isPast }`.
- **`<ConsentCheckboxes>`**: 4 checkboxes con textos legales expandibles, valida que los 4 estén marcados antes de permitir submit.
- **`<ActiveConsentsList>`**: listado en `settings/profile.tsx` con los consentimientos firmados y botón revocar.
- **`<RecordingIndicator>`**: pulsa rojo + "Grabando" en el panel lateral durante `recording`.
- **`use-meet-window.ts`**: abre popup con Meet, detecta cierre para disparar `EndCallAction`.
- **`InvoiceReviewForm.tsx`**: componente Chakra v3 con tokens semánticos (`brand`, `danger.fg` para avisos legales).

### 4.3 Infraestructura y operaciones

| Punto | Estado actual | MVP |
|---|---|---|
| **Queues** | Database driver | Database aceptable en MVP; documentar Redis+Horizon como post-MVP |
| **Broadcasting (Reverb)** | Single-process | Aceptable para 1 profesional; documentar cluster post-MVP |
| **Cron** | Laravel Scheduler registrado | Añadir `audio:cleanup` (diario 03:00), `invoices:mark-overdue` (diario 09:00) |
| **Storage** | `local` por defecto | Configurar disco `private` + permisos 0600; en Docker, volume dedicado |
| **Mail** | `log` / Mailpit | En producción: Postmark o Resend (documentar en ADR-0014). Para MVP aceptable SMTP de Gmail del profesional |
| **Despliegue** | Solo local | Mínimo: una instancia en Railway/Render/VPS con URL pública para la defensa. Secrets en environment no comiteados. |
| **Backup DB** | — | Script `mysqldump` diario cifrado. Aceptable manual en MVP. |

---

## 5. Seguridad y RGPD — bloqueantes del MVP

Estos puntos son **condición necesaria** para poder decir que el MVP es "defendible" como producto real. No son opcionales.

### 5.1 Cifrado de datos de salud (bloqueante)

Implementar `encrypted` cast en todos los campos listados en §2.2.2. Sin esto, el producto no puede atender a ningún paciente real.

### 5.2 Consentimiento global de grabación en registro (bloqueante)

**Decisión de producto:** el consentimiento para grabar las sesiones se recoge **en el momento del registro del paciente**, no por sesión. Es condición necesaria del servicio: sin aceptarlo no se puede completar el alta.

**Formulario de registro (`auth/register.tsx`) — campos obligatorios nuevos:**

- ☐ **He leído y acepto la política de privacidad.**
- ☐ **He leído y acepto los términos del servicio.**
- ☐ **Consiento el tratamiento de mis datos de salud para la finalidad terapéutica indicada.** (RGPD Art. 9.2.h)
- ☐ **Autorizo la grabación de audio de mis sesiones y su procesamiento automatizado por la IA de ClientKosmos para generar resúmenes clínicos destinados exclusivamente a mi profesional.** (RGPD Art. 22 — decisiones automatizadas con supervisión humana)

Los 4 son **bloqueantes**: sin los 4 marcados, el botón "Registrarse" queda deshabilitado.

**Persistencia:**

- Se crea un `ConsentForm` por cada checkbox al registrar, con:
  - `template_version` (versión del documento legal vigente).
  - `content_snapshot` (texto completo que el usuario aceptó — copia literal).
  - `signed_at`, `signed_ip`, `signature_data` (tipo de firma: `checkbox_registration`).
  - `status = 'signed'`.
  - `expires_at = null` o 2 años (revisión anual).
- Nuevo método `RgpdService::hasActiveRecordingConsent(User $patient): bool` que consulta el `ConsentForm` tipo `recording_global`.

**Validación antes de transcribir:**

`TranscribeChunkJob::handle()` verifica `RgpdService::hasActiveRecordingConsent($appointment->patient)` **antes** de llamar a Groq. Si el paciente revocó su consentimiento (via `settings/profile`):
1. Borrar el chunk localmente.
2. Registrar en audit log (sin payload del audio).
3. Marcar `session_recording.transcription_status = 'rejected_no_consent'`.

**Derecho de revocación (RGPD Art. 7.3):**

- Pantalla `settings/profile.tsx` (portal paciente) muestra los consentimientos activos con botón "Revocar".
- Revocar el consentimiento de grabación **no cancela** el servicio, pero impide grabación futura.
- El consentimiento global RGPD (tratamiento de datos de salud) sí obliga a cierre de cuenta si se revoca.

### 5.3 Consentimiento por sesión (información, no bloqueante)

Aunque el consentimiento es global, en la sala de espera del paciente (`waiting.tsx`) se muestra un **recordatorio informativo no bloqueante**:

> "Esta sesión será grabada y transcrita automáticamente por la IA de ClientKosmos para apoyar a tu profesional. Puedes revocar este consentimiento desde tu perfil en cualquier momento."

Esto cumple con el principio de **transparencia** del RGPD (Art. 13) sin re-bloquear cada sesión.

### 5.4 Política de retención (bloqueante documental)

Añadir `docs/data-retention-policy.md`:
- Audio crudo: borrado a las 24h tras transcripción (`audio:cleanup`).
- Transcripción: retención según legislación sanitaria española (**5 años** desde último contacto).
- Facturas: retención fiscal 6 años.
- Datos de paciente inactivo: derecho al olvido a petición, hard-delete auditado.

### 5.5 Audit log mínimo (alta prioridad)

`spatie/laravel-activitylog` en entidades sensibles. Al menos:
- Quién accedió a qué paciente y cuándo.
- Quién modificó notas clínicas.
- Quién descargó un documento.

### 5.6 Correcciones bloqueantes de auditoría previa

- **`PaymentPolicy::viewAny()`** y **`create()`** → corregir permisividad (ver §4.1).
- **`app.blade.php`** / headers → añadir CSP mínima, `X-Frame-Options`, `Referrer-Policy: strict-origin-when-cross-origin`.
- **Rate limiting** en `/appointments/{id}/transcribe` → `throttle:30,1` (30 chunks por minuto) para evitar abuso de Groq.

---

## 6. Definition of Done del MVP

Para considerar el MVP cerrado, todos los siguientes deben ser verdaderos:

### 6.1 Funcional

- [ ] Un paciente nuevo puede registrarse, buscar profesional, reservar, asistir a llamada Meet, recibir factura y acuerdos por email, **sin intervención manual del desarrollador**.
- [ ] Un profesional puede hacer ese mismo flujo completo desde su dashboard.
- [ ] La transcripción aparece en vivo en el panel lateral del profesional durante la llamada.
- [ ] El resumen IA se genera al finalizar la llamada en menos de 30s.
- [ ] La factura PDF cumple LIVA art. 20.1.3º (IVA exento con leyenda legal).

### 6.2 Seguridad

- [ ] Todos los campos clínicos sensibles tienen `encrypted` cast.
- [ ] `TranscribeChunkJob` valida consentimiento antes de llamar Groq.
- [ ] `PaymentPolicy` corregida.
- [ ] Consentimientos obligatorios en reserva implementados.
- [ ] Audit log activo en entidades sensibles.

### 6.3 Calidad

- [ ] Gate local verde: `pint --dirty` · `php artisan test --compact` · `composer analyse` · `npm run lint` · `npm run types` · `npm run build`.
- [ ] Cobertura Pest de cada happy path del flujo + 1 edge case.
- [ ] ADRs 0010–0014 redactados y aprobados.
- [ ] CI verde en `main`.

### 6.4 Operativa

- [ ] Una instancia desplegada con URL pública accesible para la defensa.
- [ ] Backup DB configurado (aunque sea manual).
- [ ] Política de retención escrita.
- [ ] Manual de usuario actualizado reflejando Meet y almacenamiento propio.

---

## 7. Plan por sprints (hasta 2026-05-14)

Calendario: 3 semanas desde 2026-04-24 (hoy). Cada sprint cierra viernes con gate verde.

### Sprint 1 — Semana 2026-04-26 / 2026-05-02 — "Seguridad, consentimiento y bases"

**Objetivo:** nivelar deuda técnica bloqueante antes de construir más features.

- **S1.1** ADRs: 0010 (Meet), 0011 (storage), 0012 (DomPDF), 0013 (activitylog), 0014 (mail), 0015 (consentimiento global en registro).
- **S1.2** Migraciones de cifrado: `encrypted` casts en User, PatientProfile, Note, SessionRecording, TranscriptionSegment.
- **S1.3** Fix `PaymentPolicy`.
- **S1.4** `RgpdService::hasActiveRecordingConsent()` + `storeRegistrationConsents()` + integración en `TranscribeChunkJob`.
- **S1.5** `DocumentPolicy` + `SessionRecordingPolicy`.
- **S1.6** Disco `private` + `DocumentCipherService` + refactor `Document\StoreAction`.
- **S1.7** `spatie/laravel-activitylog` instalado y activo en modelos sensibles.
- **S1.8** Formulario de registro con 4 checkboxes RGPD + creación de 4 `ConsentForm` + pantalla de revocación en `settings/profile`.
- **S1.9** Pest tests verdes para: cifrado, policies, consentimiento de registro, bloqueo de transcripción sin consentimiento, revocación.

### Sprint 2 — Semana 2026-05-03 / 2026-05-09 — "Meet + grabación profesional + IA + factura"

**Objetivo:** cerrar las capacidades transversales que faltan.

- **S2.1** `GoogleCalendarService` + OAuth + integración en `AppointmentStoreAction`.
- **S2.2** `Appointment::canBeJoinedNow()` + guardias en `StartCallAction` / `JoinCallAction` + `MarkNoShowAppointments` job + scheduler.
- **S2.3** `<JoinCallButton>` + `useCountdown` + integración en ambas `waiting.tsx` (paciente + profesional).
- **S2.4** Refactor `call/room.tsx` → eliminar Jitsi + botón "Abrir Google Meet" + botón "Comenzar grabación" (solo profesional).
- **S2.5** `useProfessionalTabRecorder` (refactor de `useAudioChunks`) con `getDisplayMedia` + descarte de pista de vídeo + fallback a `getUserMedia`.
- **S2.6** Dispatch automático `SummarizeSessionJob` desde `EndCallAction` + `KosmoService::summarizeSession()`.
- **S2.7** Desinstalar `@jitsi/react-sdk`.
- **S2.8** `BillingService::generatePdf()` con DomPDF + plantilla legal PSI (IVA exento) + numeración secuencial con lock transaccional.
- **S2.9** `SendInvoiceEmailJob` + `InvoiceIssuedMail` mailable.
- **S2.10** Página `invoices/review.tsx` con validación legal.
- **S2.11** Pest tests: ventana de 10 min, flujo completo de cita + Meet + grabación + resumen + factura.

### Sprint 3 — Semana 2026-05-10 / 2026-05-14 — "Cierre UX + despliegue"

**Objetivo:** pulir UX del cierre, desplegar, documentar.

- **S3.1** Wizard de cierre 3 pasos (F6a/b/c) en `post-session.tsx` con resumen IA pre-cargado.
- **S3.2** `SendAgreementsEmailJob` + `SendPostSessionEmailJob`.
- **S3.3** Aviso informativo no bloqueante de grabación en `waiting.tsx`.
- **S3.4** `docs/data-retention-policy.md` redactada.
- **S3.5** Despliegue en Railway/Render con dominio. Smoke test end-to-end.
- **S3.6** `docs/user_manual.md` actualizado reflejando Meet, grabación profesional y consentimiento de registro.
- **S3.7** Pulido UX `<RecordingIndicator>` + `<ActiveConsentsList>`.
- **S3.8** Ensayo de demo completo (paciente + profesional en dos navegadores Chrome distintos).

---

## 8. Fuera de alcance del MVP (backlog post-14-mayo)

- Chat libre con Kosmo AI (`KosmoService::chat()`).
- Pagos online Stripe (webhooks + Cashier + planes).
- Google Drive integración (eliminado por decisión).
- Referrals y `CollaborationAgreement` UI.
- Redis + Horizon.
- Reverb en cluster.
- Embed Meet (iframe) si Google lo permite.
- Búsqueda full-text sobre campos clínicos (requiere índices separados no cifrados con pseudonimización).
- App móvil nativa.
- Impersonation para soporte.

---

## 9. Riesgos del MVP

| # | Riesgo | Probabilidad | Impacto | Mitigación |
|---|--------|--------------|---------|------------|
| R1 | Google OAuth no se configura a tiempo (scopes, verificación app) | Media | Alto | Empezar OAuth en Sprint 1. Usar cuenta de test con consent screen interno mientras se verifica. |
| R2 | Cifrado rompe búsquedas existentes no detectadas | Media | Medio | Auditar queries `LIKE` sobre campos cifrados en Sprint 1. Si aparece alguna, refactorizar. |
| R3 | `getDisplayMedia` no captura audio de la pestaña Meet (Safari/Firefox limitados; profesional no comparte audio) | Alta | Alto | PoC en Sprint 2 primera mitad. Requisito explícito de Chrome/Edge en manual. Fallback `getUserMedia` solo micrófono del profesional (pierde voz del paciente pero sigue transcribiendo). |
| R3b | Paciente revoca el consentimiento de grabación entre registro y sesión | Baja | Medio | Job `TranscribeChunkJob` revalida en cada chunk (no en cada llamada). Si se revoca mid-session, los chunks siguientes se rechazan y la UI del profesional lo nota con segmentos que se detienen. |
| R4 | Groq Whisper supera cuota gratis con volumen de tests | Baja | Medio | Monitor de uso. Fallback: Mock en tests locales. |
| R5 | Despliegue en Railway/Render tarda más de lo esperado (variables, migraciones, storage persistente) | Media | Alto | Reservar 1 día completo en Sprint 3 para esto. Tener plan B: VPS Hetzner manual. |
| R6 | DomPDF no renderiza bien fonts con acentos | Baja | Bajo | Usar `dejavu-sans` o cargar fuente Unicode explícita. |
| R7 | Numeración secuencial bajo concurrencia genera duplicados | Baja | Alto | Generar número dentro de transacción con `SELECT ... FOR UPDATE` o usar `DB::transaction()` con lock. |

---

## 10. Log de cambios de este documento

| Fecha | Cambio |
|-------|--------|
| 2026-04-24 | Creación inicial. Definición de MVP con Google Meet + storage local cifrado. |
| 2026-04-24 | Añadidas decisiones de producto: ventana de unión de 10 min, grabación única desde el profesional (`getDisplayMedia` de pestaña Meet), consentimiento global de grabación en registro. |
| 2026-04-25 | Cierre Sprints 1-3 + auditoría: 16/16 pasos + 7/7 capacidades transversales. Cerradas deudas RGPD/seguridad: signed URLs en documentos del paciente (`Portal/Document/ShowAction` con TTL 5 min), comando `audio:cleanup` con scheduler diario 03:00, middleware `SecurityHeaders` (CSP + X-Frame-Options + Referrer-Policy + Permissions-Policy), rate limit `throttle:30,1` en `/appointments/{id}/transcribe`, fixtures de tests de password reparados, ADR-0015 redactado. Despliegue (S3.5) pospuesto a AWS. |
