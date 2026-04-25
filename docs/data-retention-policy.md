# Política de retención de datos — ClientKosmos

> **Última actualización:** 2026-04-24
> **Ámbito:** todos los datos tratados por ClientKosmos en el contexto de consulta de profesionales psicólogos y terapeutas autónomos en España.
> **Referencias legales:** RGPD (Reglamento 2016/679), LOPDGDD (Ley Orgánica 3/2018), Ley 41/2002 de Autonomía del Paciente, Ley 37/1992 del IVA, Ley 58/2003 General Tributaria.

Este documento define el tiempo de retención aplicable a cada categoría de datos y el mecanismo operativo que lo ejecuta. La política se aplica automáticamente donde es posible y manualmente a petición del interesado (derecho al olvido) cuando procede.

---

## 1. Tabla maestra de retención

| Categoría | Plazo | Base legal / motivo | Mecanismo |
|---|---|---|---|
| **Audio crudo de sesión** (WebM, chunks temporales) | 24 horas tras transcribir | Minimización (RGPD art. 5.1.c) — el audio solo es medio para generar transcripción | Comando `audio:cleanup` diario |
| **Transcripción de sesión** (`session_recordings.transcription`) | 5 años desde el último contacto con el paciente | Ley 41/2002 art. 17.1 — historia clínica | Retención por defecto; purga manual o al cerrar el expediente |
| **Resumen IA** (`session_recordings.ai_summary`) | Mismo plazo que la transcripción | Forma parte de la historia clínica | Retención por defecto |
| **Notas clínicas** (`notes.content`, `patient_profiles.clinical_notes`) | 5 años desde el último contacto | Ley 41/2002 art. 17.1 | Retención por defecto |
| **Formularios de consentimiento firmados** (`consent_forms`) | 5 años desde revocación o expiración | Prueba de consentimiento (RGPD art. 7.1) | Retención + soft-delete |
| **Facturas** (`invoices`, PDFs en disco `private`) | 6 años | Ley 58/2003 art. 66 — prescripción fiscal | Retención obligatoria, no purgable hasta vencer plazo |
| **Datos de facturación del profesional** | 6 años | Misma base legal | Retención obligatoria |
| **Acuerdos de sesión** (`agreements`) | 5 años desde el último contacto | Historia clínica derivada | Retención por defecto |
| **Logs de audit** (`activity_log`) | 2 años | Trazabilidad RGPD (art. 5.2 — responsabilidad proactiva) | Purga automática mensual |
| **Datos de sesión HTTP / login** | 90 días | Seguridad operativa | Rotación automática |
| **Backups cifrados de DB** | 30 días | Continuidad operativa | Rotación diaria |
| **Cuentas de usuario inactivas sin historial** | 3 años sin actividad | RGPD art. 5.1.e (limitación del plazo) | Aviso al usuario + soft-delete |

---

## 2. Borrado del audio crudo (`audio:cleanup`)

- Los chunks de audio capturados por el profesional durante la sesión se almacenan en el disco `audio_chunks` (`storage/app/chunks/`) con permisos restrictivos (0600).
- Cada chunk se borra **inmediatamente después** de ser transcrito correctamente por `TranscribeChunkJob`.
- Si el job falla, el chunk permanece como máximo 24 horas: el comando scheduled `audio:cleanup` (cron diario a las 03:00) elimina todos los archivos con mtime > 24 h.
- En ningún caso el audio crudo se retiene más de 24 h: la transcripción se considera el registro clínico definitivo.

## 3. Cifrado en reposo

Los campos sensibles se cifran a nivel ORM con el cast `encrypted` de Laravel (AES-256-CBC con HMAC, clave `APP_KEY`):

- `users.google_refresh_token`, `users.gdrive_refresh_token`
- `patient_profiles.clinical_notes`, `diagnosis`, `treatment_plan`
- `notes.content`
- `session_recordings.transcription`, `ai_summary`
- `transcription_segments.text`

Los archivos en el disco `private` se cifran a nivel de aplicación (`Crypt::encrypt` para archivos pequeños) y en producción se delega al cifrado de volumen (LUKS) a nivel de servidor.

## 4. Derecho al olvido (RGPD art. 17)

El paciente puede solicitar la supresión de sus datos en cualquier momento:

1. El profesional recibe la solicitud y la procesa desde la ficha del paciente → **Eliminar cuenta**.
2. Se ejecuta un **hard-delete auditado**:
   - Notas, acuerdos, documentos: borrado físico.
   - Transcripciones y resúmenes: borrado físico.
   - Consentimientos: se conservan con `content_snapshot` pseudonimizado durante 5 años (prueba legal frente a reclamaciones).
   - Facturas emitidas: **no se pueden borrar** hasta cumplir el plazo fiscal de 6 años, por obligación legal (Ley 58/2003). Se informa al paciente de este requisito.
3. La solicitud, la fecha y el alcance del borrado quedan registrados en `activity_log` para demostrar cumplimiento.

## 5. Revocación de consentimientos

- Revocables desde el portal del paciente: **Ajustes → Perfil → Mis consentimientos**.
- La revocación es inmediata:
  - **Consentimiento de grabación:** `TranscribeChunkJob` verifica el consentimiento antes de cada chunk; si se revoca mid-session, los chunks siguientes se descartan y la transcripción se marca `rejected_no_consent`.
  - **Política de privacidad / términos del servicio:** la revocación implica cierre de cuenta (conversación previa con el profesional).
  - **Tratamiento de datos de salud:** no revocable desde UI; requiere solicitud formal y cierre de cuenta.
- El `ConsentForm` original se conserva con `status = 'revoked'` durante 5 años como prueba.

## 6. Exportabilidad (RGPD art. 20)

El paciente tiene derecho a recibir sus datos en formato estructurado. Queda fuera del alcance del MVP y se gestiona manualmente por el profesional bajo petición (export JSON/PDF por expediente). Se añadirá UI de autoservicio en post-MVP.

## 7. Revisión de la política

Esta política se revisa al menos una vez al año y siempre que cambie alguna base legal o la arquitectura de almacenamiento. Los cambios se reflejan en el campo *Última actualización* de la cabecera y en [decision-log.md](decision-log.md).
