# Fase 2 — Ficha de cliente + Dashboard "Hoy"

Objetivo: rediseñar la experiencia principal del usuario alrededor de **clientes** y un panel diario muy simple.

## 1. Dashboard (`DashboardController.php` + página `dashboard.tsx`)

### 1.1 Backend

- [ ] En `DashboardController@index`:
  - [ ] Mantener el redirect a `admin.dashboard` para admins
  - [ ] Cambiar `activeProjects` para que **free users también tengan clientes**:
        - Eliminar condición `isPremiumUser()`
        - Consultar proyectos activos para cualquier usuario (`projects()->active()->get(['id','name','color'])`)
  - [ ] Añadir datos de "clientes en riesgo" (por ejemplo, próximos deadlines, tareas atrasadas)

### 1.2 Frontend (`resources/js/pages/dashboard.tsx`)

- [ ] Rediseñar el panel para mostrar:
  - [ ] Lista de 3–5 tareas críticas del día, agrupadas por cliente
  - [ ] Sección de "clientes en riesgo" con breve resumen
  - [ ] Botón "Planifica mi día" (visible solo para premium)
- [ ] Asegurar que props usados coinciden con los devueltos por el controlador

## 2. Ficha de cliente (`/clients/{id}`)

### 2.1 Backend (ProjectController@show)

- [ ] Cargar relaciones necesarias:
  - [ ] `tasks` (pendientes y completadas, con prioridad y fecha)
  - [ ] `ideas` vinculadas (`project_id`)
  - [ ] `resources` del cliente
- [ ] Preparar props para la ficha con 4 bloques:
  - [ ] Contexto estático: name, description, status, color, brand_tone, service_scope, key_links, client_notes
  - [ ] Timeline: últimas 5 tasks completadas + próximas 3 tasks pendientes
  - [ ] Recursos: lista de recursos con type y url
  - [ ] Notas/ideas: ideas activas y/o recientes

### 2.2 Frontend (`resources/js/pages/projects/show.tsx` → ficha cliente)

- [ ] Adaptar la página para usar el nuevo shape de `project` y props auxiliares
- [ ] Mostrar los 4 bloques claramente separados
- [ ] Añadir botones IA (placeholders), aunque la lógica real llegue en Fase 3
- [ ] Cambiar textos de "Proyecto" a "Cliente" a nivel de UI

## 3. Listado de clientes (`/clients`)

### 3.1 Backend (ProjectController@index)

- [ ] Mantener el `withCount` de tareas y tareas pendientes
- [ ] Asegurarse que funciona con el nuevo nombre de ruta `clients.index`

### 3.2 Frontend (`resources/js/pages/projects/index.tsx`)

- [ ] Mostrar tarjetas de cliente con:
  - [ ] Nombre + color dot
  - [ ] Nº tareas pendientes (`pending_tasks_count`)
  - [ ] Próximo deadline (si existe)
- [ ] Añadir botón "+ Nuevo cliente"
- [ ] Respetar límite de 1 cliente para usuarios free (mostrar modal de upgrade si lo exceden)

## 4. Vista de tareas (`/tasks`)

- [ ] Adaptar vista para agrupar tareas por cliente:
  - [ ] Sección por cliente con color dot y nombre
  - [ ] Sección "Sin cliente" para tareas sin `project_id`
- [ ] Mantener filtros básicos (por estado/cliente) si existen

## 5. Sidebar y navegación

- [ ] Actualizar `app-sidebar.tsx` para:
  - [ ] Renombrar "Proyectos" → "Clientes"
  - [ ] Eliminar enlaces a `boxes`, `voice`, `ai-chats`
  - [ ] Mantener acceso a dashboard, tareas, notas, clientes

## 6. Tipos TypeScript

- [ ] En `resources/js/types/models/index.ts`:
  - [ ] Eliminar exports de `box`, `voice-recording`, `ai-message`
  - [ ] Añadir export de `ai-log` (cuando exista)
- [ ] Actualizar interfaces de `project`, `task`, `idea`, `resource` para incluir nuevos campos
- [ ] Asegurarse de que todas las páginas utilicen los tipos actualizados

## 7. Tests

- [ ] Actualizar tests de dashboard para reflejar el nuevo comportamiento (free con clientes)
- [ ] Añadir tests de ProjectController@show con nuevos datos de ficha
- [ ] Ejecutar `php artisan test`
