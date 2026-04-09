# Información del Proyecto — ClientKosmos

> Estado actual, contexto académico y visión general del proyecto ClientKosmos.

---

## Tabla de Contenidos

1. [Datos del proyecto](#1-datos-del-proyecto)
2. [Descripción general](#2-descripción-general)
3. [Estado actual](#3-estado-actual)
4. [Stack tecnológico completo](#4-stack-tecnológico-completo)
5. [Estructura del proyecto](#5-estructura-del-proyecto)
6. [Roles y accesos](#6-roles-y-accesos)
7. [Rutas de la aplicación](#7-rutas-de-la-aplicación)
8. [Variables de entorno](#8-variables-de-entorno)
9. [Historial de desarrollo](#9-historial-de-desarrollo)
10. [Dependencias principales](#10-dependencias-principales)

---

## 1. Datos del proyecto

| Campo | Valor |
|-------|-------|
| **Nombre** | ClientKosmos |
| **Tipo** | Aplicación web SaaS multitenant |
| **Dominio** | Gestión de consulta profesional (salud y bienestar) |
| **Autor** | Samuel Ayllón |
| **Contexto** | Proyecto Intermodular 2º DAM |
| **Fecha** | Abril 2026 |
| **Licencia** | MIT |
| **Repositorio Docker** | `samue45/client-kosmos` (Docker Hub) |

---

## 2. Descripción general

**ClientKosmos** es una plataforma web de gestión de consulta para profesionales autónomos de servicios (psicólogos, coaches, terapeutas, asesores). Permite centralizar toda la operativa de la consulta en una única herramienta:

- **Ficha de pacientes** con historial completo
- **Módulos anidados** por paciente: notas, acuerdos, pagos, documentos, consentimientos RGPD
- **Facturación** consolidada con estadísticas
- **Kosmo IA** — asistente inteligente con briefings diarios y chat contextual
- **Panel de administración** para gestión de usuarios del sistema

### Usuario objetivo

Profesionales autónomos o en pequeñas consultas que necesitan:
1. Gestionar su cartera de pacientes sin papel
2. Cumplir con obligaciones legales (RGPD, consentimiento informado)
3. Controlar sus ingresos sin una contabilidad compleja
4. Preparar sesiones con contexto actualizado

---

## 3. Estado actual

### Funcionalidades implementadas ✅

| Módulo | Estado | Observaciones |
|--------|--------|---------------|
| Autenticación completa | ✅ | Login, registro, verificación email, reset password, 2FA |
| Gestión de pacientes | ✅ | CRUD completo, pre/post sesión |
| Notas de sesión | ✅ | CRUD anidado bajo paciente |
| Acuerdos | ✅ | CRUD anidado bajo paciente |
| Pagos | ✅ | CRUD con estados (pendiente/pagado/vencido) |
| Documentos | ✅ | Subida y eliminación de archivos |
| Formularios de consentimiento | ✅ | CRUD con estado (pendiente/activo/revocado) |
| Facturación | ✅ | Vista consolidada con estadísticas y filtros |
| Kosmo IA | ✅ | Briefings diarios + chat contextual (Groq/Llama) |
| Ajustes de consulta | ✅ | Datos de práctica, fiscales y RGPD |
| Panel de administración | ✅ | Gestión completa de usuarios |
| Onboarding | ✅ | Tutorial de configuración inicial |
| Autenticación 2FA | ✅ | TOTP con códigos de recuperación |
| Modo oscuro / claro | ✅ | Con persistencia en cookie |
| Docker (desarrollo) | ✅ | Compose con MySQL + Mailpit |
| Docker (producción) | ✅ | Imagen publicada en Docker Hub |
| Tests automatizados | ✅ | 97 tests, 487 aserciones |

### Funcionalidades pendientes / roadmap 🔮

| Funcionalidad | Prioridad | Nota |
|---------------|-----------|------|
| Generación de facturas en PDF | Media | Requiere librería de PDF (dompdf o similar) |
| Calendario / agenda de citas | Alta | Integración con Google Calendar o vista propia |
| Firma digital de documentos | Media | Integración con servicio de firma electrónica |
| Exportación de datos del paciente | Alta | Cumplimiento RGPD (derecho de portabilidad) |
| App móvil (PWA) | Baja | ServiceWorker + instalación en móvil |
| Recordatorios automáticos por email | Media | Queue + notificaciones programadas |

---

## 4. Stack tecnológico completo

### Backend

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| PHP | 8.4+ | Lenguaje de backend |
| Laravel | 12 | Framework principal |
| Laravel Fortify | 1.x | Autenticación (login, registro, 2FA, verificación email) |
| Spatie Laravel Permission | 7.2 | Roles y permisos (admin, professional) |
| openai-php/client | 0.19 | Cliente SDK para la API de Groq (compatible OpenAI) |
| Laravel Wayfinder | 0.1.9 | Generación de rutas tipadas para TypeScript |
| Pest | 3.x | Framework de testing |
| Laravel Pint | — | Formateador de código PHP |

### Frontend

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| React | 19 | Librería UI |
| TypeScript | 5.7 | Tipado estático |
| Inertia.js | 2.3 | Puente Laravel–React (SPA sin API REST) |
| Tailwind CSS | 4.0 | Estilos utility-first con design system propio |
| shadcn/ui | — | Componentes accesibles (Radix UI + Tailwind) |
| Vite | 7 | Bundler con React Compiler |
| Lucide React | 0.475 | Iconografía |

### Infraestructura

| Entorno | Base de datos | Descripción |
|---------|---------------|-------------|
| Desarrollo local | SQLite (archivo) | Cero configuración |
| Tests | SQLite in-memory | Rápido y aislado |
| Docker / producción | MySQL 8 (TiDB Cloud) | Alta disponibilidad, serverless |

### IA

| Servicio | Modelo | Uso |
|---------|--------|-----|
| Groq | Llama 3.3 70B Versatile | Briefings diarios + chat contextual (Kosmo) |

---

## 5. Estructura del proyecto

```
client-kosmos-SamuelAyllon/
│
├── app/
│   ├── Actions/
│   │   └── Fortify/
│   │       ├── CreateNewUser.php         ← Asigna rol 'professional' al registrar
│   │       └── UpdateUserPassword.php
│   ├── Http/
│   │   ├── Controllers/                  ← Patrón Single-Action (__invoke)
│   │   │   ├── Dashboard/
│   │   │   │   └── IndexAction.php
│   │   │   ├── Patient/
│   │   │   │   ├── IndexAction.php
│   │   │   │   ├── CreateAction.php
│   │   │   │   ├── StoreAction.php
│   │   │   │   ├── ShowAction.php
│   │   │   │   ├── EditAction.php
│   │   │   │   ├── UpdateAction.php
│   │   │   │   ├── DestroyAction.php
│   │   │   │   ├── PreSessionAction.php
│   │   │   │   └── PostSessionAction.php
│   │   │   ├── Note/           ← StoreAction, UpdateAction, DestroyAction
│   │   │   ├── Agreement/      ← StoreAction, UpdateAction, DestroyAction
│   │   │   ├── Payment/        ← StoreAction, UpdateAction, DestroyAction
│   │   │   ├── Document/       ← StoreAction, DestroyAction
│   │   │   ├── ConsentForm/    ← StoreAction, UpdateAction
│   │   │   ├── Billing/        ← IndexAction
│   │   │   ├── Kosmo/          ← IndexAction, ChatAction, MarkReadAction
│   │   │   ├── Onboarding/     ← IndexAction, StoreAction
│   │   │   ├── Settings/       ← IndexAction, UpdateAction
│   │   │   │   ├── Password/   ← EditAction, UpdateAction
│   │   │   │   ├── Profile/    ← EditAction, UpdateAction, DestroyAction
│   │   │   │   └── TwoFactorAuthentication/ ← ShowAction
│   │   │   ├── Admin/
│   │   │   │   └── Users/      ← IndexAction, ShowAction, CreateAction, StoreAction, UpdateRoleAction, DestroyAction
│   │   │   └── Auth/
│   │   │       └── Authenticate/ ← AuthenticateAction (post-login redirect por rol)
│   │   └── Middleware/
│   │       ├── EnsureAdmin.php
│   │       ├── EnsureProfessional.php
│   │       ├── HandleAppearance.php
│   │       └── HandleInertiaRequests.php
│   ├── Models/
│   │   ├── User.php              ← HasRoles, TwoFactorAuthenticatable, SoftDeletes
│   │   ├── Patient.php
│   │   ├── Note.php
│   │   ├── Agreement.php
│   │   ├── Payment.php
│   │   ├── Document.php
│   │   ├── ConsentForm.php
│   │   └── KosmoBriefing.php
│   ├── Policies/
│   │   └── PatientPolicy.php     ← Ownership: solo el propietario accede
│   └── Providers/
│       ├── AppServiceProvider.php ← Singleton OpenAI Client → Groq
│       └── FortifyServiceProvider.php
│
├── database/
│   ├── migrations/               ← 15+ migraciones
│   ├── seeders/
│   │   ├── DatabaseSeeder.php
│   │   ├── RoleSeeder.php        ← Crea roles 'admin' y 'professional'
│   │   └── UserSeeder.php        ← Usuarios demo
│   └── factories/
│       ├── UserFactory.php
│       ├── PatientFactory.php
│       └── PaymentFactory.php
│
├── resources/
│   └── js/
│       ├── pages/
│       │   ├── dashboard.tsx
│       │   ├── onboarding.tsx
│       │   ├── patients/
│       │   ├── billing.tsx
│       │   ├── kosmo/
│       │   ├── settings/
│       │   ├── admin/
│       │   └── auth/
│       ├── components/
│       │   └── ui/               ← shadcn/ui customizados
│       ├── layouts/
│       │   ├── app-layout.tsx    ← Layout con sidebar
│       │   └── auth-layout.tsx   ← Layout centrado
│       └── types/                ← Interfaces TypeScript de modelos
│
├── routes/
│   ├── web.php                   ← Rutas principales
│   └── settings.php              ← Rutas de configuración de cuenta
│
├── tests/
│   └── Feature/
│       ├── AdminControllerTest.php
│       ├── AuthControllerTest.php
│       ├── BillingControllerTest.php
│       ├── DashboardTest.php
│       ├── KosmoControllerTest.php
│       ├── PatientControllerTest.php
│       ├── SettingsControllerTest.php
│       └── Auth/
│           ├── AuthenticationTest.php
│           ├── EmailVerificationTest.php
│           ├── PasswordConfirmationTest.php
│           ├── PasswordResetTest.php
│           ├── RegistrationTest.php
│           ├── TwoFactorChallengeTest.php
│           └── VerificationNotificationTest.php
│
├── docs/
│   ├── clientkosmos-design-system.md
│   ├── user_manual.md
│   ├── justificate_implementation.md
│   └── proyect_information.md     ← Este archivo
│
├── deploy/
│   ├── docker-compose.yml         ← Compose para producción (imagen Docker Hub)
│   └── README.md                  ← Instrucciones de despliegue
│
├── Dockerfile                     ← Multi-stage build
├── docker-compose.yml             ← Compose para desarrollo local
├── docker-entrypoint.sh
├── phpunit.xml
├── composer.json
├── package.json
└── README.md
```

---

## 6. Roles y accesos

### Modelo de roles

La aplicación usa **Spatie Laravel Permission** para gestionar dos roles:

| Rol | Creación | Acceso |
|-----|----------|--------|
| `professional` | Al registrarse (automático) | Dashboard, pacientes, facturación, Kosmo, ajustes |
| `admin` | Asignado manualmente por otro admin | Panel de administración `/admin/*` |

### Flujo de autenticación

```
POST /login
    │
    ├── Sin rol asignado → Redirige a /login (sin acceso)
    │
    ├── Rol 'professional'
    │       ├── Sin tutorial completo → /onboarding
    │       └── Con tutorial → /dashboard
    │
    └── Rol 'admin' → /admin/users
```

### Separación de áreas

```
Middleware 'professional' (EnsureProfessional)
  → Redirige admins que intenten acceder a rutas de consulta

Middleware 'admin' (EnsureAdmin)
  → Redirige no-admins que intenten acceder a /admin/*
```

---

## 7. Rutas de la aplicación

### Públicas

```
GET  /          Bienvenida
GET  /login     Login
GET  /register  Registro
```

### Autenticadas con rol 'professional' — `/`

```
GET                  /dashboard
GET, POST            /onboarding
GET, POST, PUT, DEL  /patients
GET                  /patients/{patient}
GET                  /patients/{patient}/pre-session
GET                  /patients/{patient}/post-session
POST, PUT, DEL       /patients/{patient}/notes/{note?}
POST, PUT, DEL       /patients/{patient}/agreements/{agreement?}
POST, PUT, DEL       /patients/{patient}/payments/{payment?}
POST, DEL            /patients/{patient}/documents/{document?}
POST, PUT            /patients/{patient}/consent-forms/{form?}
GET                  /billing
GET, POST            /kosmo
POST                 /kosmo/chat
POST                 /kosmo/briefings/{briefing}/read
GET, PUT             /settings
```

### Configuración de cuenta — `/settings/`

```
GET, PATCH   /settings/profile
DELETE       /settings/profile
GET, PUT     /settings/password
GET          /settings/appearance
GET          /settings/two-factor
```

### Admin — `/admin/`

```
GET             /admin/users
GET             /admin/users/create
POST            /admin/users
GET             /admin/users/{user}
PUT             /admin/users/{user}/role
DELETE          /admin/users/{user}
```

### Fortify (autenticación) — gestionadas internamente

```
POST  /login
POST  /logout
POST  /register
POST  /forgot-password
POST  /reset-password
POST  /email/verification-notification
GET   /email/verify/{id}/{hash}
POST  /user/two-factor-authentication
POST  /user/two-factor-recovery-codes
POST  /user/confirmed-two-factor-authentication
GET   /user/two-factor-qr-code
GET   /user/two-factor-secret-key
POST  /user/confirm-password
GET   /user/confirmed-password-status
```

---

## 8. Variables de entorno

### Esenciales

```env
APP_NAME=ClientKosmos
APP_ENV=local          # local | production
APP_KEY=               # Generada con: php artisan key:generate
APP_DEBUG=true         # false en producción
APP_URL=http://localhost:8000
```

### Base de datos

```env
# Desarrollo (SQLite — sin configuración adicional)
DB_CONNECTION=sqlite

# Producción (MySQL / TiDB Cloud)
DB_CONNECTION=mysql
DB_HOST=gateway01.eu-central-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_DATABASE=test
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
DB_SSL_CA=/ruta/isrgrootx1.pem   # Solo Windows con TiDB
```

### IA (Kosmo)

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_CA_BUNDLE=/ruta/cacert.pem   # Solo Windows
```

### Correo

```env
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025           # Mailpit en Docker
MAIL_FROM_ADDRESS=noreply@clientkosmos.test
```

---

## 9. Historial de desarrollo

El proyecto se desarrolló de forma iterativa en varias fases:

| Fase | Descripción | Estado |
|------|-------------|:------:|
| **Fase 1** | Setup inicial: Laravel 12 + React 19 + Inertia.js + Tailwind CSS + Fortify + Spatie Permission | ✅ |
| **Fase 2** | Módulo de pacientes: CRUD completo + notas + acuerdos + políticas de ownership | ✅ |
| **Fase 3** | Pagos, documentos y formularios de consentimiento; módulo de facturación | ✅ |
| **Fase 4** | Integración Kosmo IA: briefings diarios + chat contextual con Groq/Llama | ✅ |
| **Fase 5** | Panel de administración; onboarding; ajustes de consulta | ✅ |
| **Fase 6** | Refactor Single-Action Controllers; tests completos (97); documentación | ✅ |
| **Fase 7** | Dockerización: multi-stage build + Docker Hub + deploy README | ✅ |

---

## 10. Dependencias principales

### PHP (composer.json)

```json
{
    "require": {
        "php": "^8.4",
        "laravel/framework": "^12.0",
        "laravel/fortify": "^1.25",
        "inertiajs/inertia-laravel": "^2.0",
        "spatie/laravel-permission": "^7.2",
        "openai-php/client": "^0.19.0",
        "laravel/wayfinder": "^0.1.9",
        "tightenco/ziggy": "^2.0"
    },
    "require-dev": {
        "pestphp/pest": "^3.8",
        "pestphp/pest-plugin-laravel": "^3.2",
        "laravel/pint": "^1.0"
    }
}
```

### Node.js (package.json)

```json
{
    "dependencies": {
        "@inertiajs/react": "^2.0",
        "react": "^19.0",
        "react-dom": "^19.0"
    },
    "devDependencies": {
        "typescript": "^5.7",
        "vite": "^7.0",
        "@vitejs/plugin-react": "^4.3",
        "tailwindcss": "^4.0",
        "@tailwindcss/vite": "^4.0"
    }
}
```

---

## Contacto y créditos

**Autor:** Samuel Ayllón  
**Proyecto:** Intermodular 2º DAM — Curso 2025/2026  
**Docker Hub:** [samue45/client-kosmos](https://hub.docker.com/r/samue45/client-kosmos)

---

*Información del Proyecto — ClientKosmos v1.0 — Abril 2026*
