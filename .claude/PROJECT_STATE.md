# Flowly — Estado Real del Proyecto
> Última actualización: 2026-03-03 (sesión 5). Actualizar este archivo al completar cada sección.

---

## Resumen de progreso

| Capa | Estado |
|------|--------|
| Migraciones | ✅ Todas creadas (13 tablas) |
| Modelos Eloquent | ✅ Todos creados — Task e Idea sin SoftDeletes (hard delete desde sesión 2) |
| Seeders | ✅ RoleSeeder + UserSeeder + DatabaseSeeder — 3 usuarios, 3 roles, 3 suscripciones |
| Rutas | ✅ Todas creadas (tasks, ideas, projects, boxes, resources, subscription, checkout, admin) |
| Controladores features | ✅ TaskController, IdeaController, ProjectController, BoxController, ResourceController, SubscriptionController, CheckoutController |
| Controladores admin | ✅ AdminDashboardController, AdminUserController, AdminPaymentController, AdminSubscriptionController |
| Form Requests | ✅ StoreTask/Update, StoreIdea/Update, StoreProject/Update, StoreBox/Update, StoreResource/Update, CheckoutRequest, StoreVoiceRecording |
| Policies | ✅ TaskPolicy, IdeaPolicy, ProjectPolicy, BoxPolicy, ResourcePolicy |
| Tests | ✅ 160/160 pasando (596 assertions) |
| Frontend — Auth | ✅ Páginas login, register, 2FA, forgot-password (Fortify) |
| Frontend — Settings | ✅ Páginas profile, password, appearance, two-factor |
| Frontend — Dashboard | ✅ Implementado (free: tareas+ideas, premium: +proyectos, admin: redirige) |
| Frontend — Admin | ✅ Las 5 vistas admin implementadas con UI real |
| Frontend — Types | ✅ Reorganizado en subcarpetas models/ shared/ pages/ admin/ |
| Frontend — Features usuario | ✅ Todas las vistas de usuario implementadas con UI real + voz (Whisper) |
| Frontend — Features premium | ✅ Todas las vistas premium implementadas con UI real |
| Frontend — Landing | ✅ welcome.tsx con hero, features, pricing y footer |
| Frontend — Design System | ✅ Flowly Design System aplicado (colores, fuentes, radius, shadows) |
| Frontend — Tutorial | ✅ Chatbot tutorial interactivo para nuevos usuarios |
| Frontend — Logo | ✅ Logo real en todas las vistas (navbar, auth layouts, sidebar) |
| Base de datos | ✅ Migrada de SQLite a TiDB Cloud Serverless (MySQL) |
| Despliegue (Docker) | ✅ Dockerfile + docker-compose.yml + .dockerignore + docker-entrypoint.sh |
| Manual de usuario | ✅ docs/manual-usuario.md — 10 secciones |
| Justificación técnica | ✅ docs/decisiones-tecnicas.md — 9 secciones |
| Ramas Git | ✅ Justificado en docs/decisiones-tecnicas.md §8 (proyecto unipersonal) |
| Código comentado | ✅ Comentarios en lógica compleja (orderByRaw, diffInDays, canAddTask, etc.) |

---

## Backend — Detalle

### ✅ Migraciones creadas
- `create_users_table` (base Laravel)
- `add_two_factor_columns_to_users_table` (Fortify)
- `create_permission_tables` (Spatie)
- `add_fields_to_users_table` ⚠️ **VACÍA — no hay columnas extra en users**
- `create_subscriptions_table`
- `create_payments_table`
- `create_projects_table`
- `create_tasks_table` — tiene columna `deleted_at` (de la migración original) pero el modelo ya no usa SoftDeletes
- `create_ideas_table` — ídem
- `create_boxes_table`
- `create_resources_table`
- `create_ai_conversations_table`
- `create_voice_recordings_table`

### ✅ Modelos creados
Todos en `app/Models/`: User, Subscription, Payment, Project, Task, Idea, Box, Resource, AiConversation, VoiceRecording

**Notas importantes de modelos:**
- `Task` e `Idea` — **SoftDeletes ELIMINADO** en sesión 2. `delete()` hace hard delete físico.
  La columna `deleted_at` sigue en la BD pero Eloquent ya no la gestiona.
