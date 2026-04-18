# Laravel + Inertia.js + React — Guía para agentes (ClientKosmos)

> Adaptado del paquete original de **Asyraf Hussin** (v1.0.0, 2026-01-17).
> Versión local: **1.0.0-clientkosmos** · Última revisión: **2026-04-18**.
> Este archivo describe cómo aplicar los patrones de la skill **en este proyecto concreto**,
> no en abstracto. Cuando haya conflicto entre la guía genérica de `SKILL.md`/`rules/` y este
> archivo, **prevalece este archivo**.

## Overview

ClientKosmos es un monolito **Laravel 12 + Inertia v2 + React 19** para profesionales sanitarios
independientes (psicólogos y terapeutas). Layout persistente con sidebar, rutas tipadas vía
**Wayfinder**, autenticación headless con **Fortify** (incluye 2FA/TOTP), permisos con
**spatie/laravel-permission**, y un asistente IA (`kosmo`) integrado. La UI está en español.

## Cuándo aplicar esta skill

Actívala cuando cualquiera de estas cosas sea cierto:

- Crear o modificar una página en [resources/js/pages/](resources/js/pages/) (ej. `appointments/`, `patients/`, `invoices/`, `kosmo/`, `admin/`, `auth/`, `settings/`).
- Usar el hook `useForm` de `@inertiajs/react`.
- Leer props compartidas (`auth.user`, `flash`, `isImpersonating`, `sidebarOpen`) vía `usePage()`.
- Asignar un layout persistente (`Page.layout = ...`).
- Importar desde `@/actions/App/Http/Controllers/...` o `@/routes/...`.
- Añadir/editar un **action controller** (`App\Http\Controllers\<Domain>\<Action>Action`) que devuelva `Inertia::render(...)`.
- Tocar [app/Http/Middleware/HandleInertiaRequests.php](app/Http/Middleware/HandleInertiaRequests.php).

## Skills hermanas — actívalas ANTES de tocar código

Estas skills están declaradas en [CLAUDE.md](CLAUDE.md) y cubren partes específicas del stack.
**Delega en ellas en lugar de reinventar patrones**:

| Tarea | Skill |
|-------|-------|
| Patrones cliente Inertia v2 (deferred props, polling, prefetching, infinite scroll) | `inertia-react-development` |
| Generar/consumir rutas tipadas desde controladores Laravel | `wayfinder-development` |
| Login, registro, 2FA, verificación email, password reset | `developing-with-fortify` |
| Escribir/editar tests (obligatorio tras cualquier cambio) | `pest-testing` |
| Utilidades Tailwind v4, tokens, dark mode, layouts responsive | `tailwindcss-development` |
| Controladores, modelos, queries Eloquent, jobs, policies | `laravel-best-practices` |

Además, **Laravel Boost MCP** está disponible. Úsalo antes de editar:

- `mcp__laravel-boost__search-docs` — documentación version-specific. Usa queries temáticas (no incluyas nombres de paquetes).
- `mcp__laravel-boost__database-schema` — inspeccionar tablas antes de migraciones.
- `mcp__laravel-boost__database-query` — SELECT-only.
- `mcp__laravel-boost__browser-logs` / `last-error` / `read-log-entries` — diagnóstico.
- `mcp__laravel-boost__get-absolute-url` — resolver URL completa antes de compartir con el usuario.

## Tech stack real (pinned)

| Capa | Paquete | Versión |
|------|---------|---------|
| Runtime | PHP | 8.4 |
| Framework | `laravel/framework` | 12 |
| Inertia server | `inertiajs/inertia-laravel` | v2 |
| Auth headless | `laravel/fortify` | v1 |
| Rutas tipadas | `laravel/wayfinder` + `@laravel/vite-plugin-wayfinder` | v0 |
| Permisos | `spatie/laravel-permission` | v7 |
| Tests | `pestphp/pest` + plugin Laravel | v3 |
| Code style | `laravel/pint` | v1.24 |
| Frontend | `react` / `@inertiajs/react` | 19 / 2.3 |
| Tipado | `typescript` | 5.7 |
| Build | `vite` | 7 |
| UI | `tailwindcss` v4, Radix UI, `lucide-react` | — |
| Lint/Format | `eslint` v9 (flat config), `prettier` v3 + plugin Tailwind | — |

