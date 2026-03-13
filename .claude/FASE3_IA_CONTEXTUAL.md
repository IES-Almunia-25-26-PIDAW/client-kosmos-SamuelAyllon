# Fase 3 — IA contextual (3 botones)

Objetivo: sustituir el chat IA genérico por 3 acciones muy concretas apoyadas en un nuevo modelo `AiLog`.

## 1. Modelo y migración de AiLog

- [ ] Verificar que la migración `create_ai_logs_table` ya existe (Fase 1)
- [ ] Crear modelo `AiLog` (si no se creó) con:
  - [ ] `belongsTo(User::class)`
  - [ ] `belongsTo(Project::class)` nullable
  - [ ] `$fillable`: `user_id`, `project_id`, `action_type`, `input_context`, `output_text`
  - [ ] `$casts`: `input_context` → array

## 2. AiController (nuevo)

- [ ] Crear `app/Http/Controllers/AiController.php`
- [ ] Método `planDay()`:
  - [ ] Recoge todas las tareas pendientes de todos los clientes
  - [ ] Llama al proveedor IA usando `config('services.openai.*')`
  - [ ] Devuelve lista priorizada de 3–5 acciones con justificación
  - [ ] Guarda la petición y respuesta en `ai_logs`
- [ ] Método `clientSummary(Project $project)`:
  - [ ] Recoge datos de ficha (tareas, ideas, recursos, fechas)
  - [ ] Genera resumen de 3–4 líneas
  - [ ] Guarda en `ai_logs`
- [ ] Método `clientUpdate(Project $project)`:
  - [ ] Recoge tareas completadas, pendientes y notas recientes
  - [ ] Genera texto tipo update profesional listo para email/Slack
  - [ ] Guarda en `ai_logs`

## 3. Rutas IA

- [ ] Añadir en `routes/web.php` (grupo premium_user):
  - [ ] `POST /ai/plan-day` → `AiController@planDay`
  - [ ] `POST /ai/client-summary/{project}` → `AiController@clientSummary`
  - [ ] `POST /ai/client-update/{project}` → `AiController@clientUpdate`

## 4. Integración frontend

### 4.1 Dashboard

- [ ] Añadir botón "Planifica mi día" que:
  - [ ] Lanza petición POST a `/ai/plan-day`
  - [ ] Muestra resultado (lista de 3–5 tareas) en un panel o modal
  - [ ] Muestra modal de upgrade si el usuario es `free_user`

### 4.2 Ficha de cliente

- [ ] Añadir botón "Recuérdame cómo está este cliente" que:
  - [ ] Lanza POST a `/ai/client-summary/{id}`
  - [ ] Muestra resumen en un panel o toast
- [ ] Añadir botón "Prepárame un update para enviarle" que:
  - [ ] Lanza POST a `/ai/client-update/{id}`
  - [ ] Muestra texto para copiar/pegar en email/Slack

## 5. Eliminación del chat IA genérico

- [ ] Asegurarse de que `AiChatController` y las rutas `ai-chats` ya no se usan
- [ ] Eliminar vistas/pages relacionadas con chat libre
- [ ] Confirmar que ninguna parte del frontend referencia aún `ai-chats`

## 6. Tests

- [ ] Crear `tests/Feature/AiControllerTest.php` con al menos:
  - [ ] `planDay_returns_prioritized_actions_for_premium_user`
  - [ ] `clientSummary_returns_summary_for_given_project`
  - [ ] `clientUpdate_returns_update_text_for_given_project`
  - [ ] Tests de autorización (free_user no accede, premium_user sí)
- [ ] Ejecutar `php artisan test`
