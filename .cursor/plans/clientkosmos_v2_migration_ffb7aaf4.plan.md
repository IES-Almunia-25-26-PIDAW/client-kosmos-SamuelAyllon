---
name: ClientKosmos v2 Migration
overview: Migrate ClientKosmos from a single-professional tool to a bilateral multi-tenant platform with patient portal, video calls, transcription, invoicing, and Gmail integration, following the 7-week roadmap.
todos:
  # ── S1: MIGRACIONES ──
  - id: s1-mig-clinics
    content: "S1: Crear migracion create_clinics_table (name, slug, owner_id, tax_name, tax_id, tax_address, phone, email, logo_path, settings json)"
    status: pending
  - id: s1-mig-clinic-user
    content: "S1: Crear migracion create_clinic_user_table (clinic_id, user_id, role enum, can_view_all_patients, joined_at, is_active)"
    status: pending
  - id: s1-mig-services
    content: "S1: Crear migracion create_services_table (clinic_id, name, description, duration_minutes, price, color, is_active)"
    status: pending
  - id: s1-mig-availabilities
    content: "S1: Crear migracion create_availabilities_table (professional_id, clinic_id, day_of_week, start_time, end_time, slot_duration_minutes, is_active)"
    status: pending
  - id: s1-mig-appointments
    content: "S1: Crear migracion create_appointments_table (clinic_id, patient_id, professional_id, service_id, starts_at, ends_at, status enum, modality enum, meeting_room_id, meeting_url, cancellation_reason, cancelled_by, notes)"
    status: pending
  - id: s1-mig-session-recordings
    content: "S1: Crear migracion create_session_recordings_table (appointment_id, audio_path, transcription, ai_summary, transcription_status enum, summarized_at, language, duration_seconds)"
    status: pending
  - id: s1-mig-invoices
    content: "S1: Crear migracion create_invoices_table (clinic_id, patient_id, professional_id, invoice_number, status enum, issued_at, due_at, paid_at, subtotal, tax_rate, tax_amount, total, payment_method enum, stripe_payment_id, notes, pdf_path)"
    status: pending
  - id: s1-mig-invoice-items
    content: "S1: Crear migracion create_invoice_items_table (invoice_id, description, quantity, unit_price, total, appointment_id nullable)"
    status: pending
  - id: s1-mig-messages
    content: "S1: Crear migracion create_messages_table (clinic_id, sender_id, receiver_id, subject, body, read_at, related_type, related_id)"
    status: pending
  - id: s1-mig-patient-professional
    content: "S1: Crear migracion create_patient_professional_table (patient_id, professional_id, clinic_id, is_primary, status enum, started_at, ended_at, notes)"
    status: pending
  - id: s1-mig-modify-users
    content: "S1: Crear migracion modify_users_table_v2 — anadir phone, date_of_birth, address, emergency_contact, patient_notes, stripe_customer_id, google_refresh_token, gdrive_refresh_token; eliminar campos legacy (practice_name, specialty, city, nif, fiscal_address, invoice_prefix, invoice_counter, invoice_footer_text, rgpd_template, data_retention_months, privacy_policy_url, role enum, default_rate, default_session_duration)"
    status: pending
  - id: s1-mig-rename-patients
    content: "S1: Crear migracion rename_patients_to_patient_profiles — renombrar tabla, eliminar columnas legacy (project_name, brand_tone, service_scope, next_deadline, payment_status, has_valid_consent, has_open_agreement), anadir clinic_id, professional_id, clinical_notes, diagnosis, treatment_plan, referral_source, status enum, first_session_at, last_session_at"
    status: pending
  - id: s1-mig-modify-documents
    content: "S1: Crear migracion modify_documents_table_v2 — anadir clinic_id, storage_type enum, gdrive_file_id, gdrive_url; renombrar file_path a local_path"
    status: pending

  # ── S1: MODELOS ──
  - id: s1-model-clinic
    content: "S1: Crear modelo Clinic con relaciones (owner, users/professionals, services, appointments, invoices, messages) y fillable/casts"
    status: pending
  - id: s1-model-service
    content: "S1: Crear modelo Service con relaciones (clinic, appointments) y fillable/casts"
    status: pending
  - id: s1-model-availability
    content: "S1: Crear modelo Availability con relaciones (professional, clinic) y fillable/casts"
    status: pending
  - id: s1-model-appointment
    content: "S1: Crear modelo Appointment con relaciones (clinic, patient, professional, service, sessionRecording, invoice) y fillable/casts/enums"
    status: pending
  - id: s1-model-session-recording
    content: "S1: Crear modelo SessionRecording con relacion belongsTo Appointment y fillable/casts"
    status: pending
  - id: s1-model-invoice
    content: "S1: Crear modelo Invoice con relaciones (clinic, patient, professional, items) y fillable/casts"
    status: pending
  - id: s1-model-invoice-item
    content: "S1: Crear modelo InvoiceItem con relaciones (invoice, appointment nullable) y fillable/casts"
    status: pending
  - id: s1-model-message
    content: "S1: Crear modelo Message con relaciones (clinic, sender, receiver) y fillable/casts"
    status: pending
  - id: s1-model-patient-professional
    content: "S1: Crear modelo PatientProfessional (pivote) con relaciones y fillable/casts"
    status: pending
  - id: s1-refactor-patient-to-profile
    content: "S1: Renombrar modelo Patient a PatientProfile — actualizar clase, tabla, relaciones, fillable, casts; actualizar todas las referencias en controladores, servicios y otros modelos"
    status: pending
  - id: s1-update-user-model
    content: "S1: Actualizar modelo User — anadir relaciones (clinics, ownedClinics, appointments, patientProfile, patientProfessionals, sentMessages, receivedMessages), anadir metodos isOwner()/isPatient(), actualizar fillable/casts"
    status: pending
  - id: s1-belongs-to-clinic-trait
    content: "S1: Crear trait BelongsToClinic con global scope que filtra por clinic_id del usuario autenticado; aplicar a modelos con clinic_id"
    status: pending

  # ── S1: SEEDERS Y FACTORIES ──
  - id: s1-role-seeder
    content: "S1: Actualizar RoleSeeder — anadir roles 'owner' y 'patient' (total 4: admin, owner, professional, patient)"
    status: pending
  - id: s1-clinic-factory
    content: "S1: Crear ClinicFactory con estados basicos"
    status: pending
  - id: s1-appointment-factory
    content: "S1: Crear AppointmentFactory con estados (pending, confirmed, completed, cancelled)"
    status: pending
  - id: s1-invoice-factory
    content: "S1: Crear InvoiceFactory con estados (draft, sent, paid)"
    status: pending
  - id: s1-refactor-patient-factory
    content: "S1: Renombrar PatientFactory a PatientProfileFactory, actualizar campos para nueva estructura"
    status: pending
  - id: s1-rewrite-user-seeder
    content: "S1: Reescribir UserSeeder — crear clinica demo, owner, profesional, 4 pacientes (users con rol patient + patient_profiles), appointments de ejemplo, datos demo completos"
    status: pending
  - id: s1-run-migrations
    content: "S1: Ejecutar php artisan migrate:fresh --seed y verificar que todo funciona sin errores"
    status: pending

  # ── S2: ROLES Y MIDDLEWARE ──
  - id: s2-middleware-ensure-owner
    content: "S2: Crear middleware EnsureOwner en app/Http/Middleware/ — aborta 403 si el usuario no tiene rol owner"
    status: pending
  - id: s2-middleware-clinic-access
    content: "S2: Crear middleware EnsureClinicAccess — verifica que el usuario pertenece a la clinica del request (via clinic_id en ruta o session)"
    status: pending
  - id: s2-refactor-ensure-professional
    content: "S2: Refactorizar EnsureProfessional para que permita tanto owner como professional (o reemplazar por Spatie role:owner,professional)"
    status: pending
  - id: s2-register-middleware
    content: "S2: Actualizar bootstrap/app.php — registrar alias para owner, clinic.access y actualizar alias professional"
    status: pending
  - id: s2-restructure-routes
    content: "S2: Restructurar routes/web.php — crear grupos portal (role:patient), clinic (role:owner), mantener professional (role:owner,professional), actualizar admin"
    status: pending
  - id: s2-update-shared-props
    content: "S2: Actualizar HandleInertiaRequests — compartir currentClinic, userRole expandido en shared props"
    status: pending

  # ── S2: REGISTRO E INVITACION ──
  - id: s2-invitation-service
    content: "S2: Crear PatientInvitationService — generar token unico, guardar en cache/DB, enviar email con enlace de registro"
    status: pending
  - id: s2-patient-register-route
    content: "S2: Crear ruta GET /register/patient/{token} y controlador que valida token y renderiza formulario de registro de paciente"
    status: pending
  - id: s2-refactor-create-new-user
    content: "S2: Refactorizar CreateNewUser (Fortify) para soportar registro de owner (crea user + clinica) y patient (crea user + vincula a clinica)"
    status: pending
  - id: s2-owner-onboarding-backend
    content: "S2: Crear Onboarding/OwnerStoreAction — crea clinica con datos fiscales + primer servicio por defecto"
    status: pending
  - id: s2-patient-invite-action
    content: "S2: Crear Patient/InviteAction — controlador que usa PatientInvitationService para enviar invitacion al portal"
    status: pending

  # ── S2: FRONTEND AUTH ──
  - id: s2-update-auth-types
    content: "S2: Actualizar resources/js/types/auth.ts — role con 4 valores ('admin'|'owner'|'professional'|'patient'), anadir campos nuevos de User"
    status: pending
  - id: s2-create-clinic-types
    content: "S2: Crear resources/js/types/models/clinic.ts con tipos Clinic, ClinicUser, Service"
    status: pending
  - id: s2-update-global-types
    content: "S2: Actualizar resources/js/types/global.d.ts — anadir currentClinic a shared props"
    status: pending
  - id: s2-create-portal-layout
    content: "S2: Crear resources/js/layouts/portal-layout.tsx — layout con sidebar simplificada para pacientes (citas, facturas, documentos, mensajes, perfil)"
    status: pending
  - id: s2-patient-register-page
    content: "S2: Crear resources/js/pages/auth/register-patient.tsx — formulario de registro por invitacion"
    status: pending
  - id: s2-adapt-onboarding-page
    content: "S2: Adaptar resources/js/pages/onboarding.tsx — flujo owner (nombre clinica, datos fiscales, primer servicio)"
    status: pending
  - id: s2-adapt-sidebar-by-role
    content: "S2: Actualizar resources/js/components/app-sidebar.tsx — mostrar items de navegacion condicionales segun rol (owner ve clinic settings, professional no)"
    status: pending

  # ── S3: BOOKING BACKEND ──
  - id: s3-availability-service
    content: "S3: Crear AvailabilityService — metodo getAvailableSlots(professional, date, clinic) que calcula slots libres a partir de availabilities menos appointments existentes"
    status: pending
  - id: s3-appointment-service
    content: "S3: Crear AppointmentService — metodos book(), cancel(), validateNoConflict(), con logica de negocio de citas"
    status: pending
  - id: s3-schedule-controllers
    content: "S3: Crear controladores Schedule/IndexAction (vista calendario) y Schedule/Availability/ (Index, Store, Update, Destroy)"
    status: pending
  - id: s3-appointment-controllers
    content: "S3: Crear controladores Appointment/ (Index, Store, Show, Update, UpdateStatus) para el lado profesional"
    status: pending
  - id: s3-portal-appointment-controllers
    content: "S3: Crear controladores Portal/Appointment/ (Index, Book, Store, Show, Cancel) para el lado paciente"
    status: pending
  - id: s3-portal-dashboard-controller
    content: "S3: Crear controlador Portal/Dashboard/IndexAction — proximas citas, mensajes sin leer, docs pendientes"
    status: pending
  - id: s3-booking-form-requests
    content: "S3: Crear FormRequests: StoreAvailabilityRequest, BookAppointmentRequest, StoreAppointmentRequest"
    status: pending
  - id: s3-booking-routes
    content: "S3: Anadir rutas de /schedule/*, /appointments/*, /portal/appointments/* y /portal/dashboard en web.php"
    status: pending

  # ── S3: BOOKING FRONTEND ──
  - id: s3-appointment-types
    content: "S3: Crear tipos Appointment, Service, Availability en resources/js/types/models/"
    status: pending
  - id: s3-install-calendar-lib
    content: "S3: Evaluar e instalar libreria de calendario (schedule-x, react-big-calendar, o similar)"
    status: pending
  - id: s3-schedule-index-page
    content: "S3: Crear pages/schedule/index.tsx — vista calendario semanal/mensual con citas del profesional"
    status: pending
  - id: s3-schedule-availability-page
    content: "S3: Crear pages/schedule/availability.tsx — configurar franjas horarias con formulario"
    status: pending
  - id: s3-portal-dashboard-page
    content: "S3: Crear pages/portal/dashboard.tsx — proximas citas, mensajes sin leer, documentos pendientes"
    status: pending
  - id: s3-portal-book-page
    content: "S3: Crear pages/portal/appointments/book.tsx — seleccion de servicio + calendario de slots libres + confirmacion"
    status: pending
  - id: s3-portal-appointments-index
    content: "S3: Crear pages/portal/appointments/index.tsx — historial de citas del paciente"
    status: pending
  - id: s3-portal-appointments-show
    content: "S3: Crear pages/portal/appointments/show.tsx — detalle de cita + boton unirse a videollamada"
    status: pending

  # ── S4: VIDEOLLAMADA BACKEND ──
  - id: s4-videocall-service
    content: "S4: Crear VideoCallService — Daily.co API: createRoom(), deleteRoom(), getRecording() usando Http::withToken()"
    status: pending
  - id: s4-start-call-action
    content: "S4: Crear Appointment/StartCallAction — llama a VideoCallService::createRoom(), guarda meeting_url y meeting_room_id en appointment, cambia status a in_progress"
    status: pending
  - id: s4-end-call-action
    content: "S4: Crear Appointment/EndCallAction — llama a VideoCallService::getRecording(), descarga audio, despacha TranscribeAudioJob, cambia status a completed"
    status: pending
  - id: s4-videocall-routes
    content: "S4: Anadir rutas POST /appointments/{appointment}/start-call y /end-call en web.php"
    status: pending

  # ── S4: TRANSCRIPCION BACKEND ──
  - id: s4-transcription-service
    content: "S4: Crear TranscriptionService — envia audio a Groq Whisper API (whisper-large-v3), devuelve texto de transcripcion"
    status: pending
  - id: s4-transcribe-job
    content: "S4: Crear TranscribeAudioJob — usa TranscriptionService, guarda resultado en session_recordings, actualiza transcription_status, elimina archivo audio temporal"
    status: pending
  - id: s4-summary-job
    content: "S4: Crear GenerateSessionSummaryJob — usa KosmoService para generar resumen desde transcripcion, guarda ai_summary en session_recordings"
    status: pending
  - id: s4-transcribe-summarize-actions
    content: "S4: Crear Appointment/TranscribeAction y Appointment/SummarizeAction — triggers manuales que despachan los jobs"
    status: pending
  - id: s4-update-kosmo-service
    content: "S4: Actualizar KosmoService — anadir metodo generateSessionSummary(transcription) que usa Llama 3.3 via Groq"
    status: pending
  - id: s4-transcription-routes
    content: "S4: Anadir rutas GET /appointments/{appointment}/recording, POST /transcribe, POST /summarize en web.php"
    status: pending

  # ── S4: VIDEOLLAMADA FRONTEND ──
  - id: s4-install-daily
    content: "S4: Instalar @daily-co/daily-react via npm"
    status: pending
  - id: s4-daily-call-component
    content: "S4: Crear components/video-call/daily-call.tsx — wrapper DailyProvider con controles (mute, camera, leave)"
    status: pending
  - id: s4-appointments-show-page
    content: "S4: Crear pages/appointments/show.tsx — detalle de cita con videollamada embebida + panel de transcripcion + resumen IA"
    status: pending
  - id: s4-portal-join-call
    content: "S4: Actualizar portal/appointments/show.tsx — boton 'Unirse' que carga DailyProvider con meeting_url"
    status: pending
  - id: s4-session-recording-types
    content: "S4: Crear tipo SessionRecording en resources/js/types/models/"
    status: pending

  # ── S5: FACTURACION BACKEND ──
  - id: s5-invoice-service
    content: "S5: Crear InvoiceService — generateInvoiceNumber(), calculateTotals(), createDraftFromAppointment()"
    status: pending
  - id: s5-invoice-pdf-service
    content: "S5: Instalar barryvdh/laravel-dompdf; crear InvoicePdfService — render() genera PDF con datos de factura, clinica y paciente"
    status: pending
  - id: s5-invoice-controllers
    content: "S5: Crear controladores Invoice/ (IndexAction, StoreAction, ShowAction, UpdateAction, ExportPdfAction)"
    status: pending
  - id: s5-invoice-send-action
    content: "S5: Crear Invoice/SendAction — marca factura como sent (por ahora sin Gmail, solo cambio de estado)"
    status: pending
  - id: s5-generate-invoice-action
    content: "S5: Crear Appointment/GenerateInvoiceAction — usa InvoiceService para crear borrador desde cita completada"
    status: pending
  - id: s5-generate-invoice-job
    content: "S5: Crear GenerateInvoiceDraftJob — se despacha automaticamente al completar una cita"
    status: pending
  - id: s5-invoice-form-requests
    content: "S5: Crear StoreInvoiceRequest y UpdateInvoiceRequest con validacion de campos"
    status: pending
  - id: s5-portal-invoice-controllers
    content: "S5: Crear controladores Portal/Invoice/ (IndexAction, ShowAction, DownloadPdfAction)"
    status: pending
  - id: s5-invoice-routes
    content: "S5: Anadir rutas /invoices/*, /appointments/{appointment}/invoice, /portal/invoices/* en web.php"
    status: pending

  # ── S5: FACTURACION FRONTEND ──
  - id: s5-invoice-types
    content: "S5: Crear tipos Invoice, InvoiceItem en resources/js/types/models/"
    status: pending
  - id: s5-invoices-index-page
    content: "S5: Crear pages/invoices/index.tsx — lista de facturas con filtros por estado (draft, sent, paid, overdue)"
    status: pending
  - id: s5-invoices-create-page
    content: "S5: Crear pages/invoices/create.tsx — formulario para factura manual con lineas editables"
    status: pending
  - id: s5-invoices-edit-page
    content: "S5: Crear pages/invoices/edit.tsx — editar borrador + preview + botones enviar/exportar PDF"
    status: pending
  - id: s5-portal-invoices-index
    content: "S5: Crear pages/portal/invoices/index.tsx — lista de facturas del paciente con estado"
    status: pending
  - id: s5-portal-invoices-show
    content: "S5: Crear pages/portal/invoices/show.tsx — detalle de factura + descarga PDF (+ boton pagar para S6)"
    status: pending
  - id: s5-deprecate-billing
    content: "S5: Deprecar/redirigir pages/billing/index.tsx hacia /invoices"
    status: pending

  # ── S6: GMAIL API ──
  - id: s6-install-google-client
    content: "S6: Instalar google/apiclient via composer"
    status: pending
  - id: s6-gmail-service
    content: "S6: Crear GmailService — OAuth2 flow (getAuthUrl, handleCallback, storeRefreshToken), sendEmail(to, subject, body, attachments)"
    status: pending
  - id: s6-google-oauth-routes
    content: "S6: Crear rutas GET /auth/google/redirect y /auth/google/callback + controladores OAuth"
    status: pending
  - id: s6-invoice-send-with-gmail
    content: "S6: Actualizar Invoice/SendAction — si el profesional tiene gmail conectado usar GmailService, sino fallback a Mail de Laravel"
    status: pending
  - id: s6-google-settings-page
    content: "S6: Crear pages/settings/google.tsx — boton conectar/desconectar Gmail, estado de conexion"
    status: pending

  # ── S6: STRIPE ──
  - id: s6-install-cashier
    content: "S6: Instalar laravel/cashier via composer, publicar migraciones, configurar .env"
    status: pending
  - id: s6-stripe-service
    content: "S6: Crear StripeService — createCheckoutSession(invoice), handleWebhook(payload)"
    status: pending
  - id: s6-stripe-webhook-route
    content: "S6: Crear ruta POST /stripe/webhook excluida de CSRF + controlador webhook que actualiza estado de invoice/payment"
    status: pending
  - id: s6-portal-pay-action
    content: "S6: Crear Portal/Invoice/PayAction — genera Stripe Checkout session y redirige al paciente"
    status: pending
  - id: s6-stripe-frontend
    content: "S6: Instalar @stripe/stripe-js + @stripe/react-stripe-js; anadir boton 'Pagar' en portal/invoices/show.tsx"
    status: pending

  # ── S6: MENSAJES ──
  - id: s6-message-service
    content: "S6: Crear MessageService — send(), getConversation(), markAsRead(), getUnreadCount()"
    status: pending
  - id: s6-message-controllers
    content: "S6: Crear controladores Message/ (IndexAction, ConversationAction, StoreAction) para profesional"
    status: pending
  - id: s6-portal-message-controllers
    content: "S6: Crear controladores Portal/Message/ (IndexAction, StoreAction) para paciente"
    status: pending
  - id: s6-message-routes
    content: "S6: Anadir rutas /messages/*, /portal/messages/* en web.php"
    status: pending
  - id: s6-message-types
    content: "S6: Crear tipo Message en resources/js/types/models/"
    status: pending
  - id: s6-messages-page
    content: "S6: Crear pages/messages/index.tsx — buzon con lista de conversaciones y vista de mensajes"
    status: pending
  - id: s6-portal-messages-page
    content: "S6: Crear pages/portal/messages/index.tsx — buzon simplificado para paciente"
    status: pending

  # ── S6: PORTAL RESTANTE + REMINDERS ──
  - id: s6-portal-documents-page
    content: "S6: Crear pages/portal/documents/index.tsx — lista de documentos descargables del paciente"
    status: pending
  - id: s6-portal-consent-page
    content: "S6: Crear pages/portal/consent-forms/index.tsx — formularios pendientes de firma"
    status: pending
  - id: s6-portal-profile-page
    content: "S6: Crear pages/portal/profile/edit.tsx — datos personales del paciente"
    status: pending
  - id: s6-appointment-reminder-job
    content: "S6: Crear SendAppointmentReminderJob + registrar en scheduler (everyFifteenMinutes, comprueba citas en 24h)"
    status: pending
  - id: s6-tests-nuevos-modulos
    content: "S6: Escribir tests Pest para: appointments (booking, conflicts, cancel), invoices (create, pdf, send), messages (send, read)"
    status: pending

  # ── S7: QA Y POLISH ──
  - id: s7-adapt-patients-pages
    content: "S7: Actualizar todas las paginas patients/* (index, create, show, edit, pre-session, post-session) para usar patient_profiles en lugar de patients"
    status: pending
  - id: s7-adapt-patient-controllers
    content: "S7: Actualizar controladores Patient/* para trabajar con PatientProfile + vincular user con rol patient"
    status: pending
  - id: s7-adapt-dashboard
    content: "S7: Actualizar pages/dashboard.tsx y Dashboard/IndexAction para contexto de clinica (filtrar por clinic_id)"
    status: pending
  - id: s7-sidebar-navigation-final
    content: "S7: Refactorizar app-sidebar.tsx con navegacion completa condicional por rol (owner: clinic settings/team/services; professional: schedule/patients/invoices; admin: admin panel)"
    status: pending
  - id: s7-portal-ui-polish
    content: "S7: Pulir UI portal paciente — responsive, empty states, loading states, skeleton loaders"
    status: pending
  - id: s7-e2e-flow-test
    content: "S7: Test E2E del flujo completo: reserva → videollamada → transcripcion → factura → envio email"
    status: pending
  - id: s7-update-seeders-final
    content: "S7: Actualizar seeders con datos demo completos para los 4 roles (admin, owner, professional, patient)"
    status: pending
  - id: s7-update-readme
    content: "S7: Actualizar README con nueva arquitectura, variables .env necesarias, instrucciones de setup"
    status: pending
  - id: s7-fix-bugs
    content: "S7: Fix bugs y edge cases detectados durante QA"
    status: pending
