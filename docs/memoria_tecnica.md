# Memoria Técnica — ClientKosmos
### Proyecto Final de Ciclo Superior de Desarrollo de Aplicaciones Multiplataforma (DAM)

**Autor:** Samuel Ayllón Sevilla  
**Curso:** 2.º DAM — Proyecto Intermodular  
**Versión del documento:** 1.0  
**Fecha:** Mayo 2026

---

## 1. Introducción y objetivos

### 1.1 Problema que resuelve

Los profesionales autónomos del ámbito de la salud mental —psicólogos, terapeutas, coaches clínicos— gestionan su práctica con herramientas fragmentadas: una agenda digital para citas, una hoja de cálculo para facturas, un correo para comunicarse con pacientes y archivos locales para notas clínicas. Esta dispersión genera pérdida de tiempo, riesgo de incumplimiento del RGPD y una experiencia de trabajo poco coherente.

ClientKosmos centraliza toda la operativa de consulta en una única aplicación web: gestión de pacientes, citas con videoconsulta integrada, notas clínicas cifradas, facturación con cobro online, formularios de consentimiento, mensajería con el paciente y un asistente de inteligencia artificial (Kosmo) que genera briefings pre/post sesión y resume transcripciones.

### 1.2 Público objetivo

El sistema diferencia dos roles de usuario:

- **Profesional:** psicólogo, terapeuta o coach autónomo que gestiona su propia agenda, pacientes y facturación. Puede pertenecer a un espacio de trabajo colaborativo con otros profesionales.
- **Paciente:** accede a un portal propio donde puede reservar citas disponibles, ver y pagar facturas, descargar documentos y firmar consentimientos.

Adicionalmente existe un rol **administrador** de plataforma que verifica las credenciales de los profesionales y gestiona usuarios.

### 1.3 Alcance del proyecto

El alcance cubre:

- Autenticación completa: registro, login, verificación de email, 2FA (TOTP), recuperación de contraseña y OAuth con Google.
- Gestión de pacientes con historial clínico cifrado, notas, acuerdos y documentos adjuntos.
- Calendario de disponibilidad y reserva de citas online por parte del paciente.
- Videoconsulta vía Google Meet con sala generada automáticamente en el backend.
- Grabación y transcripción de sesiones mediante Whisper (Groq) con filtrado de alucinaciones y detección de actividad de voz (VAD) en cliente.
- Facturación con numeración secuencial (FAC-AAAA-NNNNN), generación de PDF (dompdf) y cobro online mediante Stripe Checkout.
- Asistente IA Kosmo: briefings diarios, pre/post sesión y chat conversacional (Groq Llama 3.3 70B).
- Espacios de trabajo colaborativos, derivaciones y delegación de pacientes entre profesionales.
- Panel de administración para verificación de profesionales y gestión de usuarios.
- Cumplimiento RGPD: consentimientos firmados, auditoría de accesos, cifrado en reposo y purga automática de datos con retención configurable.
- Despliegue en producción sobre Railway con Docker y FrankenPHP.

---

## 2. Análisis de requisitos

### 2.1 Requisitos funcionales

**Autenticación y usuarios**

- RF01 — El sistema permite registro diferenciado de profesionales y pacientes con campos específicos por rol (número de colegiado, especialidades para profesionales; consentimientos RGPD para pacientes).
- RF02 — Los profesionales recién registrados quedan en estado «pendiente de verificación» hasta que un administrador aprueba su perfil.
- RF03 — El sistema soporta autenticación con Google OAuth 2.0 para profesionales y pacientes, vinculando automáticamente Google Calendar al iniciar sesión por primera vez.
- RF04 — El segundo factor de autenticación (2FA) se implementa mediante TOTP compatible con apps estándar (Google Authenticator, Authy).
- RF05 — Los usuarios pueden restablecer su contraseña mediante enlace enviado por email.

**Gestión de pacientes**

- RF06 — El profesional puede crear, editar y archivar fichas de pacientes con datos clínicos (razón de consulta, enfoque terapéutico, diagnóstico, notas clínicas).
- RF07 — Los datos clínicos sensibles (notas, diagnóstico, plan de tratamiento) se almacenan cifrados en base de datos.
- RF08 — El profesional puede añadir notas de sesión, acuerdos terapéuticos y documentos adjuntos a cada paciente.
- RF09 — El profesional puede invitar a un paciente por email para que acceda al portal con sus credenciales.

**Citas y disponibilidad**

- RF10 — El profesional configura su disponibilidad semanal (por día de semana o fecha específica) con duración de franja personalizable.
- RF11 — El paciente puede reservar citas a partir de los huecos disponibles del profesional, eligiendo modalidad (presencial o videoconsulta).
- RF12 — El sistema detecta conflictos de agenda (mismo profesional o mismo paciente) mediante bloqueo transaccional, impidiendo solapamientos.
- RF13 — Las citas pendientes expiran automáticamente 15 minutos después de su hora de fin si siguen en estado «pendiente».

**Videoconsulta**

- RF14 — Al crear una cita de modalidad videoconsulta, el sistema genera automáticamente un evento en Google Calendar con enlace Google Meet.
- RF15 — Profesional y paciente acceden a la sala desde la aplicación; el sistema registra las marcas de tiempo de entrada. **Estado:** funcional en producción; la sala se abre correctamente con el enlace Meet generado en backend.
- RF16 — Al finalizar la sesión, el profesional puede iniciar la transcripción del audio capturado en cliente (trozos de 8 segundos) enviándola al backend para procesarla con Whisper vía Groq. **Estado actual:** el cableado backend (cola, R2, Groq Whisper, filtrado de alucinaciones, resumen IA) está implementado y testeado, pero la **captura de audio del lado cliente sigue en proceso de desarrollo**: actualmente los chunks no se generan/suben correctamente en producción cuando el profesional inicia la grabación durante una llamada Meet (ver §4.6 P9). La videollamada en sí (acceso a Meet, marcas de entrada, finalización) funciona sin problemas.
- RF17 — El audio capturado es efímero: se elimina tras transcribir cada fragmento y nunca se persiste en disco. **Estado:** lógica implementada en `TranscribeChunkJob`; pendiente de validar end-to-end cuando se resuelva el bloqueo de captura cliente.
- RF18 — Las salas de citas completadas devuelven HTTP 410 (Gone) si se intenta acceder.

**Transcripción e IA**