## Convenciones de archivos (OBLIGATORIAS)

- **Páginas**: `resources/js/pages/<domain>/<action>.tsx` en **minúsculas y kebab-case**.
  Ejemplos reales: [appointments/index.tsx](resources/js/pages/appointments/index.tsx), [patients/show.tsx](resources/js/pages/patients/show.tsx), [auth/register.tsx](resources/js/pages/auth/register.tsx).
  **Nunca** uses `Pages/Appointments/Index.tsx` (PascalCase como sugiere la skill upstream).
- **Layouts**: [resources/js/layouts/app-layout.tsx](resources/js/layouts/app-layout.tsx), [auth-layout.tsx](resources/js/layouts/auth-layout.tsx), anidados en `layouts/app/` (sidebar + header).
- **Componentes**: `resources/js/components/{ui,admin,kosmo,patient}/`. Prefiere reutilizar antes de crear. UI base bajo `components/ui/` (botones, inputs, spinner, empty-state, status-badge) sobre Radix.
- **Tipos**: `resources/js/types/` con barrel re-exports (`auth`, `navigation`, `ui`, `models`, `shared`, `pages`, `admin`). Modelos concretos en [`types/models/<entity>.ts`](resources/js/types/models/).
- **Hooks**: [resources/js/hooks/](resources/js/hooks/) con prefijo `use-*` y kebab-case (`use-appearance.tsx`, `use-mobile-navigation.ts`, `use-two-factor-auth.ts`).
- **Wayfinder**:
  - `resources/js/actions/App/Http/Controllers/<Domain>/<Action>.ts` (1 fichero por action controller).
  - `resources/js/routes/<domain>/...` (named routes).
  - Helper propio en [resources/js/wayfinder/index.ts](resources/js/wayfinder/index.ts) con `queryParams()`.

## Patrones reales del proyecto

### 1. Página tipo "index" con filtros + paginación

Patrón real en [resources/js/pages/appointments/index.tsx](resources/js/pages/appointments/index.tsx):

```tsx
import { Head, Link, router } from '@inertiajs/react';
import type { ReactNode } from 'react';
import AppLayout from '@/layouts/app-layout';
import IndexAction from '@/actions/App/Http/Controllers/Appointment/IndexAction';
import ShowAction from '@/actions/App/Http/Controllers/Appointment/ShowAction';

interface AppointmentItem {
    id: number;
    starts_at: string;
    status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    modality: string;
    patient: { id: number; name: string } | null;
    service: { id: number; name: string } | null;
}

interface Paginated {
    data: AppointmentItem[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    appointments: Paginated;
    filters: { status?: string; date?: string };
}

export default function AppointmentsIndex({ appointments, filters }: Props) {
    const setFilter = (status: string) => {
        router.get(
            IndexAction.url(),
            { status: status || undefined, date: filters.date },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Citas — ClientKosmos" />
            <div className="flex flex-col gap-6 p-6 lg:p-8">
                {/* ... */}
                <Link href={ShowAction.url({ appointment: item.id })}>Ver</Link>
            </div>
        </>
    );
}

AppointmentsIndex.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
```

Puntos clave:

- `Head` con título en español y sufijo `" — ClientKosmos"`.
- Filtros usando `router.get(Action.url(), params, { preserveState: true, replace: true })`.
- Shape de paginación de Laravel (no reinventar): `{ data, current_page, last_page, total, links }`.
- Tokens de Tailwind v4 vía CSS vars: `var(--color-text)`, `var(--color-success-subtle)`, etc.

### 2. Formulario con `useForm`

Patrón real en [resources/js/pages/auth/register.tsx](resources/js/pages/auth/register.tsx) — se
puede importar ruta desde `@/actions/...` **o** named route desde `@/routes/...`:

