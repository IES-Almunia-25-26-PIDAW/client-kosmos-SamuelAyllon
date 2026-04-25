# Declaración de Uso de IA

Registro transparente del uso de herramientas de IA en el desarrollo de ClientKosmos. Cada PR asistido por IA debe añadir una entrada. Formato definido en [`.claude/documentation.md`](../.claude/documentation.md).

## Herramientas en uso

| Herramienta | Propósito | Ámbito |
|-------------|-----------|--------|
| Claude Code (Opus 4.7) | Orquestación de desarrollo, generación/refactor/revisión de código, docs | Todo el proyecto |
| Laravel Boost MCP | Búsqueda de documentación versionada, acceso a schema y logs | Backend Laravel |
| Chakra UI MCP | Consulta de tokens, recetas y componentes Chakra | Frontend (UI) |

## Principios

1. **Revisión humana obligatoria** de todo output de IA antes de merge.
2. **Sin datos sensibles en prompts.** Ningún secreto, dato personal real o información confidencial se envía a la IA.
3. **Trazabilidad:** cada PR asistido documenta alcance IA vs. humano.
4. **Responsabilidad:** el autor del PR firma el código — la IA es asistente, no autor legal.

---

## Entradas

### Kick-off — Adopción de estándares Kosmos

- **Fecha:** 2026-04-20
- **Herramientas:** Claude Code (Opus 4.7), Laravel Boost MCP
- **Alcance IA:** generación inicial de `CLAUDE.md`, `.claude/*.md`, `docs/decision-log.md`, este archivo
- **Revisión humana:** pendiente — Samuel Ayllón revisará y ajustará
- **Prompt(s) relevantes:** "Actúa como un Lead Software Architect y QA Manager… configura el sistema de instrucciones de la IA para cumplir Criterios de Excelencia (Docs, Clean Code/DB, Escudo, DevOps, Frontend/A11y + Protocolo de Ejecución)"
- **Relación con ADR:** ADR-0001

### Fase 2 de migración Chakra UI — compuestos UI

- **Fecha:** 2026-04-20
- **Herramientas:** Claude Code (Opus 4.7), Chakra UI MCP (`get_component_example` para `dialog`), Explore subagent (inventario de estado de migración)
- **Alcance IA:** reescritura de [resources/js/components/ui/dialog.tsx](../resources/js/components/ui/dialog.tsx), [alert-dialog.tsx](../resources/js/components/ui/alert-dialog.tsx), [select.tsx](../resources/js/components/ui/select.tsx), [navigation-menu.tsx](../resources/js/components/ui/navigation-menu.tsx), [input-otp.tsx](../resources/js/components/ui/input-otp.tsx), [status-badge.tsx](../resources/js/components/ui/status-badge.tsx). API pública preservada; consumidores (`two-factor-setup-modal.tsx`, `delete-user.tsx`) no requieren cambios.
- **Revisión humana:** pendiente — verificar visualmente en navegador (Dialog, InputOTP en flujo 2FA, StatusBadge en listas de facturas) y auditar accesibilidad con teclado.
- **Prompt(s) relevantes:** "Continua con la transición de Tailwindcss a chakra usando su mpc y la guía de estilos que se creó: Siguiente fase sugerida: compuestos UI (dialog, alert-dialog, select, breadcrumb, navigation-menu, input-otp, status-badge)."
- **Relación con ADR:** ADR-0002

### Fase 3a — Validación visual + corrección sistémica `type="submit"`

- **Fecha:** 2026-04-20
- **Herramientas:** Claude Code (Opus 4.7), Laravel Boost MCP (`browser-logs`, `get-absolute-url`), Explore subagent (auditoría de botones en formularios)
- **Alcance IA:** validación interactiva del Dialog (settings/delete-user) y confirmación de contraseña (Fortify); detección y corrección del bug sistémico `type="submit"` en botones Chakra dentro de formularios Inertia v2. Archivos modificados: [`delete-user.tsx`](../resources/js/components/delete-user.tsx), [`confirm-password.tsx`](../resources/js/pages/auth/confirm-password.tsx), [`forgot-password.tsx`](../resources/js/pages/auth/forgot-password.tsx), [`settings/password.tsx`](../resources/js/pages/settings/password.tsx), [`settings/profile.tsx`](../resources/js/pages/settings/profile.tsx).
- **Revisión humana:** Samuel Ayllón validó manualmente Dialog + confirm-password en navegador. Resto del checklist (2FA InputOTP, Select, AlertDialog, NavigationMenu, StatusBadge, Sidebar) queda pendiente.
- **Relación con ADR:** ADR-0003

