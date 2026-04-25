# Decision Log (ADR)

Registro de decisiones arquitectónicas significativas del proyecto ClientKosmos. Formato Nygard ligero. Numeración secuencial. Un ADR aceptado no se edita: si cambia, se marca como "Reemplazado por ADR-YYYY" y se crea uno nuevo.

Plantilla → ver [`.claude/documentation.md`](../.claude/documentation.md).

---

## ADR-0001 — Adopción de los estándares de excelencia Kosmos

- **Fecha:** 2026-04-20
- **Estado:** Aceptado

### Contexto

El proyecto carecía de un sistema unificado que forzara a la IA (Claude Code) y al equipo humano a mantener los criterios de calidad de un producto profesional: documentación arquitectónica, ADRs, declaración de uso de IA, 3FN estricta, testing obligatorio, seguridad (Fortify + secretos), CI/CD como gate de merge y accesibilidad WCAG 2.2 AA. Además, el frontend vive una transición activa de Tailwind v4 a Chakra UI que necesita regla explícita.

### Decisión

Se adoptan los cinco pilares definidos en `CLAUDE.md → === kosmos excellence rules ===`, materializados como archivos de contexto en `.claude/`:

- `.claude/execution-protocol.md`
- `.claude/documentation.md`
- `.claude/clean-code-db.md`
- `.claude/testing-security.md`
- `.claude/devops.md`
- `.claude/frontend-a11y.md`

Se establecen como artefactos vivos este `docs/decision-log.md` y `docs/ai-usage-declaration.md`.

### Consecuencias

**Positivas**
- La IA recibe instrucciones persistentes sin tener que repetirlas por conversación.
- Cualquier excepción (nueva dependencia, deuda técnica aceptada) queda trazada.
- Gates automáticos (Pint, Pest, Lint, Build) previenen regresiones.

**Negativas / seguimiento**
- Requiere disciplina: cada PR debe tocar `ai-usage-declaration.md` y, si hay decisión arquitectónica, añadir ADR.
- Pendiente auditar `.github/workflows/` para asegurar que el pipeline refleja los gates (→ crear ADR-0002 si falta algo).
- Pendiente inventariar componentes Tailwind restantes y trazar plan de migración a Chakra (→ ADR-0003).

---

## ADR-0002 — Migración de compuestos UI (fase 2): Dialog, AlertDialog, Select, NavigationMenu, InputOTP, StatusBadge a Chakra UI v3

- **Fecha:** 2026-04-20
- **Estado:** Aceptado

### Contexto

Se continúa la migración Tailwind → Chakra UI v3 iniciada con `dropdown-menu`, `sheet`, `breadcrumb`. Los compuestos UI restantes dependían de `@radix-ui/*` + CVA + clases Tailwind, lo que genera deuda visual y contradice [`.claude/frontend-a11y.md`](../.claude/frontend-a11y.md) (sin hex hardcodeado, tokens semánticos, WCAG 2.2 AA).

### Decisión

Se aplican dos estrategias según el primitivo:

1. **Primitivo Chakra nativo** (cuando existe en v3): reescritura directa.
   - `dialog.tsx` → `Dialog` de Chakra (`Dialog.Root` / `Backdrop` / `Positioner` / `Content` / `CloseTrigger` / `Title` / `Description`).
   - `alert-dialog.tsx` → `Dialog` de Chakra con `role="alertdialog"` (Chakra v3 no expone `AlertDialog` independiente).
   - `status-badge.tsx` → `Badge` de Chakra + `colorPalette` mapeado por estado (`paid→green`, `pending→yellow`, `overdue/claimed→red`, `noConsent→purple`, `openDeal→orange`).

2. **Radix como headless + `chakra()` factory para estilado** (cuando no hay primitivo Chakra equivalente o el contrato de API shadcn rompería a consumidores):
   - `select.tsx` → se preserva la API shadcn (`<SelectItem value="x">Label</SelectItem>`), Radix queda como motor, clases Tailwind sustituidas por recetas `chakra()` con tokens semánticos.
   - `navigation-menu.tsx` → ídem, Chakra v3 no tiene `NavigationMenu`; Radix se mantiene.
   - `input-otp.tsx` → se mantiene `input-otp` (librería externa) porque la API slot-by-index del consumidor (`<InputOTPSlot index={n}/>`) no mapea al `PinInput` de Chakra; se restyla con `Box` + tokens Chakra. Migración a `PinInput` queda pospuesta hasta refactor del consumidor [`two-factor-setup-modal.tsx`](../resources/js/components/two-factor-setup-modal.tsx).

En todos los casos se preserva **exactamente** la API pública (nombres y firmas de subcomponentes exportados) — cero cambios en consumidores.

### Consecuencias

**Positivas**
- Se eliminan clases Tailwind de 6 compuestos; los tokens semánticos (`bg.surface`, `fg.muted`, `border.subtle`) son la única fuente de estilo.
- `AlertDialog` ya no depende del paquete `radix-ui` agregado; pasa a usar Chakra Dialog.
- Base para fase 3 donde se podrá desinstalar `@radix-ui/react-dialog` (queda solo como dependencia de `select`/`navigation-menu`/`input-otp`).

**Negativas / seguimiento**
- Select/NavigationMenu/InputOTP siguen dependiendo de `@radix-ui/*` e `input-otp`. Desinstalación diferida.
- `navigationMenuTriggerStyle()` ahora devuelve objeto de estilos Chakra (antes devolvía string CVA). Cualquier consumidor externo al wrapper debe pasarlo a un componente `chakra()` o como `css=`, no como `className`. Consumidores actuales (2 usos) no lo invocan directamente.
- `DialogHeader`/`DialogFooter` cambian el markup semántico (pasan de `<div>` plano a `Box`/`Flex`), manteniendo estilos equivalentes.

### Alternativas consideradas

