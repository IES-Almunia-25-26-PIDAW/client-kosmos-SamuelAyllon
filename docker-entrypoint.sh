#!/bin/bash
# ==============================================================================
# docker-entrypoint.sh — Script de inicialización de ClientKosmos
# ==============================================================================
#
# Este script se ejecuta CADA VEZ que el contenedor arranca, ANTES del
# comando principal (CMD: php artisan serve).
#
# Flujo de ejecución:
#   1. Crea .env si no existe
#   2. Inyecta las variables de entorno del docker-compose en .env
#   3. Genera APP_KEY si no se proporcionó una
#   4. Descubre paquetes Laravel
#   5. Espera a que MySQL esté lista
#   6. Ejecuta migraciones y seeders
#   7. Cachea configuración (solo en producción)
#   8. Arranca el servidor (ejecuta CMD)
# ==============================================================================

# "set -e" hace que el script se detenga inmediatamente si cualquier comando
# falla (retorna código distinto de 0). Esto previene que la app arranque
# en un estado inconsistente.
set -e

echo "==> Iniciando ClientKosmos..."

# ──────────────────────────────────────────────────────────────────────────────
# PASO 1: Crear archivo .env
# ──────────────────────────────────────────────────────────────────────────────
# Laravel necesita un archivo .env para funcionar. Si no existe (primer
# arranque), copiamos .env.example como plantilla base.
# Las variables reales se inyectan en el paso 2.
if [ ! -f /app/.env ]; then
    echo "==> Copiando .env.example -> .env"
    cp /app/.env.example /app/.env
fi

# ──────────────────────────────────────────────────────────────────────────────
# PASO 2: Inyectar variables de entorno en .env
# ──────────────────────────────────────────────────────────────────────────────
# Las variables definidas en docker-compose.yml (environment:) se pasan al
# contenedor como variables de entorno del sistema. Aquí las escribimos
# en el archivo .env para que Laravel las lea correctamente.
#
# Para cada variable:
#   - Si ya existe en .env → la sobreescribe con el valor del contenedor
#   - Si no existe en .env → la añade al final
#   - Si no está definida en el contenedor → la ignora (no la toca)
env_vars=(
    APP_NAME APP_ENV APP_DEBUG APP_KEY APP_URL
    DB_CONNECTION DB_HOST DB_PORT DB_DATABASE DB_USERNAME DB_PASSWORD DB_SSL_CA
    SESSION_DRIVER CACHE_STORE QUEUE_CONNECTION LOG_CHANNEL
    MAIL_MAILER MAIL_HOST MAIL_PORT MAIL_USERNAME MAIL_PASSWORD MAIL_FROM_ADDRESS MAIL_FROM_NAME
    GROQ_API_KEY GROQ_BASE_URL GROQ_MODEL
)
for var in "${env_vars[@]}"; do
    # "${!var+set}" comprueba si la variable está definida (incluso si está vacía)
    if [ -n "${!var+set}" ]; then
        val="${!var}"
        # APP_KEY vacía significa "no configurada": no sobreescribir el .env,
        # el Paso 3 generará una nueva clave si es necesario.
        if [ "$var" = "APP_KEY" ] && [ -z "$val" ]; then
            continue
        fi
        if grep -q "^${var}=" /app/.env; then
            # La variable ya existe en .env: reemplazamos su valor
            sed -i "s|^${var}=.*|${var}=${val}|" /app/.env
        else
            # La variable no existe en .env: la añadimos al final
            echo "${var}=${val}" >> /app/.env
        fi
    fi
done

# ──────────────────────────────────────────────────────────────────────────────
# PASO 3: Generar APP_KEY si no se proporcionó
# ──────────────────────────────────────────────────────────────────────────────
# APP_KEY es la clave maestra de cifrado de Laravel. Se usa para:
#   - Cifrar cookies y sesiones
#   - Cifrar datos con encrypt()/decrypt()
#   - Firmar URLs temporales
#
# Si no se definió en docker-compose.yml, generamos una automáticamente.
# NOTA: Esta clave se pierde al recrear el contenedor. Para persistirla,
# pásala como variable de entorno: APP_KEY=base64:tu_clave_aqui
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "" ]; then
    if grep -q "^APP_KEY=$" /app/.env; then
        echo "==> No se definió APP_KEY. Generando una nueva..."
        echo "==> Para persistirla, copia la clave generada a tu docker-compose.yml"
        php /app/artisan key:generate --force
    fi
fi

# ──────────────────────────────────────────────────────────────────────────────
# PASO 4: Descubrir paquetes Laravel
# ──────────────────────────────────────────────────────────────────────────────
# Durante el build usamos "composer install --no-scripts", lo que omitió
# el auto-discovery de paquetes. Ahora lo ejecutamos manualmente para que
# Laravel registre los ServiceProviders de paquetes como Inertia, Fortify, etc.
echo "==> Descubriendo paquetes Laravel..."
php /app/artisan package:discover --ansi

