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

### Cierre del flujo Post-Sesión + RGPD art. 9 hardening

- **Fecha:** 2026-04-30
- **Herramientas:** Claude Code (Opus 4.7), Explore subagent (auditoría inicial), Plan mode (plan en `docs/post-session-plan.md`).
- **Alcance IA:** auditoría arquitectónica del flujo post-sesión (grabación → Whisper → resumen → hub → factura) e implementación de los 4 cierres detectados:
    1. **Cifrado at-rest de chunks** — `Crypt::encryptString()` en [`TranscribeAction`](../app/Http/Controllers/Appointment/TranscribeAction.php) y `Crypt::decryptString()` simétrico en [`TranscribeChunkJob`](../app/Jobs/TranscribeChunkJob.php). Extensión `.enc`.
    2. **Listener `AggregateTranscription`** ([nuevo](../app/Listeners/AggregateTranscription.php)) — engancha al evento existente `TranscriptionSegmentCreated` y reescribe `session_recordings.transcription` concatenando segmentos ordenados. Registrado en [`AppServiceProvider`](../app/Providers/AppServiceProvider.php).
    3. **Cierre del stub `SummarizeAction`** — despacha `SummarizeSessionJob` cuando hay transcripción agregada; devuelve `409 transcription_pending` en otro caso.
    4. **Middleware `LogTranscriptionAccess`** ([nuevo](../app/Http/Middleware/LogTranscriptionAccess.php)) — registra accesos a invoices y documents en `activity_log` (RGPD art. 30). Aliasado como `rgpd.access_log` en [`bootstrap/app.php`](../bootstrap/app.php).
    5. **Command `purge:expired-session-data`** ([nuevo](../app/Console/Commands/PurgeExpiredSessionData.php)) — purga PDFs caducados, transcripciones revocadas y audit logs antiguos. Programado en [`routes/console.php`](../routes/console.php) a las 03:15 diario.
    6. **Log de chunks rechazados** — `TranscribeChunkJob` registra `chunk_rejected_no_consent` en `activity_log` cuando se descarta un chunk por revocación de consentimiento.
- **Tests añadidos:** `AggregateTranscriptionTest`, `SummarizeActionTest`, y nuevo caso "stores chunk encrypted on disk" en `TranscribeActionTest`. Tests existentes (`TranscribeChunkJobTest`, `TranscribeChunkConsentTest`) actualizados para cifrar chunks en setup. Suite completa: 243 passed.
- **Gate ejecutado:** ✅ Pint, ✅ Pest (243 passed), ✅ ESLint, ✅ tsc --noEmit, ✅ Vite build.
- **Revisión humana:** pendiente — validar (a) UAT con sesión real: chunk encriptado en disco; (b) UI post-session muestra Skeleton mientras `summary_status='pending'`; (c) `purge:expired-session-data --dry-run` reporta correctamente; (d) entrada en `activity_log` al descargar una factura.
- **Prompt(s) relevantes:** "Comprueba si el requisito está implementado de verdad: …grabación, transcripción, resumen, factura, RGPD…", "diseña un plan separando las tareas en pasos pequeños…", "ejecuta el plan".
- **Relación con ADR:** ADR-0018 (relacionado con ADR-0008, ADR-0013, ADR-0015).

### Integración Stripe (test mode) — pasarela de cobro de facturas

- **Fecha:** 2026-04-30
- **Herramientas:** Claude Code (Opus 4.7), Plan mode
- **Alcance IA:** ejecución del plan [`docs/stripe-integration-plan.md`](stripe-integration-plan.md) en rama `feat/stripe-integration`, una tarea por commit con gate completo (Pint, Pest, lint, types, build) entre cada uno:
    1. **SDK + contrato** (`b2d85db`) — `composer require stripe/stripe-php`, `App\Contracts\PaymentGateway` interface, `App\Services\Payments\StripeGateway` (createCheckoutSession + verifyWebhookSignature), binding en `AppServiceProvider`, env vars `STRIPE_KEY/SECRET/WEBHOOK_SECRET`, namespace `services.stripe`.
    2. **Endpoint + webhook + UI** (`65c3cd2`) — `Invoice\CreateCheckoutAction` (single-action, autoriza vía `PaymentPolicy::pay`, devuelve `Inertia::location` a Stripe Checkout), `Webhook\StripeWebhookAction` (verifica firma, `BillingService::markAsPaid($invoice, 'stripe')` en `checkout.session.completed`, persiste `stripe_payment_id`), migración aditiva `stripe_checkout_session_id` (string nullable + índice), CSRF excluido para `/webhooks/stripe`, botón Chakra v3 "Cobrar con Stripe" en [`review.tsx`](../resources/js/pages/professional/invoices/review.tsx) y badge "Stripe pendiente" en [`index.tsx`](../resources/js/pages/professional/invoices/index.tsx).
    3. **Tests** (`55e15df`) — `Tests\Support\FakeStripeGateway` (implementa el contrato sin red; `Util::convertToStripeObject` para parsear payload), fixture JSON `checkout-session-completed.json`, `StripeCheckoutTest` (5 tests: autorización, denegación de paid/draft/intruso/guest), `StripeWebhookTest` (5 tests: firma válida marca paid, firma inválida 400, idempotencia, invoice no encontrada, event types desconocidos).
