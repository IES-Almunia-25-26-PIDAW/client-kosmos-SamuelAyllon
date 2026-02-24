# Flowly — Estado Real del Proyecto
> Última actualización: 2026-02-24. Actualizar este archivo al completar cada sección.

---

## Resumen de progreso

| Capa | Estado |
|------|--------|
| Migraciones | ✅ Todas creadas (13 tablas) |
| Modelos Eloquent | ✅ Todos creados (10 modelos) |
| Seeders | ✅ RoleSeeder + UserSeeder + DatabaseSeeder — 3 usuarios, 3 roles, 3 suscripciones |
| Rutas | ✅ Todas creadas (tasks, ideas, projects, boxes, resources, subscription, checkout, admin) |
| Controladores features | ✅ TaskController, IdeaController, ProjectController, BoxController, ResourceController, SubscriptionController, CheckoutController |
| Controladores admin | ✅ AdminDashboardController, AdminUserController, AdminPaymentController, AdminSubscriptionController |
| Form Requests | ✅ StoreTask/Update, StoreIdea/Update, StoreProject/Update, StoreBox/Update, StoreResource/Update, CheckoutRequest |
| Policies | ✅ TaskPolicy, IdeaPolicy, ProjectPolicy, BoxPolicy, ResourcePolicy |
| Tests | ✅ 143/143 pasando — TaskController, IdeaController, ProjectController, BoxController, ResourceController, CheckoutController, SubscriptionController, AdminControllers, Auth, Settings |
| Frontend — Auth | ✅ Páginas login, register, 2FA, forgot-password (Fortify) |
| Frontend — Settings | ✅ Páginas profile, password, appearance, two-factor |
| Frontend — Dashboard | ✅ Implementado (free: tareas+ideas, premium: +proyectos, admin: redirige) |
| Frontend — Admin | ✅ Las 5 vistas admin implementadas con UI real |
| Frontend — Types | ✅ Reorganizado en subcarpetas models/ shared/ pages/ admin/ |
| Frontend — Features usuario | ✅ Todas las vistas de usuario implementadas con UI real |
| Frontend — Features premium | ✅ Todas las vistas premium implementadas con UI real |
| Frontend — Landing | ⚠️ welcome.tsx existe pero sin contenido Flowly |
| Despliegue (Docker) | ✅ Dockerfile + docker-compose.yml + .dockerignore + docker-entrypoint.sh |
| Manual de usuario | ❌ Pendiente — documento para el usuario final |
| Justificación técnica | ❌ Pendiente — decisiones de arquitectura documentadas |
| Ramas Git | ❌ Solo rama main — usar feature branches |

---

## Backend — Detalle

### ✅ Migraciones creadas
- `create_users_table` (base Laravel)
- `add_two_factor_columns_to_users_table` (Fortify)
- `create_permission_tables` (Spatie)
- `add_fields_to_users_table` ⚠️ **VACÍA — pendiente de definir qué añadir**
- `create_subscriptions_table`
- `create_payments_table`
- `create_projects_table`
- `create_tasks_table`
- `create_ideas_table`
- `create_boxes_table`
- `create_resources_table`
- `create_ai_conversations_table`
- `create_voice_recordings_table`

### ✅ Modelos creados
Todos en `app/Models/`: User, Subscription, Payment, Project, Task, Idea, Box, Resource, AiConversation, VoiceRecording

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

### ✅ Policies creadas
En `app/Policies/`:
- `TaskPolicy` — update + delete (owner check)
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

// Premium (premium_user|admin)
projects.*       → ProjectController (CRUD)
boxes.*          → BoxController (CRUD)
resources.*      → ResourceController (create/store nested en box; edit/update/destroy standalone)

// Admin (/admin/*)
admin.dashboard  → AdminDashboardController@index
admin.users.*    → AdminUserController (index, show, destroy)
admin.payments.* → AdminPaymentController@index
admin.subscriptions.* → AdminSubscriptionController@index
```

---

## Frontend — Detalle

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
- `pages/tasks/index.tsx` — lista pendientes/completadas, prioridad, fecha vencimiento, proyecto
- `pages/tasks/create.tsx` — formulario completo, proyectos opcionales (premium)
- `pages/tasks/edit.tsx` — formulario pre-rellenado
- `pages/ideas/index.tsx` — lista activas/resueltas, prioridad, resolve/reactivate/delete
- `pages/ideas/create.tsx` — formulario completo
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

### ⚠️ Pendiente
- `pages/welcome.tsx` — landing page (existe pero sin contenido Flowly)
- ~~`Dockerfile` + `docker-compose.yml`~~ — ✅ Completado
- `docs/manual-usuario.md` — manual de usuario final (requisito intermodular)
- `docs/decisiones-tecnicas.md` — justificación de decisiones de arquitectura (requisito intermodular)

### ✅ Estructura de tipos TypeScript (`resources/js/types/`)
```
types/
├── auth.ts          → User (auth), Auth, TwoFactorSetupData
├── navigation.ts    → NavItem, BreadcrumbItem
├── ui.ts
├── models/          → Task, Idea, Project, Box, Resource,
│                      Subscription, Payment, RecentPayment, Role
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

