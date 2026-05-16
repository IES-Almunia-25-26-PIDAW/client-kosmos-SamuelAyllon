# Bootstrap del despliegue en Railway

Paso a paso del despliegue de ClientKosmos en Railway desde un proyecto vacío,
ejecutado el **2026-05-16** usando la skill [`use-railway`](../../.agents/skills/use-railway/SKILL.md)
y el MCP de Railway.

> Runbook operativo (logs, redeploys, troubleshooting, dominio propio): [deploy/RAILWAY.md](../../deploy/RAILWAY.md).
> Este documento describe el **bootstrap inicial**; aquel describe la **operativa diaria**.

---

## 0. Estado de partida

- Proyecto Railway `clientkosmos` (id `4495a3db-46a7-4ff4-83d3-08867f1abc18`,
  workspace *Samu's Projects*, entorno `production` id `c0103637-3b92-4c5c-bad2-0746c477bcb5`)
  **existía pero sin servicios** — `environment_status` devolvía *"No services in this environment"*.
- Repo GitHub: `Samu-Mind/client-kosmos-SamuelAyllon`, rama `main`.
- Imagen ya preparada en repo: [Dockerfile](../../Dockerfile) multi-stage
  (Composer → Vite/Wayfinder → FrankenPHP) con `EXPOSE 8000` y healthcheck a `/up`.
- Entrypoint [docker-entrypoint.sh](../../docker-entrypoint.sh) ya vuelca env del
  contenedor a `.env`, espera MySQL, migra y cachea config.

## 1. Resultado

| Recurso | Tipo | ID / Detalle |
|---|---|---|
| Proyecto | — | `4495a3db-46a7-4ff4-83d3-08867f1abc18` |
| Entorno | `production` | `c0103637-3b92-4c5c-bad2-0746c477bcb5` |
| Servicio `MySQL` | Template oficial `mysql` | provisionado en 2026-05-16 07:01 UTC |
| Servicio `app` | Docker (repo GitHub) | `39a367cf-ea39-412a-b8f7-9f8f0d5e7288` · puerto 8000 |
| Volumen `app-volume-ZS4g` | Persistente | `bfdb64ff-9956-42c8-968c-2e542b376c5e` · montado en `/app/storage/app` |
| Dominio público | Railway-generated | <https://app-production-3078.up.railway.app> |

---

## 2. Paso a paso (llamadas MCP usadas)

Todas las mutaciones se hicieron vía el MCP de Railway (`mcp__railway__*`); el CLI
no era estrictamente necesario, pero la skill `use-railway` recomienda preflight
con `railway whoami --json` (ver §2 de [SKILL.md](../../.agents/skills/use-railway/SKILL.md)).

### 2.1. Preflight

```text
mcp__railway__whoami
→ Logged in as Samu (samuelayllonsevilla1@gmail.com)

mcp__railway__list_projects
→ clientkosmos (id: 4495a3db-46a7-4ff4-83d3-08867f1abc18)

mcp__railway__environment_status(project_id=…, environment_id=…)
→ No services in this environment.
```

### 2.2. Generar APP_KEY local

Crítico: si no la fijamos antes del primer deploy, [docker-entrypoint.sh](../../docker-entrypoint.sh)
genera una nueva en cada arranque e invalida sesiones.

```bash
php artisan key:generate --show
# → base64:ozJOfHUKhsRV1qRQoSCLXG7ASS9YVLk0QPzzi+OyIas=
```

### 2.3. Provisionar MySQL

```text
mcp__railway__search_templates(query="mysql")
→ MySQL (code: mysql) - Deploy a MySQL database service

mcp__railway__deploy_template(template_code="mysql", project_id=…, environment_id=…)
→ Template 'MySQL' deployed.
```

Tras unos segundos, `environment_status` reporta `MySQL | SUCCESS`.

### 2.4. Crear servicio `app` desde GitHub

```text
mcp__railway__create_service(
    name="app",
    source_repo="Samu-Mind/client-kosmos-SamuelAyllon",
    project_id=…, environment_id=…
)
→ Service created: app (id: 39a367cf-ea39-412a-b8f7-9f8f0d5e7288)
```

### 2.5. Configurar build, healthcheck y restart policy

```text
mcp__railway__update_service(
    service_id="39a367cf-…",
    dockerfile_path="Dockerfile",
    health_check_path="/up",
    healthcheck_timeout=300,        # segundos (no ms)
    restart_policy_type="ON_FAILURE",
    restart_policy_max_retries=3
)
→ Service updated successfully.
```

> ⚠ El parámetro `healthcheck_timeout` se expresa **en segundos**. Pasarlo en
> milisegundos devuelve `Error in healthcheckTimeout - Invalid input`.

### 2.6. Crear volumen persistente

```text
mcp__railway__create_volume(
    service_id="39a367cf-…",
    mount_path="/app/storage/app"
)
→ Volume created: app-volume-ZS4g (id: bfdb64ff-9956-42c8-968c-2e542b376c5e)
```

Solo `/app/storage/app` (uploads). Montar `/app/storage` completo persiste
caches viejos entre redeploys y los rompe.

### 2.7. Generar dominio público

```text
mcp__railway__generate_domain(service_id="39a367cf-…", port=8000)
→ https://app-production-3078.up.railway.app
```

### 2.8. Fijar variables core

```text
mcp__railway__set_variables(service_id="39a367cf-…", skip_deploys=true, variables={
    APP_NAME, APP_ENV, APP_DEBUG, APP_KEY, APP_URL, ASSET_URL,
    TRUSTED_PROXIES, DB_CONNECTION, SESSION_DRIVER, CACHE_STORE,
    QUEUE_CONNECTION, BROADCAST_CONNECTION, LOG_CHANNEL, MAIL_MAILER,
    APP_LOCALE, APP_FALLBACK_LOCALE, FILESYSTEM_DISK, BCRYPT_ROUNDS
})
→ Successfully set 18 variable(s)
```

### 2.9. Fijar referencias a MySQL

```text
mcp__railway__add_reference_variable(service_id="39a367cf-…", variables=[
    DB_HOST     = ${{MySQL.MYSQLHOST}},
    DB_PORT     = ${{MySQL.MYSQLPORT}},
    DB_DATABASE = ${{MySQL.MYSQLDATABASE}},
    DB_USERNAME = ${{MySQL.MYSQLUSER}},
    DB_PASSWORD = ${{MySQL.MYSQLPASSWORD}}
])
→ Reference variable(s) set: DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
```

La set anterior usó `skip_deploys=true`; esta segunda llamada disparó el primer build.

### 2.10. Esperar build y verificar

```bash
# Polling hasta que /up devuelva 200
until curl -fsS https://app-production-3078.up.railway.app/up >/dev/null; do sleep 15; done
```

```text
mcp__railway__environment_status
→ MySQL | SUCCESS | 1
→ app   | SUCCESS | 1
```

---

## 3. Variables fijadas (resumen)

### Núcleo (valor literal)

| Clave | Valor |
|---|---|
| `APP_NAME` | `ClientKosmos` |
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_KEY` | `base64:…` (generada local — **no rotar**, invalida sesiones) |
| `APP_URL` / `ASSET_URL` | `https://app-production-3078.up.railway.app` |
| `APP_LOCALE` / `APP_FALLBACK_LOCALE` | `es` / `en` |
| `TRUSTED_PROXIES` | `*` |
| `DB_CONNECTION` | `mysql` |
| `SESSION_DRIVER` / `CACHE_STORE` / `QUEUE_CONNECTION` | `database` |
| `BROADCAST_CONNECTION` | `log` (sin Reverb por ahora) |
| `MAIL_MAILER` | `log` (sin SMTP real por ahora) |
| `LOG_CHANNEL` | `stderr` |
| `FILESYSTEM_DISK` | `local` |
| `BCRYPT_ROUNDS` | `12` |

### Referencias a MySQL

| Clave | Referencia |
|---|---|
| `DB_HOST` | `${{MySQL.MYSQLHOST}}` |
| `DB_PORT` | `${{MySQL.MYSQLPORT}}` |
| `DB_DATABASE` | `${{MySQL.MYSQLDATABASE}}` |
| `DB_USERNAME` | `${{MySQL.MYSQLUSER}}` |
| `DB_PASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |

### Pendiente (sólo añadir cuando se active la feature)

Ver tabla **Opcionales** en [deploy/RAILWAY.md §3](../../deploy/RAILWAY.md):
Stripe, Groq/Whisper, Google OAuth+Calendar, Reverb, MAIL_* real.

---

## 4. Cómo reproducir desde cero

Si vuelves a empezar con el proyecto vacío:

1. `php artisan key:generate --show` → guarda el valor.
2. `mcp__railway__deploy_template` con `template_code=mysql`.
3. `mcp__railway__create_service` con `name=app`, `source_repo=Samu-Mind/client-kosmos-SamuelAyllon`.
4. `mcp__railway__update_service` con `dockerfile_path=Dockerfile`, `health_check_path=/up`, `healthcheck_timeout=300` (segundos).
5. `mcp__railway__create_volume` con `mount_path=/app/storage/app`.
6. `mcp__railway__generate_domain` con `port=8000`.
7. `mcp__railway__set_variables` con el núcleo (incluyendo `APP_URL` apuntando al dominio generado).
8. `mcp__railway__add_reference_variable` con las 5 refs `${{MySQL.*}}`.
9. Esperar a `environment_status` → `SUCCESS`. Comprobar `curl https://<dominio>/up`.

A partir de aquí, los push a `main` despliegan automáticamente vía la integración GitHub.

---

## 5. Verificación end-to-end

- ✅ `mcp__railway__environment_status` → `app` y `MySQL` en `SUCCESS`.
- ✅ `curl -fsS https://app-production-3078.up.railway.app/up` → HTTP 200.
- ⏭ Smoke manual de login/registro pendiente al primer uso real.

---

## 6. Referencias

- Skill: [.agents/skills/use-railway/SKILL.md](../../.agents/skills/use-railway/SKILL.md)
- Runbook operativo: [deploy/RAILWAY.md](../../deploy/RAILWAY.md)
- Dashboard del proyecto: <https://railway.com/project/4495a3db-46a7-4ff4-83d3-08867f1abc18>
