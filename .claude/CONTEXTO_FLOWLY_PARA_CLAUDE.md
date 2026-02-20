# CONTEXTO COMPLETO DE FLOWLY - PARA USAR EN CLAUDE

Copia todo este contenido y pégalo en Claude para que tenga el contexto completo del proyecto Flowly.

---

## 🎯 BRIEFING DEL PROYECTO

**Proyecto:** Flowly - Plataforma de Productividad Personal  
**Stack:** Laravel 12 + Inertia.js + React + SQLite  
**Modelo:** Freemium (3 roles: admin, premium_user, free_user)  
**Estado:** Fase de Desarrollo  
**Objetivo:** Centro de mando integrado para gestionar tareas, ideas, proyectos y conocimiento  

---

## 📋 ESPECIFICACIÓN RÁPIDA

### Qué es Flowly
Plataforma web donde usuarios pueden:
- Gestionar tareas personales (con límites según plan)
- Capturar ideas rápidamente
- Organizar proyectos (premium)
- Almacenar referencias/recursos (premium)
- Grabar tareas/ideas por voz (premium)
- Usar asistente IA para sugerencias (premium)

### Modelos de Datos (10 entidades)
```
User → Subscription, Payment, Project, Task, Idea, Box, Resource, AiConversation, VoiceRecording
Subscription → Plan (free/premium_monthly/premium_yearly)
Project → Tasks (1 a muchos)
Box → Resources (1 a muchos)
Task → User (muchos a 1)
Idea → User (muchos a 1)
```

### 3 Roles del Sistema
```
admin:         Acceso a todo + admin panel
premium_user:  Tareas ilimitadas, proyectos, voz, IA
free_user:     5 tareas máx, solo ideas, sin premium features
```

### 2 Planes de Pago (Simulados)
```
Free:              $0      (permanente, 5 tareas, sin features premium)
Premium Monthly:   $9.99   (1 mes, todo ilimitado)
Premium Yearly:    $99.99  (12 meses, todo ilimitado)
```

### Pago Simulado
```
80% de éxito → Crea Payment con status "completed" + actualiza Subscription
20% de fallo → Crea Payment con status "failed" + muestra error
```

---

## 🛣️ RUTAS PRINCIPALES

### Públicas
```
GET  /                    Landing page
GET  /pricing             Página de planes
GET  /login               Login (Fortify)
POST /login               Login (Fortify)
GET  /register            Registro (Fortify)
POST /register            Registro (Fortify)
```

### Autenticadas (Todos)
```
GET  /dashboard           Dashboard personal
GET  /tasks               Listar tareas (límite 5 para free)
POST /tasks               Crear tarea
PUT  /tasks/{id}          Actualizar tarea
DELETE /tasks/{id}        Eliminar tarea (soft delete)
GET  /ideas               Listar ideas
POST /ideas               Crear idea
PUT  /ideas/{id}          Actualizar idea
DELETE /ideas/{id}        Eliminar idea (soft delete)
GET  /subscription        Ver suscripción actual
GET  /checkout            Formulario de pago
POST /checkout            Procesar pago
```

### Premium (premium_user + admin)
```
GET  /projects            Listar proyectos
POST /projects            Crear proyecto
PUT  /projects/{id}       Actualizar proyecto
DELETE /projects/{id}     Eliminar proyecto
GET  /boxes               Listar cajas
POST /boxes               Crear caja
PUT  /boxes/{id}          Actualizar caja
DELETE /boxes/{id}        Eliminar caja
GET  /resources           Listar recursos
POST /resources           Crear recurso
PUT  /resources/{id}      Actualizar recurso
DELETE /resources/{id}    Eliminar recurso
POST /voice/transcribe    Transcribir audio (Whisper)
GET  /ai-chats            Historial IA
POST /ai-chats            Enviar mensaje a IA
```

### Admin (admin only)
```
GET  /admin/dashboard     Dashboard admin
GET  /admin/users         Listar usuarios
PUT  /admin/users/{id}    Cambiar rol
DELETE /admin/users/{id}  Eliminar usuario
GET  /admin/payments      Listar pagos
GET  /admin/subscriptions Listar suscripciones
```

---

## 🗄️ ESTRUCTURA DE TABLAS (13)

