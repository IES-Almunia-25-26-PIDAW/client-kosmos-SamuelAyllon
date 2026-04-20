# Pilar 5 · Frontend y Accesibilidad (A11y)

Activar en toda tarea que toque `resources/js/`, páginas Inertia, componentes UI, formularios, estilos o navegación.

## Estado de migración: Tailwind → Chakra UI

El proyecto está en **transición activa** de Tailwind v4 a Chakra UI (con su MCP). Commits recientes lo confirman:

- `b8426ab feat: migrate dropdown menu and sheet components to Chakra UI`
- `b0193cc feat: enhance Chakra UI configuration with semantic tokens and global styles`
- `a7a37d7 feat: integrate Chakra UI and update button component`

### Reglas durante la transición

1. **Todo componente nuevo se escribe en Chakra UI.** Sin excepciones.
2. Tailwind se tolera **solo** en componentes ya existentes aún no migrados. No añadir nuevas clases Tailwind en archivos modificados si el archivo puede migrarse completo en la misma PR.
3. Consultar el **Chakra MCP** antes de crear UI: tokens, recetas, slots, variantes.
4. Cada migración de componente existente → entrada en `docs/decision-log.md` si introduce un patrón nuevo (composición de Slot, recipe custom, etc.).

## Tokens y theming

- Theme centralizado (ver `resources/js/lib/chakra/` o ruta equivalente — verificar con Grep antes de tocar).
- Consumir **tokens semánticos** (`bg.surface`, `fg.muted`, `border.subtle`, `accent.solid`…). Prohibido hardcodear `#hex`, `rgb(...)` o magnitudes fijas (`16px`) fuera del theme.
- Tipografías, espaciados y radios vía `textStyle`, `layerStyle`, `space`, `radii`.

## Responsive (mobile-first)

- Breakpoints Chakra: `base < sm < md < lg < xl < 2xl`.
- Usar props responsivos `{ base: 'column', md: 'row' }` en vez de escribir media queries manuales.
- Todo layout probado en móvil (≤ 375 px) antes de escritorio.
- Imágenes con `srcSet`/`sizes` o `loading="lazy"` cuando aplique.

## Accesibilidad (WCAG 2.2 AA)

- `aria-label` o `aria-labelledby` en controles sin texto visible.
- Roles semánticos correctos — preferir HTML nativo (`<button>`, `<nav>`, `<main>`) a `<div role="...">`.
- Foco visible (no `outline: none` sin alternativa).
- Contraste mínimo 4.5:1 para texto normal, 3:1 para texto ≥18 px.
- Navegación completa por teclado: tab order lógico, atajos documentados, `Esc` cierra overlays.
- Respetar `prefers-reduced-motion` en animaciones.
- Aprovechar primitivas accesibles de Chakra (`Dialog`, `Menu`, `Tabs`, `Popover`) — no reimplementar desde `div`.
- Probar con lector de pantalla (NVDA/VoiceOver) en flujos críticos (login, checkout-equivalente, formularios largos).

## Formularios — validación dual

Regla: **cliente valida para UX, servidor valida para seguridad.** Siempre ambos.

### Cliente (Inertia + React)

- `useForm` de `@inertiajs/react` para estado y submit.
- `Field`/`FormControl` de Chakra para mostrar errores (`form.errors.<name>`).
- Mensajes de error consistentes con los del servidor (ideal: mismo string).

### Servidor (Laravel)

- `FormRequest` con reglas tipadas.
- Mensajes localizados en `lang/{es,en}/validation.php`.
- Respuestas 422 con errores estructurados (Inertia los adjunta automáticamente a `errors` prop).

## Rutas y links

- Usar Wayfinder: importar desde `@/actions/` o `@/routes/` — nunca hardcodear URLs.
- `<Link>` de Inertia para navegación SPA; `<a>` solo para enlaces externos o descargas.
- Activar skill `wayfinder-development` al conectar frontend ↔ backend.

## Style guide coherente

- Nombres de componentes en PascalCase; hooks en `camelCase` con prefijo `use`.
- Un componente por archivo; archivos coubicados con su test si lo tienen.
- Props tipadas con TypeScript — sin `any` salvo excepción documentada.
- Orden interno del componente: imports → types → component → subcomponents → helpers.
- Sin lógica de negocio en componentes de presentación — extraer a hooks o a actions del backend.

## Reglas de la IA

- Antes de crear un componente UI, Grep por su nombre o función análoga.
- Consultar Chakra MCP antes de asumir que un componente existe o no.
- Si el usuario pide un componente que aún está en Tailwind, proponer migrarlo a Chakra en la misma PR.
- No introducir librerías UI adicionales (shadcn, Radix directo, HeadlessUI) sin ADR.