- RF19 — El sistema genera briefings pre-sesión con los últimos tres registros de sesión, acuerdos abiertos, facturas pendientes y estado de consentimientos.
- RF20 — Tras la sesión, Kosmo genera un resumen estructurado (puntos clave, estado del paciente, próximas acciones) a partir de la transcripción.
- RF21 — El profesional puede conversar con el asistente Kosmo en chat para resolver dudas o pedir síntesis de información del paciente.

**Facturación y pagos**

- RF22 — Al completar una cita, el sistema genera automáticamente un borrador de factura vinculado al servicio ofrecido.
- RF23 — Las facturas tienen numeración secuencial única por año (FAC-AAAA-NNNNN) generada con bloqueo transaccional para evitar duplicados.
- RF24 — El profesional puede exportar facturas en PDF y enviarlas al paciente por email.
- RF25 — El paciente puede pagar su factura mediante Stripe Checkout (tarjeta) desde el portal.
- RF26 — El sistema procesa el webhook de Stripe para actualizar el estado de pago automáticamente.

**Mensajería y notificaciones**

- RF27 — Profesional y paciente pueden intercambiar mensajes internos en tiempo real mediante WebSockets (Laravel Reverb).
- RF28 — El sistema envía notificaciones push (in-app) y por email: cita confirmada, factura emitida, recordatorio de pago, aprobación de cuenta profesional.

**Espacios de trabajo y colaboración**

- RF29 — El profesional dispone de un espacio de trabajo personal creado automáticamente en el alta. Puede crear espacios colaborativos e invitar a otros profesionales.
- RF30 — Los profesionales de un mismo espacio pueden compartir pacientes, firmar acuerdos de colaboración y realizar derivaciones formales.

**Administración**

- RF31 — El administrador puede listar, aprobar, rechazar o bloquear cuentas de profesionales desde el panel de administración.
- RF32 — El administrador puede asumir la identidad de cualquier usuario (impersonación) para depuración y soporte.
- RF32b — El administrador dispone de una **papelera de usuarios** que muestra cuentas con borrado lógico (`soft-deleted`), con acciones de restauración y borrado físico definitivo. Al hacer soft-delete, se liberan el email y `google_id` del usuario para permitir un nuevo registro con la misma identidad.

**RGPD**

- RF33 — Al registrarse, el paciente acepta cuatro consentimientos diferenciados (política de privacidad, términos de servicio, datos de salud, grabación global) con marca de tiempo, IP y versión de la plantilla.
- RF34 — El paciente puede revocar cualquier consentimiento desde su perfil; la revocación es efectiva inmediatamente y queda auditada.
- RF35 — Un trabajo programado diario purga transcripciones revocadas, facturas con retención superada (5 años) y registros de auditoría con antigüedad superior a 2 años.
- RF36 — La aplicación expone rutas públicas `/privacy` y `/terms` con la política de privacidad y los términos de servicio, requisito necesario para la verificación del cliente OAuth ante Google.

---

### 2.2 Requisitos no funcionales

**Seguridad**

- RNF01 — Las contraseñas se almacenan con bcrypt (factor de coste 12).
- RNF02 — Los tokens de refresco de Google y los datos clínicos sensibles se cifran en reposo con `Crypt::encryptString()` (AES-256-CBC con MAC).
- RNF03 — Todos los endpoints CSRF-protegidos salvo `/webhooks/stripe` (que valida firma Stripe).
- RNF04 — Las cabeceras HTTP de seguridad (CSP, X-Frame-Options, X-Content-Type-Options) se inyectan globalmente mediante middleware `SecurityHeaders`.
- RNF05 — El acceso a transcripciones, facturas y documentos queda registrado en log de auditoría (middleware `LogTranscriptionAccess`).

**Rendimiento**

- RNF06 — Las operaciones de escritura costosas (transcripción, resumen IA, purga de datos, recordatorios de pago) se procesan fuera de la petición HTTP mediante colas de trabajo.
- RNF07 — Las consultas frecuentes de agenda y conflictos emplean índices compuestos sobre `(professional_id, starts_at, ends_at)`.
- RNF08 — Las lecturas de datos de sesión en el dashboard se difieren con *deferred props* de Inertia, mostrando un esqueleto animado mientras cargan.

**Usabilidad**

- RNF09 — La aplicación es completamente accesible conforme a WCAG 2.2 nivel AA (landmarks ARIA, roles semánticos, foco gestionado en navegación SPA).
- RNF10 — El sistema admite modo claro y oscuro, persistido en cookie del cliente.
- RNF11 — El diseño es *responsive* y adaptado a dispositivos móviles, empleando el sistema de tokens semánticos de Chakra UI v3.

**Mantenibilidad**

- RNF12 — El análisis estático con Larastan/PHPStan nivel 7 garantiza tipado estricto en todo el código PHP, con baseline vacía (0 errores aceptados).
- RNF13 — El formateo de código PHP se normaliza con Laravel Pint y el de TypeScript con ESLint + Prettier, ejecutados en el gate de CI.
- RNF14 — Cada decisión arquitectónica relevante está documentada en un ADR individual en `docs/adr/`.

**Escalabilidad**

- RNF15 — La arquitectura de colas permite escalar workers de forma independiente al servidor web.
- RNF16 — Los WebSockets de Reverb soportan escalado horizontal mediante adaptador Redis.
- RNF17 — El almacenamiento de ficheros está desacoplado del sistema de archivos local mediante el sistema de discos de Laravel. En producción se emplea **Cloudflare R2** (compatible con S3) para soportar despliegues multi-servicio sin estado compartido en disco ([ADR-0032](adr/0032-object-storage-cloudflare-r2.md)).

---

### 2.3 Casos de uso

| CU | Actor | Objetivo |
|----|-------|----------|
| CU-01 | Profesional | Registrarse, verificar email y completar onboarding (perfil + primer espacio de trabajo) |
| CU-02 | Administrador | Revisar y aprobar la cuenta de un profesional nuevo |
| CU-03 | Profesional | Configurar disponibilidad semanal y servicios ofrecidos |
| CU-04 | Paciente | Registrarse, aceptar consentimientos y reservar una primera cita |
| CU-05 | Profesional / Paciente | Iniciar sesión con Google (OAuth), vinculando Google Calendar |
| CU-06 | Profesional | Acceder a la ficha de un paciente: historial, notas, acuerdos, facturas y documentos |
| CU-07 | Profesional | Iniciar y gestionar una videoconsulta (sala Meet, transcripción, cierre) |
| CU-08 | Profesional | Revisar el briefing pre-sesión generado por Kosmo y las notas de sesiones anteriores |
| CU-09 | Profesional | Generar y enviar una factura; el paciente la paga con tarjeta vía Stripe |
| CU-10 | Profesional | Consultar el asistente Kosmo para obtener un resumen del caso o recomendaciones |
| CU-11 | Paciente | Revisar su historial de facturas, descargar PDF y firmar consentimientos desde el portal |
| CU-12 | Profesional | Derivar un paciente a un colega dentro del espacio colaborativo |
| CU-13 | Profesional | Conectar / desconectar cuenta de Google desde ajustes |
| CU-14 | Administrador | Consultar lista de usuarios y bloquear o eliminar cuentas |

