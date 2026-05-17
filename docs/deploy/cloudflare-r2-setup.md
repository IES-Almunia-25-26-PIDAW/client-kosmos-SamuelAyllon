# Setup de Cloudflare R2 para ClientKosmos

Runbook para conectar los discos `local` / `private` / `audio_chunks` / `public`
a Cloudflare R2 en el entorno multi-servicio de Railway. Razones de la decisión:
[ADR-0032](../adr/0032-object-storage-cloudflare-r2.md).

---

## 0. Resumen

- **Bucket único** con prefijos por disco: `local/`, `private/`, `chunks/`, `public/`.
- **Servicios Railway que necesitan las creds**: `app`, `queue`, `scheduler`
  (los tres acceden a storage en algún flujo). `reverb` **no** las necesita.
- **Encriptación**: el flujo de audio sigue cifrando con `Crypt::encryptString`
  antes de subir, además del cifrado at-rest de R2.

---

## 1. Crear cuenta y bucket en Cloudflare

1. Crear cuenta gratis en <https://dash.cloudflare.com/sign-up> (si aún no la tienes).
2. Panel → **R2 Object Storage** → "Enable R2" (te pide tarjeta como verificación;
   la capa gratis cubre 10 GB de storage + 1 M de operaciones clase A/mes).
3. **Create bucket** → nombre `clientkosmos` (mismo nombre en todos los entornos),
   location hint `EU` (latencia más baja desde Railway EU).
4. Tras crear el bucket, anotar el endpoint:
   ```
   https://<TU_ACCOUNT_ID>.r2.cloudflarestorage.com
   ```
   El `ACCOUNT_ID` aparece en la sidebar derecha del panel R2 ("Account ID").

---

## 2. Crear API Token

1. R2 → **Manage R2 API Tokens** → **Create API Token**.
2. Permissions: **Object Read & Write**.
3. Specify bucket: `Apply to specific buckets only` → seleccionar `clientkosmos`.
4. TTL: `Forever` (rotación manual).
5. Click **Create API Token** — Cloudflare muestra:
   - **Access Key ID** → usar como `AWS_ACCESS_KEY_ID`
   - **Secret Access Key** → usar como `AWS_SECRET_ACCESS_KEY`
   - Estos valores **solo se muestran una vez**. Cópialos a un gestor de
     contraseñas antes de cerrar la página.

---

## 3. Setear variables en Railway

Las **tres** variables siguientes van en `app`, `queue` y `scheduler` (puedes
usar refs `${{ app.VAR }}` en `queue` y `scheduler` para no duplicar):

| Variable | Valor |
|---|---|
| `STORAGE_BACKEND` | `s3` |
| `FILESYSTEM_DISK` | `s3` |
| `AWS_ACCESS_KEY_ID` | (del paso 2) |
| `AWS_SECRET_ACCESS_KEY` | (del paso 2) |
| `AWS_BUCKET` | `clientkosmos` |
| `AWS_DEFAULT_REGION` | `auto` |
| `AWS_ENDPOINT` | `https://<TU_ACCOUNT_ID>.r2.cloudflarestorage.com` |
| `AWS_USE_PATH_STYLE_ENDPOINT` | `true` |

> ⚠️ R2 **requiere** `path-style` endpoint. Si lo dejas en `false` el SDK
> intenta `bucket.endpoint` (virtual-host style) y R2 responde 404.

`AWS_URL` se puede dejar sin set (no se usa salvo que el disco `public` sirva
URLs públicas, lo cual requiere domain bind en R2 — ver §5).

---

## 4. Migrar datos existentes

Antes del primer deploy con `STORAGE_BACKEND=s3` hay que mover lo que ya esté
en el volumen `/app/storage/app` del servicio `app` al bucket. Los datos
candidatos son:

- `storage/app/private/invoices/*.pdf` — facturas ya generadas
- `storage/app/private/<varios>` — documentos clínicos y consentimientos
- `storage/app/chunks/*` — chunks de audio en vuelo (probablemente vacío fuera de horas con grabación activa)
- `storage/app/public/*` — uploads públicos (probablemente vacío o pocos)

### Opción A — Migración manual con `rclone` (recomendada)

