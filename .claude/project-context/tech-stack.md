---
description: Technology stack, dependency versions, and best practices for client-kosmos
globs:
alwaysApply: false
---
# Technology Stack & Dependency Guide

## Stack Overview

| Layer | Technology | Version |
|-------|-----------|---------|
| Language (backend) | PHP | ^8.4 |
| Framework (backend) | Laravel | ^12.0 |
| Auth scaffolding | Laravel Fortify | ^1.30 |
| Roles & permissions | Spatie Laravel Permission | ^7.2 |
| AI integration | openai-php/client | ^0.19.0 |
| Bridge (SPA) | Inertia.js Laravel adapter | ^2.0 |
| Language (frontend) | TypeScript | ^5.7.2 |
| UI framework | React | ^19.2.0 |
| Bundler | Vite | ^7.0.4 |
| CSS framework | Tailwind CSS | ^4.0.0 |
| Component library | shadcn/ui (Radix UI) | ^1.x / ^2.x |
| HTTP client | Axios | ^1.13.6 |
| Icons | Lucide React | ^0.475.0 |
| Testing (PHP) | Pest | ^3.8 |
| Code style (PHP) | Laravel Pint | ^1.24 |
| Code style (JS) | ESLint flat config + Prettier | ^9.x / ^3.x |

---

## Backend Dependencies

### PHP 8.4
- **Property hooks** (`get`/`set`) are available — use them for computed/validated model attributes instead of traditional accessors.
- **Asymmetric visibility** (`public private(set)`) enables readonly-like properties with controlled mutation.
- `array_find()` and `array_find_key()` are new native functions — prefer them over `collect()->first()` for plain arrays.
- The `#[\Deprecated]` attribute is now built-in — use it to mark legacy code.

### Laravel ^12.0
- Current major line for this repo; follow Laravel 12 upgrade notes when bumping dependencies.
- Service providers are consolidated — avoid creating unnecessary providers; use `AppServiceProvider` for bindings.
- Application bootstrap is via `bootstrap/app.php` with fluent middleware/exception registration.
- Eloquent `Model::$preventLazyLoading` should be enabled in development (`AppServiceProvider`).
- Always use `php artisan optimize` for production, not `config:cache` individually.

### Laravel Fortify ^1.30
- Handles registration, login, password reset, email verification, and 2FA.
- Custom actions are in `app/Actions/Fortify/` — this is where registration and password logic lives.
- The custom `LoginResponse` in `app/Http/Responses/LoginResponse.php` controls post-login redirects.
- 2FA is enabled — always test 2FA flows when modifying auth logic.

### Controller Architecture
- **Single-action controllers only**. One class per HTTP endpoint with a single `__invoke()` method — no resource controllers.
- Namespaced by domain folder under `app/Http/Controllers/<Domain>/`. Current domains:
  `Admin`, `Agreement`, `Appointment`, `Auth`, `Billing`, `CollaborationAgreement`,
  `ConsentForm`, `Dashboard`, `Document`, `Invoice`, `Kosmo`, `Message`, `Note`,
  `Onboarding`, `Patient`, `Payment`, `Portal`, `Referral`, `Schedule`, `Settings`,
  `Workspace`.
- Class names end with the action verb: `IndexAction`, `ShowAction`, `StoreAction`,
  `UpdateAction`, `DestroyAction`, etc. → e.g. `App\Http\Controllers\Appointment\IndexAction`.
- Render Inertia pages with **lowercase kebab-case** page paths matching
  `resources/js/pages/<domain>/<action>.tsx`:
  ```php
  return Inertia::render('appointments/index', [...]);
  ```
  Never use `Appointments/Index` (PascalCase) — it will not resolve.

### Custom Middleware & Aliases
- Registered in [bootstrap/app.php](bootstrap/app.php) (Laravel 12 fluent config):
  - `admin` → `EnsureAdmin` — Spatie `admin` role gate.
  - `professional` → `EnsureProfessional` — Spatie `professional` role gate.
  - `workspace.access` → `EnsureWorkspaceAccess` — verifies membership/ownership of the
    current workspace.
- Spatie shorthands are also aliased: `role`, `permission`, `role_or_permission`.
- `HandleInertiaRequests` and `HandleAppearance` are appended to the `web` group.

### Inertia Shared Data
- `HandleInertiaRequests::share()` exposes these keys globally to every Inertia page:
  - `name` — `config('app.name')`.
  - `auth.user` — the current `User` or `null`.
  - `isImpersonating` — `bool`, true if the session holds `impersonating_id`.
  - `sidebarOpen` — `bool`, derived from the `sidebar_state` cookie (default open).
  - `flash.success` / `flash.error` — transient session messages.
