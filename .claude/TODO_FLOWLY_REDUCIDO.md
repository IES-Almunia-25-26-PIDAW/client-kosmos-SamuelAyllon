# Flowly — TODO general para Claude

> Este archivo sirve como mapa de trabajo. Marca las casillas a medida que completas cada tarea.
> Siempre trabaja en una **rama nueva de Git** y ejecuta `php artisan test` con frecuencia.

## Estado inicial

- [ ] Crear rama nueva: `git checkout -b flowly`
- [ ] Confirmar que todos los tests pasan: `php artisan test`
- [ ] Leer `CLAUDE_BRIEFING_REDUCIDO.md` completo

## Fase 1 — Recortar y reestructurar (backend y rutas)

- [ ] Leer `FASE1_BACKEND_Y_RUTAS.md`
- [ ] Generar y aplicar migraciones de Fase 1
- [ ] Actualizar modelos (User, Project, Task, Idea, Resource, Subscription)
- [ ] Crear modelo `AiLog`
- [ ] Actualizar controladores afectados (ProjectController, ResourceController)
- [ ] Actualizar policies (ProjectPolicy, ResourcePolicy)
- [ ] Actualizar `routes/web.php`
- [ ] Actualizar Form Requests de Project y Resource
- [ ] Actualizar tests de backend afectados
- [ ] Ejecutar `php artisan test`

## Fase 2 — Ficha de cliente + Dashboard "Hoy"

- [ ] Leer `FASE2_FICHA_Y_DASHBOARD.md`
- [ ] Rediseñar `/clients/{id}` como ficha de cliente
- [ ] Rediseñar `/dashboard` como Panel "Hoy"
- [ ] Actualizar `/clients` (listado de clientes)
- [ ] Actualizar `/tasks` agrupada por cliente
- [ ] Actualizar sidebar y navegación
- [ ] Actualizar tipos TypeScript (`resources/js/types/models/*`)
- [ ] Ejecutar `php artisan test`

## Fase 3 — IA contextual (3 botones)

- [ ] Leer `FASE3_IA_CONTEXTUAL.md`
- [ ] Crear `AiController` con `planDay`, `clientSummary`, `clientUpdate`
- [ ] Crear modelo `AiLog` (si no se creó en Fase 1)
- [ ] Implementar endpoints `/ai/*` y guardado en `ai_logs`
- [ ] Integrar botones IA en dashboard y ficha de cliente
- [ ] Crear/actualizar tests de IA (`AiControllerTest`)
- [ ] Ejecutar `php artisan test`

## Fase 4 — Pulido, landing y datos demo

- [ ] Leer `FASE4_PULIDO_Y_LANDING.md`
- [ ] Actualizar landing (`welcome.tsx`) con nueva propuesta de valor y precios
- [ ] Actualizar pricing en copy (11,99 €/mes, 119 €/año)
- [ ] Actualizar `UserSeeder` con datos demo de clientes, tareas, notas y recursos
- [ ] Revisar y actualizar README.md
- [ ] Ejecutar `php artisan test`
- [ ] Hacer code review final y merge (si todo está correcto)