- **Tests añadidos:** 10 nuevos (suite total: 253 passed, 1087 assertions). Sin mockear DB — feedback memory respetado: el gateway es lo único stubbed, el resto contra DB real.
- **Gate ejecutado:** ✅ Pint, ✅ Pest (253 passed), ✅ ESLint, ✅ tsc --noEmit, ✅ Vite build (suite completa requiere `php -d memory_limit=1G` por límite global pre-existente, no relacionado con estos cambios).
- **Revisión humana:** pendiente — Samuel Ayllón debe (a) configurar `sk_test_*` y `whsec_*` reales en `.env`; (b) UAT manual con `stripe listen --forward-to localhost:8000/webhooks/stripe` y tarjeta `4242 4242 4242 4242`; (c) abrir PR a `main`.
- **Prompt(s) relevantes:** "ejecuta @docs/stripe-integration-plan.md".
- **Relación con ADR:** ADR-0019.

### Adopción de Vitest + Testing Library — paso 1 del cierre de deuda de testing frontend

- **Fecha:** 2026-05-02
- **Herramientas:** Claude Code (Opus 4.7), Plan mode (plan en [`C:\Users\xamue\.claude\plans\rol-arquitecto-senior-zippy-goose.md`](../../.claude/plans/rol-arquitecto-senior-zippy-goose.md)), Explore subagent (auditoría inicial + scope de Vitest setup).
- **Alcance IA:** auditoría estricta de cobertura de testing y trazabilidad de requisitos (veredicto, evidencias, brechas, riesgos, siguiente paso) e implementación del **paso 1** del plan resultante:
    1. **Scaffolding de Vitest 2** + `@testing-library/react@16` + `@testing-library/jest-dom@6` + `@testing-library/user-event@14` + `jsdom@25` + `@vitest/ui@2` (devDeps).
    2. [vitest.config.ts](../vitest.config.ts) — `environment: 'jsdom'`, alias `@`, `setupFiles`, `define: { 'process.env.NODE_ENV': '"development"' }` y `conditions: ['development', 'browser']` para que React 19 + RTL 16 pueda usar `React.act`.
    3. [resources/js/test/setup.ts](../resources/js/test/setup.ts) — importa `jest-dom/vitest`, `cleanup` post-test, polyfills de `matchMedia`/`ResizeObserver`/`IntersectionObserver`.
    4. [resources/js/test/render.tsx](../resources/js/test/render.tsx) — helper `renderWithChakra` que envuelve con `ChakraProvider value={system}` desde [`chakra-system.ts`](../resources/js/lib/chakra-system.ts).
    5. **4 archivos de test** co-locados (18 tests verdes) con tag `[RF-XX]`/`[RNF-XX]` en `it(...)` para trazabilidad code-visible: [`recording-indicator.test.tsx`](../resources/js/components/recording-indicator.test.tsx), [`use-countdown.test.ts`](../resources/js/hooks/use-countdown.test.ts), [`join-call-button.test.tsx`](../resources/js/components/join-call-button.test.tsx), [`use-professional-tab-recorder.test.ts`](../resources/js/hooks/use-professional-tab-recorder.test.ts).
    6. [package.json](../package.json) scripts `test`, `test:watch`, `test:ui`. [tsconfig.json](../tsconfig.json) `types: ["vitest/globals", "@testing-library/jest-dom"]`.
    7. [.github/workflows/tests.yml](../.github/workflows/tests.yml) step `Frontend Tests (Vitest)` ejecutando `npm run test` tras `Build Assets`.
    8. [CLAUDE.md §7](../CLAUDE.md) gate de pre-cierre incorpora `npm run test`.
    9. [docs/test-traceability.md](test-traceability.md) — `RNF-Q06` pasa de ❌ a 🟡; añadida sección 3.b con la tabla de tests frontend; cabecera y registro de resultados actualizados.
