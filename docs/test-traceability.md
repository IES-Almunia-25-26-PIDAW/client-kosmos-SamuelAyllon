# Matriz de trazabilidad — Requisito ↔ Prueba ↔ Resultado

> Documento vivo. Enlaza cada requisito formal del MVP con los tests Pest que lo validan.
> Las rutas a tests usan el formato `archivo::nombre del test`.
>
> **Última actualización:** 2026-05-02
> **Stack de pruebas:** Pest 3 / PHPUnit 11 (suites `Unit` + `Feature`) + Vitest 2 / @testing-library/react 16 (frontend, ADR-0022).
> **Total tests verdes hoy:** 292 backend (1.245 aserciones) + 18 frontend (4 archivos) — ver `junit.xml` publicado por CI como artifact `test-reports`.

---

## Convención de IDs

- `RF-XX` — Requisito Funcional (extraído de [mvp-roadmap.md §3](mvp-roadmap.md) y §6 Definition of Done).
- `RNF-XX` — Requisito No Funcional (seguridad, RGPD, calidad).
- `S{n}.{m}` — Tarea de sprint según [mvp-roadmap.md §7](mvp-roadmap.md).

Estados: ✅ cubierto · 🟡 cubierto parcialmente · ❌ sin test directo.

---

## 1. Requisitos funcionales — Flujo end-to-end