```tsx
import { Head, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';
import InputError from '@/components/input-error';
import { store } from '@/routes/register';

const { data, setData, post, processing, errors } = useForm({
    type: 'professional' as 'professional' | 'patient',
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    // ...role-specific fields
});

function submit(e: FormEvent) {
    e.preventDefault();
    post(store.url(), {
        onSuccess: () => setData((prev) => ({ ...prev, password: '', password_confirmation: '' })),
    });
}

// En el JSX:
<InputError message={errors.email} />
```

Puntos clave:

- Errores con `<InputError message={errors.x} />`, no inline.
- Para reset parcial, usar callback de `setData`, no `reset()` (deja intactos los campos no sensibles).
- El componente `<PasswordStrength />` ya existe en `components/` — reutilízalo en registros.

### 3. Layout persistente

El proyecto usa el patrón persistente estándar — `app-layout.tsx` sólo delega en el template:

```tsx
// resources/js/layouts/app-layout.tsx
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { AppLayoutProps } from '@/types';

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
    </AppLayoutTemplate>
);
```

Asignación en cada página:

```tsx
Page.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
```

Para layouts auth (`auth/*.tsx`) usar `AuthLayout` en su lugar.

### 4. Action controller (back)

Un fichero = un endpoint. Patrón real en
[app/Http/Controllers/Appointment/IndexAction.php](app/Http/Controllers/Appointment/IndexAction.php):

```php
<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $appointments = Appointment::where('professional_id', $request->user()->id)
            ->with(['patient', 'service'])
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->when($request->date,   fn ($q, $d) => $q->whereDate('starts_at', $d))
            ->orderBy('starts_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('appointments/index', [
            'appointments' => $appointments,
            'filters'      => $request->only(['status', 'date']),
        ]);
    }
}
```

Reglas:

- Extiende `App\Http\Controllers\Controller`, usa `__invoke`.
- La cadena del `Inertia::render` es **la ruta del fichero React en minúsculas**: `appointments/index`, no `Appointments/Index`.
- Eager-load siempre explícito (`with([...])`) — los N+1 son bloqueantes en revisión.
- `->withQueryString()` tras `paginate()` para preservar filtros en los links.
- Autorización: `$this->authorize('view', $patient)` cuando toque datos sensibles. Ver [app/Http/Controllers/Patient/ShowAction.php](app/Http/Controllers/Patient/ShowAction.php).

### 5. Shared data real

Contenido literal de [app/Http/Middleware/HandleInertiaRequests.php](app/Http/Middleware/HandleInertiaRequests.php):

```php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'name' => config('app.name'),
        'auth' => ['user' => $request->user()],
        'isImpersonating' => $request->session()->has('impersonating_id'),
        'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        'flash' => [
            'success' => session('success'),
            'error' => session('error'),
        ],
    ];
}
```

El tipo `User` ya está definido en [resources/js/types/auth.ts](resources/js/types/auth.ts) con
el rol `'professional' | 'admin'` y todos los campos fiscales/RGPD. **No lo dupliques** en cada
página; importa desde `@/types`.

## Reglas obligatorias (prevalecen sobre la skill upstream)

1. **Wayfinder siempre, nunca strings de ruta**. Importa desde `@/actions/App/Http/Controllers/...` (action controllers) o `@/routes/...` (named routes). `route('x')` del helper Ziggy **no existe** en este proyecto.
2. **Action controllers**, no resource controllers. Una clase por endpoint: `App\Http\Controllers\<Domain>\<Action>Action` con `__invoke`.
3. **Nombres de página en minúsculas** en `Inertia::render(...)`: `appointments/index`, `patients/show`, `auth/register`.
4. **Tipos de modelo**: extiende o amplía los de `@/types/models/*` (Patient, etc.) — no redefinas tipos inline si ya existen.
5. **Tokens Tailwind v4**: usa variables `var(--color-*)` (success, error, warning, indigo, surface, text, text-muted…), no paletas Tailwind crudas (`bg-blue-500`).
6. **i18n**: strings UI en español. Fechas con `new Intl.DateTimeFormat('es-ES', { ... })`.
7. **Tests Pest obligatorios tras cualquier cambio** (regla de CLAUDE.md). Crea o actualiza test y corre `php artisan test --compact --filter=<nombre>`. No borres tests sin aprobación.
8. **Pint tras tocar PHP**: `vendor/bin/pint --dirty --format agent` antes de cerrar. No uses `--test`.
9. **`search-docs` antes de tocar** cualquier feature de Inertia/Fortify/Laravel/Pest. No asumas por memoria.
10. **`database-schema` antes de migraciones**. `database-query` solo read-only.
11. **Nada de documentación nueva** (`README`, `.md`) salvo que el usuario lo pida explícitamente.
12. **Nada de `php artisan tinker` para probar** cuando hay tests que pueden cubrirlo (regla CLAUDE.md).