- `AiConversation` — `$timestamps = false`, solo tiene `created_at`
- `Task::markAsPending()` existe, NO `markAsInProgress()`
- `Idea::markAsResolved()` / `markAsActive()`, NO `archive()` / `activate()`
- `Task::scopeActive()` sigue en el modelo pero es redundante (siempre filtra `deleted_at IS NULL`, que siempre es NULL ahora)

### ✅ Seeders creados
En `database/seeders/`:
- `RoleSeeder` — crea roles: admin, premium_user, free_user (con firstOrCreate)
- `UserSeeder` — crea 3 usuarios con roles y Subscription asignada
- `DatabaseSeeder` — llama a [RoleSeeder, UserSeeder] en orden

### ✅ Controladores creados
En `app/Http/Controllers/`:
- `TaskController` — CRUD + complete + reopen (authorize via TaskPolicy)
- `IdeaController` — CRUD + resolve + reactivate (authorize via IdeaPolicy)
- `ProjectController` — CRUD completo (authorize via ProjectPolicy)
- `BoxController` — CRUD completo (authorize via BoxPolicy)
- `ResourceController` — create/store (nested bajo box) + edit/update/destroy (authorize via ResourcePolicy)
- `SubscriptionController` — index (muestra planes y suscripción activa)
- `CheckoutController` — index + store (pago simulado via Payment::process())
- `VoiceRecordingController` — transcribe (recibe audio, llama OpenAI Whisper API, devuelve JSON con transcripción)
- `TutorialController` — complete (marca tutorial como completado para el usuario)

En `app/Http/Controllers/Admin/`:
- `AdminDashboardController` — stats globales + recent payments/users
- `AdminUserController` — index + show + destroy
- `AdminPaymentController` — index con resumen
- `AdminSubscriptionController` — index con resumen por plan

### ✅ Form Requests creados
En `app/Http/Requests/`:
- `StoreTaskRequest` / `UpdateTaskRequest`
- `StoreIdeaRequest` / `UpdateIdeaRequest`
- `StoreProjectRequest` / `UpdateProjectRequest`
- `StoreBoxRequest` / `UpdateBoxRequest`
- `StoreResourceRequest` / `UpdateResourceRequest`
- `CheckoutRequest`
- `StoreVoiceRecordingRequest`

### ✅ Policies creadas
En `app/Policies/`:
- `TaskPolicy` — update + delete (owner check: `$user->id === $task->user_id`)
- `IdeaPolicy` — update + delete (owner check)
- `ProjectPolicy` — view + update + delete (owner check)
- `BoxPolicy` — view + update + delete (owner check)
- `ResourcePolicy` — update + delete (owner check)

### ✅ Rutas creadas (`routes/web.php`)
```php
// Autenticadas (todos)
tasks.*          → TaskController (CRUD + complete + reopen)
ideas.*          → IdeaController (CRUD + resolve + reactivate)
subscription.*   → SubscriptionController (index)
checkout.*       → CheckoutController (index + store)

// Premium (solo premium_user — admin NO tiene acceso)
projects.*       → ProjectController (CRUD)
boxes.*          → BoxController (CRUD)
resources.*      → ResourceController (create/store nested en box; edit/update/destroy standalone)
voice.transcribe → VoiceRecordingController@transcribe (POST, JSON response)

// Admin (/admin/*)
admin.dashboard  → AdminDashboardController@index
admin.users.*    → AdminUserController (index, show, destroy)
admin.payments.* → AdminPaymentController@index
admin.subscriptions.* → AdminSubscriptionController@index
```

---

## Frontend — Detalle

### ✅ Design System Flowly
Aplicado en `resources/css/app.css` y `resources/views/app.blade.php`:

**Colores (shadcn tokens → Flowly):**
- `--background`: `#E9EDC9` (bgBase)
- `--card`: `#DAD7CD` (bgElevated)
- `--primary`: `#3A5A40` (verde Flowly)
- `--secondary` / `--muted`: `#CAD2C5` (bgMuted)
- `--foreground`: `#333333` (textMain)
- `--muted-foreground`: `rgba(51,51,51,0.7)` (textMuted)
- `--ring`: `#A1B285` (primarySoft — focus rings)
- `--border` / `--input`: `rgba(51,51,51,0.12)` (borderSubtle)
- `--accent`: `#DAD7CD` (bgElevated — hover en menús)
- Charts: paleta Flowly `#3A5A40` → `#884A37`

