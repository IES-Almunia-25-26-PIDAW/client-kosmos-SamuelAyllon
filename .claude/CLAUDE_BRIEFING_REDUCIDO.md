# FLOWLY  — BRIEFING PARA CLAUDE EN VSCODE
# Versión 3 — Verificado contra código fuente real (13 marzo 2026)

> **Cómo usar este archivo**: Guárdalo como `CLAUDE_BRIEFING_REDUCIDO.md` en la raíz del proyecto.
> Al iniciar cada sesión de Claude en VSCode, escribe:
> `@CLAUDE_BRIEFING_REDUCIDO.md Lee este briefing completo antes de generar código.`
> Opcionalmente complementa con: `@docs/contexto-proyecto.md` y `@docs/guia-estilos.md`

---

## PARTE 1: CONTEXTO DEL PROYECTO (solo lectura)

### 1.1 Qué es Flowly hoy

Flowly es una plataforma web de productividad freemium desarrollada como Proyecto Intermodular
de 2º DAM por Samuel Ayllón. Actualmente es un gestor genérico de tareas, ideas, proyectos
y recursos con asistente IA y entrada por voz.

**Vamos a transformarlo** en un "hub de contexto por cliente + resumen accionable del día"
para freelancers digitales.

### 1.2 Stack tecnológico exacto (verificado contra composer.json y package.json)

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Backend | Laravel | 12 |
| PHP | | 8.4 (local) · 8.2 (Docker) |
| ORM | Eloquent | (Laravel 12) |
| Auth | Laravel Fortify | ^1.30 |
| Roles | Spatie Permission | ^7.2 |
| Frontend | React | ^19.2.0 |
| Tipado | TypeScript | ^5.7.2 |
| SSR Bridge | Inertia.js (@inertiajs/react) | ^2.3.7 |
| Rutas tipadas | Laravel Wayfinder (@laravel/vite-plugin-wayfinder) | ^0.1.3 |
| UI Components | shadcn/ui (Radix UI + Tailwind) | 15 paquetes @radix-ui/* |
| CSS | Tailwind CSS (@tailwindcss/vite) | ^4.1.11 |
| Iconos | Lucide React | ^0.475.0 |
| Bundler | Vite (@vitejs/plugin-react) | ^7.0.4 |
| React Compiler | babel-plugin-react-compiler | ^1.0.0 |
| Testing | Pest (pestphp/pest) | ^3.8 |
| Pest Laravel | pestphp/pest-plugin-laravel | ^3.2 |
| BD (dev) | SQLite | (sin configuración) |
| BD (prod) | TiDB Cloud Serverless | MySQL-compatible, EU Central 1, port 4000, SSL |
| IA | openai-php/client | ^0.19.0 (compatible Groq/OpenAI) |

### 1.3 Los 10 modelos actuales y sus relaciones (verificado contra app/Models/*.php)

```
User (app/Models/User.php)
  extends Authenticatable
  use HasFactory, Notifiable, HasRoles, TwoFactorAuthenticatable
  ├── hasOne: Subscription
  ├── hasMany: Payment, Project, Task, Idea, Box, Resource, AiConversation, VoiceRecording
  ├── fillable: name, email, password, user_modified_at, tutorial_completed_at
  ├── casts: email_verified_at→datetime, user_modified_at→datetime, tutorial_completed_at→datetime, password→hashed
  ├── hidden: password, remember_token
  └── Métodos:
      isFreeUser()           → hasRole('free_user')         ← CON UNDERSCORE
      isPremiumUser()        → hasRole('premium_user')      ← CON UNDERSCORE
      isAdmin()              → hasRole('admin')
      canAddTask()           → free máx 5 pending; admin/premium ilimitadas
      getActiveTasksCount()  → tasks where status=pending count
      getCompletedThisMonthCount() → tasks completed este mes
      getDashboardData()     → devuelve array:
                                { active_tasks, completed_this_month, total_ideas,
                                  total_projects, is_premium }
      hasCompletedTutorial() → tutorial_completed_at !== null
      completeTutorial()     → update tutorial_completed_at = now()
      ⚠️ NO EXISTE canAddProject() — HAY QUE CREARLO

Subscription (app/Models/Subscription.php)
  ├── belongsTo: User
  ├── fillable: user_id, plan, status, started_at, expires_at
  ├── casts: started_at→datetime, expires_at→datetime
  ├── plan (enum): 'free', 'premium_monthly', 'premium_yearly'   ← CON UNDERSCORE
  ├── status: solo usa 'active' (no hay cancelled ni suspended)
  └── Métodos:
      getPrice()          → free=0.00, premium_monthly=9.99, premium_yearly=99.99
      getDurationInDays() → free=null, premium_monthly=30, premium_yearly=365
      isActive()          → status=active AND (free OR expires_at futuro)
      upgradeToPremium(plan) → actualiza plan+status+fechas, syncRoles('premium_user')
      downgradeToFree()      → plan=free, syncRoles('free_user')
      hasExpired()         → premium AND expires_at pasado
      getDaysRemaining()   → días hasta expires_at (null para free)

Payment (app/Models/Payment.php)
  ├── belongsTo: User
  ├── plan (enum): 'premium_monthly', 'premium_yearly'   ← CON UNDERSCORE
  ├── status (enum): 'pending', 'completed', 'failed'
  └── Métodos: generateTransactionId, process (simula 80/20), isSuccessful

Project (app/Models/Project.php) — UI: "Cliente"
  ├── belongsTo: User
  ├── hasMany: Task (cascade delete)
  ├── status (enum): 'active', 'inactive', 'completed'
  ├── color: hex string, NOT NULL, default '#3B82F6'
  ├── Scopes: active, completed, forUser(User)
  └── Métodos: getTasksSummary, getProgressPercentage

Task (app/Models/Task.php)
  ├── belongsTo: User, Project (nullable)
  ├── hasMany: VoiceRecording                    ← SE ELIMINARÁ esta relación
  ├── Hard delete (SIN SoftDeletes — columna deleted_at EXISTE en BD pero Eloquent la ignora)
  ├── status (enum): 'pending', 'completed'
  ├── priority (enum): 'low', 'medium', 'high'
  ├── due_date: obligatoria
  ├── Scopes: pending, completed, forUser, byPriority, overdue, dueToday, dueSoon
  └── Métodos: markAsCompleted, markAsPending, isOverdue, isDueToday

Idea (app/Models/Idea.php) — UI: "Idea / Nota"
  ├── belongsTo: User
  ├── hasMany: VoiceRecording                    ← SE ELIMINARÁ esta relación
  ├── Hard delete (SIN SoftDeletes — columna deleted_at EXISTE pero Eloquent la ignora)
  ├── status (enum): 'active', 'resolved'
  ├── source (enum): 'manual', 'voice', 'ai_suggestion'   ← CON UNDERSCORE
  ├── priority (enum): 'low', 'medium', 'high'
  ├── Scopes: active, forUser, byPriority, fromVoice, fromAiSuggestion
  └── Métodos: markAsResolved, markAsActive, convertToTask

Box (app/Models/Box.php) — SE VA A ELIMINAR
  ├── belongsTo: User
  ├── hasMany: Resource (cascade delete)
  └── Métodos: getResourcesCount

Resource (app/Models/Resource.php)
  ├── belongsTo: User, Box                      ← CAMBIARÁ a belongsTo User, Project
  ├── type (enum): 'link', 'document', 'video', 'image', 'other'
  └── Métodos: getTypeLabel

AiConversation (app/Models/AiConversation.php) — SE VA A REEMPLAZAR por AiLog
  ├── belongsTo: User
  ├── role (enum): 'user', 'assistant'
  ├── timestamps: false (solo created_at, gestión manual)
  └── Métodos estáticos: getConversationHistory, addUserMessage, addAssistantMessage

VoiceRecording (app/Models/VoiceRecording.php) — SE VA A ELIMINAR
  ├── belongsTo: User, Task (nullable), Idea (nullable)
  ├── status (enum): 'pending', 'processing', 'completed', 'failed'
  └── Métodos: markAsProcessing, markAsCompleted(transcription), markAsFailed(error)
```

### 1.4 Tablas actuales (16 migraciones → 13 tablas de negocio + Spatie)

**Migraciones en orden (verificado):**
```
0001_01_01_000000_create_users_table.php
0001_01_01_000001_create_cache_table.php
0001_01_01_000002_create_jobs_table.php
2025_08_14_170933_add_two_factor_columns_to_users_table.php
2026_02_20_114017_create_permission_tables.php
2026_02_20_120313_add_fields_to_users_table.php
2026_02_20_120317_create_subscriptions_table.php
2026_02_20_120321_create_payments_table.php
2026_02_20_120325_create_projects_table.php
2026_02_20_120328_create_tasks_table.php
2026_02_20_120332_create_ideas_table.php
2026_02_20_120336_create_boxes_table.php
2026_02_20_120340_create_resources_table.php
2026_02_20_120343_create_ai_conversations_table.php
2026_02_20_120348_create_voice_recordings_table.php
2026_03_03_125112_add_tutorial_completed_at_to_users_table.php
```

**Estructura de tablas:**
```
users:             id, name, email, password, tutorial_completed_at, email_verified_at, user_modified_at, created_at, updated_at, two_factor_*
subscriptions:     id, user_id, plan, status, started_at, expires_at, created_at, updated_at
payments:          id, user_id, plan, amount, status, payment_method, transaction_id, card_last_four, created_at, updated_at
projects:          id, user_id, name, description, status, color, user_modified_at, created_at, updated_at
tasks:             id, user_id, project_id (nullable), name, description, priority, status, due_date, completed_at, user_modified_at, deleted_at, created_at, updated_at
ideas:             id, user_id, name, description, priority, status, source, user_modified_at, deleted_at, created_at, updated_at
boxes:             id, user_id, name, description, category, user_modified_at, created_at, updated_at
resources:         id, user_id, box_id, name, description, url (nullable), type, user_modified_at, created_at, updated_at
ai_conversations:  id, user_id, role, message (longText), metadata (json), created_at
voice_recordings:  id, user_id, task_id (nullable), idea_id (nullable), filepath, transcription, status, duration, error_message, created_at
+ 5 tablas Spatie: roles, permissions, model_has_roles, model_has_permissions, role_has_permissions
+ cache, jobs (framework)
```

### 1.5 Rutas actuales (verificado contra routes/web.php)

**Públicas:**
```php
Route::get('/', fn() => inertia('welcome'))->name('home');
// ⚠️ NO existe ruta /pricing — la sección de precios está dentro de la landing (welcome.tsx)
// Auth Fortify: login, registro, verificación email, reset password, 2FA (require settings.php)
```

**Autenticadas (middleware: ['auth', 'verified'] — AMBOS obligatorios):**
```php
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('tutorial/complete', [TutorialController::class, 'complete'])->name('tutorial.complete');

    // Tasks — SIN show (except(['show']))
    Route::resource('tasks', TaskController::class)->except(['show']);
    Route::patch('tasks/{task}/complete', [TaskController::class, 'complete'])->name('tasks.complete');
    Route::patch('tasks/{task}/reopen', [TaskController::class, 'reopen'])->name('tasks.reopen');

    // Ideas — SIN show (except(['show']))
    Route::resource('ideas', IdeaController::class)->except(['show']);
    Route::patch('ideas/{idea}/resolve', [IdeaController::class, 'resolve'])->name('ideas.resolve');
    Route::patch('ideas/{idea}/reactivate', [IdeaController::class, 'reactivate'])->name('ideas.reactivate');

    // Suscripción y checkout
    Route::get('subscription', [SubscriptionController::class, 'index'])->name('subscription.index');
    Route::get('checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('checkout', [CheckoutController::class, 'store'])->name('checkout.store');
});
```

**Premium (middleware: ['auth', 'verified', 'role:premium_user'] — CON UNDERSCORE):**
```php
Route::middleware(['auth', 'verified', 'role:premium_user'])->group(function () {
    // Projects — CON show (resource completo)
    Route::resource('projects', ProjectController::class);
    Route::patch('projects/{project}/complete', [ProjectController::class, 'complete'])->name('projects.complete');

    // Boxes
    Route::resource('boxes', BoxController::class);

    // Resources — patrón MIXTO: anidados bajo boxes para create/store, standalone para edit/update/destroy
    Route::get('boxes/{box}/resources/create', [ResourceController::class, 'create'])->name('resources.create');
    Route::post('boxes/{box}/resources', [ResourceController::class, 'store'])->name('resources.store');
    Route::get('resources/{resource}/edit', [ResourceController::class, 'edit'])->name('resources.edit');
    Route::put('resources/{resource}', [ResourceController::class, 'update'])->name('resources.update');
    Route::patch('resources/{resource}', [ResourceController::class, 'update']); // duplicado PUT+PATCH
    Route::delete('resources/{resource}', [ResourceController::class, 'destroy'])->name('resources.destroy');

    // Voz + IA
    Route::post('voice/transcribe', [VoiceRecordingController::class, 'transcribe'])->name('voice.transcribe');
    Route::get('ai-chats', [AiChatController::class, 'index'])->name('ai-chats.index');
    Route::post('ai-chats', [AiChatController::class, 'store'])->name('ai-chats.store');
    Route::delete('ai-chats', [AiChatController::class, 'destroy'])->name('ai-chats.destroy');
});
```

**Admin (middleware: ['auth', 'verified', 'role:admin'], prefix: 'admin', name: 'admin.'):**
```php
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::resource('users', AdminUserController::class)->only(['index', 'show', 'destroy']);
    Route::get('payments', [AdminPaymentController::class, 'index'])->name('payments.index');
    Route::get('subscriptions', [AdminSubscriptionController::class, 'index'])->name('subscriptions.index');
});

require __DIR__.'/settings.php';  // Rutas de configuración de perfil y contraseña
```

### 1.6 Testing (191 tests, 27 archivos, Pest 3)

**Helpers globales (tests/Pest.php):**
```php
createAdmin()        → Usuario admin con rol 'admin'
createPremiumUser()  → Usuario premium con rol 'premium_user' + suscripción 30 días
createFreeUser()     → Usuario free con rol 'free_user' + suscripción gratuita
ensureRolesExist()   → Garantiza que roles Spatie existen
// beforeEach: withoutVite(), RoleSeeder sembrado en cada test
```

**Archivos de test principales:**
```
Auth + Settings:              ~51 tests
AdminControllerTest:           17 tests (4 controladores admin)
AiChatControllerTest:          20 tests
TaskControllerTest:            16 tests
ProjectControllerTest:         15 tests
IdeaControllerTest:            12 tests
BoxControllerTest:             11 tests
ResourceControllerTest:        10 tests
CheckoutControllerTest:         7 tests
SubscriptionControllerTest:     4 tests
VoiceRecordingControllerTest:   tests Whisper
TutorialControllerTest:         tests tutorial
```

### 1.7 Roles y límites actuales

| Rol (Spatie) | Nombre en código | Tareas | Projects | Ideas | Voz | IA | Boxes/Resources | Admin |
|---|---|---|---|---|---|---|---|---|
| `free_user` | hasRole('free_user') | 5 pending máx | ✗ (premium-only) | ∞ | ✗ | ✗ | ✗ | ✗ |
| `premium_user` | hasRole('premium_user') | ∞ | ∞ | ∞ | ✓ | ✓ | ✓ | ✗ |
| `admin` | hasRole('admin') | — | — | — | — | — | — | ✓ (solo panel admin) |

> ⚠️ **CRÍTICO**: Los roles usan UNDERSCORE en Spatie: `free_user`, `premium_user`, `admin`.
> Los planes de suscripción también: `premium_monthly`, `premium_yearly`.
> NUNCA generes código con `freeuser`, `premiumuser`, `premiummonthly`.

### 1.8 Nomenclatura dual (RESPETAR SIEMPRE)

| Modelo interno (código) | Nombre en UI (copy) |
|------------------------|---------------------|
| Project | Cliente |
| Task | Tarea |
| Idea | Idea / Nota |
| Resource | Recurso del Cliente |
| Box | Carpeta ← SE ELIMINA |

**Regla**: en modelos, controladores, rutas, tests y migraciones se usan los nombres internos
(Project, Task, etc.). Solo cambia el copy visible en componentes React y landing.

**Regla de Route Model Binding**: las URLs dicen `/clients` pero el parámetro de ruta
sigue siendo `{project}` porque el modelo se llama Project. Ejemplo:
```php
Route::resource('clients', ProjectController::class)
    ->parameters(['clients' => 'project']);
// URL: /clients/5   → Laravel inyecta Project $project
```

### 1.9 Design system

- **Paleta**: primary #3A5A40 (verde bosque), bg #E9EDC9 (crema), card #DAD7CD (beige), muted #CAD2C5
- **Dark mode**: primary #6b9b73, bg #1a1e1b, card #242924
- **Fuentes**: Nunito (títulos), Open Sans (cuerpo), Inter (botones/UI) — cargadas desde bunny.net en app.blade.php
- **Componentes**: shadcn/ui (15 paquetes @radix-ui/react-*, copiados en resources/js/components/ui/)
- **Colores por cliente**: 8 colores (#3B82F6, #10B981, #8B5CF6, #F59E0B, #EC4899, #6366F1, #14B8A6, #EF4444)
- **Border radius**: lg=16px, md=10px, sm=6px
- **Animaciones**: fade-in, float, glow-pulse, typewriter, shimmer

### 1.10 Frontend: patrón Inertia.js

```tsx
// Landing usa el helper inertia() (no Inertia::render):
Route::get('/', fn() => inertia('welcome'));

// Controladores usan Inertia::render para pasar props:
return Inertia::render('projects/show', [
    'project' => $project->load('tasks'),
]);

// Datos compartidos (HandleInertiaRequests middleware):
const { auth } = usePage<{
  auth: { user: User; isadmin: boolean; ispremium: boolean }
}>().props;
```

- Páginas en `resources/js/pages/` (~36 páginas React)
- Componentes en `resources/js/components/` (incluye `ui/` con shadcn)
- Layouts en `resources/js/layouts/` (App con sidebar, Auth centrado)
- Tipos TypeScript en `resources/js/types/` — barrel en index.ts re-exporta:
  `auth, navigation, ui, models, shared, pages, admin`
- Hooks custom en `resources/js/hooks/`

### 1.11 Credenciales de prueba

```
admin@flowly.test     / password   → rol: admin
premium@flowly.test   / password   → rol: premium_user
free@flowly.test      / password   → rol: free_user
```
Se crean con `php artisan migrate:fresh --seed` (RoleSeeder + UserSeeder).

### 1.12 Seguridad implementada (4 capas)

1. **Middleware de rutas**: `role:premium_user` y `role:admin` (Spatie) + `verified` (email)
2. **Policies**: TaskPolicy, IdeaPolicy, ProjectPolicy, BoxPolicy, ResourcePolicy (solo el owner)
3. **Form Requests**: 17 clases de validación para toda entrada de usuario
4. **Lógica de negocio**: `canAddTask` (límite free), bloqueo login sin rol asignado

### 1.13 Archivos clave del proyecto

```
app/Models/User.php                          → Hub central (9 relaciones, roles, límites, dashboard data)
app/Http/Controllers/ (20 controladores)     → Incluye 4 de Admin (subcarpeta Admin/)
app/Http/Requests/ (17 Form Requests)
app/Policies/ (5 policies de ownership)
routes/web.php                               → Todas las rutas con middleware
routes/settings.php                          → Rutas de perfil y contraseña
config/services.php                          → Config OpenAI/Groq
resources/css/app.css                        → Design system completo
resources/views/app.blade.php                → Entry point HTML, fuentes bunny.net
resources/js/components/app-sidebar.tsx       → Sidebar principal
resources/js/pages/dashboard.tsx             → Dashboard actual
resources/js/pages/projects/show.tsx         → Detalle cliente
resources/js/pages/welcome.tsx               → Landing page (~1100 líneas, incluye sección pricing)
resources/js/types/index.ts                  → Barrel: re-exporta auth, navigation, ui, models, shared, pages, admin
database/migrations/ (16 archivos)
database/seeders/ (RoleSeeder + UserSeeder)
Dockerfile (multi-stage: Node 20 + PHP 8.2)
docker-entrypoint.sh (migrate --force + db:seed automáticos)
```

---

## PARTE 2: ESPECIFICACIÓN DE LA TRANSFORMACIÓN

### 2.1 Nueva idea central

**Antes**: "Flowly es una plataforma de productividad personal que unifica tareas, ideas,
proyectos, recursos y asistente IA."

**Ahora**: "Flowly es tu memoria operativa por cliente: guarda todo el contexto de cada
cliente y cada día te dice qué tocar y qué decirles, sin que tengas que recomponer el puzzle."

### 2.2 Tres features núcleo

**1) Ficha de cliente como "memoria viva"**
Cada Project/Cliente tiene 3 bloques:
- Contexto estático: quién es, qué servicio, tono de marca, links esenciales, alcance
- Timeline de trabajo: últimas 5 tareas completadas + próximos 3 hitos con fecha
- Notas/ideas ligadas al cliente + recursos directos (sin capa intermedia Box)

**2) Panel "Hoy" agresivamente simple**
Dashboard que solo responde: "Con tus clientes actuales, hoy deberías hacer esto:"
- 3–5 tareas críticas agrupadas por cliente (ordenadas por deadline + prioridad)
- Resumen de 1 línea por cliente relevante esta semana
- Botón "Ver contexto" por cliente
- SIN filtros avanzados, SIN múltiples vistas

**3) IA orientada a contexto (3 botones, NO chat abierto)**
- Botón "Recuérdame cómo está este cliente" → resumen 3-4 líneas
- Botón "Prepárame un update para enviarle" → párrafo profesional para email/Slack
- Botón "Planifica mi día" → lista de 3-5 acciones priorizadas con justificación

### 2.3 Modelo de datos: de 10 entidades a 7

**MANTENER (con modificaciones):**
- `User` → eliminar relaciones a Box, VoiceRecording, AiConversation; añadir relación a AiLog; crear canAddProject()
- `Subscription` → actualizar getPrice(): 11.99/119 (actualmente 9.99/99.99); resto sin cambios
- `Payment` → sin cambios estructurales
- `Project` → AÑADIR 5 campos nuevos para la ficha de cliente; AÑADIR hasMany Resource, hasMany Idea
- `Task` → project_id sigue nullable; ELIMINAR hasMany VoiceRecording
- `Idea` → AÑADIR project_id (nullable) y belongsTo Project; ELIMINAR hasMany VoiceRecording
- `Resource` → CAMBIAR belongsTo Box → belongsTo Project

**CREAR:**
- `AiLog` → registro de outputs de los 3 botones IA

**ELIMINAR:**
- `Box` → los recursos van directamente bajo Project
- `VoiceRecording` → feature eliminada del MVP reducido
- `AiConversation` → reemplazada por AiLog (3 botones, no chat abierto)

### 2.4 Cambio de acceso crítico

**Actualmente** `/projects` está protegido con `middleware(['auth', 'verified', 'role:premium_user'])`.
**Después** `/clients` debe ser accesible por TODOS los roles autenticados (`middleware(['auth', 'verified'])`),
con la lógica de límite en el controlador/modelo:

```php
// User.php — NUEVO método (no existe actualmente)
public function canAddProject(): bool
{
    if ($this->isAdmin() || $this->isPremiumUser()) {
        return true;
    }
    return $this->projects()->count() < 1; // Free: máximo 1 cliente
}
```

Lo mismo aplica a **Recursos**: actualmente premium-only (anidados bajo Box).
Después van anidados bajo Project. Los recursos y la ficha enriquecida (brand_tone,
service_scope, key_links) requieren plan premium. El free user ve nombre + color + tareas básicas.

### 2.5 Migraciones a crear (DESPUÉS de la migración 16)

> Las nuevas migraciones deben tener timestamp posterior a `2026_03_03_125112`.
> Sugerencia: usar `php artisan make:migration nombre` para generar el timestamp automáticamente.

**Migración 1: Añadir campos de ficha a projects**
```php
// add_client_context_fields_to_projects_table
Schema::table('projects', function (Blueprint $table) {
    $table->text('brand_tone')->nullable()->after('color');
    $table->text('service_scope')->nullable()->after('brand_tone');
    $table->json('key_links')->nullable()->after('service_scope');
    // key_links formato: [{"label": "Figma", "url": "https://..."}, {"label": "Drive", "url": "..."}]
    $table->date('next_deadline')->nullable()->after('key_links');
    $table->text('client_notes')->nullable()->after('next_deadline');
});
```

**Migración 2: Añadir project_id a ideas**
```php
// add_project_id_to_ideas_table
Schema::table('ideas', function (Blueprint $table) {
    $table->foreignId('project_id')->nullable()->after('user_id')->constrained('projects')->nullOnDelete();
});
```

**Migración 3: Añadir project_id a resources (ANTES de eliminar box_id)**
```php
// add_project_id_to_resources_table
Schema::table('resources', function (Blueprint $table) {
    $table->foreignId('project_id')->nullable()->after('user_id')->constrained('projects')->cascadeOnDelete();
});
```

**Migración 4: Crear tabla ai_logs**
```php
// create_ai_logs_table
Schema::create('ai_logs', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->foreignId('project_id')->nullable()->constrained('projects')->nullOnDelete();
    $table->enum('action_type', ['summary', 'update', 'plan_day']);
    $table->json('input_context')->nullable();
    $table->text('output_text');
    $table->timestamp('created_at')->useCurrent();
});
```

**Migración 5: Eliminar tablas y columnas obsoletas**
```php
// drop_legacy_tables_and_columns
// Paso 1: quitar FK box_id de resources (project_id ya existe desde migración 3)
Schema::table('resources', function (Blueprint $table) {
    $table->dropForeign(['box_id']);
    $table->dropColumn('box_id');
});
// Paso 2: hacer project_id obligatorio en resources
Schema::table('resources', function (Blueprint $table) {
    $table->foreignId('project_id')->nullable(false)->change();
});
// Paso 3: eliminar tablas
Schema::dropIfExists('voice_recordings');
Schema::dropIfExists('ai_conversations');
Schema::dropIfExists('boxes');
```

> **IMPORTANTE**: Ejecutar migraciones EN ORDEN (1→5). La migración 3 va antes de la 5
> porque project_id debe existir en resources antes de eliminar box_id.
> Entre la 3 y la 5, un data migration o tinker manual debería asignar project_id
> a resources existentes (si hay datos).

### 2.6 Rutas del nuevo Flowly

**Públicas (sin cambio):**
```php
Route::get('/', fn() => inertia('welcome'))->name('home');
// Auth Fortify sigue igual
```

**Autenticadas — Core (todos, middleware ['auth', 'verified']):**
```php
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard "Hoy"
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('tutorial/complete', [TutorialController::class, 'complete'])->name('tutorial.complete');

    // Clientes — accesibles por TODOS (límite 1 para free en controlador)
    Route::resource('clients', ProjectController::class)
        ->parameters(['clients' => 'project']);  // URL: /clients/{project}
    Route::patch('clients/{project}/complete', [ProjectController::class, 'complete'])->name('clients.complete');

    // Tasks — SIN show (mantener except(['show']))
    Route::resource('tasks', TaskController::class)->except(['show']);
    Route::patch('tasks/{task}/complete', [TaskController::class, 'complete'])->name('tasks.complete');
    Route::patch('tasks/{task}/reopen', [TaskController::class, 'reopen'])->name('tasks.reopen');

    // Notes (antes Ideas) — SIN show (mantener except(['show']))
    Route::resource('notes', IdeaController::class)
        ->parameters(['notes' => 'idea'])
        ->except(['show']);
    Route::patch('notes/{idea}/resolve', [IdeaController::class, 'resolve'])->name('notes.resolve');
    Route::patch('notes/{idea}/reactivate', [IdeaController::class, 'reactivate'])->name('notes.reactivate');

    // Suscripción y checkout
    Route::get('subscription', [SubscriptionController::class, 'index'])->name('subscription.index');
    Route::get('checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('checkout', [CheckoutController::class, 'store'])->name('checkout.store');
});
```

**Premium (middleware ['auth', 'verified', 'role:premium_user']) — IA + Recursos:**
```php
Route::middleware(['auth', 'verified', 'role:premium_user'])->group(function () {
    // IA contextual (3 botones)
    Route::post('ai/plan-day', [AiController::class, 'planDay'])->name('ai.plan-day');
    Route::post('ai/client-summary/{project}', [AiController::class, 'clientSummary'])->name('ai.client-summary');
    Route::post('ai/client-update/{project}', [AiController::class, 'clientUpdate'])->name('ai.client-update');

    // Recursos anidados bajo clientes
    Route::get('clients/{project}/resources/create', [ResourceController::class, 'create'])->name('resources.create');
    Route::post('clients/{project}/resources', [ResourceController::class, 'store'])->name('resources.store');
    Route::put('resources/{resource}', [ResourceController::class, 'update'])->name('resources.update');
    Route::patch('resources/{resource}', [ResourceController::class, 'update']);
    Route::delete('resources/{resource}', [ResourceController::class, 'destroy'])->name('resources.destroy');
});
```

**Admin (middleware ['auth', 'verified', 'role:admin'], prefix 'admin', name 'admin.') — Reducido:**
```php
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::resource('users', AdminUserController::class)->only(['index', 'show', 'destroy']);
    // ELIMINADOS: admin/payments y admin/subscriptions (innecesarios para side-project)
});
```

### 2.7 Cuatro pantallas principales

**1. `/dashboard` — Panel "Hoy"**
- 3–5 tareas críticas propuestas (algoritmo: overdue > dueToday > dueSoon > byPriority)
- Tarjetas de clientes con deadlines cercanos o tareas atrasadas ("zona de riesgo")
- Botón "Planifica mi día" (solo premium)
- Resumen de 1 línea por cliente activo
- Mantener el tutorial interactivo para nuevos usuarios
- Actualizar getDashboardData() para incluir datos de clientes

**2. `/clients` — Mis Clientes**
- Tarjetas con: nombre, color dot, estado, next_deadline, nº tareas pending
- Botón "+ Nuevo cliente"
- Free: máx 1 cliente; al crear 2º → modal de upgrade

**3. `/clients/{id}` — Ficha del Cliente**
- Bloque 1: Contexto estático (name, service_scope, brand_tone, key_links) — campos enriquecidos solo premium
- Bloque 2: Timeline (últimas 5 tareas completed + próximas 3 pending por due_date)
- Bloque 3: Recursos del cliente (directos, sin Box) — solo premium
- Bloque 4: Notas/ideas vinculadas (ideas con project_id = este cliente)
- Botones IA: "Resume este cliente" + "Genera update" (solo premium)

**4. `/tasks` — Todas las Tareas**
- Agrupadas por cliente (con color dot)
- Sección "Sin cliente" para tareas inbox (project_id = null)
- Filtro básico: por cliente, por estado
- SIN vista show individual (mantener except(['show']))

### 2.8 Modelo de negocio actualizado

| | Free (forever) | Solo (pago) |
|---|---|---|
| Clientes | 1 | Ilimitados |
| Tareas activas | 5 | Ilimitadas |
| Notas | Ilimitadas | Ilimitadas |
| Ficha enriquecida | Básica (nombre + color) | Completa (tono, links, scope, notas) |
| Recursos por cliente | ✗ | ✓ |
| IA: "Planifica mi día" | ✗ | ✓ |
| IA: "Resume cliente" | ✗ | ✓ |
| IA: "Genera update" | ✗ | ✓ |
| **Precio** | **0 €** | **11,99 €/mes · 119 €/año** |

**En código**: el enum `plan` sigue usando `'premium_monthly'` y `'premium_yearly'` (con underscore).
Actualizar Subscription::getPrice() de 9.99→11.99 y 99.99→119.00.

### 2.9 Triggers de upgrade (modals)

- Al crear 2º cliente → "Para gestionar varios clientes, pasa a Solo."
- Al pulsar cualquier botón IA → "La IA freelancer está en el plan Solo."
- Al intentar añadir recursos → "Guarda briefs, links y accesos con el plan Solo."
- Al intentar editar campos enriquecidos (brand_tone, etc.) → "Ficha completa en el plan Solo."

---

## PARTE 3: ARCHIVOS AFECTADOS

### 3.1 Archivos a ELIMINAR

> No ejecutes `rm` ni `unlink`. Lista lo que hay que borrar y yo lo hago manualmente.

```
MODELOS:
  app/Models/Box.php
  app/Models/VoiceRecording.php
  app/Models/AiConversation.php

CONTROLADORES:
  app/Http/Controllers/BoxController.php
  app/Http/Controllers/VoiceRecordingController.php
  app/Http/Controllers/AiChatController.php

FORM REQUESTS:
  app/Http/Requests/StoreBoxRequest.php
  app/Http/Requests/UpdateBoxRequest.php
  app/Http/Requests/StoreAiChatRequest.php
  app/Http/Requests/StoreVoiceRecordingRequest.php

POLICIES:
  app/Policies/BoxPolicy.php

TESTS:
  tests/Feature/BoxControllerTest.php
  tests/Feature/VoiceRecordingControllerTest.php
  tests/Feature/AiChatControllerTest.php

VISTAS REACT:
  resources/js/pages/boxes/ (directorio completo)
  resources/js/pages/ai-chats/ (directorio completo)
  Buscar y eliminar: cualquier componente de voice-recorder en resources/js/components/

TIPOS TYPESCRIPT:
  Eliminar interfaces/tipos de Box, VoiceRecording, AiConversation en resources/js/types/models/
```

### 3.2 Archivos a MODIFICAR

```
MODELOS:
  app/Models/User.php
    → Eliminar relaciones: boxes(), aiConversations(), voiceRecordings()
    → Añadir relación: aiLogs() → hasMany(AiLog::class)
    → Crear método: canAddProject() (ver sección 2.4)
    → Actualizar getDashboardData() para incluir datos de clientes

  app/Models/Project.php
    → Añadir fillable: brand_tone, service_scope, key_links, next_deadline, client_notes
    → Añadir casts: ['key_links' => 'array', 'next_deadline' => 'date']
    → Añadir relación: hasMany(Resource::class)
    → Añadir relación: hasMany(Idea::class)

  app/Models/Resource.php
    → Cambiar relación: belongsTo(Box::class) → belongsTo(Project::class)
    → Actualizar fillable: box_id → project_id

  app/Models/Idea.php
    → Añadir relación: belongsTo(Project::class) (nullable)
    → Añadir project_id a fillable
    → Eliminar relación: hasMany(VoiceRecording::class)

  app/Models/Task.php
    → Eliminar relación: hasMany(VoiceRecording::class)

  app/Models/Subscription.php
    → Actualizar getPrice(): premium_monthly=11.99, premium_yearly=119.00

CONTROLADORES:
  app/Http/Controllers/ProjectController.php
    → Dejar de requerir middleware premium (se mueve a grupo auth+verified)
    → store(): añadir validación canAddProject() para free users
    → show(): cargar relaciones: tasks, ideas, resources
    → store()/update(): aceptar nuevos campos (brand_tone, service_scope, key_links, etc.)

  app/Http/Controllers/ResourceController.php
    → Reestructurar: recibe {project} como padre en vez de {box}
    → create/store: anidados bajo /clients/{project}/resources

  app/Http/Controllers/DashboardController.php
    → Nuevo Panel "Hoy" con priorización inteligente + clientes en riesgo

POLICIES:
  app/Policies/ProjectPolicy.php
    → Ajustar: ya no requiere rol premium (solo verifica ownership)

  app/Policies/ResourcePolicy.php
    → Ajustar: verificar ownership via project padre (no box)

RUTAS:
  routes/web.php
    → Ver sección 2.6 para el nuevo contenido completo

FRONTEND:
  resources/js/components/app-sidebar.tsx
    → Eliminar items: Carpetas, Voz, Chat IA
    → Renombrar: "Clientes" en vez de "Proyectos"

  resources/js/pages/dashboard.tsx
    → Rediseñar como Panel "Hoy"

  resources/js/pages/projects/ (directorio completo)
    → Reestructurar como vistas de clientes (ficha, listado)

  resources/js/pages/welcome.tsx (~1100 líneas)
    → Actualizar copy y sección pricing (11.99/119 en vez de 9.99/99.99)

  resources/js/types/models/
    → Actualizar: interfaces de Project (nuevos campos), Resource (project_id), Idea (project_id)
    → Eliminar: interfaces de Box, VoiceRecording, AiConversation/AiMessage

SEEDERS:
  database/seeders/UserSeeder.php → Actualizar datos demo con clientes ejemplo

FORM REQUESTS:
  → Actualizar StoreProjectRequest / UpdateProjectRequest: aceptar nuevos campos
  → Actualizar StoreResourceRequest: project_id en vez de box_id
```

### 3.3 Archivos a CREAR

```
MODELO:
  app/Models/AiLog.php

CONTROLADOR:
  app/Http/Controllers/AiController.php (3 métodos: planDay, clientSummary, clientUpdate)

TESTS:
  tests/Feature/AiControllerTest.php

MIGRACIONES (5 archivos, usar php artisan make:migration):
  xxxx_add_client_context_fields_to_projects_table.php
  xxxx_add_project_id_to_ideas_table.php
  xxxx_add_project_id_to_resources_table.php
  xxxx_create_ai_logs_table.php
  xxxx_drop_legacy_tables_and_columns.php
```

---

## PARTE 4: REGLAS PARA CLAUDE

### 4.1 Convenciones obligatorias (heredadas del proyecto)

1. **Form Requests** para TODA validación, mensajes en español
2. **Route Model Binding** siempre (`Project $project`, nunca `string $id`)
3. **Eager loading** con `->with()` para evitar N+1
4. **Scopes** en modelos para queries reutilizables
5. **Policies** para autorización (ownership: `$model->user_id === auth()->id()`)
6. **Hard delete** para Task e Idea (SIN SoftDeletes)
7. **Cascade delete** para relaciones padre-hijo (Project → Tasks, Project → Resources)
8. **Copy freelancer-friendly** en toda la UI visible
9. **Nomenclatura dual**: código usa `Project`, UI dice "Cliente"
10. **Tests Pest 3**: helpers `createAdmin()`, `createPremiumUser()`, `createFreeUser()`
11. `withoutVite()` en `beforeEach` de Pest.php
12. RoleSeeder sembrado en cada test
13. **Design system**: paleta verde bosque, fuentes Nunito/Open Sans/Inter, shadcn/ui, Radix UI
14. **Inertia.js**: `Inertia::render()` en controladores (helper `inertia()` solo en rutas)
15. **user_modified_at** en entidades principales al actualizar
16. **TypeScript tipado** en frontend, tipos en `resources/js/types/`, barrel en index.ts
17. **Middleware**: SIEMPRE incluir `'verified'` junto a `'auth'` → `['auth', 'verified']`

### 4.2 Valores exactos de enums (COPIAR LITERAL — CON UNDERSCORE)

```php
// Roles Spatie
'free_user'         // NO 'freeuser'
'premium_user'      // NO 'premiumuser'
'admin'

// Subscription plan
'free'
'premium_monthly'   // NO 'premiummonthly'
'premium_yearly'    // NO 'premiumyearly'

// Subscription status
'active'            // (único valor usado; no hay cancelled/suspended)

// Payment status
'pending', 'completed', 'failed'

// Project status
'active', 'inactive', 'completed'

// Task status
'pending', 'completed'

// Task/Idea priority
'low', 'medium', 'high'

// Idea status
'active', 'resolved'

// Idea source
'manual', 'voice', 'ai_suggestion'  // NO 'aisuggestion'

// Resource type
'link', 'document', 'video', 'image', 'other'

// AiLog action_type (NUEVO)
'summary', 'update', 'plan_day'
```

### 4.3 Reglas de generación de código

- **Pregúntame antes de modificar** archivos con más de 100 líneas
- **Genera tests** para cada feature nueva (Pest 3)
- **No añadas dependencias npm/composer** sin consultarme
- **No cambies el stack** (nada de API REST, nada de Vue, nada de otro ORM)
- **Nuevas migraciones** siempre (no modifiques las 16 existentes, están cerradas)
- **No borres archivos** directamente; lista lo que hay que borrar y yo lo hago
- **IA usa config/services.php** para: `services.openai.key`, `services.openai.base_url`, `services.openai.model`
- **El pago es simulado** (80/20): no integres Stripe real
- **Route::resource con parameters()** para naming: `->parameters(['clients' => 'project'])`

### 4.4 Cómo comunicar cambios

Al proponer un cambio, usa este formato:
```
📁 ARCHIVO: app/Models/Project.php
🔧 ACCIÓN: Modificar
📝 CAMBIOS:
  - Añadir fillable: brand_tone, service_scope, key_links, next_deadline, client_notes
  - Añadir cast: 'key_links' => 'array', 'next_deadline' => 'date'
  - Añadir relación: hasMany(Resource::class)
  - Añadir relación: hasMany(Idea::class)
⚠️ IMPACTO: ProjectController@show debe cargar estas relaciones
```

---

## PARTE 5: PLAN DE EJECUCIÓN POR FASES

### Fase 1 (semana 1-2): Recortar y reestructurar

Instrucción para iniciar:
> "Empezamos Fase 1. Genera las 5 migraciones del punto 2.5 en orden, usando `php artisan make:migration`."

Pasos:
1. Crear las 5 migraciones (en orden estricto 1→5)
2. Actualizar modelo Project (nuevos campos, casts, relaciones)
3. Actualizar modelo Resource (box_id → project_id, belongsTo Project)
4. Actualizar modelo Idea (añadir project_id, belongsTo Project, eliminar hasMany VoiceRecording)
5. Actualizar modelo Task (eliminar hasMany VoiceRecording)
6. Crear modelo AiLog
7. Actualizar User.php (eliminar 3 relaciones, añadir aiLogs, crear canAddProject)
8. Actualizar Subscription.php (getPrice: 11.99/119)
9. Reestructurar ResourceController (anidado bajo Project en vez de Box)
10. Actualizar routes/web.php completo (ver sección 2.6)
11. Actualizar ProjectPolicy (sin requerir premium, solo ownership)
12. Actualizar ResourcePolicy (verificar via project padre)
13. Actualizar Form Requests de Project y Resource
14. Actualizar tests afectados (ProjectControllerTest, ResourceControllerTest)
15. Listarme archivos a borrar (yo los borro manualmente)

### Fase 2 (semana 3-4): Ficha de cliente + Dashboard "Hoy"

Instrucción para iniciar:
> "Empezamos Fase 2. Primero actualiza ProjectController@show para devolver la ficha completa con los 4 bloques."

Pasos:
1. ProjectController@show con eager load de tasks, ideas, resources
2. Vista React `/clients/{id}` — Ficha del Cliente (4 bloques + botones IA)
3. Actualizar getDashboardData() en User.php para datos de clientes
4. Dashboard `/dashboard` — Panel "Hoy" con priorización
5. Vista `/tasks` agrupada por cliente
6. Actualizar sidebar y navegación
7. Actualizar tipos TypeScript en resources/js/types/models/
8. Vista `/clients` — listado de tarjetas

### Fase 3 (semana 5-6): IA contextual

Instrucción para iniciar:
> "Empezamos Fase 3. Crea AiController con los 3 métodos. Usa config('services.openai') para las claves."

Pasos:
1. AiController con planDay, clientSummary, clientUpdate
2. System prompts contextuales (inyectar datos reales del usuario)
3. UI de los 3 botones (en dashboard + ficha de cliente)
4. Tests de los 3 endpoints (AiControllerTest)
5. Guardar outputs en ai_logs
6. Modals de upgrade cuando free user pulsa botón IA

### Fase 4 (semana 7-8): Pulido + Landing

Instrucción para iniciar:
> "Empezamos Fase 4. Actualiza welcome.tsx con la nueva propuesta de valor y precios 11.99/119."

Pasos:
1. Landing page con copy "memoria operativa por cliente"
2. Sección pricing Free vs Solo (11.99€/mes, 119€/año)
3. Testing end-to-end completo (ejecutar `php artisan test`)
4. Actualizar seeders con datos demo (2-3 clientes con tareas, notas y recursos)
5. Actualizar README.md y documentación

---

LISTO. No generes código hasta que te dé una instrucción específica de fase.
