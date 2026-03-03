# Flowly — Instrucciones para Claude Code

## Proyecto
Plataforma de productividad personal (freemium). Proyecto escolar 2º DAM.
Stack: **Laravel 11 + Inertia.js 2 + React 18 + TypeScript + TiDB Cloud Serverless (MySQL) + Pest**
UI: **shadcn/ui** (components en `resources/js/components/ui/`)
Auth: Laravel Fortify | Roles: Spatie Permission 6

## Estado actual del proyecto
> Ver `.claude/PROJECT_STATE.md` para detalle completo.

**TODO completado. 156/156 tests pasando (590 assertions).**

Lo que está creado: migraciones, modelos, seeders, controladores, Form Requests, Policies, rutas, tests, todas las páginas React con UI real, Design System Flowly, landing page, Docker, documentación, integración OpenAI Whisper (voz a texto).

**Sin pendientes.** Todo el proyecto intermodular está entregable.

## Base de datos

**TiDB Cloud Serverless (MySQL-compatible)**
- Host: `gateway01.eu-central-1.prod.aws.tidbcloud.com` port `4000`
- SSL requerido: ISRG Root X1 CA en `storage/app/tidb-ca.pem` (en .gitignore, no commitear)
- `.env`: `DB_CONNECTION=mysql` + `MYSQL_ATTR_SSL_CA=storage/app/tidb-ca.pem`
- `config/database.php` configura SSL via `array_filter([PDO::MYSQL_ATTR_SSL_CA => env(...)])`

## Seeders (funcionan)

En `database/seeders/`:
- `RoleSeeder` — crea roles: admin, premium_user, free_user (con firstOrCreate)
- `UserSeeder` — crea 3 usuarios con roles y Subscription asignada
- `DatabaseSeeder` — llama a [RoleSeeder, UserSeeder] en orden

## Credenciales de prueba

```
admin@flowly.test    / password  → admin
premium@flowly.test  / password  → premium_user
free@flowly.test     / password  → free_user
```

## Design System Flowly

Aplicado en `resources/css/app.css` y `resources/views/app.blade.php`:

**Colores (shadcn tokens → Flowly):**
- `--background`: `#E9EDC9` | `--card`: `#DAD7CD` | `--primary`: `#3A5A40`
- `--secondary` / `--muted`: `#CAD2C5` | `--foreground`: `#333333`
- `--ring`: `#A1B285` (focus rings) | Dark: fondo `#1a1e1b`, primary `#6b9b73`

**Radius:** lg=16px, md=10px, sm=6px

**Fuentes desde fonts.bunny.net:**
- Nunito 400,600,700,800 → h1, h2, h3
- Open Sans 400,600 → body (font-sans por defecto)
- Inter 400,500,600 → button, label

**Logo:** `resources/js/assets/logo.png` — aplicado en `app-logo.tsx`, auth layouts y `welcome.tsx`

## Páginas implementadas (todas con UI real)

**Auth:** login, register, two-factor-challenge, forgot-password, reset-password, confirm-password, verify-email
**Settings:** profile, password, appearance, two-factor
**Dashboard:** datos reales con condicional free/premium/admin
**Tasks:** index (+ voice quick-create), create (+ voice dictation), edit
**Ideas:** index (+ voice quick-create), create (+ voice dictation), edit
**Projects:** index, show, create, edit
**Boxes:** index, show, create, edit
**Resources:** create, edit
**Subscription:** index
**Checkout:** index
**Landing:** `welcome.tsx` con hero, features (6 tarjetas), pricing (Free/9.99€/99.99€), footer
**Admin:** dashboard, users/index, users/show, payments/index, subscriptions/index

## Estructura de tipos TypeScript (`resources/js/types/`)

```
types/
├── auth.ts          → User (auth), Auth, TwoFactorSetupData
├── navigation.ts    → NavItem, BreadcrumbItem
├── models/          → Task, Idea, Project, Box, Resource,
│                      Subscription, Payment, RecentPayment, Role, VoiceRecording
├── shared/          → PaginatedData<T>
├── pages/           → DashboardProps, TasksProps, IdeasProps,
│                      SubscriptionProps (+ Plan), CheckoutProps (+ CheckoutPlan)
├── admin/           → AdminStats, AdminUser, AdminDashboardProps,
│                      AdminUsersIndexProps, AdminUserShowProps,
│                      AdminPaymentsProps, AdminSubscriptionsProps
└── index.ts         → barrel (re-exports de sub-barrels)
```

## Convenciones — Backend (Laravel)