isProject: false
---

# ClientKosmos v2 — Plan de Migracion

## Estado actual del proyecto

El proyecto tiene una base funcional con:
- **9 modelos** (User, Patient, ConsultingSession, Note, Agreement, Payment, ConsentForm, Document, KosmoBriefing)
- **2 roles** Spatie: `admin`, `professional`
- **27 paginas React** distribuidas en dashboard, patients, billing, kosmo, settings, admin, auth
- **3 layouts**: AppLayout (profesional), AdminLayout, AuthLayout
- **Servicios y Jobs**: todos son stubs/TODO sin implementacion real
- **Sin multi-tenancy**: todo esta ligado directamente a `user_id`

---

## Impacto por capa

### Base de datos: 10 tablas nuevas + 3 tablas modificadas

**Tablas nuevas:**
- `clinics`, `clinic_user`, `services`, `availabilities`, `appointments`, `session_recordings`, `invoices`, `invoice_items`, `messages`, `patient_professional`

**Tablas modificadas:**
- `users` — anadir campos: `phone`, `avatar_path`, `date_of_birth`, `address`, `emergency_contact`, `patient_notes`, `stripe_customer_id`, `google_refresh_token`, `gdrive_refresh_token`; eliminar campos legacy: `practice_name`, `specialty`, `city`, `nif`, `fiscal_address`, `invoice_prefix`, `invoice_counter`, `invoice_footer_text`, `rgpd_template`, `data_retention_months`, `privacy_policy_url`, `role` enum, `default_rate`, `default_session_duration` (estos datos migran a `clinics` o `clinic_user`)
- `patients` → renombrar a `patient_profiles` con nueva estructura (eliminar `project_name`, `brand_tone`, `service_scope`, `next_deadline`, `payment_status`, `has_valid_consent`, `has_open_agreement`; anadir `clinic_id`, `professional_id`, `clinical_notes`, `diagnosis`, `treatment_plan`, `referral_source`, `status`, `first_session_at`, `last_session_at`)
- `documents` — anadir `clinic_id`, `storage_type`, `gdrive_file_id`, `gdrive_url`; renombrar `file_path` → `local_path`