- **Adoptar API nativa Chakra Select (`createListCollection` + `items={[...]}`):** descartada para no romper consumidores existentes y por el coste del wrapper adaptador de `React.Children`.
- **Reescribir NavigationMenu con `Menu` / `HoverCard` de Chakra:** descartada por cambio mayor de API y bajo número de consumidores (2) que no justifican el refactor.
- **Migrar InputOTP a `PinInput`:** descartada en esta fase; requiere refactor del consumidor (la API slot-by-index no existe en Chakra).

---

## ADR-0003 — Corrección sistémica: `type="submit"` obligatorio en `Button` dentro de formularios Inertia v2

- **Fecha:** 2026-04-20
- **Estado:** Aceptado

### Contexto

Durante la validación visual (Fase 3a) se detectó que múltiples formularios no respondían al botón de envío. El componente `Button` delega en `ChakraButton` de Chakra UI v3, el cual establece `type="button"` por defecto (comportamiento intencional de Chakra para prevenir envíos accidentales). El patrón anterior con shadcn/Radix no tenía este comportamiento; los botones sin `type` explícito dentro de un `<form>` heredaban el default HTML (`type="submit"`). La migración a Chakra UI rompió silenciosamente todos los botones de envío que no declaraban `type` explícitamente.

Un segundo patrón problemático: `<Button asChild><button type="submit">` — Chakra mezcla sus props sobre el hijo y sobreescribe `type="submit"` con `type="button"`.

### Decisión

1. Todo `<Button>` que actúe como envío de formulario debe llevar **`type="submit"` explícito**.
2. Eliminar el patrón `<Button asChild><button type="submit">` — usar `<Button type="submit">` directamente.
3. Los botones que cancelan o cierran dentro de un `<form>` deben llevar **`type="button"` explícito** para no enviar el formulario accidentalmente.

Archivos corregidos en esta sesión:

| Archivo | Botón | Fix |
|---------|-------|-----|
| [`resources/js/components/delete-user.tsx`](../resources/js/components/delete-user.tsx) | Eliminar cuenta | `asChild` → `type="submit"` + `loading` prop |
| [`resources/js/components/delete-user.tsx`](../resources/js/components/delete-user.tsx) | Cancelar | añadido `type="button"` |
| [`resources/js/pages/auth/confirm-password.tsx`](../resources/js/pages/auth/confirm-password.tsx) | Confirmar contraseña | añadido `type="submit"` |
| [`resources/js/pages/auth/forgot-password.tsx`](../resources/js/pages/auth/forgot-password.tsx) | Enviar enlace | añadido `type="submit"` |
| [`resources/js/pages/settings/password.tsx`](../resources/js/pages/settings/password.tsx) | Guardar contraseña | añadido `type="submit"` |
| [`resources/js/pages/settings/profile.tsx`](../resources/js/pages/settings/profile.tsx) | Guardar perfil | añadido `type="submit"` |

### Consecuencias

**Positivas**
- Todos los flujos de autenticación y configuración vuelven a funcionar correctamente.
- Regla explícita documentada para futuros desarrolladores: cualquier `Button` de envío dentro de `<Form>` de Inertia requiere `type="submit"`.

**Negativas / seguimiento**
- Pendiente auditar los formularios en páginas de pacientes, citas y admin que usan `useForm` de Inertia (patrón nativo `<form onSubmit>`). Ese patrón no está afectado por el bug de Chakra, pero debe verificarse si alguno usa `<Button>` sin tipo dentro de un `<form>` HTML estándar.

---

## ADR-0004 — Migración fase 3a: componentes ligeros (`input-error`, `user-info`, `text-link`) a Chakra UI v3

- **Fecha:** 2026-04-21
- **Estado:** Aceptado

### Contexto

Auditoría posterior a ADR-0002 confirma que `resources/js/components/ui/` está casi totalmente migrado a Chakra (salvo `sidebar.tsx`, diferido por complejidad CVA + selectores compuestos). Fuera de `ui/` siguen existiendo ~11 componentes no-UI y ~32 páginas con clases Tailwind y modificadores `dark:` hardcodeados, lo que contradice [`.claude/frontend-a11y.md`](../.claude/frontend-a11y.md) (sin colores hardcodeados, tokens semánticos, WCAG 2.2 AA).

Para avanzar con entregas pequeñas y verificables, esta fase 3a ataca únicamente los **tres componentes de bajo coste** que tienen equivalencia directa en tokens semánticos ya existentes en [`resources/js/lib/chakra-system.ts`](../resources/js/lib/chakra-system.ts) (`danger.fg`, `fg.muted`, `border.subtle`).

### Decisión

Se migran a primitivos Chakra + tokens semánticos, preservando la API pública (default export, firma de props) para no alterar consumidores:

| Archivo | Antes | Después |
|---------|-------|---------|
| [`resources/js/components/input-error.tsx`](../resources/js/components/input-error.tsx) | `<p className="text-sm text-red-600 dark:text-red-400">` + `cn()` | `<Text fontSize="sm" color="danger.fg">` |
| [`resources/js/components/user-info.tsx`](../resources/js/components/user-info.tsx) | `div` + `span` con `className="grid flex-1 text-left…"`, `dark:bg-neutral-700`, `text-muted-foreground` | `Box` + `Text` Chakra, fallback hereda de `AvatarFallback` (ya con `bg.muted`/`fg.muted`) |
| [`resources/js/components/text-link.tsx`](../resources/js/components/text-link.tsx) | `cn('underline decoration-neutral-300 … dark:decoration-neutral-500')` sobre `<Link>` | `chakra(Link)` con receta base (`textDecoration`, `textDecorationColor: border.subtle`, `_hover`, transición con tokens `normal`/`standard`) |

`TextLink` se envuelve con la factory `chakra(Link)` porque varios consumidores en páginas de auth (fase 3d) aún pasan `className` con clases Tailwind; la factory permite el passthrough de `className` y la extensión por style props de Chakra sin romper consumidores ni introducir una API propia.

