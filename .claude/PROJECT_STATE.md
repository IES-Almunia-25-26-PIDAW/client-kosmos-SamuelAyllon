# Flowly — Estado Real del Proyecto
> Última actualización: 2026-02-20. Actualizar este archivo al completar cada sección.

---

## Resumen de progreso

| Capa | Estado |
|------|--------|
| Migraciones | ✅ Todas creadas (13 tablas) |
| Modelos Eloquent | ✅ Todos creados (10 modelos) |
| Seeders | ⚠️ Solo DatabaseSeeder básico (crea test@example.com) — FALTAN roles/usuarios |
| Rutas | ⚠️ Solo home, dashboard, settings — FALTAN todas las features |
| Controladores | ⚠️ Solo Settings — FALTAN todos los de features |
| Form Requests | ⚠️ Solo Settings — FALTAN todos los de features |
| Tests | ❌ No hay tests de features todavía |
| Frontend — Auth | ✅ Páginas login, register, 2FA, forgot-password (Fortify) |
| Frontend — Settings | ✅ Páginas profile, password, appearance, two-factor |
| Frontend — Dashboard | ⚠️ Página básica existe, sin datos reales |
| Frontend — Features | ❌ No hay páginas para tasks, ideas, projects, etc. |
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

### ❌ Seeders pendientes
Crear en `database/seeders/`:
- `RoleSeeder` — crear roles: admin, premium_user, free_user
- `UserSeeder` — crear 3 usuarios de prueba con sus roles y suscripciones
- Actualizar `DatabaseSeeder` para llamar a ambos

### ❌ Controladores pendientes
Crear en `app/Http/Controllers/`:
- `TaskController` (CRUD)
- `IdeaController` (CRUD)
- `ProjectController` (CRUD, premium)
- `BoxController` (CRUD, premium)
- `ResourceController` (CRUD, premium)
- `VoiceController` (transcribe, premium)
- `AiAssistantController` (chat, premium)
- `SubscriptionController` (ver suscripción)
- `CheckoutController` (pago simulado)

Crear en `app/Http/Controllers/Admin/`:
- `AdminDashboardController`
- `AdminUserController`
- `AdminPaymentController`
- `AdminSubscriptionController`

### ❌ Form Requests pendientes
Crear en `app/Http/Requests/`:
- `StoreTaskRequest` / `UpdateTaskRequest`
- `StoreIdeaRequest` / `UpdateIdeaRequest`
- `StoreProjectRequest` / `UpdateProjectRequest`
- `StoreBoxRequest` / `UpdateBoxRequest`
- `StoreResourceRequest` / `UpdateResourceRequest`
- `CheckoutRequest`

### ❌ Rutas pendientes (añadir a `routes/web.php`)
```php
// Autenticadas (todos)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('tasks', TaskController::class);
    Route::resource('ideas', IdeaController::class);
    Route::get('subscription', [SubscriptionController::class, 'index']);
    Route::get('checkout', [CheckoutController::class, 'index']);
    Route::post('checkout', [CheckoutController::class, 'store']);
});

// Premium (premium_user + admin)
Route::middleware(['auth', 'verified', 'role:premium_user|admin'])->group(function () {
    Route::resource('projects', ProjectController::class);
    Route::resource('boxes', BoxController::class);
    Route::resource('resources', ResourceController::class);
    Route::post('voice/transcribe', [VoiceController::class, 'transcribe']);
    Route::resource('ai-chats', AiAssistantController::class)->only(['index', 'store']);
});

// Admin
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [AdminDashboardController::class, 'index']);
    Route::resource('users', AdminUserController::class);
    Route::get('payments', [AdminPaymentController::class, 'index']);
    Route::get('subscriptions', [AdminSubscriptionController::class, 'index']);
});
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

### ✅ Páginas existentes
- `pages/welcome.tsx` — landing (pendiente de contenido Flowly)
- `pages/dashboard.tsx` — dashboard básico (pendiente de datos reales)
- `pages/auth/` — login, register, 2FA, reset, verify, forgot
- `pages/settings/` — profile, password, appearance, two-factor

### ❌ Páginas pendientes de crear
- `pages/tasks/index.tsx` + `create.tsx` / `edit.tsx`
- `pages/ideas/index.tsx` + `create.tsx` / `edit.tsx`
- `pages/projects/index.tsx` + `show.tsx` + `create.tsx` / `edit.tsx`
- `pages/boxes/index.tsx` + `show.tsx`
- `pages/resources/create.tsx` / `edit.tsx`
- `pages/subscription/index.tsx`
- `pages/checkout/index.tsx`
- `pages/admin/dashboard.tsx`
- `pages/admin/users/index.tsx`
- `pages/admin/payments/index.tsx`

---

## Tests pendientes
Crear en `tests/Feature/`:
- `TaskControllerTest.php`
- `IdeaControllerTest.php`
- `ProjectControllerTest.php`
- `BoxControllerTest.php`
- `ResourceControllerTest.php`
- `CheckoutControllerTest.php`
- `SubscriptionControllerTest.php`
- `AdminDashboardControllerTest.php`
- `AdminUserControllerTest.php`

---

## Próximo paso sugerido
1. Crear `RoleSeeder` + `UserSeeder` y actualizar `DatabaseSeeder`
2. Crear rutas + `TaskController` + `StoreTaskRequest`
3. Crear página `pages/tasks/index.tsx`
4. Escribir `TaskControllerTest`