**Tablas que se mantienen sin cambios:** `notes`, `agreements`, `consent_forms`, `kosmo_briefings`, `permissions/roles` (Spatie)

**Tabla `payments`:** se mantiene para transacciones pero se complementa con `invoices` + `invoice_items` para facturacion formal. Hay que decidir si `payments` se vincula a `invoices` (FK `invoice_id`) o se mantiene independiente.

**Tabla `consulting_sessions`:** se podria deprecar progresivamente a favor de `appointments`, pero como tiene relaciones con notes, agreements, payments y kosmo_briefings, la estrategia mas segura es mantenerla y hacer que `appointments` sea la nueva entidad de "cita" mientras `consulting_sessions` mantiene el historial legacy. Alternativamente, renombrar `consulting_sessions` directamente — esto requiere actualizar todas las FK.

### Backend: ~40 controladores nuevos + 11 servicios nuevos

**Controladores nuevos por modulo:**
- `Portal/` (10 acciones): Dashboard, Appointment CRUD, Invoice list/show/pdf, Document, ConsentForm, Message, Profile
- `Appointment/` (10 acciones): Index, Store, Show, Update, UpdateStatus, StartCall, EndCall, Transcribe, Summarize, GenerateInvoice
- `Schedule/` (5 acciones): Index + Availability CRUD
- `Invoice/` (6 acciones): Index, Store, Show, Update, Send, ExportPdf
- `Message/` (3 acciones): Index, Conversation, Store
- `Clinic/` (9 acciones): Settings, Team CRUD, Services CRUD, Analytics