```bash
# 1. Instalar rclone en local
# 2. Configurar remote para R2:
rclone config
# > New remote: r2
# > Storage: 5 (Amazon S3 Compliant Storage)
# > provider: 19 (Cloudflare R2)
# > access_key_id / secret_access_key del paso 2
# > region: auto
# > endpoint: https://<ACCOUNT_ID>.r2.cloudflarestorage.com

# 3. Desde local, descargar el volumen Railway a una carpeta tmp:
railway connect --service app    # entra al contenedor
# dentro del contenedor: tar czf /tmp/storage.tgz storage/app/
# fuera: railway run --service app cat /tmp/storage.tgz > storage.tgz
tar xzf storage.tgz

# 4. Subir cada subdirectorio al prefijo correspondiente en R2:
rclone sync storage/app/private  r2:clientkosmos/private  --progress
rclone sync storage/app/chunks   r2:clientkosmos/chunks   --progress
rclone sync storage/app/public   r2:clientkosmos/public   --progress
```

### Opción B — Empezar de cero

Si el entorno de Railway es solo de pruebas y los PDFs/documentos existentes
no son críticos, puedes saltar la migración y vaciar el volumen. Las facturas
que se generen tras el switch ya van directas a R2.

---

## 5. Disco `public` y URLs públicas (opcional)

`Storage::disk('public')->url(...)` necesita que el bucket sea accesible
desde internet. Para R2 hay dos caminos:

1. **r2.dev domain** (gratis, rate-limited, no apto para producción seria):
   R2 → bucket `clientkosmos` → Settings → "Public Access" → "Allow Access".
   Cloudflare te da `https://pub-xxx.r2.dev`. Setear `AWS_URL=https://pub-xxx.r2.dev`.
2. **Custom domain** (recomendado para producción):
   R2 → bucket → Settings → "Custom Domains" → conectar `cdn.clientkosmos.app`
   (o subdominio). Setear `AWS_URL=https://cdn.clientkosmos.app`. Requiere
   que el dominio raíz ya esté en Cloudflare.

Si en este momento `disk('public')` no se usa fuera de tests, puedes ignorar
esta sección — los discos `private` y `audio_chunks` no necesitan URL pública
(la app entrega los bytes vía controllers protegidos).

---

## 6. Verificación post-deploy

Tras setear las vars en Railway y dejar que los 3 servicios redespleguen:

```bash
# 1. /up sigue respondiendo 200
curl -fsS https://clientkosmos.up.railway.app/up

# 2. Listar contenido del bucket desde la app
railway run --service app \
  php artisan tinker --execute='echo \Storage::disk("private")->files()->implode("\n");'

# 3. Smoke test del flujo factura: generar una y descargarla desde portal
#    → la URL de descarga debe devolver el PDF aunque el contenedor app sea distinto del que la generó
```

En logs:

- `queue` ya no debería dar `FileNotFoundException` al procesar `SendInvoiceEmailJob`.
- `TranscribeChunkJob` debería poder leer el chunk de audio escrito por
  `app` minutos antes.

---

## 7. Coste y monitoreo

| Recurso | Cuota gratis mensual | Cliente típico ClientKosmos |
|---|---|---|
| Almacenamiento | 10 GB | <500 MB (PDFs facturas + chunks 24h) |
| Operaciones clase A (writes) | 1.000.000 | ~5.000 |
| Operaciones clase B (reads) | 10.000.000 | ~20.000 |
| Egress | **Ilimitado gratis** | n/a |

Monitor desde R2 → bucket → "Metrics". Si en algún momento se acerca al
límite, considerar mover audio chunks (los más voluminosos) a un bucket
con TTL agresivo o purga diaria por job.

---

## 8. Rollback

Si algo sale mal, basta con poner `STORAGE_BACKEND=local` en Railway
(o borrar la variable) y redeployar. Los discos vuelven a apuntar al
volumen Railway. **No hay code change para rollback** — toda la lógica
está en `config/filesystems.php`.

Los datos ya subidos a R2 no se pierden — quedan en el bucket hasta que
los borres manualmente desde el dashboard de Cloudflare.

---

## 9. Referencias

- [ADR-0032](../adr/0032-object-storage-cloudflare-r2.md) — decisión y trade-offs
- [config/filesystems.php](../../config/filesystems.php) — implementación
- R2 API S3 compat: <https://developers.cloudflare.com/r2/api/s3/>
- R2 pricing: <https://developers.cloudflare.com/r2/pricing/>
- rclone con R2: <https://developers.cloudflare.com/r2/examples/rclone/>