| ID | Requisito | Sprint | Test(s) | Estado |
|---|---|---|---|---|
| RF-01 | Profesional puede iniciar sesión y es redirigido según rol | — | [tests/Feature/AuthControllerTest.php](../tests/Feature/AuthControllerTest.php) · [tests/Feature/Auth/AuthenticationTest.php](../tests/Feature/Auth/AuthenticationTest.php) | ✅ |
| RF-02 | Profesional sin tutorial completo va a onboarding | — | `AuthControllerTest::it('professional without completed tutorial is redirected to onboarding')` | ✅ |
| RF-03 | Admin tiene acceso aislado al panel `/admin/*` | — | [tests/Feature/AdminControllerTest.php](../tests/Feature/AdminControllerTest.php) | ✅ |
| RF-04 | Profesional configura disponibilidad horaria | — | [tests/Feature/Schedule/Availability/StoreActionTest.php](../tests/Feature/Schedule/Availability/StoreActionTest.php) · [tests/Feature/Schedule/IndexActionTest.php](../tests/Feature/Schedule/IndexActionTest.php) | ✅ |
| RF-05 | Paciente reserva cita desde el portal público del profesional | — | [tests/Feature/Portal/Appointment/AppointmentBookingTest.php](../tests/Feature/Portal/Appointment/AppointmentBookingTest.php) · [tests/Feature/Portal/Appointment/FirstBookingLinksPatientTest.php](../tests/Feature/Portal/Appointment/FirstBookingLinksPatientTest.php) | ✅ |
| RF-06 | Catálogo de consultas ofertadas (CRUD) | — | [tests/Feature/OfferedConsultations/CrudTest.php](../tests/Feature/OfferedConsultations/CrudTest.php) | ✅ |
| RF-07 | Paciente queda enlazado al profesional en su primera reserva | — | `FirstBookingLinksPatientTest` | ✅ |
| RF-08 | Profesional gestiona pacientes (CRUD + ownership) | — | [tests/Feature/PatientControllerTest.php](../tests/Feature/PatientControllerTest.php) · [tests/Feature/Patient/CreateOrUpdateProfessionalPatientTest.php](../tests/Feature/Patient/CreateOrUpdateProfessionalPatientTest.php) | ✅ |
| RF-09 | Sala de espera de la cita (paciente y profesional) | S2.3 | [tests/Feature/Appointment/WaitingRoomTest.php](../tests/Feature/Appointment/WaitingRoomTest.php) · [tests/Feature/Call/ShowRoomActionTest.php](../tests/Feature/Call/ShowRoomActionTest.php) | ✅ |
| RF-10 | Ventana de unión de ±10 min al inicio de la cita | S2.2 | [tests/Feature/Sprint2/JoinWindowTest.php](../tests/Feature/Sprint2/JoinWindowTest.php) | ✅ |
| RF-11 | Autorización de canal Reverb por cita | S2.4 | [tests/Feature/Appointment/AppointmentChannelAuthTest.php](../tests/Feature/Appointment/AppointmentChannelAuthTest.php) | ✅ |
| RF-12 | Transcripción por chunks (action + job) | S2.5 | [tests/Feature/Appointment/TranscribeActionTest.php](../tests/Feature/Appointment/TranscribeActionTest.php) · [tests/Feature/Appointment/TranscribeChunkJobTest.php](../tests/Feature/Appointment/TranscribeChunkJobTest.php) · [tests/Feature/Appointment/AggregateTranscriptionTest.php](../tests/Feature/Appointment/AggregateTranscriptionTest.php) | ✅ |
| RF-13 | Briefing pre-sesión generado por IA | S2.6 | [tests/Feature/Jobs/GeneratePreSessionBriefingTest.php](../tests/Feature/Jobs/GeneratePreSessionBriefingTest.php) | ✅ |
| RF-14 | Resumen IA al cerrar la sesión | S2.6 | [tests/Feature/Appointment/SummarizeActionTest.php](../tests/Feature/Appointment/SummarizeActionTest.php) | ✅ |
| RF-15 | Cierre de sesión con marca de éxito | S3.1 | [tests/Feature/Appointment/ClosingSuccessTest.php](../tests/Feature/Appointment/ClosingSuccessTest.php) · [tests/Feature/Sprint3/FinalizeAndNotifyTest.php](../tests/Feature/Sprint3/FinalizeAndNotifyTest.php) | ✅ |
| RF-16 | Cancelación / borrado de cita | — | [tests/Feature/Appointment/DestroyActionTest.php](../tests/Feature/Appointment/DestroyActionTest.php) | ✅ |
| RF-17 | Vista post-sesión del paciente con consentimiento de grabación | S3.3 | [tests/Feature/Portal/AppointmentPostSessionTest.php](../tests/Feature/Portal/AppointmentPostSessionTest.php) · [tests/Feature/Portal/RecordingConsentTest.php](../tests/Feature/Portal/RecordingConsentTest.php) | ✅ |
| RF-18 | Listado de profesionales en el portal | — | [tests/Feature/Portal/ProfessionalIndexTest.php](../tests/Feature/Portal/ProfessionalIndexTest.php) | ✅ |
| RF-19 | Dashboard del profesional con métricas | — | [tests/Feature/DashboardTest.php](../tests/Feature/DashboardTest.php) | ✅ |
| RF-20 | Asistente Kosmo (briefings y chat) | — | [tests/Feature/KosmoControllerTest.php](../tests/Feature/KosmoControllerTest.php) | ✅ |
| RF-21 | Workspace del profesional con datos aislados | — | [tests/Feature/WorkspaceTest.php](../tests/Feature/WorkspaceTest.php) | ✅ |
| RF-22 | Panel de facturación con filtros y aislamiento | S2.8 | [tests/Feature/BillingControllerTest.php](../tests/Feature/BillingControllerTest.php) · [tests/Feature/Sprint2/BillingTest.php](../tests/Feature/Sprint2/BillingTest.php) | ✅ |
| RF-23 | Generación automática de factura al completar la cita (ADR-0020) | — | [tests/Feature/Billing/AutoGenerateInvoiceOnCompletionTest.php](../tests/Feature/Billing/AutoGenerateInvoiceOnCompletionTest.php) | ✅ |
| RF-24 | Edición de factura | — | [tests/Feature/Invoice/EditInvoiceTest.php](../tests/Feature/Invoice/EditInvoiceTest.php) | ✅ |
| RF-25 | Cobro online vía Stripe Checkout (ADR-0019) | post-MVP | [tests/Feature/StripeCheckoutTest.php](../tests/Feature/StripeCheckoutTest.php) | ✅ |
| RF-26 | Webhook de Stripe procesa eventos `checkout.session.completed` | post-MVP | [tests/Feature/StripeWebhookTest.php](../tests/Feature/StripeWebhookTest.php) | ✅ |
| RF-27 | Ajustes de perfil (datos personales, eliminación de cuenta) | — | [tests/Feature/Settings/ProfileUpdateTest.php](../tests/Feature/Settings/ProfileUpdateTest.php) · [tests/Feature/SettingsControllerTest.php](../tests/Feature/SettingsControllerTest.php) | ✅ |
| RF-28 | Cambio de contraseña | — | [tests/Feature/Settings/PasswordUpdateTest.php](../tests/Feature/Settings/PasswordUpdateTest.php) | ✅ |
| RF-29 | Job de limpieza de chunks de audio (TTL 24 h) | S1.6 / S3 | [tests/Feature/Sprint3/CleanupAudioChunksTest.php](../tests/Feature/Sprint3/CleanupAudioChunksTest.php) | ✅ |
| RF-30 | URL firmada con TTL para documentos del paciente | S3 | [tests/Feature/Sprint3/SignedDocumentUrlTest.php](../tests/Feature/Sprint3/SignedDocumentUrlTest.php) | ✅ |

