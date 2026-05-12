---
adr: "0007"
title: "Migración Batch C: páginas de dashboard (dashboard.tsx, dashboard/professional.tsx, dashboard/patient.tsx) a Chakra UI v3"
date: 2026-04-21
status: Aceptado
---

# ADR-0007 — Migración Batch C: páginas de dashboard (`dashboard.tsx`, `dashboard/professional.tsx`, `dashboard/patient.tsx`) a Chakra UI v3

## Contexto

Las tres páginas de dashboard eran las primeras en la cola de migración de páginas (ADR-0006 dejó explícito que las páginas quedaban para fases 3d y posteriores). Seguían usando clases Tailwind con variables CSS ad-hoc (`var(--color-primary)`, `var(--color-text)`, `var(--color-border)`, `text-kpi`, `text-display-2xl`, etc.) y el helper `className=[...].join(' ')` para condicionales. Esto bloqueaba la eliminación definitiva de Tailwind en el bundle.

## Decisión

Se migran las tres páginas a primitivos Chakra + tokens semánticos:

| Archivo | Estrategia principal |
|---------|---------------------|
| [`resources/js/pages/dashboard.tsx`](../../resources/js/pages/dashboard.tsx) | `Stack`/`Grid`/`Flex`/`Box`/`Text`/`Heading`/`Badge` Chakra. `Grid templateColumns` responsivo con breakpoints `base`/`lg`. `Badge` de `@chakra-ui/react` con `colorPalette` para píldoras de modalidad (online→gray, presencial→green). `Button asChild` con `ChakraLink` para botones de acción. `chakra(Link)` para enlaces de texto. |
| [`resources/js/pages/dashboard/professional.tsx`](../../resources/js/pages/dashboard/professional.tsx) | Misma estrategia que `dashboard.tsx`; diferencia única: texto "Ver calendario completo" vs "Ver todas las citas". |
| [`resources/js/pages/dashboard/patient.tsx`](../../resources/js/pages/dashboard/patient.tsx) | Añade grid de 3 KPI stats en fila, avatar de iniciales con `Flex`/`borderRadius="full"`, y mapa `invoiceStatusColorPalette` que sustituye el `invoiceStatusClass` Record de strings CSS por `colorPalette` de Chakra Badge. |

**Tokens empleados (todos ya existentes):** `fg`, `fg.muted`, `fg.subtle`, `brand.solid`, `brand.subtle`, `border`, `bg.surface`, `bg.subtle`, `error.solid`, `error.fg`, `warning.fg`, `success.*`, `white/70`, `white/15`.

**Patrones establecidos para siguientes batches:**
- `text-kpi` / `text-display-2xl` / `text-display-lg` / `text-body-md` → `fontSize` + `fontWeight` Chakra (`3xl/bold`, `xl/semibold`, `md`).
- Condicionales de `className=[...].join(' ')` → props Chakra directas (`borderColor`, `bg`, `boxShadow`) con expresiones ternarias.
- `divide-y` de Tailwind → `borderTopWidth` condicional por índice en cada hijo.
- Inline `className` de link con estilos de botón → `<Button asChild variant="primary|outline"><ChakraLink>`.

## Alternativas consideradas

- **Usar `<Badge>` de `@/components/ui/badge` (wrapper legacy):** descartado para los casos de modalidad/estado de factura porque requiere `colorPalette` que el wrapper no expone; se importa `Badge` directamente de `@chakra-ui/react`.
- **Mantener `text-kpi` como clase Tailwind:** descartado — contradice ADR-0006 (sin nuevas clases Tailwind en componentes migrados). Se sustituye por `fontSize="3xl" fontWeight="bold"`.

## Consecuencias

**Positivas**
- Las 3 páginas de dashboard eliminan completamente `className`, variables CSS ad-hoc y el helper `join(' ')`.
- Patrón reproducible para Batch D (pacientes), E (citas/facturas) y F (admin).
- `Badge` de `@chakra-ui/react` con `colorPalette` establece el patrón para píldoras de estado en todo el resto de páginas.

**Negativas / seguimiento**
- Los enlaces `/appointments` e `/invoices` siguen como strings hardcoded (ya existían así en el original); la migración a Wayfinder es tarea separada y transversal.
- Pendiente: batches D–G (pacientes, citas, facturas, admin, kosmo, onboarding, welcome).