---

## 3. Diseño y arquitectura

### 3.1 Stack tecnológico

#### Backend

| Tecnología | Versión | Justificación |
|------------|---------|---------------|
| PHP | 8.4 | Soporte a largo plazo, fibers, property hooks, mejoras de rendimiento nativas. |
| Laravel | 12 | Framework maduro con ecosistema completo: Fortify, Reverb, Wayfinder, Pint, Pail. |
| Laravel Fortify | 1.30 | Autenticación sin interfaz: login, registro, 2FA (TOTP), verificación de email, reset de contraseña. Extensible sin acoplamiento al frontend. |
| Laravel Reverb | 1.10 | Servidor WebSocket propio de Laravel, sin dependencia de Pusher. Escala con Redis. |
| Laravel Wayfinder | 0.1.9 | Genera tipos TypeScript desde las rutas y acciones PHP. Elimina URLs hardcoded en el frontend. |
| Inertia.js (Laravel) | 2.x | Puente monolítico Laravel ↔ React. Sin API REST explícita; el servidor devuelve props tipadas. |
| Spatie Permission | 7.2 | Control de roles y permisos (admin, professional, patient) sin acoplar la lógica al modelo `User`. |
| Spatie ActivityLog | 5.x | Auditoría automática de cambios en modelos sensibles y registro manual de accesos. |
| Stripe PHP | 20 | SDK oficial para crear sesiones de Checkout y validar webhooks con firma HMAC. |
| Google API Client | 2.19 | Gestión del flujo OAuth 2.0 y operaciones sobre Google Calendar y Meet. |
| openai-php/client | 0.19 | Cliente OpenAI-compatible usado con el endpoint de Groq (Llama 3.3 + Whisper). |
| barryvdh/laravel-dompdf | 3.x | Generación de PDFs de facturas desde plantillas Blade, sin binario externo. |
| Pest | 3.x | Framework de tests expresivo sobre PHPUnit. 509 tests, 1 887 aserciones. |
| Larastan/PHPStan | 3.x | Análisis estático nivel 7. Garantía de tipado sin errores en todo el codebase. |

#### Frontend

| Tecnología | Versión | Justificación |
|------------|---------|---------------|
| React | 19.2 | Librería de UI con React Compiler activado para optimización automática de renders. |
| TypeScript | 5.7 | Tipado estático end-to-end, combinado con Wayfinder para rutas tipadas. |
| Inertia React | 2.3.7 | Adaptador React de Inertia; gestiona la SPA sin routing en cliente. |
| Chakra UI | v3.34 | Sistema de diseño único. Tokens semánticos, accesibilidad first, modo oscuro nativo. Tailwind eliminado. |
| Zod | 4.4.3 | Validación de esquemas en cliente en formularios críticos (citas, pagos, consentimientos). |
| @laravel/echo-react | 2.3.3 | Hook `useEcho` para suscribirse a canales de Reverb desde componentes React. |
| Vite | 7 | Bundler con HMR, compatible con React Compiler y con el plugin de Laravel. |
| Vitest + Testing Library | 2.x / 6.9 | Tests unitarios de componentes y hooks. Entorno `jsdom` con soporte de Chakra Provider. |

#### Infraestructura

| Componente | Tecnología | Motivo |
|------------|-----------|--------|
| Entorno local | SQLite (archivo) | Cero configuración, suficiente para desarrollo individual. |
| Tests | SQLite (en memoria) | Aislamiento total y velocidad máxima. |
| Producción DB | MySQL 8 (Railway) | ACID completo, soporte de bloqueos de fila para numeración de facturas. |
| Servidor web | FrankenPHP 1 (Alpine) | PHP embedido en Caddy: HTTP/2, workers persistentes, sin PHP-FPM separado. |
| Contenerización | Docker (multi-stage) | Reproducibilidad total; imagen final < 200 MB. |
| Plataforma de despliegue | Railway | PaaS con auto-deploy desde rama `main`, MySQL gestionado, volumen persistente y dominios automáticos. |
| Almacenamiento de objetos (prod) | Cloudflare R2 | Compatible con S3, sin coste de egreso. Soporta despliegues multi-servicio sin estado compartido en disco ([ADR-0032](adr/0032-object-storage-cloudflare-r2.md)). |
| Email transaccional (prod) | Brevo HTTP API | Egreso SMTP bloqueado por Railway → se usa la API HTTP de Brevo. Las notificaciones de verificación/reset se envían vía cola. |
| Email dev | Mailpit | Captura SMTP local con interfaz web en `localhost:8025`. |

---

### 3.2 Patrón de arquitectura

El proyecto adopta una arquitectura **MVC en capas** con el patrón **Action** como capa de dominio, propio del ecosistema Laravel moderno.

```
HTTP Request
     │
     ▼
┌─────────────────────────────────┐
│  Form Request (validación)      │  app/Http/Requests/
│  Middleware (autenticación,     │  app/Http/Middleware/
│  autorización, auditoría)       │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Controller (Single-Action)     │  app/Http/Controllers/
│  — autoriza con Policy          │
│  — delega a Action o Service    │
│  — devuelve Inertia::render()   │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Action / Service (dominio)     │  app/Actions/ / app/Services/
│  — lógica de negocio pura       │
│  — transacciones y bloqueos     │
│  — despacha Jobs y Events       │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Modelo Eloquent                │  app/Models/
│  — relaciones, scopes, casts    │
│  — cifrado con casts propios    │
└────────────┬────────────────────┘
             │
             ▼
    Base de datos (MySQL/SQLite)
```

**Responsabilidades por capa:**

- **Form Request:** valida la entrada del usuario con reglas Laravel y la replica en cliente con Zod. El controlador recibe datos ya validados.
- **Middleware:** aplica autenticación (`auth`), verificación de email (`verified`), roles (`admin`, `professional`), acceso a espacio de trabajo (`workspace.access`) y auditoría de accesos sensibles (`rgpd.access_log`).
- **Controller (Single-Action):** clase invocable con un único método `__invoke`. Autoriza la acción mediante la Policy correspondiente, extrae los datos validados y llama a la Action o Service. Nunca contiene lógica de negocio.
- **Action:** objeto de dominio reutilizable e inyectable, independiente de HTTP. Maneja transacciones, bloqueos de fila y despacho de eventos/jobs.
- **Service:** clase con estado o integraciones externas (Google, Stripe, Groq, dompdf). Encapsula los detalles del proveedor.
- **Modelo:** define relaciones Eloquent, casts (incluido cifrado), scopes tipados y observadores.

