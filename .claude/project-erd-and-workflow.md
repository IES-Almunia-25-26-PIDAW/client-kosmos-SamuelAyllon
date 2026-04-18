---
description: Persistent ER model and end-to-end workflow for the Kosmos project
globs:
alwaysApply: false
---
# Project ERD and Workflow Context

Use this rule as a persistent source of truth for project structure and business flow.
Before proposing, implementing, or reviewing changes, align decisions with these entities, relationships, and workflows.

## Purpose

1. Keep data modeling consistent across migrations, models, controllers, services, and tests.
2. Prevent relationship mistakes (especially around patient identity and profile records).
3. Maintain business-flow consistency in professional, admin, and patient-portal features.

## Canonical ER Diagram

```mermaid
erDiagram
    USERS {
        bigint id PK
        string email UK
    }

    WORKSPACES {
        bigint id PK
        bigint creator_id FK
        string name
        string slug UK
    }

    WORKSPACE_MEMBERS {
        bigint id PK
        bigint workspace_id FK
        bigint user_id FK
        string role
    }

    PROFESSIONAL_PROFILES {
        bigint id PK
        bigint user_id UK
    }

    PATIENT_PROFILES {
        bigint id PK
        bigint user_id FK
        bigint workspace_id FK
        bigint professional_id FK
        string status
    }

    CASE_ASSIGNMENTS {
        bigint id PK
        bigint patient_id FK
        bigint professional_id FK
        bigint workspace_id FK
        boolean is_primary
        string role
        string status
    }

    SERVICES {
        bigint id PK
        bigint workspace_id FK
    }

    AVAILABILITIES {
        bigint id PK
        bigint professional_id FK
        bigint workspace_id FK
    }

    APPOINTMENTS {
        bigint id PK
        bigint workspace_id FK
        bigint patient_id FK
        bigint professional_id FK
        bigint service_id FK
        string status
    }

    SESSION_RECORDINGS {
        bigint id PK
        bigint appointment_id FK
    }

    NOTES {
        bigint id PK
        bigint patient_id FK
        bigint user_id FK
        bigint appointment_id FK
    }

    AGREEMENTS {
        bigint id PK
        bigint patient_id FK
        bigint user_id FK
        bigint appointment_id FK
    }

    CONSENT_FORMS {
        bigint id PK
        bigint patient_id FK
        bigint user_id FK
    }

    DOCUMENTS {
        bigint id PK
        bigint patient_id FK
        bigint user_id FK
        bigint workspace_id FK
    }

    KOSMO_BRIEFINGS {
        bigint id PK
        bigint user_id FK
        bigint patient_id FK
        bigint appointment_id FK
        string type
    }

    INVOICES {
        bigint id PK
        bigint workspace_id FK
        bigint patient_id FK
        bigint professional_id FK
    }

    INVOICE_ITEMS {
        bigint id PK
        bigint invoice_id FK
        bigint appointment_id FK
    }

    MESSAGES {
        bigint id PK
        bigint workspace_id FK
        bigint sender_id FK
        bigint receiver_id FK
    }

    COLLABORATION_AGREEMENTS {
        bigint id PK
        bigint professional_a_id FK
        bigint professional_b_id FK
        bigint workspace_id FK
    }

    REFERRALS {
        bigint id PK
        bigint from_professional_id FK
        bigint to_professional_id FK
        bigint patient_id FK
    }

    USERS ||--o{ WORKSPACES : "creates (creator_id)"
    USERS ||--o{ WORKSPACE_MEMBERS : "membership"
    WORKSPACES ||--o{ WORKSPACE_MEMBERS : "has"

    USERS ||--|| PROFESSIONAL_PROFILES : "user_id"

    USERS ||--o{ PATIENT_PROFILES : "patient user_id"
    USERS ||--o{ PATIENT_PROFILES : "professional_id"
    WORKSPACES ||--o{ PATIENT_PROFILES : "workspace_id"

    USERS ||--o{ CASE_ASSIGNMENTS : "patient_id"
    USERS ||--o{ CASE_ASSIGNMENTS : "professional_id"
    WORKSPACES ||--o{ CASE_ASSIGNMENTS : "workspace_id"

    WORKSPACES ||--o{ SERVICES : "has"
    USERS ||--o{ AVAILABILITIES : "professional_id"
    WORKSPACES ||--o{ AVAILABILITIES : "workspace_id"

    WORKSPACES ||--o{ APPOINTMENTS : "workspace_id"
    USERS ||--o{ APPOINTMENTS : "patient_id"
    USERS ||--o{ APPOINTMENTS : "professional_id"
    SERVICES ||--o{ APPOINTMENTS : "service_id"

    APPOINTMENTS ||--o| SESSION_RECORDINGS : "recording"
    APPOINTMENTS ||--o{ NOTES : "appointment_id"
    APPOINTMENTS ||--o{ AGREEMENTS : "appointment_id"
    APPOINTMENTS ||--o{ INVOICE_ITEMS : "appointment_id"
    APPOINTMENTS ||--o{ KOSMO_BRIEFINGS : "appointment_id"

    PATIENT_PROFILES ||--o{ NOTES : "patient_id"
    PATIENT_PROFILES ||--o{ AGREEMENTS : "patient_id"
    PATIENT_PROFILES ||--o{ CONSENT_FORMS : "patient_id"
    PATIENT_PROFILES ||--o{ DOCUMENTS : "patient_id"
    PATIENT_PROFILES ||--o{ KOSMO_BRIEFINGS : "patient_id"
    PATIENT_PROFILES ||--o{ REFERRALS : "patient_id"

    USERS ||--o{ NOTES : "author user_id"
    USERS ||--o{ AGREEMENTS : "author user_id"
    USERS ||--o{ CONSENT_FORMS : "creator user_id"
    USERS ||--o{ DOCUMENTS : "uploader user_id"
    USERS ||--o{ KOSMO_BRIEFINGS : "target user_id"

    WORKSPACES ||--o{ INVOICES : "workspace_id"
    USERS ||--o{ INVOICES : "patient_id"
    USERS ||--o{ INVOICES : "professional_id"
    INVOICES ||--o{ INVOICE_ITEMS : "items"

    WORKSPACES ||--o{ MESSAGES : "workspace_id"
    USERS ||--o{ MESSAGES : "sender_id"
    USERS ||--o{ MESSAGES : "receiver_id"

    USERS ||--o{ COLLABORATION_AGREEMENTS : "professional_a_id"
    USERS ||--o{ COLLABORATION_AGREEMENTS : "professional_b_id"
    WORKSPACES ||--o{ COLLABORATION_AGREEMENTS : "workspace_id"
```

