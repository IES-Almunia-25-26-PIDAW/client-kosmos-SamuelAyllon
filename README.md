<div align="center">

# 🪐 ClientKosmos

### Plataforma de gestión de consulta para profesionales de servicios

[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat-square&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PHP](https://img.shields.io/badge/PHP-8.4+-777BB4?style=flat-square&logo=php&logoColor=white)](https://www.php.net)
[![Chakra UI](https://img.shields.io/badge/Chakra_UI-v3-319795?style=flat-square&logo=chakraui&logoColor=white)](https://chakra-ui.com)
[![Tests](https://img.shields.io/badge/Tests-509_casos-brightgreen?style=flat-square&logo=checkmarx&logoColor=white)]()
[![Docker](https://img.shields.io/badge/Docker-samue45%2Fclient--kosmos-2496ED?style=flat-square&logo=docker&logoColor=white)](https://hub.docker.com/r/samue45/client-kosmos)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

</div>

---

## Tabla de Contenidos

- [¿Qué es ClientKosmos?](#qué-es-clientkosmos)
- [Funcionalidades](#funcionalidades)
- [Inicio Rápido](#inicio-rápido)
- [Credenciales de Prueba](#credenciales-de-prueba)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Comandos de Desarrollo](#comandos-de-desarrollo)
- [Roles y Permisos](#roles-y-permisos)
- [Rutas de la Aplicación](#rutas-de-la-aplicación)
- [Testing](#testing)
- [Docker](#docker)
- [Variables de Entorno](#variables-de-entorno)
- [Troubleshooting](#troubleshooting)
- [API pública y contrato HTTP](#api-pública-y-contrato-http)
- [Documentación](#documentación)
- [Licencia](#licencia)

---

## ¿Qué es ClientKosmos?

**ClientKosmos** es una plataforma web de gestión de consulta para **profesionales autónomos de servicios**: psicólogos, coaches, terapeutas y asesores.

Centraliza toda la operativa de una consulta en una única herramienta:

- 🗂️ **Fichas de pacientes** — historial completo, notas, documentos y consentimientos
- 💶 **Pagos y facturación** — control de cobros con estadísticas consolidadas
- 🤖 **Kosmo IA** — asistente inteligente con briefings diarios y chat contextual
- 🔒 **RGPD integrado** — formularios de consentimiento informado digitales
- 👥 **Multiusuario** — cada profesional gestiona su propia consulta de forma privada

### El problema que resuelve

Muchos profesionales mezclan cuadernos, hojas de cálculo, carpetas de correo y aplicaciones sueltas. Esto genera:

- **Pérdida de contexto** entre sesiones
- **Documentación dispersa** (notas en papel, facturas por email, consentimientos físicos)
- **Riesgo legal** por RGPD incumplido o consentimientos mal gestionados
- **Tiempo administrativo** que resta tiempo a los pacientes

---

## Funcionalidades

### Módulos disponibles

| Módulo | Descripción |
|--------|-------------|
| **Dashboard** | Panel de control diario con métricas, alertas y briefing de Kosmo |
| **Pacientes** | CRUD completo con ficha detallada, pre/post sesión |
| **Citas y Agenda** | Reserva online, disponibilidad por workspace, recordatorios, auto-expiración con revocación de enlace Meet |
| **Videoconsulta** | Sala Google Meet generada en backend, recordings, transcripción Whisper con VAD y filtrado de alucinaciones |
| **Workspaces** | Personal y colaborativo: invitaciones, acuerdos de colaboración, derivaciones (referrals) |
| **Mensajería** | Chat profesional ↔ paciente vía Reverb (websockets) |
| **Notas** | Registro de sesiones anidado por paciente |
| **Acuerdos** | Condiciones del servicio por paciente |
| **Pagos** | Control de cobros (pendiente / pagado / vencido) |
| **Documentos** | Archivos adjuntos por paciente |
| **Consentimientos** | Formularios RGPD y consentimiento informado |
| **Facturación** | Vista consolidada de ingresos, factura PDF (dompdf) y cobro paciente vía Stripe Checkout |
| **Notificaciones** | Centro de notificaciones en tiempo real (Reverb) |
| **Portal Paciente** | Acceso del paciente a su consulta: citas, facturas, mensajes, documentos |
| **Consultas ofertadas** | Catálogo de servicios del profesional con duración y precio |
| **Kosmo IA** | Briefings diarios + chat contextual con Llama 3.3 70B |
| **Ajustes** | Perfil, password, 2FA, Google OAuth, datos de consulta, fiscales y RGPD |
| **Admin** | Gestión de usuarios del sistema (solo admins) |

### Autenticación y seguridad

- Registro con **verificación de email** obligatoria
- **Autenticación de dos factores** (TOTP)
- **Reset de contraseña** por email
- **Rate limiting** en login (protección ante ataques de fuerza bruta)
- **Policies de ownership** — cada profesional solo accede a sus propios datos

---

## Inicio Rápido

### Prerrequisitos

| Herramienta | Versión mínima |
|-------------|----------------|
| PHP | 8.4+ |
| Composer | 2.x |
| Node.js | 18+ |
| Git | cualquiera |

> Para usar la IA (Kosmo) necesitas una API key gratuita de [Groq](https://console.groq.com).

### Opción A — Docker (recomendado, sin instalar PHP ni Node)

```bash
git clone <repo-url>
cd client-kosmos-SamuelAyllon

docker compose up --build -d
```

Abre **http://localhost:8000**. El primer arranque tarda ~60 s mientras la base de datos se inicializa.

### Opción B — Setup manual

#### 1. Clonar e instalar dependencias

```bash
git clone <repo-url>
cd client-kosmos-SamuelAyllon
composer install
npm install
```

#### 2. Configurar entorno

```bash
cp .env.example .env
php artisan key:generate
```

Edita `.env` con tu API key de Groq (opcional):

```env
GROQ_API_KEY=gsk_tu_clave_aqui
```

> En Windows, si usas TiDB Cloud como base de datos, descarga también el certificado SSL (ver sección [Variables de Entorno](#variables-de-entorno)).

#### 3. Migrar base de datos con datos de prueba

```bash
php artisan migrate:fresh --seed
```

#### 4. Iniciar el servidor

```bash
composer dev      # Todo junto: backend + vite (recomendado)

# O por separado:
php artisan serve  # Backend → http://localhost:8000
npm run dev        # Frontend con hot reload
```

---

## Credenciales de Prueba

Tras ejecutar `php artisan migrate:fresh --seed`:

| Rol | Email | Contraseña | Datos demo |
|-----|-------|:----------:|------------|
| **Admin** | admin@clientkosmos.test | `password` | Panel de administración |
| **Profesional** | natalia@clientkosmos.test | `password` | Consulta con pacientes demo |

---

## Stack Tecnológico

### Backend

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| Laravel | 12 | Framework principal |
| Laravel Fortify | 1.30+ | Autenticación (login, registro, 2FA, reset password, verificación email) |
| Laravel Reverb | 1.10+ | WebSockets para notificaciones y videoconsulta en tiempo real |
| Laravel Wayfinder | 0.1.9 | Rutas tipadas generadas hacia TypeScript |
| Spatie Permission | 7.2+ | Roles (`admin`, `professional`) y middleware de acceso |
| Spatie ActivityLog | 5.x | Auditoría de acciones sensibles |
| Stripe PHP | 20.x | Cobros profesional → paciente (Checkout + webhooks) |
| Google API Client | 2.19+ | Integración con Google Calendar / Meet para videoconsulta |
| openai-php/client | 0.19 | SDK Kosmo (chat) y Whisper (transcripción), compatible con Groq |
| barryvdh/laravel-dompdf | 3.x | Generación de facturas PDF |
| Pest | 3.x | Framework de testing (509 tests, 1.887 aserciones) |
| Larastan / PHPStan | 3.x | Análisis estático nivel 7, 0 errores |

### Frontend

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| React | 19.2 | UI interactiva con React Compiler |
| TypeScript | 5.7 | Tipado estático |
| Inertia.js | 2.x | Puente Laravel–React (SPA monolítica sin API REST) |
| Chakra UI | v3.34 | Sistema visual único — tokens semánticos en `resources/js/lib/chakra-system.ts` |
| Zod | 4.x | Validación de formularios en cliente |
| `@laravel/echo-react` | 2.x | Cliente de WebSockets para Reverb |
| Vitest + Testing Library | 2.x | Tests de componentes y hooks |
| Vite | 7 | Bundler |
| Lucide React | 0.475 | Iconografía |

### Base de datos e infraestructura

| Entorno | Motor | Conexión |
|---------|-------|----------|
| Desarrollo local | SQLite | Sin configuración — `DB_CONNECTION=sqlite` |
| Producción / Docker | MySQL 8 / TiDB Cloud | Puerto 4000, SSL obligatorio |
| Tests | SQLite in-memory | Rápido y aislado |

### IA (Kosmo)

| Servicio | Modelo | Plan gratuito | Variables |
|---------|--------|:-------------:|-----------|
| **Groq** | Llama 3.3 70B Versatile | 14.400 req/día | `GROQ_API_KEY`, `GROQ_BASE_URL` |

---

## Arquitectura

### Patrón general

ClientKosmos usa **SPA monolítica con Inertia.js**: el backend Laravel sirve directamente las páginas React sin necesidad de una API REST separada.

```
┌─────────────┐    Inertia.js    ┌──────────────────────┐   Eloquent   ┌──────────────────┐
│   Browser   │ ◄──────────────► │  Laravel Controllers  │ ◄──────────► │  SQLite / MySQL  │
│  React SPA  │                  │  (Single-Action)      │              │  (TiDB Cloud)    │
└─────────────┘                  └──────────┬───────────┘              └──────────────────┘
                                             │
                          ┌──────────────────┼──────────────────┐
                          ▼                  ▼                  ▼
                      Policies          Middleware          Fortify
                   (ownership)       (admin/professional)  (autenticación)
                                             │
                                             ▼
                               OpenAI PHP Client → Groq API
                               (KosmoIndexAction, KosmoChatAction)
```

### Patrón Single-Action Controllers

Cada acción del controlador tiene su propio archivo PHP con un único método `__invoke`:

```
app/Http/Controllers/
├── Patient/
│   ├── IndexAction.php       ← GET  /patients
│   ├── StoreAction.php       ← POST /patients
│   ├── ShowAction.php        ← GET  /patients/{patient}
│   ├── UpdateAction.php      ← PUT  /patients/{patient}
│   ├── DestroyAction.php     ← DEL  /patients/{patient}
│   ├── PreSessionAction.php  ← GET  /patients/{patient}/pre-session
│   └── PostSessionAction.php ← GET  /patients/{patient}/post-session
└── ...
```

**Ventajas:** responsabilidad única, testabilidad, mantenibilidad, inyección de dependencias mínima.

---

## Estructura del Proyecto

```
client-kosmos-SamuelAyllon/
├── app/
│   ├── Actions/Fortify/          ← Lógica de autenticación (Fortify)
│   ├── Http/
│   │   ├── Controllers/          ← Patrón Single-Action (__invoke)
│   │   │   ├── Dashboard/
│   │   │   ├── Patient/
│   │   │   ├── Appointment/
│   │   │   ├── Schedule/
│   │   │   ├── Call/             ← Videoconsulta Google Meet
│   │   │   ├── Note/
│   │   │   ├── Agreement/
│   │   │   ├── CollaborationAgreement/
│   │   │   ├── Workspace/
│   │   │   ├── Referral/
│   │   │   ├── OfferedConsultations/
│   │   │   ├── Message/
│   │   │   ├── Notification/
│   │   │   ├── Document/
│   │   │   ├── ConsentForm/
│   │   │   ├── Invoice/          ← Facturación + Stripe Checkout
│   │   │   ├── Webhook/          ← Stripe webhook
│   │   │   ├── Portal/           ← Vistas del paciente
│   │   │   ├── Professional/
│   │   │   ├── Kosmo/
│   │   │   ├── Onboarding/
│   │   │   ├── Settings/         ← Consulta + Profile + Password + 2FA + Google
│   │   │   ├── Admin/Users/
│   │   │   └── Auth/
│   │   └── Middleware/
│   ├── Models/                   ← User, Patient, Note, Agreement, Payment, ...
│   ├── Policies/                 ← PatientPolicy (ownership)
│   └── Providers/                ← AppServiceProvider (Groq singleton)
├── database/
│   ├── migrations/
│   ├── seeders/                  ← RoleSeeder + UserSeeder
│   └── factories/                ← UserFactory, PatientFactory, PaymentFactory
├── resources/js/
│   ├── pages/                    ← dashboard, patients, billing, kosmo, settings, admin, auth
│   ├── components/ui/            ← shadcn/ui customizados
│   └── layouts/                  ← AppLayout (sidebar) + AuthLayout
├── routes/
│   ├── web.php                   ← Todas las rutas
│   └── settings.php              ← Rutas de configuración de cuenta
├── tests/Feature/                ← 35 archivos / 509 test cases (Pest)
├── docs/                         ← Documentación técnica y de usuario
├── deploy/                       ← Runbook Railway + docker-compose.local.yml
├── Dockerfile
└── docker-compose.yml
```

---

## Comandos de Desarrollo

### Servidor

```bash
composer dev          # Todo junto: serve + vite (recomendado)
php artisan serve     # Solo backend (puerto 8000)
npm run dev           # Solo frontend con hot reload
npm run build         # Build de producción
```

### Base de datos

```bash
php artisan migrate:fresh --seed   # Resetear BD con datos de prueba
php artisan migrate                # Aplicar nuevas migraciones
```

### Testing

```bash
php artisan test --testsuite=Feature   # Todos los tests de Feature
php artisan test --filter=PatientIndex # Test específico por nombre
```

### Caché y limpieza

```bash
php artisan optimize:clear   # Limpia config, caché y vistas
php artisan view:clear       # Solo caché de vistas compiladas
php artisan config:clear     # Solo caché de configuración
```

### Calidad de código

```bash
npm run lint       # ESLint (con autofix)
npm run format     # Prettier
npm run types      # TypeScript type-check
composer lint      # Laravel Pint
```

---

## Roles y Permisos

### Dos roles (Spatie Permission)

| Rol | Asignación | Acceso |
|-----|------------|--------|
| **`professional`** | Automático al registrarse | Dashboard, pacientes, facturación, Kosmo, ajustes |
| **`admin`** | Manual por otro admin | Panel de administración `/admin/*` |

### Middleware de protección

| Middleware | Alias | Comportamiento |
|-----------|-------|----------------|
| `EnsureAdmin` | `admin` | Solo admins; redirige al dashboard si no |
| `EnsureProfessional` | `professional` | Redirige admins al panel admin |
| `auth` | — | Fortify: redirige a login si no autenticado |
| `verified` | — | Fortify: redirige a verificación si email no confirmado |

### Policies (ownership)

Los datos de cada profesional son privados. `PatientPolicy` garantiza que ningún usuario puede ver o modificar pacientes de otro usuario.

---

## Rutas de la Aplicación

### Públicas

```
GET  /          Bienvenida
GET  /login     Login (Fortify)
GET  /register  Registro (Fortify)
```

### Profesional — `['auth', 'verified', 'professional']`

```
GET                  /dashboard
GET, POST            /onboarding
GET, POST, PUT, DEL  /patients
GET                  /patients/{patient}
GET                  /patients/{patient}/pre-session
GET                  /patients/{patient}/post-session
POST, PUT, DEL       /patients/{patient}/notes/...
POST, PUT, DEL       /patients/{patient}/agreements/...
POST, DEL            /patients/{patient}/documents/...
POST, PUT            /patients/{patient}/consent-forms/...
GET, POST, PUT, DEL  /appointments
GET, PUT             /schedule                        ← Disponibilidad del profesional
GET                  /calls/{room}                    ← Sala Google Meet
GET, POST, PUT, DEL  /workspaces
POST, PUT, DEL       /workspaces/{ws}/collaboration-agreements
POST, PUT, DEL       /workspaces/{ws}/referrals
GET, POST, PUT, DEL  /offered-consultations
GET, POST            /messages
GET                  /notifications
GET, POST            /invoices
GET                  /invoices/{invoice}/pdf
POST                 /invoices/{invoice}/checkout     ← Stripe Checkout
GET, POST            /kosmo
POST                 /kosmo/chat
POST                 /kosmo/briefings/{briefing}/read
GET, PUT             /settings                        ← Perfil, password, 2FA, Google, consulta
```

### Paciente (portal) — `['auth', 'verified']`

```
GET                  /portal
GET                  /portal/appointments
GET                  /portal/invoices
GET                  /portal/messages
```

### Endpoints REST reales (no-Inertia)

```
POST                 /webhooks/stripe                 ← Firma Stripe (sin CSRF)
POST                 /broadcasting/auth               ← Handshake Reverb
GET, POST            /auth/google/callback            ← OAuth Google
```

### Admin — `['auth', 'verified', 'admin']`

```
GET         /admin/users
GET         /admin/users/create
POST        /admin/users
GET         /admin/users/{user}
PUT         /admin/users/{user}/role
DELETE      /admin/users/{user}
```

---

## Testing

```bash
php artisan test --testsuite=Feature   # Ejecutar todos los Feature tests
```

**509 test cases** — **1.887 aserciones** — todas en verde ✅

Áreas cubiertas por la suite Feature:

- **Autenticación Fortify:** login, logout, registro, rate limiting, 2FA, reset y verificación de email.
- **Autorización:** policies de ownership por paciente, middleware `admin` / `professional`.
- **Dominio:** pacientes (CRUD, pre/post sesión), citas y disponibilidad, notas, acuerdos, documentos, consentimientos RGPD.
- **Facturación:** generación de facturas, PDF dompdf, recordatorios, Stripe Checkout y webhook de pago.
- **Videoconsulta:** creación de sala Google Meet, estados 410 para salas completadas, limpieza de evento.
- **Kosmo IA:** briefings, chat, marcar leídos.
- **Admin:** CRUD usuarios y cambio de rol.
- **Ajustes:** perfil, password, 2FA, datos de consulta.

Listar tests reales:

```bash
php artisan test --list-tests
```

Framework: **Pest 3** con `RefreshDatabase`, helpers `createAdmin()` / `createProfessional()` y `withoutVite()` global en `TestCase`. Frontend cubierto adicionalmente con **Vitest** (`npm run test`).

---

## Docker

### Desarrollo (con build local)

```bash
docker compose up --build   # Primera vez (construye la imagen)
docker compose up -d        # Arranque normal
```

### Demo local (sin código fuente)

```bash
cd deploy/
docker compose -f docker-compose.local.yml up -d
```

| Servicio | URL |
|----------|-----|
| Aplicación | http://localhost:8000 |
| Mailpit (correo de prueba) | http://localhost:8025 |

### Producción real (Railway)

ClientKosmos está desplegado en [Railway](https://railway.com) con auto-deploy
desde `main`. Stack: servicio `app` (Docker build desde el `Dockerfile` del repo)
+ servicio `MySQL` (template oficial) + volumen montado en `/app/storage/app`.

URL pública actual: **https://app-production-a329.up.railway.app**

```bash
# Operaciones desde local (vía Railway CLI / MCP)
railway logs --service app --environment production
railway variables --service app --environment production --json
railway up --service app                    # Deploy manual (normalmente auto)
```

Runbook completo (topología, variables, troubleshooting, MCP de Railway):
[`deploy/RAILWAY.md`](deploy/RAILWAY.md). La pila legacy VPS + Traefik + DuckDNS
queda archivada en [`deploy/legacy/`](deploy/legacy/).

### Servicios Railway

| Servicio | Tipo | Rol |
|----------|------|-----|
| `app` | Docker (repo) | Aplicación Laravel + FrankenPHP, expuesta en `:8000` |
| `MySQL` | Template oficial Railway | Base de datos, conectada por refs `${{MySQL.MYSQLHOST}}`, etc. |
| `app-volume` | Volume | Persistencia de `/app/storage/app` (uploads, PDFs) |

### Build multi-stage (Dockerfile)

| Stage | Base | Acción |
|-------|------|--------|
| `deps` | `php:8.4-cli-alpine` | Instala dependencias PHP (Composer, sin dev) |
| `frontend` | `node:20-alpine` | Compila assets con Vite (`npm run build`) |
| `final` | `dunglas/frankenphp:1-php8.4-alpine` | Imagen final con Caddy + PHP 8.4 |

### Entrypoint automático

Al arrancar el contenedor:
1. Copia `.env.example` → `.env` con las variables del entorno (Railway / compose).
2. Genera `APP_KEY` si está vacía.
3. Espera a que MySQL acepte conexiones (vía PHP/PDO).
4. Ejecuta `migrate --force` y `storage:link`.
5. `db:seed` **solo** si `APP_ENV != production` y la tabla `users` está vacía.
6. En producción cachea config, rutas y vistas.
7. Arranca `frankenphp run --config /etc/caddy/Caddyfile` en `:8000`
   (Railway termina TLS por delante).

---

## Variables de Entorno

### Desarrollo local (SQLite)

```env
APP_NAME=ClientKosmos
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Base de datos (SQLite — cero configuración)
DB_CONNECTION=sqlite

# IA contextual (opcional pero recomendado)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_CA_BUNDLE=C:/certs/cacert.pem   # Solo Windows
```

### Producción (MySQL / TiDB Cloud)

```env
APP_NAME=ClientKosmos
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-dominio.com

# Base de datos (TiDB Cloud Serverless — MySQL compatible)
DB_CONNECTION=mysql
DB_HOST=gateway01.eu-central-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_DATABASE=test
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
DB_SSL_CA=/ruta/isrgrootx1.pem   # Certificado ISRG Root X1

# IA contextual
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=llama-3.3-70b-versatile
```

### Certificados SSL (solo necesarios en producción con TiDB Cloud)

> En desarrollo con SQLite **no se necesitan certificados**. En Docker, MySQL corre localmente.

| Sistema | Acción |
|---------|--------|
| **Windows** | Descargar `isrgrootx1.pem` (TiDB) y `cacert.pem` (Groq) con PowerShell |
| **Linux / macOS** | Sin acción — certificados del sistema disponibles automáticamente |

```powershell
# PowerShell (Windows) — como administrador
mkdir C:\certs
Invoke-WebRequest -Uri "https://letsencrypt.org/certs/isrgrootx1.pem" -OutFile "C:\certs\isrgrootx1.pem"
Invoke-WebRequest -Uri "https://curl.se/ca/cacert.pem" -OutFile "C:\certs\cacert.pem"
```

---

## Troubleshooting

| Síntoma | Causa probable | Solución |
|---------|----------------|----------|
| `cURL error 60` con la IA | PHP/cURL sin certificados CA (Windows) | Descargar `cacert.pem` y configurar `GROQ_CA_BUNDLE` |
| `cURL error 60` con BD | Falta certificado ISRG Root X1 (TiDB) | Descargar `isrgrootx1.pem` y configurar `DB_SSL_CA` |
| Error 419 en formularios | Token CSRF expirado | `php artisan config:clear` + borrar cookies |
| `RoleDoesNotExist` | Seeders no ejecutados | `php artisan migrate:fresh --seed` |
| Tests fallan con Vite | Manifest de Vite no encontrado | `php artisan view:clear` y volver a ejecutar |
| Frontend no actualiza | Caché de Vite | Reiniciar `npm run dev` o Ctrl+Shift+R |
| La app tarda en arrancar (Docker) | MySQL inicializando | Normal. Espera ~60 s y observa `docker compose logs -f app` |
| Sesiones se invalidan (Docker) | `APP_KEY` cambia en cada contenedor | Fija la `APP_KEY` en el `docker-compose.yml` |

---

## API pública y contrato HTTP

ClientKosmos **no expone una API REST de uso público**. Es una **SPA monolítica con [Inertia.js v2](https://inertiajs.com)**: el frontend React no consume JSON por `fetch`/`axios`, sino que recibe props tipadas servidas directamente por los controladores Laravel. La negociación de contenido (`X-Inertia: true` ⇒ JSON con la página; petición normal ⇒ HTML inicial) la gestiona el adaptador y no constituye un contrato versionado.

Por ese motivo **no se incluye OpenAPI/Swagger** del front: documentar contratos Inertia con Swagger sería redundante (las props son el contrato y están **tipadas en TypeScript** vía Wayfinder en [resources/js/actions/](resources/js/actions/) y [resources/js/routes/](resources/js/routes/), generados a partir de las rutas Laravel).

### Fuentes de verdad del contrato HTTP

| Capa | Dónde mirar | Qué define |
|------|-------------|------------|
| Rutas HTTP | [routes/web.php](routes/web.php), [routes/settings.php](routes/settings.php) | Verbo, URI, middleware, controlador. Listables con `php artisan route:list`. |
| Tipos cliente | [resources/js/actions/](resources/js/actions/), [resources/js/routes/](resources/js/routes/) | URLs y payloads tipados por Wayfinder — refrescar con `php artisan wayfinder:generate`. |
| Validación de payload | `app/Http/Requests/**` | Reglas por endpoint (auth, payload, ownership). |
| Autorización | `app/Policies/**` + middleware `auth`, `verified`, `admin`, `professional` | Quién puede invocar qué. |
| Eventos WebSocket | [routes/channels.php](routes/channels.php) | Canales privados/presence servidos por Reverb. |

### Endpoints REST reales (no-Inertia)

Los únicos endpoints que **sí actúan como API HTTP pura** son integraciones de terceros y broadcasting. Estos sí requieren un contrato escrito:

| Método | URI | Auth | Propósito |
|--------|-----|------|-----------|
| `POST` | `/webhooks/stripe` | Firma Stripe (sin CSRF, sin sesión) | Recibe eventos de Checkout/PaymentIntent. Lógica en `App\Http\Controllers\Webhook\StripeWebhookAction`. |
| `POST` | `/broadcasting/auth` | `auth` (sesión) | Handshake de canales privados Reverb (cliente `@laravel/echo-react`). |
| `GET`/`POST` | Callback OAuth Google | Sesión + state | Devolución del consentimiento Google Calendar / Meet. |

> Si en el futuro se publica una API de terceros (móvil, integraciones externas), la decisión arquitectónica deberá registrarse como **ADR** en [docs/decision-log.md](docs/decision-log.md) y entonces se incorporará Scribe u OpenAPI para generar el contrato.

---

## Documentación

| Documento | Descripción |
|-----------|-------------|
| [docs/user_manual.md](docs/user_manual.md) | Manual de uso para el usuario final |
| [docs/justificate_implementation.md](docs/justificate_implementation.md) | Justificación técnica de decisiones de diseño |
| [docs/proyect_information.md](docs/proyect_information.md) | Contexto completo, estado actual y estructura |
| [docs/clientkosmos-design-system.md](docs/clientkosmos-design-system.md) | Design system: tokens, componentes, tipografía |
| [deploy/README.md](deploy/README.md) | Instrucciones de despliegue con Docker |

---

## Licencia

MIT — Ver [LICENSE](LICENSE) para más detalles.

---

<div align="center">

**Samuel Ayllón** — Proyecto Intermodular 2º DAM

[Docker Hub](https://hub.docker.com/r/samue45/client-kosmos)

</div>
