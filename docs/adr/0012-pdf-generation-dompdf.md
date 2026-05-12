---
adr: "0012"
title: Generación de PDF con barryvdh/laravel-dompdf
date: 2026-04-24
status: Aceptado
---

# ADR-0012 — Generación de PDF con barryvdh/laravel-dompdf

## Contexto

Las facturas deben generarse en PDF cumpliendo LIVA art. 20.1.3º (IVA exento para psicólogos) y ser almacenadas en el disco `private`. Se necesita una solución PHP nativa sin dependencias de binarios externos.

## Decisión

- Se instala `barryvdh/laravel-dompdf` (wrapper Laravel de Dompdf).
- `BillingService::generatePdf(Invoice)` renderiza la vista Blade `invoices.pdf` y guarda el resultado en `storage/app/private/invoices/{id}.pdf`.
- La numeración de factura pasa de `FAC-{YEAR}-{RANDOM}` a `FAC-{YEAR}-{NNNNN}` secuencial. El número se genera dentro de una transacción con `DB::transaction()` + `lockForUpdate()` para evitar duplicados bajo concurrencia.
- Font: `dejavu-sans` para soporte correcto de caracteres con tilde.

## Consecuencias

**Positivas**
- Solución madura, activamente mantenida, sin proceso externo (wkhtmltopdf, Chromium headless).

**Negativas**
- CSS soporte limitado (sin Flexbox/Grid completo); el template debe usar tablas HTML. Aceptable para facturas.

**Deuda**
- Si el profesional necesita facturas con diseño avanzado, migrar a Browsershot (Puppeteer) post-MVP.