- Consume with `usePage().props` and type via `resources/js/types/shared/`.

### Inertia Laravel ^2.0 (+ `@inertiajs/react` ^2.3.7)
- **Major v2 features in use:**
  - `<Deferred>` component for lazy-loaded props — prefer it over loading spinners on initial page load for heavy data.
  - `usePoll()` hook for reactive data refresh without full page reload.
  - `useForm()` has improved reset/transform options — use `form.transform()` before submit for data shaping.
- Always type Inertia page props via `resources/js/types/pages/index.ts`.
- Use `router.visit()` (not `window.location`) for all programmatic navigation.
- SSR is configured (`ssr.tsx` entry) — avoid `window`/`document` access at module level; guard with `typeof window !== 'undefined'`.

### Laravel Wayfinder ^0.1.9 (+ `@laravel/vite-plugin-wayfinder` ^0.1.3)
- Generates **type-safe TypeScript action/route imports** from Laravel controllers.
- After adding or renaming routes/controllers, run `npm run dev` (or `php artisan wayfinder:generate`) to regenerate types.
- **Action controllers** → `resources/js/actions/App/Http/Controllers/<Domain>/<Action>.ts`
  (default export, one per `__invoke` controller):
  ```ts
  import IndexAction from '@/actions/App/Http/Controllers/Appointment/IndexAction';
  IndexAction.url({ query: { status: 'scheduled' } });
  IndexAction.get();          // { url, method: 'get' }
  IndexAction.form();         // form-action definition
  ```
- **Named routes** (e.g. Fortify) → `resources/js/routes/<name>.ts` (named exports):
  ```ts
  import { store } from '@/routes/register';
  post(store.url(), { onSuccess: () => reset() });
  ```
- Do NOT use the legacy `route()` Ziggy helper; Wayfinder is the project standard.

### Spatie Laravel Permission ^7.2
- Roles in use: `admin`, `professional`, `patient` (see `RoleSeeder`).
- Always assign permissions via roles, not directly on users (`$user->assignRole('professional')`).
- Route aliases include `admin` → `EnsureAdmin`, `professional` → `EnsureProfessional`, `workspace.access` → `EnsureWorkspaceAccess`, plus Spatie `role`, `permission`, `role_or_permission` middleware — match what `routes/*.php` actually uses.
- **Workspace membership** (`workspace_members.role`: `member` | `billing_manager`) is separate from Spatie roles; do not conflate the two.
- Cache is automatically invalidated on role/permission changes; no manual `cache:clear` needed for permissions.

### openai-php/client ^0.19.0
- All AI logic is encapsulated in `app/Services/KosmoService.php` — do not call the OpenAI client directly from controllers.
- API key is read from `config('services.openai.key')` — never hardcode or log it.
- Jobs (`GenerateDailyBriefing`, `GeneratePreSessionBriefing`) run via the queue — ensure `QUEUE_CONNECTION` is set appropriately in `.env`.

---

## Frontend Dependencies

### React ^19.2.0
- **React Compiler is active** (`babel-plugin-react-compiler` ^1.0.0 in devDependencies, configured in Vite).
  - The compiler automatically memoises components and values — **do not add manual `useMemo`, `useCallback`, or `React.memo` wrappers** unless profiling proves it necessary. They are redundant and add noise.
- `ref` is now a plain prop — `forwardRef` is no longer needed. Accept `ref` directly in function component props.
- New hooks available: `use()`, `useOptimistic()`, `useActionState()`, `useFormStatus()` — prefer these over custom state machines for async form actions.
- Hydration errors are now much more descriptive — read the full error message before debugging.

### TypeScript ^5.7.2
- Path aliases are configured in `tsconfig.json` (`@/` → `resources/js/`). Always use `@/` imports, never relative `../../` paths.
- Run `npm run types` (runs `tsc --noEmit`) to type-check without emitting files.
- Strict mode is expected — never use `any`; use `unknown` + type guards or precise types instead.
- All Inertia page prop types live in `resources/js/types/` and are re-exported from index files — always import from the nearest `index.ts`.
- **Files in `resources/js/{pages,layouts,components}/` use lowercase kebab-case** (`appointments/index.tsx`, `app-layout.tsx`, `input-error.tsx`). Never PascalCase (`Pages/`, `AppLayout.tsx`) — Inertia page resolution is case-sensitive and mirrors the `Inertia::render()` path.

### Vite ^7.0.4
- Requires **Node 20.18+**.
- `laravel-vite-plugin` ^2.0 handles manifest generation and hot-reload integration with Laravel.
- `@tailwindcss/vite` ^4.1.11 replaces the PostCSS plugin — do not add a `postcss.config.js` for Tailwind.
- SSR build: `npm run build:ssr` generates two bundles (client + server).
- Use `import.meta.env.VITE_*` for frontend environment variables — never `process.env`.

