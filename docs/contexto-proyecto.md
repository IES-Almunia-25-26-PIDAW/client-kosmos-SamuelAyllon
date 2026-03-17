# ClientKosmos — Contexto Completo y Estado del Proyecto

> Documento de referencia con todo el contexto necesario para entender ClientKosmos, su estado actual y las decisiones tomadas durante el desarrollo.

---

## 1. Que es ClientKosmos

ClientKosmos es una **plataforma web freemium de gestion multi-cliente para freelancers** desarrollada como **Proyecto Intermodular de 2o DAM** por Samuel Ayllon. Actua como la memoria operativa del freelancer: cada cliente tiene su ficha con tareas, ideas y recursos, y la IA contextual ayuda a priorizar y resumir el estado de cada proyecto.

### Publico objetivo
- Freelancers y autonomos que gestionan varios clientes simultaneamente
- Profesionales creativos (diseno, desarrollo, consultoria) que necesitan organizar entregables por cliente
- Cualquier profesional independiente que quiera centralizar su gestion de clientes en una sola herramienta

### Propuesta de valor
Una plataforma que organiza toda la gestion del freelancer por cliente: fichas de cliente, tareas asociadas, ideas, recursos y asistencia IA contextual, con un modelo freemium que permite empezar gratis (1 cliente) y escalar a Solo (ilimitado) cuando se necesite.

---

## 2. Estado Actual del Proyecto

### Resumen
- **Estado**: Proyecto completado y funcional
- **Tests**: 156 test cases — 100% pasando
- **Features**: Todas las features planificadas estan implementadas
- **Despliegue**: Docker multi-stage build listo para produccion con TiDB Cloud

### Features implementadas

| Feature | Estado | Plan |
|---------|--------|------|
| Autenticacion (login, registro, 2FA, verificacion email) | Completo | Todos |
| Fichas de cliente (CRUD + completar) | Completo | Todos (1 max free) |
| Gestion de tareas por cliente (CRUD + completar/reabrir) | Completo | Todos (5 max free) |
| Gestion de ideas (CRUD + resolver/reactivar) | Completo | Todos |
| Panel Hoy con tareas agrupadas por cliente y badges de riesgo | Completo | Todos |
| Header de contexto en ficha de cliente | Completo | Todos |
| Badges de riesgo en lista de clientes | Completo | Todos |
| Nudges contextuales de Kosmo (dismissable) | Completo | Solo |
| Upgrade prompts contextuales | Completo | Todos |
| Tutorial interactivo (spotlight + chatbot) | Completo | Todos |
| Landing page | Completo | Publico |
| Checkout simulado (80/20) | Completo | Todos |
| Modo oscuro/claro | Completo | Todos |
| Recursos por cliente | Completo | Solo |
| IA contextual (planificar dia, resumen cliente, parte semanal) | Completo | Solo |
| Panel de administracion | Completo | Admin |

---

## 3. Arquitectura Tecnica

### Stack
- **Backend**: Laravel 12 + PHP 8.4 + Eloquent ORM
- **Frontend**: React 19 + TypeScript 5.7 + Inertia.js 2.3
- **UI**: shadcn/ui (28 componentes) + Tailwind CSS 4.0 + Lucide icons
- **Testing**: Pest 3
- **Build**: Vite 7 con React Compiler
- **Auth**: Laravel Fortify + Spatie Permission
- **IA**: openai-php/client (compatible con Groq y OpenAI)
- **BD**: SQLite (dev) / TiDB Cloud Serverless (prod)

### Patron SPA monolitica
ClientKosmos usa **Inertia.js** como puente entre Laravel y React. No hay API REST: Laravel renderiza paginas React directamente. Esto simplifica:
- Autenticacion (sesiones nativas de Laravel)
- Validacion (Form Requests con errores automaticos en el frontend)
- Navegacion (sin router de cliente, Inertia maneja las transiciones)

### Modelos de datos (8)
- **User**: Hub central con relaciones a todo. Roles via Spatie. Metodos: `canAddTask()`, `getDashboardData()`, `isFreeUser()`, `isPremiumUser()`, `isAdmin()`
- **Task**: Prioridades (low/medium/high), status (pending/completed), due_date obligatoria, asignacion a cliente (project_id). Hard delete.
- **Idea**: Ideas rapidas. Status (active/resolved), source (manual). Hard delete.
- **Project**: Ficha de cliente. Status (active/inactive/completed). Color personalizable. `getProgressPercentage()`.
- **Resource**: Recurso asociado a un cliente (project_id). Tipos: link/document/video/image/other.
- **Subscription**: Plan del usuario (free/solo_monthly/solo_yearly). Control de expiracion.
- **Payment**: Transacciones simuladas. Solo almacena ultimos 4 digitos de tarjeta.
- **AiLog**: Registro de acciones IA. action_type (plan_day/client_summary/client_update). Guarda input_context y output_text.