- **Siempre** usar Form Requests para validación (`authorize()` + `rules()` + `messages()` en español)
- **Siempre** usar Route Model Binding (nunca `string $id`)
- **Siempre** eager loading con `with()` para evitar N+1
- Respuestas via `Inertia::render()` o `redirect()` — **sin JSON/API REST** (excepción: `VoiceRecordingController::transcribe` devuelve JSON para `fetch()` del componente de voz)
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
- Delete en frontend: `router.delete(url)` de `@inertiajs/react` — HTTP DELETE real

## Enums verificados (crítico — no inventar valores)

| Modelo | Campo | Valores |
|--------|-------|---------|
| Task | status | `pending` \| `completed` — SIN 'in_progress' |
| Task | priority | `low` \| `medium` \| `high` |
| Project | status | `active` \| `inactive` \| `completed` — SIN 'archived', SIN 'created' |
| Idea | status | `active` \| `resolved` — SIN 'archived' |
| Idea | source | `manual` \| `voice` \| `ai_suggestion` |
| Subscription | plan | `free` \| `premium_monthly` \| `premium_yearly` |
| Subscription | status | `active` \| `expired` \| `cancelled` |
| Payment | status | `pending` \| `completed` \| `failed` |
| Resource | type | `link` \| `document` \| `video` \| `image` \| `other` |
| VoiceRecording | status | `pending` \| `processing` \| `completed` \| `failed` |

## Roles y acceso

```
admin          → solo panel de administración (/admin/*), NO accede a rutas premium
premium_user   → tareas ilimitadas + projects, boxes, resources, voice (Whisper), ai-chats
free_user      → solo ideas + máx 5 tareas activas (status='pending'), NO voice
```

Middleware Spatie: `role:admin`, `role:premium_user`
Límite de tareas: `User::canAddTask()` cuenta WHERE status='pending'

## Advertencias importantes

- `Task` e `Idea` — **SoftDeletes ELIMINADO** (sesión 2). `delete()` hace hard delete físico.
  La columna `deleted_at` sigue en la BD pero Eloquent NO la gestiona.
- `Task::scopeActive()` existe en el modelo pero es redundante (filtra `deleted_at IS NULL` que siempre es NULL)
- `add_fields_to_users_table` migración está **vacía** — no hay columnas extra en users
- `AiConversation` usa `$timestamps = false` — solo tiene `created_at`
- `Task::markAsPending()` existe, NO `markAsInProgress()`
- `Idea::markAsResolved()` / `markAsActive()`, NO `archive()` / `activate()`
- `HandleInertiaRequests` comparte `is_admin` (bool), `is_premium` (bool), `user` — accesible via `usePage().props.auth`
- `CheckoutController` llama a `Payment::process()` que simula 80% éxito / 20% fallo
- Error de pago en checkout: `usePage().props.errors.payment` (error de página, no de campo)
- `tasks.index` ordena: pendientes antes que completadas; dentro de cada grupo por prioridad DESC
- Task e Idea usan campo `name` (NO `title`)

## Despliegue (Docker)

- `Dockerfile` multi-stage + `docker-compose.yml` + `docker-entrypoint.sh`
- El entrypoint ejecuta migraciones y seeders al arrancar el contenedor

## Integración OpenAI Whisper (Speech-to-Text)

- **Paquete:** `openai-php/client` (Composer)
- **Config:** `config/services.php` → `openai.key`, `.env` → `OPENAI_API_KEY`
- **Endpoint:** `POST /voice/transcribe` (JSON, bajo middleware `role:premium_user`)
- **Controller:** `VoiceRecordingController::transcribe` — guarda audio, llama Whisper API, devuelve transcripción
- **Form Request:** `StoreVoiceRecordingRequest` — valida audio (mimes: webm,ogg,mp4,m4a,wav,mp3, max 25MB)
- **Componente:** `resources/js/components/voice-recorder.tsx` — `MediaRecorder` nativo + fetch + estados idle/recording/processing
- **UI:** Botón "Dictar" en tasks/index, ideas/index (quick-create), tasks/create, ideas/create (dictado de nombre)
- **Ideas con voz:** `source: 'voice'` se pasa desde el frontend; `IdeaController::store` usa `$request->validated('source') ?? 'manual'`

## Archivos clave

- `resources/css/app.css` — tokens de color + fuentes Flowly
- `resources/views/app.blade.php` — carga fuentes desde fonts.bunny.net
- `resources/js/assets/logo.png` — logo real del proyecto
- `.claude/PROJECT_STATE.md` — estado detallado del proyecto
- `docs/decisiones-tecnicas.md` — justificación técnica (requisito intermodular)
- `docs/manual-usuario.md` — manual de usuario (requisito intermodular)
- `storage/app/tidb-ca.pem` — cert SSL TiDB (en .gitignore, no commitear)

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
