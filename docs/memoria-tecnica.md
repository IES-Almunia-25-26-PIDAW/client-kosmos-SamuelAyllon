# MEMORIA TÉCNICA — PROYECTO FINAL DAM
## ClientKosmos: Plataforma de Gestión de Consulta para Profesionales Autónomos de la Salud
### Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Multiplataforma

---

> **Nota de generación:** Este documento está basado en inspección directa del código fuente del repositorio. Todas las rutas de archivo citadas son verificables. El alumno debe revisar y completar las secciones marcadas con `[COMPLETAR]` con información personal (empresa de prácticas, tutor, fechas, etc.).

---

## PORTADA (sugerida)

| Campo | Valor |
|-------|-------|
| **Nombre del proyecto** | ClientKosmos |
| **Autor** | Samuel Ayllón Sevilla |
| **Centro educativo** | [COMPLETAR] |
| **Tutor/a del centro** | [COMPLETAR] |
| **Tutor/a empresa** | [COMPLETAR] |
| **Curso académico** | 2025–2026 |
| **Fecha de presentación** | [COMPLETAR] |

---

## ÍNDICE DE CONTENIDOS

1. [Introducción y Justificación](#1-introducción-y-justificación)
2. [Análisis de Requisitos](#2-análisis-de-requisitos)
   - 2.1 Identificación del problema
   - 2.2 Requisitos Funcionales
   - 2.3 Requisitos No Funcionales
3. [Diseño y Arquitectura del Sistema](#3-diseño-y-arquitectura-del-sistema)
   - 3.1 Justificación del Stack Tecnológico
   - 3.2 Patrón de Arquitectura
   - 3.3 Modelo de Datos
4. [Desarrollo Técnico](#4-desarrollo-técnico)
   - 4.1 Puntos Críticos de Implementación
   - 4.2 Seguridad y Cumplimiento RGPD
   - 4.3 Testing y Calidad
5. [Manual de Instalación y Despliegue](#5-manual-de-instalación-y-despliegue)
6. [Presupuesto Técnico](#6-presupuesto-técnico)
7. [Conclusiones](#7-conclusiones)
8. [Bibliografía y Referencias](#8-bibliografía-y-referencias)

---

## 1. INTRODUCCIÓN Y JUSTIFICACIÓN

### 1.1 Contexto del Proyecto

Los profesionales autónomos del sector salud —psicólogos, terapeutas, coaches— gestionan su práctica clínica mediante una combinación heterogénea de herramientas: agendas de papel o Google Calendar para citas, aplicaciones de mensajería para comunicarse con pacientes, hojas de cálculo para la facturación y documentos de texto para las notas clínicas. Esta fragmentación genera ineficiencias operativas, riesgos de privacidad y pérdida de trazabilidad clínica.

ClientKosmos surge como respuesta a esta necesidad: una plataforma web integral diseñada específicamente para profesionales autónomos de la salud que centraliza en un único entorno seguro toda la operativa de consulta: gestión de pacientes con historial clínico cifrado, programación de citas con videoconferencia, facturación con pasarela de pago, gestión documental y consentimientos RGPD, y un asistente de inteligencia artificial (Kosmo) que genera briefings diarios y asiste durante las sesiones.

### 1.2 Alcance del Proyecto Final

El presente Proyecto de Fin de Ciclo comprende el diseño, desarrollo y despliegue de ClientKosmos como aplicación web monolítica de arquitectura moderna (SPA server-side). El proyecto abarca:

- **Backend:** API interna Laravel 12 con autenticación multifactor, autorización granular por roles y cifrado en reposo de datos sensibles.
- **Frontend:** Interfaz de usuario React 19 con Inertia.js, componentes accesibles con Chakra UI v3 y generación automática de rutas tipadas (Wayfinder).
- **Integraciones externas:** Google Calendar/Google Meet (OAuth 2.0), Stripe (pagos en línea), Groq API (transcripción Whisper + generación de texto Llama 3.3 70B).
- **Testing:** Suite completa de tests backend (Pest 3) y frontend (Vitest 2 + Testing Library).

### 1.3 Motivación Personal

[COMPLETAR: Párrafo de 5–8 líneas explicando el interés personal del alumno en el dominio de la salud mental, la motivación para abordar este problema concreto, y los conocimientos del ciclo formativo aplicados.]

---

## 2. ANÁLISIS DE REQUISITOS

### 2.1 Identificación del Problema

El análisis previo al desarrollo identificó los siguientes *pain points* del público objetivo (profesionales autónomos de salud mental, 1–5 consultas simultáneas):

| Problema | Impacto |
|----------|---------|
| Gestión de citas en herramientas externas (Google Calendar, papel) sin sincronización con la ficha del paciente | Duplicidad de datos, riesgo de errores |
| Notas clínicas en ficheros locales no cifrados | Incumplimiento RGPD Art. 25 (privacidad por diseño) |
| Facturación manual en hojas de cálculo | Errores de cálculo, falta de trazabilidad fiscal |
| Consentimientos informados en papel | Imposibilidad de verificar firma y fecha con garantías |
| Sin herramienta de análisis de sesión | Pérdida de información valiosa para el seguimiento terapéutico |

### 2.2 Requisitos Funcionales

Los siguientes requisitos funcionales fueron capturados durante la fase de análisis y son trazables con las funcionalidades implementadas en el código fuente:

#### Módulo de Autenticación y Gestión de Usuarios

| ID | Descripción | Implementación |
|----|-------------|----------------|
| RF-01 | El sistema debe permitir el registro de nuevos usuarios con verificación de dirección de correo electrónico. | `app/Http/Controllers/Auth/` + Fortify email verification |
| RF-02 | El sistema debe ofrecer autenticación de dos factores (2FA) mediante TOTP. | `app/Http/Controllers/Settings/TwoFactorAction.php`; Fortify 2FA |
| RF-03 | El sistema debe gestionar tres roles diferenciados: `admin`, `professional` y `patient`, con acceso restrictivo a cada área. | Spatie Permission + `EnsureProfessional`, `EnsureAdmin` middleware |
| RF-04 | Los usuarios deben poder restablecer su contraseña mediante un enlace temporal enviado por correo. | Fortify `ResetPasswordAction` |

#### Módulo de Pacientes

| ID | Descripción | Implementación |
|----|-------------|----------------|
| RF-05 | El profesional debe poder crear, editar, consultar y dar de baja fichas de pacientes. | `app/Http/Controllers/Patient/{IndexAction, StoreAction, ShowAction, UpdateAction, DestroyAction}` |
| RF-06 | La ficha del paciente debe almacenar notas clínicas, diagnóstico y plan de tratamiento con cifrado en reposo. | Modelo `PatientProfile`; columnas `clinical_notes`, `diagnosis`, `treatment_plan` con cast `encrypted` |
| RF-07 | El profesional debe poder invitar a un paciente para que acceda al portal con su propia cuenta. | `app/Http/Controllers/Patient/InviteAction` |
| RF-08 | En equipos de profesionales, un paciente puede ser compartido entre compañeros de workspace. | `app/Http/Controllers/Workspace/Patient/{ShareAction, UnshareAction}`; tabla `case_assignments` |

#### Módulo de Citas y Videoconferencia

| ID | Descripción | Implementación |
|----|-------------|----------------|
| RF-09 | El profesional debe poder crear citas con modalidad presencial o videollamada, vinculadas a un servicio y a un paciente. | `app/Http/Controllers/Appointment/StoreAction`; tabla `appointments` con `modality ENUM('in_person','video_call')` |
| RF-10 | Las citas de modalidad videollamada deben generar automáticamente un evento en Google Calendar con enlace Google Meet. | `app/Services/GoogleCalendarService::createMeetEvent()` |
| RF-11 | El paciente debe poder confirmar, cancelar o solicitar citas desde el portal de paciente. | `app/Http/Controllers/Portal/Appointment/{ConfirmAction, CancelAction, BookAction}` |
| RF-12 | El sistema debe gestionar una sala de espera virtual para citas de videollamada. | `app/Http/Controllers/Appointment/JoinWaitingRoomAction`; página `resources/js/pages/call/waiting-room.tsx` |
| RF-13 | El profesional debe poder iniciar y finalizar una llamada desde la aplicación. | `StartCallAction`, `EndCallAction` |

#### Módulo de Transcripción e IA

| ID | Descripción | Implementación |
|----|-------------|----------------|
| RF-14 | El sistema debe poder grabar el audio de la sesión (con consentimiento previo del paciente) y transcribirlo en tiempo real. | Hook `useProfessionalTabRecorder`; `TranscribeAction`; `TranscribeChunkJob` → Groq Whisper |
| RF-15 | El asistente Kosmo debe generar un resumen estructurado de la sesión al finalizar la llamada. | `SummarizeSessionJob`; Groq Llama 3.3 70B |
| RF-16 | El asistente Kosmo debe generar un briefing diario para el profesional con el resumen de las citas del día. | `app/Http/Controllers/Kosmo/IndexAction`; tabla `kosmo_briefings` |

#### Módulo de Facturación

| ID | Descripción | Implementación |
|----|-------------|----------------|
| RF-17 | El sistema debe generar automáticamente una factura borrador al completar una cita. | Observer/Listener `AutoGenerateInvoiceOnCompletion` |
| RF-18 | El profesional debe poder editar, enviar al paciente y exportar facturas en PDF. | `Invoice/{EditAction, SendAction, ExportPdfAction}` |
| RF-19 | El sistema debe admitir pago en línea de facturas mediante Stripe Checkout. | `Invoice/CreateCheckoutAction`; `Webhook/StripeWebhookAction` |

#### Módulo de Consentimientos y Documentos RGPD

| ID | Descripción | Implementación |
|----|-------------|----------------|
| RF-20 | El sistema debe recoger y almacenar consentimientos informados firmados digitalmente con fecha, IP y firma. | Modelo `ConsentForm`; columnas `signed_at`, `signed_ip`, `content_snapshot` |
| RF-21 | El profesional debe poder gestionar documentos adjuntos por paciente. | `Document/{StoreAction, DestroyAction}`; tabla `documents` con `storage_path` |
| RF-22 | El paciente debe consentir explícitamente la grabación antes de que comience la transcripción. | `RecordingConsentAction`; validación en `TranscribeAction` |

#### Módulo de Workspace y Colaboración

| ID | Descripción | Implementación |
|----|-------------|----------------|
| RF-23 | El sistema debe soportar multi-workspace para equipos de profesionales. | Tabla `workspaces`; relación M2M `user_workspace` |
| RF-24 | El administrador del workspace debe poder invitar miembros y gestionar sus permisos. | `Workspace/Team/{InviteAction, UpdatePermissionsAction}` |
| RF-25 | El sistema debe proporcionar métricas de negocio (ingresos, citas, pacientes) al nivel de workspace. | `Workspace/AnalyticsIndexAction`; `Dashboard/IndexAction` |

### 2.3 Requisitos No Funcionales

#### Seguridad

| ID | Descripción |
|----|-------------|
| RNF-S01 | Toda la comunicación entre cliente y servidor se realiza sobre HTTPS/TLS 1.3. |
| RNF-S02 | Los datos clínicos sensibles (notas, diagnósticos, tokens OAuth) se almacenan cifrados mediante AES-256-CBC (cast `encrypted` de Laravel). |
| RNF-S03 | Protección CSRF en todos los endpoints mutantes (POST, PUT, DELETE) mediante token de sincronización. |
| RNF-S04 | Limitación de tasa (*rate limiting*) en endpoints de autenticación: máximo 60 intentos por minuto. |
| RNF-S05 | Auditoría de acceso a transcripciones clínicas (middleware `LogTranscriptionAccess`). |
| RNF-S06 | Validación de parámetro `state` con comparación en tiempo constante (`hash_equals`) en el flujo OAuth. |

#### Usabilidad y Accesibilidad

| ID | Descripción |
|----|-------------|
| RNF-U01 | La interfaz debe ser accesible conforme a WCAG 2.2 nivel AA (ADR-0001). |
| RNF-U02 | El sistema debe ser responsive y funcional en dispositivos de escritorio y tablet (breakpoints Chakra UI). |
| RNF-U03 | Los componentes de UI deben seguir los patrones de Chakra UI v3 con tokens semánticos para garantizar coherencia visual. |
| RNF-U04 | El tiempo de carga inicial de la SPA no debe superar 3 segundos en conexión de 10 Mbps. |

#### Rendimiento y Disponibilidad

| ID | Descripción |
|----|-------------|
| RNF-P01 | Las operaciones de transcripción y generación de IA se procesan en cola asíncrona (Laravel Queue) para no bloquear el hilo HTTP. |
| RNF-P02 | Las consultas a la base de datos incluyen *eager loading* para prevenir el problema N+1. |
| RNF-P03 | El bundler Vite 7 con tree-shaking garantiza que el bundle de producción excluye código no utilizado. |

#### Mantenibilidad

| ID | Descripción |
|----|-------------|
| RNF-M01 | Cada funcionalidad debe ir acompañada de al menos un test de caracterización (Pest 3 / Vitest). |
| RNF-M02 | Las decisiones arquitectónicas de impacto se documentan como ADR en `docs/decision-log.md`. |
| RNF-M03 | Las rutas TypeScript se generan automáticamente desde las rutas Laravel mediante Wayfinder (no hay strings hardcodeados). |

---

## 3. DISEÑO Y ARQUITECTURA DEL SISTEMA

### 3.1 Justificación del Stack Tecnológico

#### Backend

**PHP 8.4 + Laravel Framework 12.0**
Laravel es el framework PHP de mayor adopción en el mercado español de desarrollo web. Su sistema de ORM (Eloquent), la gestión de colas, el sistema de políticas de autorización y el ecosistema de paquetes (Fortify, Wayfinder, Spatie) permitían implementar funcionalidades complejas como autenticación multifactor, autorización granular y procesamiento asíncrono sin reinventar la rueda. La elección de PHP 8.4 proporciona tipado estricto, *readonly properties*, *enums nativos* y mejoras de rendimiento JIT respecto a versiones anteriores.

**Laravel Inertia.js 2.3 (puente monolítico)**
En lugar de construir una API REST separada consumida por el frontend, Inertia.js actúa como adaptador entre el router de Laravel y los componentes React. Esto elimina la complejidad del manejo de tokens JWT, permite compartir la lógica de autorización del servidor directamente con las páginas del cliente, y reduce a cero la latencia de la capa de serialización/deserialización JSON para operaciones internas. La decisión es deliberada: ClientKosmos no necesita una API pública consumida por terceros en su alcance actual.

**Laravel Fortify 1.30**
Fortify proporciona la infraestructura de autenticación sin *scaffolding* de vistas, lo que permite total control sobre la UI. Gestiona el ciclo completo: registro con verificación de email, login con protección contra fuerza bruta, 2FA TOTP, reset de contraseña y cierre de sesión. Al usar Fortify sobre una implementación custom se garantizan las mejores prácticas de seguridad sin mantener código de autenticación propio.

**Laravel Wayfinder 0.19**
Wayfinder genera automáticamente ficheros TypeScript con las URL y parámetros de cada ruta y acción del backend. Esto elimina los *strings* de URL hardcodeados en el frontend y asegura que un cambio de nombre de ruta en PHP se refleja como error de tipo en TypeScript antes de llegar a producción.

**Spatie Permission 7.2**
Librería estándar de facto para gestión de roles y permisos en Laravel. Permite asignar roles (`admin`, `professional`, `patient`) y verificar permisos en controladores, políticas y middleware con una API expresiva.

**Integración IA: Groq API + OpenAI PHP Client 0.19**
La API de Groq expone los modelos de Llama 3.3 70B y Whisper large-v3-turbo con una interfaz compatible con la especificación OpenAI, lo que permite usar el SDK PHP de OpenAI sin modificaciones. La elección de Groq sobre OpenAI se justifica por la latencia de inferencia (Groq LPU ~10× más rápido para transcripción en tiempo real) y el coste por token inferior para el volumen de uso esperado.

**Google API Client 2.19**
Manejo del flujo OAuth 2.0 para integración con Google Calendar y Google Meet. Permite la creación programática de eventos con sala de videoconferencia embebida, eliminando la necesidad de infraestructura de video propia.

**Stripe PHP 20.1**
Pasarela de pago estándar del mercado. Se utiliza el flujo *Checkout Session* (hosted payment page) para reducir el alcance PCI DSS del sistema: los datos de tarjeta nunca transitan por los servidores de ClientKosmos.

#### Frontend

**React 19.2 + TypeScript 5.7**
React 19 con el nuevo compilador (React Compiler, babel plugin) elimina la necesidad de `useMemo`/`useCallback` manuales al gestionar automáticamente la memoización. TypeScript 5.7 añade tipado estricto en todo el árbol de componentes y hooks, detectando errores de integración frontend-backend en tiempo de compilación.

**Chakra UI v3.34 (único sistema de diseño)**
Chakra UI v3 proporciona componentes accesibles (WCAG 2.2 AA out-of-the-box), un sistema de tokens semánticos (`bg.subtle`, `fg.muted`, `brand.solid`) que soporta modo oscuro sin modificadores ad-hoc, y primitivos de composición (Factory `chakra()`) para extender estilos sin perder las garantías de accesibilidad. La migración desde Tailwind CSS + shadcn/ui a Chakra UI v3 fue una decisión arquitectónica documentada (ADR-0002) motivada por la eliminación de duplicidades de estilo y la mejora de consistencia visual.

**Vite 7.0.4**
Bundler de nueva generación con servidor de desarrollo HMR (Hot Module Replacement) instantáneo y build de producción optimizado con tree-shaking y *code splitting* automático. Reemplaza Webpack sin configuración manual de loaders.

**Vitest 2.1.9 + Testing Library 16**
Testing de componentes React en entorno jsdom, con sintaxis compatible con Jest. La integración con Vite permite ejecutar los tests sin bundling completo, reduciendo el tiempo de ejecución.

### 3.2 Patrón de Arquitectura

#### Arquitectura General: SPA Monolítica con Inertia.js

ClientKosmos sigue el patrón **Fullstack Monolith** mediante Inertia.js: Laravel gestiona el enrutamiento, la autenticación, la autorización y la capa de datos; React renderiza la interfaz como una SPA sin recargas de página. No existe una API REST separada para el frontend: Inertia serializa los datos del controlador como props del componente React y maneja la navegación mediante XHR con histórico del navegador.

```
Navegador (React SPA)
       │  fetch/XHR Inertia
       ▼
Laravel Router (routes/web.php)
       │
       ▼
Single-Action Controller (__invoke)
       │
       ├─► Form Request (validación)
       ├─► Policy (autorización)
       │
       ▼
Action / Service (lógica de negocio)
       │
       ▼
Eloquent ORM → Base de Datos (SQLite dev / MySQL prod)
       │
       ▼
Inertia::render('PageComponent', $props)
       │
       ▼
React Component (resources/js/pages/)
```

#### Backend: Single-Action Controllers + Actions

Cada endpoint tiene un controlador dedicado con un único método `__invoke`. Este patrón garantiza:
- **Testabilidad:** cada acción es una clase independiente que se puede instanciar y testear de forma aislada.
- **Legibilidad:** el nombre del archivo describe completamente la acción (`app/Http/Controllers/Appointment/StoreAction.php`).
- **Bajo acoplamiento:** no hay controladores "gordos" con múltiples responsabilidades.

Las operaciones de negocio reutilizables se extraen a **Actions** (`app/Actions/`) — objetos de un único método con inyección de dependencias — y **Services** (`app/Services/`) para integraciones externas con estado (Google Calendar, Stripe). La validación se centraliza en **Form Requests** (`app/Http/Requests/`) y la autorización en **Policies** (`app/Policies/`).

Ejemplo de flujo para "crear cita":
```
POST /appointments
    → StoreRequest (valida modalidad, fechas, paciente)
    → AppointmentPolicy::create() (profesional activo en workspace)
    → Appointment/StoreAction::__invoke()
        → CreateAppointment (Action: transacción, conflictos de horario)
        → GoogleCalendarService::createMeetEvent() (si video_call)
    → Inertia::render('appointment/show', $appointment)
```

#### Frontend: Composición de Componentes + Hooks + Wayfinder

El frontend sigue el patrón de **composición de componentes React** con separación de responsabilidades:

- **`pages/`**: componentes de página, reciben props de Inertia, orquestan el layout.
- **`components/`**: componentes reutilizables de UI y dominio.
- **`hooks/`**: lógica de estado y efectos reutilizable.
- **`actions/` y `routes/`**: generados automáticamente por Wayfinder desde el backend.
- **`lib/chakra-system.ts`**: tokens semánticos del design system.

Estado de formularios mediante `useForm` de Inertia.js (maneja errores de validación server-side). No se usa `useState` local cuando los datos provienen de props de servidor.

### 3.3 Modelo de Datos

#### Diagrama de Entidades Principales

```
┌─────────────────┐        ┌─────────────────────┐
│      users      │        │      workspaces      │
├─────────────────┤        ├─────────────────────┤
│ id (PK)         │◄──M2M──│ id (PK)             │
│ name            │        │ creator_id (FK)      │
│ email           │        │ name                 │
│ google_refresh_ │        │ tax_id               │
│   token [enc]   │        │ location_address     │
│ stripe_customer │        │ type                 │
│ date_of_birth   │        └─────────────────────┘
└─────────────────┘
        │ 1
        │
        ├─────────────────────────┐
        ▼ N                       ▼ N
┌──────────────────────┐  ┌─────────────────────────┐
│   patient_profiles   │  │  professional_profiles  │
├──────────────────────┤  ├─────────────────────────┤
│ id (PK)              │  │ user_id (FK)             │
│ user_id (FK)         │  │ license_number           │
│ workspace_id (FK)    │  │ collegiate_number        │
│ professional_id (FK) │  │ specialties (JSON)       │
│ clinical_notes [enc] │  │ verification_status      │
│ diagnosis [enc]      │  │ verified_at              │
│ treatment_plan [enc] │  └─────────────────────────┘
│ status (ENUM)        │
│ is_active (bool)     │
└──────────────────────┘
        │ 1
        │
        ▼ N
┌─────────────────────────────────┐
│           appointments          │
├─────────────────────────────────┤
│ id (PK)                         │
│ workspace_id (FK)               │
│ patient_id (FK → users)         │
│ professional_id (FK → users)    │
│ service_id (FK → offered_cons.) │
│ starts_at, ends_at              │
│ status ENUM(pending|confirmed   │
│   |in_progress|completed|       │
│   cancelled|no_show)            │
│ modality ENUM(in_person|        │
│   video_call)                   │
│ meeting_url                     │
│ external_calendar_event_id      │
│ confirmed_at                    │
│ patient_joined_at               │
│ professional_joined_at          │
└─────────────────────────────────┘
        │ 1
        ├──────────────────────────────────┐
        ▼ 0..1                             ▼ N
┌──────────────────────────┐    ┌────────────────────────┐
│    session_recordings    │    │        invoices         │
├──────────────────────────┤    ├────────────────────────┤
│ id (PK)                  │    │ id (PK)                 │
│ appointment_id (FK)      │    │ workspace_id (FK)       │
│ storage_path             │    │ patient_id (FK)         │
│ duration_seconds         │    │ professional_id (FK)    │
│ transcription [enc]      │    │ invoice_number          │
│ patient_consent_status   │    │ status ENUM(draft|      │
│ patient_consent_given_at │    │   pending|paid|overdue  │
└──────────────────────────┘    │   |failed|refunded)     │
        │ 1                     │ subtotal, tax, total     │
        ▼ N                     │ stripe_checkout_session  │
┌───────────────────────┐       └────────────────────────┘
│ transcription_segments│
├───────────────────────┤
│ session_recording_id  │
│ speaker_user_id (FK)  │
│ position              │
│ started_at_ms         │
│ text                  │
└───────────────────────┘
```

#### Descripción de Entidades

| Entidad | Propósito | Notas de diseño |
|---------|-----------|-----------------|
| `users` | Identidad unificada para todos los roles | `google_refresh_token` cifrado; polimorfismo de rol via Spatie |
| `workspaces` | Unidad organizativa (clínica u oficina virtual) | `location_address NULL` indica workspace online-only |
| `patient_profiles` | Ficha clínica del paciente | Columnas sensibles con cast `encrypted` (AES-256-CBC) |
| `professional_profiles` | Credenciales y verificación del profesional | `verification_status` controlado por admin |
| `appointments` | Cita entre paciente y profesional | ENUM `status` con estados de ciclo de vida completo |
| `offered_consultations` | Catálogo de servicios del profesional | Precio, duración y modalidad por servicio |
| `session_recordings` | Metadatos y transcripción de la sesión | Audio efímero; `transcription` cifrada en BD |
| `transcription_segments` | Fragmentos indexados de la transcripción | Permite búsqueda temporal y atribución de hablante |
| `invoices` | Factura emitida | Integración Stripe via `stripe_checkout_session_id` |
| `invoice_items` | Líneas de factura | Relación opcional con `appointment_id` |
| `consent_forms` | Consentimientos RGPD firmados digitalmente | `content_snapshot` preserva literalidad del texto consentido |
| `case_assignments` | Asignación paciente-profesional en workspace | `is_primary` identifica al profesional responsable |
| `kosmo_briefings` | Resúmenes diarios generados por IA | Generados por `SummarizeSessionJob` |
| `notifications` | Notificaciones in-app | Marcado de lectura via `MarkReadAction` |

---

## 4. DESARROLLO TÉCNICO

### 4.1 Puntos Críticos de Implementación

#### 4.1.1 Integración con Google Calendar y Google Meet (ADR-0023)

**Descripción del problema**
Las citas de modalidad videollamada requieren un mecanismo de videoconferencia sin infraestructura propia. La integración con Google Calendar proporciona simultáneamente la sala de reunión (Google Meet) y la sincronización con la agenda del profesional.

**Flujo OAuth 2.0 implementado**

La integración implementa el flujo *Authorization Code* de OAuth 2.0 con los siguientes pasos:

1. **Generación del State CSRF:** `Settings/Google/RedirectAction` genera una cadena aleatoria de 40 caracteres con `Str::random(40)` y la almacena en la sesión del servidor.

2. **Redirección a Google:** `GoogleCalendarService::getAuthorizationUrl($state)` construye la URL de autorización con el scope `https://www.googleapis.com/auth/calendar.events` y el parámetro `access_type=offline`.

3. **Callback y validación:** `Settings/Google/CallbackAction` recibe el código de autorización y valida el state mediante `hash_equals()` (comparación en tiempo constante para prevenir ataques de timing).

4. **Intercambio de código:** `GoogleCalendarService::exchangeCode($code)` solicita al servidor de tokens de Google el par `access_token` + `refresh_token`. El `refresh_token` se almacena cifrado en `users.google_refresh_token`.

5. **Revocación:** `GoogleCalendarService::revoke($refreshToken)` llama al endpoint de revocación de Google y borra el token local.

**Decisión de diseño:** Se eligió delegar el video al ecosistema Google en lugar de integrar WebRTC propio (Twilio, Jitsi embebido) por tres razones: (1) elimina coste de infraestructura de servidores TURN/STUN, (2) los profesionales ya tienen Google Workspace, (3) el tiempo de implementación es compatible con el alcance del TFC.

---

#### 4.1.2 Grabación de Audio y Transcripción en Tiempo Real (ADR-0022)

**Descripción del problema**
Los psicólogos y terapeutas necesitan notas de sesión estructuradas. La transcripción manual es costosa en tiempo. La solución implementada graba el audio del micrófono del profesional en el navegador y lo transcribe progresivamente mediante la API de Groq (modelo Whisper large-v3-turbo).

**Consentimiento previo y cumplimiento RGPD**
Antes de habilitar la grabación, `Portal/Appointment/RecordingConsentAction` registra en `session_recordings.patient_consent_given_at` la fecha, hora e IP desde la que el paciente firmó el consentimiento. El `TranscribeAction` verifica la existencia de este campo antes de aceptar chunks de audio.

**Captura de audio en el navegador**
El hook `useProfessionalTabRecorder` gestiona el ciclo de vida de la grabación:

```typescript
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
const recorder = new MediaRecorder(stream, {
    mimeType: 'audio/webm;codecs=opus',
});
recorder.ondataavailable = async (event) => {
    if (event.data.size > 0) {
        const formData = new FormData();
        formData.append('audio_chunk', event.data, 'chunk.webm');
        await axios.post(route.transcribe(appointmentId), formData);
    }
};
recorder.start(8000); // chunk cada 8 segundos
```

**Pipeline de transcripción asíncrona**

```
Navegador → POST /appointments/{id}/transcribe (chunk WebM)
    → TranscribeAction: valida consentimiento, persiste chunk
    → Despacha TranscribeChunkJob en cola
    → TranscribeChunkJob:
        → POST Groq API (modelo Whisper large-v3-turbo)
        → Persiste TranscriptionSegment
        → Borra chunk de disco (minimización RGPD)
    → AggregateTranscription listener:
        → Reescribe transcripción concatenando segmentos
```

**Generación de resumen con IA**
Al finalizar la llamada, `SummarizeAction` despacha `SummarizeSessionJob`. Este job:
1. Recupera `session_recordings.transcription` (desencriptada en memoria).
2. Construye un prompt estructurado con instrucciones de rol.
3. Llama a Groq Llama 3.3 70B.
4. Persiste el resultado en `kosmo_briefings`.

---

#### 4.1.3 Autorización Granular por Roles y Ownership

**Problema:** En un sistema multi-workspace y multi-rol, garantizar que cada usuario solo accede a los recursos que le corresponden es crítico tanto para la seguridad como para el cumplimiento RGPD.

**Solución implementada:**

1. **Middleware de rol:** `EnsureProfessional` y `EnsureAdmin` verifican el rol Spatie y redirigen a la ruta apropiada.

2. **Policies de ownership:** `PatientPolicy::view()` combina tres condiciones OR: (a) el usuario es admin, (b) el usuario es el propio paciente, (c) el usuario tiene un `CaseAssignment` activo como profesional del paciente en el workspace actual.

3. **Cifrado en reposo:** Datos especialmente sensibles (`clinical_notes`, `diagnosis`, `transcription`, `google_refresh_token`) usan el cast `encrypted` de Laravel.

### 4.2 Seguridad y Cumplimiento RGPD

ClientKosmos fue diseñado desde el inicio con los principios del RGPD (Reglamento UE 2016/679):

- **Minimización de datos (Art. 5.1.c):** Los chunks de audio se borran de disco tras ser transcritos. Solo persiste el texto de la transcripción.
- **Privacidad por diseño (Art. 25):** Las columnas de notas clínicas están cifradas en la capa de aplicación.
- **Consentimiento explícito (Art. 6.1.a):** El consentimiento de grabación es una acción positiva registrada con timestamp e IP.
- **Trazabilidad:** El middleware `LogTranscriptionAccess` registra en la tabla `activity_log` cada acceso a datos de transcripción.
- **Derecho al olvido (Art. 17):** El `DestroyAction` de paciente implementa borrado en cascada de notas, documentos, grabaciones y segmentos de transcripción.

### 4.3 Testing y Calidad

**Estrategia de testing:**

| Capa | Framework | Tipo | Archivos | Tests aprox. |
|------|-----------|------|----------|--------------|
| Backend | Pest 3.8 | Feature + Unit | 58 | ~160 |
| Frontend | Vitest 2.1.9 + RTL | Component + Hook | 4+ | 18+ |

**Gate de calidad pre-despliegue:**

```bash
vendor/bin/pint --dirty --format agent   # Linting PHP (PSR-12)
php artisan test --compact               # Suite Pest (backend)
npm run lint                             # ESLint 9
npm run types                            # tsc --noEmit
npm run test                             # Vitest (frontend)
npm run build                            # Bundle Vite
```

---

## 5. MANUAL DE INSTALACIÓN Y DESPLIEGUE

### 5.1 Prerrequisitos

| Herramienta | Versión mínima | Propósito |
|-------------|---------------|-----------|
| PHP | 8.4 | Runtime backend |
| Composer | 2.7 | Gestor de dependencias PHP |
| Node.js | 22 LTS | Toolchain frontend |
| npm | 10 | Gestor de paquetes JS |
| Git | 2.40 | Control de versiones |
| SQLite (dev) | 3.40 | Base de datos local |

### 5.2 Instalación en Entorno de Desarrollo

**Paso 1: Clonar el repositorio**
```bash
git clone https://github.com/[usuario]/client-kosmos.git
cd client-kosmos
```

**Paso 2: Instalar dependencias PHP**
```bash
composer install
```

**Paso 3: Instalar dependencias JavaScript**
```bash
npm install
```

**Paso 4: Configurar variables de entorno**
```bash
cp .env.example .env
php artisan key:generate
```

**Paso 5: Crear la base de datos SQLite**
```bash
touch database/database.sqlite
```

**Paso 6: Ejecutar migraciones y seeders**
```bash
php artisan migrate --seed
```

**Paso 7: Generar rutas tipadas (Wayfinder)**
```bash
php artisan wayfinder:generate
```

**Paso 8: Compilar assets frontend**

En desarrollo (con HMR):
```bash
npm run dev
```

En producción:
```bash
npm run build
```

**Paso 9: Iniciar el servidor de desarrollo**
```bash
php artisan serve
```

**Paso 10 (Opcional): Iniciar worker de colas**

Necesario para transcripción y resúmenes con IA:
```bash
php artisan queue:work
```

### 5.3 Despliegue en Producción

[COMPLETAR: Describir el entorno de producción real utilizado durante el TFC — Fly.io, Railway, VPS, etc. — con los pasos específicos de despliegue.]

---

## 6. PRESUPUESTO TÉCNICO

### 6.1 Costes de Desarrollo

| Fase | Descripción | Horas (junior) | Coste/hora | Total |
|------|-------------|---------------|------------|-------|
| Análisis de requisitos | Entrevistas, modelado de dominio | 24 h | 20 €/h | 480 € |
| Diseño de arquitectura | Patrón, stack, ADRs, wireframes | 16 h | 20 €/h | 320 € |
| Backend — Auth y roles | Fortify, Spatie Permission | 20 h | 20 €/h | 400 € |
| Backend — Pacientes y citas | CRUD, policies | 40 h | 20 €/h | 800 € |
| Backend — Google Calendar/Meet | OAuth, integración | 24 h | 20 €/h | 480 € |
| Backend — Transcripción e IA | Whisper, Llama, Kosmo | 40 h | 20 €/h | 800 € |
| Backend — Facturación Stripe | Checkout, webhooks, PDF | 24 h | 20 €/h | 480 € |
| Backend — RGPD y seguridad | Cifrado, consentimientos | 20 h | 20 €/h | 400 € |
| Frontend — Design System | Chakra UI v3 | 32 h | 20 €/h | 640 € |
| Frontend — Páginas y componentes | Citas, pacientes, portal | 48 h | 20 €/h | 960 € |
| Testing | Pest, Vitest | 32 h | 20 €/h | 640 € |
| Documentación y memoria | ADRs, Memoria Técnica | 16 h | 20 €/h | 320 € |
| **TOTAL DESARROLLO** | | **336 h** | | **6.720 €** |

### 6.2 Costes de Licencias

| Concepto | Modelo de precios | Coste estimado (año 1) |
|----------|-------------------|----------------------|
| PHP / Laravel / React / Chakra | Open Source (MIT) | 0 € |
| Groq API — transcripción | $0.04 / hora de audio | ~15 € |
| Groq API — Llama 3.3 70B | $0.59 / M tokens | ~8 € |
| Google API | Gratuito hasta 1M calls/mes | 0 € |
| Stripe | 1,4% + 0,25 € / transacción | Variable |
| Dominio | Registro anual | ~12 € |
| **TOTAL LICENCIAS** | | **~35 € + % Stripe** |

### 6.3 Costes de Infraestructura

| Servicio | Proveedor | Plan | Coste anual |
|---------|-----------|------|------------|
| Servidor (PHP + Node) | Railway / Fly.io | Starter | 60 € |
| Base de datos | PlanetScale / TiDB Cloud | Free | 0 € |
| Almacenamiento | Backblaze B2 | 10 GB | ~0,72 € |
| CDN | Cloudflare | Free | 0 € |
| SSL/TLS | Let's Encrypt | Gratuito | 0 € |
| **TOTAL INFRAESTRUCTURA** | | | **~61 €/año** |

### 6.4 Resumen Económico

| Concepto | Total |
|----------|-------|
| Desarrollo | 6.720 € |
| Licencias (año 1) | ~35 € |
| Infraestructura (año 1) | ~61 € |
| Amortización hardware (año 1) | 273 € |
| **TOTAL PROYECTO (año 1)** | **~7.089 €** |

---

## 7. CONCLUSIONES

### 7.1 Logros Técnicos

Durante el desarrollo de ClientKosmos se han implementado con éxito los siguientes hitos técnicos de especial relevancia:

- **Arquitectura full-stack monolítica moderna:** la combinación Laravel 12 + Inertia.js + React 19 demuestra que es posible construir una SPA con experiencia de usuario fluida sin las complejidades operativas de una arquitectura de microservicios o API REST separada.
- **Integración OAuth 2.0 con estado CSRF:** el flujo de conexión con Google Calendar siguiendo la especificación RFC 6749 con protección anti-CSRF.
- **Pipeline de transcripción asíncrona:** la arquitectura de captura de audio en el cliente, chunking, procesamiento en cola y persistencia segura.
- **Cumplimiento RGPD por diseño:** cifrado en reposo, minimización de datos y consentimientos explícitos como requisitos de primera clase.

### 7.2 Dificultades y Lecciones Aprendidas

[COMPLETAR: 3–5 párrafos describiendo los problemas técnicos más difíciles encontrados durante el desarrollo, las decisiones que resultaron incorrectas y tuvieron que revertirse, y lo que el alumno haría diferente si empezara de nuevo.]

### 7.3 Trabajo Futuro

- Sincronización bidireccional completa con Google Calendar.
- Implementación de WebRTC embebido como alternativa a Google Meet.
- Dashboard de analíticas avanzadas con visualización de tendencias clínicas.
- Aplicación móvil nativa (React Native).
- Módulo de terapia grupal con salas de videollamada multi-participante.

---

## 8. BIBLIOGRAFÍA Y REFERENCIAS

### Documentación oficial

- Laravel Documentation (v12): https://laravel.com/docs/12.x
- Inertia.js Documentation: https://inertiajs.com
- React Documentation (v19): https://react.dev
- Chakra UI v3 Documentation: https://www.chakra-ui.com/docs/get-started/installation
- Groq API Documentation: https://console.groq.com/docs/openai
- Google Calendar API Reference: https://developers.google.com/calendar/api/v3/reference
- Stripe API Documentation: https://stripe.com/docs/api
- Pest PHP Testing Documentation: https://pestphp.com/docs/installation

### Estándares y Normativa

- RGPD (Reglamento UE 2016/679): https://gdpr-info.eu
- WCAG 2.2 Guidelines: https://www.w3.org/TR/WCAG22/
- OAuth 2.0 Authorization Framework (RFC 6749): https://datatracker.ietf.org/doc/html/rfc6749
- OWASP Top 10 (2021): https://owasp.org/Top10/

### Libros de Referencia

- Martin Fowler, *Patterns of Enterprise Application Architecture*, Addison-Wesley, 2002.
- Robert C. Martin, *Clean Architecture*, Prentice Hall, 2017.
- Adam Wathan, *Refactoring to Collections*, Automattic, 2016.

### Decisiones Arquitectónicas del Proyecto (ADRs)

Todas las decisiones técnicas de impacto están documentadas en `docs/decision-log.md`:

| ADR | Título | Fecha |
|-----|--------|-------|
| ADR-0001 | Adopción de estándares Kosmos Excellence | 2026-04-20 |
| ADR-0002 | Migración UI a Chakra UI v3 | 2026-04-20 |
| ADR-0003 | `type="submit"` obligatorio en Chakra Button | 2026-04-20 |
| ADR-0022 | Vitest + RTL para testing frontend | 2026-05-02 |
| ADR-0023 | Google Calendar OAuth con validación state CSRF | 2026-05-04 |

---

*Fin de la Memoria Técnica — ClientKosmos — TFC DAM 2025–2026*
