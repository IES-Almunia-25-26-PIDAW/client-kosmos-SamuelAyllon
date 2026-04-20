# Protocolo de Ejecución (kosmos)

Documento de carga obligatoria antes de proponer o aplicar **cualquier** cambio. Si un paso falla, detente y reporta — nunca avances con checks rojos.

## 1. Pre-cambio: verificación de contexto

1. `php artisan about` → confirma Laravel 12.x y PHP 8.4.x activos.
2. Revisar `package.json`: React 19.x, Inertia 2.x, Chakra UI presente.
3. Si la tarea toca un dominio con skill (`developing-with-fortify`, `laravel-best-practices`, `pest-testing`, `inertia-react-development`, `wayfinder-development`, `laravel-inertia-react`), **actívalo antes de editar código**.
4. Para cualquier duda de API, usar `search-docs` (Laravel Boost MCP) antes de inventar.
5. Consultar el **Chakra UI MCP** cuando la tarea sea de UI.

## 2. Durante el cambio

- Seguir los 5 pilares (ver `CLAUDE.md → === kosmos excellence rules ===`):
  - [documentation.md](documentation.md)
  - [clean-code-db.md](clean-code-db.md)
  - [testing-security.md](testing-security.md)
  - [devops.md](devops.md)
  - [frontend-a11y.md](frontend-a11y.md)
- Reutilizar componentes/acciones existentes antes de crear nuevos.
- Ninguna nueva dependencia sin ADR aprobado en `docs/decision-log.md`.

## 3. Pre-cierre (gates obligatorios)

Ejecutar en orden. **Todos deben pasar** antes de declarar una tarea terminada o solicitar revisión:

| # | Comando | Propósito |
|---|---------|-----------|
| 1 | `vendor/bin/pint --dirty --format agent` | Estilo PHP |
| 2 | `php artisan test --compact` | Suite Pest (Feature + Unit + Arch) |
| 3 | `npm run lint` | ESLint |
| 4 | `npm run build` | Build Vite/Wayfinder OK |
| 5 | `php artisan route:list --except-vendor` | No hay rutas huérfanas |

Si el cambio toca DB: `php artisan migrate --pretend` y revisar SQL antes de aplicar.

## 4. Commits — Conventional Commits

Formato obligatorio:

```
<type>(<scope>): <subject ≤72 chars>

<body opcional: qué y por qué, no cómo>

Refs: ADR-XXXX (si aplica)
```

`type` ∈ `feat | fix | refactor | perf | test | docs | chore | ci | build | style`.

Ejemplos:
- `feat(waiting-room): add priority flag to queue entries`
- `refactor(auth): extract 2fa handler to action class`
- `ci(pipeline): add pint check to merge gate`

## 5. Prohibiciones explícitas

- Nunca `git commit --no-verify`, `--no-gpg-sign`, ni similar.
- Nunca commitear `.env`, `*.pem`, dumps de DB, ni secretos.
- Nunca desactivar tests para "arreglar" CI — corregir la causa raíz.
- Nunca introducir clases Tailwind nuevas en componentes nuevos (proyecto migra a Chakra).
- Nunca crear archivos `.md` de documentación sin petición explícita del usuario, salvo los listados en el pilar de Documentación.

## 6. Cuando algo no encaje

Si un requisito choca con estos estándares (p. ej. dependencia legacy, deadline), **no los saltes en silencio**: abre una entrada en `docs/decision-log.md` con la excepción justificada y pide confirmación al usuario.
