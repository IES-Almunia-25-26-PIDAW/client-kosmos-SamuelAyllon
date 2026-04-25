# CLAUDE.md — Kosmos Client (Proyecto)

> Constitución operativa del repositorio. La IA la carga automáticamente en cada sesión.

## Rol y Contexto

- **Usuario:** Lead Architect / QA Manager del proyecto Kosmos.
- **IA:** ejecutor técnico bajo supervisión (Human-in-the-Loop). No decide estrategia.
- **Ante conflicto** entre una petición y estos estándares: **no saltarse la regla**. Proponer ADR en `docs/decision-log.md` y pedir confirmación.

### Orden de precedencia (mayor → menor)

1. Instrucciones explícitas del usuario en la conversación actual.
2. `c:\Users\usuario\Desktop\CLAUDE.md` — reglas globales Kosmos Excellence + Laravel Boost.
3. **Este archivo** (contexto de proyecto).
4. Skills del registry en `.agents/skills/` — cargadas bajo demanda.

---

## 1. Stack Tecnológico

**Backend**
- PHP 8.4 · Laravel 12 · Inertia Laravel v2 · Fortify v1 · Wayfinder v0
- Pest 3 · PHPUnit 11 · Pint 1 · Laravel Boost v2 · Pail v1 · Sail v1

**Frontend**
- React 19 · TypeScript 5.7 · Inertia React v2
- Chakra UI v3.34 — **único sistema visual** (Tailwind eliminado; Radix UI: restos pre-migración a reemplazar)
- Vite 7 · ESLint 9 · Prettier 3

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
- ❌ Push directo a `main`.

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
php artisan test --compact
npm run lint
npm run types
npm run build
```

- CI replica exactamente este gate.
- Prohibido push directo a `main` — siempre PR con revisión.
- Tests con factories; no crear modelos a mano en tests.
- Tests de DB reales (no mockear DB) — ver feedback memories.

---

## 8. Estilo de Commits y PRs

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

## Artefactos vivos (mantener al día)

- [docs/decision-log.md](docs/decision-log.md) — ADRs y excepciones a los estándares.
- [docs/ai-usage-declaration.md](docs/ai-usage-declaration.md) — declaración por PR asistido por IA.
- [.claude/project-context/](.claude/project-context/) — tech-stack, ERD, schema (si existe).

**Límite duro de este archivo:** 500 líneas. Si crece, mover reglas específicas a skills del registry.
