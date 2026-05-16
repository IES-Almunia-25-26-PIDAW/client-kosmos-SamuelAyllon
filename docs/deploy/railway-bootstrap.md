# Bootstrap del despliegue en Railway

Procedimiento real, con todas las trampas encontradas, para llevar
ClientKosmos a Railway desde un proyecto vacío. Sustituye al runbook
operativo [deploy/RAILWAY.md](../../deploy/RAILWAY.md), que describe la
operativa diaria.

**Ejecutado:** 2026-05-16 con la skill [`use-railway`](../../.agents/skills/use-railway/SKILL.md) (MCP + CLI).

---

## 0. Estado de partida y resultado

| Recurso | ID / Detalle |
|---|---|
| Proyecto Railway `clientkosmos` | `4495a3db-46a7-4ff4-83d3-08867f1abc18` |
| Entorno `production` | `c0103637-3b92-4c5c-bad2-0746c477bcb5` |
| Servicio `MySQL` | template oficial `mysql` (mysql:9.4) |
| Servicio `app` | servicio "empty" + `railway up` (tarball local) — `155ef390-79db-4486-9c5b-23055b3bb8c7` |
| Volumen `app-volume-ZS4g` | `bfdb64ff-9956-42c8-968c-2e542b376c5e` · montado en `/app/storage/app` |
| Dominio público | <https://clientkosmos.up.railway.app> (puerto 8000) |
| Repo GitHub | `Samu-Mind/client-kosmos-SamuelAyllon`, rama `main` |

---

## 1. Fixes en el código aplicados durante el bootstrap

Estos commits **deben estar en `main` antes de desplegar** una BD fresca:

| Commit | Fix | Por qué |
|---|---|---|
| `363d7a0` | Renombrar `2026_05_05_000001_create_workspaces_table.php` → `2026_04_01_…` (idem para `workspace_members`) | Varias migraciones de abril (`patient_profiles`, `documents`, `patient_delegations`) hacen FK a `workspaces`. Con BD vacía explotaban con `1824 Failed to open the referenced table 'workspaces'` |
| `2a41a30` | Escape hatch `DB_DISABLE_FK_CHECKS=1` en [config/database.php](../../config/database.php): añade `PDO::MYSQL_ATTR_INIT_COMMAND = 'SET FOREIGN_KEY_CHECKS=0'` a la conexión MySQL cuando la env var está presente | Hay más ciclos de FK out-of-order entre abril y mayo (`notes`→`appointments`, etc.). Con FK checks deshabilitados durante el bootstrap, MySQL crea las constraints sin validar la tabla referenciada — pasan en cualquier orden y siguen siendo válidas en runtime |
| `76a7cb7` | Acortar nombres de índices en `transcription_segments` | El nombre autogenerado `transcription_segments_session_recording_id_speaker_user_id_position_unique` excede el límite de **64 caracteres** de MySQL. Hay que pasar nombres explícitos a `$table->unique(…, 'short_name')` |

---

## 2. Configuración Railway descubierta

Tres trampas no documentadas en `deploy/RAILWAY.md` original:

1. **`PORT` debe ser una env var.** Railway hace healthcheck contra el valor de
   `$PORT` (no contra el `target port` del dominio). Si la app escucha en 8000
   y `PORT` no está definida, el healthcheck va al puerto equivocado, nunca
   recibe 200 y la deploy se marca `FAILED` tras el timeout. **Fijar
   `PORT=8000`** como variable normal. Ver
   <https://docs.railway.com/deployments/healthchecks#configure-the-healthcheck-port>.

