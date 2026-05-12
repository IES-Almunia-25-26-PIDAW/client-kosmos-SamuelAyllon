---
adr: "0020"
title: Generación automática de factura al finalizar la sesión
date: 2026-04-30
status: Aceptado
---

# ADR-0020 — Generación automática de factura al finalizar la sesión

## Contexto

Tras cada sesión la psicóloga debía pulsar manualmente `POST /appointments/{id}/generate-invoice` para crear el borrador de factura, y solo después `FinalizeAndNotifyAction` enviaba el email — pero solo si la factura ya existía. Auditoría previa confirmó que el aplazamiento manual de la facturación abría riesgo fiscal (numeración secuencial desligada del hecho imponible) y operacional (sesiones completadas sin factura asociada).

## Decisión

1. **Trigger automático e idempotente** vía `App\Observers\AppointmentObserver` registrado en `AppServiceProvider`. Cuando `Appointment.status` pasa a `completed`, invoca `App\Actions\Billing\GenerateInvoiceForAppointment` (action de dominio extraída del controlador HTTP).
2. **Idempotencia fuerte:** la action devuelve la factura existente si ya hay una ligada al `appointment_id` vía `InvoiceItem`. No lanza error. El controlador HTTP manual sigue devolviendo `withErrors` para feedback de UX, pero internamente reutiliza la misma action.
3. **`FinalizeAndNotifyAction` deja de depender de pre-existencia:** invoca `GenerateInvoiceForAppointment` antes del envío. Si no se puede crear (servicio sin precio), continúa con el resto de jobs y omite el invoice email.
4. **UI de edición real:** nuevo `Invoice\EditAction` (GET `/invoices/{invoice}/edit`) renderiza `professional/invoices/edit.tsx` con `useForm` de Inertia. Solo facturas en `draft` son editables — bloqueado por el controlador y por `UpdateAction`. Reutiliza `StorePaymentRequest`.
5. **Ruta plana para update:** se elimina el sub-resource `/patients/{patient}/invoices/{invoice}` (no consumido) y se sustituye por `/invoices/{invoice}` (PATCH/PUT) — coherente con el resto de endpoints de `Invoice`.
6. **Trigger inmediato (no diferido):** alineamos el momento de emisión con la finalización efectiva de la cita para Verifactu/AEAT.

## Alternativas consideradas

- **Trigger diferido (job a `ends_at + N min`):** descartado por simplicidad y por riesgo de huecos en la numeración si el job falla. La idempotencia del observer + posibilidad de borrar borradores cubre el caso de reapertura.
- **Hook directo en `EndCallAction`:** descartado por acoplamiento — `UpdateStatusAction` también puede mover una cita a `completed` y debería disparar el mismo flujo. El observer cubre ambos puntos sin duplicar código.
- **Cron diario que busca sesiones completadas sin factura:** descartado como mecanismo principal (latencia inaceptable), pero sigue siendo viable como red de seguridad futura.

## Consecuencias

**Positivas**
- Se elimina el clic manual: la factura nace automáticamente al cerrar la cita.
- Numeración secuencial alineada con el hecho imponible.
- Punto único de cierre (`finalize-and-notify`) que ya no falla silenciosamente si la factura no se generó antes.
- Edición real desde la UI sin acceso directo al backend.

**Negativas / seguimiento**
- Si una cita se marca `completed` por error, el observer creará un borrador huérfano. Mitigación: `Invoice\DestroyAction` permite borrarlo; pendiente añadir vista "Sesiones pendientes / borradores recientes".
- La edición de líneas (descripción, cantidades) sigue fuera de la UI: solo el importe agregado y los metadatos son editables.
- Cambio de URL del update (`/invoices/{invoice}` en vez de patient sub-resource): no había consumidores, pero documentar en CHANGELOG si terceros integran.
