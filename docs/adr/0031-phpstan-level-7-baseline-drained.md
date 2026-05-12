---
adr: "0031"
title: "PHPStan/Larastan — drenado total del baseline y salto a nivel 7"
date: 2026-05-12
status: Aceptado
---

# ADR-0031 — PHPStan/Larastan a nivel 7 sin baseline

## Contexto

ADR-0030 instaló `level: 6` con un `phpstan-baseline.neon` de 145 entradas como deuda heredada de la fase de migración, junto a un plan de erosión por tandas (modelos, Form Requests, Notifications, Services, Controllers).

Tras drenar las 145 entradas en commits incrementales (un archivo / Form Request / Service por commit, gate completa entre cada uno), el baseline llega a 0 con `level: 6` limpio. Subir a `level: 7` añade chequeo de uniones parciales — destapando 16 errores reales (no ruido mecánico) en 7 archivos:

- 10 `property.notFound` sobre `Model|Collection<int, Model>` en callsites de `Model::find()` / `Model::findOrFail()` que pasaban valores `mixed` (el array `validated()` quedó tipado como `array<string, mixed>` tras drenar los `missingType.iterableValue` de las `rules()`).
- 3 `argument.type` en controladores que pasaban `array<string, mixed>` a Actions con shape estricta vía `array{...}`.
- 2 `property.notFound` sobre `object` en `ProfessionalApprovedNotification::toMail/toDatabase` (el parámetro `$notifiable` está declarado como `object` en la firma de Laravel).
- 1 `property.notFound` sobre `(object|string)` en una validación cerrada que accedía a `$agreement->start_date` sin estrechar la unión de `$this->route(...)`.

## Decisión

1. `phpstan.neon` pasa a `level: 7`.
2. `phpstan-baseline.neon` se mantiene presente pero vacío (`ignoreErrors: []`) para no romper el `include` y dejar señal de que el objetivo es mantenerlo así.
3. Los 16 errores de nivel 7 se arreglan con narrowing real, **sin** introducir `@phpstan-ignore`, `assert()` ni `@var` inline, y **sin** añadir dependencias nuevas (la sugerencia `nunomaduro/larastan-strict-rules` queda como deuda — ver §5).

## Cambios aplicados (sin cambios de comportamiento observables)

- `Portal\Appointment\BookAction` — `ProfessionalProfile::with(...)->find($id)` → `ProfessionalProfile::query()->with(...)->whereKey($id)->first()`. Mantiene la rama de redirección con `withErrors` cuando el profesional no existe; PHPStan ahora infiere `ProfessionalProfile|null`.
- `Referral\StoreAction` — `PatientProfile::findOrFail($validated['patient_id'])` → `PatientProfile::findOrFail((int) $validated['patient_id'])`. El comportamiento (404 si falta) no cambia; la coerción explícita evita que `mixed` active la sobrecarga de `findOrFail(array)`.
- `Admin\ImpersonationController` — mismo patrón con `User::findOrFail((int) $adminId)`.
- `Http\Requests\Portal\StoreAppointmentRequest` — añade método `appointmentData(): array{...shape estricta...}` que coacciona explícitamente cada campo. `StoreAction` consume `appointmentData()` en lugar de `validated()`.
- `Http\Requests\OfferedConsultationsRequest::dataForPersistence()` — reconstruye el array con coerciones explícitas para satisfacer el shape `array{name:string, duration_minutes:int, price?:?numeric, ...}` que exige `CreateOfferedConsultation`.
- `Http\Requests\UpdateCollaborationAgreementRequest` — añade `instanceof CollaborationAgreement` antes de leer `$agreement->start_date` en el closure de validación.
- `Notifications\ProfessionalApprovedNotification` — estrecha `$notifiable` con `instanceof User` antes de leer `$notifiable->name` y `$notifiable->professionalProfile`.
- `Models\ProfessionalProfile` — añade `@property Carbon|null $verified_at` para que el cast `verified_at => 'datetime'` quede expuesto al análisis estático.

Ninguno de estos cambios altera respuestas HTTP, payloads JSON o efectos secundarios observables. No hay diff de comportamiento que requiera nota en `RELEASE.md` ni en el changelog del usuario final.

## Consecuencias

- **Positivas:** PHPStan nivel 7 limpio sin baseline elimina la "ventana de Overton" para nueva deuda silenciosa; los próximos PRs que introduzcan ambigüedad `Model|Collection`, `array<string, mixed>` cruzando una frontera tipada, o accesos a propiedades de `object` fallarán el CI.
- **Neutras:** los `(int)` y `(string)` añadidos son explícitos pero no defensivos — solo refuerzan el contrato que el FormRequest ya garantiza vía sus `rules()`.
- **Negativas:** mantener nivel 7 limpio implica disciplina en cada nuevo controlador / Action / Notification. Cualquier `Model::find($mixed)` o `$notifiable->prop` sin narrowing volverá a romper el CI; el patrón ya está documentado en `.agents/skills/laravel-patterns/` (pendiente — ver §5).

## §5 — Deuda asociada

- `nunomaduro/larastan-strict-rules` queda pendiente como ADR-0032 propuesto. Su valor incremental tras nivel 7 (chequeo de comparaciones débiles, condiciones siempre-verdaderas) merece evaluación separada, fuera del alcance de este ADR.
- Actualizar `.agents/skills/laravel-patterns/SKILL.md` con la receta de "shape estricto Request → Action" para evitar que el patrón se reinvente mal en futuros endpoints.

## Verificación

```
vendor/bin/phpstan analyse --no-progress --memory-limit=512M
# [OK] No errors

php -d memory_limit=2G vendor/bin/pest --compact
# 389 passed (1535 assertions)
```
