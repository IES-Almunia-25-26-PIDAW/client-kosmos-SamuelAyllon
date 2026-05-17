# CLAUDE.md — Kosmos Client (Proyecto)

> Constitución operativa del repositorio. La IA la carga automáticamente en cada sesión.

## Rol y Contexto

- **Usuario:** Lead Architect / QA Manager del proyecto Kosmos.
- **IA:** ejecutor técnico bajo supervisión (Human-in-the-Loop). No decide estrategia.
- **Ante conflicto** entre una petición y estos estándares: **no saltarse la regla**. Proponer ADR en `docs/adr/` y pedir confirmación.

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
- Chakra UI v3.34 — **único sistema visual** (Tailwind eliminado; Radix UI eliminado)
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
- ❌ Dependencias nuevas sin ADR aprobado en [docs/adr/](docs/adr/).
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
docs/adr/             # ADRs individuales (NNNN-titulo.md) — fuente de verdad de decisiones
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
   - UI/Estilo: `chakra-ui-v3` (**obligatoria** en cualquier tarea visual), `chakra-ui-builder`, `chakra-ui-refactor`.
   - Calidad: `accessibility`, `seo`, `vite`.
   - Deploy/infra: `use-railway`.
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

**Modelo de producto y monetización**
- ClientKosmos es una **aplicación web gratuita** para profesionales autónomos. **No** es SaaS, **no** es multitenant, **no** hay planes ni suscripciones ni licencias por usuario.
- La app se financia con **publicidad integrada**; el usuario puede activar un **modo sin anuncios** mediante pago opcional (ver [ADR-0028](docs/adr/0028-monetization-free-app-ads-premium-no-ads.md)).
- La facturación Stripe + dompdf existente es **profesional → paciente** (dominio de negocio del usuario), no la monetización de la plataforma.

**Dominios productivos**
- Pacientes, citas y disponibilidad (`AvailabilityService`, `CreateAppointment`); auto-expiración de citas pasadas con revocación de enlace Meet.
- Videoconsulta vía Google Meet con `room_id` generado en backend, recordings y limpieza de evento al colgar; estado HTTP 410 para salas completadas.
- Transcripción Whisper con filtrado de alucinaciones y VAD cliente.
- Facturación: `BillingService` + `GenerateInvoiceForAppointment`, PDFs vía dompdf, **pago de paciente vía Stripe Checkout**, recordatorios (`PaymentReminderService`).
- Notas, mensajería, notificaciones, acuerdos de colaboración, RGPD (`RgpdService`), asistente Kosmo (`KosmoService` + OpenAI).
- Permisos vía Spatie (`AppointmentPolicy` y resto), auditoría vía `laravel-activitylog`.
- **Autenticación Google OAuth** para profesionales y pacientes (login + registro); Google Calendar vinculado al paciente en login Google.

**Iniciativas finalizadas (orden cronológico de fases UI/calidad)**
- **Fase 1:** migración inicial Tailwind → Chakra UI v3 (welcome.tsx).
- **Fase 2:** infraestructura ARIA y migración de formularios de auth (`d95b945`).
- **Fase 3:** validación cliente con Zod + endurecimiento de Form Requests (`28bb0d4`).
- **Fase 4:** sustitución de tokens de paleta hardcoded por tokens semánticos de `chakra-system.ts` (`ce27702`).
- **Patrón emergente:** `SectionPanel` para layouts de detalle (estrenado en patient show).
- **Fase 5:** migración de páginas professional + componentes admin/call/settings/shell a Chakra UI v3 (`7b15b9a`, `d82b692`). Radix UI eliminado completamente.
- **Calidad:** PHPStan elevado a nivel 7 con baseline vacía ([ADR-0031](docs/adr/0031-phpstan-level-7-baseline-drained.md), `6d884c7`).
- **Auth:** Google OAuth para profesionales y pacientes; Google Calendar vinculado al paciente en login Google (`5ce7b1e`, `1ec4068`).
- **Settings:** páginas de ajustes profesionales consolidadas en `/settings/profile` (`8cffe96`).
- **Deploy:** migración VPS+Traefik → **Railway** con Docker multi-stage + FrankenPHP (`d5bdff8`, `ba13466`); split `app` / `worker` vía `CONTAINER_ROLE` (`191c43c`).
- **Storage:** disco de Laravel migrado a **Cloudflare R2** para compartir uploads/PDFs entre servicios ([ADR-0032](docs/adr/0032-object-storage-cloudflare-r2.md), `41ef5f8`).
- **Mail:** transport **Brevo HTTP API** para bypassear el bloqueo de egreso SMTP de Railway (`676471d`); notificaciones de verificación y reset encoladas (`6306cef`).
- **Legal/OAuth:** rutas públicas `/privacy` y `/terms` (`d9f289c`), enlaces en footer y documento [docs/google-oauth-test-users-justification.md](docs/google-oauth-test-users-justification.md) (`b49b382`). Cliente OAuth en modo Testing por imposibilidad de verificar el subdominio `*.up.railway.app`.
- **Admin:** papelera de usuarios soft-deleted con restauración y borrado físico (`8c68960`); liberación de `email`/`google_id` al hacer soft-delete (`db01bf4`).
- **Debug:** endpoint `/admin/debug/create-test-appointment` para seedear citas joinables al instante (`6c4feb1`, `5a465e0`).

**En curso / pendiente visible**
- `docs/clientkosmos-design-system.md` en rediseño/limpieza (design system doc vivo).
- Revisar páginas restantes sin migrar a Chakra v3 (si las hay) — contrastar con ADRs de migración.
- Adquisición de dominio propio para sacar el cliente OAuth de modo Testing (ver plan de salida en `google-oauth-test-users-justification.md`).

---

## Artefactos vivos (mantener al día)

- [docs/adr/](docs/adr/) — ADRs individuales (fuente de verdad de decisiones y excepciones).
- [docs/ai-usage-declaration.md](docs/ai-usage-declaration.md) — declaración por PR asistido por IA.
- [docs/clientkosmos-design-system.md](docs/clientkosmos-design-system.md) — design system vivo (en rediseño).
- [.claude/project-context/](.claude/project-context/) — tech-stack, ERD, schema (si existe).

**Límite duro de este archivo:** 500 líneas. Si crece, mover reglas específicas a skills del registry.
