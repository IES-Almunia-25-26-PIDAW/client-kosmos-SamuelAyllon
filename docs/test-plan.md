# Plan de Pruebas — ClientKosmos

> Documento de plan y trazabilidad de pruebas del proyecto. Complementa la [sección 8 de la justificación](justificate_implementation.md#8-estrategia-de-testing) con la matriz **requisito → caso de prueba** y el procedimiento para ejecutar y archivar resultados.

**Última revisión:** 2026-05-13
**Versión de la suite:** 82 archivos · 409 casos Pest · 4 tests Vitest (medido con `./vendor/bin/pest --list-tests`).

---

## 1. Alcance y estrategia

### 1.1 Pirámide de pruebas

| Nivel | Herramienta | Ubicación | Objetivo |
|---|---|---|---|
| Unit (backend) | Pest 3 + PHPUnit 11 | [tests/Unit/](../tests/Unit/) | Lógica de dominio aislada (modelos, casts, value objects). Sin HTTP. |
| Feature (backend) | Pest 3 + RefreshDatabase | [tests/Feature/](../tests/Feature/) | Endpoints Inertia, controllers, actions, policies, jobs, listeners, webhooks Stripe. |
| Frontend | Vitest 2 + Testing Library + jsdom | `resources/js/**/*.test.{ts,tsx}` | Componentes Chakra, hooks, validadores Zod. |
| Estático | PHPStan 3 (Larastan), ESLint 9, TypeScript 5.7 | — | Tipos y reglas. |
| Estilo | Pint 1, Prettier 3 | — | Formato. |

No hay tests E2E (Playwright/Cypress) en la suite actual — decisión consciente: el coste de mantenimiento supera el valor para una app monolítica con cobertura Feature alta vía Inertia. Revisable cuando se introduzca flujo crítico que cruce dominios sin atajo HTTP.

### 1.2 Entornos

- **Local:** SQLite `:memory:` configurada en [phpunit.xml](../phpunit.xml). `BCRYPT_ROUNDS=4` para acelerar.
- **CI:** SQLite en archivo (`database/database.sqlite`) sobre GitHub Actions, PHP 8.4 + Node 22 ([.github/workflows/tests.yml](../.github/workflows/tests.yml)).
- **Reverb:** keys de prueba (`test-app/test-key/test-secret`) configurados en `phpunit.xml`.

### 1.3 Convenciones

- Cada cambio requiere test (`php artisan make:test --pest {name}`). No hay excepciones sin aprobación.
- Tests Feature deben usar `RefreshDatabase` y factories — nunca crear modelos a mano.
- Helpers globales de [tests/Pest.php](../tests/Pest.php): `createAdmin()`, `createProfessional()`.
- Stripe se dobla con [tests/Support/FakeStripeGateway.php](../tests/Support/FakeStripeGateway.php); el webhook usa fixtures reales en [tests/Fixtures/stripe/](../tests/Fixtures/stripe/).
- No mockear la base de datos en tests de integración (lección aprendida: divergencia mock/prod oculta bugs de migración).

---

## 2. Matriz de trazabilidad requisito → test

Identificadores: `RF-` requisito funcional, `RNF-` no funcional (seguridad, RGPD, rendimiento). Cada fila enlaza al archivo principal; un mismo test puede cubrir varios requisitos.

### 2.1 Auth & Fortify

| Req | Descripción | Archivo |
|---|---|---|
| RF-Auth-01 | Login con credenciales válidas redirige por rol | [Feature/AuthControllerTest.php](../tests/Feature/AuthControllerTest.php), [Feature/Auth/AuthenticationTest.php](../tests/Feature/Auth/AuthenticationTest.php) |
| RF-Auth-02 | Login falla con email inexistente o password incorrecto | [Feature/AuthControllerTest.php](../tests/Feature/AuthControllerTest.php) |
| RF-Auth-03 | Registro de profesional asigna rol y dispara verificación | [Feature/Auth/RegistrationTest.php](../tests/Feature/Auth/RegistrationTest.php) |
| RF-Auth-04 | Email verification — envío y confirmación | [Feature/Auth/EmailVerificationTest.php](../tests/Feature/Auth/EmailVerificationTest.php), [Feature/Auth/VerificationNotificationTest.php](../tests/Feature/Auth/VerificationNotificationTest.php) |
| RF-Auth-05 | Password reset por email | [Feature/Auth/PasswordResetTest.php](../tests/Feature/Auth/PasswordResetTest.php) |
| RF-Auth-06 | Password update desde settings | [Feature/Settings/PasswordUpdateTest.php](../tests/Feature/Settings/PasswordUpdateTest.php) |
| RF-Auth-07 | 2FA challenge y confirmación | [Feature/Auth/TwoFactorChallengeTest.php](../tests/Feature/Auth/TwoFactorChallengeTest.php), [Feature/Auth/PasswordConfirmationTest.php](../tests/Feature/Auth/PasswordConfirmationTest.php), [Feature/Settings/TwoFactorAuthenticationTest.php](../tests/Feature/Settings/TwoFactorAuthenticationTest.php) |
| RF-Auth-08 | Google OAuth (cliente y profesional) | [Feature/Auth/GoogleOAuthTest.php](../tests/Feature/Auth/GoogleOAuthTest.php) |
| RF-Auth-09 | Profesional sin tutorial completado va a onboarding | [Feature/AuthControllerTest.php](../tests/Feature/AuthControllerTest.php) |
| RNF-Auth-01 | Rate limiting en login | [Feature/Auth/AuthenticationTest.php](../tests/Feature/Auth/AuthenticationTest.php) |
| RNF-Auth-02 | Usuario sin rol no puede entrar | [Feature/AuthControllerTest.php](../tests/Feature/AuthControllerTest.php) |

### 2.2 Pacientes, agenda y citas

| Req | Descripción | Archivo |
|---|---|---|
| RF-Pac-01 | CRUD pacientes del profesional | [Feature/PatientControllerTest.php](../tests/Feature/PatientControllerTest.php), [Feature/Patient/CreateOrUpdateProfessionalPatientTest.php](../tests/Feature/Patient/CreateOrUpdateProfessionalPatientTest.php) |
| RF-Pac-02 | Aislamiento: un profesional no ve pacientes ajenos | [Feature/PatientControllerTest.php](../tests/Feature/PatientControllerTest.php) |
| RF-Pac-03 | Pre/post sesión con contexto enriquecido | [Feature/PatientControllerTest.php](../tests/Feature/PatientControllerTest.php) |
| RF-Cit-01 | Crear cita (action) y validar reglas | [Feature/Appointment/](../tests/Feature/Appointment/) (varios), [Feature/Schedule/Availability/StoreActionTest.php](../tests/Feature/Schedule/Availability/StoreActionTest.php) |
| RF-Cit-02 | Cancelar/eliminar cita | [Feature/Appointment/DestroyActionTest.php](../tests/Feature/Appointment/DestroyActionTest.php) |
| RF-Cit-03 | Autorización show cita | [Feature/Appointment/ShowAuthorizationTest.php](../tests/Feature/Appointment/ShowAuthorizationTest.php) |
| RF-Cit-04 | Ventana de unión (10/15/20 min) y no-show automático | [Feature/Sprint2/JoinWindowTest.php](../tests/Feature/Sprint2/JoinWindowTest.php), [Unit/Models/AppointmentJoinWindowTest.php](../tests/Unit/Models/AppointmentJoinWindowTest.php) |
| RF-Cit-05 | Disponibilidad: índice y slots específicos en rango | [Feature/Schedule/IndexActionTest.php](../tests/Feature/Schedule/IndexActionTest.php), [Feature/Schedule/AvailabilityIndexActionTest.php](../tests/Feature/Schedule/AvailabilityIndexActionTest.php) |
| RF-Por-01 | Reserva desde portal paciente | [Feature/Portal/Appointment/AppointmentBookingTest.php](../tests/Feature/Portal/Appointment/AppointmentBookingTest.php) |
| RF-Por-02 | Confirmación de cita por paciente | [Feature/Portal/Appointment/ConfirmTest.php](../tests/Feature/Portal/Appointment/ConfirmTest.php) |
| RF-Por-03 | Primer booking enlaza paciente al profesional | [Feature/Portal/Appointment/FirstBookingLinksPatientTest.php](../tests/Feature/Portal/Appointment/FirstBookingLinksPatientTest.php) |
| RF-Por-04 | Índice de profesionales en portal | [Feature/Portal/ProfessionalIndexTest.php](../tests/Feature/Portal/ProfessionalIndexTest.php) |

### 2.3 Videoconsulta (Google Meet)

| Req | Descripción | Archivo |
|---|---|---|
| RF-Call-01 | Profesional inicia llamada dentro de ventana | [Feature/Appointment/StartCallTest.php](../tests/Feature/Appointment/StartCallTest.php) |
| RF-Call-02 | Paciente une llamada dentro de ventana | [Feature/Portal/Appointment/JoinCallTest.php](../tests/Feature/Portal/Appointment/JoinCallTest.php) |
| RF-Call-03 | Sala de espera muestra estado correcto | [Feature/Appointment/WaitingRoomTest.php](../tests/Feature/Appointment/WaitingRoomTest.php) |
| RF-Call-04 | Cerrar llamada limpia evento Meet | [Feature/Appointment/EndCallClearsMeetTest.php](../tests/Feature/Appointment/EndCallClearsMeetTest.php) |
| RF-Call-05 | Cerrar llamada dispara summarize | [Feature/Appointment/EndCallAutoSummarizeTest.php](../tests/Feature/Appointment/EndCallAutoSummarizeTest.php), [Feature/Appointment/ClosingSuccessTest.php](../tests/Feature/Appointment/ClosingSuccessTest.php) |
| RF-Call-06 | ShowRoom devuelve 410 para sesiones completadas | [Feature/Call/ShowRoomActionTest.php](../tests/Feature/Call/ShowRoomActionTest.php) |
| RNF-Call-01 | Canal privado autorizado solo a participantes | [Feature/Appointment/AppointmentChannelAuthTest.php](../tests/Feature/Appointment/AppointmentChannelAuthTest.php) |

### 2.4 Transcripción Whisper

| Req | Descripción | Archivo |
|---|---|---|
| RF-Tra-01 | Transcribe action procesa audio | [Feature/Appointment/TranscribeActionTest.php](../tests/Feature/Appointment/TranscribeActionTest.php) |
| RF-Tra-02 | Job procesa chunks y agrega | [Feature/Appointment/TranscribeChunkJobTest.php](../tests/Feature/Appointment/TranscribeChunkJobTest.php), [Feature/Appointment/AggregateTranscriptionTest.php](../tests/Feature/Appointment/AggregateTranscriptionTest.php) |
| RF-Tra-03 | Summarize action genera resumen | [Feature/Appointment/SummarizeActionTest.php](../tests/Feature/Appointment/SummarizeActionTest.php) |
| RF-Tra-04 | Post-session briefing tras summarize | [Feature/Listeners/GeneratePostSessionBriefingOnSummarizedTest.php](../tests/Feature/Listeners/GeneratePostSessionBriefingOnSummarizedTest.php), [Feature/Services/GeneratePostSessionBriefingTest.php](../tests/Feature/Services/GeneratePostSessionBriefingTest.php) |
| RF-Tra-05 | Pre-session briefing | [Feature/Jobs/GeneratePreSessionBriefingTest.php](../tests/Feature/Jobs/GeneratePreSessionBriefingTest.php) |
| RNF-Tra-01 | Rate limit 30 req/min sobre transcribe | [Feature/Sprint3/TranscribeRateLimitTest.php](../tests/Feature/Sprint3/TranscribeRateLimitTest.php) |
| RNF-Tra-02 | Saltar transcripción si no hay consentimiento activo | [Feature/Security/TranscribeChunkConsentTest.php](../tests/Feature/Security/TranscribeChunkConsentTest.php) |
| RNF-Tra-03 | Job summarize reintenta con backoff | [Feature/Jobs/SummarizeSessionJobRetryTest.php](../tests/Feature/Jobs/SummarizeSessionJobRetryTest.php) |
| RNF-Tra-04 | Cleanup de chunks fuera de retención | [Feature/Sprint3/CleanupAudioChunksTest.php](../tests/Feature/Sprint3/CleanupAudioChunksTest.php) |
| RNF-Tra-05 | Portal post-sesión accesible | [Feature/Portal/AppointmentPostSessionTest.php](../tests/Feature/Portal/AppointmentPostSessionTest.php) |

### 2.5 Facturación y pagos

| Req | Descripción | Archivo |
|---|---|---|
| RF-Fac-01 | Numeración secuencial FAC-YEAR-XXXXX | [Feature/Sprint2/BillingTest.php](../tests/Feature/Sprint2/BillingTest.php) |
| RF-Fac-02 | Generación PDF dompdf y almacenamiento privado | [Feature/Sprint2/BillingTest.php](../tests/Feature/Sprint2/BillingTest.php) |
| RF-Fac-03 | Envío automático tras completar cita | [Feature/Billing/AutoGenerateInvoiceOnCompletionTest.php](../tests/Feature/Billing/AutoGenerateInvoiceOnCompletionTest.php), [Feature/Sprint3/FinalizeAndNotifyTest.php](../tests/Feature/Sprint3/FinalizeAndNotifyTest.php) |
| RF-Fac-04 | Edición y stats de facturas | [Feature/Invoice/EditInvoiceTest.php](../tests/Feature/Invoice/EditInvoiceTest.php), [Feature/Invoice/IndexStatsTest.php](../tests/Feature/Invoice/IndexStatsTest.php), [Feature/BillingControllerTest.php](../tests/Feature/BillingControllerTest.php) |
| RF-Fac-05 | Vista factura desde portal paciente | [Feature/Portal/Invoice/ShowInvoiceTest.php](../tests/Feature/Portal/Invoice/ShowInvoiceTest.php) |
| RF-Pag-01 | Stripe Checkout — creación de sesión | [Feature/StripeCheckoutTest.php](../tests/Feature/StripeCheckoutTest.php) |
| RF-Pag-02 | Stripe Webhook — firma válida marca pagada | [Feature/StripeWebhookTest.php](../tests/Feature/StripeWebhookTest.php) |
| RNF-Pag-01 | Stripe Webhook — idempotencia y rechazo de firma inválida | [Feature/StripeWebhookTest.php](../tests/Feature/StripeWebhookTest.php) |

### 2.6 RGPD y seguridad

| Req | Descripción | Archivo |
|---|---|---|
| RNF-Sec-01 | Cifrado en reposo de tokens Google | [Feature/Security/EncryptedCastsTest.php](../tests/Feature/Security/EncryptedCastsTest.php) |
| RNF-Sec-02 | Cifrado de campos clínicos del paciente | [Feature/Security/EncryptedCastsTest.php](../tests/Feature/Security/EncryptedCastsTest.php) |
| RNF-Sec-03 | Cifrado de notas y transcripciones | [Feature/Security/EncryptedCastsTest.php](../tests/Feature/Security/EncryptedCastsTest.php) |
| RNF-Rgpd-01 | Registro de paciente requiere 4 consentimientos | [Feature/Security/RgpdConsentTest.php](../tests/Feature/Security/RgpdConsentTest.php) |
| RNF-Rgpd-02 | Consentimiento de grabación activo/revocado/inexistente | [Feature/Security/RgpdConsentTest.php](../tests/Feature/Security/RgpdConsentTest.php), [Feature/Portal/RecordingConsentTest.php](../tests/Feature/Portal/RecordingConsentTest.php) |
| RNF-Rgpd-03 | Revocación de consentimiento (propio y ajeno) | [Feature/Sprint3/ConsentRevokeTest.php](../tests/Feature/Sprint3/ConsentRevokeTest.php) |
| RNF-Audit-01 | Log de accesos RGPD a facturas | [Feature/Security/TranscriptionAccessLogTest.php](../tests/Feature/Security/TranscriptionAccessLogTest.php) |
| RNF-Doc-01 | URL firmada para documentos del paciente | [Feature/Sprint3/SignedDocumentUrlTest.php](../tests/Feature/Sprint3/SignedDocumentUrlTest.php) |
| RNF-Pol-01 | Policies de facturas por rol | [Feature/Security/PolicyTest.php](../tests/Feature/Security/PolicyTest.php) |

### 2.7 Notas, mensajería, notificaciones, acuerdos

| Req | Descripción | Archivo |
|---|---|---|
| RF-Not-01 | Crear nota clínica | [Feature/Note/StoreActionTest.php](../tests/Feature/Note/StoreActionTest.php) |
| RF-Msg-01 | Mensajería profesional (app) | [Feature/Message/MessageControllerTest.php](../tests/Feature/Message/MessageControllerTest.php) |
| RF-Msg-02 | Mensajería profesional ↔ paciente (portal) | [Feature/Message/PortalMessageControllerTest.php](../tests/Feature/Message/PortalMessageControllerTest.php) |
| RF-Nfy-01 | Marcar notificación como leída | [Feature/Notification/MarkReadActionTest.php](../tests/Feature/Notification/MarkReadActionTest.php) |
| RF-Agr-01 | Crear acuerdo de colaboración | [Feature/Agreement/StoreActionTest.php](../tests/Feature/Agreement/StoreActionTest.php), [Feature/CollaborationAgreement/CollaborationAgreementControllerTest.php](../tests/Feature/CollaborationAgreement/CollaborationAgreementControllerTest.php) |
| RF-Doc-02 | Borrar documento | [Feature/Document/DestroyActionTest.php](../tests/Feature/Document/DestroyActionTest.php) |
| RF-Ref-01 | Índice de referrals | [Feature/Referral/IndexActionTest.php](../tests/Feature/Referral/IndexActionTest.php) |
| RF-Onb-01 | Onboarding crea workspace personal | [Feature/Onboarding/IndexActionTest.php](../tests/Feature/Onboarding/IndexActionTest.php), [Feature/WorkspaceTest.php](../tests/Feature/WorkspaceTest.php) |
| RF-Wks-01 | Workspaces colaborativos vs personales | [Feature/WorkspaceTest.php](../tests/Feature/WorkspaceTest.php) |

### 2.8 Administración

| Req | Descripción | Archivo |
|---|---|---|
| RF-Adm-01 | CRUD de usuarios | [Feature/AdminControllerTest.php](../tests/Feature/AdminControllerTest.php) |
| RF-Adm-02 | Verificación/rechazo de profesional | [Feature/AdminControllerTest.php](../tests/Feature/AdminControllerTest.php), [Feature/Professional/ApprovalFlowTest.php](../tests/Feature/Professional/ApprovalFlowTest.php) |
| RF-Adm-03 | Admin no puede borrarse a sí mismo | [Feature/AdminControllerTest.php](../tests/Feature/AdminControllerTest.php) |
| RF-Dsh-01 | Dashboard con métricas/alertas por rol | [Feature/DashboardTest.php](../tests/Feature/DashboardTest.php) |
| RF-Kos-01 | Kosmo: vista, briefings, marcar leídos | [Feature/KosmoControllerTest.php](../tests/Feature/KosmoControllerTest.php) |

### 2.9 Settings

| Req | Descripción | Archivo |
|---|---|---|
| RF-Set-01 | Vista y actualización de perfil | [Feature/SettingsControllerTest.php](../tests/Feature/SettingsControllerTest.php), [Feature/Settings/ProfileUpdateTest.php](../tests/Feature/Settings/ProfileUpdateTest.php) |
| RF-Set-02 | Eliminación de cuenta con confirmación de contraseña | [Feature/Settings/ProfileUpdateTest.php](../tests/Feature/Settings/ProfileUpdateTest.php) |
| RF-Set-03 | Google Connect — CSRF state, persistencia y revoke | [Feature/Settings/GoogleConnectTest.php](../tests/Feature/Settings/GoogleConnectTest.php) |
| RF-Set-04 | Servicios ofrecidos (CRUD) | [Feature/OfferedConsultations/CrudTest.php](../tests/Feature/OfferedConsultations/CrudTest.php) |

### 2.10 Frontend (Vitest)

| Req | Descripción | Archivo |
|---|---|---|
| RF-FE-01 | Indicador de grabación según consentimiento | [resources/js/components/recording-indicator.test.tsx](../resources/js/components/recording-indicator.test.tsx) |
| RF-FE-02 | Botón de unirse a llamada respeta ventana temporal | [resources/js/components/join-call-button.test.tsx](../resources/js/components/join-call-button.test.tsx) |
| RF-FE-03 | Hook cuenta atrás | [resources/js/hooks/use-countdown.test.ts](../resources/js/hooks/use-countdown.test.ts) |
| RF-FE-04 | Captura de pestaña del profesional | [resources/js/hooks/use-professional-tab-recorder.test.ts](../resources/js/hooks/use-professional-tab-recorder.test.ts) |

**Brechas conocidas en frontend** (a cubrir en el paso 4 del plan QA 2026-05):
- Sin tests para validadores Zod (ADR-0027) — registro paciente, reserva cita, edición factura, perfil profesional.
- Sin tests del formulario de booking del portal.
- Sin tests del patrón `SectionPanel`.

---

## 3. Gate de pruebas

### 3.1 Gate local (obligatorio antes de cada commit)

Definido en [CLAUDE.md §7](../CLAUDE.md):

```bash
vendor/bin/pint --dirty --format agent
vendor/bin/phpstan analyse           # Larastan — 0 errores
php artisan test --compact           # Pest 3 (Feature + Unit)
npm run lint
npm run types
npm run test                         # Vitest
npm run build
```

### 3.2 Gate CI

Replicado en [.github/workflows/tests.yml](../.github/workflows/tests.yml):

- Composer security audit + npm audit.
- Migraciones SQLite.
- Build de assets (Vite).
- Vitest.
- PHPStan.
- `./vendor/bin/pest --coverage --coverage-clover=coverage.xml --coverage-text --log-junit=junit.xml --min=60`.
- Upload de `coverage.xml` y `junit.xml` como artefacto `test-reports` (retención 30 días).

**Umbral de cobertura actual:** 60% (ver ADR-0030/0031 sobre PHPStan baseline). Revisable a 70% cuando se cierren los pasos 3 y 4 del plan QA 2026-05.

---

## 4. Procedimiento de archivo de evidencias

1. Cada push a `main` ejecuta el workflow `tests` en GitHub Actions.
2. Al finalizar, el artefacto **`test-reports`** queda accesible desde la pestaña *Actions* del run correspondiente y contiene:
   - `coverage.xml` — formato Clover (consumible por SonarQube, Codecov, etc.).
   - `coverage-summary.txt` — salida plana de `pest --coverage-text` (porcentaje por clase/método).
   - `coverage-summary.md` — primeras ~60 líneas del summary envueltas en Markdown, con commit SHA y timestamp UTC. Útil para pegar en una PR o release.
   - `junit.xml` — listado completo de casos con estado, tiempo y stack trace en caso de fallo.
3. **Cómo descargar:**
   - GitHub web → *Actions* → run del commit → sección *Artifacts* → `test-reports`.
   - CLI: `gh run download <run-id> -n test-reports`.
4. **Convención de retención:** GitHub conserva el artefacto 30 días. Para releases (etiquetas `v*`) se debe descargar manualmente y archivar fuera del repo (no comitear binarios).
5. Para reproducir localmente con cobertura:

   ```bash
   ./vendor/bin/pest --coverage --coverage-html=coverage-html --min=60
   npm run test -- --coverage
   ```

6. Cualquier fallo del gate bloquea el merge. La política es **fix forward** — corregir el test o el código en un commit nuevo, nunca `--no-verify`.

---

## 5. Mantenimiento del plan

- Actualizar la cifra de la cabecera (`82 archivos · 409 casos`) cuando varíe sensiblemente (>5%).
- Cuando se añada un nuevo dominio funcional, crear sección en §2 con su identificador `RF-<dominio>-NN`.
- Las brechas conocidas (§2.10) se cierran en el plan QA correspondiente y se borran de este documento al cubrirse.