# ──────────────────────────────────────────────────────────────────────────────
# PASO 5: Esperar a que la base de datos esté lista
# ──────────────────────────────────────────────────────────────────────────────
# Aunque docker-compose tiene healthcheck en el servicio "db", puede haber
# un breve lapso entre que MySQL acepta conexiones y que está lista para
# consultas. Este bucle actúa como red de seguridad adicional.
#
# Intentamos conectar hasta 30 veces (cada 2 segundos = ~60s máximo).
# Usamos mysqladmin ping porque es la forma más fiable de verificar
# que MySQL acepta conexiones.
echo "==> Esperando a que la base de datos esté disponible..."
max_retries=30
retry=0
until mysqladmin ping -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USERNAME" -p"$DB_PASSWORD" --silent 2>/dev/null || [ $retry -ge $max_retries ]; do
    retry=$((retry + 1))
    echo "    Intento $retry/$max_retries — esperando base de datos..."
    sleep 2
done

if [ $retry -ge $max_retries ]; then
    echo "==> AVISO: No se pudo verificar la conexión a la DB. Intentando migrar de todos modos..."
fi

# ──────────────────────────────────────────────────────────────────────────────
# PASO 6: Limpiar cachés y ejecutar migraciones + seeders
# ──────────────────────────────────────────────────────────────────────────────
# Limpiamos cachés previos para evitar inconsistencias con la nueva
# configuración inyectada en el paso 2.
echo "==> Limpiando cachés..."
php /app/artisan config:clear    # Borra caché de configuración
php /app/artisan cache:clear 2>/dev/null || true  # Borra caché de aplicación (puede fallar si la tabla no existe aún)
php /app/artisan route:clear     # Borra caché de rutas

# Crea el symlink public/storage → storage/app/public para que los archivos
# subidos por usuarios sean accesibles vía URL (/storage/...).
# --force: sobreescribe si el symlink ya existía (seguro de re-ejecutar).
php /app/artisan storage:link --force 2>/dev/null || true

# Ejecuta las migraciones de la base de datos:
#   migrate: crea/actualiza las tablas según los archivos en database/migrations/
#   --force: necesario en producción (Laravel pide confirmación sin este flag)
echo "==> Ejecutando migraciones..."
php /app/artisan migrate --force

# Ejecutar seeders SOLO en la primera instalación (tabla users vacía).
# Los seeders usan factory()->create() sin comprobación de duplicados, por lo
# que ejecutarlos en un arranque posterior causaría errores de UNIQUE constraint.
USER_COUNT=$(mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USERNAME" -p"$DB_PASSWORD" \
    "$DB_DATABASE" -se "SELECT COUNT(*) FROM users;" 2>/dev/null || echo "1")
if [ "${USER_COUNT}" = "0" ]; then
    echo "==> Primera instalación detectada. Ejecutando seeders..."
    php /app/artisan db:seed --force
else
    echo "==> Base de datos ya inicializada (${USER_COUNT} usuarios). Omitiendo seeders."
fi

# ──────────────────────────────────────────────────────────────────────────────
# PASO 7: Cachear configuración para producción
# ──────────────────────────────────────────────────────────────────────────────
# En producción, cacheamos configuración, rutas y vistas compiladas.
# Esto mejora el rendimiento al evitar leer archivos .env y parsear
# rutas/vistas en cada petición HTTP.
if [ "$APP_ENV" = "production" ]; then
    echo "==> Cacheando configuración y rutas para producción..."
    php /app/artisan config:cache  # Combina todos los config/*.php en un solo archivo cacheado
    php /app/artisan route:cache   # Serializa las rutas para carga más rápida
    php /app/artisan view:cache    # Pre-compila las plantillas Blade
fi

# ──────────────────────────────────────────────────────────────────────────────
# Listo — Muestra información útil
# ──────────────────────────────────────────────────────────────────────────────
echo "==> ClientKosmos listo en http://localhost:8000"
echo ""
echo "    Credenciales de prueba:"
echo "    admin@clientkosmos.test    / password  (admin)"
echo "    premium@clientkosmos.test  / password  (premium)"
echo "    free@clientkosmos.test     / password  (free)"
echo ""

# ──────────────────────────────────────────────────────────────────────────────
# PASO 8: Ejecutar el comando principal (CMD del Dockerfile)
# ──────────────────────────────────────────────────────────────────────────────
# "exec" reemplaza el proceso actual del shell por el CMD.
# "$@" se expande a todos los argumentos pasados al entrypoint, que por
# defecto son: php artisan serve --host=0.0.0.0 --port=8000
# Usar "exec" es importante porque:
#   - El proceso PHP se convierte en PID 1 (recibe señales de Docker)
#   - Docker puede hacer graceful shutdown correctamente (SIGTERM)
exec "$@"
