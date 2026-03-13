# Fase 1 — Recortar y reestructurar (backend y rutas)

Objetivo: adaptar el backend y las rutas al nuevo modelo (clientes, recursos por cliente, IA con `AiLog`) **sin tocar aún el frontend**.

## 1. Migraciones

- [ ] Crear migración `add_client_context_fields_to_projects_table`
  - [ ] Añadir columnas: `brand_tone` (text, nullable), `service_scope` (text, nullable),
        `key_links` (json, nullable), `next_deadline` (date, nullable), `client_notes` (text, nullable)
- [ ] Crear migración `add_project_id_to_ideas_table`
  - [ ] Añadir `project_id` nullable con `->constrained('projects')->nullOnDelete()`
- [ ] Crear migración `add_project_id_to_resources_table`
  - [ ] Añadir `project_id` nullable con `->constrained('projects')->cascadeOnDelete()`
- [ ] Crear migración `create_ai_logs_table`
  - [ ] Campos: `user_id`, `project_id` nullable, `action_type` enum, `input_context` json nullable,
        `output_text` text, `created_at` timestamp useCurrent
- [ ] Crear migración `drop_legacy_tables_and_columns`
  - [ ] Quitar FK y columna `box_id` de `resources`
  - [ ] Hacer `project_id` NOT NULL en `resources`
  - [ ] Dropear tablas: `voice_recordings`, `ai_conversations`, `boxes`
- [ ] Ejecutar migraciones y confirmar que pasan

## 2. Modelos

### 2.1 User.php

- [ ] Eliminar relaciones: `boxes()`, `aiConversations()`, `voiceRecordings()`
- [ ] Añadir relación: `aiLogs()` → `hasMany(AiLog::class)`
- [ ] Crear método `canAddProject()`:
  - [ ] Admin y premium: return true
  - [ ] Free: máximo 1 project (`projects()->count() < 1`)

### 2.2 Project.php

- [ ] Añadir fillable: `brand_tone`, `service_scope`, `key_links`, `next_deadline`, `client_notes`
- [ ] Añadir casts: `key_links` → array, `next_deadline` → date
- [ ] Añadir relaciones: `hasMany(Resource::class)`, `hasMany(Idea::class)`

### 2.3 Task.php

- [ ] Eliminar relación `hasMany(VoiceRecording::class)`

### 2.4 Idea.php

- [ ] Añadir relación `belongsTo(Project::class)` (nullable)
- [ ] Añadir `project_id` a `$fillable`
- [ ] Eliminar relación `hasMany(VoiceRecording::class)`

### 2.5 Resource.php

- [ ] Cambiar relación `belongsTo(Box::class)` → `belongsTo(Project::class)`
- [ ] Cambiar `$fillable`: sustituir `box_id` por `project_id`

### 2.6 Subscription.php

- [ ] Actualizar `getPrice()` a 11.99/119.00 (manteniendo enums `premium_monthly` y `premium_yearly`)

### 2.7 AiLog.php (nuevo modelo)

- [ ] Crear modelo `AiLog` con relaciones `belongsTo(User::class)` y `belongsTo(Project::class)` nullable
- [ ] Configurar `$fillable` y `$casts` acordes a la tabla

## 3. Controladores

### 3.1 ProjectController.php

- [ ] En `store()`: seguir creando con `status = 'inactive'` y `user_modified_at = now()`
- [ ] Añadir validación de `canAddProject()` para usuarios free (antes de crear)
- [ ] En `show()`: preparar datos completos de ficha de cliente (tasks, ideas, resources)
- [ ] En `complete()`: decidir comportamiento (cambiar `status` a `completed` o similar) y corregir bug actual
- [ ] Preparar transición de `projects.*` a `clients.*` (rutas y redirects)

### 3.2 ResourceController.php

- [ ] Cambiar firma de `create()` y `store()` de `Box $box` a `Project $project`
- [ ] Cambiar usos de `box` por `project` en lógica y vistas
- [ ] En `update()`: arreglar bug añadiendo `$resource->update([...])`
- [ ] Cambiar redirects de `boxes.show` a `clients.show`, usando `project_id`

## 4. Policies

### 4.1 ProjectPolicy.php

- [ ] Añadir import `use App\Models\User;`
- [ ] Confirmar métodos `view`, `update`, `delete` con check de ownership (`$user->id === $project->user_id`)

### 4.2 ResourcePolicy.php

- [ ] Actualizar para comprobar ownership a través de `resource->project->user_id`

## 5. Rutas (`routes/web.php`)

- [ ] Mover todo el `Route::resource('projects', ...)` al grupo `['auth', 'verified']` con path `clients`
  - [ ] `Route::resource('clients', ProjectController::class)->parameters(['clients' => 'project']);`
  - [ ] `Route::patch('clients/{project}/complete', ...)`
- [ ] Eliminar rutas de `boxes` y `ai-chats`, `voice/transcribe`
- [ ] Añadir rutas de IA (`/ai/plan-day`, `/ai/client-summary/{project}`, `/ai/client-update/{project}`)
- [ ] Añadir rutas de recursos bajo `clients/{project}/resources`
- [ ] Mantener siempre middleware `['auth', 'verified']` y roles con underscore (`role:premium_user`)

## 6. Form Requests

- [ ] Actualizar `StoreProjectRequest` y `UpdateProjectRequest` para incluir nuevos campos de ficha de cliente
- [ ] Actualizar `StoreResourceRequest` / `UpdateResourceRequest` para usar `project_id` en vez de `box_id`

## 7. Tests

- [ ] Actualizar tests de ProjectController (`projects` → `clients` y nuevos límites de free)
- [ ] Actualizar tests de ResourceController (nuevo parent `project`)
- [ ] Eliminar tests de Box, VoiceRecording y AiChat una vez que el código esté migrado
- [ ] Ejecutar `php artisan test` y asegurar que todo pasa