### Consecuencias

**Positivas**
- Tres componentes eliminan `cn()` y clases Tailwind por completo.
- Patrón de referencia reproducible para fase 3b (`delete-user`, `appearance-tabs`, `password-strength`, `kosmo-briefing`, `nav-footer`, `empty-state`).
- Cero nuevos tokens añadidos: se reutiliza `danger.fg` (ya mapeado vía `semanticPalette('error')`) y `border.subtle`.

**Negativas / seguimiento**
- Las páginas de auth que pasan `className` Tailwind a `<TextLink>` (`login.tsx`, `register.tsx`, `forgot-password.tsx`, `verify-email.tsx`) siguen usando Tailwind; se migrarán en fase 3d.
- `sidebar.tsx`, `app-header.tsx`, `bottom-bar.tsx` y componentes medianos pendientes (fases 3b–3c).
- Desactivación de directivas Tailwind en `resources/css/app.css` queda pospuesta hasta completar páginas.

### Alternativas consideradas

- **Extender `chakra-system.ts` con un token `fg.error` dedicado:** descartado; ya existe `danger.fg` vía `semanticPalette('error')` y evita ruido en el sistema.
- **Eliminar el passthrough de `className` en `TextLink`:** descartado porque 4 páginas de auth aún lo usan; se retirará cuando esas páginas migren (fase 3d).

---

## ADR-0005 — Migración fase 3b: componentes medianos (`delete-user`, `appearance-tabs`, `password-strength`, `nav-footer`, `empty-state`) a Chakra UI v3

- **Fecha:** 2026-04-21
- **Estado:** Aceptado

### Contexto

ADR-0004 cerró la fase 3a (componentes ligeros) y dejó una lista explícita de seguimiento para la fase 3b. Auditoría previa confirma que los cinco componentes elegidos no requieren tokens nuevos: [`resources/js/lib/chakra-system.ts`](../resources/js/lib/chakra-system.ts) ya expone `danger.*`, `warning.*`, `success.*`, `info.*`, `orange.*`, `brand.*`, `bg.muted`, `bg.subtle`, `fg.muted`, `fg.subtle`, `border.subtle`. `kosmo-briefing.tsx` (subdirectorio `components/kosmo/`) queda diferido a fase 3c por su complejidad y alcance (4 consumidores). `sidebar.tsx`, `app-header.tsx`, `bottom-bar.tsx` también se difieren.

### Decisión

Se migran a primitivos Chakra + tokens semánticos, preservando la API pública (export, firma de props) para no alterar consumidores:

| Archivo | Estrategia |
|---------|-----------|
| [`resources/js/components/nav-footer.tsx`](../resources/js/components/nav-footer.tsx) | `chakra('a')` con `color: 'fg.muted'` + `_hover`; se conserva `group-data-[collapsible=icon]:p-0` (pertenece al sistema Sidebar, se retira cuando se migre en 3c). Icono Lucide con `size={20}` en lugar de `className="h-5 w-5"`. |
| [`resources/js/components/empty-state.tsx`](../resources/js/components/empty-state.tsx) | `Flex` + `Box` + `Heading` + `Text` + `Button` Chakra. Se eliminan **todas** las variables CSS ad-hoc (`var(--color-muted)`, `--color-text-muted`, `--color-primary*`, etc.) — anti-patrón que evadía el theme. Botón con `type="button"` (ADR-0003). |
| [`resources/js/components/appearance-tabs.tsx`](../resources/js/components/appearance-tabs.tsx) | `SimpleGrid` + `chakra('button')` con receta base + selector `[data-selected="true"]` → `borderColor: 'brand.solid'`, `bg: 'brand.subtle'`. `Circle` Chakra con color condicional `brand.solid`/`bg.subtle`. Focus ring explícito con `_focusVisible` + `brand.focusRing`. |
| [`resources/js/components/password-strength.tsx`](../resources/js/components/password-strength.tsx) | Mapping 5 niveles → 5 paletas distintas: `danger.solid` → `orange.solid` → `warning.solid` → `info.solid` → `success.solid` (decisión confirmada con el usuario para preservar granularidad visual). `Stack`/`Flex`/`HStack` Chakra. Lista `as="ul"` con reglas. |
| [`resources/js/components/delete-user.tsx`](../resources/js/components/delete-user.tsx) | `Card` Chakra con `borderColor="danger.muted"` y header `bg="danger.subtle"`. Warning banner → `Flex role="alert"` + tokens `danger.*`. `Circle` para el icono dentro del dialog. Botones con `type="submit"`/`type="button"` explícitos (ADR-0003). Iconos Lucide con `size` + color inline vía `var(--ck-colors-*)`. |

**Preservación de API:** cero cambios en los 11 consumidores totales (6 para `empty-state`, 1 para los demás).

### Consecuencias

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

### Alternativas consideradas

- **Crear tokens `level-1..5` dedicados para password-strength:** descartado — duplica semántica ya existente (`danger`, `warning`, `success`, `info`, `orange`).
- **Migrar `appearance-tabs` a `SegmentGroup` de Chakra v3:** descartado por cambio de API visual (el componente es una "card grid" con icono y descripción, no un segment group horizontal compacto).
- **Migrar `empty-state` a un primitivo propio en `resources/js/components/ui/`:** descartado — `empty-state` vive bien como composición directa de primitivos Chakra sin necesidad de wrapper adicional.
- **Incluir `kosmo-briefing` en este PR:** descartado por scope; se trata en fase 3c junto al sidebar/app-header por afinidad de áreas (briefing es parte de la shell del profesional).

---

## ADR-0006 — Migración fase 3c: `bottom-bar`, `app-header`, `sidebar` (+ cierre de `kosmo-briefing` y `nav-footer`)