### Seguridad (4 capas)
1. **Middleware de rutas**: `role:premium_user` y `role:admin` (Spatie)
2. **Policies**: TaskPolicy, IdeaPolicy, ProjectPolicy, ResourcePolicy — solo el owner puede modificar
3. **Form Requests**: Clases de validacion para toda entrada de usuario
4. **Logica de negocio**: `canAddTask()` para limite free, bloqueo login sin rol asignado

---

## 4. Decisiones Tecnicas Clave

### SoftDeletes eliminado (Sesion 2)
Task e Idea usaban SoftDeletes inicialmente. Se elimino el trait porque:
- El proyecto no necesita papelera ni recuperacion de datos
- Simplifica las queries y el conteo de tareas
- La columna `deleted_at` permanece en la BD pero Eloquent la ignora

### Hard delete en frontend
Se usa `router.delete(url)` de `@inertiajs/react` que genera un HTTP DELETE real. No es un soft delete camuflado.

### Ruta home sin redirect
`GET /` renderiza `welcome` via Inertia, sin redirect a `/login`. Esto era necesario porque los tests de la landing page fallaban con redirect.

### AiConversation sin timestamps
`$timestamps = false` porque solo necesitamos `created_at` (se gestiona manualmente). No tiene `updated_at` porque los mensajes de chat son inmutables.

### Pago simulado
`Payment::process()` simula un gateway con 80% exito. Solo almacena ultimos 4 digitos (PCI-DSS). Transaction ID formato: `TXN_` + 16 caracteres aleatorios.

### IA context-aware
El `AiController` expone 3 endpoints de IA contextual (no es un chat conversacional):
- **planDay**: Recoge tareas pendientes del usuario y genera un plan del dia con 3-5 acciones priorizadas.
- **clientSummary**: Genera un resumen de 3-4 lineas del estado de un cliente (tareas pendientes, completadas, ideas).
- **clientUpdate**: Genera un parte semanal detallado del cliente (progreso, bloqueos, proximos pasos).

El system prompt se genera dinamicamente con datos reales del usuario/cliente.

### Groq como alternativa gratuita
La integracion IA soporta tanto OpenAI como Groq (14.400 req/dia gratis). El cambio es transparente: solo se cambian las variables `OPENAI_BASE_URL` y `OPENAI_API_KEY` en `.env`.

### Nudges de Kosmo dismissable (Sprint 4)
Los nudges contextuales de Kosmo se guardan en localStorage con reset diario. Cada nudge tiene una clave unica por fecha (dashboard) o por cliente+fecha (ficha de cliente), permitiendo que reaparezcan al dia siguiente si las condiciones se mantienen.

---

## 5. Enums del Sistema

Referencia rapida de todos los valores enum validos:

| Modelo | Campo | Valores |
|--------|-------|---------|
| Task | status | `pending`, `completed` |
| Task | priority | `low`, `medium`, `high` |
| Project | status | `active`, `inactive`, `completed` |
| Idea | status | `active`, `resolved` |
| Idea | source | `manual` |
| Idea | priority | `low`, `medium`, `high` |
| Subscription | plan | `free`, `solo_monthly`, `solo_yearly` |
| Resource | type | `link`, `document`, `video`, `image`, `other` |
| Payment | status | `pending`, `completed`, `failed` |
| AiLog | action_type | `plan_day`, `client_summary`, `client_update` |

---

## 6. Base de Datos

### Desarrollo y tests
- **Motor**: SQLite
- **Archivo**: `database/database.sqlite`
- **Migraciones**: 16 archivos
- **Seeders**: RoleSeeder (3 roles) + UserSeeder (3 usuarios de prueba con datos demo: clientes, tareas, ideas, recursos)

### Produccion
- **Motor**: TiDB Cloud Serverless (MySQL-compatible)
- **Region**: EU Central 1 (Frankfurt)
- **Puerto**: 4000
- **SSL**: Certificado ISRG Root X1 en `storage/app/tidb-ca.pem` (en .gitignore)
- **Conexion**: `DB_CONNECTION=mysql` + `MYSQL_ATTR_SSL_CA`

### Migraciones principales
1. users (base + 2FA + tutorial_completed_at + user_modified_at)
2. permission_tables (Spatie roles/permissions)
3. subscriptions (plan, status, started_at, expires_at)
4. payments (plan, amount, status, payment_method, transaction_id)
5. projects (name, description, status, color) — fichas de cliente
6. tasks (name, priority, status, due_date, completed_at, project_id, deleted_at)
7. ideas (name, priority, status, source) — ideas
8. resources (name, url, type, project_id) — recursos por cliente
9. ai_logs (action_type, input_context, output_text, project_id) — registros IA

