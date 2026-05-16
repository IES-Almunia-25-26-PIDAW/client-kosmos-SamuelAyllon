# Despliegue multi-servicio en Railway

Continuación de [`railway-bootstrap.md`](./railway-bootstrap.md). Cubre el paso
siguiente al bootstrap del servicio `app`: añadir los procesos auxiliares
(`queue`, `scheduler`, `reverb`) que la app necesita para funcionar al 100 %.

> **Por qué tres servicios extra.** El contenedor `app` (FrankenPHP) sólo sirve
> HTTP. Sin worker de cola, los jobs en la tabla `jobs` no se ejecutan
> (recordatorios de pago, briefings de Kosmo, no-shows, Whisper, emails…).
> Sin scheduler, las 8 tareas declaradas en [routes/console.php](../../routes/console.php)
> no disparan nunca. Sin Reverb, todo Echo del frontend (videoconsulta,
> notificaciones realtime, mensajería) falla en silencio.

---

## 1. Arquitectura objetivo

Todos los servicios usan **la misma imagen Docker** construida desde el
[Dockerfile](../../Dockerfile) raíz. Se diferencian únicamente por la variable
`CONTAINER_ROLE` que lee [docker-entrypoint.sh](../../docker-entrypoint.sh):

| Servicio Railway | `CONTAINER_ROLE` | Proceso final | Healthcheck |
|---|---|---|---|
| `app` (ya existe)   | `web` (default)  | `frankenphp run --config /etc/caddy/Caddyfile` | `GET /up` |
| `queue`             | `queue`          | `php artisan queue:work --tries=3 --max-time=3600` | ninguno (worker) |
| `scheduler`         | `scheduler`      | `php artisan schedule:work` | ninguno (loop) |
| `reverb`            | `reverb`         | `php artisan reverb:start --host=0.0.0.0 --port=$PORT` | TCP a `$PORT` |

Sólo el rol `web` corre `migrate`/`seed`/`config:cache`. Los demás esperan a
que MySQL responda y arrancan su loop — no tocan el esquema, no compiten en
deploy.

---

## 2. Variables comunes (referencias al servicio `app`)

Para no duplicar 30 variables por servicio, todos los nuevos referencian al
`app` con `${{app.VAR}}`. Cualquier cambio en `app` se propaga automáticamente.

Bloque común mínimo para `queue`, `scheduler`, `reverb`:

```env
APP_NAME=${{app.APP_NAME}}
APP_ENV=${{app.APP_ENV}}
APP_DEBUG=${{app.APP_DEBUG}}
APP_KEY=${{app.APP_KEY}}
APP_URL=${{app.APP_URL}}
APP_LOCALE=${{app.APP_LOCALE}}
APP_FALLBACK_LOCALE=${{app.APP_FALLBACK_LOCALE}}

DB_CONNECTION=${{app.DB_CONNECTION}}
DB_HOST=${{app.DB_HOST}}
DB_PORT=${{app.DB_PORT}}
DB_DATABASE=${{app.DB_DATABASE}}
DB_USERNAME=${{app.DB_USERNAME}}
DB_PASSWORD=${{app.DB_PASSWORD}}

SESSION_DRIVER=${{app.SESSION_DRIVER}}
CACHE_STORE=${{app.CACHE_STORE}}
QUEUE_CONNECTION=${{app.QUEUE_CONNECTION}}
LOG_CHANNEL=${{app.LOG_CHANNEL}}
FILESYSTEM_DISK=${{app.FILESYSTEM_DISK}}

BROADCAST_CONNECTION=${{app.BROADCAST_CONNECTION}}

# Integraciones que los jobs invocan: OpenAI (Whisper, Kosmo), Stripe,
# Google Calendar, Mail. Si falta alguna, el job correspondiente revienta.
OPENAI_API_KEY=${{app.OPENAI_API_KEY}}
STRIPE_KEY=${{app.STRIPE_KEY}}
STRIPE_SECRET=${{app.STRIPE_SECRET}}
STRIPE_WEBHOOK_SECRET=${{app.STRIPE_WEBHOOK_SECRET}}
GOOGLE_CLIENT_ID=${{app.GOOGLE_CLIENT_ID}}
GOOGLE_CLIENT_SECRET=${{app.GOOGLE_CLIENT_SECRET}}
GOOGLE_REDIRECT_URI=${{app.GOOGLE_REDIRECT_URI}}
MAIL_MAILER=${{app.MAIL_MAILER}}
MAIL_HOST=${{app.MAIL_HOST}}
MAIL_PORT=${{app.MAIL_PORT}}
MAIL_USERNAME=${{app.MAIL_USERNAME}}
MAIL_PASSWORD=${{app.MAIL_PASSWORD}}
MAIL_ENCRYPTION=${{app.MAIL_ENCRYPTION}}
MAIL_FROM_ADDRESS=${{app.MAIL_FROM_ADDRESS}}
MAIL_FROM_NAME=${{app.MAIL_FROM_NAME}}
```