**Controladores a refactorizar:**
- `Patient/` — adaptar para `patient_profiles` en lugar de `patients`; anadir `InviteAction`
- `Admin/` — anadir `Clinics/` (Index, Show); adaptar `Users/` para 4 roles
- `Dashboard/IndexAction` — adaptar para contexto de clinica
- `Onboarding/` — adaptar para owner (crear clinica + servicio) y patient

**Middleware nuevo:**
- `EnsureOwner` o reutilizar Spatie `role:owner`
- `EnsureClinicAccess` — verificar `clinic_id` en cada request
- Eliminar `EnsureProfessional` (reemplazar por `role:owner,professional`)

**Servicios nuevos:** AppointmentService, AvailabilityService, GmailService, GoogleDriveService, InvoiceService, InvoicePdfService, MessageService, StripeService, TranscriptionService, VideoCallService, PatientInvitationService

**Jobs nuevos:** TranscribeAudioJob, GenerateSessionSummaryJob, SendAppointmentReminderJob, GenerateInvoiceDraftJob, SyncGoogleDriveJob

### Frontend: ~25 paginas nuevas + 2 layouts nuevos

**Layouts nuevos:**
- `PortalLayout` — sidebar simplificada para pacientes
- `ClinicLayout` — settings/team/services para owner

