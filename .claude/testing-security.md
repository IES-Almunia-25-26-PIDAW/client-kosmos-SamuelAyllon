# Pilar 3 · El Escudo — Testing y Seguridad

Activar en toda tarea que toque lógica de negocio, autenticación, autorización, endpoints o datos sensibles.

## Estrategia de testing (Pest 3)

### Regla de oro

> Sin test, no hay merge. Cada cambio de comportamiento lleva al menos un test nuevo o actualizado.

### Tipos de test y responsabilidad

| Tipo | Carpeta | Cuándo |
|------|---------|--------|
| Feature | `tests/Feature/` | Endpoint, flujo Inertia, interacción con DB real |
| Unit | `tests/Unit/` | Actions, Services, Value Objects, Enums, reglas puras |
| Architecture | `tests/Arch.php` (o `tests/Feature/Arch/`) | Contratos de capas (Controllers no usan DB::, Models no usan Request::, etc.) |
| Browser (opcional) | `tests/Browser/` | Flujos críticos end-to-end con Pest Browser |

### Convenciones Pest

- Preferir `it('...')` sobre `test('...')` para describir comportamiento.
- Datasets para casos tabulados (`->with([...])`).
- Usar `RefreshDatabase` en Feature tests.
- Factories para cualquier modelo — nunca instanciar con `new Model()` en tests.
- `$this->faker` o `fake()` — seguir convención existente del archivo.

### Crear tests

```
php artisan make:test --pest Feature/<Name>Test
php artisan make:test --pest --unit Unit/<Name>Test
```

### Ejecutar

```
php artisan test --compact
php artisan test --compact --filter=NombreTest
```

### Cobertura mínima exigida

- Cada Controller action → al menos un happy path + un unauthorized/validation fallido.
- Cada Policy → test por método (allow/deny).
- Cada Action/Service → tests unitarios de sus paths principales.

## Seguridad

### Autenticación (Fortify)

- Activar skill `developing-with-fortify` al tocar auth.
- 2FA/TOTP habilitable por usuario; recovery codes regenerables.
- `session()->regenerate()` en login, `session()->invalidate()` en logout.
- Rate limiting en `login`, `register`, `forgot-password`, `two-factor-login` (usar `RateLimiter::for()` en `AppServiceProvider`).
- No exponer información de existencia de email en errores de login.

### Autorización

- Policies + `authorize()` en FormRequest o `Gate::authorize()` en controller.
- Nunca confiar en ocultación UI — la ruta debe estar protegida.
- Middleware `auth`, `verified`, `signed` donde corresponda.

### Gestión de secretos y `.env`

- `.env` **nunca** se commitea (ya en `.gitignore`; verificar antes de cada PR).
- `.env.example` siempre sincronizado: cada variable nueva agrega su par.
- Claves de API en `config/services.php` leyendo de `env()` — nunca `env()` fuera de archivos de config en runtime (rompe `config:cache`).
- Rotar `APP_KEY` al comprometer entorno; documentar en ADR.

### Entradas y salidas

- Sanitizar input vía FormRequest.
- Escapar output en blade (`{{ }}`); en React/Inertia, evitar `dangerouslySetInnerHTML` salvo con sanitización explícita.
- CSRF automático en formularios Inertia — no desactivar.

### Dependencias

- `composer audit` y `npm audit` antes de cada release.
- Nueva dependencia → ADR con justificación + alternativas descartadas.

## Checklist previo a PR

- [ ] `php artisan test --compact` verde.
- [ ] `vendor/bin/pint --dirty --format agent` limpio.
- [ ] Test nuevo o actualizado asociado al cambio.
- [ ] `.env.example` actualizado si se añadió/renombró variable.
- [ ] Sin secretos en diff (`git diff --cached | grep -iE 'token|secret|key|password'` manual).
- [ ] Autorización verificada si el endpoint es nuevo.

## Reglas de la IA

- Nunca borrar tests sin aprobación explícita del usuario.
- Nunca marcar tests como `skip` para pasar CI.
- Si un test falla, diagnosticar causa raíz antes de tocar el test.
