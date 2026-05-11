---
adr: "0022"
title: Adopción de Vitest + @testing-library/react para tests de frontend
date: 2026-05-02
status: Aceptado
---

# ADR-0022 — Adopción de Vitest + @testing-library/react para tests de frontend

## Contexto

La auditoría de cobertura de testing (2026-05-02) confirmó que el proyecto tenía **264 tests Pest verdes en backend** y una matriz de trazabilidad en buen estado, pero **cero tests de frontend** (declarado como deuda en `RNF-Q06`). Para una app clínica con grabación de audio, transcripción y formularios de reserva, esta es la mayor brecha abierta: cualquier regresión visual o de comportamiento en cliente llega a producción sin red.

## Decisión

Se adopta **Vitest 2** (mismo runtime de Vite, cero divergencia de bundler) + **@testing-library/react 16** + **jsdom 25** como stack de testing de frontend.

Convenciones:
- Tests **co-locados** (`Component.tsx` + `Component.test.tsx`, `useHook.ts` + `useHook.test.ts`).
- Setup global en [resources/js/test/setup.ts](../../resources/js/test/setup.ts) — importa `jest-dom/vitest`, hace `cleanup` post-test, polyfills de `matchMedia`/`ResizeObserver`/`IntersectionObserver` para jsdom.
- Helper `renderWithChakra` en [resources/js/test/render.tsx](../../resources/js/test/render.tsx) que envuelve con `ChakraProvider value={system}` desde [resources/js/lib/chakra-system.ts](../../resources/js/lib/chakra-system.ts) — los tests no hardcodean tokens, usan los del proyecto.
- Mocks vía `vi.hoisted()` para evitar problemas de orden de inicialización con el hoisting de `vi.mock()`.
- **Naming con tag de requisito:** `it('[RF-09] ...', ...)`. Hace la trazabilidad code-visible y grep-eable.
- Sin snapshot tests salvo justificación.
- `vitest.config.ts` fuera del `tsconfig.include` para evitar el conflicto de tipos entre `vite` del proyecto y `vite` bundleado dentro de `vitest`.

Cobertura inicial (4 unidades de mayor riesgo):
1. [resources/js/components/recording-indicator.tsx](../../resources/js/components/recording-indicator.tsx) — render + a11y básico (RF-12).
2. [resources/js/hooks/use-countdown.ts](../../resources/js/hooks/use-countdown.ts) — lógica pura con `vi.useFakeTimers` (RF-10).
3. [resources/js/components/join-call-button.tsx](../../resources/js/components/join-call-button.tsx) — interacción + axios + Inertia router mock (RF-09).
4. [resources/js/hooks/use-professional-tab-recorder.ts](../../resources/js/hooks/use-professional-tab-recorder.ts) — máquina de estados + fakes de `MediaRecorder`, `getDisplayMedia`, `getUserMedia` (RF-12, RNF-09).

Suite inicial: **18 tests verdes en 4 archivos**.

## Alternativas consideradas

- **Jest + ts-jest + Babel:** descartado — duplicaría toolchain y obligaría a mantener dos configuraciones de transformación (Vite + Babel). Vitest reutiliza Vite en bloque.
- **Playwright (E2E only):** descartado para este paso — los componentes/hooks de mayor riesgo son lógica de unidad; no rinden en E2E.
- **Snapshot testing como vehículo principal:** descartado — los snapshots se rompen con cualquier ajuste de Chakra/tokens y degeneran en `update-all-snapshots`. Aserciones explícitas escalan mejor.

## Consecuencias

**Positivas**
- Cierre parcial de `RNF-Q06` (pasa a 🟡): la red de seguridad ya cubre los cuatro componentes/hooks de mayor riesgo.
- Convención de naming con `[RF-XX]/[RNF-XX]` reduce el coste de adoptar la trazabilidad code-visible.
- Stack Vitest + Vite reutiliza el resolver/transformer del bundler — sin Babel paralelo, sin Jest, sin doble fuente de verdad.
- Gate local CLAUDE.md §7 incorpora `npm run test`; CI ejecuta el step nuevo en cada push/PR.

**Negativas / seguimiento**
- Combinación React 19 + RTL 16: requirió `define: { 'process.env.NODE_ENV': '"development"' }` y `conditions: ['development', 'browser']` en `vitest.config.ts` para que Vite resolviera el build de React con `act()` exportado.
- jsdom no parsea las CSS modernas que inyecta Emotion (Chakra v3) — emite warnings ruidosos pero no rompe los tests. Se acepta el ruido.
- Cobertura aún no está medida ni umbralizada en CI para frontend; pendiente de un paso futuro.
- Booking form pública ([resources/js/pages/patient/appointments/book.tsx](../../resources/js/pages/patient/appointments/book.tsx)) queda fuera de este lote por necesitar mock pesado de `useForm` Inertia + auth context.
