# FLOWLY - QUICK REFERENCE CARD

**Imprime esto o guárdalo en un pestaña. Úsalo como referencia rápida.**

---

## 🎯 EN UN VISTAZO

| Aspecto | Valor |
|---------|-------|
| **Nombre** | Flowly |
| **Stack** | Laravel 12 + React + Inertia + SQLite |
| **Tipo** | Plataforma web freemium |
| **Modelos** | 10 entidades principales |
| **Roles** | 3 (admin, premium_user, free_user) |
| **Tests** | 180 tests Pest / 692 assertions (todos pasando ✅) |
| **Rutas** | 60+ rutas protegidas |

---

## 👥 ROLES DE UN VISTAZO

```
┌─────────────────┬──────────────┬──────────────┬──────────────┐
│ Feature         │ Free (max 5) │ Premium (∞)  │ Admin        │
├─────────────────┼──────────────┼──────────────┼──────────────┤
│ Ideas           │ ✅           │ ✅           │ ✅           │
│ Tasks           │ 5 máx        │ ∞            │ ∞            │
│ Projects        │ ❌           │ ✅           │ ❌           │
│ Boxes/Resources │ ❌           │ ✅           │ ❌           │
│ Voice (Whisper) │ ❌           │ ✅           │ ❌           │
│ IA Assistant    │ ❌           │ ✅           │ ❌           │
│ Admin Panel     │ ❌           │ ❌           │ ✅           │
└─────────────────┴──────────────┴──────────────┴──────────────┘
```

---

## 📋 CREDENCIALES

```bash
# Admin
email: admin@flowly.test
password: password
role: admin

# Premium
email: premium@flowly.test
password: password
role: premium_user

# Free
email: free@flowly.test
password: password
role: free_user
```

---

## 🛣️ RUTAS PRINCIPALES

### Públicas
```
GET  /              Landing
GET  /pricing       Planes
POST /login         Login (Fortify)
POST /register      Registro (Fortify)
```

### Autenticadas
```
GET  /dashboard     Dashboard
GET  /tasks         Listar tareas (límite 5 free)
POST /tasks         Crear tarea
GET  /ideas         Listar ideas
POST /ideas         Crear idea
GET  /subscription  Mi suscripción
GET  /checkout      Comprar premium
POST /checkout      Procesar pago
```

### Premium (solo premium_user — admin NO tiene acceso)
```
GET  /projects      Proyectos
GET  /boxes         Cajas
GET  /resources     Recursos
POST /voice/transcribe  Grabar voz (Whisper)
GET  /ai-chats      Chat IA
POST /ai-chats      Enviar mensaje IA
DELETE /ai-chats    Limpiar historial
```

### Admin
```
GET  /admin/dashboard    Dashboard
GET  /admin/users        Usuarios
GET  /admin/payments     Pagos
GET  /admin/subscriptions Suscripciones
```

---

## 🗄️ MODELOS (10)

```
User
  ├─ Subscription (1)
  ├─ Projects (∞)
  ├─ Tasks (∞)
  ├─ Ideas (∞)
  ├─ Boxes (∞)
  ├─ Resources (∞)
  ├─ Payments (∞)
  ├─ AiConversations (∞)
  └─ VoiceRecordings (∞)

Project
  └─ Tasks (∞)

Box
  └─ Resources (∞)

Subscription
  ├─ Plan: free | premium_monthly | premium_yearly
  └─ Status: active | expired | cancelled

Payment
  ├─ Plan: premium_monthly | premium_yearly
  └─ Status: pending | completed | failed
```

---

## 📝 CREAR NUEVA FEATURE

### 1. Crear Migration
```bash
php artisan make:migration create_mifeature_table
```

### 2. Crear Modelo
```bash
php artisan make:model Mifeature
```

### 3. Crear Controlador
```bash
php artisan make:controller MifeatureController
```

### 4. Crear Form Request
```bash
php artisan make:request StoreMifeatureRequest
```