**Comunicación con el frontend**

Inertia.js actúa como puente: el servidor serializa los datos como props PHP y el frontend los recibe directamente en los componentes React sin peticiones AJAX manuales. Las navegaciones en cliente se realizan sin recarga de página mediante el adaptador Inertia React, que gestiona el historial del navegador. Los formularios usan el hook `useForm` de Inertia, que maneja errores del servidor, estado de carga y redireccionamientos automáticamente.

---

### 3.3 Modelo de datos

El esquema cuenta con **25 tablas de dominio** más las tablas de infraestructura de Laravel (cache, jobs, sessions, migrations, notifications).

#### Entidades principales y relaciones

**users** — Base de autenticación para profesionales, pacientes y administradores.  
Campos clave: `name`, `email`, `password`, `google_id`, `google_refresh_token` (cifrado), `stripe_customer_id`, `two_factor_secret`, `deleted_at` (soft delete).

**professional_profiles** — Datos profesionales del usuario con rol profesional.  
Relación: `1:1` con `users`. Campos: `license_number`, `collegiate_number`, `specialties` (JSON), `verification_status` (enum: unverified / pending / verified / rejected), `bio`.

**patient_profiles** — Historial clínico del paciente.  
Relación: `1:1` con `users`; `N:1` con `workspaces` y con `users` (professional_id). Campos sensibles cifrados: `clinical_notes`, `diagnosis`, `treatment_plan`. Soft delete.

**workspaces** — Espacio de trabajo personal o colaborativo.  
Relación: `1:N` con `users` (vía `workspace_members`). Campos: `name`, `type` (personal / collaborative), `tax_id`, `settings` (JSON).

**workspace_members** — Tabla pivote que une usuarios y espacios de trabajo.  
Unique: `(workspace_id, user_id)`. Campos: `role` (member / billing_manager), `is_active`.

**appointments** — Cita entre profesional y paciente.  
Relaciones: `N:1` con `users` (professional), `users` (patient), `offered_consultations`, `workspaces`. Campos: `starts_at`, `ends_at`, `status` (pending / confirmed / in_progress / completed / cancelled / no_show), `modality` (in_person / video_call), `meeting_url`, `meeting_room_id`, `external_calendar_event_id`. Soft delete.

**offered_consultations** — Catálogo de servicios del profesional.  
Relación: `N:1` con `professional_profiles`. Campos: `name`, `duration_minutes`, `price`, `color` (HEX), `modality`.

**availabilities** — Franjas de disponibilidad del profesional.  
Relación: `N:1` con `users` y `workspaces`. Campos: `day_of_week` (0-6) o `specific_date`, `start_time`, `end_time`, `slot_duration_minutes`.

**session_recordings** — Metadatos de grabación de sesión.  
Relación: `1:1` con `appointments`. Campos cifrados: `transcription`, `ai_summary`. `transcription_status` (enum). `patient_consent_given_at`.

**transcription_segments** — Fragmentos de transcripción con hablante y marcas de tiempo.  
Relación: `N:1` con `session_recordings` y `users` (speaker). Unique: `(session_recording_id, speaker_user_id, position)`. Campos cifrados: `text`.

**notes** — Notas clínicas del profesional sobre el paciente.  
Relación: `N:1` con `patient_profiles`, `users`, `appointments` (opcional). Campo cifrado: `content`. `type` (quick_note / session_note / observation / followup).

**agreements** — Acuerdos terapéuticos (tareas, compromisos).  
Relación: `N:1` con `patient_profiles`, `users`, `appointments` (opcional). Campos: `content`, `is_completed`, `completed_at`.

**consent_forms** — Consentimientos RGPD del paciente.  
Relación: `N:1` con `patient_profiles`, `users`. Campos: `consent_type`, `template_version`, `content_snapshot`, `status` (pending / signed / expired / revoked), `signed_at`, `signed_ip`, `expires_at`.

**documents** — Documentos adjuntos del paciente.  
Relación: `N:1` con `patient_profiles`, `users`, `workspaces`. Campos: `name`, `local_path`, `mime_type`, `size_bytes`, `category` (rgpd_consent / informed_consent / report / invoice / other).

**invoices** — Facturas emitidas por el profesional.  
Relación: `N:1` con `users` (professional, patient), `workspaces`. Campos: `invoice_number` (FAC-AAAA-NNNNN, unique), `status` (draft / sent / paid / overdue / cancelled), `total`, `tax_rate`, `due_at`, `paid_at`, `payment_method`, `stripe_checkout_session_id`, `pdf_path`.

**invoice_items** — Líneas de factura.  
Relación: `N:1` con `invoices`, `appointments` (opcional).

**messages** — Mensajería interna entre profesional y paciente.  
Relación: `N:1` con `users` (sender, receiver). `read_at` para estado de lectura.

**kosmo_briefings** — Briefings generados por IA.  
Relación: `N:1` con `users`, `patient_profiles`, `appointments`. Campos: `type` (daily / pre_session / post_session / weekly / nudge), `content` (JSON), `is_read`.

**case_assignments** — Asignación formal de paciente a profesional.  
Relación: `N:1` con `users` (patient, professional), `workspaces`. Unique: `(patient_id, professional_id, workspace_id)`. `role` (primary / secondary / co_therapist), `status` (active / paused / ended).

**collaboration_agreements** — Acuerdos entre profesionales.  
`professional_a_id`, `professional_b_id` → `users`. `terms` (JSON). Unique: `(professional_a_id, professional_b_id, workspace_id)`.

**referrals** — Derivaciones formales entre profesionales.  
Relación con `users` (from, to) y `patient_profiles`. `status` (pending / accepted / rejected / cancelled).

**patient_delegations** — Transferencias temporales de cuidado.  
Relación con `patient_profiles`, `users` (from, to), `workspaces`.

**activity_log** — Auditoría Spatie (tabla polimórfica).  
Registra `event`, `subject_type/id`, `causer_type/id`, `properties` (JSON con valores antes/después).

---

## 4. Desarrollo técnico

### 4.1 Flujo de videoconsulta y transcripción