- **Fecha:** 2026-04-21
- **Estado:** Aceptado

### Contexto

ADR-0005 cerró la fase 3b y dejó cuatro componentes pendientes para la fase 3c: `kosmo-briefing`, `bottom-bar`, `app-header` y `sidebar`. La verificación previa a la implementación reveló que **`kosmo-briefing` ya estaba completamente migrado** (trabajo de una sesión anterior no documentado). Los cuatro archivos restantes tenían dependencias directas de Tailwind, `class-variance-authority` (CVA) y primitivos shadcn.

La particularidad de esta fase es la complejidad del `sidebar.tsx` (723 líneas, 20+ subcomponentes exportados, 8 consumidores): dependía del sistema `group/peer` de Tailwind y de CVA. La clave que habilitó la migración es que `chakra-system.ts` ya expone el namespace `sidebar.*` mapeado a los mismos CSS variables que usaba Tailwind (`bg-sidebar` → `var(--sidebar)`, etc.).

### Decisión

| Archivo | Estrategia |
|---------|-----------|
| [`resources/js/components/kosmo/kosmo-briefing.tsx`](../resources/js/components/kosmo/kosmo-briefing.tsx) | Verificado — ya migrado. Cero trabajo adicional. |
| [`resources/js/components/bottom-bar.tsx`](../resources/js/components/bottom-bar.tsx) | Reescritura directa con `Box`, `Flex`, `chakra.button`. Sin consumidores → cero riesgo. `BottomBarProps` actualizado a `BoxProps`. |
| [`resources/js/components/app-header.tsx`](../resources/js/components/app-header.tsx) | `chakra(Link)` (Inertia) como `ChakraLink`. Eliminación de `cn()`, `activeItemStyles` con `dark:`. Sheet/Avatar/Tooltip ya eran wrappers Chakra. `navigationMenuTriggerStyle()` reemplazado por style props inline directamente sobre `ChakraLink`. |
| [`resources/js/components/ui/sidebar.tsx`](../resources/js/components/ui/sidebar.tsx) | **Migración sistemática**: CVA eliminado; `sidebarMenuButtonVariants` reemplazado por style props + `css=`. Sistema `group/peer` de Tailwind sustituido por selectores CSS de atributos en `css=` (`[data-collapsible=icon] &`, `[data-sidebar=menu-button] ~ &`, `:has([data-sidebar=menu-action])`, etc.). Tokens `sidebar.*` via Chakra. Los 20+ exports preservados sin cambio. |
| [`resources/js/components/nav-footer.tsx`](../resources/js/components/nav-footer.tsx) | Residual de ADR-0005 resuelto: `group-data-[collapsible=icon]:p-0` → `css={{ '[data-collapsible=icon] &': { padding: '0' } }}`. |

**Patrones técnicos establecidos:**

1. **Selectores de ancestro** `[data-attr=val] &` en `css=` reemplazan `group-data-[*]` de Tailwind.
2. **Selectores de hermano** `[data-sidebar=menu-button] ~ &` reemplazan `peer-data-[*]` de Tailwind.
3. **`:has()` CSS** `[data-sidebar=menu-item]:has([data-sidebar=menu-action]) &` reemplaza `group-has-data-[*]`.
4. **`color-mix()`** para opacidad de token: `color-mix(in srgb, var(--ck-colors-sidebar-fg) 70%, transparent)`.
5. **`chakra(Slot)`** para el patrón `asChild` con Radix Slot preservando Chakra style props.

### Consecuencias

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

### Alternativas consideradas

- **Mantener el sistema `group/peer` de Tailwind en sidebar:** descartado — requeriría conservar `className="group peer ..."` en el componente, bloqueando la eliminación de Tailwind.
- **Migrar `sidebar` a componentes Chakra nativos (Drawer + Menu):** descartado por cambio total de API que rompería los 8 consumidores.
- **Diferir `sidebar` a fase 3d:** descartado — la clave de habilitación (tokens `sidebar.*` ya en `chakra-system.ts`) hace la migración mecánica y el bloqueador previo (CVA + `group/peer`) se resuelve con `css=` + selectores de atributos.

---

## ADR-0007 — Migración Batch C: páginas de dashboard (`dashboard.tsx`, `dashboard/professional.tsx`, `dashboard/patient.tsx`) a Chakra UI v3

- **Fecha:** 2026-04-21
- **Estado:** Aceptado

### Contexto

Las tres páginas de dashboard eran las primeras en la cola de migración de páginas (ADR-0006 dejó explícito que las páginas quedaban para fases 3d y posteriores). Seguían usando clases Tailwind con variables CSS ad-hoc (`var(--color-primary)`, `var(--color-text)`, `var(--color-border)`, `text-kpi`, `text-display-2xl`, etc.) y el helper `className=[...].join(' ')` para condicionales. Esto bloqueaba la eliminación definitiva de Tailwind en el bundle.

### Decisión

Se migran las tres páginas a primitivos Chakra + tokens semánticos:

| Archivo | Estrategia principal |
|---------|---------------------|
| [`resources/js/pages/dashboard.tsx`](../resources/js/pages/dashboard.tsx) | `Stack`/`Grid`/`Flex`/`Box`/`Text`/`Heading`/`Badge` Chakra. `Grid templateColumns` responsivo con breakpoints `base`/`lg`. `Badge` de `@chakra-ui/react` con `colorPalette` para píldoras de modalidad (online→gray, presencial→green). `Button asChild` con `ChakraLink` para botones de acción. `chakra(Link)` para enlaces de texto. |
| [`resources/js/pages/dashboard/professional.tsx`](../resources/js/pages/dashboard/professional.tsx) | Misma estrategia que `dashboard.tsx`; diferencia única: texto "Ver calendario completo" vs "Ver todas las citas". |
| [`resources/js/pages/dashboard/patient.tsx`](../resources/js/pages/dashboard/patient.tsx) | Añade grid de 3 KPI stats en fila, avatar de iniciales con `Flex`/`borderRadius="full"`, y mapa `invoiceStatusColorPalette` que sustituye el `invoiceStatusClass` Record de strings CSS por `colorPalette` de Chakra Badge. |