> Las refs se evalúan en cada deploy. Si más adelante migras a `QUEUE_CONNECTION=redis`,
> basta con cambiarlo en `app` y redeployar los 4 servicios.

---

## 3. Procedimiento

### 3.1. Servicio `queue`

```bash
railway service create queue --source-repo Samu-Mind/client-kosmos-SamuelAyllon

railway variables --service queue --set \
  CONTAINER_ROLE=queue \
  'APP_KEY=${{app.APP_KEY}}' \
  'APP_ENV=${{app.APP_ENV}}' \
  'APP_URL=${{app.APP_URL}}' \
  'DB_HOST=${{app.DB_HOST}}' \
  'DB_PORT=${{app.DB_PORT}}' \
  'DB_DATABASE=${{app.DB_DATABASE}}' \
  'DB_USERNAME=${{app.DB_USERNAME}}' \
  'DB_PASSWORD=${{app.DB_PASSWORD}}' \
  'DB_CONNECTION=${{app.DB_CONNECTION}}' \
  'QUEUE_CONNECTION=${{app.QUEUE_CONNECTION}}' \
  'CACHE_STORE=${{app.CACHE_STORE}}' \
  'SESSION_DRIVER=${{app.SESSION_DRIVER}}' \
  'LOG_CHANNEL=${{app.LOG_CHANNEL}}' \
  'FILESYSTEM_DISK=${{app.FILESYSTEM_DISK}}' \
  'OPENAI_API_KEY=${{app.OPENAI_API_KEY}}' \
  'STRIPE_SECRET=${{app.STRIPE_SECRET}}' \
  'GOOGLE_CLIENT_ID=${{app.GOOGLE_CLIENT_ID}}' \
  'GOOGLE_CLIENT_SECRET=${{app.GOOGLE_CLIENT_SECRET}}' \
  'MAIL_MAILER=${{app.MAIL_MAILER}}' \
  'MAIL_HOST=${{app.MAIL_HOST}}' \
  'MAIL_PORT=${{app.MAIL_PORT}}' \
  'MAIL_USERNAME=${{app.MAIL_USERNAME}}' \
  'MAIL_PASSWORD=${{app.MAIL_PASSWORD}}' \
  'MAIL_FROM_ADDRESS=${{app.MAIL_FROM_ADDRESS}}'

# Sin dominio público y sin healthcheck HTTP:
railway service update queue \
  --healthcheck-path "" \
  --restart-policy-type ON_FAILURE \
  --restart-policy-max-retries 5
```

Verificación:

```bash
railway logs --service queue
# Esperar líneas tipo:  [yyyy-mm-dd hh:mm:ss] Processing: App\Jobs\...
```

### 3.2. Servicio `scheduler`

Mismo bloque de variables que `queue`, cambiando sólo:

```bash
railway service create scheduler --source-repo Samu-Mind/client-kosmos-SamuelAyllon
railway variables --service scheduler --set CONTAINER_ROLE=scheduler  # + bloque común
```

> Una **única instancia** del scheduler debe correr en producción. Si en algún
> momento escalas el servicio a >1 réplica, los jobs programados se dispararán
> en duplicado. Mantén `replicas=1`.

### 3.3. Servicio `reverb`

Reverb sí necesita dominio público porque el cliente JS se conecta vía
WebSocket desde el navegador.

```bash
railway service create reverb --source-repo Samu-Mind/client-kosmos-SamuelAyllon
railway domain create --service reverb         # genera reverb-xxx.up.railway.app
railway variables --service reverb --set \
  CONTAINER_ROLE=reverb \
  PORT=8080 \
  BROADCAST_CONNECTION=reverb \
  REVERB_APP_ID=<genera-uno> \
  REVERB_APP_KEY=<genera-uno> \
  REVERB_APP_SECRET=<genera-uno> \
  REVERB_HOST=0.0.0.0 \
  REVERB_PORT=8080 \
  REVERB_SCHEME=https
  # + bloque común
```

> Genera valores únicos con `php artisan reverb:install --no-interaction` en
> local y copia los tres `REVERB_APP_*`. Cuidado: estos mismos valores deben
> propagarse al servicio `app` (los usa el servidor para firmar broadcasts) y
> el `KEY` debe llegar al frontend (`VITE_REVERB_*` — paso 3.4).

