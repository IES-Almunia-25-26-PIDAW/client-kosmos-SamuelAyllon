---
adr: "0011"
title: Almacenamiento local cifrado (Drive eliminado)
date: 2026-04-24
status: Aceptado
---

# ADR-0011 — Almacenamiento local cifrado (Drive eliminado)

## Contexto

Los archivos de salud (consentimientos, facturas, notas exportadas) son datos de categoría especial RGPD Art. 9. Google Drive no garantiza al responsable del tratamiento control granular sobre accesos, retención y borrado, impidiendo cumplir Art. 32.

## Decisión

- Se usa disco `private` de Laravel (`storage/app/private/`, permisos `0600`) para todos los documentos sensibles.
- `DocumentCipherService::store()` cifra con `Crypt::encrypt()` (AES-256-CBC, `APP_KEY`) y calcula `sha256` para integridad.
- Las columnas `gdrive_*` en `documents` se marcan deprecated (nullable, sin nuevos writes).
- Las URLs temporales firmadas (`URL::temporarySignedRoute`, TTL 5 min) reemplazan los paths directos.
- Se añade `content_hash` y `encrypted` (bool) a la tabla `documents`.

## Consecuencias

**Positivas**
- Cadena de custodia demostrable; cumplimiento Art. 32 RGPD; cero coste de almacenamiento externo en MVP.

**Negativas**
- Storage en el mismo servidor que la app (en MVP es aceptable; en producción → volumen dedicado o S3 con SSE).

**Deuda**
- Rotación de `APP_KEY` requiere re-cifrado de todos los documentos (script pendiente, post-MVP).
