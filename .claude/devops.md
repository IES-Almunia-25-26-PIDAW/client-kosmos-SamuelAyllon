# Pilar 4 · DevOps — Docker y CI/CD

Activar al tocar `Dockerfile`, `docker-compose.yml`, `docker-entrypoint.sh`, archivos en `.github/workflows/`, scripts de despliegue o configuración de entornos.

## Contenedores

### Dockerfile (multi-stage)

Estructura esperada:

1. **Stage `composer`** → instala dependencias PHP con `composer install --no-dev --optimize-autoloader` (para prod) o `--dev` (para dev image).
2. **Stage `node`** → `npm ci` + `npm run build` (genera `public/build`).
3. **Stage `runtime`** → imagen final PHP-FPM 8.4-alpine o similar:
   - Copia `vendor/` del stage `composer`.
   - Copia `public/build/` del stage `node`.
   - Usuario no-root (`www-data` o dedicado).
   - `HEALTHCHECK` definido.
   - Variables de entorno inyectadas en runtime, no build-time.

### docker-compose.yml (dev)

Servicios mínimos:

- `app` (PHP-FPM) — depende de `db`, `redis`.
- `web` (nginx) — sirve `public/`.
- `db` (MySQL 8 o MariaDB) con volumen persistente + healthcheck.
- `redis` para cache/queue/session.
- `mailhog` o `mailpit` para correos en dev.
- Opcional: `queue-worker`, `scheduler` (para probar jobs/cron).

Cada servicio con `healthcheck` — `depends_on: condition: service_healthy`.

### Reglas

- Jamás imagen corriendo como root en runtime.
- Jamás `COPY .env` — inyectar por env/secret manager.
- Build reproducible: pinear versiones de imagen base (`php:8.4.3-fpm-alpine3.20`, no `latest`).
- Si se añade servicio nuevo al compose → actualizar README + diagrama.

## CI/CD — GitHub Actions

Workflow principal: `.github/workflows/ci.yml` (crear/ajustar cuando falte).

### Jobs obligatorios (gate de merge a `main`)

```yaml
jobs:
  backend:
    - checkout
    - setup-php 8.4 (extensiones: pdo_mysql, redis, intl, mbstring, bcmath, gd)
    - cache de ~/.composer/cache
    - composer install --no-interaction --prefer-dist
    - vendor/bin/pint --test --format agent
    - cp .env.example .env && php artisan key:generate
    - php artisan test --compact

  frontend:
    - checkout
    - setup-node 20
    - cache de ~/.npm
    - npm ci
    - npm run lint
    - npm run build
```

Ambos jobs deben pasar para permitir merge. Configurar **branch protection** en `main`: required status checks = `backend`, `frontend`.

### Convenciones

- Usar `actions/cache` para `vendor/` y `node_modules/` cuando aporte tiempo real.
- Matrices solo cuando exista más de una versión soportada (ahora: una sola).
- Secrets vía `${{ secrets.* }}` — nunca hardcodear.
- Jobs de despliegue separados (`deploy.yml`) con `environment:` protegido.

## Entornos

| Entorno | Uso | Propiedades |
|---------|-----|-------------|
| local | desarrollo | `APP_ENV=local`, `APP_DEBUG=true`, DB local |
| staging | QA/UAT | mirror de prod, datos anonimizados, `APP_DEBUG=false` |
| production | usuarios finales | `APP_ENV=production`, logs centralizados, backups DB diarios |

Migraciones a prod: nunca `migrate:fresh`; usar `migrate --force` en pipeline de deploy.

## Reglas de la IA

- Antes de modificar `Dockerfile` o `docker-compose.yml`, leerlos completos.
- Si la tarea requiere un servicio nuevo, proponer ADR antes de añadirlo al compose.
- Nunca desactivar jobs de CI (`continue-on-error: true`, `if: false`) sin aprobación.
- Verificar que cualquier cambio en build (`vite.config.ts`, `composer.json`, `package.json`) se refleje en el pipeline.
