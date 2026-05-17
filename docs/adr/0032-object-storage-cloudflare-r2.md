---
adr: "0032"
title: "Almacenamiento de objetos en Cloudflare R2 para producción multi-servicio"
date: 2026-05-16
status: Aceptado
---

# ADR-0032 — Migrar `private` / `audio_chunks` / `public` a Cloudflare R2

## Contexto

El despliegue de Railway pasó a **multi-servicio** (web + queue + scheduler + reverb)
en [docs/deploy/railway-multiservice.md](../deploy/railway-multiservice.md). Cada
servicio corre en un contenedor independiente con su propio filesystem efímero.

Hay dos flujos productivos que **cruzan** entre el contenedor `app` (HTTP) y el
contenedor `queue` (worker):

1. **Audio para transcripción.** [`TranscribeAction`](../../app/Http/Controllers/Appointment/TranscribeAction.php)
   recibe chunks por HTTP, los cifra con `Crypt::encryptString` y los escribe en
   el disco `local`. Encola [`TranscribeChunkJob`](../../app/Jobs/TranscribeChunkJob.php),
   que **lee** ese mismo path desde el contenedor `queue`.
2. **Facturas PDF.** [`BillingService`](../../app/Services/BillingService.php#L55)
   genera el PDF (dompdf) y lo guarda en el disco `private`.
   [`SendInvoiceEmailJob`](../../app/Jobs/SendInvoiceEmailJob.php) (cola) y
   [`Portal\Invoice\DownloadPdfAction`](../../app/Http/Controllers/Portal/Invoice/DownloadPdfAction.php)
   lo leen — el primero desde `queue`, el segundo desde `app`.

Railway permite **un solo servicio por volumen persistente**. Sin storage
compartido, los dos flujos se rompen en producción: el worker no ve el chunk de
audio, el `app` no ve el PDF generado por el job, etc.

Alternativas evaluadas:

| Opción | Pros | Contras |
|---|---|---|
| **A. Volver a single-container** (queue + web juntos) | Cero infra extra | Pierde escalado independiente; un crash del worker tumba la web; tampoco cubre el caso futuro de tener 2 réplicas del web |
| **B. AWS S3** | Estable, primera opción documentada | Cobra **egress** — costoso si en algún momento publicamos audios o PDFs |
| **C. Cloudflare R2** | API S3-compatible (sin código nuevo más allá del driver), 10 GB de almacenamiento gratis, **egress gratis** (R2 → cualquier sitio), latencia similar a S3 desde Europa | Provider externo a Railway; requiere cuenta CF + token |

R2 gana porque la app sirve PDFs y audio firmados al frontend con frecuencia
(cada descarga de factura, cada listado de portal del paciente) y el coste de
egress de AWS sería el doble de la factura de almacenamiento.

## Decisión

1. **Adoptar Cloudflare R2** como object storage para los discos `private`,
   `audio_chunks` y `public`.
2. Añadir la dependencia `league/flysystem-aws-s3-v3` (driver oficial de Laravel
   para cualquier S3-compatible). Trae `aws/aws-sdk-php` como transitiva — ya
   estaba en `composer.lock` como `provides`, ahora se eleva a `require`.
3. `config/filesystems.php` selecciona driver por env (`s3` cuando `AWS_BUCKET`
   está set; `local` en dev). **No** se duplican los discos — `private` sigue
   llamándose `private`, sólo cambia el backend efectivo.
4. Encriptación: el flujo de audio sigue cifrando con `Crypt::encryptString`
   **antes** de escribir al disco. R2 ya cifra at-rest, pero mantenemos la
   capa aplicativa para que un fallo de IAM/token no exponga audio en claro.
5. Variables R2 nuevas en Railway (`app`, `queue` y `scheduler`):
   `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_BUCKET`,
   `AWS_DEFAULT_REGION=auto`, `AWS_ENDPOINT=https://<account>.r2.cloudflarestorage.com`,
   `AWS_USE_PATH_STYLE_ENDPOINT=true`, `FILESYSTEM_DISK=s3`.
6. El volumen `app-volume-ZS4g` (Railway) se mantiene **temporalmente** como
   destino de `storage/logs` y caches; deja de usarse para `storage/app/*`.

## Consecuencias

- Los discos `private`/`audio_chunks`/`public` pasan a tener latencia de red
  (~30-80 ms desde el data center de Railway al de R2 más cercano). El cliente
  Whisper ya hace HTTP a OpenAI/Groq, así que el coste relativo es bajo.
- Coste R2: 10 GB y operaciones clase A < 1 M/mes son gratis. ClientKosmos en su
  fase actual queda muy por debajo. Sin coste de egress.
- Backups: R2 no tiene snapshot nativo; se programa export semanal a otro
  bucket o local — fuera de scope de este ADR.
- Migración de datos existentes en el volumen: ver
  [docs/deploy/cloudflare-r2-setup.md](../deploy/cloudflare-r2-setup.md).
- Tests de Pest siguen usando `Storage::fake('private')` etc. — sin cambios.

## Referencias

- [docs/deploy/cloudflare-r2-setup.md](../deploy/cloudflare-r2-setup.md) — runbook
- [docs/deploy/railway-multiservice.md](../deploy/railway-multiservice.md) — origen del problema
- Cloudflare R2: <https://developers.cloudflare.com/r2/api/s3/>
- Laravel filesystems: <https://laravel.com/docs/12.x/filesystem#driver-prerequisites>