```
users
  id, name, email, password, email_verified_at, created_at, updated_at

subscriptions
  id, user_id, plan (enum), status (enum), started_at, expires_at, created_at, updated_at

payments
  id, user_id, plan (enum), amount, status (enum), payment_method, transaction_id, card_last_four, created_at, updated_at

projects
  id, user_id, name, description, status (enum), color, user_modified_at, created_at, updated_at

tasks
  id, user_id, project_id (nullable), name, description, priority (enum), status (enum), due_date, completed_at, user_modified_at, deleted_at, created_at, updated_at

ideas
  id, user_id, name, description, priority (enum), status (enum), source (enum), user_modified_at, deleted_at, created_at, updated_at

boxes
  id, user_id, name, description, category, user_modified_at, created_at, updated_at

resources
  id, user_id, box_id, name, description, url (nullable), type (enum), user_modified_at, created_at, updated_at

ai_conversations
  id, user_id, role (enum), message (longText), metadata (json), created_at

voice_recordings
  id, user_id, task_id (nullable), idea_id (nullable), file_path, transcription, status (enum), duration, error_message, created_at

Spatie Permission Tables (automáticas)
  roles, permissions, model_has_roles, model_has_permissions, role_has_permissions
```

---

## 🔐 VALIDACIONES CRÍTICAS

### Límite de Tareas para Free User
```php
if ($user->isFreeUser()) {
    $activeTasks = $user->tasks()->whereIn('status', ['pending', 'in_progress'])->count();
    if ($activeTasks >= 5) {
        throw new ValidationException("Máximo 5 tareas activas para usuarios free");
    }
}
```

### Ownership Check
```php
// Cada usuario solo puede editar sus propios datos
if ($model->user_id !== auth()->id()) {
    return 403 Forbidden;
}
```

### Acceso por Rol
```php
// Premium features solo para premium_user o admin
if (!auth()->user()->hasRole(['premium_user', 'admin'])) {
    return 403 Forbidden;
}
```

---

## 📦 STACK TECNOLÓGICO EXACTO

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Backend | Laravel | 12 |
| ORM | Eloquent | (Laravel 12) |
| Auth | Laravel Fortify | 1.x |
| Roles | Spatie Permission | 6.x |
| Frontend | React | 18+ |
| SSR Bridge | Inertia.js | 2.x |
| Bundler | Vite | 5+ |
| Testing | Pest | 2.x |
| Database | SQLite | (local) |
| PHP | 8.2+ | |

### Integraciones Externas (Opcionales)
```
OpenAI Whisper API → POST /voice/transcribe (backend)
OpenAI GPT-3.5 Turbo → POST /ai-chats (backend)
```

---

## 👥 CREDENCIALES DE PRUEBA

```
Admin User:
  Email: admin@flowly.test
  Password: password
  Rol: admin

Premium User:
  Email: premium@flowly.test
  Password: password
  Rol: premium_user

Free User:
  Email: free@flowly.test
  Password: password
  Rol: free_user
```

---

## ✨ FEATURES PRINCIPALES

### Core (Todos)
- ✅ Autenticación segura (login, registro, logout, 2FA)
- ✅ Gestor de ideas sin límite
- ✅ Gestor de tareas (5 para free, ∞ para premium)
- ✅ Dashboard personal con estadísticas
- ✅ Filtros y búsqueda
- ✅ Soft deletes (recuperar datos)

### Premium Only
- ✅ Proyectos con jerarquía de tareas
- ✅ Cajas de conocimiento (categorizar recursos)
- ✅ Almacenar URLs y referencias
- ✅ Entrada de voz (OpenAI Whisper)
- ✅ Asistente IA avanzado (análisis, sugerencias)

### Admin Panel
- ✅ Dashboard con estadísticas globales
- ✅ Gestión de usuarios y roles
- ✅ Historial de pagos
- ✅ Control de suscripciones

---

## 🎯 CONVENCIONES DEL PROYECTO

### Backend (Laravel)
```
✅ Form Requests para TODA validación
✅ Route Model Binding (nunca string $id)
✅ Eager loading con with() para evitar N+1
✅ Scopes en modelos para queries reutilizables
✅ Gates/Policies para autorización
✅ user_modified_at en todas las entidades principales
✅ Soft deletes para Task e Idea
✅ Cascade delete para relaciones padre-hijo
```

### Frontend (React)
```
✅ Componentes en resources/js/Components/
✅ Páginas en resources/js/Pages/
✅ Layouts en resources/js/Layouts/
✅ Usar Inertia.js para pasar props desde controlador
✅ Sin API REST, comunicación via Inertia
```