**Tokens empleados (todos ya existentes):** `fg`, `fg.muted`, `fg.subtle`, `brand.solid`, `brand.subtle`, `border`, `bg.surface`, `bg.subtle`, `error.solid`, `error.fg`, `warning.fg`, `success.*`, `white/70`, `white/15`.

**Patrones establecidos para siguientes batches:**
- `text-kpi` / `text-display-2xl` / `text-display-lg` / `text-body-md` → `fontSize` + `fontWeight` Chakra (`3xl/bold`, `xl/semibold`, `md`).
- Condicionales de `className=[...].join(' ')` → props Chakra directas (`borderColor`, `bg`, `boxShadow`) con expresiones ternarias.
- `divide-y` de Tailwind → `borderTopWidth` condicional por índice en cada hijo.
- Inline `className` de link con estilos de botón → `<Button asChild variant="primary|outline"><ChakraLink>`.

### Consecuencias

**Positivas**
- Las 3 páginas de dashboard eliminan completamente `className`, variables CSS ad-hoc y el helper `join(' ')`.
- Patrón reproducible para Batch D (pacientes), E (citas/facturas) y F (admin).
- `Badge` de `@chakra-ui/react` con `colorPalette` establece el patrón para píldoras de estado en todo el resto de páginas.

**Negativas / seguimiento**
- Los enlaces `/appointments` e `/invoices` siguen como strings hardcoded (ya existían así en el original); la migración a Wayfinder es tarea separada y transversal.
- Pendiente: batches D–G (pacientes, citas, facturas, admin, kosmo, onboarding, welcome).

### Alternativas consideradas

- **Usar `<Badge>` de `@/components/ui/badge` (wrapper legacy):** descartado para los casos de modalidad/estado de factura porque requiere `colorPalette` que el wrapper no expone; se importa `Badge` directamente de `@chakra-ui/react`.
- **Mantener `text-kpi` como clase Tailwind:** descartado — contradice ADR-0006 (sin nuevas clases Tailwind en componentes migrados). Se sustituye por `fontSize="3xl" fontWeight="bold"`.

---

## ADR-0008 — Transcripción chunked con Groq Whisper + captura independiente de Jitsi + consentimiento RGPD

- **Fecha:** 2026-04-22
- **Estado:** Aceptado

### Contexto

El flujo mínimo (P5/F5 del tracker) exige transcripción automática de la videoconsulta para poder alimentar el resumen IA posterior (F6a). La API de Groq Whisper (`whisper-large-v3-turbo`) es **batch**, no streaming, por lo que "transcripción en vivo" debe implementarse como sucesión de trozos cortos.

Dos restricciones técnicas condicionan el diseño:

1. **Jitsi corre en iframe** ([`@jitsi/react-sdk`](../resources/js/pages/call/room.tsx)). No tenemos acceso al `MediaStream` local desde el host. Las alternativas — grabación server-side con Jibri, capturar el stream mediante `RTCPeerConnection` propia, o inyectar código en el iframe — requieren infraestructura adicional o bypass del dominio Jitsi.
2. **Obligación RGPD** (art. 6 y 9 RGPD + LOPDGDD) de consentimiento explícito del paciente antes de cualquier tratamiento automatizado de datos de voz/salud. El consentimiento debe ser previo al envío de audio, auditable (timestamp), y revocable.

### Decisión

**Captura de audio independiente de Jitsi** mediante `navigator.mediaDevices.getUserMedia({ audio: true })` + `MediaRecorder` con `timeslice: 8000` (8 s por chunk). El navegador permite múltiples consumidores del mismo micrófono, de modo que el audio llega duplicado a Jitsi (para la videollamada) y al pipeline de transcripción (vía nuestro endpoint). Contrapartida: un pequeño overhead de CPU/memoria por la codificación WebM/Opus paralela, aceptable en hardware moderno.

**Pipeline backend** (implementado en este commit):

| Pieza | Responsabilidad |
|-------|-----------------|
| `POST /appointments/{id}/transcribe` — [`TranscribeAction`](../app/Http/Controllers/Appointment/TranscribeAction.php) | Ruta compartida paciente/profesional (fuera de prefijos `/professional` y `/patient`). Valida que el uploader sea paciente **con consentimiento** o profesional de la cita. Almacena el chunk en `storage/app/transcription-chunks/{recording_id}/` y despacha `TranscribeChunkJob`. |
| [`TranscribeChunkJob`](../app/Jobs/TranscribeChunkJob.php) | POST multipart al endpoint OpenAI-compatible de Groq (`/audio/transcriptions`), modelo `whisper-large-v3-turbo`, `language=es`. Persiste el texto devuelto como `TranscriptionSegment`. Borra el chunk del disco tras procesarlo (transcripción efímera). |
| Tabla `transcription_segments` | Un registro por chunk. Claves: `session_recording_id`, `speaker_user_id`, `position`, `started_at_ms`, `ended_at_ms`, `text`. `UNIQUE(session_recording_id, speaker_user_id, position)` garantiza idempotencia ante reintentos. |
| `POST /patient/appointments/{id}/recording-consent` — [`RecordingConsentAction`](../app/Http/Controllers/Portal/Appointment/RecordingConsentAction.php) | Solo paciente. Crea/recupera `SessionRecording` y sella `patient_consent_given_at`. Idempotente — segundas llamadas no sobreescriben el timestamp original, preservando la traza auditable. |

**Audio efímero:** los chunks se borran tras transcribir. No se persiste audio crudo en base de datos ni en storage permanente. `SessionRecording.audio_path` queda nullable para una posible integración futura con Jibri (grabación completa server-side, fuera del alcance del flujo mínimo).

