# CLAUDE.md — Kosmos Client (Proyecto)

> Constitución operativa del repositorio. La IA la carga automáticamente en cada sesión.

## Rol y Contexto

- **Usuario:** Lead Architect / QA Manager del proyecto Kosmos.
- **IA:** ejecutor técnico bajo supervisión (Human-in-the-Loop). No decide estrategia.
- **Ante conflicto** entre una petición y estos estándares: **no saltarse la regla**. Proponer ADR en `docs/decision-log.md` y pedir confirmación.

### Orden de precedencia (mayor → menor)

1. Instrucciones explícitas del usuario en la conversación actual.
2. `CLAUDE.md` — reglas globales Kosmos Excellence + Laravel Boost.
3. **Este archivo** (contexto de proyecto).
4. Skills del registry en `.agents/skills/` — cargadas bajo demanda.

---

## 1. Stack Tecnológico

**Backend**
- PHP 8.4 · Laravel 12 · Inertia Laravel v2 · Fortify v1 · Wayfinder v0
- Pest 3 · PHPUnit 11 · Pint 1 · **Larastan/PHPStan 3** · Laravel Boost v2 · Pail v1 · Sail v1
- **Reverb 1** (websockets) · **Stripe PHP 20** (pagos) · **Google API Client 2** (Calendar/Meet) · **OpenAI PHP 0.19** (Kosmo + Whisper)
- **Spatie:** `laravel-permission` 7, `laravel-activitylog` 5 · **barryvdh/laravel-dompdf** 3 (facturas)

**Frontend**
- React 19.2 · TypeScript 5.7 · Inertia React v2 · `@laravel/echo-react` (Reverb)
- Chakra UI v3.34 — **único sistema visual** (Tailwind eliminado; Radix UI: restos pre-migración a reemplazar)
- **Zod 4** (validación cliente) · **Vitest 2** + Testing Library (tests frontend)
- Vite 7 · ESLint 9 · Prettier 3 · `babel-plugin-react-compiler`

Fuente de verdad de versiones: [package.json](package.json) y [composer.json](composer.json). No asumir — leer.

---

## 2. Convenciones de Código

- **Idioma:** identificadores en inglés; comentarios de dominio pueden ir en español.
- **PHP:**
  - `PascalCase` clases · `camelCase` métodos/variables · `snake_case` columnas/tablas DB.
  - Constructor property promotion, return types y typed params obligatorios.
  - PHPDoc > comentarios inline. Comentarios solo cuando el **por qué** no es obvio.
  - Curly braces siempre, incluso en bodies de una línea.
- **TS/React:**
  - `PascalCase` componentes · `camelCase` hooks/variables · `kebab-case` archivos UI (ya en uso en [resources/js/components](resources/js/components/)).
  - Tipos explícitos en props y returns de hooks.
- **URLs/Rutas:** siempre Wayfinder (`@/actions`, `@/routes`). Nunca strings hardcoded.
- **Nombrado descriptivo** (`isRegisteredForDiscounts`, no `discount()`).

---

## 3. Patrones Arquitectónicos

**Backend**
- Controllers finos → **Actions** ([app/Actions](app/Actions/)) o **Services** ([app/Services](app/Services/)) para lógica de negocio.
- Single-Action Controllers cuando la acción lo justifica.
- **Form Requests** para validación, **Policies** para autorización, **API Resources** versionados para APIs.
- Eloquent: casts en método `casts()`, scopes tipados, eager loading para evitar N+1.
- IO pesado → queues. Lecturas caras → cache.

**Frontend**
- Composición de componentes + hooks. Estado compartido vía props de Inertia / shared data.
- `useForm` de Inertia para formularios. Layouts persistentes. Deferred props **siempre** con skeleton animado.
- **UI nueva:** Chakra UI v3 vía MCP (`mcp__chakra-ui__*`) como fuente de verdad.

---

## 4. Prohibiciones

