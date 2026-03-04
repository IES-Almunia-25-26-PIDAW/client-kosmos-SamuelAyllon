# 📚 FLOWLY - ÍNDICE DE ARCHIVOS DEL PROYECTO

> Última actualización: Marzo 2026 — Estado real del proyecto en disco.

---

## 📁 `.claude/` — Documentación de Contexto

| Archivo | Propósito |
|---------|-----------|
| `PROJECT_STATE.md` | **Estado actual del proyecto** — sesiones y cambios |
| `QUICK_REFERENCE.md` | Referencia rápida: roles, rutas, enums, errores comunes |
| `CHECKLIST_DESARROLLO.md` | Checklist de desarrollo y deployment |
| `INDEX_TOTAL_ARCHIVOS.md` | Este archivo — mapa del proyecto |
| `README.md` | Intro al proyecto |

---

## 📁 `app/` — Backend Laravel

### Controladores
```
app/Http/Controllers/
├── Controller.php                     ← Base (tiene AuthorizesRequests trait)
├── DashboardController.php            ← index
├── TaskController.php                 ← CRUD + complete + reopen
├── IdeaController.php                 ← CRUD + resolve + reactivate
├── ProjectController.php              ← CRUD (premium only)
├── BoxController.php                  ← CRUD (premium only)
├── ResourceController.php             ← Nested en box + standalone
├── SubscriptionController.php         ← index (planes + suscripción activa)
├── CheckoutController.php             ← index + store (pago simulado 80/20)
├── VoiceRecordingController.php       ← transcribe (JSON, Whisper API)
├── AiChatController.php               ← index + store + destroy (Groq/OpenAI)
├── TutorialController.php             ← complete (marca tutorial_completed_at)
└── Admin/
    ├── AdminDashboardController.php   ← stats + recentPayments + recentUsers
    ├── AdminUserController.php        ← index + show + destroy
    ├── AdminPaymentController.php     ← index con summary
    └── AdminSubscriptionController.php← index con summary por plan
```

### Modelos
```
app/Models/
├── User.php             ← HasRoles + TwoFactorAuthenticatable + canAddTask()
├── Subscription.php
├── Payment.php          ← Payment::process() simula pago (80% éxito)
├── Project.php          ← status: active|inactive|completed (SIN 'created')
├── Task.php             ← SIN SoftDeletes — hard delete físico
├── Idea.php             ← SIN SoftDeletes — hard delete físico
├── Box.php
├── Resource.php
├── AiConversation.php   ← $timestamps = false (solo created_at)
└── VoiceRecording.php
```

### Form Requests
```
app/Http/Requests/
├── StoreTaskRequest.php / UpdateTaskRequest.php
├── StoreIdeaRequest.php / UpdateIdeaRequest.php
├── StoreProjectRequest.php / UpdateProjectRequest.php
├── StoreBoxRequest.php / UpdateBoxRequest.php
├── StoreResourceRequest.php / UpdateResourceRequest.php
├── CheckoutRequest.php
├── StoreVoiceRecordingRequest.php   ← valida audio (mimes + max 25MB)
└── StoreAiChatRequest.php           ← valida mensaje (max 2000 chars)
```

### Auth / Responses
```
app/Http/Controllers/Auth/AuthController.php  ← valida credenciales + rol
app/Http/Responses/LoginResponse.php          ← redirige admin→/admin/dashboard
```

### Policies
```
app/Policies/
├── TaskPolicy.php
├── IdeaPolicy.php
├── ProjectPolicy.php
├── BoxPolicy.php
└── ResourcePolicy.php
```

---

## 📁 `database/` — Base de Datos

### Migraciones (14 tablas)
```
database/migrations/
├── create_users_table.php
├── add_two_factor_columns_to_users_table.php
├── create_permission_tables.php               ← Spatie
├── add_fields_to_users_table.php              ← ⚠️ VACÍA — existe pero sin columnas
├── create_subscriptions_table.php
├── create_payments_table.php
├── create_projects_table.php
├── create_tasks_table.php
├── create_ideas_table.php
├── create_boxes_table.php
├── create_resources_table.php
├── create_ai_conversations_table.php
├── create_voice_recordings_table.php
└── add_tutorial_completed_at_to_users_table.php  ← tutorial_completed_at nullable
```

