# ClientKosmos

> **Tu memoria operativa por cliente — Gestiona freelance sin perder contexto**

[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat-square&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![PHP](https://img.shields.io/badge/PHP-8.4+-777BB4?style=flat-square&logo=php)](https://www.php.net)
[![Tests](https://img.shields.io/badge/Tests-156%20cases-brightgreen?style=flat-square)]()
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

---

## Tabla de Contenidos

- [Acerca de](#acerca-de)
- [Modelo Freemium](#modelo-freemium)
- [Features](#features)
- [Fases del Desarrollo](#fases-del-desarrollo)
- [Requisitos](#requisitos)
- [Instalacion Rapida](#instalacion-rapida)
- [Credenciales de Prueba](#credenciales-de-prueba)
- [Stack Tecnologico](#stack-tecnologico)
- [Arquitectura](#arquitectura)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Comandos Utiles](#comandos-utiles)
- [Roles y Permisos](#roles-y-permisos)
- [Rutas de la Aplicacion](#rutas-de-la-aplicacion)
- [Testing](#testing)
- [Docker](#docker)
- [Configuracion](#configuracion)
- [Troubleshooting](#troubleshooting)
- [Documentacion](#documentacion)
- [Licencia](#licencia)

---

## Acerca de

**ClientKosmos** es una plataforma web freemium pensada para **freelancers que gestionan varios clientes a la vez**. Cada cliente tiene su propia ficha con tareas, ideas, recursos y contexto, de modo que al cambiar de cliente retomas justo donde lo dejaste.

### Que problema resuelve

La fragmentacion de herramientas (una app para tareas, otra para ideas, otra para enlaces) genera:
- **Perdida de contexto**: al saltar de un cliente a otro se pierden detalles cruciales.
- **Informacion dispersa**: ideas sueltas, enlaces en marcadores, tareas sin vincular a quien pertenecen.
- **Falta de vision diaria**: no hay un lugar que muestre "que tengo que hacer hoy y para quien".

ClientKosmos unifica estas necesidades en fichas de cliente con:

- **Clientes** como unidad central: cada cliente agrupa tareas, ideas y recursos
- **Tareas** con prioridades, fechas de vencimiento y vinculacion a cliente
- **Ideas** para captura rapida, ligadas a un cliente
- **Recursos** (enlaces, documentos, videos) organizados dentro de cada ficha *(Solo Premium)*
- **IA contextual con Kosmo** (asistente IA): planificar el dia, resumen de cliente y parte semanal *(Solo)*
- **Panel Hoy** que muestra tareas del dia agrupadas por cliente con badges de riesgo
- **Nudges contextuales de Kosmo** que sugieren acciones cuando hay tareas vencidas *(Solo)*
- **Upgrade prompts contextuales** que explican el valor de Solo donde el usuario siente el limite

---

## Modelo Freemium

| Plan | Precio | Clientes | Tareas | Ideas | Recursos | IA |
|------|--------|----------|--------|-------|----------|-----|
| **Gratuito** | 0 € | 1 | 5 max pendientes | Ilimitadas | — | — |
| **Solo Mensual** | 11,99 €/mes | Ilimitados | Ilimitadas | Ilimitadas | Si | 3 acciones |
| **Solo Anual** | 119 €/ano | Ilimitados | Ilimitadas | Ilimitadas | Si | 3 acciones |

---

## Features

### Core (Todos los Usuarios)
- Autenticacion completa: registro, login, recuperacion de contrasena, verificacion email, 2FA (Fortify)
- Fichas de cliente con nombre, descripcion, color y estado (activo/inactivo/completado)
- Gestor de tareas vinculadas a cliente con limite free (5 pendientes max) — CRUD + completar/reabrir
- Gestor de ideas sin limite — CRUD + resolver/reactivar
- Panel Hoy con tareas del dia agrupadas por cliente + badges de riesgo (vencidas/proximas)
- Header de contexto en ficha de cliente: tareas pendientes, urgentes, vencidas, proxima entrega, ideas activas
- Badges de riesgo en lista de clientes (vencidas en rojo, proximas en ambar)
- Upgrade prompts contextuales (copy refinado en limites de clientes, tareas e IA)
- Checkout y suscripcion simulada (80% exito / 20% fallo)
- Tutorial interactivo con tour guiado (spotlight + Kosmo chatbot) para nuevos usuarios
- Landing page completa (hero, features, pricing, footer)
- Modo oscuro/claro con persistencia

### Solo (Premium)
- Clientes ilimitados
- Tareas ilimitadas
- Recursos por cliente (enlaces, documentos, videos, imagenes)
- Nudges contextuales de Kosmo (dismissable, reset diario) en Panel Hoy y ficha de cliente
- IA contextual con Kosmo — 3 acciones:
  - `planDay`: planifica tu dia con la informacion de todos tus clientes
  - `clientSummary`: resume el estado actual de un cliente
  - `clientUpdate`: genera un parte semanal detallado para un cliente

### Admin
- Dashboard con estadisticas globales
- Gestion de usuarios (lista paginada + detalle + eliminacion)
- Historial de pagos con resumen de ingresos
- Control de suscripciones con distribucion por plan

---

## Fases del Desarrollo

El proyecto se desarrollo en 5 fases incrementales:

| Fase | Descripcion | Estado |
|------|-------------|--------|
| **Fase 1** | Restructuracion backend: "Proyectos" → "Clientes", eliminacion de Cajas/Voz/Chat, limpieza de rutas y modelos | Completada |
| **Fase 2** | Ficha de cliente completa (tareas + ideas + recursos en una sola vista) y dashboard "Panel Hoy" | Completada |
| **Fase 3** | IA contextual con 3 endpoints: plan-day, client-summary, client-update (Groq) | Completada |
| **Fase 4** | Pulido, landing page, precios actualizados (11,99/119 €), datos demo en seeders, README | Completada |
| **Fase 5** | Rebrand ClientKosmos/Kosmo, Panel Hoy reestructurado, header de contexto por cliente, badges de riesgo, nudges de Kosmo (dismissable), upgrade prompts contextuales, documentación actualizada | Completada |

---

## Requisitos

```
PHP 8.4+
Composer 2.x
Node.js 18+
npm
Git
```

**Para la base de datos (TiDB Cloud):**
```
Certificado SSL ISRG Root X1 (Let's Encrypt)
```

**Para la IA contextual (Groq):**
```
Cuenta gratuita en Groq (https://console.groq.com)
Certificado CA bundle de Mozilla (para Windows)
```

---

## Instalacion Rapida

### 1. Clonar el repositorio
```bash
git clone <repo-url>
cd clientkosmos-samuel-ayllon
```

### 2. Instalar dependencias
```bash
composer install
npm install
```

### 3. Configurar certificados SSL (Windows)

> **IMPORTANTE:** En Windows, PHP/cURL no incluye certificados SSL por defecto. Necesitas descargarlos manualmente para que funcione tanto la conexion a la base de datos (TiDB Cloud) como la IA contextual (Groq).

Abre **PowerShell como administrador** y ejecuta:

```powershell
# Crear directorio de certificados
mkdir C:\certs

# Descargar certificado ISRG Root X1 (necesario para TiDB Cloud)
Invoke-WebRequest -Uri "https://letsencrypt.org/certs/isrgrootx1.pem" -OutFile "C:\certs\isrgrootx1.pem"

# Descargar CA bundle de Mozilla (necesario para Groq/IA contextual)
Invoke-WebRequest -Uri "https://curl.se/ca/cacert.pem" -OutFile "C:\certs\cacert.pem"
```

Esto descarga:
- `C:\certs\isrgrootx1.pem` — Certificado raiz de Let's Encrypt, requerido para la conexion SSL a TiDB Cloud Serverless.
- `C:\certs\cacert.pem` — Bundle completo de autoridades certificadoras de Mozilla, requerido para que cURL/PHP pueda verificar el certificado SSL de la API de Groq (y cualquier otro servicio HTTPS).

> **Linux/macOS:** Estos sistemas ya incluyen los certificados CA del sistema. No es necesario descargarlos manualmente.

### 4. Configurar entorno
```bash
cp .env.example .env
php artisan key:generate
```

Edita el archivo `.env` con tus credenciales:

```env
# ── Base de datos (TiDB Cloud) ─────────────────────────────────
DB_CONNECTION=mysql
DB_HOST=gateway01.eu-central-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_DATABASE=test
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
DB_SSL_CA=C:\certs\isrgrootx1.pem

# ── IA contextual (Groq — gratuito) ────────────────────────────
GROQ_API_KEY=gsk_tu_clave_aqui
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_CA_BUNDLE=C:/certs/cacert.pem
```

> **Obtener la API key de Groq:** Registrate gratis en [console.groq.com](https://console.groq.com), ve a "API Keys" y genera una nueva clave. El plan gratuito permite 14.400 peticiones/dia.

### 5. Migrar base de datos con datos de prueba
```bash
php artisan migrate:fresh --seed
```

Esto crea 3 usuarios de prueba con datos demo: clientes, tareas, ideas y recursos.

### 6. Iniciar servidor
```bash
# Terminal 1 — Backend
php artisan serve

# Terminal 2 — Frontend (Vite)
npm run dev
```

### 7. Acceder
```
http://localhost:8000
```

---

## Credenciales de Prueba

Despues de `php artisan migrate:fresh --seed`:

| Rol | Email | Password | Datos demo |
|-----|-------|----------|------------|
| Admin | admin@clientkosmos.test | password | — |
| Premium (Solo) | premium@clientkosmos.test | password | 3 clientes, tareas, ideas, recursos |
| Free | free@clientkosmos.test | password | 1 cliente, 3 tareas, 1 idea |

---

## Stack Tecnologico

### Backend

| Tecnologia | Version | Proposito |
|-----------|---------|----------|
| Laravel | 12 | Framework principal |
| Eloquent | (Laravel 12) | ORM |
| Laravel Fortify | 1.x | Autenticacion (login, registro, 2FA, verificacion) |
| Spatie Permission | 7.x | Roles y permisos (admin, premium_user, free_user) |
| Pest | 3.x | Testing (156 test cases) |
| openai-php/client | 0.19 | Cliente SDK para IA (Groq via API OpenAI-compatible) |
| Laravel Wayfinder | 0.1.9 | Generacion de rutas tipadas para TypeScript |

### Frontend

| Tecnologia | Version | Proposito |
|-----------|---------|----------|
| React | 19 | UI interactiva |
| TypeScript | 5.7 | Tipado estatico |
| Inertia.js | 2.3 | Puente Laravel-React (SPA monolitica sin API REST) |
| shadcn/ui | — | Componentes UI (Radix UI + Tailwind) |
| Tailwind CSS | 4.0 | Estilos utility-first con tokens custom |
| Lucide React | 0.475 | Iconos |
| Vite | 7 | Bundler con React Compiler |

### Base de Datos

| Entorno | Motor | Conexion |
|---------|-------|----------|
| Produccion / Desarrollo | TiDB Cloud Serverless (MySQL-compatible) | Puerto 4000, SSL obligatorio (ISRG Root X1) |
| Tests | SQLite (in-memory) | Cero configuracion |

### Integraciones IA

| Servicio | Uso | Plan gratuito | Configuracion |
|---------|-----|---------------|---------------|
| **Groq** (usado) | IA contextual — Llama 3.3 70B | 14.400 req/dia | `GROQ_API_KEY` + `GROQ_CA_BUNDLE` |
| OpenAI GPT | Alternativa compatible | De pago | Cambiar `GROQ_BASE_URL` y `GROQ_API_KEY` |

---

## Arquitectura

### Patron general
ClientKosmos sigue el patron **SPA monolitica** con Inertia.js: el backend Laravel renderiza paginas React directamente sin necesidad de una API REST separada. Esto simplifica autenticacion, validacion y navegacion.

### Capas de la aplicacion

```
[Browser] <--Inertia--> [Laravel Controllers] <--Eloquent--> [TiDB Cloud (MySQL)]
                              |
                         [Policies]     → Autorizacion por ownership
                         [Middleware]   → Roles (Spatie)
                         [FormRequests] → Validacion de entrada
                         [Models]       → Logica de negocio
                              |
                    [OpenAI PHP Client] → Groq API (IA contextual)
```

### Integracion IA — Groq via OpenAI SDK

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

El `AiController` lo recibe por inyeccion de dependencias y lo usa para las 3 acciones contextuales. Toda la configuracion esta en `config/services.php` bajo la clave `groq`.

### Decisiones clave
- **Clientes = Projects**: internamente el modelo se llama `Project`, las URLs usan `/clients` y la UI dice "Clientes"
- **Ideas**: el modelo se llama `Idea`, las URLs usan `/ideas` y la UI dice "Ideas"
- **Hard delete** en Task e Idea (SoftDeletes eliminado)
- **Limite de tareas free**: `User::canAddTask()` cuenta tareas con `status='pending'`
- **Pago simulado**: `Payment::process()` con 80% exito, almacena solo ultimos 4 digitos de tarjeta
- **IA contextual**: 3 endpoints que leen tareas, ideas y recursos del cliente para generar respuestas utiles
- **Ruta home**: `inertia('welcome')` sin redirect a login (requerido por tests)

---

## Estructura del Proyecto

```
clientkosmos/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── TaskController.php
│   │   │   ├── IdeaController.php
│   │   │   ├── ProjectController.php         ← Fichas de cliente
│   │   │   ├── ResourceController.php        ← Recursos por cliente
│   │   │   ├── AiController.php              ← IA contextual (3 acciones, inyecta OpenAI\Client)
│   │   │   ├── DashboardController.php       ← Panel Hoy
│   │   │   ├── SubscriptionController.php
│   │   │   ├── CheckoutController.php
│   │   │   ├── TutorialController.php
│   │   │   └── Admin/
│   │   │       ├── AdminDashboardController.php
│   │   │       ├── AdminUserController.php
│   │   │       ├── AdminPaymentController.php
│   │   │       └── AdminSubscriptionController.php
│   │   └── Requests/                          ← Form Requests
│   ├── Models/
│   │   ├── User.php           ← canAddTask(), getDashboardData(), roles
│   │   ├── Task.php           ← scopes, prioridades, hard delete
│   │   ├── Idea.php           ← resolve/reactivate, convertToTask()
│   │   ├── Project.php        ← getProgressPercentage(), "cliente"
│   │   ├── Resource.php       ← Recursos vinculados a cliente
│   │   ├── Subscription.php   ← upgradeToPremium(), hasExpired()
│   │   ├── Payment.php        ← process() simula 80%/20%
│   │   └── AiLog.php          ← Registro de uso de IA
│   ├── Providers/
│   │   └── AppServiceProvider.php ← Singleton OpenAI\Client (Groq)
│   └── Policies/              ← 4 policies (ownership)
├── config/
│   └── services.php           ← Configuracion Groq (api_key, base_url, model, ca_bundle)
├── database/
│   ├── migrations/
│   └── seeders/               ← RoleSeeder + UserSeeder (3 usuarios con datos demo)
├── resources/
│   ├── css/app.css            ← Design system ClientKosmos (tokens, animaciones)
│   └── js/
│       ├── pages/
│       │   ├── welcome.tsx         ← Landing page
│       │   ├── dashboard.tsx       ← Panel Hoy condicional free/premium
│       │   ├── tasks/              ← index, create, edit
│       │   ├── ideas/              ← index, create, edit
│       │   ├── projects/           ← index, show, create, edit (clientes)
│       │   ├── resources/          ← create, edit
│       │   ├── subscription/       ← Planes
│       │   ├── checkout/           ← Pago
│       │   ├── admin/              ← Panel admin (4 vistas)
│       │   ├── auth/               ← Login, registro, 2FA, etc.
│       │   └── settings/           ← Perfil, contrasena, apariencia, 2FA
│       ├── components/
│       │   ├── ui/                 ← Componentes shadcn/ui
│       │   └── tutorial-chatbot.tsx ← Tour con spotlight
│       ├── types/                  ← TypeScript types
│       ├── hooks/                  ← Custom hooks
│       └── layouts/                ← App (sidebar) + Auth (centered)
├── routes/
│   ├── web.php                ← Todas las rutas
│   └── settings.php           ← Rutas de configuracion
├── tests/Feature/             ← 156 test cases (Pest)
├── docs/
│   ├── manual-usuario.md
│   ├── decisiones-tecnicas.md
│   ├── contexto-proyecto.md
│   ├── necesidad-y-justificacion.md
│   └── guia-estilos.md
├── Dockerfile                 ← Multi-stage build (Node + PHP)
├── docker-compose.yml
└── docker-entrypoint.sh       ← Migraciones + seed automaticos
```

---

## Comandos Utiles

### Desarrollo
```bash
php artisan serve          # Servidor Laravel (puerto 8000)
npm run dev                # Frontend con hot reload (Vite)
npm run build              # Build de produccion
composer dev               # Todo junto (serve + queue + vite)
```

### Base de Datos
```bash
php artisan migrate:fresh --seed    # Resetear BD con datos de prueba
php artisan migrate                 # Aplicar nuevas migraciones
```

### Testing
```bash
php artisan test                             # Todos los tests
php artisan test --filter=TaskControllerTest # Test especifico
php artisan test --coverage                  # Con cobertura
composer test                                # Lint + tests
```

### Cache
```bash
php artisan optimize:clear    # Limpia config, cache, vistas
php artisan config:clear      # Solo limpia cache de configuracion
```

### Lint y formato
```bash
npm run lint               # ESLint
npm run format             # Prettier
composer lint              # Laravel Pint
```

---

## Roles y Permisos

### Tres roles (Spatie Permission)

**`admin`** — Solo panel de administracion
- /admin/dashboard, /admin/users, /admin/payments, /admin/subscriptions

**`premium_user`** — Acceso completo (plan Solo)
- Clientes ilimitados, tareas ilimitadas, recursos, IA contextual

**`free_user`** — Acceso limitado
- 1 cliente, maximo 5 tareas pendientes, ideas ilimitadas
- Sin recursos ni IA contextual

### Capas de proteccion

| Nivel | Mecanismo |
|-------|-----------|
| **Rutas** | Middleware `role:premium_user` / `role:admin` (Spatie) |
| **Recursos** | Policies — solo el propietario puede ver/modificar |
| **Logica** | `User::canAddTask()` — valida limite de 5 tareas free |
| **Autenticacion** | Fortify + bloqueo si usuario sin rol asignado |

---

## Rutas de la Aplicacion

### Publicas
```
GET  /          Landing page
GET  /login     Login
GET  /register  Registro
```

### Autenticadas (todos los roles)
```
GET/POST/PUT/DELETE  /clients         Fichas de cliente (CRUD)
PATCH                /clients/{id}/complete
GET/POST/PUT/DELETE  /tasks           Tareas vinculadas a cliente
PATCH                /tasks/{id}/complete | /reopen
GET/POST/PUT/DELETE  /ideas           Ideas
PATCH                /ideas/{id}/resolve | /reactivate
GET                  /subscription    Ver suscripcion
GET/POST             /checkout        Pago simulado
POST                 /tutorial/complete  Marcar tutorial completado
```

### Solo / Premium (solo `premium_user`)
```
POST  /ai/plan-day                    Planificar el dia con IA
POST  /ai/client-summary/{project}    Resumen de cliente con IA
POST  /ai/client-update/{project}     Email de seguimiento con IA
GET/POST      /clients/{project}/resources    Recursos del cliente
PUT/DELETE    /resources/{resource}            Editar/eliminar recurso
```

### Admin (solo `admin`)
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
php artisan test
```

**156 test cases** distribuidos en:

| Area | Cobertura |
|------|-----------|
| Auth | Registro, login, verificacion email, reset password, 2FA |
| Tasks | CRUD, completar/reabrir, limite free, autorizacion |
| Ideas | CRUD, resolver/reactivar, autorizacion |
| Clients | CRUD, completar, ownership |
| Resources | CRUD anidado bajo cliente, autorizacion |
| Checkout | Flujo exito/fallo, validacion tarjeta |
| IA contextual | plan-day, client-summary, client-update, control de roles |
| Admin | Dashboard, usuarios, pagos, suscripciones |
| Settings | Perfil, contrasena, 2FA |

Framework: **Pest 3** con helpers custom (`createAdmin()`, `createPremiumUser()`, `createFreeUser()`).

---

## Docker

```bash
docker compose build
docker compose up
# Acceder en http://localhost:8000
```

- **Multi-stage build**: Node 20 (frontend) + PHP 8.4 (backend)
- `docker-entrypoint.sh` ejecuta migraciones y seeders automaticamente
- Contenedores: `clientkosmos_app` (puerto 8000) + `clientkosmos_db` (MySQL 8.0, puerto 3306)
- Credenciales Docker por defecto: `clientkosmos` / `clientkosmos_secret`
- Usuarios de prueba: `admin@clientkosmos.test`, `premium@clientkosmos.test`, `free@clientkosmos.test` (password: `password`)
- Variable `APP_KEY` se genera automaticamente si no se proporciona
- Para produccion con TiDB Cloud, sobreescribir las variables `DB_*` en el entorno

---

## Configuracion

### Variables de entorno principales (.env)

```env
APP_NAME=ClientKosmos
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# ── Base de datos (TiDB Cloud Serverless) ──────────────────────
DB_CONNECTION=mysql
DB_HOST=gateway01.eu-central-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_DATABASE=test
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
DB_SSL_CA=C:\certs\isrgrootx1.pem

# ── Sesion ──────────────────────────────────────────────────────
SESSION_DRIVER=database

# ── IA contextual (Groq — gratuito, recomendado) ───────────────
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_CA_BUNDLE=C:/certs/cacert.pem
```

### Configuracion de certificados SSL

La aplicacion requiere certificados SSL para dos servicios externos:

| Servicio | Certificado | Ruta por defecto | Variable de entorno |
|----------|-------------|------------------|---------------------|
| **TiDB Cloud** (BD) | ISRG Root X1 (Let's Encrypt) | `C:\certs\isrgrootx1.pem` | `DB_SSL_CA` |
| **Groq** (IA) | CA bundle Mozilla | `C:\certs\cacert.pem` | `GROQ_CA_BUNDLE` |

**Comandos para descargarlos (PowerShell):**
```powershell
mkdir C:\certs
Invoke-WebRequest -Uri "https://letsencrypt.org/certs/isrgrootx1.pem" -OutFile "C:\certs\isrgrootx1.pem"
Invoke-WebRequest -Uri "https://curl.se/ca/cacert.pem" -OutFile "C:\certs\cacert.pem"
```

**En Linux/macOS** estos certificados ya vienen preinstalados en el sistema. Solo necesitas asegurarte de que `php` tenga acceso a ellos (normalmente via `openssl.cafile` en `php.ini`) y puedes omitir `GROQ_CA_BUNDLE` del `.env`.

---

## Troubleshooting

| Problema | Causa | Solucion |
|----------|-------|----------|
| `cURL error 60: SSL peer certificate...` en IA | PHP/cURL no encuentra certificados CA (comun en Windows) | Descargar `cacert.pem` y configurar `GROQ_CA_BUNDLE` en `.env` (ver seccion Configuracion) |
| `cURL error 60` en base de datos | Falta el certificado ISRG Root X1 para TiDB Cloud | Descargar `isrgrootx1.pem` y configurar `DB_SSL_CA` en `.env` |
| Error 419 en formularios | Token CSRF expirado | `php artisan config:clear` + borrar cookies del navegador |
| RoleDoesNotExist | Seeders no ejecutados | `php artisan migrate:fresh --seed` |
| Frontend no actualiza | Cache de Vite | Reiniciar `npm run dev` o Ctrl+Shift+R en el navegador |
| `SQLSTATE[HY000]` en conexion BD | Credenciales incorrectas o cert SSL faltante | Verificar `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD` y que `DB_SSL_CA` apunte al certificado correcto |
| IA no responde / timeout | API key invalida o servicio caido | Verificar `GROQ_API_KEY` en `.env` y que Groq este operativo en [status.groq.com](https://status.groq.com) |

---

## Documentacion

| Documento | Descripcion |
|-----------|-------------|
| [docs/manual-usuario.md](docs/manual-usuario.md) | Manual de uso para el usuario final |
| [docs/decisiones-tecnicas.md](docs/decisiones-tecnicas.md) | Justificacion tecnica de cada decision |
| [docs/contexto-proyecto.md](docs/contexto-proyecto.md) | Contexto completo y estado del proyecto |
| [docs/guia-estilos.md](docs/guia-estilos.md) | Guia de estilos y design system |
| [docs/necesidad-y-justificacion.md](docs/necesidad-y-justificacion.md) | Necesidad y justificacion del proyecto |

---

## Licencia

MIT — Ver [LICENSE](LICENSE) para mas detalles.

---

**Samuel Ayllon** — Proyecto Intermodular 2º DAM