- ❌ `useState` local cuando los datos vienen de props de Inertia o shared data.
- ❌ Clases Tailwind en cualquier componente, nuevo o existente — Chakra UI v3 es el único sistema visual permitido.
- ❌ Crear componentes visuales sin consultar primero el MCP de Chakra (`mcp__chakra-ui__*`) y la skill `chakra-ui-v3`.
- ❌ URLs hardcoded — usar Wayfinder.
- ❌ Dependencias nuevas sin ADR aprobado en [docs/decision-log.md](docs/decision-log.md).
- ❌ Commits con `--no-verify`, `--no-gpg-sign` o similares.
- ❌ Commitear `.env`, credenciales o secretos.
- ❌ Desactivar, borrar o saltar tests sin aprobación explícita.
- ❌ Crear archivos de documentación (`*.md`, README) sin petición del usuario.
- ❌ Cambiar la estructura base de carpetas sin aprobación.
- ⚠️ Push directo a `main`: permitido solo bajo el override solo-dev vigente (ver `workflow_main_branch.md`); en cuanto se incorpore otro colaborador, vuelve la regla de PR obligatorio.

---

## 5. Estructura del Proyecto

```
app/
  Actions/            # Casos de uso (lógica de negocio atómica)
  Services/           # Servicios con estado o integraciones
  Http/
    Controllers/      # Finos; delegan a Actions/Services
    Requests/         # Validación (Form Requests)
    Middleware/
  Models/             # Eloquent; casts() en método
  Policies/           # Autorización
  Jobs/ Observers/ Notifications/ Providers/
resources/
  js/
    pages/            # Inertia pages (1 archivo = 1 ruta)
    layouts/          # Layouts persistentes
    components/       # UI reusable (kebab-case)
    hooks/ lib/ types/
    actions/ routes/  # GENERADOS por Wayfinder — no editar a mano
  views/              # Blade residual
tests/
  Feature/ Unit/      # Pest 3
.agents/skills/       # Skills Registry (carga bajo demanda)
.claude/              # Config local Claude Code
docs/                 # ADRs, decision-log, ai-usage-declaration
bootstrap/app.php     # Middleware, exceptions, routing (Laravel 12)
routes/               # web.php, auth.php, console.php, etc.
```

---

## 6. Workflow

### Spec-Driven Development
Validar intención antes de codificar. Para cambios no triviales → **Plan Mode**.

### Pre-cambio (obligatorio)
1. **`search-docs`** (Laravel Boost MCP) sobre el tema antes de proponer código.
2. **UI (obligatorio para cualquier componente visual):**
   - Leer `.agents/skills/chakra-ui-v3/SKILL.md` y `resources/js/lib/chakra-system.ts` antes de escribir código.
   - Consultar MCP de Chakra: `mcp__chakra-ui__list_components`, `get_component_example`, `get_component_props`, `v2_to_v3_code_review`.
   - Usar los tokens semánticos de `chakra-system.ts` (`brand`, `bg`, `fg`, `border`, `sidebar`, etc.) en lugar de valores hardcoded o clases CSS.
3. **Activar la skill relevante** del registry (carga modular, no duplicar su contenido aquí):
   - Backend: `laravel-patterns`, `laravel-specialist`, `php-pro`.
   - Frontend: `frontend-design`, `vercel-react-best-practices`, `vercel-composition-patterns`, `typescript-advanced-types`.
   - UI/Estilo: `chakra-ui-v3` (**obligatoria** en cualquier tarea visual).
   - Calidad: `accessibility`, `seo`, `vite`.
4. Usar también las skills declaradas en el CLAUDE.md global (`developing-with-fortify`, `wayfinder-development`, `pest-testing`, `inertia-react-development`, `laravel-inertia-react`, `laravel-best-practices`).

### Herramientas preferidas
- Boost MCP (`database-query`, `database-schema`, `browser-logs`, `last-error`, `read-log-entries`, `get-absolute-url`) sobre alternativas manuales.

---

## 7. Testing y CI/CD

**Regla:** cada cambio lleva test (`php artisan make:test --pest {name}`). No hay excepciones sin aprobación.

### Gate de pre-cierre (todos deben pasar)

```bash
vendor/bin/pint --dirty --format agent
vendor/bin/phpstan analyse           # Larastan — 0 errores
php artisan test --compact           # Pest 3 (Feature + Unit)
npm run lint
npm run types
npm run test                         # Vitest (componentes/hooks)
npm run build
```

