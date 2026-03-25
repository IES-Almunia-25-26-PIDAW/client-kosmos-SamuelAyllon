<div align="center">

# 🪐 ClientKosmos

### Tu memoria operativa por cliente — Gestiona tu actividad freelance sin perder contexto

[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat-square&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PHP](https://img.shields.io/badge/PHP-8.4+-777BB4?style=flat-square&logo=php&logoColor=white)](https://www.php.net)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Tests](https://img.shields.io/badge/Tests-156_casos-brightgreen?style=flat-square&logo=checkmarx&logoColor=white)]()
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat-square&logo=docker&logoColor=white)](docker-compose.yml)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

</div>

---

## Tabla de Contenidos

- [¿Qué es ClientKosmos?](#qué-es-clientkosmos)
- [Planes y Funcionalidades](#planes-y-funcionalidades)
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
- [Documentación](#documentación)
- [Fases del Desarrollo](#fases-del-desarrollo)
- [Licencia](#licencia)

---

## ¿Qué es ClientKosmos?

**ClientKosmos** es una plataforma web freemium diseñada para **freelancers que gestionan varios clientes a la vez**. Cada cliente tiene su propia ficha con tareas, ideas, recursos y contexto, de modo que al cambiar de cliente retomas exactamente donde lo dejaste.

### El problema que resuelve

La fragmentación de herramientas (una app para tareas, otra para ideas, otra para enlaces) genera:

- **Pérdida de contexto** — al saltar de un cliente a otro se pierden detalles cruciales.
- **Información dispersa** — ideas sueltas, enlaces en marcadores, tareas sin vincular al cliente.
- **Falta de visión diaria** — no existe un lugar que muestre "qué tengo que hacer hoy y para quién".

ClientKosmos unifica estas necesidades en fichas de cliente con:

| Módulo | Descripción | Plan |
|--------|-------------|------|
| **Clientes** | Unidad central: cada cliente agrupa tareas, ideas y recursos | Todos |
| **Tareas** | Con prioridades, fechas de vencimiento y vinculación a cliente | Todos |
| **Ideas** | Captura rápida ligada a un cliente, sin límite | Todos |
| **Panel Hoy** | Tareas del día agrupadas por cliente con badges de riesgo | Todos |
| **Recursos** | Enlaces, documentos, videos e imágenes por cliente | Solo ✦ |
| **Kosmo IA** | `planDay`, `clientSummary` y `clientUpdate` sobre datos reales | Solo ✦ |
| **Nudges** | Sugerencias contextuales cuando hay tareas vencidas | Solo ✦ |

---

## Planes y Funcionalidades

### Comparativa de planes

| Plan | Precio | Clientes | Tareas | Ideas | Recursos | IA (Kosmo) |
|------|--------|:--------:|:------:|:-----:|:--------:|:----------:|
| **Gratuito** | 0 € | 1 | 5 máx. pendientes | ∞ | — | — |
| **Solo Mensual** | 11,99 €/mes | ∞ | ∞ | ∞ | ✓ | 3 acciones/día |
| **Solo Anual** | 119 €/año | ∞ | ∞ | ∞ | ✓ | 3 acciones/día |

### Funcionalidades por plan

<details>
<summary><strong>Core — Todos los usuarios</strong></summary>

- Autenticación completa: registro, login, recuperación de contraseña, verificación de email y 2FA (Fortify)
- Fichas de cliente con nombre, descripción, color y estado (activo / inactivo / completado)
- Gestor de tareas vinculadas a cliente con límite free (5 pendientes máx.) — CRUD + completar/reabrir
- Gestor de ideas sin límite — CRUD + resolver/reactivar
- Panel Hoy con tareas del día agrupadas por cliente y badges de riesgo (vencidas en rojo, próximas en ámbar)
- Header de contexto en ficha de cliente: tareas pendientes, urgentes, vencidas, próxima entrega e ideas activas
- Upgrade prompts contextuales con copy refinado en límites de clientes, tareas e IA
- Checkout y suscripción simulada (80 % éxito / 20 % fallo)
- Tutorial interactivo con tour guiado (spotlight + chatbot Kosmo) para nuevos usuarios
- Landing page completa (hero, features, pricing, footer)
- Modo oscuro / claro con persistencia

</details>

<details>
<summary><strong>Solo ✦ — Plan Premium</strong></summary>

- Clientes ilimitados y tareas ilimitadas
- Recursos por cliente (enlaces, documentos, videos, imágenes)
- Nudges contextuales de Kosmo (descartables, reset diario) en Panel Hoy y ficha de cliente
- IA contextual con Kosmo — 3 acciones:
  - `planDay` — planifica el día con la información de todos tus clientes
  - `clientSummary` — resume el estado actual de un cliente
  - `clientUpdate` — genera un parte semanal detallado para un cliente

</details>

<details>
<summary><strong>Admin — Panel de administración</strong></summary>

- Dashboard con estadísticas globales
- Gestión de usuarios (lista paginada + detalle + eliminación)
- Historial de pagos con resumen de ingresos
- Control de suscripciones con distribución por plan

</details>

---

## Inicio Rápido

### Prerrequisitos

| Herramienta | Versión mínima |
|-------------|----------------|
| PHP | 8.4+ |
| Composer | 2.x |
| Node.js | 18+ |
| Git | cualquiera |

> **Servicios externos necesarios:**
> - **TiDB Cloud** (base de datos) — certificado SSL ISRG Root X1
> - **Groq** (IA contextual) — cuenta gratuita en [console.groq.com](https://console.groq.com) + CA bundle Mozilla (solo Windows)

### Opción A — Setup automático (recomendado)

```bash
git clone <repo-url>
cd clientkosmos-samuel-ayllon
# Edita .env con tus credenciales (ver Opción B paso 3), luego:
composer setup
```

El script `composer setup` ejecuta automáticamente: `composer install`, copia `.env.example`, genera `APP_KEY`, ejecuta migraciones, instala dependencias npm y compila el frontend.

### Opción B — Setup manual

#### 1. Clonar e instalar dependencias

```bash
git clone <repo-url>
cd clientkosmos-samuel-ayllon
composer install
npm install
```

#### 2. Certificados SSL (solo Windows)

> En **Linux/macOS** los certificados del sistema ya están disponibles — omite este paso.

En **Windows**, PHP/cURL no incluye certificados SSL por defecto. Descárgalos con PowerShell (como administrador):

```powershell
mkdir C:\certs
# Para TiDB Cloud (base de datos)
Invoke-WebRequest -Uri "https://letsencrypt.org/certs/isrgrootx1.pem" -OutFile "C:\certs\isrgrootx1.pem"
# Para Groq (IA contextual)
Invoke-WebRequest -Uri "https://curl.se/ca/cacert.pem" -OutFile "C:\certs\cacert.pem"
```

#### 3. Configurar entorno

```bash
cp .env.example .env
php artisan key:generate
```

Edita `.env` con tus credenciales:

```env
# ── Base de datos (TiDB Cloud) ─────────────────────────────────
DB_CONNECTION=mysql
DB_HOST=gateway01.eu-central-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_DATABASE=test
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
DB_SSL_CA=C:\certs\isrgrootx1.pem     # Solo Windows

# ── IA contextual (Groq — gratuito) ────────────────────────────
GROQ_API_KEY=gsk_tu_clave_aqui
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_CA_BUNDLE=C:/certs/cacert.pem    # Solo Windows
```

> **Obtener API key de Groq:** Regístrate gratis en [console.groq.com](https://console.groq.com), ve a "API Keys" y genera una clave. El plan gratuito permite 14.400 peticiones/día.

#### 4. Migrar base de datos con datos de prueba

```bash
php artisan migrate:fresh --seed
```

#### 5. Iniciar el servidor

```bash
composer dev      # Todo junto: backend + queue + frontend (recomendado)

# O por separado:
php artisan serve  # Backend → http://localhost:8000
npm run dev        # Frontend con hot reload (Vite)
```

---

## Credenciales de Prueba

Después de `php artisan migrate:fresh --seed`:

| Rol | Email | Password | Datos demo |
|-----|-------|:--------:|------------|
| **Admin** | admin@clientkosmos.test | `password` | Panel de administración |
| **Premium (Solo)** | premium@clientkosmos.test | `password` | 3 clientes, tareas, ideas y recursos |
| **Free** | free@clientkosmos.test | `password` | 1 cliente, 3 tareas, 1 idea |

---

## Stack Tecnológico

### Backend

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| Laravel | 12 | Framework principal |
| Laravel Fortify | 1.x | Autenticación (login, registro, 2FA, verificación de email) |
| Spatie Permission | 7.x | Roles y permisos (`admin`, `premium_user`, `free_user`) |
| Eloquent ORM | (Laravel 12) | Acceso a datos |
| openai-php/client | 0.19 | Cliente SDK para IA (Groq vía API compatible con OpenAI) |
| Laravel Wayfinder | 0.1.9 | Generación de rutas tipadas para TypeScript |
| Pest | 3.x | Framework de testing (156 test cases) |

### Frontend

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| React | 19 | UI interactiva |
| TypeScript | 5.7 | Tipado estático |
| Inertia.js | 2.3 | Puente Laravel–React (SPA monolítica sin API REST) |
| Tailwind CSS | 4.0 | Estilos utility-first con tokens custom |
| shadcn/ui | — | Componentes UI (Radix UI + Tailwind) |
| Vite | 7 | Bundler con React Compiler |
| Lucide React | 0.475 | Iconografía |

### Base de datos e infraestructura

| Entorno | Motor | Conexión |
|---------|-------|----------|
| Desarrollo local | SQLite (archivo local) | Sin configuración — `DB_CONNECTION=sqlite` en `.env` |
| Producción / Docker | TiDB Cloud Serverless (MySQL-compatible) | Puerto 4000, SSL obligatorio — configurado en `.env.prod` |
| Tests | SQLite in-memory | Sin configuración |

### Integraciones IA

| Servicio | Modelo | Plan gratuito | Variables de entorno |
|---------|--------|---------------|----------------------|
| **Groq** *(activo)* | Llama 3.3 70B | 14.400 req/día | `GROQ_API_KEY`, `GROQ_CA_BUNDLE` |
| OpenAI GPT | gpt-4o, etc. | De pago | Cambiar `GROQ_BASE_URL` y `GROQ_API_KEY` |

---

## Arquitectura

### Patrón general

ClientKosmos sigue el patrón **SPA monolítica** con Inertia.js: el backend Laravel renderiza páginas React directamente sin necesidad de una API REST separada. Esto simplifica autenticación, validación y navegación.

```
┌─────────────┐    Inertia.js    ┌──────────────────────┐   Eloquent   ┌─────────────────┐
│   Browser   │ ◄──────────────► │  Laravel Controllers  │ ◄──────────► │  TiDB Cloud     │
│  React SPA  │                  │  (Single-Action)      │              │  (MySQL 8)      │
└─────────────┘                  └──────────┬───────────┘              └─────────────────┘
                                             │
                          ┌──────────────────┼──────────────────┐
                          ▼                  ▼                  ▼
                      Policies          Middleware         FormRequests
                   (ownership)       (roles: Spatie)      (validación)
                                             │
                                             ▼
                               OpenAI PHP Client → Groq API
                               (PlanDayAction, ClientSummaryAction,
                                ClientUpdateAction)
```

### Integración IA — Groq vía OpenAI SDK

El cliente de IA se registra como **singleton** en `AppServiceProvider`:

```php
$this->app->singleton(OpenAIClient::class, function () {
    return OpenAI::factory()
        ->withApiKey(config('services.groq.api_key'))
        ->withBaseUri(config('services.groq.base_url'))
        ->withHttpClient(new GuzzleClient(['verify' => config('services.groq.ca_bundle')]))
        ->make();
});
```

Las acciones `Ai\PlanDayAction`, `Ai\ClientSummaryAction` y `Ai\ClientUpdateAction` reciben el cliente por inyección de dependencias. Toda la configuración reside en `config/services.php` bajo la clave `groq`.

### Decisiones de diseño clave

| Decisión | Detalle |
|----------|---------|
| **Patrón Single-Action** | Cada controlador tiene un único método `__invoke` — un archivo = una responsabilidad |
| **Clientes ≡ Projects** | El modelo se llama `Project`, las URLs usan `/clients` y la UI dice "Clientes" |
| **Hard delete en Task e Idea** | `SoftDeletes` eliminado en Fase 2; la columna `deleted_at` permanece en BD pero Eloquent la ignora |
| **Límite de tareas free** | `User::canAddTask()` cuenta `status='pending'` — aplica al crear y al reabrir |
| **Límite de clientes free** | `User::canAddProject()` — máximo 1 cliente en plan gratuito |
| **Pago simulado** | `Payment::process()` con 80 % éxito; almacena solo los últimos 4 dígitos (PCI-DSS) |
| **Ruta home** | `inertia('welcome')` sin redirect a login (requerido por los tests de landing page) |

---

## Estructura del Proyecto

```
clientkosmos/
├── app/
│   ├── Http/
│   │   ├── Controllers/               ← Patrón Single-Action (__invoke)
│   │   │   ├── Dashboard/             ← Panel Hoy
│   │   │   ├── Project/               ← Fichas de cliente (CRUD + Complete)
│   │   │   ├── Task/                  ← Tareas (CRUD + Complete + Reopen)
│   │   │   ├── Idea/                  ← Ideas (CRUD + Resolve + Reactivate)
│   │   │   ├── Resource/              ← Recursos por cliente (CRUD)
│   │   │   ├── Ai/                    ← PlanDayAction, ClientSummaryAction, ClientUpdateAction
│   │   │   ├── Subscription/ Checkout/ Tutorial/
│   │   │   └── Admin/                 ← Dashboard, Users, Payments, Subscriptions
│   │   └── Requests/                  ← Form Requests de validación
│   ├── Models/
│   │   ├── User.php          ← canAddTask(), canAddProject(), roles
│   │   ├── Task.php          ← scopes, prioridades, markAsCompleted()
│   │   ├── Idea.php          ← resolve/reactivate, status active/resolved
│   │   ├── Project.php       ← scopes, color, brand_tone ("cliente")
│   │   ├── Resource.php      ← link/document/video/image/other
│   │   ├── Subscription.php  ← plan free/premium_monthly/premium_yearly
│   │   ├── Payment.php       ← process() 80/20, generateTransactionId()
│   │   └── AiLog.php         ← Registro de uso de IA
│   ├── Providers/
│   │   └── AppServiceProvider.php  ← Singleton OpenAI\Client → Groq
│   └── Policies/                   ← Ownership: Project, Task, Idea, Resource
├── config/
│   └── services.php                ← Configuración Groq
├── database/
│   ├── migrations/                 ← 14 migraciones
│   └── seeders/                    ← RoleSeeder + UserSeeder (3 usuarios demo)
├── resources/
│   ├── css/app.css                 ← Design system (tokens, animaciones, dark mode)
│   └── js/
│       ├── pages/
│       │   ├── welcome.tsx         ← Landing page pública
│       │   ├── dashboard.tsx       ← Panel Hoy
│       │   ├── projects/           ← Fichas de cliente
│       │   ├── tasks/  ideas/  resources/
│       │   ├── subscription/  checkout/
│       │   ├── admin/              ← Panel admin
│       │   ├── auth/               ← Login, registro, 2FA, reset…
│       │   └── settings/           ← Perfil, contraseña, apariencia, 2FA
│       ├── components/
│       │   ├── ui/                 ← 25+ componentes shadcn/ui
│       │   └── tutorial-chatbot.tsx ← Tour interactivo con spotlight
│       ├── types/                  ← TypeScript types (models, pages, admin)
│       ├── hooks/                  ← appearance, clipboard, 2FA, mobile…
│       ├── routes/                 ← Rutas tipadas (Laravel Wayfinder)
│       └── layouts/                ← App (sidebar) + Auth (centrado)
├── routes/
│   ├── web.php                     ← Todas las rutas (public + auth + premium + admin)
│   └── settings.php                ← Rutas de configuración de cuenta
├── tests/Feature/                  ← 156 test cases (Pest)
├── docs/                           ← Documentación técnica y de usuario
├── Dockerfile                      ← Multi-stage build
└── docker-compose.yml              ← 3 servicios: app, db, mailpit
```

---

## Comandos de Desarrollo

### Servidor

```bash
composer dev          # Todo junto: serve + queue + vite (recomendado)
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
php artisan test                          # Todos los tests
php artisan test --filter=TaskIndex       # Test específico por nombre de clase
php artisan test --coverage               # Con cobertura
composer test                             # Lint + tests
```

### Caché y limpieza

```bash
php artisan optimize:clear   # Limpia config, caché y vistas
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

### Tres roles (Spatie Permission)

| Rol | Acceso |
|-----|--------|
| **`admin`** | Panel de administración: `/admin/dashboard`, `/admin/users`, `/admin/payments`, `/admin/subscriptions` |
| **`premium_user`** | Clientes ilimitados, tareas ilimitadas, recursos e IA contextual (plan Solo) |
| **`free_user`** | 1 cliente, máximo 5 tareas pendientes, ideas ilimitadas — sin recursos ni IA |

### Capas de protección

| Capa | Mecanismo |
|------|-----------|
| **Rutas** | Middleware `role:premium_user` / `role:admin` (Spatie) |
| **Recursos** | Policies — solo el propietario puede ver/modificar |
| **Lógica de negocio** | `User::canAddTask()` y `User::canAddProject()` — validan los límites del plan free |
| **Autenticación** | Fortify + bloqueo si el usuario no tiene rol asignado |

---

## Rutas de la Aplicación

### Públicas
```
GET  /          Landing page
GET  /login     Login
GET  /register  Registro
```

### Autenticadas (todos los roles)
```
GET/POST/PUT/DELETE  /clients                          Fichas de cliente (CRUD)
PATCH                /clients/{id}/complete
GET/POST/PUT/DELETE  /tasks                            Tareas
PATCH                /tasks/{id}/complete | /reopen
GET/POST/PUT/DELETE  /ideas                            Ideas
PATCH                /ideas/{id}/resolve | /reactivate
GET                  /subscription                     Ver suscripción
GET/POST             /checkout                         Pago simulado
POST                 /tutorial/complete                Marcar tutorial completado
```

### Solo ✦ — `premium_user`
```
POST          /ai/plan-day                         Planificar el día con IA
POST          /ai/client-summary/{project}         Resumen de cliente con IA
POST          /ai/client-update/{project}          Parte semanal con IA
GET/POST      /clients/{project}/resources         Recursos del cliente
PUT/DELETE    /resources/{resource}                Editar/eliminar recurso
```

### Admin — `admin`
```
GET         /admin/dashboard
GET         /admin/users
GET/DELETE  /admin/users/{user}
GET         /admin/payments
GET         /admin/subscriptions
```

---

## Testing

```bash
php artisan test            # Ejecutar todos los tests
php artisan test --coverage # Con informe de cobertura
composer test               # Lint (Pint) + tests
```

**156 test cases** distribuidos en los siguientes módulos:

| Módulo | Cobertura |
|--------|-----------|
| Auth | Registro, login, verificación email, reset password, 2FA |
| Tasks | CRUD, completar/reabrir, límite free, autorización |
| Ideas | CRUD, resolver/reactivar, autorización |
| Clients | CRUD, completar cliente, ownership |
| Resources | CRUD anidado bajo cliente, autorización |
| Checkout | Flujo éxito/fallo, validación de tarjeta |
| IA contextual | `planDay`, `clientSummary`, `clientUpdate`, control de roles |
| Admin | Dashboard, usuarios, pagos, suscripciones |
| Settings | Perfil, contraseña, 2FA |

Framework: **Pest 3** con helpers custom — `createAdmin()`, `createPremiumUser()`, `createFreeUser()`.

---

## Docker

```bash
docker compose up --build   # Primera vez (construye la imagen)
docker compose up           # Arranque normal
```

| Servicio | URL |
|----------|-----|
| Aplicación | http://localhost:8000 |
| Mailpit (correo de prueba) | http://localhost:8025 |

### Contenedores

| Contenedor | Imagen | Puerto(s) | Descripción |
|------------|--------|-----------|-------------|
| `clientkosmos_app` | Custom (Dockerfile) | `8000` | Aplicación Laravel |
| `clientkosmos_db` | `mysql:8.0` | `3306` | Base de datos MySQL |
| `clientkosmos_mailpit` | `axllent/mailpit` | `1025` (SMTP), `8025` (UI) | Servidor de correo de prueba |

### Build multi-stage (Dockerfile)

| Stage | Base | Acción |
|-------|------|--------|
| `deps` | `php:8.4-cli-alpine` | Instala dependencias PHP vía Composer |
| `frontend` | `node:20-alpine` | Instala npm y ejecuta `npm run build` (Vite) |
| `final` | `php:8.4-fpm-alpine` | Copia vendor + assets compilados; imagen mínima de producción |

### Comportamiento de `docker-entrypoint.sh`

- Copia `.env.example` → `.env` si no existe y escribe las variables del compose
- Genera `APP_KEY` automáticamente si está vacío
- Espera a que MySQL esté lista (`mysqladmin ping`)
- Ejecuta `migrate --force` y `db:seed` solo si la tabla `users` está vacía
- Cachea config/routes/vistas en producción y arranca `php artisan serve`

> Los usuarios demo se crean automáticamente al levantar el contenedor por primera vez.

---

## Variables de Entorno

El proyecto usa **dos archivos de entorno** según el contexto:

| Archivo | Uso | Base de datos |
|---------|-----|---------------|
| `.env` | Desarrollo local | SQLite (sin configuración) |
| `.env.prod` | Producción / Docker | TiDB Cloud Serverless (MySQL, SSL) |

### `.env` — Desarrollo local

```env
APP_NAME=ClientKosmos
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# ── Base de datos (SQLite — sin configuración extra) ───────────
DB_CONNECTION=sqlite
# DB_DATABASE= (por defecto: database/database.sqlite)

# ── Sesión ──────────────────────────────────────────────────────
SESSION_DRIVER=database

# ── IA contextual (Groq — gratuito, recomendado) ───────────────
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_CA_BUNDLE=C:/certs/cacert.pem    # Solo Windows (ver más abajo)
```

### `.env.prod` — Producción / TiDB Cloud

```env
APP_NAME=ClientKosmos
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-dominio.com

# ── Base de datos (TiDB Cloud Serverless) ──────────────────────
DB_CONNECTION=mysql
DB_HOST=gateway01.eu-central-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_DATABASE=test
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
DB_SSL_CA=C:\certs\isrgrootx1.pem     # Solo Windows

# ── Sesión ──────────────────────────────────────────────────────
SESSION_DRIVER=database

# ── IA contextual (Groq) ────────────────────────────────────────
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_CA_BUNDLE=C:/certs/cacert.pem    # Solo Windows
```

### Certificados SSL (solo necesarios con TiDB Cloud)

> En desarrollo local con SQLite **no se necesitan certificados**. Solo son necesarios al conectar con TiDB Cloud (`.env.prod`).

| Sistema operativo | Certificados | Acción necesaria |
|-------------------|--------------|------------------|
| **Windows** | No incluidos en PHP/cURL | Descargar con PowerShell (ver [Inicio Rápido](#inicio-rápido)) |
| **Linux / macOS** | Preinstalados en el sistema | Ninguna — `GROQ_CA_BUNDLE` y `DB_SSL_CA` pueden omitirse |

---

## Troubleshooting

| Síntoma | Causa probable | Solución |
|---------|----------------|----------|
| `cURL error 60` al usar la IA | PHP/cURL no encuentra certificados CA (habitual en Windows) | Descargar `cacert.pem` y configurar `GROQ_CA_BUNDLE` en `.env` |
| `cURL error 60` al conectar a BD | Falta el certificado ISRG Root X1 (solo con TiDB Cloud) | Descargar `isrgrootx1.pem` y configurar `DB_SSL_CA` en `.env.prod` |
| Error 419 en formularios | Token CSRF expirado | `php artisan config:clear` + borrar cookies del navegador |
| `RoleDoesNotExist` | Seeders no ejecutados | `php artisan migrate:fresh --seed` |
| Frontend no actualiza | Caché de Vite | Reiniciar `npm run dev` o Ctrl+Shift+R en el navegador |
| `SQLSTATE[HY000]` en conexión BD | Credenciales incorrectas o cert SSL faltante | Verificar `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD` y `DB_SSL_CA` |
| IA no responde / timeout | API key inválida o servicio caído | Verificar `GROQ_API_KEY` y consultar [status.groq.com](https://status.groq.com) |

---

## Documentación

| Documento | Descripción |
|-----------|-------------|
| [docs/manual-usuario.md](docs/manual-usuario.md) | Manual de uso para el usuario final |
| [docs/decisiones-tecnicas.md](docs/decisiones-tecnicas.md) | Justificación técnica de cada decisión de diseño |
| [docs/contexto-proyecto.md](docs/contexto-proyecto.md) | Contexto completo y estado actual del proyecto |
| [docs/clientkosmos-style-guide.md.md](docs/clientkosmos-style-guide.md.md) | Guía de estilos y design system |
| [docs/necesidad-y-justificacion.md](docs/necesidad-y-justificacion.md) | Necesidad y justificación del proyecto |

---

## Fases del Desarrollo

El proyecto se desarrolló en 5 fases incrementales:

| Fase | Descripción | Estado |
|------|-------------|:------:|
| **Fase 1** | Restructuración backend: "Proyectos" → "Clientes", eliminación de módulos no necesarios, limpieza de rutas y modelos | ✅ |
| **Fase 2** | Ficha de cliente completa (tareas + ideas + recursos en una sola vista) y dashboard "Panel Hoy" | ✅ |
| **Fase 3** | IA contextual con 3 endpoints: `plan-day`, `client-summary`, `client-update` (Groq) | ✅ |
| **Fase 4** | Pulido general, landing page, precios actualizados, datos demo en seeders | ✅ |
| **Fase 5** | Rebrand ClientKosmos/Kosmo, Panel Hoy reestructurado, header de contexto por cliente, badges de riesgo, nudges de Kosmo, upgrade prompts contextuales, documentación actualizada | ✅ |

---

## Licencia

MIT — Ver [LICENSE](LICENSE) para más detalles.

---

<div align="center">

**Samuel Ayllón** — Proyecto Intermodular 2º DAM

</div>