**Paginas nuevas:**
- `portal/` (10): dashboard, appointments (index, book, show), invoices (index, show), documents, consent-forms, messages, profile
- `schedule/` (2): index (calendario), availability
- `appointments/` (2-3): index, show (con video embebido + transcripcion)
- `invoices/` (3): index, create, edit
- `messages/` (1): index (buzon)
- `clinic/` (4): settings, team, services, analytics

**Paginas a refactorizar:**
- `patients/` — adaptar para `patient_profiles`; actualizar tipos
- `dashboard.tsx` — anadir contexto de clinica
- `onboarding.tsx` — flujos separados para owner y patient
- `billing/index.tsx` — deprecar o redirigir a `invoices/`

**Tipos nuevos en `resources/js/types/`:**
- `models/clinic.ts`, `models/appointment.ts`, `models/invoice.ts`, `models/message.ts`, `models/service.ts`, `models/session-recording.ts`
- Actualizar `models/patient.ts` → adaptar a `PatientProfile`
- Actualizar `auth.ts` → `role` con 4 valores

**Dependencias npm nuevas:**
- `@daily-co/daily-react` — videollamadas
- `@stripe/stripe-js` + `@stripe/react-stripe-js` — pagos
- Libreria de calendario (e.g. `@schedule-x/react` o similar)
- Libreria PDF viewer si se necesita preview en frontend

