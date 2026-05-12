---
adr: "0004"
title: "Migración fase 3a: componentes ligeros (input-error, user-info, text-link) a Chakra UI v3"
date: 2026-04-21
status: Aceptado
---

# ADR-0004 — Migración fase 3a: componentes ligeros (`input-error`, `user-info`, `text-link`) a Chakra UI v3

## Contexto

Auditoría posterior a ADR-0002 confirma que `resources/js/components/ui/` está casi totalmente migrado a Chakra (salvo `sidebar.tsx`, diferido por complejidad CVA + selectores compuestos). Fuera de `ui/` siguen existiendo ~11 componentes no-UI y ~32 páginas con clases Tailwind y modificadores `dark:` hardcodeados, lo que contradice [`.claude/frontend-a11y.md`](../../.claude/frontend-a11y.md) (sin colores hardcodeados, tokens semánticos, WCAG 2.2 AA).

Para avanzar con entregas pequeñas y verificables, esta fase 3a ataca únicamente los **tres componentes de bajo coste** que tienen equivalencia directa en tokens semánticos ya existentes en [`resources/js/lib/chakra-system.ts`](../../resources/js/lib/chakra-system.ts) (`danger.fg`, `fg.muted`, `border.subtle`).

## Decisión

Se migran a primitivos Chakra + tokens semánticos, preservando la API pública (default export, firma de props) para no alterar consumidores:

| Archivo | Antes | Después |
|---------|-------|---------|
| [`resources/js/components/input-error.tsx`](../../resources/js/components/input-error.tsx) | `<p className="text-sm text-red-600 dark:text-red-400">` + `cn()` | `<Text fontSize="sm" color="danger.fg">` |
| [`resources/js/components/user-info.tsx`](../../resources/js/components/user-info.tsx) | `div` + `span` con `className="grid flex-1 text-left…"`, `dark:bg-neutral-700`, `text-muted-foreground` | `Box` + `Text` Chakra, fallback hereda de `AvatarFallback` (ya con `bg.muted`/`fg.muted`) |
| [`resources/js/components/text-link.tsx`](../../resources/js/components/text-link.tsx) | `cn('underline decoration-neutral-300 … dark:decoration-neutral-500')` sobre `<Link>` | `chakra(Link)` con receta base (`textDecoration`, `textDecorationColor: border.subtle`, `_hover`, transición con tokens `normal`/`standard`) |

`TextLink` se envuelve con la factory `chakra(Link)` porque varios consumidores en páginas de auth (fase 3d) aún pasan `className` con clases Tailwind; la factory permite el passthrough de `className` y la extensión por style props de Chakra sin romper consumidores ni introducir una API propia.

## Alternativas consideradas

- **Extender `chakra-system.ts` con un token `fg.error` dedicado:** descartado; ya existe `danger.fg` vía `semanticPalette('error')` y evita ruido en el sistema.
- **Eliminar el passthrough de `className` en `TextLink`:** descartado porque 4 páginas de auth aún lo usan; se retirará cuando esas páginas migren (fase 3d).

## Consecuencias

**Positivas**
- Tres componentes eliminan `cn()` y clases Tailwind por completo.
- Patrón de referencia reproducible para fase 3b (`delete-user`, `appearance-tabs`, `password-strength`, `kosmo-briefing`, `nav-footer`, `empty-state`).
- Cero nuevos tokens añadidos: se reutiliza `danger.fg` (ya mapeado vía `semanticPalette('error')`) y `border.subtle`.

**Negativas / seguimiento**
- Las páginas de auth que pasan `className` Tailwind a `<TextLink>` (`login.tsx`, `register.tsx`, `forgot-password.tsx`, `verify-email.tsx`) siguen usando Tailwind; se migrarán en fase 3d.
- `sidebar.tsx`, `app-header.tsx`, `bottom-bar.tsx` y componentes medianos pendientes (fases 3b–3c).
- Desactivación de directivas Tailwind en `resources/css/app.css` queda pospuesta hasta completar páginas.
