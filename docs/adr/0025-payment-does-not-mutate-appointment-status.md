---
adr: "0025"
title: "Pago no muta Appointment.status; is_paid derivado de InvoiceItem"
date: 2026-05-08
status: Aceptado
---

# ADR-0025 — Pago no muta Appointment.status; is_paid derivado de InvoiceItem

## Contexto

Al habilitar el pago de facturas desde el portal del paciente surgió la pregunta de si el pago de una `Invoice` debía cambiar el `status` de la `Appointment` vinculada (p.ej. añadir un estado `paid` o transicionar de `completed` a otro valor). La relación entre ambos modelos no es directa: `Invoice` ↔ `Appointment` se vincula a través de `InvoiceItem.appointment_id`, y una misma sesión puede generar más de un ítem de factura.

## Decisión

El campo `Appointment.status` **no cambia** cuando se paga una factura. Los valores del enum de estado (`pending`, `confirmed`, `in_progress`, `completed`, `cancelled`) describen el ciclo de vida clínico de la cita, no su estado financiero. Mezclar ambas dimensiones en un solo campo rompería las transiciones de estado existentes (p.ej. `AppointmentObserver` que genera facturas al pasar a `completed`) y añadiría un estado financiero a un modelo clínico.

En su lugar, se expone el estado de pago como un atributo derivado `isPaid()` en `Appointment`, calculado a partir de la colección `invoiceItems.invoice.status`. Se serializa como `isPaid` en `PortalAppointmentShowAction` para que la UI del paciente lo consuma sin queries adicionales (eager-load `invoiceItems.invoice:id,status`).

## Consecuencias

**Positivas**
- Separación de responsabilidades; el ciclo de vida clínico y el financiero son independientes.
- Sin migraciones.
- Sin riesgo de romper lógica existente.

**Negativas**
- `isPaid()` requiere que `invoiceItems.invoice` esté eager-loaded; si se llama sin él, retornará `false` (colección vacía). Los controladores que necesiten el dato deben cargar explícitamente la relación.
- Cualquier vista que necesite saber si una cita está pagada debe pasar por `Appointment::isPaid()` — no consultar `Invoice` directamente desde el frontend.
