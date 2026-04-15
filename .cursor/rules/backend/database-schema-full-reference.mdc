---
description: Esquema completo de base de datos (columnas, FKs, enums) alineado a migraciones; fuente de verdad para modelado y tests
globs:
  - database/migrations/**/*.php
  - database/factories/**/*.php
  - app/Models/**/*.php
alwaysApply: true
---
# Referencia completa del esquema de base de datos (Kosmos)

Este documento resume **todas las tablas y columnas** definidas por las migraciones del repositorio. Si una migración nueva añade o cambia columnas, **actualiza esta regla** o trata el diff de migraciones como autoridad hasta entonces.

## Semántica crítica `patient_id`

| Tabla | `patient_id` apunta a |
|--------|------------------------|
| `appointments`, `invoices`, `case_assignments` | `users.id` (usuario paciente) |
| `notes`, `agreements`, `consent_forms`, `documents`, `kosmo_briefings`, `referrals` | `patient_profiles.id` (perfil clínico) |

En código y tests, no mezclar ambos significados.

---

## Dominio de aplicación

### `users`

| Columna | Tipo / restricción |
|---------|-------------------|
| `id` | bigint PK |
| `name` | string |
| `email` | string UK |
| `email_verified_at` | timestamp nullable |
| `password` | string |
| `two_factor_secret` | text nullable |
| `two_factor_recovery_codes` | text nullable |
| `two_factor_confirmed_at` | timestamp nullable |
| `remember_token` | string nullable |
| `tutorial_completed_at` | timestamp nullable |
| `avatar_path` | string nullable |
| `phone` | string nullable |
| `date_of_birth` | date nullable |
| `address` | text nullable |
| `patient_notes` | text nullable |
| `stripe_customer_id` | string nullable |
| `google_refresh_token` | text nullable |
| `gdrive_refresh_token` | text nullable |
| `created_at`, `updated_at` | timestamps |
| `deleted_at` | timestamp nullable (soft deletes) |

### `workspaces`

| Columna | Tipo / restricción |
|---------|-------------------|
| `id` | bigint PK |
| `creator_id` | FK → `users.id`, cascade delete |
| `name` | string |
| `slug` | string UK |
| `tax_name`, `tax_id` | string nullable |
| `tax_address` | text nullable |
| `phone`, `email` | string nullable |
| `logo_path` | string nullable |
| `location_address` | text nullable |
| `settings` | json nullable |
| `created_at`, `updated_at` | timestamps |
| `deleted_at` | timestamp nullable |

### `workspace_members`

| Columna | Tipo / restricción |
|---------|-------------------|
| `id` | bigint PK |
| `workspace_id` | FK → `workspaces.id`, cascade delete |
| `user_id` | FK → `users.id`, cascade delete |
| `role` | enum: `member`, `billing_manager` (default `member`) |
| `joined_at` | timestamp nullable |
| `is_active` | boolean default true |
| `created_at`, `updated_at` | timestamps |
| — | unique (`workspace_id`, `user_id`) |

### `professional_profiles`

| Columna | Tipo / restricción |
|---------|-------------------|
| `id` | bigint PK |
| `user_id` | FK → `users.id` UK, cascade delete |
| `license_number`, `collegiate_number` | string nullable |
| `specialties` | json nullable |
| `verification_status` | enum: `unverified`, `pending`, `verified`, `rejected` (default `unverified`) |
| `bio` | text nullable |
| `verified_at` | timestamp nullable |
| `created_at`, `updated_at` | timestamps |

### `patient_profiles`

| Columna | Tipo / restricción |
|---------|-------------------|
| `id` | bigint PK |
| `user_id` | FK → `users.id`, cascade delete |
| `workspace_id` | FK → `workspaces.id` nullable, null on delete |
| `professional_id` | FK → `users.id` nullable, null on delete |
| `is_active` | boolean default true |
| `clinical_notes`, `diagnosis`, `treatment_plan` | text nullable |
| `referral_source` | string nullable |
| `status` | enum: `active`, `inactive`, `discharged` (default `active`) |
| `first_session_at`, `last_session_at` | timestamp nullable |
| `created_at`, `updated_at` | timestamps |
| `deleted_at` | timestamp nullable |

### `case_assignments`