### Testing
```
✅ Pest para testing
✅ Tests en tests/Feature/
✅ 50+ tests de cobertura
✅ Tests de Feature, no unitarios
✅ Usar RefreshDatabase para resetear BD entre tests
```

### Git
```
✅ Commits descriptivos
✅ Ramas por feature (feature/nombre)
✅ PRs antes de merge a main
✅ Seguir conveción: feat:, fix:, docs:
```

---

## 📊 MODELOS ELOQUENT (10)

### User
```php
hasOne Subscription
hasMany Projects, Tasks, Ideas, Boxes, Resources, Payments, AiConversations, VoiceRecordings
hasRoles (Spatie) → admin, premium_user, free_user

Métodos:
  isFreeUser()
  isPremiumUser()
  isAdmin()
  canAddTask()
  getDashboardData()
  getActiveTasksCount()
  getCompletedThisMonthCount()
```

### Subscription
```php
belongsTo User

Métodos:
  getPrice() → 0, 9.99, 99.99
  getDurationInDays() → null, 30, 365
  isActive() → bool
  upgradeToPremium(plan)
  downgradeToFree()
```

### Payment
```php
belongsTo User

Métodos:
  generateTransactionId() → static
  process() → simula 80% éxito, 20% fallo
  isSuccessful() → bool
```

### Project
```php
belongsTo User
hasMany Tasks (cascade delete)

Scopes:
  active(), archived(), forUser(User)

Métodos:
  getTasksSummary() → array
  getProgressPercentage() → int
```

### Task
```php
belongsTo User, Project (nullable)
Soft deletes

Scopes:
  active(), pending(), inProgress(), completed(), forUser(),
  byPriority(), overdue(), dueToday(), dueSoon()

Métodos:
  markAsCompleted()
  markAsInProgress()
  getStatusLabel(), getPriorityLabel()
  isOverdue(), isDueToday()
```

### Idea
```php
belongsTo User
Soft deletes

Scopes:
  active(), archived(), forUser(), byPriority(),
  fromVoice(), fromAiSuggestion()

Métodos:
  getPriorityLabel()
  getSourceLabel()
  archive(), activate()
```

### Box
```php
belongsTo User
hasMany Resources (cascade delete)

Métodos:
  getResourcesCount()
```

### Resource
```php
belongsTo User, Box

Métodos:
  getTypeLabel()
```

### AiConversation
```php
belongsTo User

Métodos estáticos:
  getConversationHistory(User, limit)
  addUserMessage(User, message, metadata)
  addAssistantMessage(User, message, metadata)
```

### VoiceRecording
```php
belongsTo User, Task (nullable), Idea (nullable)

Métodos:
  markAsProcessing(), markAsCompleted(transcription), markAsFailed(error)
  isProcessing(), isCompleted(), isFailed()
  getStatusLabel()
```

---

## 🔒 SEGURIDAD IMPLEMENTADA

### 1. Autorización por Rol
```
Middleware: role:admin
Middleware: role:premium_user|admin
Middleware: role:free_user|premium_user|admin
```

### 2. Ownership Checks
```
authorize('update', $task)
authorize('delete', $idea)
$model->user_id === auth()->id()
```

### 3. Validación de Límites
```
Free user: máx 5 tareas activas
Validado en StoreTaskRequest
```

### 4. Protección CSRF
```
Laravel Fortify incluido
@csrf en formularios
VerifyCsrfToken middleware
```

### 5. Encriptación
```
Passwords: bcrypt
API keys en .env
No guardar tokens en BD
```

---

## 🧪 TESTING (50+ TESTS)

```
TaskControllerTest
  - List, create, update, delete
  - Límite 5 tareas para free
  - Ownership check
  - Mark as completed

IdeaControllerTest
  - CRUD completo
  - Disponible para free y premium

ProjectControllerTest
  - CRUD (solo premium)
  - Forbidden para free_user

CheckoutControllerTest
  - Validar tarjeta simulada
  - 80% éxito, 20% fallo
  - Actualizar suscripción

SubscriptionControllerTest
  - Ver suscripción actual

AdminDashboardControllerTest
  - Estadísticas globales
  - Acceso solo admin

AdminUserControllerTest
  - CRUD de usuarios
  - Cambiar roles
  - Proteger self-delete
```

---

## 📥 COMANDOS PARA COMENZAR