---

## 2. Requisitos no funcionales — Seguridad y RGPD

| ID | Requisito | Sprint | Test(s) | Estado |
|---|---|---|---|---|
| RNF-01 | Registro con verificación de email obligatoria | — | [tests/Feature/Auth/RegistrationTest.php](../tests/Feature/Auth/RegistrationTest.php) · [tests/Feature/Auth/EmailVerificationTest.php](../tests/Feature/Auth/EmailVerificationTest.php) | ✅ |
| RNF-02 | Reset de contraseña por email | — | [tests/Feature/Auth/PasswordResetTest.php](../tests/Feature/Auth/PasswordResetTest.php) | ✅ |
| RNF-03 | Confirmación de contraseña antes de acciones sensibles | — | [tests/Feature/Auth/PasswordConfirmationTest.php](../tests/Feature/Auth/PasswordConfirmationTest.php) | ✅ |
| RNF-04 | Autenticación de dos factores (TOTP) | — | [tests/Feature/Auth/TwoFactorChallengeTest.php](../tests/Feature/Auth/TwoFactorChallengeTest.php) · [tests/Feature/Settings/TwoFactorAuthenticationTest.php](../tests/Feature/Settings/TwoFactorAuthenticationTest.php) | ✅ |
| RNF-05 | Reenvío de notificación de verificación | — | [tests/Feature/Auth/VerificationNotificationTest.php](../tests/Feature/Auth/VerificationNotificationTest.php) | ✅ |
| RNF-06 | Aislamiento de datos por ownership (Policies) | S1.5 | [tests/Feature/Security/PolicyTest.php](../tests/Feature/Security/PolicyTest.php) | ✅ |
| RNF-07 | Cifrado en reposo de campos clínicos sensibles (encrypted casts) | S1.2 | [tests/Feature/Security/EncryptedCastsTest.php](../tests/Feature/Security/EncryptedCastsTest.php) | ✅ |
| RNF-08 | Consentimiento RGPD válido en registro | S1.8 | [tests/Feature/Security/RgpdConsentTest.php](../tests/Feature/Security/RgpdConsentTest.php) | ✅ |
| RNF-09 | Bloqueo de transcripción si no hay consentimiento activo | S1.4 | [tests/Feature/Security/TranscribeChunkConsentTest.php](../tests/Feature/Security/TranscribeChunkConsentTest.php) | ✅ |
| RNF-10 | Revocación de consentimiento corta el flujo de transcripción | S1.4 | [tests/Feature/Sprint3/ConsentRevokeTest.php](../tests/Feature/Sprint3/ConsentRevokeTest.php) | ✅ |
| RNF-11 | Rate limit en endpoint de transcripción (`throttle:30,1`) | S3 | [tests/Feature/Sprint3/TranscribeRateLimitTest.php](../tests/Feature/Sprint3/TranscribeRateLimitTest.php) | ✅ |

---

## 3. Requisitos no funcionales — Calidad / CI