### Consecuencias

**Positivas**
- Transcripción "casi en vivo" con latencia ≤ 10 s por segmento (8 s de chunk + ~1 s round-trip Groq Whisper turbo).
- Desacopla totalmente el pipeline de IA de la infraestructura Jitsi — si mañana se cambia el proveedor de video (Twilio, LiveKit, Daily), el pipeline no se toca.
- Consentimiento explícito + auditable satisface RGPD art. 6.1.a y art. 9.2.a (consentimiento específico para datos de salud).
- Idempotencia por `(recording_id, speaker_id, position)` permite reintentos sin duplicados (crítico para `Queueable` con `$tries = 3`).
- Audio efímero reduce superficie de cumplimiento: no hay audio a borrar, pseudoanonimizar ni transferir en solicitudes ARCO.

**Negativas / seguimiento**
- **Doble captura del micrófono**: el navegador mostrará una única solicitud de permiso, pero la CPU codifica dos streams Opus en paralelo. Aceptable en hardware moderno; a monitorizar en equipos de gama baja.
- **No hay transcripción offline**: si Groq cae, se pierde la transcripción de ese chunk (job falla tras 3 reintentos y el segmento queda sin registrar). Alternativa futura: almacenar el chunk si falla y reencolar, a coste de persistencia mayor.
- **Broadcasting de segmentos a la UI del profesional** queda para ADR-0009 (Laravel Reverb) — commit 2 del sprint.
- **Revocación de consentimiento durante la llamada**: no hay UI para revocar en medio de la sesión (el paciente puede cerrar la videollamada como salida de emergencia). Seguimiento en post-mortem de la deadline 2026-05-14.
- **Concatenación a `SessionRecording.transcription`**: los segmentos viven en su tabla propia; la columna `transcription` (longText) del recording padre se rellenará al finalizar la llamada (`EndCallAction`) con el texto concatenado, para alimentar `SummarizeSessionJob` (F6a) sin hacer joins.

### Alternativas consideradas

- **Jibri (grabación server-side de Jitsi) + transcripción batch al colgar:** descartada — requiere infraestructura Jitsi propia (no se usa Jitsi Meet público), rompe el "casi en vivo" requerido para que el profesional vea transcripción en pantalla durante la sesión, y el audio crudo es una superficie RGPD que preferimos evitar.
- **OpenAI Realtime API / Deepgram streaming (WebSocket):** descartadas por coste (Deepgram) y por evitar nueva dependencia (OpenAI Realtime) cuando Groq Whisper ya está configurado. Revisitar si la latencia de 8-10 s resulta insuficiente en UAT.
- **Tap del `RTCPeerConnection` de Jitsi desde el iframe host:** descartada — Jitsi no expone la conexión al host, y hackearlo acoplaría el código a la implementación interna de una versión concreta del SDK.
- **Conservar el chunk en storage permanente:** descartada — el dato útil es el texto, no el audio. Minimización RGPD (art. 5.1.c).

---

## ADR-0009 — Laravel Reverb como broadcaster para transcripción en vivo

- **Fecha:** 2026-04-22
- **Estado:** Aceptado

### Contexto

ADR-0008 dejó el backend de transcripción listo (`TranscribeChunkJob` persiste segmentos cada ~8 s), pero sin un mecanismo para empujar cada segmento a la UI del profesional en tiempo real. Las opciones son polling HTTP (latencia + carga), Server-Sent Events (sin reverse channel ni reconnect estándar), o WebSockets con un broker.

Laravel Reverb es la opción nativa del framework: servidor WebSocket compatible con el protocolo Pusher, sin dependencias externas (no Pusher cloud, no Soketi self-host), integrado con `ShouldBroadcast` y `routes/channels.php`. Para el flujo mínimo del 2026-05-14 esto encaja: sin coste recurrente, sin proveedor externo a contratar.

### Decisión

Se adopta **Laravel Reverb 1.x** como broadcaster por defecto (`BROADCAST_CONNECTION=reverb`):

| Pieza | Detalle |
|-------|---------|
| Backend | `composer require laravel/reverb`. `php artisan install:broadcasting --reverb` publica `config/reverb.php`, `config/broadcasting.php`, `routes/channels.php`. Variables `REVERB_APP_ID/KEY/SECRET/HOST/PORT/SCHEME` en `.env` y `.env.example`. |
| Frontend | `@laravel/echo-react` + `laravel-echo` + `pusher-js`. `configureEcho({ broadcaster: 'reverb' })` en [`resources/js/app.tsx`](../resources/js/app.tsx). Variables `VITE_REVERB_*` interpoladas desde las del servidor. |
| Canal | `private-appointment.{appointmentId}` autorizado en [`routes/channels.php`](../routes/channels.php) si el usuario es paciente o profesional de la cita. |
| Evento | [`App\Events\TranscriptionSegmentCreated`](../app/Events/TranscriptionSegmentCreated.php) implementa `ShouldBroadcast`, alias `transcription.segment.created`. Despachado desde `TranscribeChunkJob` tras `updateOrCreate` del segmento. Payload: `segment_id`, `speaker_user_id`, `position`, `started_at_ms`, `ended_at_ms`, `text`. |
| Operación | El servidor Reverb se arranca con `php artisan reverb:start`. En desarrollo se añadirá al `composer dev` script (seguimiento). En producción → supervisor + healthcheck. |

### Consecuencias

**Positivas**
- Sin proveedor externo (Pusher, Ably) → cero coste recurrente y datos en infraestructura propia (relevante para sanidad/RGPD).
- Compatible con el protocolo Pusher → cliente Echo estándar, fácil migración futura a Pusher cloud si la operativa de Reverb resulta engorrosa.
- Autorización del canal reusa Eloquent + `auth()` — no hay un sistema paralelo de permisos que mantener.
- Idempotencia y orden: el cliente recibe `position` en cada segmento, así puede reordenar/dedup si llegan fuera de orden.

