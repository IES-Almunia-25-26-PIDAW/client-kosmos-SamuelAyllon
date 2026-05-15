# Despliegue en producción — ClientKosmos

Runbook del despliegue real en un VPS con Traefik + Let's Encrypt + FrankenPHP.
Stack: Ubuntu 24.04 + Docker + Compose. Dominio público vía DuckDNS.

> URL pública objetivo: `https://clientkosmos.duckdns.org`

---

## 1. Requisitos previos

- VPS con IP pública (Hetzner CX11 ≈ 4 €/mes, DigitalOcean Basic, Contabo VPS S).
- Cuenta gratuita en [DuckDNS](https://www.duckdns.org) con un subdominio y su token.
- Cuenta en Docker Hub (la imagen se publica en `samue45/client-kosmos`).
- Acceso SSH al VPS con clave pública.

---

## 2. Provisioning del VPS (una sola vez)

```bash
# Conectar al VPS
ssh root@<IP_VPS>

# Crear usuario no-root con sudo y acceso Docker
adduser deploy
usermod -aG sudo,docker deploy
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh && chmod 600 /home/deploy/.ssh/authorized_keys

# Instalar Docker + Compose plugin + UFW
apt update && apt install -y \
    docker.io docker-compose-plugin ufw fail2ban

# Firewall: solo abrir SSH, HTTP y HTTPS
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

---

## 3. DNS — apuntar DuckDNS al VPS

1. Entra en https://www.duckdns.org y registra `clientkosmos` (o el nombre que prefieras).
2. Apunta el subdominio a la IP pública del VPS (botón **update ip**).
3. Anota el `token` que aparece en la página de tu cuenta.
4. (Opcional) El servicio `duckdns` del compose mantiene la IP sincronizada si el VPS recibe IP dinámica. Con IP fija no es necesario, pero no estorba.

Verifica:

```bash
dig +short clientkosmos.duckdns.org   # debe devolver la IP del VPS
```

---

## 4. Primer despliegue en el VPS

```bash
# Como usuario `deploy` en el VPS
sudo mkdir -p /opt/clientkosmos
sudo chown deploy:deploy /opt/clientkosmos
cd /opt/clientkosmos

# Bajar solo los archivos de deploy (no necesitamos el código fuente)
git init
git remote add origin https://github.com/Samu-Mind/client-kosmos-SamuelAyllon.git
git fetch --depth=1 origin main
git checkout origin/main -- deploy/

# El compose y el ejemplo de env quedan en deploy/
cp deploy/.env.prod.example deploy/.env.prod
nano deploy/.env.prod   # rellena DOMAIN, DUCKDNS_TOKEN, APP_KEY, DB_PASSWORD, etc.

# Storage del certificado ACME (Traefik exige permisos 600)
touch deploy/acme.json
chmod 600 deploy/acme.json

# Levantar todo (descarga la imagen `latest` desde Docker Hub)
cd deploy
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Seguir el log hasta ver la emisión del certificado
docker compose -f docker-compose.prod.yml logs -f traefik
```

Tras ~30 s deberías ver en los logs de Traefik:

```
Adding route for clientkosmos.duckdns.org with TLS options default
Register... CA: https://acme-v02.api.letsencrypt.org/directory
Certificate obtained for domains [clientkosmos.duckdns.org]
```

Comprobación:

```bash
curl -I https://clientkosmos.duckdns.org/up
# HTTP/2 200
# server: Caddy
```

---

## 5. Generar `APP_KEY` la primera vez

```bash
# Si dejaste APP_KEY vacío en .env.prod, el entrypoint genera uno volátil.
# Persistirlo:
docker compose -f docker-compose.prod.yml exec app php artisan key:generate --show
# Copia la cadena base64:... a .env.prod y reinicia:
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

---

## 6. Configurar GitHub Actions (CD)

En GitHub: **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Valor |
|---|---|
| `DOCKERHUB_USERNAME` | `samue45` |
| `DOCKERHUB_TOKEN` | Access token de Docker Hub (Docker Hub → Account Settings → Security) |
| `VPS_HOST` | IP del VPS |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | Clave SSH privada con acceso al VPS |
| `VPS_DEPLOY_PATH` | `/opt/clientkosmos/deploy` |

A partir de aquí, cada push a `main` que pase el workflow `tests` dispara `release.yml`:
construye la imagen, la publica con tags `:latest` y `:<sha>`, y hace `pull` + `up -d app`
en el VPS.

---

## 7. Operativa

```bash
# Ver estado de los contenedores
docker compose -f docker-compose.prod.yml ps

# Logs de la app (stderr de Laravel)
docker compose -f docker-compose.prod.yml logs -f app

# Logs de Traefik (ACME, routing)
docker compose -f docker-compose.prod.yml logs -f traefik

# Forzar nuevo pull manual (ej. rollback a un SHA concreto)
APP_TAG=8838488 docker compose -f docker-compose.prod.yml --env-file .env.prod up -d app

# Backup de la base de datos
docker compose -f docker-compose.prod.yml exec db \
    mysqldump -uclientkosmos -p"$DB_PASSWORD" clientkosmos > backup-$(date +%F).sql

# Backup del storage subido por usuarios
docker run --rm -v clientkosmos_app_storage:/data -v $(pwd):/backup alpine \
    tar czf /backup/storage-$(date +%F).tar.gz -C /data .
```

---

## 8. Webhooks externos

Una vez online, actualiza los webhooks de los servicios externos a la URL pública:

- **Stripe:** dashboard → Developers → Webhooks → endpoint
  `https://clientkosmos.duckdns.org/stripe/webhook`.
- **Google OAuth:** Cloud Console → Credentials → Authorized redirect URIs:
  `https://clientkosmos.duckdns.org/auth/google/callback`.

---

## 9. Troubleshooting

| Síntoma | Diagnóstico | Solución |
|---|---|---|
| `acme: error: 429 :: urn:ietf:params:acme:error:rateLimited` | Let's Encrypt limita certificados por dominio padre `duckdns.org`. | Esperar 1 semana o cambiar a un dominio propio (5 €/año). |
| Traefik responde 404 a `https://DOMAIN` | El router no encontró el servicio. | `docker compose logs traefik` → revisar que las labels `traefik.http.routers.app.rule` coincidan con `${DOMAIN}` del `.env.prod`. |
| App responde 500 | Caché vieja tras un deploy con cambios de config. | `docker compose exec app php artisan optimize:clear && docker compose restart app`. |
| `php artisan migrate` falla en deploy | Cambio de schema incompatible. | Revisar logs y aplicar migración a mano: `docker compose exec app php artisan migrate --force`. |
| Sesiones se invalidan tras restart | `APP_KEY` cambió. | Asegurarse de que `APP_KEY` está fijado en `.env.prod` y no se regenera en cada arranque. |

---

## 10. Notas finales

- **Tamaño imagen** (`docker images samue45/client-kosmos --format '{{.Size}}'`): objetivo ≤ 200 MB. Si excede tras un cambio, revisar capas con `docker history`.
- **Renovación del certificado:** Traefik la hace automáticamente 30 días antes de la expiración. No requiere acción manual mientras `acme.json` no se borre.
- **Rollback rápido:** `APP_TAG=<sha_anterior> docker compose … up -d app`.
- **Compose local** (Mailpit, MySQL expuesto, etc.): sigue disponible en [`deploy/docker-compose.local.yml`](docker-compose.local.yml). No usar en producción.
