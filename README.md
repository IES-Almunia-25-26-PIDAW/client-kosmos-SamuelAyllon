<div align="center">

# 🪐 ClientKosmos

### Plataforma de gestión de consulta para profesionales de servicios

[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat-square&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PHP](https://img.shields.io/badge/PHP-8.4+-777BB4?style=flat-square&logo=php&logoColor=white)](https://www.php.net)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Tests](https://img.shields.io/badge/Tests-97_casos-brightgreen?style=flat-square&logo=checkmarx&logoColor=white)]()
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
| **Notas** | Registro de sesiones anidado por paciente |
| **Acuerdos** | Condiciones del servicio por paciente |
| **Pagos** | Control de cobros (pendiente / pagado / vencido) |
| **Documentos** | Archivos adjuntos por paciente |
| **Consentimientos** | Formularios RGPD y consentimiento informado |
| **Facturación** | Vista consolidada de ingresos con filtros |
| **Kosmo IA** | Briefings diarios + chat contextual con Llama 3.3 70B |
| **Ajustes** | Datos de consulta, fiscales y RGPD |
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
| Laravel Fortify | 1.x | Autenticación (login, registro, 2FA, reset password, verificación email) |
| Spatie Permission | 7.2 | Roles (`admin`, `professional`) y middleware de acceso |
| openai-php/client | 0.19 | Cliente SDK para la API de Groq (compatible con OpenAI) |
| Laravel Wayfinder | 0.1.9 | Rutas tipadas para TypeScript |
| Pest | 3.x | Framework de testing (97 test cases, 487 aserciones) |

### Frontend

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| React | 19 | UI interactiva con React Compiler |
| TypeScript | 5.7 | Tipado estático |
| Inertia.js | 2.3 | Puente Laravel–React (SPA monolítica sin API REST) |
| Tailwind CSS | 4.0 | Estilos utility-first con design system propio |
| shadcn/ui | — | Componentes UI accesibles (Radix UI + Tailwind) |
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
│   │   │   ├── Note/
│   │   │   ├── Agreement/
│   │   │   ├── Payment/
│   │   │   ├── Document/
│   │   │   ├── ConsentForm/
│   │   │   ├── Billing/
│   │   │   ├── Kosmo/
│   │   │   ├── Onboarding/
│   │   │   ├── Settings/         ← Consulta + Profile + Password + 2FA
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
├── tests/Feature/                ← 97 tests (Pest)
├── docs/                         ← Documentación técnica y de usuario
├── deploy/                       ← Docker Compose para producción
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
POST, PUT, DEL       /patients/{patient}/payments/...
POST, DEL            /patients/{patient}/documents/...
POST, PUT            /patients/{patient}/consent-forms/...
GET                  /billing
GET, POST            /kosmo
POST                 /kosmo/chat
POST                 /kosmo/briefings/{briefing}/read
GET, PUT             /settings
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

**97 test cases** — **487 aserciones** — todas en verde ✅

| Módulo | Tests | Cobertura |
|--------|:-----:|-----------|
| AdminController | 11 | CRUD usuarios, restricción de roles |
| AuthController | 6 | Redirecciones post-login por rol, onboarding |
| Auth/Authentication | 6 | Login, logout, rate limiting, 2FA redirect |
| Auth/EmailVerification | 6 | Flujo completo de verificación de email |
| Auth/PasswordConfirmation | 2 | Pantalla de confirmación |
| Auth/PasswordReset | 5 | Reset de contraseña por email |
| Auth/Registration | 3 | Registro + asignación de rol |
| Auth/TwoFactorChallenge | 2 | Desafío 2FA |
| Auth/VerificationNotification | 2 | Reenvío de email de verificación |
| BillingController | 6 | Vista, estadísticas, filtros, aislamiento de datos |
| DashboardController | 7 | Props, métricas, alertas, acceso por rol |
| KosmoController | 7 | Briefings, chat, marcar leídos, autenticación |
| PatientController | 15 | CRUD completo, ownership, pre/post sesión |
| SettingsController | 7 | Vista, actualización de configuración |
| Settings/PasswordUpdate | 3 | Actualización de contraseña |
| Settings/ProfileUpdate | 5 | Perfil, email, eliminación de cuenta |
| Settings/TwoFactorAuthentication | 4 | Configuración 2FA |

Framework: **Pest 3** con `RefreshDatabase`, helpers `createAdmin()` / `createProfessional()` y `withoutVite()` global en `TestCase`.

---

## Docker

### Desarrollo (con build local)

```bash
docker compose up --build   # Primera vez (construye la imagen)
docker compose up -d        # Arranque normal
```

### Producción (sin código fuente)

```bash
cd deploy/
docker compose up -d
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
| `clientkosmos_mailpit` | `axllent/mailpit` | `1025` (SMTP), `8025` (UI) | Servidor de correo |

### Build multi-stage

| Stage | Base | Acción |
|-------|------|--------|
| `deps` | `php:8.4-cli-alpine` | Instala dependencias PHP (Composer) |
| `frontend` | `node:20-alpine` | Compila assets con Vite (`npm run build`) |
| `final` | `php:8.4-fpm-alpine` | Imagen mínima con `vendor/` + `public/build/` |

### Entrypoint automático

Al arrancar el contenedor se ejecuta automáticamente:
1. Copia `.env.example` → `.env` con las variables del compose
2. Genera `APP_KEY` si está vacía
3. Espera a que MySQL esté lista (`mysqladmin ping`)
4. Ejecuta `migrate --force`
5. Ejecuta `db:seed` solo si `users` está vacía
6. Cachea configuración, rutas y vistas
7. Arranca `php artisan serve --host=0.0.0.0 --port=8000`

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