**Negativas / seguimiento**
- **Operación adicional**: hay un proceso más que mantener vivo (`reverb:start`). En desarrollo lo orquesta `composer dev` (pendiente añadirlo a [`composer.json`](../composer.json)). En producción requiere supervisor.
- **Sin TLS por defecto**: `REVERB_SCHEME=http`. En producción hay que terminar TLS en el reverse proxy (nginx/Caddy) y poner `REVERB_SCHEME=https` + `REVERB_PORT=443`. Documentar en deploy guide.
- **Tests sin Reverb corriendo**: las pruebas usan `Event::fake()` y `postJson('/broadcasting/auth')` para verificar autorización; nunca abren un WebSocket real. Cubre la lógica de aplicación, no la entrega vía WS (responsabilidad del paquete y de Pusher protocol).
- **No persistimos los segmentos broadcasted**: si un cliente reconecta a mitad de sesión perderá los segmentos previos. Mitigación: al montar `live-transcript-panel` el frontend hará un fetch inicial de `transcription_segments` recientes; los nuevos llegan por WS. Esto se cierra en commit 3 del sprint.
- **Sin presencia (`PresenceChannel`)**: el aviso "el otro usuario se ha unido" sigue como tarea P2 del tracker; reusará el mismo broadcaster cuando se aborde.

### Alternativas consideradas

- **Pusher cloud**: descartado por coste recurrente y por sacar datos de salud fuera del perímetro propio.
- **Soketi self-host**: descartado — Reverb es la opción canónica del framework, mismo protocolo Pusher, sin necesidad de un proceso separado de comunidad.
- **Polling HTTP del endpoint `transcription_segments` cada 3 s**: descartado — latencia ≥ 3 s sumada a los 8 s del chunk hace la experiencia perezosa (>11 s p99); además genera carga innecesaria en la base de datos.
- **Server-Sent Events (SSE)**: descartado — no hay un canal de retorno (necesario en el commit 3 para señalar fin de sesión, etc.) y la reconexión + autenticación requieren plumbing manual que Echo ya resuelve.

---

## ADR-0010 — Migración Jitsi → Google Meet (videollamada)

- **Fecha:** 2026-04-24
- **Estado:** Aceptado

### Contexto

El SDK `@jitsi/react-sdk` requería un servidor Jitsi self-hosted (o `meet.jit.si` público sin garantías de uptime). El profesional ya dispone de Google Calendar y cuenta Google, y la API de Google Calendar puede crear eventos con `conferenceData.createRequest` que provee un enlace `hangoutsMeet` gratuito y robusto.

### Decisión

- Se desinstala `@jitsi/react-sdk`.
- La llamada de video se crea como evento de Google Calendar usando `GoogleCalendarService::createMeetEvent()`.
- El campo `appointments.meeting_url` almacena el `hangoutLink` devuelto por la API.
- Se añade `appointments.external_calendar_event_id` para poder actualizar/cancelar el evento Meet.
- `call/room.tsx` abre `meeting_url` en nueva pestaña; el panel lateral en ClientKosmos mantiene transcripción en vivo y botón "Finalizar".
- OAuth scope requerido: `https://www.googleapis.com/auth/calendar.events`.
- `users.google_refresh_token` ya existe en el esquema y se almacena cifrado (`encrypted` cast).

### Consecuencias

**Positivas** — Sin infra de video que operar; UX móvil excelente; integración nativa con Calendar del profesional.  
**Negativas** — Dependencia de disponibilidad de Google Meet; no podemos embeber el video dentro de la app (trade-off aceptado en MVP).  
**Deuda** — Post-MVP: evaluar embed con `<iframe>` condicional. Si Google retira la API pública de conferencias, migrar a Daily.co o Whereby.

---

## ADR-0011 — Almacenamiento local cifrado (Drive eliminado)

- **Fecha:** 2026-04-24
- **Estado:** Aceptado

### Contexto

Los archivos de salud (consentimientos, facturas, notas exportadas) son datos de categoría especial RGPD Art. 9. Google Drive no garantiza al responsable del tratamiento control granular sobre accesos, retención y borrado, impidiendo cumplir Art. 32.

### Decisión

- Se usa disco `private` de Laravel (`storage/app/private/`, permisos `0600`) para todos los documentos sensibles.
- `DocumentCipherService::store()` cifra con `Crypt::encrypt()` (AES-256-CBC, `APP_KEY`) y calcula `sha256` para integridad.
- Las columnas `gdrive_*` en `documents` se marcan deprecated (nullable, sin nuevos writes).
- Las URLs temporales firmadas (`URL::temporarySignedRoute`, TTL 5 min) reemplazan los paths directos.
- Se añade `content_hash` y `encrypted` (bool) a la tabla `documents`.

### Consecuencias

**Positivas** — Cadena de custodia demostrable; cumplimiento Art. 32 RGPD; cero coste de almacenamiento externo en MVP.  
**Negativas** — Storage en el mismo servidor que la app (en MVP es aceptable; en producción → volumen dedicado o S3 con SSE).  
**Deuda** — Rotación de `APP_KEY` requiere re-cifrado de todos los documentos (script pendiente, post-MVP).

---

## ADR-0012 — Generación de PDF con barryvdh/laravel-dompdf

- **Fecha:** 2026-04-24
- **Estado:** Aceptado

### Contexto

Las facturas deben generarse en PDF cumpliendo LIVA art. 20.1.3º (IVA exento para psicólogos) y ser almacenadas en el disco `private`. Se necesita una solución PHP nativa sin dependencias de binarios externos.

### Decisión