### Fase 3a — Migración de componentes ligeros a Chakra UI v3

- **Fecha:** 2026-04-21
- **Herramientas:** Claude Code (Opus 4.7), Explore subagent (inventario de Tailwind residual), Plan mode
- **Alcance IA:** reescritura de [`resources/js/components/input-error.tsx`](../resources/js/components/input-error.tsx), [`user-info.tsx`](../resources/js/components/user-info.tsx) y [`text-link.tsx`](../resources/js/components/text-link.tsx) eliminando `cn()` y clases Tailwind/`dark:`. Se usan primitivos Chakra (`Text`, `Box`, `chakra(Link)`) y tokens semánticos ya existentes (`danger.fg`, `fg.muted`, `border.subtle`). API pública preservada; consumidores no requieren cambios.
- **Revisión humana:** pendiente — Samuel Ayllón debe validar visualmente mensajes de error en `/login`, hover/focus de `TextLink` en auth, y render del `UserInfo` en el menú de usuario del sidebar (light + dark).
- **Prompt(s) relevantes:** "revisa el archivo @docs/decision-log.md y continuemos con la transición de tailwindcss a chakra".
- **Relación con ADR:** ADR-0004

### Fase 3b — Migración de componentes medianos a Chakra UI v3

- **Fecha:** 2026-04-21
- **Herramientas:** Claude Code (Opus 4.7), Explore subagent (auditoría de candidatos), Plan mode, AskUserQuestion (confirmación de paleta para `password-strength`).
- **Alcance IA:** reescritura de [`nav-footer.tsx`](../resources/js/components/nav-footer.tsx), [`empty-state.tsx`](../resources/js/components/empty-state.tsx), [`appearance-tabs.tsx`](../resources/js/components/appearance-tabs.tsx), [`password-strength.tsx`](../resources/js/components/password-strength.tsx) y [`delete-user.tsx`](../resources/js/components/delete-user.tsx). Se eliminan `className` Tailwind, `cn()`, modificadores `dark:` y variables CSS ad-hoc de `empty-state`. Todo reemplazado por primitivos Chakra (`Flex`, `Box`, `SimpleGrid`, `Circle`, `Stack`, `HStack`, `chakra('button'|'a')`) y tokens semánticos existentes (`danger.*`, `warning.*`, `success.*`, `info.*`, `orange.*`, `brand.*`, `bg.muted`, `fg.muted`). Cero tokens nuevos. API pública preservada en los 5 componentes (11 consumidores sin cambios).
- **Decisión humana registrada:** mantener 5 colores distintos en las barras de `password-strength` (danger → orange → warning → info → success) para preservar granularidad visual del feedback UX.
- **Revisión humana:** pendiente — validar `/settings/profile` (delete-user dialog + warning banner), `/settings/appearance` (tabs seleccionados + hover + focus ring), `/register` (barras y lista de reglas de password-strength), sidebar abierto/colapsado (nav-footer), y cualquier página con estado vacío (empty-state). Light + dark.
- **Prompt(s) relevantes:** "revisa el archivo @docs/decision-log.md y continuemos con la transición de tailwindcss a chakra".
- **Relación con ADR:** ADR-0005

### Batch C — Migración de páginas de dashboard a Chakra UI v3

- **Fecha:** 2026-04-21
- **Herramientas:** Claude Code (Sonnet 4.6)
- **Alcance IA:** reescritura de [`resources/js/pages/dashboard.tsx`](../resources/js/pages/dashboard.tsx), [`dashboard/professional.tsx`](../resources/js/pages/dashboard/professional.tsx) y [`dashboard/patient.tsx`](../resources/js/pages/dashboard/patient.tsx). Eliminadas todas las clases Tailwind con variables CSS ad-hoc (`var(--color-*)`, `text-kpi`, `text-display-*`), condicionales `join(' ')` y el Record `invoiceStatusClass`. Reemplazados por primitivos Chakra (`Stack`, `Grid`, `Flex`, `Box`, `Text`, `Heading`, `Badge`) con tokens semánticos existentes. `Badge` importado directamente de `@chakra-ui/react` con `colorPalette` para píldoras de estado/modalidad. Botones de acción migrados a `Button asChild` + `ChakraLink`. Se añade ADR-0007 al decision-log.
- **Revisión humana:** pendiente — validar dashboard profesional (agenda del día, KPI cards, cobros pendientes) y dashboard paciente (KPI stats row, próximas citas, facturas recientes). Light + dark.
- **Prompt(s) relevantes:** "continua Batch C — Migrate dashboard pages"
- **Relación con ADR:** ADR-0007
