---
adr: "0028"
title: "Cambio de modelo de monetización: de SaaS multitenant a app gratuita con anuncios + premium sin anuncios"
date: 2026-05-11
status: Aceptado
---

# ADR-0028 — Cambio de modelo de monetización: de SaaS multitenant a app gratuita con anuncios + premium sin anuncios

> **Nota de numeración:** en el archivo `decision-log.md` original este ADR aparecía con el número `0026` (duplicado). Se le asigna el número `0028` (siguiente libre) para eliminar la colisión. El ADR `0026` oficial es [0026-remove-tailwind-migrate-to-chakra-v3.md](0026-remove-tailwind-migrate-to-chakra-v3.md).

## Contexto

ClientKosmos se había presentado en documentación y copy de marketing como una *aplicación web SaaS multitenant* con plan gratuito y features etiquetadas como "Premium/Solo". Ese marco implica tenancy, suscripciones, planes por usuario y licencias por asiento, conceptos que nunca llegaron a implementarse y que no encajan con el público objetivo (profesionales autónomos individuales). Se decide reposicionar el producto.

## Decisión

ClientKosmos pasa a ser una **aplicación gratuita financiada por publicidad integrada**, con un **pago opcional** del usuario para desactivar los anuncios (modo *sin anuncios*).

- No hay planes mensuales/anuales ni licencias por asiento.
- No hay tenancy: cada profesional se registra como cuenta individual.
- Todas las funcionalidades (incluidas Kosmo IA, Documentos y RGPD) son **gratuitas para todos los usuarios**.
- La única diferenciación de pago es "sin anuncios".
- **El módulo de facturación profesional ↔ paciente** (`BillingService`, Stripe Checkout, dompdf, `PaymentReminderService`) se mantiene **intacto**: es una funcionalidad de dominio (el profesional cobra a sus pacientes), no la monetización de la plataforma.

## Consecuencias

**Positivas**
- Alineación entre código y discurso (nunca hubo tenancy ni planes).
- Narrativa más simple.
- Reduce expectativas falsas en la documentación.

**Negativas / pendientes**
- Requiere integración futura de un proveedor de anuncios y un flag premium en el usuario (`is_ad_free` o similar). Esta iteración cubre solo la reescritura de documentación y copy; la implementación técnica se planificará en un ADR posterior.
- La prop `isPremium` del componente `BentoCard` en `welcome.tsx` y `PricingFeature` se eliminan al no haber paywall de features.
- El anchor `#pricing` del footer del landing se elimina hasta que exista una sección "sin anuncios" real.