| Columna | Tipo / restricción |
|---------|-------------------|
| `id` | bigint PK |
| `patient_id` | FK → **`users.id`** (paciente), cascade delete |
| `professional_id` | FK → `users.id`, cascade delete |
| `workspace_id` | FK → `workspaces.id` nullable, null on delete |
| `is_primary` | boolean default false |
| `role` | enum: `primary`, `secondary`, `substitute`, `co_therapist` (default `primary`) |
| `status` | enum: `active`, `paused`, `ended` (default `active`) |
| `started_at`, `ended_at` | date nullable |
| `notes` | text nullable |
| `created_at`, `updated_at` | timestamps |
| — | unique (`patient_id`, `professional_id`, `workspace_id`) |

### `services`

| Columna | Tipo / restricción |
|---------|-------------------|
| `id` | bigint PK |
| `workspace_id` | FK → `workspaces.id`, cascade delete |
| `name` | string |
| `description` | text nullable |
| `duration_minutes` | unsigned smallint default 50 |
| `price` | decimal(8,2) nullable |
| `color` | string(7) nullable |
| `is_active` | boolean default true |
| `created_at`, `updated_at` | timestamps |

### `availabilities`

| Columna | Tipo / restricción |
|---------|-------------------|
| `id` | bigint PK |
| `professional_id` | FK → `users.id`, cascade delete |
| `workspace_id` | FK → `workspaces.id` nullable, null on delete |
| `day_of_week` | unsigned tinyint |
| `start_time`, `end_time` | time |
| `slot_duration_minutes` | unsigned smallint default 50 |
| `is_active` | boolean default true |
| `created_at`, `updated_at` | timestamps |

### `appointments`

| Columna | Tipo / restricción |
|---------|-------------------|
| `id` | bigint PK |
| `workspace_id` | FK → `workspaces.id` nullable, null on delete |
| `patient_id` | FK → **`users.id`**, cascade delete |
| `professional_id` | FK → `users.id`, cascade delete |
| `service_id` | FK → `services.id` nullable, null on delete |
| `starts_at`, `ends_at` | timestamp |
| `status` | enum: `pending`, `confirmed`, `in_progress`, `completed`, `cancelled`, `no_show` (default `pending`) |
| `modality` | enum: `in_person`, `video_call` (default `video_call`) |
| `meeting_room_id`, `meeting_url` | string nullable |
| `cancellation_reason` | text nullable |
| `cancelled_by` | FK → `users.id` nullable, null on delete |
| `notes` | text nullable |
| `created_at`, `updated_at` | timestamps |
| `deleted_at` | timestamp nullable |

### `session_recordings`

| Columna | Tipo / restricción |
|---------|-------------------|
| `id` | bigint PK |
| `appointment_id` | FK → `appointments.id`, cascade delete |
| `audio_path` | string nullable |
| `transcription` | longText nullable |
| `ai_summary` | text nullable |
| `transcription_status` | enum: `pending`, `processing`, `completed`, `failed` (default `pending`) |
| `summarized_at` | timestamp nullable |
| `language` | string(10) default `es` |
| `duration_seconds` | unsigned int nullable |
| `created_at`, `updated_at` | timestamps |

### `notes`

| Columna | Tipo / restricción |
|---------|-------------------|
| `id` | bigint PK |
| `patient_id` | FK → **`patient_profiles.id`**, cascade delete |
| `user_id` | FK → `users.id`, cascade delete |
| `appointment_id` | FK → `appointments.id` nullable, null on delete |
| `content` | text |
| `type` | enum: `quick_note`, `session_note`, `observation`, `followup` (default `quick_note`) |
| `is_ai_generated` | boolean default false |
| `created_at`, `updated_at` | timestamps |
| `deleted_at` | timestamp nullable |

### `agreements`

| Columna | Tipo / restricción |
|---------|-------------------|
| `id` | bigint PK |
| `patient_id` | FK → **`patient_profiles.id`**, cascade delete |
| `user_id` | FK → `users.id`, cascade delete |
| `appointment_id` | FK → `appointments.id` nullable, null on delete |
| `content` | text |
| `is_completed` | boolean default false |
| `completed_at` | dateTime nullable |
| `created_at`, `updated_at` | timestamps |
| `deleted_at` | timestamp nullable |

