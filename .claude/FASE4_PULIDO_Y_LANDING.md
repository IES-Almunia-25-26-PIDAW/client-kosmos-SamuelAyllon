# Fase 4 — Pulido, landing y datos demo

Objetivo: alinear la experiencia de marketing y demo con el nuevo Flowly.

## 1. Landing (`welcome.tsx`)

- [ ] Actualizar el hero y la propuesta de valor a "memoria operativa por cliente"
- [ ] Ajustar secciones que hablen de "proyectos" para que hablen de "clientes"
- [ ] Asegurar que los ejemplos e ilustraciones se centran en freelancers multi-cliente

## 2. Pricing

- [ ] Actualizar precios visibles a:
  - [ ] Solo mensual: 11,99 €/mes
  - [ ] Solo anual: 119 €/año
- [ ] Mantener enums internos `premium_monthly` y `premium_yearly` (solo cambia el importe)
- [ ] Verificar consistencia entre landing, dashboard y cualquier modal de upgrade

## 3. UserSeeder y datos demo

- [ ] Revisar `database/seeders/UserSeeder.php`:
  - [ ] Actualmente solo crea 3 usuarios (admin, premium_user, free_user) y sus suscripciones
  - [ ] NO crea clientes, tareas, ideas ni recursos de ejemplo
- [ ] Añadir datos demo para **premium_user**:
  - [ ] 2–3 clientes con distintos colores y estados
  - [ ] Varias tareas por cliente (pendientes y completadas)
  - [ ] Notas/ideas ligadas a clientes
  - [ ] Recursos (links a Figma, Drive, etc.)
- [ ] Añadir datos demo para **free_user**:
  - [ ] 1 cliente con 2–3 tareas
  - [ ] Sin recursos (para que se note la diferencia con premium)

## 4. README y documentación

- [ ] Actualizar README.md para reflejar la nueva propuesta de valor
- [ ] Documentar brevemente las 3 fases del trabajo y el nuevo flujo
- [ ] Incluir instrucciones claras para levantar el proyecto y probar la demo

## 5. Revisión final

- [ ] Ejecutar `php artisan test`
- [ ] Probar como `admin`, `premium@flowly.test` y `free@flowly.test`
- [ ] Hacer captura de pantallas clave para portfolio
- [ ] Preparar branch final para merge