```bash
# 1. Crear proyecto
laravel new flowly
cd flowly

# 2. Instalar dependencias
composer install
npm install

# 3. Configurar
cp .env.example .env
php artisan key:generate
touch database/database.sqlite

# 4. Migraciones y seeders
php artisan migrate:fresh --seed

# 5. Iniciar desarrollo
php artisan serve          # Terminal 1
npm run dev               # Terminal 2

# 6. Acceder
http://localhost:8000
Admin: admin@flowly.test / password
```

---

## 🎓 CÓMO USAR ESTO CON CLAUDE

### Opción 1: Pedir Ayuda General
```
"Ayúdame a entender la arquitectura de Flowly"
"¿Cómo funciona el sistema de roles?"
"¿Cuál es el flujo de pago simulado?"
```

### Opción 2: Pedir Código Específico
```
"¿Cómo creo el StoreTaskRequest?"
"¿Cómo implemento el middleware de roles?"
"¿Cómo escribo el test para TaskController?"
```

### Opción 3: Mentoría Socrática
```
"Usando metodología socrática, ayúdame a:
- Entender por qué usamos belongsTo aquí
- Pensar en las validaciones necesarias
- Diseñar la migración de tasks"
```

### Opción 4: Debuggear
```
"Tengo error: [error_message]. 
Mi código es: [código]
¿Qué está mal?"
```

---

## 🚀 PRÓXIMOS PASOS TÍPICOS

1. **Crear proyecto Laravel con este contexto**
   ```bash
   laravel new flowly
   ```

2. **Pedir a Claude que ayude con:**
   - Migrations y modelos
   - Controladores CRUD
   - Form Requests
   - Tests
   - Componentes React
   - Troubleshooting

3. **Usar el README.md que tenemos**
   - Para documentación
   - Para referencia rápida
   - Para troubleshooting

4. **Hacer commits frecuentes**
   ```bash
   git add .
   git commit -m "feat: [descripción]"
   ```

---

## ❓ PREGUNTAS QUE PUEDES HACER A CLAUDE

```
✅ "¿Cómo valido que un free_user no tenga más de 5 tareas?"
✅ "¿Cómo creo un scope en Task para filtrar por status?"
✅ "¿Cómo implemento la autorización con Spatie?"
✅ "¿Cómo escribo un test de Feature?"
✅ "¿Cuál es la diferencia entre belongsTo y hasMany?"
✅ "¿Cómo manejo errores en un controlador?"
✅ "¿Cómo integro OpenAI Whisper?"
✅ "¿Por qué usamos soft deletes?"
✅ "¿Cómo creo un custom gate?"
✅ "¿Cómo uso Inertia.js para pasar datos?"
```

---

## 📞 REFERENCIA RÁPIDA

### Rutas a Proteger
```
/projects/*          → role:premium_user|admin
/boxes/*             → role:premium_user|admin
/resources/*         → role:premium_user|admin
/voice/transcribe    → role:premium_user|admin
/ai-chats/*          → role:premium_user|admin
/admin/*             → role:admin
```

### Modelos a Validar
```
Task      → Límite 5 para free_user
Project   → Solo premium_user
Box       → Solo premium_user
Resource  → Solo premium_user
Voice     → Solo premium_user
AiChat    → Solo premium_user
```

### Métodos Críticos
```
User::isFreeUser()
User::isPremiumUser()
User::isAdmin()
User::canAddTask()
Subscription::upgradeToPremium(plan)
Payment::process() → simula éxito/fallo
Task::markAsCompleted()
```

---

## ✨ CHECKLIST DE COMPLETUDE

- [ ] Léiste este contexto completo
- [ ] Entiendes los 3 roles y sus limitaciones
- [ ] Sabes cómo funcionan las validaciones
- [ ] Conoces el flujo de pago simulado
- [ ] Entiendes la estructura de tablas
- [ ] Tienes claro qué features son premium
- [ ] Sabes dónde ir cuando necesites referencia
- [ ] Estás listo para pedir ayuda a Claude

---

**LISTO PARA COMENZAR: Copia todo esto y pégalo en Claude cuando necesites contexto del proyecto Flowly** ✅

Después puedes pedir:
- "Ayúdame a crear la migración de Tasks"
- "¿Cómo implemento el StoreTaskRequest?"
- "Escribe el test para TaskController"
- "¿Cómo integro Whisper para grabar voz?"
- etc.

¡Claude tendrá todo el contexto que necesita! 🚀