**Radius:** lg=16px, md=10px, sm=6px

**Fuentes cargadas desde fonts.bunny.net:**
- Nunito 400,600,700,800 → h1, h2, h3 (via `@layer base`)
- Open Sans 400,600 → body (font-sans por defecto)
- Inter 400,500,600 → button, label (via `@layer base`)

**Dark mode:** fondos verde-oscuro (`#1a1e1b`), primary aclarado a `#6b9b73`

### ✅ Logo
Logo real (`resources/js/assets/logo.png`) aplicado en:
- `app-logo.tsx` — header del sidebar, texto "Flowly"
- `app-header.tsx` — drawer mobile
- `auth-card-layout.tsx`, `auth-simple-layout.tsx`, `auth-split-layout.tsx`
- `welcome.tsx` — navbar y footer

### ✅ Componentes UI disponibles (shadcn/ui)
En `resources/js/components/ui/`:
alert, avatar, badge, breadcrumb, button, card, checkbox, collapsible,
dialog, dropdown-menu, icon, input, input-otp, label, navigation-menu,
placeholder-pattern, select, separator, sheet, sidebar, skeleton, spinner,
toggle, toggle-group, tooltip

### ✅ Layouts disponibles
- `app-layout.tsx` — layout principal con sidebar
- `auth-layout.tsx` — layout de autenticación
- `layouts/app/app-sidebar-layout.tsx` — layout con sidebar lateral
- `layouts/app/app-header-layout.tsx` — layout con header
- `layouts/settings/layout.tsx` — layout de configuración

### ✅ Hooks disponibles
- `use-appearance.tsx` — tema claro/oscuro
- `use-mobile.tsx` — detección mobile
- `use-initials.tsx` — iniciales de nombre
- `use-clipboard.ts`, `use-current-url.ts`, `use-mobile-navigation.ts`, `use-two-factor-auth.ts`

### ✅ Páginas con UI real — Auth / Settings
- `pages/auth/` — login, register, 2FA, reset, verify, forgot
- `pages/settings/` — profile, password, appearance, two-factor

### ✅ Páginas con UI real — Dashboard y Admin
- `pages/dashboard.tsx` — dashboard con datos reales (free/premium condicional)
- `pages/admin/dashboard.tsx` — stats globales + pagos/usuarios recientes
- `pages/admin/users/index.tsx` — lista paginada con roles, plan, conteos
- `pages/admin/users/show.tsx` — detalle usuario: actividad, suscripción, pagos
- `pages/admin/payments/index.tsx` — resumen + lista paginada con estado e importe
- `pages/admin/subscriptions/index.tsx` — resumen por plan + lista paginada

### ✅ Páginas con UI real — Features usuario (todos)
- `pages/tasks/index.tsx` — lista pendientes/completadas, prioridad, fecha vencimiento, proyecto, botón voz (premium)
- `pages/tasks/create.tsx` — formulario completo, proyectos opcionales (premium), dictado por voz (premium)
- `pages/tasks/edit.tsx` — formulario pre-rellenado
- `pages/ideas/index.tsx` — lista activas/resueltas, prioridad, resolve/reactivate/delete, botón voz (premium)
- `pages/ideas/create.tsx` — formulario completo, dictado por voz (premium)
- `pages/ideas/edit.tsx` — formulario pre-rellenado
- `pages/subscription/index.tsx` — plan actual + comparativa de planes
- `pages/checkout/index.tsx` — selector de plan + formulario de tarjeta simulado

