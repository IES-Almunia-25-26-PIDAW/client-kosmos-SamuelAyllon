# Pilar 2 · Calidad Técnica — Clean Code & Base de Datos

Activar en toda tarea que escriba/modifique PHP, Eloquent, migraciones o esquema.

## SOLID aplicado al stack

- **SRP:** controladores finos — delegar a `app/Actions/`, `app/Services/` o `app/Support/` cuando la lógica supere ~20 LOC o toque más de un modelo.
- **OCP:** preferir composición sobre herencia; usar interfaces en `app/Contracts/` cuando haya dos o más implementaciones previsibles.
- **LSP:** subclases de Models/FormRequest deben respetar el contrato público (no romper scopes, casts ni reglas heredadas).
- **ISP:** interfaces pequeñas y específicas — una por responsabilidad.
- **DIP:** inyectar dependencias vía constructor (con promoción de propiedades PHP 8) y bindings en `AppServiceProvider`.

## Convenciones PHP 8.4

- Constructor property promotion siempre que sea posible.
- Tipado explícito de parámetros y retornos; usar `readonly` cuando el valor sea inmutable.
- `BackedEnum` para tipos cerrados; registrar en `casts()` method del modelo.
- Uso de `match` sobre `switch`.
- Curly braces en todo control flow, incluso one-liners.

## Estilo y análisis estático

- `vendor/bin/pint --dirty --format agent` antes de cerrar.
- Nunca `--test` para arreglar — siempre reformatear.
- Evitar `@phpstan-ignore` / `@phpcs:disable` salvo excepción documentada en ADR.

## Modelos Eloquent

- Casts en `casts()` method, no en `$casts` property.
- `$fillable` explícito; nunca `$guarded = []` en producción.
- Relaciones con tipo de retorno (`: HasMany`, `: BelongsTo`).
- Scopes reutilizables en vez de repetir `where()` en controladores.

## Queries

- Evitar N+1: `with()`, `loadMissing()`, `withCount()`. Verificar con Telescope/Pail durante desarrollo.
- Paginar siempre listas expuestas al usuario (`paginate()`, `cursorPaginate()`).
- `select()` explícito cuando se exporten datos a Inertia (evita filtrar columnas sensibles).
- Preferir `DB::transaction()` para escrituras multi-tabla.

## Migraciones Laravel 12

- Una migración = un cambio lógico (crear tabla, alterar columna, añadir FK).
- `foreignId('x_id')->constrained()->cascadeOnDelete()` o `->restrictOnDelete()` según dominio — **nunca** dejar FK sin política.
- Índices explícitos en columnas usadas en `where`, `orderBy`, `join` frecuentes.
- Al modificar una columna existente, incluir **todos** los atributos previos (attributes se redeclaran, no se heredan).
- Soft deletes (`deleted_at`) solo si el dominio requiere historial — justificar en ADR si se añade.

## Tercera Forma Normal (3FN)

1. Todos los atributos dependen de la PK completa.
2. Sin dependencias transitivas (si `A → B → C`, separar en tabla).
3. Sin columnas derivadas persistidas salvo que:
   - sean caché intencional con invalidación clara, **y**
   - estén documentadas en ADR.
4. Diccionario de datos mantenido en `.claude/skills/laravel-inertia-react/rules/database-schema-full-reference.md` (ya existe) — actualizar cuando cambie el esquema.

## Validación y autorización

- `FormRequest` para validar input — nunca validar en controlador.
- Autorización: Policies + `authorize()` dentro del FormRequest. Inertia/React no es una capa de seguridad.
- Mensajes de validación localizados (`lang/es/validation.php`, `lang/en/validation.php`).

## Reglas de la IA

- Antes de escribir una función, buscar si ya existe (Grep por firma/nombre).
- Antes de crear una tabla, consultar `mcp__laravel-boost__database-schema`.
- Antes de escribir una query compleja, validar con `mcp__laravel-boost__database-query` (solo lectura).
