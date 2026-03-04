# Flowly

> **Plataforma de Productividad Personal — Proyecto Intermodular 2º DAM**

[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat-square&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=flat-square&logo=php)](https://www.php.net)
[![Tests](https://img.shields.io/badge/Tests-180%20%E2%9C%85-brightgreen?style=flat-square)]()

---

## Estado del proyecto (Marzo 2026)

**Proyecto completamente entregable. 180 tests / 692 assertions pasando al 100%.**

Stack: Laravel 12 + Inertia.js 2 + React 18 + TypeScript + TiDB Cloud Serverless (MySQL) + Pest

---

## Features implementadas

### Core (todos los roles)
- Autenticación completa con 2FA (Laravel Fortify)
- Dashboard con datos reales según rol (free / premium / admin)
- Gestor de tareas con prioridades, fechas de vencimiento y filtros
- Gestor de ideas
- Suscripción y checkout con pago simulado (80% éxito / 20% fallo)
- Tutorial interactivo para nuevos usuarios (spotlight + chatbot "Flowy")

### Premium (`premium_user`)
- Proyectos con tareas anidadas
- Cajas de conocimiento con recursos
- Transcripción de voz con OpenAI Whisper (`POST /voice/transcribe`)
- Asistente IA conversacional (`GET|POST|DELETE /ai-chats`) — Groq / OpenAI-compatible

### Admin (`admin`)
- Panel de administración exclusivo en `/admin/*` con UI profesional (Badge, AlertDialog, iconos lucide)
- Gestión de usuarios, pagos y suscripciones
- **Admin NO accede** a rutas premium (/projects, /boxes, /resources, /ai-chats)

---

## Modelo de roles

```
┌─────────────────┬──────────────┬──────────────┬──────────────┐
│ Feature         │ Free (max 5) │ Premium (∞)  │ Admin        │
├─────────────────┼──────────────┼──────────────┼──────────────┤
│ Ideas           │ ✅           │ ✅           │ ✅           │
│ Tasks           │ 5 máx pend.  │ ∞            │ ∞            │
│ Projects        │ ❌           │ ✅           │ ❌           │
│ Boxes/Resources │ ❌           │ ✅           │ ❌           │
│ Voice (Whisper) │ ❌           │ ✅           │ ❌           │
│ IA Assistant    │ ❌           │ ✅           │ ❌           │
│ Admin Panel     │ ❌           │ ❌           │ ✅           │
└─────────────────┴──────────────┴──────────────┴──────────────┘
```

---

## Credenciales de prueba

```
admin@flowly.test    / password  → admin
premium@flowly.test  / password  → premium_user
free@flowly.test     / password  → free_user
```

---

## Inicio rápido

```bash
composer install && npm install
cp .env.example .env && php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve    # Terminal 1
npm run dev          # Terminal 2
# → http://localhost:8000
```

Variables `.env` para IA y voz:
```env
OPENAI_API_KEY=gsk_...
OPENAI_BASE_URL=https://api.groq.com/openai/v1
OPENAI_MODEL=llama-3.3-70b-versatile
```

---

## Tests

```bash
php artisan test             # 180 tests / 692 assertions
php artisan test --filter=TaskControllerTest
```

---

## Archivos de contexto

| Archivo | Contenido |
|---------|-----------|
| `PROJECT_STATE.md` | Historial de sesiones y cambios |
| `QUICK_REFERENCE.md` | Roles, rutas, enums, errores comunes |
| `CHECKLIST_DESARROLLO.md` | Checklist de desarrollo y deploy |
| `INDEX_TOTAL_ARCHIVOS.md` | Mapa completo de archivos |
| `../docs/decisiones-tecnicas.md` | Justificación técnica (requisito intermodular) |
| `../docs/manual-usuario.md` | Manual de usuario (requisito intermodular) |

---

## Advertencias críticas

- `Task` e `Idea` — **SIN SoftDeletes**. `delete()` hace hard delete físico.
- `Project.status` — valores: `active | inactive | completed` — SIN 'created', SIN 'archived'
- `Task.status` — valores: `pending | completed` — SIN 'in_progress'
- `Task.due_date` — **obligatorio** en creación (`required` en StoreTaskRequest)
- Admin NO accede a rutas premium; premium NO accede a `/admin/*`
- `AiConversation` — `$timestamps = false` (solo `created_at`)
- `Task` e `Idea` usan campo `name` (NO `title`)
- `TaskController::create()` acepta `?project_id=X` → auto-asigna proyecto en formulario
