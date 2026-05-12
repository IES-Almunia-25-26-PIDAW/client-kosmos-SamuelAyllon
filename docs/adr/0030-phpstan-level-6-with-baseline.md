---
adr: "0030"
title: "PHPStan/Larastan — salto a nivel 6 con baseline de deuda heredada"
date: 2026-05-11
status: Aceptado
---

# ADR-0030 — PHPStan/Larastan a nivel 6 con baseline de deuda heredada

## Contexto

El proyecto estaba en `level: 5` con un `phpstan-baseline.neon` mínimo (3 entradas). El siguiente escalón natural para Kosmos Excellence es nivel 7 (chequeo de uniones parciales). Una corrida a nivel 7 reporta **160 errores en 45 archivos**, y a nivel 6 (que añade `missingType.*`) **145 errores**.

El grueso es ruido mecánico de PHPDoc heredado de la fase de migración:

- 66 `missingType.generics` — `HasFactory`, `BelongsTo`, `HasMany`, `BelongsToMany`, `MorphTo`, `Builder` sin parámetros de tipo.
- 51 `missingType.return` — métodos de relación Eloquent sin return type explícito.
- 18 `missingType.iterableValue` — `rules()`, `via()`, `attachments()` declarando `: array` sin shape.
- 10 `missingType.parameter` — scopes sin tipar el `$query`.

Adicionalmente, a nivel 7 aparecen:

- 11 `property.notFound` en `User|Collection` (resultado de `find()` accediendo a propiedades sin `findOrFail` ni narrowing).
- 3 `argument.type` en controllers que pasan `$request->validated()` (`array<string,mixed>`) a callables con shapes estrictos.

## Decisión

1. **Subir `phpstan.neon` a `level: 6`** ahora mismo. Nivel 6 ya exige los tipos faltantes que constituyen Kosmos Excellence; nivel 7 queda como objetivo de follow-up.
2. **Regenerar `phpstan-baseline.neon`** congelando las 148 ocurrencias actuales. Esto las trata como **deuda heredada tracked**, no como reglas desactivadas: cualquier nuevo `missingType.*` introducido por código nuevo fallará el gate. El baseline se erosiona con cada PR que toque un modelo y rellene la PHPDoc.
3. **No** desactivar reglas ad-hoc (`treatPhpDocTypesAsCertain`, `checkGenericClassInNonGenericObjectType`, etc.) — el gate sigue siendo estricto sobre código nuevo.
4. **Nivel 7 diferido** a un sprint dedicado. Requiere:
   - Sustituir `Model::find()` por `findOrFail()` o narrowing explícito en ~6 controllers (`Portal\Appointment\BookAction`, `Referral\StoreAction`, `Admin\ImpersonationController`, etc.) — son fixes reales de tipos, no de PHPDoc.
   - Tipar `$request->validated()` con shapes o introducir DTOs para los 3 callsites de `argument.type`.
   - Tipar `Notifiable` en `ProfessionalApprovedNotification` para eliminar los `object::$name` / `object::$professionalProfile`.

## Justificación

- **Reviewability**: bulk-edit de PHPDoc en 30+ modelos en un solo commit oculta cambios reales bajo ruido.
- **Riesgo mínimo**: el baseline congela la situación; el gate sigue rechazando regresiones.
- **Coste oportunidad**: 2–4 h de churn mecánico desplazan otras tareas (refactor de sidebar, fixes de lint en welcome).
- **Trazabilidad**: el baseline queda como TODO list explícito; los `count:` por archivo dejan claro qué modelo todavía debe deuda.

## Consecuencias

- Cualquier PR que toque un modelo del baseline **debe** reducir su `count:` correspondiente, no aumentarlo (norma de revisión).
- Cuando el baseline llegue a vacío, `phpstan.neon` puede subirse a nivel 7 sin migración masiva, solo arreglando los ~14 errores reales que sí son bugs (`property.notFound` + `argument.type`).
- CI sigue corriendo el mismo comando (`vendor/bin/phpstan analyse`); no hay cambios en el pipeline.

## Plan de erosión sugerido

| Modelo / archivo            | Tipo de fix              | Prioridad |
|----------------------------|--------------------------|-----------|
| `app/Models/User.php`      | PHPDoc relaciones (16)   | Alta      |
| `app/Models/Appointment.php`| PHPDoc generics (10)    | Alta      |
| `app/Models/PatientProfile.php` | PHPDoc generics (10) | Alta      |
| Resto de modelos           | PHPDoc relaciones        | Media     |
| `app/Http/Requests/*.php`  | `array<string, mixed>` en `rules()` | Baja |

Cada PR de feature en uno de estos archivos absorbe el coste sin generar churn aislado.