### 5. Crear Test
```bash
php artisan make:test MifeatureControllerTest
```

### 6. Registrar en Routes
```php
Route::resource('mifeatures', MifeatureController::class);
```

### 7. Escribir Tests
```bash
php artisan test --filter=Mifeature
```

---

## ✅ VALIDACIONES CRÍTICAS

### Límite de Tareas para Free
```php
if ($user->isFreeUser() && $user->getActiveTasksCount() >= 5) {
    return error("Máximo 5 tareas");
}
```

### Ownership Check
```php
$this->authorize('update', $task); // En Form Request authorize()
```

### Acceso por Rol
```php
middleware('role:premium_user')  // En rutas premium (admin NO incluido)
middleware('role:admin')         // En rutas admin
hasRole('premium_user')          // En controladores
```

---

## 🧪 TESTING RÁPIDO

```bash
# Todos los tests
php artisan test

# Tests específicos
php artisan test --filter=TaskControllerTest

# Con coverage
php artisan test --coverage

# Verbose
php artisan test --verbose
```

---

## 🔧 COMANDOS COTIDIANOS

```bash
# Desarrollo
php artisan serve                    # Laravel
npm run dev                         # React/Vite

# Base de datos
php artisan migrate                 # Ejecutar migrations
php artisan migrate:fresh --seed    # Resetear + seeders
php artisan tinker                  # Consola interactiva

# Debugging
php artisan routes:list             # Ver rutas
php artisan config:cache            # Caché config
php artisan cache:clear             # Limpiar caché

# Usuarios (desde tinker)
$user = App\Models\User::find(1)
$user->assignRole('admin')
$user->hasRole('admin')
```

---

## 🎯 CHECKLIST ANTES DE COMMIT

```
☐ php artisan test → todos verdes
☐ Sin warnings en código
☐ Migrations creadas
☐ Modelos con relaciones
☐ Controladores con lógica
☐ Form Requests con validación
☐ Tests de feature
☐ Git commit descriptivo
```

---

## ❌ ERRORES COMUNES

| Error | Solución |
|-------|----------|
| `database.sqlite not found` | `touch database/database.sqlite` |
| `RoleDoesNotExist` | `php artisan migrate` + `php artisan db:seed` |
| `Class not found` | `composer dump-autoload` |
| `N+1 queries` | Usar `with()` en queries |
| `Unauthorized` / `authorize() undefined` | Controller base necesita `use AuthorizesRequests` |
| `Route not found` | Verificar `web.php` y `php artisan route:list` |
| `ViteException` en tests | Ya corregido: `app.blade.php` solo incluye `app.tsx` |
| `Inertia page does not exist` | Crear archivo `.tsx` en `resources/js/pages/` |
| `hasEnabledTwoFactorAuthentication()` | User model necesita `use TwoFactorAuthenticatable` |

---

## 🔐 SEGURIDAD CHECKLIST

- [ ] Validar entrada en FormRequest
- [ ] authorize() en cada acción
- [ ] Route Model Binding (no string $id)
- [ ] Eager loading (with())
- [ ] Cascade delete para relaciones (Task/Idea usan hard delete físico)
- [ ] Encrypting sensible data
- [ ] CSRF protection (Laravel automático)

---

## 📊 TABLA DE DATOS

```
users (id, name, email, password, ...)
subscriptions (id, user_id, plan, status, ...)
payments (id, user_id, plan, amount, status, ...)
projects (id, user_id, name, ...)
tasks (id, user_id, project_id, name, ...)
ideas (id, user_id, name, ...)
boxes (id, user_id, name, category, ...)
resources (id, user_id, box_id, name, url, ...)
ai_conversations (id, user_id, role, message, ...)
voice_recordings (id, user_id, task_id, idea_id, ...)
roles (id, name) [Spatie]
permissions (id, name) [Spatie]
model_has_roles (user_id, role_id) [Spatie]
```

---

## 🔗 LINKS RÁPIDOS