| ID | Requisito | Cómo se valida | Estado |
|---|---|---|---|
| RNF-Q01 | Gate local: pint, pest, lint, types, build | Hooks locales + sección 7 de [CLAUDE.md](../CLAUDE.md) | ✅ documentado |
| RNF-Q02 | CI verde en `main` antes de merge | [.github/workflows/tests.yml](../.github/workflows/tests.yml) · [.github/workflows/lint.yml](../.github/workflows/lint.yml) | ✅ |
| RNF-Q03 | Cobertura de código mínima por commit | `pest --coverage --min=60` en CI · artifact `test-reports` (clover + JUnit) | ✅ activado 2026-05-01 |
| RNF-Q04 | Análisis estático Larastan | `composer analyse` en CI | ✅ |
| RNF-Q05 | Tests unitarios reales de lógica pura | [tests/Unit/](../tests/Unit/) | ❌ solo `ExampleTest.php` — deuda explícita |
| RNF-Q06 | Tests de frontend (componentes, hooks, formularios Inertia) | Vitest 2 + @testing-library/react 16 (ADR-0022). Suite en [resources/js/**/*.test.{ts,tsx}](../resources/js/) — 18 tests verdes en 4 archivos. Pendiente: booking form pública, más componentes Chakra y subir cobertura mínima en CI. | 🟡 |

---

## 3.b Tests de frontend (Vitest, ADR-0022)

| Unidad | Archivo de test | Requisito | Estado |
|---|---|---|---|
| `RecordingIndicator` | [resources/js/components/recording-indicator.test.tsx](../resources/js/components/recording-indicator.test.tsx) | RF-12 | ✅ 2 tests |
| `useCountdown` | [resources/js/hooks/use-countdown.test.ts](../resources/js/hooks/use-countdown.test.ts) | RF-10 | ✅ 5 tests |
| `JoinCallButton` | [resources/js/components/join-call-button.test.tsx](../resources/js/components/join-call-button.test.tsx) | RF-09 | ✅ 5 tests |
| `useProfessionalTabRecorder` | [resources/js/hooks/use-professional-tab-recorder.test.ts](../resources/js/hooks/use-professional-tab-recorder.test.ts) | RF-12, RNF-09 | ✅ 6 tests |

Convención: nombres de test con tag `[RF-XX]` o `[RNF-XX]` para que la trazabilidad sea grep-eable.

---

## 4. Cobertura por Definition of Done del MVP

Mapa contra el checklist de [mvp-roadmap.md §6](mvp-roadmap.md):

### 6.1 Funcionalidad
- Flujo end-to-end: ✅ cubierto por RF-04 → RF-17.
- Resumen IA en <30 s: 🟡 hay test del job (`SummarizeActionTest`); el SLA temporal no se verifica por test.
- Factura PDF cumple LIVA: 🟡 hay test de generación (`AutoGenerateInvoiceOnCompletionTest`); la validación legal del PDF se hace por inspección manual.

### 6.2 Seguridad
- Encrypted casts: ✅ RNF-07.
- Validación de consentimiento en `TranscribeChunkJob`: ✅ RNF-09.
- `PaymentPolicy`: 🟡 `Security/PolicyTest` cubre policies en general; no hay test específico nominado a `PaymentPolicy`.
- Consentimientos obligatorios en reserva: ✅ RNF-08.
- Audit log activo: 🟡 cubierto en mutaciones críticas — ver § 6.2.bis abajo.

### 6.2.bis Audit log (Spatie ActivityLog) — 2026-05-02

| Flujo | Test | Aserción |
|---|---|---|
| Chunk rechazado por consentimiento revocado/inexistente | [tests/Feature/Security/TranscribeChunkConsentTest.php](../tests/Feature/Security/TranscribeChunkConsentTest.php) | `event=chunk_rejected_no_consent`, `log_name=rgpd_access`, propiedades + causer |
| Revocación de consentimiento del paciente | [tests/Feature/Sprint3/ConsentRevokeTest.php](../tests/Feature/Sprint3/ConsentRevokeTest.php) | `ConsentForm` `updated` (LogsActivity trait) |
| Auto-generación + envío de factura tras finalizar | [tests/Feature/Sprint3/FinalizeAndNotifyTest.php](../tests/Feature/Sprint3/FinalizeAndNotifyTest.php) | `Invoice` `updated` (transición draft→sent) |
| Concesión de consentimiento de grabación | [tests/Feature/Portal/RecordingConsentTest.php](../tests/Feature/Portal/RecordingConsentTest.php) | `SessionRecording` `created` |
| Acceso a factura (show/download) por middleware `rgpd.access_log` | [tests/Feature/Security/TranscriptionAccessLogTest.php](../tests/Feature/Security/TranscriptionAccessLogTest.php) | `log_name=rgpd_access`, eventos `invoice.show` / `invoice.download`, ausencia de log si no hay user |