### `consent_forms`

| Columna | Tipo / restricción |
|---------|-------------------|
| `id` | bigint PK |
| `patient_id` | FK → **`patient_profiles.id`**, cascade delete |
| `user_id` | FK → `users.id`, cascade delete |
| `template_version` | string |
| `content_snapshot` | longText |
| `status` | enum: `pending`, `signed`, `expired`, `revoked` (default `pending`) |
| `signed_at` | dateTime nullable |
| `signature_data` | text nullable |
| `signed_ip` | string nullable |
| `expires_at` | date nullable |
| `created_at`, `updated_at` | timestamps |
| `deleted_at` | timestamp nullable |

### `documents`

| Columna | Tipo / restricción |
|---------|-------------------|
| `id` | bigint PK |
| `patient_id` | FK → **`patient_profiles.id`**, cascade delete |
| `user_id` | FK → `users.id`, cascade delete |
| `workspace_id` | FK → `workspaces.id` nullable, null on delete |
| `name` | string |
| `local_path` | string nullable |
| `storage_type` | enum: `local`, `gdrive` (default `local`) |
| `gdrive_file_id`, `gdrive_url` | string nullable |
| `mime_type` | string nullable |
| `size_bytes` | unsigned int nullable |
| `category` | enum: `rgpd_consent`, `informed_consent`, `report`, `invoice`, `other` (default `other`) |
| `is_rgpd` | boolean default false |
| `expires_at` | date nullable |
| `created_at`, `updated_at` | timestamps |
| `deleted_at` | timestamp nullable |

### `kosmo_briefings`

| Columna | Tipo / restricción |
|---------|-------------------|
| `id` | bigint PK |
| `user_id` | FK → `users.id`, cascade delete |
| `patient_id` | FK → **`patient_profiles.id`** nullable, null on delete |
| `appointment_id` | FK → `appointments.id` nullable, null on delete |
| `type` | enum: `daily`, `pre_session`, `post_session`, `weekly`, `nudge` |
| `content` | json |
| `is_read` | boolean default false |
| `for_date` | date nullable |
| `created_at`, `updated_at` | timestamps |

### `invoices`

| Columna | Tipo / restricción |
|---------|-------------------|
| `id` | bigint PK |
| `workspace_id` | FK → `workspaces.id` nullable, null on delete |
| `patient_id` | FK → **`users.id`**, cascade delete |
| `professional_id` | FK → `users.id`, cascade delete |
| `invoice_number` | string UK |
| `status` | enum: `draft`, `sent`, `paid`, `overdue`, `cancelled` (default `draft`) |
| `issued_at` | timestamp nullable |
| `due_at` | date nullable |
| `paid_at` | timestamp nullable |
| `subtotal`, `tax_amount`, `total` | decimal(10,2) |
| `tax_rate` | decimal(5,2) default 0 |
| `payment_method` | enum nullable: `cash`, `transfer`, `card`, `bizum`, `stripe`, `other` |
| `stripe_payment_id` | string nullable |
| `notes` | text nullable |
| `pdf_path` | string nullable |
| `created_at`, `updated_at` | timestamps |
| `deleted_at` | timestamp nullable |

### `invoice_items`

| Columna | Tipo / restricción |
|---------|-------------------|
| `id` | bigint PK |
| `invoice_id` | FK → `invoices.id`, cascade delete |
| `description` | string |
| `quantity` | unsigned smallint default 1 |
| `unit_price`, `total` | decimal(10,2) |
| `appointment_id` | FK → `appointments.id` nullable, null on delete |
| `created_at`, `updated_at` | timestamps |

### `messages`

| Columna | Tipo / restricción |
|---------|-------------------|
| `id` | bigint PK |
| `workspace_id` | FK → `workspaces.id` nullable, null on delete |
| `sender_id` | FK → `users.id`, cascade delete |
| `receiver_id` | FK → `users.id`, cascade delete |
| `subject` | string nullable |
| `body` | text |
| `read_at` | timestamp nullable |
| `related_id` | unsigned bigint nullable (morph) |
| `related_type` | string nullable (morph) |
| `created_at`, `updated_at` | timestamps |
| `deleted_at` | timestamp nullable |

### `collaboration_agreements`