Healthcheck: Railway TCP (no HTTP — Reverb no expone `/up`).

### 3.4. Re-build del frontend con `VITE_REVERB_*`

Crítico y fácil de olvidar: las variables `VITE_REVERB_*` viajan al **bundle JS
en build time**. El bundle actual del servicio `app` apunta a `localhost:8080`
porque se construyó sin ellas. Para que el frontend hable con el Reverb de
Railway hay que:

1. Añadir al servicio `app` (los `VITE_*` se inyectan a Vite vía Railpack):

   ```bash
   railway variables --service app --set \
     'VITE_REVERB_APP_KEY=${{reverb.REVERB_APP_KEY}}' \
     'VITE_REVERB_HOST=reverb-xxx.up.railway.app' \
     'VITE_REVERB_PORT=443' \
     'VITE_REVERB_SCHEME=https' \
     'BROADCAST_CONNECTION=reverb' \
     'REVERB_APP_ID=${{reverb.REVERB_APP_ID}}' \
     'REVERB_APP_KEY=${{reverb.REVERB_APP_KEY}}' \
     'REVERB_APP_SECRET=${{reverb.REVERB_APP_SECRET}}' \
     'REVERB_HOST=reverb-xxx.up.railway.app' \
     'REVERB_PORT=443' \
     'REVERB_SCHEME=https'
   ```

2. Redeploy del servicio `app` (`railway redeploy --service app`) — al
   reconstruir, Vite incrusta los nuevos valores en el JS.

---

## 4. Storage compartido entre servicios

Los PDFs de facturas y las grabaciones temporales viven en `/app/storage/app`.
El servicio `app` ya monta ahí el volumen `app-volume-ZS4g`. Para que `queue`
(que es quien genera/lee esos archivos en jobs) los vea, **monta el mismo
volumen** en el servicio `queue`:

```bash
railway volume attach app-volume-ZS4g --service queue --mount-path /app/storage/app
```

> Railway permite adjuntar un mismo volumen a varios servicios siempre que
> estén en el mismo entorno. Si en algún momento la concurrencia de escrituras
> entre `app` y `queue` se vuelve un problema, migra a S3/R2 con
> `FILESYSTEM_DISK=s3`.

`scheduler` y `reverb` no necesitan el volumen.

---

## 5. Verificación end-to-end

| Comprobación | Comando | Resultado esperado |
|---|---|---|
| Web responde | `curl -fsS https://<APP_DOMAIN>/up` | `HTTP 200` |
| Queue procesa | `railway logs --service queue --tail 50` | `Processing: App\Jobs\...` |
| Scheduler dispara | `railway logs --service scheduler --tail 50` | Cada 60 s: `Running scheduled tasks` |
| Reverb escucha | `curl -fsS https://<REVERB_DOMAIN>/app/<KEY>` | Respuesta JSON de Pusher protocol |
| Echo cliente | Abrir DevTools → Network → WS | Conexión `wss://<REVERB_DOMAIN>/app/...` en estado `101 Switching Protocols` |
| Job manual | `railway run --service app php artisan tinker --execute='dispatch(new App\Jobs\SendPaymentReminder);'` | Aparece procesado en logs de `queue` en <10 s |

---

## 6. Coste y escalado

- `queue`, `scheduler`, `reverb` arrancan en plan Hobby con la imagen mínima
  (~200 MB) y casi cero CPU/RAM idle.
- Escala `queue` horizontalmente si el backlog crece (varios workers en
  paralelo son seguros — Laravel usa `SELECT … FOR UPDATE SKIP LOCKED`).
- `scheduler` **nunca** debe tener más de una réplica.
- `reverb` puede escalar pero requiere sticky sessions o adaptador Redis
  (`REVERB_SCALING_*`). Empieza con 1 réplica.

---

## 7. Referencias

- [docker-entrypoint.sh](../../docker-entrypoint.sh) — switch `CONTAINER_ROLE`
- [routes/console.php](../../routes/console.php) — tareas del scheduler
- [config/broadcasting.php](../../config/broadcasting.php) — driver Reverb
- [railway-bootstrap.md](./railway-bootstrap.md) — primer deploy del servicio `app`
- Laravel queues: <https://laravel.com/docs/12.x/queues#running-the-queue-worker>
- Laravel Reverb: <https://laravel.com/docs/12.x/reverb#production-readiness>
- Railway service refs: <https://docs.railway.com/guides/variables#reference-variables>
