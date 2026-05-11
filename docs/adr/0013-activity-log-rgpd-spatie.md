---
adr: "0013"
title: spatie/laravel-activitylog para audit log RGPD
date: 2026-04-24
status: Aceptado
---

# ADR-0013 — spatie/laravel-activitylog para audit log RGPD

## Contexto

RGPD Art. 30 (registro de actividades de tratamiento) y las correcciones de auditoría interna exigen registrar quién accedió a qué entidad sensible y cuándo.

## Decisión

- Se instala `spatie/laravel-activitylog v5`.
- Modelos con log: `PatientProfile`, `Document`, `ConsentForm`, `SessionRecording`, `Invoice`.
- Eventos mínimos: `created`, `updated`, `deleted`. El evento `viewed` se añade como log manual desde los controladores `Show`.
- Los logs se guardan en la tabla `activity_log` (ya creada en Sprint 1).

## Consecuencias

**Positivas**
- Trazabilidad completa de accesos a datos de salud sin escribir código de logging manual en cada modelo.

**Negativas**
- Aumenta el volumen de la tabla `activity_log` con el tiempo. Requiere job de purga periódica (post-MVP, retención 5 años).