---

## Estrategia de migracion de datos

La tabla `patients` actual contiene datos que en v2 se reparten entre `users` (rol patient) y `patient_profiles`:

```
patients.email, patients.phone → users (nuevo user con rol patient)
patients.project_name, patients.brand_tone → patient_profiles.clinical_notes (migrar como texto)
patients.service_scope → patient_profiles.treatment_plan
patients.is_active → patient_profiles.status
patients.payment_status, has_valid_consent, has_open_agreement → se calculan dinamicamente
```

Los campos de facturacion del `users` actual (`nif`, `fiscal_address`, `invoice_prefix`, etc.) migran a `clinics` (`tax_name`, `tax_id`, `tax_address`).

Se necesita una **migracion de datos** (no solo de schema) que:
1. Cree una `clinic` por cada profesional existente (usando sus datos fiscales)
2. Cree un registro `clinic_user` para cada profesional como `owner`
3. Para cada `patient`, cree un `user` con rol `patient` y un `patient_profile` vinculado
4. Actualice las FK en `notes`, `agreements`, `payments`, `documents`, `consent_forms` para apuntar a `patient_profiles.id`

---

## Plan semanal (Fase 1 — MVP)

### Semana 1 (5-11 may): Migraciones, modelos y seeders

**Migraciones a crear:**
1. `create_clinics_table`
2. `create_clinic_user_table`
3. `create_services_table`
4. `create_availabilities_table`
5. `create_appointments_table`
6. `create_session_recordings_table`
7. `create_invoices_table`
8. `create_invoice_items_table`
9. `create_messages_table`
10. `create_patient_professional_table`
11. `modify_users_table_v2` — anadir campos nuevos, eliminar campos legacy
12. `rename_patients_to_patient_profiles` — renombrar tabla + cambiar columnas
13. `modify_documents_table_v2` — anadir clinic_id, storage_type, etc.