Este es el módulo técnicamente más complejo del proyecto, e integra cuatro tecnologías: Google Meet, la API Whisper de Groq, detección de actividad de voz (VAD) en cliente y el modelo LLM para resumen posterior.

> **Estado en producción (mayo 2026):** la **videoconsulta es totalmente funcional** (creación de sala Meet, acceso de ambas partes, marcas de entrada, cierre). El subsistema de **transcripción está parcialmente operativo: el backend (cola, almacenamiento R2, llamada a Groq Whisper, filtrado de alucinaciones, resumen LLM) está implementado y probado, pero la captura de audio en el lado cliente durante la videollamada presenta un bloqueo en proceso de depuración** (ver §4.6 P9). Esto significa que actualmente no se generan segmentos de transcripción para las sesiones grabadas en producción; el resto del flujo está listo para procesarlos en cuanto se resuelva.

**Generación de sala Meet**

Al crear o confirmar una cita de modalidad `video_call`, `GoogleCalendarService::createMeetEvent()` invoca la API de Google Calendar con `conferenceDataVersion=1`, creando un evento con `ConferenceData` de tipo `hangoutsMeet`. La respuesta incluye el `conferenceId` (almacenado en `appointments.meeting_room_id`) y el `entryPoints[].uri` (almacenado en `appointments.meeting_url`). Si la llamada a Google falla, la cita se crea igualmente sin enlace (fallo no bloqueante).

```php
// GoogleCalendarService — fragmento crítico
$event->setConferenceData(new ConferenceData([
    'createRequest' => new CreateConferenceRequest([
        'requestId'             => Str::uuid()->toString(),
        'conferenceSolutionKey' => new ConferenceSolutionKey(['type' => 'hangoutsMeet']),
    ]),
]));
```

**Captura de audio en cliente**

En el componente `room.tsx`, el hook `useProfessionalTabRecorder` usa la API `getDisplayMedia({ audio: true })` para capturar el audio de la pestaña del navegador (no el micrófono local). Los fragmentos se generan mediante `MediaRecorder` en chunks de 8 segundos y se envían en base64 al endpoint `POST /professional/appointments/{id}/transcribe`. El VAD cliente descarta fragmentos de silencio antes del envío.

**Transcripción en backend**

El controlador `Appointment\TranscribeAction` recibe el chunk, valida que el paciente haya dado consentimiento, lo escribe temporalmente en disco cifrado y despacha `TranscribeChunkJob`. El job:

1. Envía el audio a Groq Whisper Turbo con `language=es`.
2. Aplica un filtro de alucinaciones (lista de frases conocidas que Whisper genera en silencio: "Subtítulos de la comunidad", "Amara.org", etc.).
3. Si el texto supera el umbral mínimo de caracteres, crea un `TranscriptionSegment` cifrado.
4. Elimina el archivo temporal.

**Evento `TranscriptionSegmentCreated`**

Al persistir cada segmento, un observer lanza el evento que escucha `AggregateTranscriptionListener`. Este concatena todos los segmentos ordenados por `started_at_ms` y actualiza `session_recordings.transcription` con el texto acumulado.

**Resumen post-sesión**

`SummarizeSessionJob` llama a `KosmoService::summarizeSession()`, que construye un prompt estructurado con la transcripción completa y solicita al modelo Llama 3.3 70B de Groq una respuesta JSON con los campos `key_points`, `patient_state` y `next_actions`. El resultado se persiste en `session_recordings.ai_summary` (cifrado).

**Estado HTTP 410 para salas cerradas**

`Call\ShowRoomAction` comprueba que `appointment.status` sea `in_progress` o `confirmed`. Si está `completed` o `cancelled`, devuelve un error 410 con una página Inertia de sala expirada, impidiendo el acceso a grabaciones o transcripciones desde el enlace público.

---

### 4.2 Facturación con numeración secuencial y cobro Stripe

El requisito de numeración correlativa sin huecos (obligatorio en la legislación fiscal española) se implementa con bloqueo pesimista sobre la tabla de facturas:

```php
// BillingService::generateSequentialInvoiceNumber()
DB::transaction(function () use ($year, &$number) {
    $last = Invoice::whereYear('issued_at', $year)
        ->lockForUpdate()           // bloqueo de fila hasta commit
        ->orderByDesc('invoice_number')
        ->value('invoice_number');

    $sequence = $last ? ((int) Str::afterLast($last, '-')) + 1 : 1;
    $number = sprintf('FAC-%d-%05d', $year, $sequence);
});
```

El flujo completo de cobro es:

1. El profesional genera la factura desde el sistema (estado `draft`).
2. El profesional la marca como `sent`, lo que dispara el envío de email al paciente.
3. El paciente entra en el portal, ve la factura y pulsa «Pagar». El sistema llama a `Invoice\Checkout\CreateSessionAction`, que crea una `Checkout\Session` de Stripe con `payment_intent_data.metadata.invoice_id`.
4. Stripe redirige al paciente al portal de pago. Tras el pago, redirige a la URL de éxito.
5. Stripe envía un webhook `checkout.session.completed` a `POST /webhooks/stripe`. `StripeWebhookAction` valida la firma (`$stripe->webhooks->constructEvent()`), localiza la factura por `metadata.invoice_id` y llama a `BillingService::markAsPaid()`.

---

### 4.3 Disponibilidad y detección de conflictos

`AvailabilityService::slotsForProfessional()` calcula los huecos libres en los próximos N días:

1. Obtiene los registros de `availabilities` del profesional (recurrentes por `day_of_week` y específicos por `specific_date`).
2. Para cada día del rango, expande los registros activos en franjas de `slot_duration_minutes`.
3. Excluye las franjas que solapan con citas existentes (`status NOT IN ('cancelled', 'no_show')`).
4. Devuelve un array `[date => [time, ...]]` que el frontend renderiza como selector de horas.

Al crear una cita (`CreateAppointment`), la validación de conflictos usa `lockForUpdate` en una transacción para evitar la condición de carrera en reservas concurrentes:

```php
$conflict = Appointment::where('professional_id', $data->professionalId)
    ->where('status', '!=', 'cancelled')
    ->where('starts_at', '<', $endsAt)
    ->where('ends_at', '>', $startsAt)
    ->lockForUpdate()
    ->exists();

if ($conflict) {
    throw ValidationException::withMessages(['starts_at' => 'Franja no disponible.']);
}
```

---

### 4.4 Integración Google OAuth y Calendar

El flujo OAuth 2.0 para profesionales sigue el estándar Authorization Code Grant:

