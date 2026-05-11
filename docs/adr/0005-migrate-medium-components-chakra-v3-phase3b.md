---
adr: "0005"
title: "Migración fase 3b: componentes medianos (delete-user, appearance-tabs, password-strength, nav-footer, empty-state) a Chakra UI v3"
date: 2026-04-21
status: Aceptado
---

# ADR-0005 — Migración fase 3b: componentes medianos (`delete-user`, `appearance-tabs`, `password-strength`, `nav-footer`, `empty-state`) a Chakra UI v3

## Contexto

ADR-0004 cerró la fase 3a (componentes ligeros) y dejó una lista explícita de seguimiento para la fase 3b. Auditoría previa confirma que los cinco componentes elegidos no requieren tokens nuevos: [`resources/js/lib/chakra-system.ts`](../../resources/js/lib/chakra-system.ts) ya expone `danger.*`, `warning.*`, `success.*`, `info.*`, `orange.*`, `brand.*`, `bg.muted`, `bg.subtle`, `fg.muted`, `fg.subtle`, `border.subtle`. `kosmo-briefing.tsx` (subdirectorio `components/kosmo/`) queda diferido a fase 3c por su complejidad y alcance (4 consumidores). `sidebar.tsx`, `app-header.tsx`, `bottom-bar.tsx` también se difieren.

## Decisión

Se migran a primitivos Chakra + tokens semánticos, preservando la API pública (export, firma de props) para no alterar consumidores:

| Archivo | Estrategia |
|---------|-----------|
| [`resources/js/components/nav-footer.tsx`](../../resources/js/components/nav-footer.tsx) | `chakra('a')` con `color: 'fg.muted'` + `_hover`; se conserva `group-data-[collapsible=icon]:p-0` (pertenece al sistema Sidebar, se retira cuando se migre en 3c). Icono Lucide con `size={20}` en lugar de `className="h-5 w-5"`. |
| [`resources/js/components/empty-state.tsx`](../../resources/js/components/empty-state.tsx) | `Flex` + `Box` + `Heading` + `Text` + `Button` Chakra. Se eliminan **todas** las variables CSS ad-hoc (`var(--color-muted)`, `--color-text-muted`, `--color-primary*`, etc.) — anti-patrón que evadía el theme. Botón con `type="button"` (ADR-0003). |
| [`resources/js/components/appearance-tabs.tsx`](../../resources/js/components/appearance-tabs.tsx) | `SimpleGrid` + `chakra('button')` con receta base + selector `[data-selected="true"]` → `borderColor: 'brand.solid'`, `bg: 'brand.subtle'`. `Circle` Chakra con color condicional `brand.solid`/`bg.subtle`. Focus ring explícito con `_focusVisible` + `brand.focusRing`. |
| [`resources/js/components/password-strength.tsx`](../../resources/js/components/password-strength.tsx) | Mapping 5 niveles → 5 paletas distintas: `danger.solid` → `orange.solid` → `warning.solid` → `info.solid` → `success.solid` (decisión confirmada con el usuario para preservar granularidad visual). `Stack`/`Flex`/`HStack` Chakra. Lista `as="ul"` con reglas. |
| [`resources/js/components/delete-user.tsx`](../../resources/js/components/delete-user.tsx) | `Card` Chakra con `borderColor="danger.muted"` y header `bg="danger.subtle"`. Warning banner → `Flex role="alert"` + tokens `danger.*`. `Circle` para el icono dentro del dialog. Botones con `type="submit"`/`type="button"` explícitos (ADR-0003). Iconos Lucide con `size` + color inline vía `var(--ck-colors-*)`. |

**Preservación de API:** cero cambios en los 11 consumidores totales (6 para `empty-state`, 1 para los demás).

## Alternativas consideradas

- **Crear tokens `level-1..5` dedicados para password-strength:** descartado — duplica semántica ya existente (`danger`, `warning`, `success`, `info`, `orange`).
- **Migrar `appearance-tabs` a `SegmentGroup` de Chakra v3:** descartado por cambio de API visual (el componente es una "card grid" con icono y descripción, no un segment group horizontal compacto).
- **Migrar `empty-state` a un primitivo propio en `resources/js/components/ui/`:** descartado — `empty-state` vive bien como composición directa de primitivos Chakra sin necesidad de wrapper adicional.
- **Incluir `kosmo-briefing` en este PR:** descartado por scope; se trata en fase 3c junto al sidebar/app-header por afinidad de áreas (briefing es parte de la shell del profesional).

## Consecuencias

**Positivas**
- 5 componentes quedan libres de `className` Tailwind, `cn()` y modificadores `dark:`.
- `empty-state.tsx` deja de depender de variables CSS globales ad-hoc; ahora respeta el theme Chakra en todas sus 6 ubicaciones (pre-session, dashboard, professional, kosmo/index, patients, appointments/invoices).
- Se introduce patrón reutilizable para fase 3c: estado `data-selected` + `_focusVisible` con `focusRing` semántico para controles tipo toggle.
- Iconos Lucide pasan de `className` a prop `size`, eliminando otra fuente de Tailwind.

**Negativas / seguimiento**
- Iconos con color se pasan vía `color="var(--ck-colors-danger-fg)"` (string CSS) porque Lucide no acepta tokens semánticos; funciona pero es verbose. Alternativa futura: envolver el icono con `<Box as={Icon} color="danger.fg">` — no se aplicó ya para evitar sobre-ingeniería.
- `nav-footer` sigue usando la clase Tailwind `group-data-[collapsible=icon]:p-0` porque depende del sistema del `sidebar.tsx` (aún shadcn/CVA); se retira cuando se migre el propio sidebar en fase 3c.
- `password-strength` usa tokens `orange.*` e `info.*` nativos del sistema Chakra; si más adelante el sistema de diseño unifica niveles, habrá que revisitar el mapping.
- `delete-user` preserva el stack `Card/CardHeader/CardContent` (ya Chakra tras fases previas); no se reescribe a `Box`/`Flex` plano para mantener consistencia con el resto de tarjetas de `settings`.
