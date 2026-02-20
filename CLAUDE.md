# Flowly — Instrucciones para Claude Code

## Proyecto
Plataforma de productividad personal (freemium). Proyecto escolar 2º DAM.
Stack: **Laravel 12 + Inertia.js 2 + React 18 + TypeScript + SQLite + Pest**
UI: **shadcn/ui** (components en `resources/js/components/ui/`)
Auth: Laravel Fortify | Roles: Spatie Permission 6

## Estado actual del proyecto
> Ver `claude/PROJECT_STATE.md` para detalle de qué está hecho y qué falta.

Lo que está creado: **migraciones + modelos** (10 entidades).
Lo que falta: controladores de features, rutas, Form Requests, seeders de roles, páginas React.

## Convenciones — Backend (Laravel)

- **Siempre** usar Form Requests para validación (`authorize()` + `rules()`)
- **Siempre** usar Route Model Binding (nunca `string $id`)
- **Siempre** eager loading con `with()` para evitar N+1
- Mensajes de validación en **español**
- Respuestas via `Inertia::render()` o `redirect()->back()` — **sin JSON/API REST**
- Rutas en `routes/web.php`
- Controladores en `app/Http/Controllers/` (admin en subcarpeta `Admin/`)
- Tests en `tests/Feature/` usando Pest con `RefreshDatabase`

## Convenciones — Frontend (React + TypeScript)

- Archivos en **minúsculas con guiones**: `my-component.tsx`
- Páginas en `resources/js/pages/` (minúsculas)
- Componentes en `resources/js/components/` (minúsculas)
- Layouts en `resources/js/layouts/`
- UI primitives en `resources/js/components/ui/` (shadcn — NO crear nuevos, usar los existentes)
- Usar `useForm` de `@inertiajs/react` para formularios
- Props tipadas con TypeScript

## Enums verificados (crítico — no inventar valores)

| Modelo | Campo | Valores |
|--------|-------|---------|
| Task | status | `pending` \| `completed` — SIN 'in_progress' |
| Task | priority | `low` \| `medium` \| `high` |
| Project | status | `active` \| `created` \| `completed` — SIN 'archived' |
| Idea | status | `active` \| `resolved` — SIN 'archived' |
| Idea | source | `manual` \| `voice` \| `ai_suggestion` |
| Subscription | plan | `free` \| `premium_monthly` \| `premium_yearly` |
| Subscription | status | `active` \| `expired` \| `cancelled` |
| Payment | status | `pending` \| `completed` \| `failed` |
| Resource | type | `link` \| `document` \| `video` \| `image` \| `other` |
| VoiceRecording | status | `pending` \| `processing` \| `completed` \| `failed` |

## Roles y acceso

```
admin          → todo (incluyendo /admin/*)
premium_user   → tareas ilimitadas + projects, boxes, resources, voice, ai-chats
free_user      → solo ideas + máx 5 tareas activas (status='pending')
```

Middleware Spatie: `role:admin`, `role:premium_user|admin`
Límite de tareas: `User::canAddTask()` cuenta WHERE status='pending'

## Advertencias importantes

- `add_fields_to_users_table` está **vacía** — no hay columnas extra en users todavía
- `AiConversation` usa `$timestamps = false` — solo tiene `created_at`
- El seeder por defecto solo crea `test@example.com` — los seeders de roles/usuarios del proyecto **aún no están creados**
- `Task::markAsPending()` existe, NO `markAsInProgress()`
- `Idea::markAsResolved()` / `markAsActive()`, NO `archive()` / `activate()`

## Credenciales de prueba (una vez el seeder esté creado)

```
admin@flowly.test    / password  → admin
premium@flowly.test  / password  → premium_user
free@flowly.test     / password  → free_user
```

## Comandos frecuentes

```bash
php artisan serve                    # backend dev
npm run dev                          # frontend dev (Vite)
php artisan migrate:fresh --seed     # resetear BD
php artisan test                     # todos los tests
php artisan make:controller NombreController
php artisan make:request StoreNombreRequest
php artisan make:test NombreControllerTest
```
