# Despliegue en producción — Railway

Runbook del despliegue real de ClientKosmos en [Railway](https://railway.com).
Stack: Railway managed services (app + MySQL + volume) con build desde `Dockerfile`.

> URL pública actual: <https://app-production-a329.up.railway.app>

---

## 1. Topología

| Recurso | Tipo | Detalle |
|---|---|---|
| Workspace | `Samu's Projects` | Personal |
| Proyecto | `clientkosmos` | `4495a3db-46a7-4ff4-83d3-08867f1abc18` |
| Entorno | `production` | `c0103637-3b92-4c5c-bad2-0746c477bcb5` |
| Servicio `app` | Docker (repo) | `Samu-Mind/client-kosmos-SamuelAyllon`, build con `Dockerfile`, expuesto en `:8000` |
| Servicio `MySQL` | Template oficial | Conectado por refs `${{MySQL.MYSQLHOST}}`, etc. |
| Volumen | `app-volume` | Montado en `/app/storage/app` |

---

## 2. CI/CD

Railway hace auto-deploy en cada push a `main` directamente desde GitHub.
**No hay `release.yml`** ni Docker Hub ni SSH: Railway construye la imagen en su
infraestructura usando el `Dockerfile` de la raíz.

El workflow `tests.yml` sigue corriendo el gate (Pint + PHPStan + Pest + Vitest +
build). Si quieres bloquear deploys cuando los tests fallen, ve a Railway →
servicio `app` → Settings → Source → **Wait for CI**.

---

## 3. Variables de entorno

Configuradas vía MCP de Railway. Para ver/editar:

```bash
railway variables --service app --environment production --json
```

O en el dashboard: **Project → app → Variables**.

### Núcleo (ya fijadas)

```
APP_NAME=ClientKosmos
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:...            # ⚠ no rotar: invalida sesiones
APP_URL=https://app-production-a329.up.railway.app
ASSET_URL=https://app-production-a329.up.railway.app
TRUSTED_PROXIES=*

DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
BROADCAST_CONNECTION=log
LOG_CHANNEL=stderr
MAIL_MAILER=log
```

### Opcionales — añade cuando actives la feature

| Variable | Para qué |
|---|---|
| `GROQ_API_KEY`, `GROQ_BASE_URL`, `GROQ_MODEL` | Asistente Kosmo + transcripción Whisper |
| `STRIPE_KEY`, `STRIPE_SECRET`, `STRIPE_WEBHOOK_SECRET` | Cobros a pacientes. Webhook: `<APP_URL>/stripe/webhook` |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` | OAuth + Calendar. Redirect: `<APP_URL>/auth/google/callback` |
| `MAIL_*` real (Resend / Postmark / SES) | Correos transaccionales |
| `REVERB_APP_ID`, `REVERB_APP_KEY`, `REVERB_APP_SECRET`, `REVERB_HOST`, `REVERB_PORT`, `REVERB_SCHEME` + `BROADCAST_CONNECTION=reverb` | Websockets (requiere servicio Reverb dedicado) |

---

## 4. Operativa

```bash
# Logs en tiempo real
railway logs --service app --environment production

# Forzar redeploy (sin push)
railway redeploy --service app --environment production

# Abrir una shell en el contenedor de la app
railway run --service app -- bash

# Ejecutar artisan dentro del contenedor
railway run --service app -- php artisan migrate:status
railway run --service app -- php artisan tinker

# Conectar al MySQL gestionado
railway connect MySQL
```

---

## 5. Backups

Railway hace snapshots automáticos del volumen y de MySQL en plan Hobby
(retención 7 días). Para un backup manual:

```bash
# Dump SQL
railway run --service MySQL -- \
  mysqldump -u$MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE > backup-$(date +%F).sql

# Archivos del volumen (storage/app)
railway run --service app -- tar czf - /app/storage/app > storage-$(date +%F).tar.gz
```

---

## 6. Dominio personalizado (futuro)

Cuando tengas dominio propio (ej. `clientkosmos.app`):

1. Railway → app → Settings → Networking → **Add custom domain**.
2. Crea el `CNAME` que Railway indique.
3. Railway emite certificado Let's Encrypt automáticamente.
4. Actualiza `APP_URL` y `ASSET_URL` al nuevo dominio.
5. Actualiza también las redirect URIs en Google Cloud y el endpoint de Stripe.

---

## 7. Troubleshooting

| Síntoma | Diagnóstico | Solución |
|---|---|---|
| Build falla en Composer | Falta extensión PHP o lock desincronizado | Revisa logs de build en Railway; reproduce con `docker build .` en local |
| App responde 500 con `No application encryption key` | `APP_KEY` borrada o vacía | Volver a fijarla en Variables; recordar que rotar invalida sesiones |
| `SQLSTATE[HY000] [2002]` | MySQL aún no listo en el primer deploy | Railway reintenta; si persiste, revisar referencias `${{MySQL.*}}` |
| Sesiones se invalidan tras redeploy | `APP_KEY` regenerada por entrypoint | Asegurar que `APP_KEY` está fijada como variable (no vacía) |
| Storage perdido tras redeploy | Volumen mal montado | Verificar volumen en `/app/storage/app` (uploads), no `/app/storage` (incluye caché regenerable) |
| Coste sube por encima del crédito | Métricas en panel | Ver `Usage` en el workspace; escalar verticalmente sólo si CPU/RAM saturan |

---

## 8. Migración inversa (si vuelves a VPS)

Los archivos del stack VPS+Traefik+DuckDNS están preservados en
[deploy/legacy/](legacy/) — `PRODUCTION.md`, `docker-compose.prod.yml`,
`.env.prod.example` y `release.yml.disabled`. Para reactivar:

1. Mover `release.yml.disabled` de vuelta a `.github/workflows/release.yml`.
2. Restaurar los 6 GitHub Secrets descritos en `legacy/PRODUCTION.md`.
3. Seguir el runbook original.

---

## 9. Recursos

- Dashboard del proyecto: <https://railway.com/project/4495a3db-46a7-4ff4-83d3-08867f1abc18>
- Railway CLI docs: <https://docs.railway.com/reference/cli-api>
- Status page: <https://status.railway.com>