**Modelos a crear:** Clinic, Service, Availability, Appointment, SessionRecording, Invoice, InvoiceItem, Message, PatientProfessional

**Modelo a refactorizar:** Patient → PatientProfile (renombrar clase, actualizar relaciones)

**Modelo User:** anadir relaciones (`clinics()`, `ownedClinics()`, `appointments()`, `patientProfile()`, etc.), anadir metodos `isOwner()`, `isPatient()`, actualizar casts

**Seeders:** actualizar RoleSeeder (anadir `owner`, `patient`), reescribir UserSeeder para crear clinica + profesionales + pacientes con la nueva estructura

**Factories:** crear ClinicFactory, AppointmentFactory, InvoiceFactory; actualizar PatientFactory → PatientProfileFactory

---

### Semana 2 (12-18 may): Roles, middleware, registro e invitacion

**Backend:**
- Actualizar [RoleSeeder](database/seeders/RoleSeeder.php) con roles `owner` y `patient`
- Crear middleware `EnsureClinicAccess` en [app/Http/Middleware/](app/Http/Middleware/)
- Refactorizar [EnsureProfessional](app/Http/Middleware/EnsureProfessional.php) → soportar `owner,professional`
- Crear `EnsureOwner` middleware
- Actualizar [bootstrap/app.php](bootstrap/app.php) con alias de middleware nuevos
- Crear `PatientInvitationService` — genera token + envia email
- Crear ruta `GET /register/patient/{token}` + controlador
- Refactorizar [CreateNewUser](app/Actions/Fortify/CreateNewUser.php) para soportar registro de owner y patient
- Crear onboarding de owner: `Onboarding/OwnerStoreAction` (crea clinica + primer servicio)
- Actualizar [HandleInertiaRequests](app/Http/Middleware/HandleInertiaRequests.php) — compartir `currentClinic`, `userRole` extendido
- Restructurar [routes/web.php](routes/web.php) con los nuevos grupos de middleware

**Frontend:**
- Actualizar tipos en [resources/js/types/auth.ts](resources/js/types/auth.ts) — rol con 4 valores
- Crear tipos `Clinic` en `resources/js/types/models/clinic.ts`
- Actualizar `global.d.ts` con `currentClinic` en shared props
- Crear `PortalLayout` en `resources/js/layouts/portal-layout.tsx`
- Crear pagina registro por invitacion: `resources/js/pages/auth/register-patient.tsx`
- Adaptar [onboarding.tsx](resources/js/pages/onboarding.tsx) para flujo owner
- Actualizar sidebar ([app-sidebar.tsx](resources/js/components/app-sidebar.tsx)) — nav items segun rol

---

### Semana 3 (19-25 may): Booking y agenda

**Backend:**
- Crear `AvailabilityService` — calculo de slots libres
- Crear `AppointmentService` — validacion de conflictos, booking
- Crear controladores `Schedule/IndexAction`, `Schedule/Availability/*`
- Crear controladores `Portal/Appointment/*` (Index, Book, Store, Show, Cancel)
- Crear controladores `Appointment/IndexAction`, `Appointment/StoreAction`, `Appointment/ShowAction`, `Appointment/UpdateAction`, `Appointment/UpdateStatusAction`
- Crear FormRequests: `StoreAvailabilityRequest`, `BookAppointmentRequest`, `StoreAppointmentRequest`
- Anadir rutas de schedule y appointments en `web.php`

**Frontend:**
- Crear tipos `Appointment`, `Service`, `Availability` en types/models/
- Crear pagina `pages/schedule/index.tsx` — vista calendario semanal/mensual
- Crear pagina `pages/schedule/availability.tsx` — configurar franjas
- Crear pagina `portal/appointments/book.tsx` — seleccion de servicio + slots
- Crear pagina `portal/appointments/index.tsx` — historial
- Crear pagina `portal/appointments/show.tsx` — detalle + boton videollamada
- Crear pagina `portal/dashboard.tsx`
- Instalar dependencia de calendario

---

### Semana 4 (26 may - 1 jun): Videollamada y transcripcion

**Backend:**
- Instalar `@daily-co/daily-react` (npm) — sin paquete PHP, se usa HTTP client
- Crear `VideoCallService` — Daily.co API (create/delete room, get recording)
- Crear `TranscriptionService` — Groq Whisper API
- Crear `Appointment/StartCallAction` — genera sala Daily, guarda meeting_url/room_id en appointment
- Crear `Appointment/EndCallAction` — obtiene grabacion, despacha TranscribeAudioJob
- Crear job `TranscribeAudioJob` — envia audio a Groq Whisper, guarda transcripcion en `session_recordings`
- Crear job `GenerateSessionSummaryJob` — resumen con Llama 3.3 via `KosmoService`
- Crear `Appointment/TranscribeAction` y `Appointment/SummarizeAction` (triggers manuales)
- Actualizar `KosmoService` con metodo `generateSessionSummary()`

**Frontend:**
- Instalar `@daily-co/daily-react`
- Crear componente `components/video-call/daily-call.tsx` — wrapper de DailyProvider
- Actualizar `pages/appointments/show.tsx` — embeber videollamada + mostrar transcripcion
- Crear pagina/componente para visualizar transcripcion + resumen IA
- Actualizar `portal/appointments/show.tsx` — boton "Unirse" que carga DailyProvider

---

### Semana 5 (2-8 jun): Facturacion