Helpers añadidos en [tests/Pest.php](../tests/Pest.php): `assertActivityLogged(array $filter)` y `assertActivityLoggedFor(Model $subject, string $description)`.

**Deuda residual (no cubierta aún):**
- `ProfessionalProfile` no usa `LogsActivity`; la transición a `verified` (ADR-0021) **no queda en `activity_log`**. Decidir si añadir el trait al modelo o loggear explícitamente desde `Admin\Users\VerifyProfessionalAction`.
- Bug detectado durante el audit: `LogTranscriptionAccess::resolveSubjectId()` siempre devuelve `null` para rutas con route-model binding (Eloquent), porque `property_exists($model, 'id')` es `false` en modelos. Pendiente fix.
- Acceso a documentos: la ruta usa `signed`+`rgpd.access_log:document.show` pero no hay test directo. Deuda menor.

### 6.3 Calidad
- Gate local: ✅ RNF-Q01.
- Cobertura Pest happy path + edge: ✅ se observa el patrón en suites de Sprint 2 / Sprint 3.
- ADRs 0010-0014 redactados: trazado en [decision-log.md](decision-log.md), no es validable por test.
- CI verde: ✅ RNF-Q02.

---

## 5. Brechas conocidas (deuda de testing)

1. **Suite Unit vacía** — todo se prueba a nivel Feature (con DB). Acciones puras (ej. cálculo de ventana de 10 min, numeración secuencial de factura) deberían tener tests unitarios aislados.
2. **Tests de frontend parciales** — adoptado Vitest + Testing Library (ADR-0022). Cubiertos `<RecordingIndicator>`, `useCountdown`, `<JoinCallButton>`, `useProfessionalTabRecorder`. **Pendiente:** booking form pública del paciente, resto de componentes Chakra y umbral de cobertura mínima en CI.
3. **Audit log (Spatie ActivityLog)** — instalado pero sin assert directo en tests.
4. **PDF de factura** — la conformidad LIVA se verifica por revisión humana, no por test que abra el PDF y compruebe campos.
5. **Sin SLA temporales medidos en test** (resumen <30 s, etc.).

---

## 6. Cómo se registra el resultado de cada ejecución

- **CI** ([.github/workflows/tests.yml](../.github/workflows/tests.yml)) ejecuta en cada push/PR a `develop`/`main`/`master`/`workos`:
  - `pest --coverage --coverage-clover=coverage.xml --coverage-text --log-junit=junit.xml --min=60`.
  - `npm run test` (Vitest, frontend) — bloquea merge si algún test rojo.
  - Sube `test-reports` (clover + JUnit XML) como artifact (retención 30 días).
- **Local**: cada desarrollador puede regenerar los mismos artefactos con `vendor/bin/pest --coverage --log-junit=junit.xml` y `npm run test`. `coverage.xml` y `junit.xml` están en [.gitignore](../.gitignore).
- **Histórico de resultados** → la pestaña "Actions" del repo en GitHub funciona como registro auditable (commit + branch + autor + duración + outcome + artifacts).

---

## 7. Mantenimiento de este documento

- Cuando se cree un test nuevo: añadir fila a la tabla correspondiente con su ID `RF-XX` o `RNF-XX`.
- Cuando se elimine o renombre un test: actualizar el path. CI no lo detecta automáticamente.
- Cuando se añada un sprint: extender la columna `Sprint` con la nueva referencia.
- Revisión obligatoria: al cerrar cada sprint y antes de cualquier release.
