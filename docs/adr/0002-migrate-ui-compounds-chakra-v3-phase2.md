---
adr: "0002"
title: "Migración de compuestos UI (fase 2): Dialog, AlertDialog, Select, NavigationMenu, InputOTP, StatusBadge a Chakra UI v3"
date: 2026-04-20
status: Aceptado
---

# ADR-0002 — Migración de compuestos UI (fase 2): Dialog, AlertDialog, Select, NavigationMenu, InputOTP, StatusBadge a Chakra UI v3

## Contexto

Se continúa la migración Tailwind → Chakra UI v3 iniciada con `dropdown-menu`, `sheet`, `breadcrumb`. Los compuestos UI restantes dependían de `@radix-ui/*` + CVA + clases Tailwind, lo que genera deuda visual y contradice [`.claude/frontend-a11y.md`](../../.claude/frontend-a11y.md) (sin hex hardcodeado, tokens semánticos, WCAG 2.2 AA).

## Decisión

Se aplican dos estrategias según el primitivo:

1. **Primitivo Chakra nativo** (cuando existe en v3): reescritura directa.
   - `dialog.tsx` → `Dialog` de Chakra (`Dialog.Root` / `Backdrop` / `Positioner` / `Content` / `CloseTrigger` / `Title` / `Description`).
   - `alert-dialog.tsx` → `Dialog` de Chakra con `role="alertdialog"` (Chakra v3 no expone `AlertDialog` independiente).
   - `status-badge.tsx` → `Badge` de Chakra + `colorPalette` mapeado por estado (`paid→green`, `pending→yellow`, `overdue/claimed→red`, `noConsent→purple`, `openDeal→orange`).

2. **Radix como headless + `chakra()` factory para estilado** (cuando no hay primitivo Chakra equivalente o el contrato de API shadcn rompería a consumidores):
   - `select.tsx` → se preserva la API shadcn (`<SelectItem value="x">Label</SelectItem>`), Radix queda como motor, clases Tailwind sustituidas por recetas `chakra()` con tokens semánticos.
   - `navigation-menu.tsx` → ídem, Chakra v3 no tiene `NavigationMenu`; Radix se mantiene.
   - `input-otp.tsx` → se mantiene `input-otp` (librería externa) porque la API slot-by-index del consumidor (`<InputOTPSlot index={n}/>`) no mapea al `PinInput` de Chakra; se restyla con `Box` + tokens Chakra. Migración a `PinInput` queda pospuesta hasta refactor del consumidor [`two-factor-setup-modal.tsx`](../../resources/js/components/two-factor-setup-modal.tsx).

En todos los casos se preserva **exactamente** la API pública (nombres y firmas de subcomponentes exportados) — cero cambios en consumidores.

## Alternativas consideradas

- **Adoptar API nativa Chakra Select (`createListCollection` + `items={[...]}`):** descartada para no romper consumidores existentes y por el coste del wrapper adaptador de `React.Children`.
- **Reescribir NavigationMenu con `Menu` / `HoverCard` de Chakra:** descartada por cambio mayor de API y bajo número de consumidores (2) que no justifican el refactor.
- **Migrar InputOTP a `PinInput`:** descartada en esta fase; requiere refactor del consumidor (la API slot-by-index no existe en Chakra).

## Consecuencias

**Positivas**
- Se eliminan clases Tailwind de 6 compuestos; los tokens semánticos (`bg.surface`, `fg.muted`, `border.subtle`) son la única fuente de estilo.
- `AlertDialog` ya no depende del paquete `radix-ui` agregado; pasa a usar Chakra Dialog.
- Base para fase 3 donde se podrá desinstalar `@radix-ui/react-dialog` (queda solo como dependencia de `select`/`navigation-menu`/`input-otp`).

**Negativas / seguimiento**
- Select/NavigationMenu/InputOTP siguen dependiendo de `@radix-ui/*` e `input-otp`. Desinstalación diferida.
- `navigationMenuTriggerStyle()` ahora devuelve objeto de estilos Chakra (antes devolvía string CVA). Cualquier consumidor externo al wrapper debe pasarlo a un componente `chakra()` o como `css=`, no como `className`. Consumidores actuales (2 usos) no lo invocan directamente.
- `DialogHeader`/`DialogFooter` cambian el markup semántico (pasan de `<div>` plano a `Box`/`Flex`), manteniendo estilos equivalentes.