1. `Settings\Google\RedirectAction` genera la URL de autorización con scopes `openid email profile https://www.googleapis.com/auth/calendar.events` y redirige al usuario a Google.
2. `Settings\Google\CallbackAction` intercepta el código de autorización, lo intercambia por un `access_token` y `refresh_token` mediante `GoogleCalendarService::exchangeCode()`, y persiste el `refresh_token` cifrado en `users.google_refresh_token`.
3. En operaciones posteriores sobre Calendar, el servicio reconstruye el cliente con el `refresh_token` almacenado, delegando la renovación del `access_token` a la librería oficial.

El mismo flujo existe para autenticación directa (login/registro con Google), gestionado por `Auth\Google\RedirectAction` y `Auth\Google\CallbackAction`, que además vincula el `google_id` al usuario si ya existe una cuenta con ese email.

---

### 4.5 Asistente IA Kosmo (Groq Llama 3.3)

`KosmoService` es el adaptador entre la lógica de dominio y la API de Groq, que es compatible con el protocolo OpenAI. Se eligió Groq en lugar de OpenAI directamente por su plan gratuito de 14 400 peticiones/día y latencia de inferencia muy baja (ideal para chat en tiempo real).

El briefing pre-sesión agrega:
- Las tres últimas citas completadas del paciente con sus notas.
- Los acuerdos terapéuticos abiertos.
- La última factura y su estado.
- El estado de los consentimientos vigentes.

Esta información se inyecta en el prompt de sistema antes de la conversación, proporcionando contexto clínico al modelo sin que el profesional tenga que buscar manualmente los datos.

El chat conversacional mantiene el historial de la sesión en el estado de React y lo envía en cada petición, siguiendo el protocolo de mensajes de OpenAI (`role: user | assistant | system`).

---

### 4.6 Problemas encontrados y soluciones

**P1: Capturas de audio vacías en Windows con `getDisplayMedia`**  
En Chrome/Windows, `getDisplayMedia` a veces devuelve un stream sin pistas de audio si el usuario no marca «Compartir audio del sistema». Se solucionó mostrando un indicador visual explícito en la UI antes de iniciar la grabación y validando `stream.getAudioTracks().length > 0` antes de iniciar `MediaRecorder`.

**P2: Huecos en la numeración de facturas bajo carga concurrente**  
La primera implementación usaba `MAX(invoice_number)` sin transacción, lo que producía colisiones con múltiples workers de cola activos. La solución definitiva usa `SELECT ... FOR UPDATE` dentro de una transacción explícita de MySQL, garantizando serialización.

**P3: Alucinaciones de Whisper en silencios**  
Whisper genera texto inventado cuando recibe audio de silencio ("Subtítulos de la comunidad de Amara.org", "Gracias por ver el vídeo", etc.). Se implementó una lista de frases prohibidas y un umbral mínimo de caracteres significativos por fragmento para descartar estas alucinaciones antes de persistir el segmento.

**P4: FrankenPHP y extensiones PHP faltantes en build de Wayfinder**  
La etapa `frontend` del Dockerfile necesita ejecutar `php artisan wayfinder:generate`, pero la imagen Node no incluye PHP. La solución fue usar una imagen base `php:8.4-alpine` con las extensiones necesarias (pdo, mbstring, xml) en la etapa `frontend` antes de instalar Node, manteniendo la imagen final en FrankenPHP.

**P5: Purga de datos RGPD sin afectar integridad referencial**  
Los trabajos de purga no pueden eliminar registros referenciados por foreign keys. Se implementó una estrategia de anonimización (nullify + flag `is_purged`) en lugar de hard delete para registros con dependencias, reservando el hard delete para entidades hoja del grafo (segmentos de transcripción, logs de actividad).

**P6: Egreso SMTP bloqueado por Railway**  
La plataforma Railway bloquea el egreso SMTP saliente en los planes Hobby, impidiendo el envío de emails de verificación a través de Mailgun/SES. Se migró a **Brevo HTTP API** mediante un transport personalizado (`feat(mail): add Brevo HTTP API transport`) y se encolaron las notificaciones de verificación y reset con un `--timeout=30` para evitar workers colgados.

**P7: Persistencia de archivos en despliegues multi-servicio**  
El volumen local de Railway no se comparte entre servicios (web + worker), provocando que PDFs e imágenes subidos por un servicio no fueran legibles por el otro. La solución fue migrar el disco de Laravel a **Cloudflare R2** (compatible S3, sin coste de egreso) con `FILESYSTEM_DISK=r2`.

**P8: Cliente OAuth de Google bloqueado en modo Testing**  
El subdominio gratuito `*.up.railway.app` no permite verificación de propiedad de dominio en Google Search Console, por lo que el cliente OAuth permanece en modo Testing. Se añadieron las rutas públicas `/privacy` y `/terms`, los enlaces en el footer de la home y un documento justificativo ([google-oauth-test-users-justification.md](google-oauth-test-users-justification.md)).

**P9: Captura de audio cliente durante videollamada — en proceso de desarrollo**  
Durante las primeras pruebas en producción, al iniciar la grabación desde la sala Meet integrada (`/call/{room_id}`) el contador "X segmentos transcritos" permanece en 0 incluso tras hablar más de 30 segundos. No se observan errores en la consola del navegador ni en la pestaña Network del DevTools, ni peticiones `POST /appointments/{id}/transcribe` salientes. El backend de transcripción (`TranscribeAction` + `TranscribeChunkJob` + Groq Whisper) está implementado, testeado y listo para procesar chunks tan pronto como lleguen. Hipótesis en investigación:

- Captura por `getDisplayMedia` con audio de pestaña: si el usuario no marca el checkbox "Compartir audio de la pestaña" en el diálogo del navegador, el stream resultante no contiene pistas de audio y `MediaRecorder` no produce chunks.
- El VAD cliente (RMS threshold `0.012`) podría estar descartando todos los chunks como silencio si el navegador aplica supresión de ruido agresiva, no notificando al usuario.
- Posible incompatibilidad de la API `getDisplayMedia` con audio en determinadas combinaciones de navegador / sistema operativo (Firefox, Safari, móviles).

Mitigaciones planificadas: añadir indicador visual del estado de la captura (`audioSource = 'tab' | 'microphone' | null`), exponer el contador de chunks descartados por VAD en la UI, fallback explícito a micrófono con aviso, telemetría de errores `getDisplayMedia` en el frontend y modo de captura simplificado solo-micrófono para entornos donde tab audio no esté disponible. El módulo se mantiene en estado **"en desarrollo activo"** y se desactivará la opción de grabación en la UI para usuarios finales hasta que la captura sea fiable.

---

## 5. Manual de instalación y configuración

