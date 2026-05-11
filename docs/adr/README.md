# Architecture Decision Records (ADR)

Registro de decisiones arquitectónicas del proyecto ClientKosmos. Formato Nygard ligero. Cada ADR es inmutable: si una decisión cambia, el ADR original se marca como superseded y se crea uno nuevo.

> Fuente original consolidada en [`docs/decision-log.md`](../decision-log.md).

---

| ADR | Título | Estado |
|-----|--------|--------|
| [0001](0001-adoption-kosmos-excellence-standards.md) | Adopción de los estándares de excelencia Kosmos | Aceptado |
| [0002](0002-migrate-ui-compounds-chakra-v3-phase2.md) | Migración de compuestos UI (fase 2): Dialog, AlertDialog, Select, NavigationMenu, InputOTP, StatusBadge a Chakra UI v3 | Aceptado |
| [0003](0003-button-type-submit-required-inertia-forms.md) | Corrección sistémica: `type="submit"` obligatorio en `Button` dentro de formularios Inertia v2 | Aceptado |
| [0004](0004-migrate-light-components-chakra-v3-phase3a.md) | Migración fase 3a: componentes ligeros (`input-error`, `user-info`, `text-link`) a Chakra UI v3 | Aceptado |
| [0005](0005-migrate-medium-components-chakra-v3-phase3b.md) | Migración fase 3b: componentes medianos a Chakra UI v3 | Aceptado |
| [0006](0006-migrate-shell-components-chakra-v3-phase3c.md) | Migración fase 3c: `bottom-bar`, `app-header`, `sidebar` | Aceptado |
| [0007](0007-migrate-dashboard-pages-chakra-v3-batch-c.md) | Migración Batch C: páginas de dashboard a Chakra UI v3 | Aceptado |
| [0008](0008-transcription-chunked-groq-whisper-rgpd.md) | Transcripción chunked con Groq Whisper + captura independiente de Jitsi + consentimiento RGPD | Aceptado |
| [0009](0009-laravel-reverb-broadcaster-live-transcription.md) | Laravel Reverb como broadcaster para transcripción en vivo | Aceptado |
| [0010](0010-migrate-jitsi-to-google-meet.md) | Migración Jitsi → Google Meet (videollamada) | Aceptado |
| [0011](0011-local-encrypted-storage-drive-removed.md) | Almacenamiento local cifrado (Drive eliminado) | Aceptado |
| [0012](0012-pdf-generation-dompdf.md) | Generación de PDF con barryvdh/laravel-dompdf | Aceptado |
| [0013](0013-activity-log-rgpd-spatie.md) | spatie/laravel-activitylog para audit log RGPD | Aceptado |
| [0014](0014-transactional-email-smtp-resend.md) | Envío de email transaccional (SMTP / Resend) | Aceptado |
| [0015](0015-global-recording-consent-on-patient-registration.md) | Consentimiento global de grabación en el alta del paciente | Aceptado |
| [0016](0016-personal-vs-collaborative-workspaces.md) | Workspaces personales vs colaborativos | Aceptado |
| [0017](0017-offered-consultations-singular-model-fk-service-id.md) | Módulo OfferedConsultations: modelo singular, FK service_id conservada | Aceptado |
| [0018](0018-post-session-pipeline-encryption-audit-log-purge.md) | Cierre del flujo Post-Sesión: cifrado at-rest, agregación de transcripción, audit log, purga | Aceptado |
| [0019](0019-stripe-test-mode-session-billing.md) | Integración Stripe (test mode) para cobro de sesiones | Implementado |
| [0020](0020-auto-invoice-on-appointment-completed.md) | Generación automática de factura al finalizar la sesión | Aceptado |
| [0021](0021-block-unverified-professionals-approval-notification.md) | Bloqueo de profesionales no verificados y notificación de aprobación | Aceptado |
| [0022](0022-vitest-testing-library-frontend-tests.md) | Adopción de Vitest + @testing-library/react para tests de frontend | Aceptado |
| [0023](0023-google-settings-ui-csrf-state-revoke.md) | Sección Settings Google: UI de conexión, CSRF state y revoke explícito | Aprobado |
| [0024](0024-transcription-pipeline-vad-hallucination-filter.md) | Pipeline de transcripción: VAD client-side, filtro server-side y refactor a MediaRecorder continuo | Parcialmente aceptado |
| [0025](0025-payment-does-not-mutate-appointment-status.md) | Pago no muta Appointment.status; is_paid derivado de InvoiceItem | Aceptado |
| [0026](0026-remove-tailwind-migrate-to-chakra-v3.md) | Eliminación definitiva de Tailwind CSS y migración a Chakra UI v3 | Aceptado |
| [0027](0027-zod-client-validation-critical-forms.md) | Adopción de Zod para validación cliente en formularios críticos | Aceptado |
| [0028](0028-monetization-free-app-ads-premium-no-ads.md) | Cambio de modelo de monetización: app gratuita con anuncios + premium sin anuncios | Aceptado |
| [0029](0029-data-integrity-without-triggers-or-stored-procedures.md) | Integridad de datos sin triggers ni stored procedures | Aceptado |

---

