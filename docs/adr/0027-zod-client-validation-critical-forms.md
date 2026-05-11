---
adr: "0027"
title: Adopción de Zod para validación cliente en formularios críticos
date: 2026-05-09
status: Aceptado
---

# ADR-0027 — Adopción de Zod para validación cliente en formularios críticos

## Contexto

Todos los flujos de formulario validaban únicamente en servidor (Laravel Form Requests). Esto produce UX degradada: un campo con formato incorrecto (e.g. contraseñas que no coinciden, email malformado) no da feedback hasta que el servidor responde, lo que implica un round-trip HTTP innecesario. Además, existe riesgo de regresión silenciosa cuando la lógica del servidor cambia: sin contraparte cliente, el cliente no puede anticipar el error.

## Decisión

Se añade `zod` como única librería de validación cliente:
- Helper `resources/js/lib/validation.ts` (`validateOrSetErrors`) que mapea errores Zod al shape de `setError` de `useForm` de Inertia.
- Schemas en `resources/js/lib/schemas/` alineados con los Form Requests de Laravel correspondientes.
- Integración en formularios críticos: `register`, `patients/create`, `patients/edit`.
- La validación servidor sigue siendo la fuente de verdad; la validación cliente es una primera línea de defensa UX.

## Consecuencias

**Positivas**
- Feedback inmediato sin round-trip: contraseña corta, email inválido, nombre vacío → error en el momento.
- Los schemas en `lib/schemas/` documentan las reglas de negocio del frontend y facilitan la detección de desincronización con el servidor.

**Negativas / seguimiento**
- Duplicación intencional con los Form Requests de Laravel. Es responsabilidad del desarrollador mantenerlos sincronizados al cambiar reglas de validación.
- `zod` añade ~13 kB gzip al bundle principal (transitive dep ya presente antes de este ADR).