- **Tests añadidos:** 18 frontend (4 archivos). Backend sigue en 264 verdes. Total: 282.
- **Gate ejecutado:** ✅ `npm run test` (18/18), ✅ `npm run types`, ✅ `npm run lint`. Pendiente UAT manual: ejecutar el job nuevo en CI tras push.
- **Revisión humana:** pendiente — Samuel Ayllón debe (a) revisar la convención de mocks (especialmente `vi.hoisted` y los fakes de `MediaRecorder`); (b) confirmar que el job CI `Frontend Tests (Vitest)` corre verde en GitHub Actions; (c) abrir PR.
- **Prompt(s) relevantes:** "Comprueba si esto está realmente implementado…" (auditoría), "ve de uno en uno" (ejecución del paso 1 del plan).
- **Relación con ADR:** ADR-0022.

### Audit log assertions (paso 2 del cierre de deuda de testing)

- **Fecha:** 2026-05-02
- **Herramientas:** Claude Code (Opus 4.7), Explore subagent (mapa de entradas activity_log + traits + cobertura existente).
- **Alcance IA:** cierre de la deuda "Audit log activo: ❌ sin test directo" detectada en la auditoría. Se añadieron aserciones reales sobre `activity_log` en los flujos clínicos / RGPD críticos:
    1. **Helpers reutilizables** en [tests/Pest.php](../tests/Pest.php): `assertActivityLogged(array $filter)` y `assertActivityLoggedFor(Model $subject, string $description)`.
    2. **TranscribeChunkConsentTest** ([tests/Feature/Security/TranscribeChunkConsentTest.php](../tests/Feature/Security/TranscribeChunkConsentTest.php)) — verifica `event=chunk_rejected_no_consent`, `log_name=rgpd_access`, `causer_id`, `properties.position` cuando el job descarta un chunk por revocación o ausencia de consentimiento (RNF-09).
    3. **ConsentRevokeTest** ([tests/Feature/Sprint3/ConsentRevokeTest.php](../tests/Feature/Sprint3/ConsentRevokeTest.php)) — verifica que la revocación queda en activity_log vía el trait `LogsActivity` de `ConsentForm` (RNF-10).
    4. **FinalizeAndNotifyTest** ([tests/Feature/Sprint3/FinalizeAndNotifyTest.php](../tests/Feature/Sprint3/FinalizeAndNotifyTest.php)) — verifica que la transición `Invoice` `draft → sent` queda registrada (RF-15).
    5. **RecordingConsentTest** ([tests/Feature/Portal/RecordingConsentTest.php](../tests/Feature/Portal/RecordingConsentTest.php)) — verifica que la creación de `SessionRecording` con consentimiento queda en activity_log (RNF-08).
    6. **TranscriptionAccessLogTest** ([tests/Feature/Security/TranscriptionAccessLogTest.php](../tests/Feature/Security/TranscriptionAccessLogTest.php), nuevo) — 3 tests específicos del middleware `rgpd.access_log`: `invoice.show`, `invoice.download` y ausencia de log si no hay usuario autenticado.
- **Bugs detectados (no fijados, fuera de scope):**
    1. **`LogTranscriptionAccess::resolveSubjectId()` devuelve siempre `null`** cuando la ruta usa route-model binding de Eloquent: `property_exists($model, 'id')` es `false` en modelos Eloquent (id es un atributo mágico). Pendiente fix; documentado como deuda en [docs/test-traceability.md](test-traceability.md) §6.2.bis.
    2. **`ProfessionalProfile` no usa el trait `LogsActivity`** — la aprobación de profesional (ADR-0021) **no queda en `activity_log`**. Documentado como deuda.
- **Tests añadidos:** 3 nuevos en `TranscriptionAccessLogTest` + 4 aserciones añadidas a tests existentes. Backend: 292 verdes (antes 264 según auditoría — la diferencia incluye tests añadidos en otras tareas durante la sesión, todos verdes).
- **Gate ejecutado:** ✅ `vendor/bin/pest --compact` (292/292, 1245 aserciones). Sin tocar frontend (sigue 18/18).
- **Revisión humana:** pendiente — Samuel Ayllón debe (a) decidir si añadir `LogsActivity` a `ProfessionalProfile` o loggear explícitamente desde la action; (b) priorizar el fix del bug de `resolveSubjectId`; (c) abrir PR.
- **Prompt(s) relevantes:** "ve de uno en uno" → "si" (continuar al paso 2 del plan global).
- **Relación con ADR:** sin nuevo ADR (cambios en tests + helpers, no cambios arquitectónicos). Trazabilidad cruzada con ADR-0018, ADR-0019, ADR-0020, ADR-0021.
