---
adr: "0019"
title: Integración Stripe (test mode) para cobro de sesiones
date: 2026-04-30
status: Implementado
commits: "b2d85db, 65c3cd2, 55e15df"
---

# ADR-0019 — Integración Stripe (test mode) para cobro de sesiones

## Contexto

El requisito de "control de pagos por sesión" del TFG está cumplido en su capa de UI (listado de pacientes, filtros pagado/pendiente, importes visibles, marcado manual + `PaymentObserver` que sella `paid_at`), pero falta la integración real con pasarela de pago. El esquema de `invoices` ya tiene columnas `stripe_payment_id` (string nullable) y `payment_method ENUM('cash','transfer','card','bizum','stripe','other')` preparadas, sin código que las use.

Para un proyecto académico (TFG) es indispensable demostrar el flujo end-to-end sin asumir riesgo financiero ni overhead de KYC/onboarding de un proveedor real.

## Decisión

Se integra Stripe **únicamente en test mode** (`sk_test_*`, tarjetas de prueba `4242 4242 4242 4242`) para cobro de facturas en estado `sent`:

1. **SDK:** `stripe/stripe-php` añadido vía Composer.
2. **Configuración:** namespace `services.stripe` con `key`, `secret`, `webhook_secret`. Tres variables en `.env.example` con comentario `# test mode only`.
3. **Servicio de aplicación:** `App\Services\Payments\StripeGateway` que implementa `App\Contracts\PaymentGateway`. La interfaz permite: a) el binding en `AppServiceProvider` y b) sustituir por `FakeStripeGateway` en tests sin tocar red.
4. **Reutilización de lógica de pago:** la transición a `paid` siempre pasa por `BillingService::markAsPaid($invoice, 'stripe')` — punto único, ya validado por `PaymentObserver` que estampa `paid_at`.
5. **Orden de implementación:** Pasarela → Webhook → Tests → Docs. Una tarea por commit, gate completo (Pint, Pest, lint, types, build) entre tareas.

**Fuera de scope (deuda explícita):**
- Producción / live keys / KYC / onboarding de la cuenta Stripe Connect.
- Reembolsos (`refunds.create`) — la psicóloga marca devolución manualmente si ocurre.
- Suscripciones / pagos recurrentes — el modelo es factura puntual por sesión.
- SCA challenges custom — Stripe Checkout los gestiona end-to-end.

## Alternativas consideradas

- **Redsys (BBVA, Sabadell, etc.):** descartado — onboarding bancario y firma SHA-256 hostiles para un TFG; no aporta valor pedagógico.
- **PayPal:** descartado — comisiones menos competitivas y la columna `stripe_payment_id` ya estaba preparada en el modelo.
- **Stripe Payment Links sin webhook:** descartado — sin webhook no hay sincronización automática del estado, perdiendo el valor del flujo end-to-end.

## Consecuencias

**Positivas**
- Cumplimiento del requisito funcional de pasarela demostrable sin coste.
- Capa de aislamiento (`PaymentGateway` interface) deja la migración futura a otro proveedor (Redsys, Bizum API) como cambio localizado.
- Stripe Checkout reduce drásticamente la superficie de PCI-DSS al no manejar nunca PAN ni CVC en nuestro servidor.

**Negativas / seguimiento**
- Una nueva dependencia Composer y nuevas variables en `.env` que documentar en deploy.
- El enlace de pago vive en Stripe (página externa); rebrand visual queda limitado a logo/color del Checkout.
- Webhook requiere endpoint público para que Stripe lo alcance — en local, `stripe listen --forward-to`. Documentar en setup de dev.
- Sin idempotencia explícita en webhook por `event.id` — se confía en que `BillingService::markAsPaid` es idempotente. Si esto resulta insuficiente, almacenar `event.id` procesados.