2. **`prohibitDestructiveCommands` bloquea `migrate:fresh` aunque pases `--force`.**
   En [app/Providers/AppServiceProvider.php:109](../../app/Providers/AppServiceProvider.php#L109) la app activa el guard cuando `app()->isProduction()`. Por eso **no uses `pre_deploy_command='php artisan migrate:fresh …'`** en producción. Solución: dejar que el entrypoint corra `php artisan migrate --force` sobre BD vacía (ese SÍ funciona) y usar `DB_DISABLE_FK_CHECKS=1` para sobrevivir al orden de FKs.

3. **El CLI `railway add -r REPO` puede dar `Unauthorized`** si la app GitHub de Railway no tiene permiso vigente sobre el repo. Workaround comprobado: crear el servicio **vacío** (`railway add -s app`) y desplegar con `railway up` desde el directorio local. Railway construye con Railpack que detecta el `Dockerfile` en la raíz automáticamente; las variables y volúmenes ya configurados antes de `up` se aplican al primer deploy.

---

## 3. Procedimiento paso a paso

> Asume CLI `railway` instalado y `railway whoami` OK. Si MCP funciona, las
> mutaciones equivalentes están en `mcp__railway__*`. La skill
> [`use-railway`](../../.agents/skills/use-railway/SKILL.md) recomienda
> prefijar las llamadas CLI con `RAILWAY_CALLER=skill:use-railway@1.2.0`.

### 3.1. Generar `APP_KEY` local

Crítico: si no la fijas como variable antes del primer deploy, el
[entrypoint](../../docker-entrypoint.sh) la regenera en cada arranque e
invalida sesiones.

```bash
php artisan key:generate --show
# → base64:ozJOfHUKhsRV1qRQoSCLXG7ASS9YVLk0QPzzi+OyIas=
```

### 3.2. Linkar el proyecto

```bash
railway link --project 4495a3db-46a7-4ff4-83d3-08867f1abc18 --environment production
```

### 3.3. Provisionar MySQL

```bash
railway add -d mysql
```

Espera a que `railway service list` muestre `MySQL ● Online`.

### 3.4. Crear servicio `app` (vacío) + volumen + dominio

```bash
railway add -s app                                # servicio vacío
railway service link app
railway volume add -m /app/storage/app            # ⚠ no usar mount path completo /app/storage
railway domain -p 8000                            # genera FQDN público
```

Apuntar el nombre del dominio devuelto (`app-production-XXXX.up.railway.app`).

> 💡 En git-bash en Windows, MSYS convierte rutas que empiezan por `/` al
> path absoluto local. Si el volumen acaba con `mount path: //app/storage/app`,
> prefija el comando con `MSYS_NO_PATHCONV=1` o usa PowerShell.

### 3.5. Fijar variables (núcleo + refs MySQL + bootstrap flags)

Sustituye `<DOMINIO>` por el FQDN del paso 3.4. **Una sola llamada** para
batch-set; las refs `${{MySQL.*}}` se resuelven automáticamente.

```bash
railway variable set --service app \
  APP_NAME=ClientKosmos \
  APP_ENV=production \
  APP_DEBUG=false \
  APP_KEY="base64:…" \
  APP_URL=https://<DOMINIO> \
  ASSET_URL=https://<DOMINIO> \
  APP_LOCALE=es \
  APP_FALLBACK_LOCALE=en \
  TRUSTED_PROXIES='*' \
  DB_CONNECTION=mysql \
  'DB_HOST=${{MySQL.MYSQLHOST}}' \
  'DB_PORT=${{MySQL.MYSQLPORT}}' \
  'DB_DATABASE=${{MySQL.MYSQLDATABASE}}' \
  'DB_USERNAME=${{MySQL.MYSQLUSER}}' \
  'DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}' \
  DB_DISABLE_FK_CHECKS=1 \
  SESSION_DRIVER=database \
  CACHE_STORE=database \
  QUEUE_CONNECTION=database \
  BROADCAST_CONNECTION=log \
  LOG_CHANNEL=stderr \
  MAIL_MAILER=log \
  FILESYSTEM_DISK=local \
  BCRYPT_ROUNDS=12 \
  PORT=8000 \
  --skip-deploys
```

### 3.6. Primer deploy desde el directorio local

```bash
railway up --service app --detach -m "bootstrap deploy"
```

Railway:
1. Sube tarball respetando `.dockerignore`/`.gitignore`.
2. Railpack detecta el `Dockerfile` y construye (Composer → Vite/Wayfinder → FrankenPHP).
3. Arranca el contenedor; el [entrypoint](../../docker-entrypoint.sh) ejecuta `php artisan migrate --force` sobre BD vacía — con `DB_DISABLE_FK_CHECKS=1` pasa de extremo a extremo.
4. Si user count == 0, el entrypoint corre seeders (admin + profesionales + pacientes demo).
5. FrankenPHP arranca en `:8000`, el healthcheck de Railway le pega a `/up` por el `$PORT` y obtiene 200.

Espera:

```bash
until curl -fsS https://<DOMINIO>/up >/dev/null; do sleep 20; done && echo UP
```

### 3.7. Configurar healthcheck + restart policy

(Sólo posible después de que exista la primera deploy.)

```bash
railway environment edit \
  --service-config app deploy.healthcheckPath /up \
  --service-config app deploy.healthcheckTimeout 300 \
  --service-config app deploy.restartPolicyType ON_FAILURE \
  --service-config app deploy.restartPolicyMaxRetries 3 \
  -m "set healthcheck and restart policy"
```

> ⚠ `healthcheckTimeout` se expresa en **segundos**, no milisegundos.

### 3.8. Limpieza post-bootstrap

Una vez `/up` devuelve 200 y la app responde, retira el flag de bootstrap:

```bash
railway variable delete DB_DISABLE_FK_CHECKS --service app
```

La columna de FKs ya están todas creadas con sus referencias correctas; al
no haber más `migrate` con tablas faltantes, el guard de MySQL puede volver
a estar activo. El código del escape hatch (en
[config/database.php](../../config/database.php)) permanece **inerte** sin
la env var.

Para el push-to-deploy continuo:

```bash
# Conectar el repo GitHub para auto-deploy en cada push a main
# Hacerlo en el dashboard: Project → app → Settings → Source → Connect Repo
# (la CLI da Unauthorized si la GitHub App de Railway no está al día)
```

---

## 4. Variables fijadas (resumen final)

### Núcleo (literal)

| Clave | Valor |
|---|---|
| `APP_NAME` | `ClientKosmos` |
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_KEY` | `base64:…` (no rotar) |
| `APP_URL` / `ASSET_URL` | `https://clientkosmos.up.railway.app` |
| `APP_LOCALE` / `APP_FALLBACK_LOCALE` | `es` / `en` |
| `TRUSTED_PROXIES` | `*` |
| `DB_CONNECTION` | `mysql` |
| `SESSION_DRIVER` / `CACHE_STORE` / `QUEUE_CONNECTION` | `database` |
| `BROADCAST_CONNECTION` | `log` (sin Reverb por ahora) |
| `MAIL_MAILER` | `log` (sin SMTP real por ahora) |
| `LOG_CHANNEL` | `stderr` |
| `FILESYSTEM_DISK` | `local` |
| `BCRYPT_ROUNDS` | `12` |
| **`PORT`** | **`8000`** (clave para el healthcheck — ver §2.1) |

### Refs a MySQL

| Clave | Referencia |
|---|---|
| `DB_HOST` | `${{MySQL.MYSQLHOST}}` |
| `DB_PORT` | `${{MySQL.MYSQLPORT}}` |
| `DB_DATABASE` | `${{MySQL.MYSQLDATABASE}}` |
| `DB_USERNAME` | `${{MySQL.MYSQLUSER}}` |
| `DB_PASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |

### Bootstrap-only (retirar tras §3.8)

- `DB_DISABLE_FK_CHECKS=1`

### Pendiente (añadir cuando se active cada feature)

Stripe, Groq/Whisper, Google OAuth+Calendar, Reverb, `MAIL_*` real — ver
tabla *Opcionales* en [deploy/RAILWAY.md §3](../../deploy/RAILWAY.md).

---

## 5. Verificación end-to-end

- `railway service list` → `app ● Online` y `MySQL ● Online`.
- `curl -fsS https://<DOMINIO>/up` → HTTP 200.
- Logs runtime: `railway logs --service app` debe mostrar `INFO Nothing to migrate.` y FrankenPHP arrancando en `:8000`.
- Login con `admin@clientkosmos.test / password` desde el navegador.

---

## 6. Errores típicos durante el bootstrap (referencia)

| Síntoma en logs | Causa | Fix |
|---|---|---|
| `1050 Table 'patient_profiles' already exists` | Deploy anterior creó las tablas; el nuevo intenta otra vez | DB tiene residuos: hacer migrate desde BD limpia o resetear MySQL |
| `1824 Failed to open the referenced table 'workspaces'` (o `appointments`, etc.) | FK out-of-order en migraciones | Fix `2a41a30`: `DB_DISABLE_FK_CHECKS=1` |
| `1059 Identifier name '…' is too long` | Índice/unique con nombre auto > 64 chars | Pasar nombre explícito al método `unique()` / `index()` |
| `WARN This command is prohibited from running in this environment.` | Usaste `migrate:fresh` con `APP_ENV=production` y el guard `prohibitDestructiveCommands` está activo | No usar `migrate:fresh` en prod; basta `migrate --force` sobre BD vacía |
| `X-Railway-Fallback: true` + 404 desde `railway-edge` | No hay deploy activo, healthcheck nunca pasó | Falta `PORT=8000` o el healthcheck timeout demasiado bajo |
| `SQLSTATE[HY000] [2002]` al primer deploy | MySQL aún no listo | Esperar; el entrypoint reintenta |

---

## 7. Referencias

- Skill: [.agents/skills/use-railway/SKILL.md](../../.agents/skills/use-railway/SKILL.md)
- Runbook operativo: [deploy/RAILWAY.md](../../deploy/RAILWAY.md)
- Railway healthchecks: <https://docs.railway.com/deployments/healthchecks>
- Dashboard del proyecto: <https://railway.com/project/4495a3db-46a7-4ff4-83d3-08867f1abc18>