### 5.1 Requisitos previos

| Componente | Versión mínima |
|-----------|----------------|
| PHP | 8.4 |
| Composer | 2.x |
| Node.js | 20 LTS |
| npm | 10.x |
| Git | 2.x |
| Docker + Docker Compose | 27.x (opcional, recomendado) |

Para despliegue en producción se requiere además una cuenta en Railway y credenciales de Google Cloud, Groq y Stripe (ver §5.4).

---

### 5.2 Instalación en local (sin Docker)

```bash
# 1. Clonar repositorio
git clone <url-repositorio>
cd client-kosmos-SamuelAyllon

# 2. Instalar dependencias PHP
composer install

# 3. Instalar dependencias JS
npm install

# 4. Configurar entorno
cp .env.example .env
php artisan key:generate

# 5. Crear base de datos y ejecutar migraciones con seeders
php artisan migrate:fresh --seed

# 6. Generar tipos Wayfinder (rutas y acciones tipadas en TS)
php artisan wayfinder:generate

# 7. Iniciar servidores (backend + frontend con HMR)
composer dev
```

El comando `composer dev` lanza en paralelo `php artisan serve`, `npm run dev` y `php artisan reverb:start`.

Credenciales de prueba tras el seed:

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | admin@clientkosmos.test | password |
| Profesional | natalia@clientkosmos.test | password |

---

### 5.3 Instalación con Docker

```bash
# Build e inicio de contenedores (MySQL + Mailpit + app FrankenPHP)
docker compose up --build -d

# Aplicación disponible en http://localhost:8000
# Mailpit (captura de emails) en http://localhost:8025
```

El entrypoint del contenedor ejecuta automáticamente `php artisan migrate --force` y el seed solo en entornos no productivos.

---

### 5.4 Variables de entorno críticas

```ini
# Aplicación
APP_KEY=base64:...         # Generado con artisan key:generate
APP_URL=http://localhost:8000
APP_ENV=local

# Base de datos (dev: SQLite, prod: MySQL)
DB_CONNECTION=sqlite       # o mysql en producción
# DB_HOST / DB_PORT / DB_DATABASE / DB_USERNAME / DB_PASSWORD  ← prod

# Cola, caché y sesión
QUEUE_CONNECTION=database
CACHE_STORE=database
SESSION_DRIVER=database

# WebSockets Reverb
REVERB_APP_ID=...
REVERB_APP_KEY=...
REVERB_APP_SECRET=...
VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"

# IA (Groq)
GROQ_API_KEY=gsk_...
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=llama-3.3-70b-versatile

# Pagos (Stripe)
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=${APP_URL}/settings/google/callback

# Email (producción: Brevo HTTP API)
MAIL_MAILER=brevo
BREVO_API_KEY=xkeysib-...
MAIL_FROM_ADDRESS=no-reply@clientkosmos.com
MAIL_FROM_NAME=ClientKosmos

# Almacenamiento de objetos (producción: Cloudflare R2)
FILESYSTEM_DISK=r2
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=...
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
```

---

### 5.5 Despliegue en producción (Railway)

1. Crear proyecto en Railway y provisionar servicio MySQL desde plantilla.
2. Conectar el servicio de aplicación al repositorio GitHub (rama `main`).
3. Configurar las variables de entorno de producción en el dashboard de Railway, usando referencias a los valores MySQL: `${{MySQL.MYSQLHOST}}`, etc.
4. Montar un volumen persistente en `/app/storage/app` para los archivos subidos.
5. Railway detecta el Dockerfile automáticamente y construye la imagen en tres etapas.
6. El healthcheck apunta a `GET /up` (endpoint de Laravel) con timeout de 300 s.
7. Cada push a `main` dispara un redeploy automático.

---

### 5.6 Gate de calidad (pre-commit / CI)

```bash
vendor/bin/pint --dirty --format agent   # Formato PHP
vendor/bin/phpstan analyse               # Análisis estático nivel 7
php artisan test --compact               # Tests Pest (Feature + Unit)
npm run lint                             # ESLint
npm run types                            # TypeScript check
npm run test                             # Vitest (componentes + hooks)
npm run build                            # Build de producción Vite
```

---

## 6. Presupuesto técnico

### 6.1 Horas de desarrollo estimadas

| Módulo | Horas estimadas |
|--------|----------------|
| Configuración inicial, Docker, Railway, CI | 24 h |
| Autenticación (Fortify, OAuth Google, 2FA) | 30 h |
| Gestión de pacientes y historial clínico | 32 h |
| Disponibilidad y sistema de citas | 28 h |
| Videoconsulta (Meet, sala, VAD, grabación) | 40 h |
| Transcripción Whisper y asistente Kosmo (IA) | 36 h |
| Facturación, PDF y Stripe | 32 h |
| Mensajería (Reverb, WebSockets) | 16 h |
| Portal del paciente | 24 h |
| Espacios de trabajo colaborativos | 20 h |
| Panel de administración | 16 h |
| RGPD (consentimientos, auditoría, purga) | 20 h |
| Frontend (Chakra UI, diseño, accesibilidad) | 48 h |
| Tests (Pest, Vitest, PHPStan) | 40 h |
| Documentación técnica y ADRs | 20 h |
| **Total** | **426 h** |

### 6.2 Coste de desarrollo

| Concepto | Detalle | Coste |
|---------|---------|-------|
| Horas de desarrollo (perfil junior, 12 €/h) | 426 h × 12 €/h | 5 112,00 € |
| Hardware (amortización laptop 1 200 €, 3 años, pro-rata 6 meses) | — | 200,00 € |
| **Subtotal desarrollo** | | **5 312,00 €** |

### 6.3 Costes de infraestructura y licencias (mensual / anual)

| Servicio | Plan | Coste |
|---------|------|-------|
| Railway (app + MySQL) | Hobby Plan | 5 USD/mes ≈ 60 USD/año |
| Groq API (IA) | Free Tier (14 400 req/día) | 0 €/mes |
| Stripe | Pay-as-you-go (1,5% + 0,25 € por transacción) | Variable |
| Google Cloud (OAuth + Calendar API) | Free Tier | 0 €/mes |
| Dominio personalizado | .com / .es (anual) | ≈ 12 €/año |
| Licencias de software | Todas MIT / Apache 2.0 | 0 € |

### 6.4 Coste total estimado (primer año)

| Concepto | Importe |
|---------|--------|
| Desarrollo (coste único) | 5 312,00 € |
| Infraestructura primer año | ≈ 72,00 € |
| **Total primer año** | **≈ 5 384,00 €** |