- CI replica exactamente este gate.
- Tests con factories; no crear modelos a mano en tests.
- Tests de DB reales (no mockear DB) — ver feedback memories.
- Frontend: Vitest + Testing Library con `jsdom` para componentes y validadores Zod.
- Workflow: trabajar directo en `main` (override solo-dev — ver memoria `workflow_main_branch.md`).

---

## 8. Estilo de Commits y PRs

### Commit Automation

**Regla:** cuando el usuario dice "commit", Claude:
1. **Debe** cambiar el modelo a **Haiku** (`/model haiku`).
2. **Debe** desactivar thinking (`/thinking off`).
3. Ejecuta `git add` para archivos modificados/sin seguimiento.
4. Crea commit con mensaje **Conventional Commits** (en formato imperativo).
5. Ejecuta **`git push origin main`** inmediatamente después.
6. No hace preguntas de confirmación—sigue las instrucciones del usuario literalmente.

### Conventional Commits

```
<type>(<scope>): <subject>
```

- **Types:** `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf`, `ci`, `build`, `style`.
- **Scope:** área afectada (`ui`, `auth`, `db`, `api`, `ci`, etc.).
- **Subject:** imperativo, minúsculas, sin punto final, ≤ 72 chars.
- Referenciar `ADR-XXXX` en el cuerpo cuando aplique.

### Pull Requests

Descripción obligatoria con:
- **Qué** cambia y **por qué**.
- **Cómo se probó** (comandos ejecutados, tests añadidos).
- **Screenshots** para cambios de UI.
- **Checklist** del gate local (Pint, Pest, lint, types, build).
- Actualizar [docs/ai-usage-declaration.md](docs/ai-usage-declaration.md) si el PR fue asistido por IA.

---

## Estado actual del proyecto (2026-05)

**Dominios productivos**
- Pacientes, citas y disponibilidad (`AvailabilityService`, `CreateAppointment`).
- Videoconsulta vía Google Meet con `room_id` generado en backend, recordings y limpieza de evento al colgar; estado HTTP 410 para salas completadas.
- Transcripción Whisper con filtrado de alucinaciones y VAD cliente.
- Facturación: `BillingService` + `GenerateInvoiceForAppointment`, PDFs vía dompdf, **pago de paciente vía Stripe Checkout**, recordatorios (`PaymentReminderService`).
- Notas, mensajería, notificaciones, acuerdos de colaboración, RGPD (`RgpdService`), asistente Kosmo (`KosmoService` + OpenAI).
- Permisos vía Spatie, auditoría vía `laravel-activitylog`.

**Iniciativas finalizadas (orden cronológico de fases UI/calidad)**
- **Fase 1:** migración inicial Tailwind → Chakra UI v3 (welcome.tsx).
- **Fase 2:** infraestructura ARIA y migración de formularios de auth (`d95b945`).
- **Fase 3:** validación cliente con Zod + endurecimiento de Form Requests (`28bb0d4`).
- **Fase 4:** sustitución de tokens de paleta hardcoded por tokens semánticos de `chakra-system.ts` (`ce27702`).
- **Patrón emergente:** `SectionPanel` para layouts de detalle (estrenado en patient show).

**En curso / pendiente visible**
- WIP local sobre `welcome.tsx`, `badge.tsx`, `app.css` y `docs/clientkosmos-design-system.md` (rediseño/limpieza del design system doc).
- Restos de Radix UI (`@radix-ui/react-navigation-menu`, `react-select`, `react-slot`) por reemplazar por equivalentes Chakra v3.
- Mantener PHPStan en 0 errores tras la limpieza de `3776fad` (eloquent generics + property docblocks).

---

## Artefactos vivos (mantener al día)

- [docs/decision-log.md](docs/decision-log.md) — ADRs y excepciones a los estándares.
- [docs/ai-usage-declaration.md](docs/ai-usage-declaration.md) — declaración por PR asistido por IA.
- [docs/clientkosmos-design-system.md](docs/clientkosmos-design-system.md) — design system vivo (en rediseño).
- [.claude/project-context/](.claude/project-context/) — tech-stack, ERD, schema (si existe).

**Límite duro de este archivo:** 500 líneas. Si crece, mover reglas específicas a skills del registry.