### Tailwind CSS ^4.0.0
- **v4 is a breaking rewrite** — the config model is fundamentally different from v3:
  - **No `tailwind.config.js`** — all theme customisation is done in CSS with `@theme {}` directives inside `resources/css/app.css`.
  - **No `content` array** — Tailwind v4 auto-detects template files.
  - Import is `@import "tailwindcss"` (not `@tailwind base/components/utilities`).
  - Uses Lightning CSS and the Oxide Rust engine for compilation.
- Class sorting is enforced by `prettier-plugin-tailwindcss` — run `npm run format` to auto-sort.
- Use `tailwind-merge` (`twMerge`) via the `cn()` helper in `lib/utils.ts` to merge conditional classes safely.

### shadcn/ui (Radix UI primitives)
- Components live in `resources/js/components/ui/` — prefer **wrappers** in `resources/js/components/` for project-specific behavior instead of forking primitives in place.
- New shadcn components are added via: `npx shadcn@latest add <component>` (not manual copy-paste).
- `class-variance-authority` (CVA) is used to define component variants — follow the same pattern when building new variant-based components.
- `clsx` + `tailwind-merge` are unified in the `cn()` helper (`lib/utils.ts`) — always use `cn()` for className composition.

### Lucide React ^0.475.0
- Official icon library for this project — do not install alternative icon sets.
- Always import icons individually: `import { UserIcon } from 'lucide-react'` (tree-shakeable, no barrel issues).
- Use the `<Icon>` wrapper in `resources/js/components/ui/icon.tsx` if you need consistent sizing across the app.

### Axios ^1.13.6
- A configured instance lives in `resources/js/lib/axios.ts` with CSRF headers pre-set.
- Always import from `@/lib/axios`, not directly from the `axios` package.
- For Inertia form submissions use `useForm()` — reserve raw Axios calls for non-Inertia API endpoints (e.g. Kosmo chat streaming).

---

## Dev Tooling

### Pest ^3.8 (+ pest-plugin-laravel ^3.2)
- All tests are written with Pest syntax — do not use raw PHPUnit class-based tests for new code.
- Feature tests live in `tests/Feature/`, unit tests in `tests/Unit/`.
- Use `pest()` datasets for parameterised tests.
- Run tests: `composer test` (clears config, checks Pint style, then runs test suite).

### Laravel Pint ^1.24
- PSR-12 + Laravel preset. Config in `pint.json`.
- Run `composer lint` to auto-fix, `composer test:lint` to check only.
- CI will fail if Pint reports style violations — always lint before committing.

### ESLint ^9.x (flat config) + Prettier ^3.x
- ESLint uses the new **flat config** format (`eslint.config.js`) — not `.eslintrc`.
- `typescript-eslint` v8 is configured — plugin rules apply to all `.ts`/`.tsx` files.
- `eslint-plugin-react-hooks` v7 enforces the Rules of Hooks — never disable these rules.
- Prettier handles formatting; ESLint handles code quality — they are integrated via `eslint-config-prettier`.
- Run `npm run lint` to auto-fix ESLint issues, `npm run format` to auto-format with Prettier.

### Laravel Wayfinder (Dev)
- `@laravel/vite-plugin-wayfinder` auto-generates `resources/js/actions/` during `npm run dev`.
- The generated files are **auto-generated** — do not edit them manually; they will be overwritten.
- This repo **gitignores** `resources/js/{actions,routes,wayfinder}/` (regenerate locally after pull or route changes).

### Laravel Boost MCP
- The Boost MCP server is available to Claude and agents. See [CLAUDE.md](../CLAUDE.md) for the full list; key tools:
  - `search-docs` — version-aware docs for installed packages (use before code changes).
  - `database-schema` / `database-query` — inspect schema / run read-only queries.
  - `browser-logs` — read recent browser console errors.
  - `get-absolute-url` — resolve the project's dev URL (scheme + port).
  - `application-info`, `last-error`, `read-log-entries`, `database-connections`.

---

## Common Scripts Reference

| Command | What it does |
|---------|-------------|
| `composer dev` | Starts Laravel server + queue worker + Vite dev server concurrently |
| `composer test` | Clears config, runs Pint lint check, then runs Pest tests |
| `composer lint` | Auto-fixes PHP style with Pint |
| `npm run dev` | Starts Vite dev server (HMR) |
| `npm run build` | Production frontend build |
| `npm run build:ssr` | Production build with SSR bundle |
| `npm run lint` | Auto-fixes ESLint issues |
| `npm run format` | Formats frontend files with Prettier |
| `npm run types` | Type-checks TypeScript without emitting |