---

## 7. Testing

### Framework
Pest 3 con plugin Laravel. Cada test usa `RefreshDatabase` y helpers custom:
- `createAdmin()`: Usuario admin con rol
- `createPremiumUser()`: Usuario premium con suscripcion de 30 dias
- `createFreeUser()`: Usuario free con suscripcion gratuita
- `ensureRolesExist()`: Garantiza que los roles Spatie existen

### Estructura (156 test cases)
- **Auth**: Login, registro, verificacion email, reset password, 2FA, confirmacion
- **CRUD**: Tasks, Ideas, Projects (clientes), Resources
- **Autorizacion**: Roles, ownership, limites free
- **Funcionalidades**: Checkout, IA contextual, tutorial
- **Admin**: Dashboard, usuarios, pagos, suscripciones
- **Settings**: Perfil, contrasena, 2FA

### Ejecucion
```bash
php artisan test                    # Todos
php artisan test --filter=TaskC...  # Especifico
composer test                       # Lint + tests
```

---

## 8. Despliegue

### Docker
Multi-stage build:
1. **Stage 1 (Node 20)**: `npm ci && npm run build` — genera assets en `/app/public/build`
2. **Stage 2 (PHP 8.2)**: Instala extensiones PHP, copia Composer deps y assets del Stage 1

`docker-entrypoint.sh`:
- Copia `.env.example` si no existe `.env`
- Genera `APP_KEY` si esta vacio
- Ejecuta `migrate --force` y `db:seed`
- Imprime credenciales de prueba en consola

### Produccion
- BD: TiDB Cloud Serverless con SSL
- Cert: `storage/app/tidb-ca.pem` (no commiteado)
- Variables sensibles: `OPENAI_API_KEY`, credenciales BD

---

## 9. Archivos Criticos

| Archivo | Proposito |
|---------|-----------|
| `resources/css/app.css` | Design system completo (tokens, animaciones, dark mode) |
| `resources/views/app.blade.php` | Entry point HTML, carga fuentes desde bunny.net |
| `resources/js/assets/logo.png` | Logo oficial de ClientKosmos |
| `routes/web.php` | Todas las rutas con middleware |
| `config/services.php` | Configuracion OpenAI/Groq |
| `app/Models/User.php` | Logica central de roles, limites y dashboard |
| `app/Http/Controllers/AiController.php` | IA contextual (3 endpoints: planDay, clientSummary, clientUpdate) |
| `docker-entrypoint.sh` | Script de inicializacion del contenedor |
| `storage/app/tidb-ca.pem` | Cert SSL TiDB (NO commitear) |

---

## 10. Cronologia del Desarrollo

El proyecto se desarrollo iterativamente en fases, cada una anadiendo capas de funcionalidad:

### Fase 1 — Esqueleto y autenticacion
Setup inicial, modelos base (User, Task, Idea, Subscription, Payment), autenticacion Fortify, roles Spatie, CRUD de tareas e ideas, checkout simulado, dashboard condicional, tutorial interactivo, landing page, panel admin, design system, dark mode, Docker.

### Fase 2 — Pivote a multi-cliente
Transformacion de la arquitectura: "Proyectos" pasan a ser "Clientes" (fichas de cliente). Ideas (antes Notas) ahora usan rutas /ideas. Eliminacion de Cajas (Box) y Voz (VoiceRecording). Recursos asociados directamente al cliente. Chat IA conversacional reemplazado por IA contextual con 3 endpoints (planDay, clientSummary, clientUpdate). Modelo AiConversation eliminado, reemplazado por AiLog.

### Fase 3 — Testing exhaustivo
Reescritura completa de los tests para reflejar la nueva arquitectura. 156 test cases y 615 assertions pasando al 100%. Tests cubren: auth, CRUD de clientes/tareas/ideas/recursos, IA contextual, checkout, admin, settings.

### Fase 4 — Pulido y landing
Landing page reescrita para freelancers multi-cliente. Precios actualizados: 0€/11.99€/119€. Planes renombrados a "Gratuito"/"Solo Mensual"/"Solo Anual". UserSeeder con datos demo realistas (3 clientes con tareas, ideas y recursos). README y documentacion actualizados.

### Fase 5 — UX y conversion (ClientKosmos rebrand)
Rebrand completo: Flowly → ClientKosmos, Flowy → Kosmo. Panel Hoy reestructurado con tareas agrupadas por cliente. Header de contexto en fichas de cliente. Badges de riesgo en lista de clientes. Nudges contextuales de Kosmo (dismissable, reset diario). Upgrade prompts contextuales (copy refinado en limites de clientes, tareas e IA). Documentacion y Docker actualizados.
