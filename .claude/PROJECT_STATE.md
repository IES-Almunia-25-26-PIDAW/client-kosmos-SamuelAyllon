# Flowly — Estado Real del Proyecto
> Última actualización: 2026-02-23. Actualizar este archivo al completar cada sección.

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
| Frontend — Features | ⚠️ Vistas user parciales (tasks/index skeleton, resto placeholders) |
| Frontend — Landing | ⚠️ welcome.tsx existe pero sin contenido Flowly |

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

### ✅ Páginas existentes con UI real
- `pages/welcome.tsx` — landing (pendiente de contenido Flowly)
- `pages/dashboard.tsx` — dashboard con datos reales (free/premium condicional)
- `pages/auth/` — login, register, 2FA, reset, verify, forgot
- `pages/settings/` — profile, password, appearance, two-factor
- `pages/admin/dashboard.tsx` — stats globales + pagos/usuarios recientes
- `pages/admin/users/index.tsx` — lista paginada con roles, plan, conteos
- `pages/admin/users/show.tsx` — detalle usuario: actividad, suscripción, pagos
- `pages/admin/payments/index.tsx` — resumen + lista paginada con estado e importe
- `pages/admin/subscriptions/index.tsx` — resumen por plan + lista paginada

### ⚠️ Páginas placeholder o skeleton (existen pero sin UI completa)
- `pages/tasks/index.tsx` — skeleton funcional (lista + complete/reopen/delete)
- `pages/tasks/edit.tsx` — placeholder
- `pages/ideas/index.tsx` + `edit.tsx` — placeholder
- `pages/projects/index.tsx` + `show.tsx` — placeholder
- `pages/boxes/index.tsx` + `show.tsx` — placeholder
- `pages/resources/create.tsx` — placeholder
- `pages/subscription/index.tsx` — placeholder
- `pages/checkout/index.tsx` — placeholder

### ❌ Páginas aún no creadas (ni placeholder)
- `pages/tasks/create.tsx`
- `pages/ideas/create.tsx`
- `pages/projects/create.tsx` + `edit.tsx`
- `pages/boxes/create.tsx` + `edit.tsx`
- `pages/resources/edit.tsx`

### ✅ Estructura de tipos TypeScript (`resources/js/types/`)
```
types/
├── auth.ts          → User (auth), Auth, TwoFactorSetupData
├── navigation.ts    → NavItem, BreadcrumbItem
├── ui.ts
├── models/          → Task, Idea, Subscription, Payment, RecentPayment, Role
├── shared/          → PaginatedData<T>
├── pages/           → DashboardProps, TasksProps
├── admin/           → AdminStats, AdminUser, AdminDashboardProps,
│                      AdminUsersIndexProps, AdminUserShowProps,
│                      AdminPaymentsProps, AdminSubscriptionsProps
└── index.ts         → barrel (7 líneas usando sub-barrels)
```

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

## Próximo paso sugerido
1. Implementar vistas usuario: `tasks/create.tsx`, `ideas/index.tsx`, `ideas/create.tsx`
2. Implementar `subscription/index.tsx` y `checkout/index.tsx`
3. Implementar vistas premium: `projects/*`, `boxes/*`, `resources/*`
4. Landing page `welcome.tsx` con contenido Flowly real

## Notas de implementación
- `ResourceController` usa rutas anidadas bajo `/boxes/{box}/resources` para create/store
- `CheckoutController` llama a `Payment::process()` que simula 80% éxito / 20% fallo
- Policies registradas automáticamente por Laravel (naming convention Model → Policy)
- `tasks.index` ordena: primero pendientes, luego completadas; dentro de cada grupo por prioridad DESC