| Columna | Tipo / restricción |
|---------|-------------------|
| `id` | bigint PK |
| `professional_a_id` | FK → `users.id`, cascade delete |
| `professional_b_id` | FK → `users.id`, cascade delete |
| `workspace_id` | FK → `workspaces.id` nullable, null on delete |
| `start_date` | date |
| `end_date` | date nullable |
| `status` | enum: `pending`, `active`, `ended`, `cancelled` (default `pending`) |
| `terms` | json nullable |
| `created_at`, `updated_at` | timestamps |
| — | unique (`professional_a_id`, `professional_b_id`, `workspace_id`) |

### `referrals`

| Columna | Tipo / restricción |
|---------|-------------------|
| `id` | bigint PK |
| `from_professional_id` | FK → `users.id`, cascade delete |
| `to_professional_id` | FK → `users.id`, cascade delete |
| `patient_id` | FK → **`patient_profiles.id`**, cascade delete |
| `status` | enum: `pending`, `accepted`, `rejected`, `cancelled` (default `pending`) |
| `reason` | text nullable |
| `responded_at` | timestamp nullable |
| `created_at`, `updated_at` | timestamps |

---

## Spatie Permission (`config('permission.teams')` = false)

### `permissions`

| Columna | Tipo / restricción |
|---------|-------------------|
| `id` | bigint PK |
| `name`, `guard_name` | string |
| `created_at`, `updated_at` | timestamps |
| — | unique (`name`, `guard_name`) |

### `roles`

| Columna | Tipo / restricción |
|---------|-------------------|
| `id` | bigint PK |
| `name`, `guard_name` | string |
| `created_at`, `updated_at` | timestamps |
| — | unique (`name`, `guard_name`) |

### `model_has_permissions`

| Columna | Tipo / restricción |
|---------|-------------------|
| `permission_id` | FK → `permissions.id`, cascade delete |
| `model_type` | string |
| `model_id` | unsigned bigint |
| — | PK (`permission_id`, `model_id`, `model_type`) |

### `model_has_roles`

| Columna | Tipo / restricción |
|---------|-------------------|
| `role_id` | FK → `roles.id`, cascade delete |
| `model_type` | string |
| `model_id` | unsigned bigint |
| — | PK (`role_id`, `model_id`, `model_type`) |

### `role_has_permissions`

| Columna | Tipo / restricción |
|---------|-------------------|
| `permission_id` | FK → `permissions.id`, cascade delete |
| `role_id` | FK → `roles.id`, cascade delete |
| — | PK (`permission_id`, `role_id`) |

---

## Infraestructura Laravel (framework)

### `password_reset_tokens`

| Columna | Tipo / restricción |
|---------|-------------------|
| `email` | string PK |
| `token` | string |
| `created_at` | timestamp nullable |

### `sessions`

| Columna | Tipo / restricción |
|---------|-------------------|
| `id` | string PK |
| `user_id` | FK → `users.id` nullable, index |
| `ip_address` | string(45) nullable |
| `user_agent` | text nullable |
| `payload` | longText |
| `last_activity` | int, index |

### `cache` / `cache_locks`

**`cache`:** `key` PK, `value` mediumText, `expiration` int (index).

**`cache_locks`:** `key` PK, `owner` string, `expiration` int (index).

### `jobs` / `job_batches` / `failed_jobs`

**`jobs`:** `id` PK, `queue` string (index), `payload` longText, `attempts` tinyint, `reserved_at` int nullable, `available_at` int, `created_at` int.

**`job_batches`:** `id` string PK, `name`, `total_jobs`, `pending_jobs`, `failed_jobs`, `failed_job_ids` longText, `options` mediumText nullable, `cancelled_at` int nullable, `created_at`, `finished_at` int nullable.

**`failed_jobs`:** `id` PK, `uuid` UK, `connection`, `queue` text, `payload` longText, `exception` longText, `failed_at` timestamp.

---

## Uso en tareas de código

1. Antes de asumir un campo, **confirma en la migración** correspondiente si esta regla está desactualizada.
2. Al añadir migraciones nuevas, **replica aquí** tablas/columnas/enums/FKs afectados.
3. En factories y tests Pest, respeta **nullability**, **defaults** y **enums** tal como en las tablas anteriores.