- Se instala `barryvdh/laravel-dompdf` (wrapper Laravel de Dompdf).
- `BillingService::generatePdf(Invoice)` renderiza la vista Blade `invoices.pdf` y guarda el resultado en `storage/app/private/invoices/{id}.pdf`.
- La numeración de factura pasa de `FAC-{YEAR}-{RANDOM}` a `FAC-{YEAR}-{NNNNN}` secuencial. El número se genera dentro de una transacción con `DB::transaction()` + `lockForUpdate()` para evitar duplicados bajo concurrencia.
- Font: `dejavu-sans` para soporte correcto de caracteres con tilde.

### Consecuencias

**Positivas** — Solución madura, activamente mantenida, sin proceso externo (wkhtmltopdf, Chromium headless).  
**Negativas** — CSS soporte limitado (sin Flexbox/Grid completo); el template debe usar tablas HTML. Aceptable para facturas.  
**Deuda** — Si el profesional necesita facturas con diseño avanzado, migrar a Browsershot (Puppeteer) post-MVP.

---

## ADR-0013 — spatie/laravel-activitylog para audit log RGPD

- **Fecha:** 2026-04-24
- **Estado:** Aceptado

### Contexto

RGPD Art. 30 (registro de actividades de tratamiento) y las correcciones de auditoría interna exigen registrar quién accedió a qué entidad sensible y cuándo.

### Decisión

- Se instala `spatie/laravel-activitylog v5`.
- Modelos con log: `PatientProfile`, `Document`, `ConsentForm`, `SessionRecording`, `Invoice`.
- Eventos mínimos: `created`, `updated`, `deleted`. El evento `viewed` se añade como log manual desde los controladores `Show`.
- Los logs se guardan en la tabla `activity_log` (ya creada en Sprint 1).

### Consecuencias

**Positivas** — Trazabilidad completa de accesos a datos de salud sin escribir código de logging manual en cada modelo.  
**Negativas** — Aumenta el volumen de la tabla `activity_log` con el tiempo. Requiere job de purga periódica (post-MVP, retención 5 años).

---

## ADR-0014 — Envío de email transaccional (SMTP / Resend)

- **Fecha:** 2026-04-24
- **Estado:** Aceptado

### Contexto

El MVP debe enviar facturas y acuerdos al paciente por email después de cada sesión.

### Decisión

- En desarrollo: driver `log` (Mailpit para inspección visual).
- En producción: Resend (o Postmark como alternativa) configurado vía `MAIL_MAILER=smtp` + credenciales en `.env`.
- Las clases mailable (`InvoiceIssuedMail`, `AgreementsSentMail`, `PostSessionMail`) extienden `Mailable` de Laravel con `envelope()` + `content()` (API fluida Laravel 10+).
- Los jobs de envío (`SendInvoiceEmailJob`, `SendAgreementsEmailJob`, `SendPostSessionEmailJob`) usan la cola `default` para no bloquear la petición HTTP.

### Consecuencias

**Positivas** — Desacoplado del proveedor SMTP; cambiar a Postmark es solo cambiar la variable de entorno.  
**Negativas** — Requiere verificar el dominio del remitente en producción (SPF, DKIM). Documentar en deploy guide.

---

## ADR-0015 — Consentimiento global de grabación en el alta del paciente

- **Fecha:** 2026-04-24
- **Estado:** Aceptado

### Contexto

El MVP graba audio de cada sesión y lo procesa con IA (Whisper para transcripción + Llama 3.3 para resumen). Estos datos son categoría especial RGPD (art. 9), y la decisión automatizada con resumen IA cae además bajo art. 22. La opción inicial era pedir consentimiento en cada sesión (ver §5.3 del roadmap), pero eso introduce fricción innecesaria en la UX del paciente y puede llevar a "click fatigue" que degrade el valor probatorio del consentimiento.

### Decisión

El consentimiento para grabar las sesiones se recoge **una sola vez** en el momento del registro del paciente, junto con otros 3 consentimientos obligatorios:

1. Política de privacidad.
2. Términos del servicio.
3. Tratamiento de datos de salud (RGPD art. 9.2.h).
4. Grabación + transcripción IA (RGPD art. 22).

Los 4 son bloqueantes: sin marcar las 4 casillas el botón "Registrarse" queda deshabilitado y el alta no se completa. Cada checkbox crea un `ConsentForm` con `template_version`, `content_snapshot` (texto literal aceptado), `signed_at`, `signed_ip` y `signature_data = 'checkbox_registration'`.

En la sala de espera del paciente se muestra un **recordatorio informativo no bloqueante** del consentimiento de grabación, en cumplimiento del principio de transparencia (RGPD art. 13).

`TranscribeChunkJob` re-valida `RgpdService::hasActiveRecordingConsent()` antes de cada chunk (no solo al inicio de la llamada), lo que cubre el caso de revocación mid-session: si el paciente revoca desde su portal, los chunks siguientes se descartan y la `SessionRecording` se marca `transcription_status = 'rejected_no_consent'`.

El paciente puede revocar cualquiera de los 4 consentimientos desde **Ajustes → Perfil → Mis consentimientos**, salvo el de tratamiento de datos de salud (cuya revocación implica cierre de cuenta y se gestiona por canal de soporte).

### Consecuencias

**Positivas**
- UX limpia: el paciente no tiene que aceptar cada vez que entra en una sala.
- Trazabilidad sólida: cada consentimiento queda con su versión, IP y momento.
- Revocación granular respetando art. 7.3 RGPD.
- La validación per-chunk en `TranscribeChunkJob` cubre el escenario de revocación durante la sesión sin perder datos antes del consentimiento.

**Negativas**
- Si la plantilla legal cambia, hay que invalidar consentimientos antiguos y pedir re-firma — gestionado vía `template_version` pero requiere proceso operativo cuando ocurra.
- Un paciente que revoque el consentimiento de tratamiento de datos de salud debe pasar por cierre de cuenta, lo que genera fricción que conviene comunicar al alta.