> Nota: el modelo de monetización de la plataforma se basa en publicidad integrada y un modo sin anuncios de pago opcional (ADR-0028), lo que elimina coste de licencia para el usuario final.

---

## 7. Conclusiones

### 7.1 Resultados obtenidos

ClientKosmos cubre de forma funcional y completa el ciclo de trabajo de un profesional autónomo de la salud mental: desde el alta del paciente y la planificación de la agenda hasta el cobro de facturas y la generación automatizada de resúmenes de sesión mediante IA. La aplicación está desplegada en producción en Railway y supera el gate de calidad definido en el proyecto: 509 tests (1 887 aserciones), análisis estático PHPStan nivel 7 con baseline vacía y compilación de producción sin errores.

El módulo de **videoconsulta** funciona end-to-end en producción: creación automática de sala Google Meet vinculada a la cita, acceso por enlace desde la app para profesional y paciente, registro de marcas de entrada/salida y cierre con devolución 410 (Gone) sobre salas completadas.

El módulo de **transcripción e IA** representa el mayor logro técnico del proyecto en cuanto a diseño: la integración asíncrona de chunks cifrados (R2) → Groq Whisper Turbo → filtrado de alucinaciones → resumen LLM (Llama 3.3 70B) está implementada, testeada y desplegada. **No obstante, la captura de audio en el navegador durante la videollamada presenta actualmente un bloqueo en fase de depuración** (ver §4.6 P9): los chunks no se generan/suben en producción, por lo que no se han producido transcripciones reales en el entorno desplegado. La cadena backend está lista para procesar segmentos en cuanto el frontend los entregue, y el flujo end-to-end queda validado en los tests automáticos del repositorio. Resolver este bloqueo es la siguiente tarea prioritaria del proyecto.

### 7.2 Aprendizajes técnicos

- **Inertia.js** como patrón monolítico es una alternativa sólida a las arquitecturas API REST + SPA cuando el equipo es pequeño y el tiempo de desarrollo es el principal factor limitante.
- El patrón **Single-Action Controller + Action de dominio** simplifica enormemente el mantenimiento: cada fichero tiene una única razón para cambiar.
- El **análisis estático estricto** (PHPStan nivel 7) obliga a resolver ambigüedades de tipos en el momento de escribirlas, reduciendo significativamente los bugs en producción.
- La gestión de **audio efímero en cliente** (VAD + descarte de silencio antes de enviar) reduce tanto el tráfico de red como los costes de API, y evita la obligación de almacenar audio de sesiones clínicas.
- El cumplimiento **RGPD** en una aplicación con datos de salud (categoría especial del art. 9) requiere un diseño deliberado desde el inicio: no es posible añadirlo a posteriori sin refactorizaciones profundas.

### 7.3 Posibles mejoras futuras

- **Reverb en tiempo real para transcripción en vivo:** emitir los segmentos al frontend en cuanto se generan, sin necesidad de recargar la página post-sesión.
- **Agenda inteligente:** usar el historial de sesiones para sugerir al profesional el día y hora óptimos para la próxima cita de cada paciente.
- **App móvil progresiva (PWA):** habilitar instalación en dispositivos móviles con notificaciones push nativas.
- **Integración con sistemas de historia clínica electrónica (FHIR):** exportar/importar episodios clínicos en formato estándar HL7 FHIR R4.
- **Facturación electrónica (Factura-e / TicketBAI):** adaptación a los formatos exigidos por la normativa española de facturación electrónica a partir de 2025.
- **Multi-idioma:** i18n completo para mercados de habla inglesa y portuguesa.

---

## 8. Bibliografía

### Documentación oficial

- Laravel Framework — documentación oficial (v12): https://laravel.com/docs/12.x
- Laravel Fortify — guía de autenticación: https://laravel.com/docs/12.x/fortify
- Laravel Reverb — WebSockets: https://reverb.laravel.com/docs
- Laravel Wayfinder — rutas tipadas: https://github.com/laravel/wayfinder
- Inertia.js — documentación oficial (v2): https://inertiajs.com
- React — documentación oficial (v19): https://react.dev
- TypeScript Handbook: https://www.typescriptlang.org/docs/handbook/
- Chakra UI v3 — componentes y tokens: https://chakra-ui.com/docs
- Zod — documentación (v4): https://zod.dev
- Vite — guía oficial (v7): https://vitejs.dev/guide/
- Pest PHP — documentación (v3): https://pestphp.com/docs
- PHPStan / Larastan: https://phpstan.org/user-guide/getting-started

### APIs y servicios externos

- Google Identity Services — OAuth 2.0: https://developers.google.com/identity/protocols/oauth2
- Google Calendar API v3: https://developers.google.com/calendar/api/v3/reference
- Google Meet API (Conference Data): https://developers.google.com/calendar/api/guides/create-events#conferencing
- Stripe Checkout — guía de integración: https://docs.stripe.com/payments/checkout
- Stripe Webhooks — verificación de firma: https://docs.stripe.com/webhooks/signature-verification
- Groq API — OpenAI-compatible endpoint: https://console.groq.com/docs/openai
- Groq Whisper — transcripción de audio: https://console.groq.com/docs/speech-text
- Brevo (ex-SendinBlue) — Transactional Email API: https://developers.brevo.com/reference/sendtransacemail
- Cloudflare R2 — almacenamiento de objetos compatible S3: https://developers.cloudflare.com/r2/

### Normativa y estándares

- Reglamento (UE) 2016/679 del Parlamento Europeo (RGPD): https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX%3A32016R0679
- WCAG 2.2 — Web Content Accessibility Guidelines: https://www.w3.org/TR/WCAG22/
- OWASP Top 10 2021: https://owasp.org/www-project-top-ten/
- Ley 58/2003, de 17 de diciembre, General Tributaria (numeración de facturas): https://www.boe.es/buscar/act.php?id=BOE-A-2003-23186

### Herramientas de desarrollo

- FrankenPHP — servidor PHP embebido en Caddy: https://frankenphp.dev/docs/
- Railway — despliegue PaaS: https://docs.railway.com
- Docker — referencia de Dockerfile: https://docs.docker.com/reference/dockerfile/
- Spatie Laravel-Permission: https://spatie.be/docs/laravel-permission/v6
- Spatie Laravel-ActivityLog: https://spatie.be/docs/laravel-activitylog/v4
- barryvdh/laravel-dompdf: https://github.com/barryvdh/laravel-dompdf
- Vitest — documentación: https://vitest.dev/guide/
- Testing Library — React: https://testing-library.com/docs/react-testing-library/intro/