## Canonical Business Flow

```mermaid
flowchart TD
    A[Registro/Login + rol] --> B{Rol}
    B -->|professional| C[Onboarding + workspace actual]
    B -->|admin| Z[Panel admin usuarios/workspaces]
    B -->|patient| P[Portal paciente]

    C --> D[Crear paciente: users + patient_profiles]
    D --> E[Configurar agenda: services + availabilities]
    E --> F[Crear cita: appointments]
    F --> G[Sesion: start/end call]
    G --> H[Transcripcion/resumen: session_recordings + kosmo_briefings]
    G --> I[Notas/acuerdos/docs/consent]
    G --> J[Generar factura: invoices + invoice_items]
    J --> K[Enviar/descargar PDF y seguimiento estado]
    C --> L[Mensajeria interna: messages]

    P --> P1[Ver citas/facturas/documentos/consentimientos]
    P --> P2[Firmar consentimiento]
    P --> P3[Cancelar/entrar a videollamada]
    P --> P4[Mensajes y perfil]
```

## Status Enums & Transitions

All enum columns below are defined as SQL `ENUM` in the migrations (single source of
truth: `database/migrations/`). Default value is shown after `=`. There are **no
PHP `enum` classes** in `app/Enums/`; the allowed values live in the migrations and are
enforced at the DB level.

| Table.column | Allowed values (default bold) | Notes |
|---|---|---|
| `appointments.status` | **`pending`**, `confirmed`, `in_progress`, `completed`, `cancelled`, `no_show` | Typical flow: `pending` → `confirmed` → `in_progress` → `completed`. Terminal: `cancelled`, `no_show` (requires `cancellation_reason` + `cancelled_by` when `cancelled`). |
| `appointments.modality` | `in_person`, **`video_call`** | When `video_call`, `meeting_room_id` / `meeting_url` become relevant. |
| `patient_profiles.status` | **`active`**, `inactive`, `discharged` | `discharged` is terminal; gate creation of new clinical records on `active`. |
| `invoices.status` | **`draft`**, `sent`, `paid`, `overdue`, `cancelled` | Flow: `draft` → `sent` → (`paid` \| `overdue`). `cancelled` is terminal. `paid` requires `paid_at`. |
| `invoices.payment_method` | `cash`, `transfer`, `card`, `bizum`, `stripe`, `other` (nullable) | Set only when `status = paid`. `stripe` requires `stripe_payment_id`. |
| `case_assignments.role` | **`primary`**, `secondary`, `substitute`, `co_therapist` | Only one `primary` per `(patient_id, workspace_id)` is expected (enforce at app level; DB has unique on the triple `patient_id, professional_id, workspace_id`). |
| `case_assignments.status` | **`active`**, `paused`, `ended` | `ended` requires `ended_at`. |
| `workspace_members.role` | **`member`**, `billing_manager` | Distinct from Spatie roles (`admin`, `professional`, `patient`) — do not conflate. |
| `consent_forms.status` | **`pending`**, `signed`, `expired`, `revoked` | `signed` requires `signed_at`, `signature_data`, `signed_ip`. `expires_at` can trigger `expired`. |

When adding new code paths, the **default** value is what a freshly-created row lands
on; any code that creates a row without setting `status` should be auditable as "still
in the starting state".

## Mandatory Modeling Guidance

1. Distinguish patient identity (`users.id`) from clinical profile (`patient_profiles.id`).
2. Respect workspace scoping in records that include `workspace_id`.
3. Keep appointment-centric artifacts linked to `appointments` when applicable.
4. Ensure billing consistency: invoice header in `invoices`, lines in `invoice_items`.
5. Preserve role-driven flows: `admin`, `professional`, and `patient` behavior must remain separated.

## Pre-change Checklist

Before making schema or domain logic changes, confirm:

- The target table and FK side are correct (especially `patient_id` semantics).
- The change does not break professional and portal workflows.
- Related controllers, policies, factories, and tests remain aligned.
- Status enums and business transitions stay valid end-to-end.
