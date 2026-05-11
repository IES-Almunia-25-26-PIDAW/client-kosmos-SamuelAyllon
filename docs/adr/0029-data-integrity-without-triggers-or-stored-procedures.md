---
adr: "0029"
title: "Integridad de datos sin triggers ni stored procedures"
date: 2026-05-11
status: Aceptado
---

# ADR-0029 — Integridad de datos sin triggers ni stored procedures

## Contexto

Una revisión externa de la capa de datos cuestionó la ausencia de triggers y procedimientos almacenados en el esquema. El proyecto sigue la convención Laravel/Eloquent: la lógica de integridad y las invariantes de negocio viven en la aplicación, no en el motor SQL. Conviene dejar la decisión documentada para que futuras revisiones no la lean como omisión.

## Decisión

ClientKosmos **no usa triggers ni stored procedures**. La integridad se garantiza mediante:

1. **Foreign keys con `ON DELETE` explícito** (`cascadeOnDelete` / `nullOnDelete`) en todas las relaciones — declaradas en las migraciones.
2. **Uniques compuestos** para invariantes de cardinalidad (`workspace_members(workspace_id,user_id)`, `case_assignments(patient_id,professional_id,workspace_id)`, `patient_profiles(user_id,workspace_id)`, etc.).
3. **Transacciones con `lockForUpdate`** para invariantes que requieren serialización (numeración secuencial de facturas en `BillingService::generateSequentialInvoiceNumber`, detección de conflictos de horario en `CreateAppointment`).
4. **Form Requests + Zod cliente** para validación de entrada.
5. **Eloquent Observers / Events** para side effects (auditoría vía `spatie/laravel-activitylog`, notificaciones, generación de facturas tras `completed`).
6. **Policies** para autorización por modelo.
7. **Acceso a datos exclusivamente a través de Query Builder / Eloquent** — `grep` confirma 0 ocurrencias de `DB::raw`, `whereRaw`, `selectRaw` en `app/`. Los bindings parametrizados eliminan la superficie de SQL injection.

## Justificación

- **Portabilidad**: el equipo usa MySQL/MariaDB en producción y SQLite en tests; la sintaxis de triggers/PSM diverge entre motores y rompería la paridad test ↔ prod.
- **Trazabilidad**: la lógica en PHP queda cubierta por Pest, PHPStan y la review de PR. La lógica en el SGBD es opaca al pipeline.
- **Debugging**: `Pail` y `read-log-entries` del Boost MCP no observan ejecución dentro del motor SQL.
- **Migraciones reversibles**: triggers y SP introducen dependencias laterales difíciles de versionar con la convención up/down.

## Consecuencias

- Invariantes que no se pueden expresar como FK/unique dependen de que **todo** el código pase por las Actions/Services que las aplican. Saltarse la Action y escribir directo con `Model::create` puede violar reglas (ej. solapamiento de citas).
- **Mitigación**: las invariantes críticas tienen test de concurrencia (Pest). Cualquier write directo a `appointments` o `invoices` fuera de su Action correspondiente exige justificación en el PR.

## Áreas reforzadas en esta misma iteración

- Cast `encrypted` aplicado a `users.google_refresh_token` (token OAuth — antes en texto plano).
- Índices añadidos en `appointments(professional_id, starts_at, ends_at)`, `appointments(patient_id, starts_at, ends_at)` e `invoices(status, due_at)` — migración `2026_05_11_120000_add_performance_indexes_to_appointments_and_invoices.php` — para optimizar el lock de conflictos de cita y los cron jobs de recordatorio.

## Pendientes (no bloqueantes)

- Evaluar `CHECK (ends_at > starts_at)` en `appointments` y `CHECK (total >= 0)` en `invoices` cuando se consolide el motor de producción. Hoy esas invariantes están garantizadas por la Action que crea el registro.
- Cambiar `notifications.data` de `text` a `json` en una migración futura (alinea con Laravel 12 default).