## Tests — Estado actual
✅ **143/143 tests pasando** (551 assertions)

Fixes aplicados para llegar a 143/143:
- `app.blade.php` — quitado el componente de página de `@vite()` (solo queda `app.tsx`)
- `app/Http/Controllers/Controller.php` — añadido trait `AuthorizesRequests`
- `app/Models/User.php` — añadido trait `TwoFactorAuthenticatable` (Fortify)
- `database/factories/ProjectFactory.php` — `color` siempre genera valor (era `optional()`)
- Creados 16 archivos TSX placeholder en `resources/js/pages/`

---

## Requisitos del proyecto intermodular — Estado

| Requisito | Estado | Notas |
|-----------|--------|-------|
| Idea definida y realista (descripción, roles, MVP) | ✅ | Flowly: productividad personal freemium |
| Repositorio Git con commits frecuentes | ✅ | Activo en GitHub |
| Documentación inicial en README | ✅ | README.md muy completo |
| CRUD completo sobre 2+ entidades | ✅ | Task, Idea, Project, Box, Resource |
| Acceso a BD con ORM | ✅ | Eloquent + SQLite |
| Validación de datos en servidor | ✅ | Form Requests con messages() en español |
| Autenticación | ✅ | Laravel Fortify (registro, login, 2FA) |
| Interfaz usable y responsive | ✅ | React 18 + shadcn/ui + Tailwind |
| Formularios con validación en cliente | ✅ | useForm Inertia + errores en UI |
| Navegación clara (menús, rutas) | ✅ | Sidebar por rol (admin/premium/free) |
| Registro/Login de usuarios | ✅ | Fortify |
| 2+ roles con control de permisos | ✅ | admin, premium_user, free_user + Spatie + Policies |
| Tests básicos (2 unit + 1 funcional) | ✅ | 143 tests Feature, 551 assertions |
| Código organizado | ✅ | Estructura estándar Laravel + TypeScript organizado |
| **Despliegue (Docker o servidor remoto)** | **✅** | Dockerfile multi-stage + docker-compose.yml + entrypoint |
| **Base de datos separada de la lógica** | **✅** | Volumen Docker `flowly_database` separado del contenedor de la app |
| **Uso de ramas en Git** | **❌ PENDIENTE** | Solo rama `main`; usar feature branches |
| **Landing page funcional** | **⚠️ PENDIENTE** | welcome.tsx existe pero sin contenido Flowly |
| **Manual de usuario** | **❌ PENDIENTE** | No existe ningún documento |
| **Justificación técnica de decisiones** | **❌ PENDIENTE** | No hay documento explicando decisiones de arquitectura |
| **Código comentado** | **⚠️ POR VERIFICAR** | Revisar que el código complejo tenga comentarios |

### Próximos pasos por prioridad

1. ~~**[CRÍTICO] Dockerfile + docker-compose.yml**~~ — ✅ Completado
2. **[CRÍTICO] Ramas Git** — crear feature branches para los próximos desarrollos
3. **[ALTO] Landing page** — implementar `welcome.tsx` con contenido Flowly real (pricing, features, CTA)
4. **[ALTO] Manual de usuario** — documento PDF/Markdown explicando cómo usar la app
5. **[ALTO] Justificación técnica** — documento con decisiones de arquitectura y tecnologías elegidas
6. **[MEDIO] Comentarios en código** — añadir comentarios a lógica compleja (User::canAddTask, Payment::process, etc.)

## Notas de implementación
- `ResourceController` usa rutas anidadas bajo `/boxes/{box}/resources` para create/store
- `CheckoutController` llama a `Payment::process()` que simula 80% éxito / 20% fallo
- Policies registradas automáticamente por Laravel (naming convention Model → Policy)
- `tasks.index` ordena: primero pendientes, luego completadas; dentro de cada grupo por prioridad DESC
- Campos en BD: Task y Idea usan `name` (NO `title`) — los tipos TypeScript están actualizados
- Error de pago en checkout viene como error de página (`usePage().props.errors.payment`), no como error de campo de formulario
