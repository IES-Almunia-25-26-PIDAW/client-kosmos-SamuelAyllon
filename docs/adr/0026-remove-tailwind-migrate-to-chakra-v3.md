---
adr: "0026"
title: Eliminación definitiva de Tailwind CSS y migración a Chakra UI v3
date: 2026-05-09
status: Aceptado
---

# ADR-0026 — Eliminación definitiva de Tailwind CSS y migración a Chakra UI v3

## Contexto

`CLAUDE.md §4` prohíbe explícitamente clases Tailwind en componentes nuevos o existentes. Sin embargo, la auditoría del 2026-05-09 detectó que `app.css` seguía importando `tailwindcss` y `tw-animate-css`, y que `welcome.tsx` usaba 17 ocurrencias de clases/animaciones Tailwind. Esto contradecía la regla "Chakra UI v3 es el único sistema visual permitido" e inflaba el bundle innecesariamente.

## Decisión

Se elimina Tailwind CSS completamente del proyecto:

- `app.css`: eliminados `@import 'tailwindcss'`, `@import 'tw-animate-css'` y directivas `@source`. Conservados los tokens CSS (`--color-*`, `--radius-*`, etc.) y los `@keyframes` custom (vanilla CSS, referenciados por la prop `animation` de Chakra).
- `package.json`: eliminadas las dependencias `tailwindcss`, `@tailwindcss/vite`, `tw-animate-css`, `clsx`, `tailwind-merge`.
- `vite.config.ts`: eliminado el plugin `@tailwindcss/vite` y su import.
- `lib/utils.ts`: eliminado el helper `cn()` (dependía de `clsx` + `tailwind-merge`).
- `welcome.tsx`: migrado íntegramente a Chakra v3 — `GradientText`, `PageCtn`, `SectionHeader`, `SimpleGrid`, `HStack`, tokens semánticos (`brand.*`, `fg.*`, `bg.*`, `danger.fg`). Las animaciones se referencian como strings CSS en la prop `animation` de Chakra, apuntando a los `@keyframes` en `app.css`.

## Consecuencias

**Positivas**
- Cumplimiento de `CLAUDE.md §4`; un único sistema visual (`chakra-system.ts`).
- Reducción del bundle (Tailwind eliminado del CSS).
- `cn()` ya no es necesario.

**Negativas**
- Los keyframes permanecen en `app.css` como vanilla CSS en lugar de estar en `chakra-system.ts`; esta deuda técnica es aceptable — moverlos a `animationStyles` de Chakra es una mejora futura no urgente.
- Cualquier componente nuevo **debe** usar Chakra UI v3 exclusivamente. Si se necesita una animación, se añade el `@keyframe` en `app.css` y se referencia con la prop `animation`.