### Seeders
```
database/seeders/
├── DatabaseSeeder.php     ← llama [RoleSeeder, UserSeeder]
├── RoleSeeder.php         ← crea 3 roles con firstOrCreate
└── UserSeeder.php         ← crea admin, premium, free con suscripción
```

### Factories
```
database/factories/
├── UserFactory.php
├── ProjectFactory.php     ← color siempre con valor (no optional)
├── TaskFactory.php
├── IdeaFactory.php
├── BoxFactory.php
├── ResourceFactory.php
├── SubscriptionFactory.php
└── PaymentFactory.php
```

---

## 📁 `tests/` — Tests Pest

```
tests/
├── Pest.php                                     ← Setup global: withoutVite, RoleSeeder, helpers
├── Feature/
│   ├── TaskControllerTest.php                   ✅
│   ├── IdeaControllerTest.php                   ✅
│   ├── ProjectControllerTest.php                ✅
│   ├── BoxControllerTest.php                    ✅
│   ├── ResourceControllerTest.php               ✅
│   ├── CheckoutControllerTest.php               ✅
│   ├── SubscriptionControllerTest.php           ✅
│   ├── VoiceRecordingControllerTest.php         ✅
│   ├── AiChatControllerTest.php                 ✅
│   ├── AdminControllerTest.php                  ✅
│   ├── DashboardTest.php                        ✅
│   ├── ExampleTest.php                          ✅
│   ├── Auth/                                    ← 6 archivos Auth ✅
│   └── Settings/                               ← PasswordUpdate, ProfileUpdate, TwoFactor ✅
└── Unit/
    └── ExampleTest.php
```

**Total: 180 tests / 692 assertions — Todos pasando ✅**

Helpers globales en `Pest.php`: `createAdmin()`, `createPremiumUser()`, `createFreeUser()`

---

## 📁 `resources/js/` — Frontend React

### Páginas (todas con UI real)
```
resources/js/pages/
├── welcome.tsx                        ✅ Landing: hero, features, pricing, footer
├── dashboard.tsx                      ✅ Datos reales free/premium/admin + tutorial chatbot
├── auth/
│   ├── login.tsx                      ✅
│   ├── register.tsx                   ✅
│   ├── two-factor-challenge.tsx       ✅
│   ├── forgot-password.tsx            ✅
│   ├── reset-password.tsx             ✅
│   ├── confirm-password.tsx           ✅
│   └── verify-email.tsx               ✅
├── settings/
│   ├── profile.tsx                    ✅
│   ├── password.tsx                   ✅
│   ├── appearance.tsx                 ✅
│   └── two-factor.tsx                 ✅
├── tasks/
│   ├── index.tsx                      ✅ Lista + quick-create + voice recorder
│   ├── create.tsx                     ✅ Formulario completo + voice dictation
│   └── edit.tsx                       ✅
├── ideas/
│   ├── index.tsx                      ✅ Lista + quick-create + voice recorder
│   ├── create.tsx                     ✅ Formulario completo + voice dictation
│   └── edit.tsx                       ✅
├── projects/
│   ├── index.tsx                      ✅
│   ├── show.tsx                       ✅
│   ├── create.tsx                     ✅
│   └── edit.tsx                       ✅
├── boxes/
│   ├── index.tsx                      ✅
│   ├── show.tsx                       ✅
│   ├── create.tsx                     ✅
│   └── edit.tsx                       ✅
├── resources/
│   ├── create.tsx                     ✅
│   └── edit.tsx                       ✅
├── subscription/
│   └── index.tsx                      ✅
├── checkout/
│   └── index.tsx                      ✅
├── ai-chats/
│   └── index.tsx                      ✅ Chat UI completo, sugerencias, auto-scroll
└── admin/
    ├── dashboard.tsx                  ✅
    ├── users/
    │   ├── index.tsx                  ✅
    │   └── show.tsx                   ✅
    ├── payments/index.tsx             ✅
    └── subscriptions/index.tsx        ✅
```

