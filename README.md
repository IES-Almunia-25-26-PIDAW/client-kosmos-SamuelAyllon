# Flowly

> **Plataforma de Productividad Personal - Tu Centro de Mando Integrado**

[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat-square&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=flat-square&logo=php)](https://www.php.net)
[![Tests](https://img.shields.io/badge/Tests-180%20passing-brightgreen?style=flat-square)]()
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

---

## 📑 Tabla de Contenidos

- [Acerca de](#acerca-de)
- [Features](#features)
- [Requisitos](#requisitos)
- [Instalación Rápida](#instalación-rápida)
- [Credenciales de Prueba](#credenciales-de-prueba)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Comandos Útiles](#comandos-útiles)
- [Roles y Permisos](#roles-y-permisos)
- [Rutas de la Aplicación](#rutas-de-la-aplicación)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Licencia](#licencia)

---

## 🎯 Acerca de

**Flowly** es una plataforma web de productividad personal freemium que actúa como tu **centro de mando integrado** para gestionar:

- 📝 **Tareas** — Gestor completo con prioridades, fechas de vencimiento obligatorias y asignación a proyecto
- 💡 **Ideas** — Captura rápida de inspiraciones y pensamientos
- 📊 **Proyectos** — Agrupa tareas en proyectos con seguimiento de progreso *(Premium)*
- 📚 **Cajas de Recursos** — Centraliza enlaces, documentos y vídeos *(Premium)*
- 🎙️ **Dictado por Voz** — Crea tareas e ideas hablando con OpenAI Whisper *(Premium)*
- 🤖 **Asistente IA** — Chat de productividad personalizado con Groq/OpenAI *(Premium)*

### Modelo Freemium

| Plan | Precio | Tareas | Ideas | Proyectos | Voz | IA |
|------|--------|--------|-------|-----------|-----|-----|
| **Free** | 0 € | 5 máx | ✅ | ❌ | ❌ | ❌ |
| **Premium Mensual** | 9,99 €/mes | ∞ | ✅ | ✅ | ✅ | ✅ |
| **Premium Anual** | 99,99 €/año | ∞ | ✅ | ✅ | ✅ | ✅ |

---

## ✨ Features

### Core (Todos los Usuarios) — ✅ Completado
- ✅ Autenticación completa (registro, login, recuperación de contraseña, verificación email, 2FA) — Fortify
- ✅ Gestor de tareas con límite free (backend + frontend + tests)
- ✅ Gestor de ideas sin límite (backend + frontend + tests)
- ✅ Checkout y suscripción simulada (backend + frontend + tests)
- ✅ Dashboard personal con datos reales (condicional por plan)
- ✅ Tutorial interactivo con tour guiado para nuevos usuarios (spotlight + chatbot)
- ✅ Landing page completa (hero, features, pricing, footer)

### Premium Features — ✅ Completado
- ✅ Proyectos con agrupación de tareas y barra de progreso
- ✅ Cajas de recursos (enlaces, documentos, vídeos, imágenes)
- ✅ Transcripción de voz con OpenAI Whisper (quick-create + dictado en formulario)
- ✅ Asistente IA conversacional con contexto real del usuario (Groq Llama 3.3 / OpenAI GPT)

### Admin Features — ✅ Completado
- ✅ Dashboard con estadísticas globales (iconos por stat, cards mejoradas)
- ✅ Gestión de usuarios (lista paginada + detalle + AlertDialog para eliminar)
- ✅ Historial de pagos con resumen de ingresos (badges shadcn, iconos lucide)
- ✅ Control de suscripciones con distribución por plan
- ✅ UI admin al mismo nivel visual que vistas de usuario (headers, Badge, AlertDialog, estados vacíos)

---

## 🔧 Requisitos

```
PHP 8.2+
Composer
Node.js 18+
npm
Git
SQLite (incluido con PHP) — para desarrollo local
```

**Opcional:**
```
OpenAI API Key o Groq API Key (gratuita) — para Whisper y asistente IA
```

---

## 🚀 Instalación Rápida

### 1. Clonar el repositorio
```bash
git clone <repo-url>
cd flowly-samuel-ayllon
```

### 2. Instalar dependencias
```bash
composer install
npm install
```

### 3. Configurar entorno
```bash
cp .env.example .env
php artisan key:generate
```

### 4. Base de datos
```bash
touch database/database.sqlite
php artisan migrate:fresh --seed
```

### 5. Variables de entorno opcionales
```env
# Asistente IA y voz (Groq — gratuito)
OPENAI_API_KEY=gsk_xxxxxxxxxxxxxxxx
OPENAI_BASE_URL=https://api.groq.com/openai/v1
OPENAI_MODEL=llama-3.3-70b-versatile

# O con OpenAI directamente
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-3.5-turbo
```

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

## 👤 Credenciales de Prueba

Después de `php artisan migrate:fresh --seed`:

```
┌─────────────────┬───────────────────────┬──────────┐
│ Rol             │ Email                 │ Password │
├─────────────────┼───────────────────────┼──────────┤
│ Admin           │ admin@flowly.test     │ password │
│ Premium User    │ premium@flowly.test   │ password │
│ Free User       │ free@flowly.test      │ password │
└─────────────────┴───────────────────────┴──────────┘
```

---

## 📚 Stack Tecnológico

### Backend
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **Laravel** | 12 | Framework principal |
| **Eloquent** | (Laravel 12) | ORM |
| **Laravel Fortify** | 1.x | Autenticación |
| **Spatie Permission** | 6.x | Roles y permisos |
| **Pest** | 3.x | Testing |
| **openai-php/client** | 0.19 | OpenAI Whisper + Chat IA |

### Frontend
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **React** | 18+ | UI interactiva |
| **TypeScript** | 5+ | Tipado estático |
| **Inertia.js** | 2.x | Puente Laravel ↔ React (SPA monolítica) |
| **shadcn/ui** | — | Componentes UI (Radix UI + Tailwind) |
| **Vite** | 5+ | Bundler |

### Base de Datos
| Entorno | Motor |
|---------|-------|
| **Desarrollo / Tests** | SQLite (sin configuración) |
| **Producción** | TiDB Cloud Serverless (MySQL-compatible) |

### Integraciones IA
| Servicio | Uso | Plan gratuito |
|---------|-----|---------------|
| **Groq** (recomendado) | Chat IA — Llama 3.3 70B | ✅ 14.400 req/día |
| **OpenAI Whisper** | Transcripción de voz | ❌ De pago |
| **OpenAI GPT** | Chat IA alternativo | ❌ De pago |

---

## 📁 Estructura del Proyecto

```
flowly/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── TaskController.php
│   │   │   ├── IdeaController.php
│   │   │   ├── ProjectController.php
│   │   │   ├── BoxController.php
│   │   │   ├── ResourceController.php
│   │   │   ├── SubscriptionController.php
│   │   │   ├── CheckoutController.php
│   │   │   ├── VoiceRecordingController.php  ← Whisper API
│   │   │   ├── AiChatController.php          ← Chat IA
│   │   │   ├── TutorialController.php        ← Tour guiado
│   │   │   └── Admin/
│   │   │       ├── AdminDashboardController.php
│   │   │       ├── AdminUserController.php
│   │   │       ├── AdminPaymentController.php
│   │   │       └── AdminSubscriptionController.php
│   │   └── Requests/                         ← Form Requests con validación en español
│   ├── Models/
│   │   ├── User.php          ← hasRole, canAddTask(), completeTutorial()
│   │   ├── Task.php          ← sin SoftDeletes (hard delete)
│   │   ├── Idea.php          ← sin SoftDeletes (hard delete)
│   │   ├── Project.php
│   │   ├── Box.php
│   │   ├── Resource.php
│   │   ├── Subscription.php
│   │   ├── Payment.php       ← process() simula 80%/20%
│   │   ├── AiConversation.php
│   │   └── VoiceRecording.php
│   └── Policies/             ← TaskPolicy, IdeaPolicy, ProjectPolicy, BoxPolicy, ResourcePolicy
├── database/
│   ├── migrations/           ← 13 tablas
│   └── seeders/
│       ├── RoleSeeder.php    ← admin, premium_user, free_user
│       └── UserSeeder.php    ← 3 usuarios de prueba
├── resources/js/
│   ├── pages/
│   │   ├── auth/             ← login, register, 2fa, forgot-password, reset, verify
│   │   ├── settings/         ← profile, password, appearance, two-factor
│   │   ├── dashboard.tsx     ← condicional free/premium + tutorial
│   │   ├── tasks/            ← index, create, edit
│   │   ├── ideas/            ← index, create, edit
│   │   ├── projects/         ← index, show, create, edit
│   │   ├── boxes/            ← index, show, create, edit
│   │   ├── resources/        ← create, edit
│   │   ├── subscription/     ← index
│   │   ├── checkout/         ← index
│   │   ├── ai-chats/         ← index (chat IA)
│   │   ├── admin/            ← dashboard, users/, payments/, subscriptions/
│   │   └── welcome.tsx       ← landing page
│   ├── components/
│   │   ├── ui/               ← shadcn/ui primitivos
│   │   ├── voice-recorder.tsx ← MediaRecorder + Whisper
│   │   └── tutorial-chatbot.tsx ← tour guiado con spotlight
│   └── types/
│       ├── models/           ← Task, Idea, Project, Box, Resource, AiMessage...
│       ├── pages/            ← props por página
│       ├── admin/            ← props admin
│       └── shared/           ← PaginatedData<T>
├── routes/web.php
├── tests/Feature/            ← 180 tests Pest / 692 assertions
├── docs/
│   ├── manual-usuario.md
│   └── decisiones-tecnicas.md
├── Dockerfile                ← multi-stage build
├── docker-compose.yml
└── docker-entrypoint.sh
```

---

## 💻 Comandos Útiles

### Desarrollo
```bash
php artisan serve          # Servidor Laravel
npm run dev                # Frontend con hot reload
npm run build              # Build de producción
```

### Base de Datos
```bash
php artisan migrate:fresh --seed    # Resetear BD con datos de prueba
php artisan migrate                 # Aplicar nuevas migraciones
php artisan db:seed --class=RoleSeeder
```

### Testing
```bash
php artisan test                             # Todos los tests
php artisan test --filter=TaskControllerTest # Test específico
php artisan test --coverage                  # Con cobertura
```

### Caché
```bash
php artisan optimize:clear    # Limpia config, caché, vistas
php artisan config:clear
```

---

## 🔐 Roles y Permisos

### Tres roles implementados (Spatie Permission)

#### `admin` — Solo panel de administración
```
✅ /admin/dashboard
✅ /admin/users
✅ /admin/payments
✅ /admin/subscriptions
❌ NO accede a /projects, /boxes, /resources, /ai-chats
```

#### `premium_user` — Acceso completo de usuario
```
✅ Tareas ilimitadas
✅ Proyectos y cajas de recursos
✅ Dictado por voz (Whisper)
✅ Asistente IA
```

#### `free_user` — Acceso limitado
```
✅ Ideas ilimitadas
✅ Máximo 5 tareas en estado "pending" simultáneamente
❌ Sin proyectos, voz ni IA
```

### Capas de protección

| Nivel | Mecanismo |
|-------|-----------|
| **Rutas** | Middleware `role:premium_user` / `role:admin` (Spatie) |
| **Recursos** | Policies — solo el propietario puede modificar |
| **Lógica** | `User::canAddTask()` — valida límite de 5 tareas free |

---

## 🔗 Rutas de la Aplicación

### Públicas
```
GET  /          Landing page
GET  /login     Login
GET  /register  Registro
```

### Autenticadas (todos los roles de usuario)
```
GET/POST/PUT/DELETE  /tasks           Gestión de tareas
GET/POST/PUT/DELETE  /ideas           Gestión de ideas
GET                  /subscription    Ver suscripción y planes
GET/POST             /checkout        Pago simulado
POST                 /tutorial/complete  Marcar tutorial completado
```

### Premium (solo `premium_user`)
```
GET/POST/PUT/DELETE  /projects                    Proyectos
GET/POST/PUT/DELETE  /boxes                       Cajas
GET/POST/PUT/DELETE  /boxes/{box}/resources        Recursos en cajas
POST                 /voice/transcribe             Transcripción Whisper (JSON)
GET/POST/DELETE      /ai-chats                    Chat con IA
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

## 🧪 Testing

```bash
php artisan test
```

**Estado actual: 180 tests / 692 assertions — 100% pasando**

Cobertura:
- ✅ CRUD completo de todas las entidades
- ✅ Autorización por rol y ownership
- ✅ Validación (casos válidos e inválidos)
- ✅ Límite de tareas en plan free
- ✅ Flujo de checkout (éxito y fallo)
- ✅ Transcripción de voz (Whisper)
- ✅ Chat IA (store, destroy, historial)
- ✅ Tutorial (completar)
- ✅ Panel de administración

---

## ⚙️ Configuración — .env

```env
APP_NAME=Flowly
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Base de datos (SQLite para dev)
DB_CONNECTION=sqlite

# Sesión
SESSION_DRIVER=file

# IA y voz — Groq (gratuito, recomendado)
OPENAI_API_KEY=gsk_xxxxxxxxxxxxxxxx
OPENAI_BASE_URL=https://api.groq.com/openai/v1
OPENAI_MODEL=llama-3.3-70b-versatile

# IA y voz — OpenAI (de pago)
# OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
# OPENAI_BASE_URL=https://api.openai.com/v1
# OPENAI_MODEL=gpt-3.5-turbo
```

---

## 🐛 Troubleshooting

### Error 419 al hacer login o enviar formularios
```bash
# Limpiar sesiones y caché de configuración
rm -f storage/framework/sessions/*
php artisan config:clear
# Borrar cookies del navegador para localhost
```

### Error SSL en llamadas a OpenAI/Groq (Windows)
```bash
# Descargar certificados CA y configurar en php.ini
# curl.cainfo = "ruta/a/cacert.pem"
# openssl.cafile = "ruta/a/cacert.pem"
```

### "Spatie\Permission\Exceptions\RoleDoesNotExist"
```bash
php artisan migrate:fresh --seed
```

### "No such file or directory" en database.sqlite
```bash
touch database/database.sqlite
php artisan migrate --seed
```

### Frontend no actualiza
```bash
npm run dev    # Reiniciar Vite
# O Ctrl+Shift+R en el navegador para forzar recarga
```

### OpenAI API: Rate limit / Error 422 en chat IA
```
Verificar que OPENAI_API_KEY tiene créditos disponibles.
Alternativa gratuita: usar Groq (console.groq.com)
```

---

## 🐳 Docker

```bash
# Construir imagen
docker compose build

# Iniciar (ejecuta migraciones y seeders automáticamente)
docker compose up

# Acceder
http://localhost:8000
```

El `docker-entrypoint.sh` ejecuta `migrate --force` y `db:seed` al arrancar.

---

## 📖 Documentación

| Documento | Descripción |
|-----------|-------------|
| [docs/manual-usuario.md](docs/manual-usuario.md) | Manual de uso para el usuario final |
| [docs/decisiones-tecnicas.md](docs/decisiones-tecnicas.md) | Justificación técnica de cada decisión de arquitectura |
| [.claude/PROJECT_STATE.md](.claude/PROJECT_STATE.md) | Estado detallado del proyecto (sesión a sesión) |

---

## 📄 Licencia

MIT — Ver [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Samuel Ayllón** — Proyecto Intermodular 2º DAM

---

<div align="center">

**Hecho con ❤️ para productividad personal**

[⬆ Volver al inicio](#flowly)

</div>