**Backend:**
- Crear `InvoiceService` — numeracion (`CK-2026-XXXXX`), calculo IVA, creacion de borradores
- Crear `InvoicePdfService` — renderizado PDF (usando `barryvdh/laravel-dompdf` o `spatie/laravel-pdf`)
- Crear controladores `Invoice/*` (Index, Store, Show, Update, Send, ExportPdf)
- Crear `Appointment/GenerateInvoiceAction` — auto-genera borrador desde cita completada
- Crear job `GenerateInvoiceDraftJob` — se despacha al completar cita
- Crear FormRequests: `StoreInvoiceRequest`, `UpdateInvoiceRequest`
- Anadir rutas de invoices en `web.php`
- Crear controladores `Portal/Invoice/*` (Index, Show, DownloadPdf)

**Frontend:**
- Crear tipos `Invoice`, `InvoiceItem` en types/models/
- Crear pagina `pages/invoices/index.tsx` — lista con filtros por estado
- Crear pagina `pages/invoices/create.tsx` — formulario manual
- Crear pagina `pages/invoices/edit.tsx` — editar borrador + preview PDF + boton enviar
- Crear pagina `portal/invoices/index.tsx` — lista para paciente
- Crear pagina `portal/invoices/show.tsx` — detalle + descarga PDF + pago Stripe
- Deprecar/redirigir `billing/index.tsx` hacia `invoices/`

---

### Semana 6 (9-15 jun): Gmail, mensajes y Stripe

**Backend:**
- Instalar `google/apiclient` (composer)
- Crear `GmailService` — OAuth2, envio de emails con adjunto PDF
- Crear ruta OAuth callback `GET /auth/google/callback`
- Crear controladores `Message/*` (Index, Conversation, Store)
- Crear controladores `Portal/Message/*` (Index, Store)
- Crear `MessageService`
- Instalar `laravel/cashier` (Stripe)
- Crear `StripeService` — Checkout Session, webhooks
- Crear ruta webhook `POST /stripe/webhook` (excluir de CSRF)
- Crear controlador Portal/Invoice/PayAction — redirige a Stripe Checkout
- Crear job `SendAppointmentReminderJob`
- Actualizar scheduler en [routes/console.php](routes/console.php)
- Escribir tests para los modulos nuevos (Pest)

**Frontend:**
- Instalar `@stripe/stripe-js` + `@stripe/react-stripe-js`
- Crear pagina `pages/messages/index.tsx` — buzon con conversaciones
- Crear pagina `portal/messages/index.tsx`
- Crear componente de checkout Stripe en portal invoices
- Crear pagina `pages/settings/google.tsx` — conectar Gmail/Drive OAuth
- Crear paginas portal restantes: `portal/documents/index.tsx`, `portal/consent-forms/index.tsx`, `portal/profile/edit.tsx`

---

### Semana 7 (16-22 jun): QA, polish y documentacion

- Fix bugs, edge cases
- Pulir UI del portal del paciente (responsive, empty states, loading states)
- Actualizar paginas `patients/*` para usar `patient_profiles`
- Refactorizar [app-sidebar.tsx](resources/js/components/app-sidebar.tsx) con navegacion condicional por rol
- Tests E2E del flujo completo: reserva → videollamada → transcripcion → factura → envio
- Actualizar README
- Actualizar seeders con datos demo completos para los 4 roles

---

## Dependencias nuevas

**Composer (PHP):**
- `laravel/cashier` — Stripe integration
- `google/apiclient` — Gmail + Drive APIs
- `barryvdh/laravel-dompdf` o `spatie/laravel-pdf` — generacion PDF
- (opcional) `laravel/scout` si se necesita busqueda full-text

**NPM (JS):**
- `@daily-co/daily-react` — videollamada embebida
- `@stripe/stripe-js` + `@stripe/react-stripe-js` — checkout
- Libreria de calendario (evaluar `@schedule-x/react`, `react-big-calendar`, o similar)

---

## Riesgos y decisiones pendientes

1. **`consulting_sessions` vs `appointments`**: La tabla actual tiene FK desde notes, agreements, payments, kosmo_briefings. Opciones: (a) mantener ambas tablas con una relacion `appointment_id` en `consulting_sessions`, (b) migrar todas las FK a `appointments` y deprecar `consulting_sessions`. **Recomendacion: opcion (b)** — anadir `appointment_id` nullable a notes/agreements/payments durante la transicion, y migrar progresivamente.

2. **Multi-tenancy scope**: Cada query debe filtrar por `clinic_id`. Se puede implementar con un **global scope** en cada modelo o con un middleware que inyecta el `clinic_id` en el request. **Recomendacion**: global scope en los modelos + trait `BelongsToClinic` reutilizable.

3. **Migracion de datos legacy**: Los pacientes actuales no tienen `User` propio. La migracion debe crear usuarios con contrasena temporal y enviar invitacion. Esto es un one-time script, no una migracion reversible.

4. **Daily.co free tier**: 10.000 min/mes es suficiente para MVP, pero hay que monitorizar. El audio se debe descargar inmediatamente tras la llamada y eliminar del servidor de Daily.

5. **Gmail OAuth**: Requiere Google Cloud project con OAuth consent screen verificado. Para desarrollo, usar modo "testing" con emails autorizados manualmente.

6. **Volumen de trabajo S4-S6**: Las semanas 4, 5 y 6 son las mas densas (videollamada + facturacion + integraciones). Si hay retraso, priorizar: videollamada > facturacion PDF > Gmail (fallback a SMTP).
