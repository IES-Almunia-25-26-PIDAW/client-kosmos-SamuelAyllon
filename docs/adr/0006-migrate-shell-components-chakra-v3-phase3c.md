---
adr: "0006"
title: "Migración fase 3c: bottom-bar, app-header, sidebar (+ cierre de kosmo-briefing y nav-footer)"
date: 2026-04-21
status: Aceptado
---

# ADR-0006 — Migración fase 3c: `bottom-bar`, `app-header`, `sidebar` (+ cierre de `kosmo-briefing` y `nav-footer`)

## Contexto

ADR-0005 cerró la fase 3b y dejó cuatro componentes pendientes para la fase 3c: `kosmo-briefing`, `bottom-bar`, `app-header` y `sidebar`. La verificación previa a la implementación reveló que **`kosmo-briefing` ya estaba completamente migrado** (trabajo de una sesión anterior no documentado). Los cuatro archivos restantes tenían dependencias directas de Tailwind, `class-variance-authority` (CVA) y primitivos shadcn.

La particularidad de esta fase es la complejidad del `sidebar.tsx` (723 líneas, 20+ subcomponentes exportados, 8 consumidores): dependía del sistema `group/peer` de Tailwind y de CVA. La clave que habilitó la migración es que `chakra-system.ts` ya expone el namespace `sidebar.*` mapeado a los mismos CSS variables que usaba Tailwind (`bg-sidebar` → `var(--sidebar)`, etc.).

## Decisión

| Archivo | Estrategia |
|---------|-----------|
| [`resources/js/components/kosmo/kosmo-briefing.tsx`](../../resources/js/components/kosmo/kosmo-briefing.tsx) | Verificado — ya migrado. Cero trabajo adicional. |
| [`resources/js/components/bottom-bar.tsx`](../../resources/js/components/bottom-bar.tsx) | Reescritura directa con `Box`, `Flex`, `chakra.button`. Sin consumidores → cero riesgo. `BottomBarProps` actualizado a `BoxProps`. |
| [`resources/js/components/app-header.tsx`](../../resources/js/components/app-header.tsx) | `chakra(Link)` (Inertia) como `ChakraLink`. Eliminación de `cn()`, `activeItemStyles` con `dark:`. Sheet/Avatar/Tooltip ya eran wrappers Chakra. `navigationMenuTriggerStyle()` reemplazado por style props inline directamente sobre `ChakraLink`. |
| [`resources/js/components/ui/sidebar.tsx`](../../resources/js/components/ui/sidebar.tsx) | **Migración sistemática**: CVA eliminado; `sidebarMenuButtonVariants` reemplazado por style props + `css=`. Sistema `group/peer` de Tailwind sustituido por selectores CSS de atributos en `css=` (`[data-collapsible=icon] &`, `[data-sidebar=menu-button] ~ &`, `:has([data-sidebar=menu-action])`, etc.). Tokens `sidebar.*` via Chakra. Los 20+ exports preservados sin cambio. |
| [`resources/js/components/nav-footer.tsx`](../../resources/js/components/nav-footer.tsx) | Residual de ADR-0005 resuelto: `group-data-[collapsible=icon]:p-0` → `css={{ '[data-collapsible=icon] &': { padding: '0' } }}`. |

**Patrones técnicos establecidos:**

1. **Selectores de ancestro** `[data-attr=val] &` en `css=` reemplazan `group-data-[*]` de Tailwind.
2. **Selectores de hermano** `[data-sidebar=menu-button] ~ &` reemplazan `peer-data-[*]` de Tailwind.
3. **`:has()` CSS** `[data-sidebar=menu-item]:has([data-sidebar=menu-action]) &` reemplaza `group-has-data-[*]`.
4. **`color-mix()`** para opacidad de token: `color-mix(in srgb, var(--ck-colors-sidebar-fg) 70%, transparent)`.
5. **`chakra(Slot)`** para el patrón `asChild` con Radix Slot preservando Chakra style props.

## Alternativas consideradas

- **Mantener el sistema `group/peer` de Tailwind en sidebar:** descartado — requeriría conservar `className="group peer ..."` en el componente, bloqueando la eliminación de Tailwind.
- **Migrar `sidebar` a componentes Chakra nativos (Drawer + Menu):** descartado por cambio total de API que rompería los 8 consumidores.
- **Diferir `sidebar` a fase 3d:** descartado — la clave de habilitación (tokens `sidebar.*` ya en `chakra-system.ts`) hace la migración mecánica y el bloqueador previo (CVA + `group/peer`) se resuelve con `css=` + selectores de atributos.

## Consecuencias

**Positivas**
- `sidebar.tsx` elimina la dependencia de `class-variance-authority` (CVA). Verificar si puede desinstalarse del `package.json` (pendiente; otros archivos pueden usarlo).
- `app-header.tsx` elimina todos los `dark:` modifiers y el import de `cn()`.
- `bottom-bar.tsx` pasa de Tailwind puro a Chakra; `BottomBarProps` ahora extiende `BoxProps` (sin consumidores → cambio seguro).
- La shell completa del profesional (sidebar + header + bottom-bar + briefing) ahora es token-semántico consistente.

**Negativas / seguimiento**
- `SidebarGroup` recibió un tipo `css?: Record<string, unknown>` para soportar el override de `NavFooter`; futuro: tiparlo con `SystemStyleObject` de Chakra para mayor precisión.
- Los pseudo-elementos `::after` en `SidebarRail` no tienen `content: '""'` declarado como string en algunos entornos de CSS-in-JS; verificar visualmente el rail en desktop.
- Pendiente auditar si `class-variance-authority` puede desinstalarse (verificar uso en resto del codebase).
- Pendiente migración de páginas (`auth/`, `dashboard/`, `patients/`, etc.) con `dark:` modifiers — fases 3d y posteriores.
