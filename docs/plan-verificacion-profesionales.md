# Plan: Flujo de verificación de profesionales para el panel admin

## Contexto

Los pacientes ven el mensaje "No hay profesionales verificados" porque el endpoint portal
filtra por `verification_status = 'verified'` ([IndexAction.php:20](app/Http/Controllers/Portal/Professional/IndexAction.php)).
Los profesionales registrados tienen status `'unverified'` por defecto.
El panel admin no ofrece ningún mecanismo para cambiar ese estado.
Este plan añade lo mínimo necesario: un endpoint PATCH y una sección de verificación
en la página de detalle del usuario admin.

---

## Archivos críticos

| Rol | Archivo |
|-----|---------|
| Ruta a añadir | `routes/web.php` (bloque admin, ~línea 264) |
| Nuevo controlador | `app/Http/Controllers/Admin/Users/VerifyProfessionalAction.php` |
| Controlador show (a modificar) | `app/Http/Controllers/Admin/Users/ShowAction.php` |
| Página show (a modificar) | `resources/js/pages/admin/users/show.tsx` |
| Modelo | `app/Models/ProfessionalProfile.php` (sin cambios, reusar `isVerified()`) |
| Factory (tests) | `database/factories/ProfessionalProfileFactory.php` (estados `pending`, `verified`, `rejected` ya existen) |
| Test existente (ampliar) | `tests/Feature/AdminControllerTest.php` |

---

## Implementación paso a paso

### 1. Ruta (routes/web.php)

Añadir dentro del grupo admin, tras la ruta `users.destroy`:

```php
Route::patch('/users/{user}/verify', AdminVerifyProfessionalAction::class)->name('users.verify');
```

### 2. Controlador VerifyProfessionalAction

```
app/Http/Controllers/Admin/Users/VerifyProfessionalAction.php
```

- Inyecta `Request` y `User`.
- Valida: `status` requerido, `in:verified,rejected,pending,unverified`.
- Aborta 422 si el usuario no tiene `professionalProfile`.
- Actualiza `verification_status`; si pasa a `'verified'` → `verified_at = now()`, si sale → `verified_at = null`.
- Devuelve `back()->with('success', ...)`.

### 3. ShowAction — cargar perfil profesional

Añadir `->load('professionalProfile')` al `loadCount/loadSum` chain.
Añadir `professional_profile` al array que pasa a Inertia (o dejar que el serializer lo incluya por relación cargada).

### 4. Página show.tsx — sección de verificación

Añadir en la interfaz `UserDetail`:
```ts
professional_profile: {
    license_number: string | null;
    collegiate_number: string | null;
    specialties: string[];
    bio: string | null;
    verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
    verified_at: string | null;
} | null;
```

Añadir una nueva `<Stack>` card debajo de "Información" que muestre:
- Badge de estado (color semántico: `green` verified, `yellow` pending, `red` rejected, `gray` unverified).
- Campos: número de colegiado, número de licencia, especialidades, bio.
- Dos botones: **Verificar** (`status=verified`, variant `outline`, color `green`) y **Rechazar** (`status=rejected`, variant `outline`, color `red`) — solo visibles si el usuario tiene perfil profesional.
- Acción: `router.patch(route('admin.users.verify', user.id), { status })`.

No usar `useState` para el status — leer siempre de `user.professional_profile.verification_status` (prop de Inertia).

### 5. Tests (ampliar AdminControllerTest.php)

Casos nuevos a añadir:
- `admin can verify a professional` → PATCH verify con `status=verified` → 302, DB tiene `verification_status=verified`, `verified_at` no nulo.
- `admin can reject a professional` → PATCH verify con `status=rejected` → 302, DB tiene `verification_status=rejected`, `verified_at` nulo.
- `non-admin cannot verify a professional` → 403.
- `verify requires professional profile` → usuario sin perfil → 422.
- `show page includes professional_profile data` → GET show → Inertia prop `user.professional_profile` presente.

Usar `ProfessionalProfile::factory()->for($professional)->create()` en los tests.

---

## Verificación end-to-end

```bash
# 1. Linting y tipos
vendor/bin/pint --dirty
npm run lint && npm run types

# 2. Tests
php artisan test --filter AdminControllerTest --compact

# 3. Manual (Boost / browser)
# - Loguearse como admin → /admin/users/{id del profesional}
# - Verificar que aparece la sección con el estado actual
# - Pulsar "Verificar" → toast success → badge cambia a verde
# - Ir a /patient/professionals (como paciente) → el profesional aparece en el listado
```
