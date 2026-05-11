---
adr: "0016"
title: Workspaces personales vs colaborativos
date: 2026-04-28
status: Aceptado
---

# ADR-0016 — Workspaces personales vs colaborativos

## Contexto

El modelo previo creaba un workspace genérico al completar el onboarding del profesional. Si más tarde ese profesional era invitado al workspace de otro, su workspace inicial quedaba huérfano (sin pacientes ni actividad). No había distinción explícita entre un espacio personal y uno compartido, lo que generaba ambigüedad en permisos, invitaciones y ciclo de vida.

## Decisión

Se introduce el campo `type ENUM('personal', 'collaborative')` en la tabla `workspaces` (default `personal`). Reglas:

1. El onboarding **siempre** crea un workspace `personal` para el profesional si éste no ha creado ninguno (`createdWorkspaces()->doesntExist()`). Este workspace es individual e intransferible.
2. Los workspaces `collaborative` se crean exclusivamente de forma explícita por el profesional vía `POST /professional/workspace/collaborative` (Single-Action Controller `Workspace\StoreAction` + `StoreWorkspaceRequest`).
3. `Workspace\Team\InviteAction` rechaza con error de validación cualquier invitación a un workspace `personal`.

## Consecuencias

**Positivas**
- Cero workspaces huérfanos al ser invitado a uno colaborativo.
- Separación clara entre espacio personal y colaboraciones — base limpia para futuras políticas de permisos por tipo.
- Invariante: un profesional siempre tiene exactamente un workspace personal propio.

**Negativas / seguimiento**
- Backfill: las filas existentes en `workspaces` quedan como `personal` por defecto. Si existen workspaces compartidos legacy, deberán migrarse manualmente con un seeder/comando.
- `PatientProfile`, `CaseAssignment` y `CollaborationAgreement` no se han ajustado en este ADR — pendiente revisar si la lógica de asignación debe restringirse a workspaces colaborativos.