## Quick Reference

| Tarea | Skill / Referencia |
|-------|--------------------|
| Nueva página listado (citas, pacientes, facturas) | `inertia-react-development` + ejemplo §1 |
| Formulario nuevo | §2 + `useForm` |
| Autenticación (login/register/2FA/verify) | `developing-with-fortify` |
| Ruta tipada nueva | `wayfinder-development` + regenerar con Vite dev |
| Flash messages | `shared.flash.{success,error}` desde `usePage().props` |
| Usuario actual | `usePage<SharedData>().props.auth.user` (tipo en `@/types/auth`) |
| Layout | §3 — `Page.layout = (page) => <AppLayout>{page}</AppLayout>` |
| Cargar datos pesados perezosamente | `Inertia::lazy(...)` en backend (`inertia-react-development`) |
| Polling / deferred props / prefetch | `inertia-react-development` |
| Firma de consentimiento RGPD | ver `app/Http/Controllers/ConsentForm/*` y `pages/patients/show.tsx` |
| Briefings IA (Kosmo) | ver `components/kosmo/`, `types/models/patient.ts` (KosmoBriefing) |
| Test de página | `pest-testing` — feature test con `get(Action::url())` + `assertInertia(...)` |

## Integration patterns (end-to-end del proyecto)

### Controller → Page

```php
// app/Http/Controllers/Invoice/IndexAction.php
return Inertia::render('invoices/index', [
    'invoices' => Invoice::with('patient')->paginate(20)->withQueryString(),
    'filters'  => $request->only(['status']),
]);
```

```tsx
// resources/js/pages/invoices/index.tsx
import IndexAction from '@/actions/App/Http/Controllers/Invoice/IndexAction';
// ...
router.get(IndexAction.url(), { status: 'paid' }, { preserveState: true });
```

### Shared data → consumer tipado

```tsx
import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';  // barrel re-exporta auth/flash

const { auth, flash, isImpersonating, sidebarOpen } = usePage<SharedData>().props;
```

### Form → Form Request → Flash

```php
// app/Http/Controllers/Patient/StoreAction.php
public function __invoke(StorePatientRequest $request)
{
    Patient::create($request->validated());
    return redirect()
        ->route('patients.index')
        ->with('success', 'Paciente creado correctamente.');
}
```

```tsx
import { store } from '@/routes/patients';
const { post, errors, processing } = useForm({ /* ... */ });
post(store.url(), { onSuccess: () => { /* flash.success mostrará el mensaje */ } });
```

## Verificación tras tus cambios

1. Si tocaste **PHP**: `vendor/bin/pint --dirty --format agent`.
2. Si tocaste **JS/TS**: `npm run lint` y `npm run types` (si existe en scripts).
3. **Siempre**: `php artisan test --compact --filter=<lo-que-toque>`.
4. Verifica en el navegador con `mcp__laravel-boost__browser-logs` tras la interacción.
5. Si el usuario no ve cambios en UI, pídele correr `npm run dev` (o `npm run build` / `composer run dev`).

---

**Créditos**: estructura original basada en la skill `laravel-inertia-react` de Asyraf Hussin
(MIT). Adaptación para ClientKosmos mantenida junto al proyecto.
