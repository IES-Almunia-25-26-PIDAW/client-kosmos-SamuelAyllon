---
adr: "0017"
title: "Módulo OfferedConsultations: modelo singular, FK service_id conservada, scope por professional_profile_id"
date: 2026-04-30
status: Aceptado
---

# ADR-0017 — Módulo OfferedConsultations: modelo singular, FK service_id conservada, scope por professional_profile_id

## Contexto

El modelo `Service` (tabla `services`) fue eliminado durante la migración a `offered_consultations`. La columna `appointments.service_id` ya existía apuntando a `services`. Renombrarla habría afectado ~25 archivos. Los servicios (consultas ofertadas) son propios del perfil profesional, no del workspace, a diferencia del modelo eliminado.

## Decisión

1. **Modelo singular `OfferedConsultation`** — reemplaza al plural eliminado; relación `professionalProfile()` vía `professional_profile_id`.
2. **Columna `appointments.service_id` sin renombrar** — solo se actualizó la FK constraint para apuntar a `offered_consultations`. Ahorra tocar 25 archivos sin perder semántica.
3. **Scope por `professional_profile_id`** — los servicios son del perfil del profesional, no del workspace. Las validaciones de booking comprueban que `service_id` pertenece al perfil del profesional seleccionado.
4. **Relación en `Appointment`** — `service()` devuelve `OfferedConsultation` usando la FK existente; se añade alias `offeredConsultation()` para código nuevo.

## Consecuencias

- Los tests de booking (`AppointmentBookingTest`, `FirstBookingLinksPatientTest`) actualizados para usar `OfferedConsultation::factory()` en lugar de `Service::create()`.
- `Workspace` ya no tiene relación `services()`; eliminada limpiamente.
- El portal de pacientes (`BookAction`, `ShowAction`) carga servicios desde `OfferedConsultation` filtrados por `professional_profile_id` e `is_active`.

**Negativas / seguimiento**
- Si en el futuro se quiere renombrar `service_id` a `offered_consultation_id`, hay que hacer una migración de columna + actualizar todos los archivos que lo referencian.