### Componentes
```
resources/js/components/
├── ui/                              ← shadcn/ui primitives (NO crear nuevos)
├── app-sidebar.tsx                  ← navegación por rol
├── nav-main.tsx
├── app-logo.tsx                     ← logo.png
├── voice-recorder.tsx               ← MediaRecorder + fetch + estados idle/recording/processing
└── tutorial-chatbot.tsx             ← spotlight SVG mask + tooltip posicionado + chatbot Flowy
```

### Tipos TypeScript
```
resources/js/types/
├── auth.ts          → User (auth), Auth, TwoFactorSetupData
├── navigation.ts    → NavItem, BreadcrumbItem
├── models/          → Task, Idea, Project, Box, Resource,
│                      Subscription, Payment, RecentPayment, Role, VoiceRecording, AiMessage
├── shared/          → PaginatedData<T>
├── pages/           → DashboardProps, TasksProps, IdeasProps,
│                      SubscriptionProps (+ Plan), CheckoutProps (+ CheckoutPlan), AiChatsProps
├── admin/           → AdminStats, AdminUser, AdminDashboardProps,
│                      AdminUsersIndexProps, AdminUserShowProps,
│                      AdminPaymentsProps, AdminSubscriptionsProps
└── index.ts         → barrel (re-exports de sub-barrels)
```

---

## 📁 `routes/web.php` — Rutas

```
Públicas:
  GET /                → welcome (landing)
  GET /login, POST /login (Fortify)
  GET /register, POST /register (Fortify)
  + forgot-password, reset-password, etc.

Autenticadas (todos los roles):
  dashboard.*    → DashboardController
  tasks.*        → TaskController (+ complete, reopen)
  ideas.*        → IdeaController (+ resolve, reactivate)
  subscription.* → SubscriptionController
  checkout.*     → CheckoutController
  POST /tutorial/complete → TutorialController

Premium (solo role:premium_user — admin NO):
  projects.*         → ProjectController
  boxes.*            → BoxController
  resources.*        → ResourceController
  POST /voice/transcribe → VoiceRecordingController
  GET/POST/DELETE /ai-chats → AiChatController

Admin (role:admin):
  admin.dashboard           → AdminDashboardController
  admin.users.*             → AdminUserController
  admin.payments.index      → AdminPaymentController
  admin.subscriptions.index → AdminSubscriptionController
```

---

## 📁 Otros archivos clave

```
config/
├── services.php     ← openai.key + openai.base_url (configurable para Groq/OpenAI)
└── fortify.php      ← features: registration, resetPasswords, 2FA, etc.

resources/
├── css/app.css          ← Design System Flowly (tokens shadcn, fuentes)
├── views/app.blade.php  ← carga fuentes fonts.bunny.net
└── js/assets/logo.png   ← logo del proyecto

storage/app/tidb-ca.pem  ← cert SSL TiDB (en .gitignore, NO commitear)

Dockerfile               ← multi-stage (builder Node + PHP-FPM + Nginx)
docker-compose.yml
docker-entrypoint.sh     ← ejecuta migrate + seed al arrancar

docs/
├── decisiones-tecnicas.md  ← justificación técnica (requisito intermodular)
└── manual-usuario.md       ← manual de usuario (requisito intermodular)
```

---

## 🔑 Credenciales de prueba
```
admin@flowly.test    / password  → admin
premium@flowly.test  / password  → premium_user
free@flowly.test     / password  → free_user
```

## ⚡ Comandos frecuentes
```bash
php artisan serve                  # Backend
npm run dev                        # Frontend Vite
php artisan migrate:fresh --seed   # Resetear BD
php artisan test                   # Todos los tests (180/692)
php artisan test --filter NombreTest  # Un test específico
```