**En tu repositorio local:**
```
README.md                              - Inicio rápido
CONTEXTO_FLOWLY_PARA_CLAUDE.md        - Contexto completo
1_CONTROLHUB_DescripcionTecnica.md    - Arquitectura técnica
8_CONTROLHUB_Tests_Pest.php           - Tests de ejemplo
```

---

## 💡 TIPS PRO

### 1. Usar Scopes
```php
// En modelo
public function scopeActive($query) {
    return $query->where('status', 'active');
}

// En controlador
Task::active()->get();
```

### 2. Eager Loading
```php
// ❌ N+1 queries
Task::all()->each(fn($t) => $t->user->name);

// ✅ Correcto
Task::with('user')->get();
```

### 3. Form Requests
```php
// Validación + Autorización centralizada
class StoreTaskRequest extends FormRequest {
    public function authorize() {
        return auth()->user()->canAddTask();
    }
    
    public function rules() {
        return ['name' => 'required|string'];
    }
}
```

### 4. Testing
```php
test('user can create task', function() {
    $user = User::factory()->create();
    $response = $this->actingAs($user)->post('/tasks', [...]);
    $response->assertRedirect();
    $this->assertDatabaseHas('tasks', ['user_id' => $user->id]);
});
```

---

## 🚀 INICIO RÁPIDO (5 MIN)

```bash
laravel new flowly && cd flowly
composer install && npm install
cp .env.example .env && php artisan key:generate
touch database/database.sqlite
php artisan migrate:fresh --seed
php artisan serve & npm run dev
# http://localhost:8000
# admin@flowly.test / password
```

---

## 📞 AYUDA RÁPIDA EN CLAUDE

Copia/pega en Claude:

```
Proyecto: Flowly
Contexto: [pega de CONTEXTO_FLOWLY_PARA_CLAUDE.md]

Mi pregunta:
[Tu pregunta específica]
```

Claude tendrá todo el contexto listo.

---

## ✨ RECORDAR

```
✅ Tests primero (TDD)
✅ Commit frecuentes
✅ Documentación actualizada
✅ Código limpio
✅ Sin hardcodes
✅ Validación en servidor
✅ Autorización en cada ruta
✅ Eager loading siempre
```

---

---

## ⚠️ ENUMS VERIFICADOS (NO INVENTAR VALORES)

| Modelo | Campo | Valores válidos |
|--------|-------|-----------------|
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

---

---

## 🗂️ TIPOS TYPESCRIPT (`resources/js/types/`)

```
import type { Task } from '@/types';              // modelo
import type { DashboardProps } from '@/types';    // props de página
import type { AdminUsersIndexProps } from '@/types'; // props de vista admin
import type { PaginatedData } from '@/types';     // paginación genérica
```

| Subcarpeta | Tipos exportados |
|-----------|-----------------|
| `models/` | `Task`, `Idea`, `Project`, `Box`, `Resource`, `Subscription`, `Payment`, `RecentPayment`, `Role`, `VoiceRecording`, `AiMessage` |
| `shared/` | `PaginatedData<T>` |
| `pages/`  | `DashboardProps`, `TasksProps`, `IdeasProps`, `SubscriptionProps`, `CheckoutProps`, `AiChatsProps` |
| `admin/`  | `AdminStats`, `AdminUser`, `AdminDashboardProps`, `AdminUsersIndexProps`, `AdminUserShowProps`, `AdminPaymentsProps`, `AdminSubscriptionsProps` |

> Todos re-exportados desde `@/types` (barrel en `types/index.ts`)

---

## 📡 INERTIA — DATOS COMPARTIDOS (todas las páginas)

```tsx
const { auth } = usePage<{ auth: { user: User; is_admin: boolean; is_premium: boolean } }>().props;
```
Definido en `HandleInertiaRequests::share()`.

---

**Última actualización:** Marzo 2026
**Versión:** 1.5 Flowly (180 tests / 692 assertions — proyecto completo y entregable)

Imprime esto o mantenlo en una pestaña. Te ahorrará tiempo. 📌