### ✅ Páginas con UI real — Features premium
- `pages/projects/index.tsx` — cuadrícula con estado, color, contadores de tareas
- `pages/projects/show.tsx` — detalle con stats, barra de progreso, tareas por estado
- `pages/projects/create.tsx` — formulario con selector de color visual
- `pages/projects/edit.tsx` — ídem + selector de estado
- `pages/boxes/index.tsx` — cuadrícula con categoría y contador de recursos
- `pages/boxes/show.tsx` — detalle con lista de recursos, tipo badge, enlace clicable
- `pages/boxes/create.tsx` — formulario con nombre, categoría, descripción
- `pages/boxes/edit.tsx` — ídem pre-rellenado
- `pages/resources/create.tsx` — formulario con tipo, nombre, URL, descripción
- `pages/resources/edit.tsx` — ídem pre-rellenado, vuelve a la caja padre

### ✅ Landing page (`pages/welcome.tsx`)
Hero con badge + headline + CTA, sección features (6 tarjetas Free/Premium), pricing (3 planes: Free/9.99€/99.99€), footer.

### ✅ Estructura de tipos TypeScript (`resources/js/types/`)
```
types/
├── auth.ts          → User (auth), Auth, TwoFactorSetupData
├── navigation.ts    → NavItem, BreadcrumbItem
├── ui.ts
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

### ✅ Sidebar — Comportamiento por rol
- **Admin**: solo sección "Administración" (Panel admin, Usuarios, Pagos, Suscripciones)
- **Premium/Free**: solo sección "General" (Dashboard, Tareas, Ideas, Proyectos*, Cajas*, Suscripción)
  - *Proyectos y Cajas solo visibles para premium

### ✅ Middleware HandleInertiaRequests
Comparte en todas las páginas vía `usePage().props.auth`:
- `is_admin: boolean`
- `is_premium: boolean`
- `user: User`

---

## Base de datos

### ✅ TiDB Cloud Serverless (MySQL)
Migrado de SQLite en sesión 1.
- Host: `gateway01.eu-central-1.prod.aws.tidbcloud.com` port `4000`
- SSL: ISRG Root X1 CA en `storage/app/tidb-ca.pem` (en .gitignore)
- `.env`: `DB_CONNECTION=mysql`, `MYSQL_ATTR_SSL_CA=...`
- `config/database.php` ya tenía soporte SSL via `array_filter([PDO::MYSQL_ATTR_SSL_CA => env(...)])`

---

## Tests — Estado actual
✅ **160/160 tests pasando** (596 assertions)

Historial de fixes:
- `app.blade.php` — quitado el componente de página de `@vite()` (solo queda `app.tsx`)
- `app/Http/Controllers/Controller.php` — añadido trait `AuthorizesRequests`
- `app/Models/User.php` — añadido trait `TwoFactorAuthenticatable` (Fortify)
- `database/factories/ProjectFactory.php` — `color` siempre genera valor (era `optional()`)
- Creados 16 archivos TSX placeholder en `resources/js/pages/`
- `routes/web.php` — ruta home usa `inertia('welcome')` en lugar de redirect a login
- `TaskControllerTest` + `IdeaControllerTest` — `assertSoftDeleted` → `assertDatabaseMissing`
- `ProjectFactory` — status default `'created'` → `'inactive'` (sesión 4)
- `ProjectControllerTest` — assertion status `'created'` → `'inactive'` (sesión 4)

---

## Requisitos del proyecto intermodular — Estado

| Requisito | Estado | Notas |
|-----------|--------|-------|
| Idea definida y realista (descripción, roles, MVP) | ✅ | Flowly: productividad personal freemium |
| Repositorio Git con commits frecuentes | ✅ | Activo en GitHub |
| Documentación inicial en README | ✅ | README.md muy completo |
| CRUD completo sobre 2+ entidades | ✅ | Task, Idea, Project, Box, Resource |
| Acceso a BD con ORM | ✅ | Eloquent + TiDB Cloud (MySQL) |
| Validación de datos en servidor | ✅ | Form Requests con messages() en español |
| Autenticación | ✅ | Laravel Fortify (registro, login, 2FA) |
| Interfaz usable y responsive | ✅ | React 18 + shadcn/ui + Tailwind + Flowly Design System |
| Formularios con validación en cliente | ✅ | useForm Inertia + errores en UI |
| Navegación clara (menús, rutas) | ✅ | Sidebar por rol (admin/premium/free) |
| Registro/Login de usuarios | ✅ | Fortify |
| 2+ roles con control de permisos | ✅ | admin, premium_user, free_user + Spatie + Policies |
| Tests básicos (2 unit + 1 funcional) | ✅ | 143 tests Feature, 551 assertions |
| Código organizado | ✅ | Estructura estándar Laravel + TypeScript organizado |
| **Despliegue (Docker o servidor remoto)** | **✅** | Dockerfile multi-stage + docker-compose.yml + entrypoint |
| **Base de datos separada de la lógica** | **✅** | TiDB Cloud Serverless (externa) + volumen Docker separado |
| **Uso de ramas en Git** | **✅ JUSTIFICADO** | Proyecto unipersonal: ver `docs/decisiones-tecnicas.md` §8 |
| **Landing page funcional** | **✅** | `welcome.tsx` con hero, features, pricing — Design System aplicado |
| **Manual de usuario** | **✅** | `docs/manual-usuario.md` — 10 secciones |
| **Justificación técnica de decisiones** | **✅** | `docs/decisiones-tecnicas.md` — 9 secciones |
| **Código comentado** | **✅** | Comentarios en lógica compleja |

### Todo completado — sin pendientes críticos

---

## Notas de implementación
- `ResourceController` usa rutas anidadas bajo `/boxes/{box}/resources` para create/store
- `CheckoutController` llama a `Payment::process()` que simula 80% éxito / 20% fallo
- Policies registradas automáticamente por Laravel (naming convention Model → Policy)
- `tasks.index` ordena: primero pendientes, luego completadas; dentro de cada grupo por prioridad DESC
- Campos en BD: Task y Idea usan `name` (NO `title`) — los tipos TypeScript están actualizados
- Error de pago en checkout viene como error de página (`usePage().props.errors.payment`), no como error de campo de formulario
- Task e Idea: `deleted_at` existe en la BD pero Eloquent ya NO la gestiona (SoftDeletes eliminado)
- `canAddTask()` cuenta tareas con `status='pending'`, no usa `deleted_at`
- Delete en frontend: `router.delete(url)` de `@inertiajs/react` — HTTP DELETE real, no form spoofing

### Sesión 4 — Cambios
- Project status enum: `created` → `inactive` (migración, modelo, factory, controller, requests, tests, frontend)
- Iconos gallery: ClipboardList (tareas), Lightbulb (ideas), FolderOpen (proyectos), Package (cajas)
- OpenAI Whisper integrado: `VoiceRecordingController`, `StoreVoiceRecordingRequest`, componente `voice-recorder.tsx`
- Voice recording en tareas/ideas: botón "Dictar" en index (quick-create) y create (dictado nombre)
- `IdeaController::store` acepta `source` desde request (default `manual`), permitiendo `source: 'voice'`
- `openai-php/client` v0.19 instalado, config en `services.openai.key`
### ✅ Sesión 5 — Cambios
- **Tutorial chatbot con tour guiado** implementado para nuevos usuarios
- Migración `add_tutorial_completed_at_to_users_table` — columna `tutorial_completed_at` en users
- Modelo User: métodos `hasCompletedTutorial()` y `completeTutorial()`
- Componente `tutorial-chatbot.tsx` — tour guiado con:
  - **Spotlight** (overlay oscuro con "agujero" en el elemento resaltado)
  - **Tooltip posicionado** junto al elemento del sidebar que se explica
  - **data-tutorial attributes** en `nav-main.tsx` para identificar elementos
  - Borde brillante animado (pulse) alrededor del elemento activo
  - Efecto de escritura progresiva del bot
  - Portal de React para estar siempre encima de todo
  - **Tutorial diferenciado por rol:**
    - **Free users** (6 pasos): Dashboard, Tareas (límite 5), Ideas, Suscripción (promoción Premium)
    - **Premium users** (7 pasos): Dashboard, Tareas (+voz), Ideas (+voz), Proyectos, Cajas
- `TutorialController` con ruta `POST /tutorial/complete`
- Integrado en Dashboard: aparece automáticamente a usuarios nuevos, pasa `isPremium` al componente
- Tipo TypeScript `User` actualizado con `tutorial_completed_at`
- 4 nuevos tests en `TutorialControllerTest.php`