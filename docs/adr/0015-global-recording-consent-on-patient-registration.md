---
adr: "0015"
title: Consentimiento global de grabación en el alta del paciente
date: 2026-04-24
status: Aceptado
---

# ADR-0015 — Consentimiento global de grabación en el alta del paciente

## Contexto

El MVP graba audio de cada sesión y lo procesa con IA (Whisper para transcripción + Llama 3.3 para resumen). Estos datos son categoría especial RGPD (art. 9), y la decisión automatizada con resumen IA cae además bajo art. 22. La opción inicial era pedir consentimiento en cada sesión (ver §5.3 del roadmap), pero eso introduce fricción innecesaria en la UX del paciente y puede llevar a "click fatigue" que degrade el valor probatorio del consentimiento.

## Decisión

El consentimiento para grabar las sesiones se recoge **una sola vez** en el momento del registro del paciente, junto con otros 3 consentimientos obligatorios:

1. Política de privacidad.
2. Términos del servicio.
3. Tratamiento de datos de salud (RGPD art. 9.2.h).
4. Grabación + transcripción IA (RGPD art. 22).

Los 4 son bloqueantes: sin marcar las 4 casillas el botón "Registrarse" queda deshabilitado y el alta no se completa. Cada checkbox crea un `ConsentForm` con `template_version`, `content_snapshot` (texto literal aceptado), `signed_at`, `signed_ip` y `signature_data = 'checkbox_registration'`.

En la sala de espera del paciente se muestra un **recordatorio informativo no bloqueante** del consentimiento de grabación, en cumplimiento del principio de transparencia (RGPD art. 13).

`TranscribeChunkJob` re-valida `RgpdService::hasActiveRecordingConsent()` antes de cada chunk (no solo al inicio de la llamada), lo que cubre el caso de revocación mid-session: si el paciente revoca desde su portal, los chunks siguientes se descartan y la `SessionRecording` se marca `transcription_status = 'rejected_no_consent'`.

El paciente puede revocar cualquiera de los 4 consentimientos desde **Ajustes → Perfil → Mis consentimientos**, salvo el de tratamiento de datos de salud (cuya revocación implica cierre de cuenta y se gestiona por canal de soporte).

## Consecuencias

**Positivas**
- UX limpia: el paciente no tiene que aceptar cada vez que entra en una sala.
- Trazabilidad sólida: cada consentimiento queda con su versión, IP y momento.
- Revocación granular respetando art. 7.3 RGPD.
- La validación per-chunk en `TranscribeChunkJob` cubre el escenario de revocación durante la sesión sin perder datos antes del consentimiento.

**Negativas**
- Si la plantilla legal cambia, hay que invalidar consentimientos antiguos y pedir re-firma — gestionado vía `template_version` pero requiere proceso operativo cuando ocurra.
- Un paciente que revoque el consentimiento de tratamiento de datos de salud debe pasar por cierre de cuenta, lo que genera fricción que conviene comunicar al alta.
