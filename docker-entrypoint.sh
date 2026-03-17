#!/bin/bash
set -e

echo "==> Iniciando ClientKosmos..."

# 1. Crear .env si no existe (necesario para que artisan funcione)
if [ ! -f /app/.env ]; then
    echo "==> Copiando .env.example -> .env"
    cp /app/.env.example /app/.env
fi

# 2. Inyectar las variables de entorno del contenedor en .env
#    Esto garantiza que los valores de docker-compose.yml prevalezcan.
env_vars=(
    APP_NAME APP_ENV APP_DEBUG APP_KEY APP_URL
    DB_CONNECTION DB_HOST DB_PORT DB_DATABASE DB_USERNAME DB_PASSWORD DB_SSL_CA
    SESSION_DRIVER CACHE_STORE QUEUE_CONNECTION LOG_CHANNEL
    GROQ_API_KEY GROQ_BASE_URL GROQ_MODEL
)
for var in "${env_vars[@]}"; do
    if [ -n "${!var+set}" ]; then
        if grep -q "^${var}=" /app/.env; then
            sed -i "s|^${var}=.*|${var}=${!var}|" /app/.env
        else
            echo "${var}=${!var}" >> /app/.env
        fi
    fi
done

# 3. APP_KEY: generar una si no se proporcionó
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "" ]; then
    if grep -q "^APP_KEY=$" /app/.env; then
        echo "==> No se definió APP_KEY. Generando una nueva..."
        echo "==> Para persistirla, copia la clave generada a tu archivo .env"
        php /app/artisan key:generate --force
    fi
fi

# 4. Descubrir paquetes (se omitió en composer install con --no-scripts)
echo "==> Descubriendo paquetes Laravel..."
php /app/artisan package:discover --ansi

# 5. Esperar a que la base de datos esté lista
echo "==> Esperando a que la base de datos esté disponible..."
max_retries=30
retry=0
until php /app/artisan db:monitor --databases=mysql 2>/dev/null | grep -q "OK" || [ $retry -ge $max_retries ]; do
    retry=$((retry + 1))
    echo "    Intento $retry/$max_retries — esperando base de datos..."
    sleep 2
done

if [ $retry -ge $max_retries ]; then
    echo "==> AVISO: No se pudo verificar la conexión a la DB. Intentando migrar de todos modos..."
fi

# 6. Limpiar cachés y ejecutar migraciones con seeders
echo "==> Limpiando cachés..."
php /app/artisan config:clear
php /app/artisan cache:clear 2>/dev/null || true
php /app/artisan route:clear

echo "==> Ejecutando migraciones y seeders..."
php /app/artisan migrate --seed --force

# 7. Cachear configuración y rutas para producción
if [ "$APP_ENV" = "production" ]; then
    echo "==> Cacheando configuración y rutas para producción..."
    php /app/artisan config:cache
    php /app/artisan route:cache
    php /app/artisan view:cache
fi

echo "==> ClientKosmos listo en http://localhost:8000"
echo ""
echo "    Credenciales de prueba:"
echo "    admin@clientkosmos.test    / password  (admin)"
echo "    premium@clientkosmos.test  / password  (premium)"
echo "    free@clientkosmos.test     / password  (free)"
echo ""

# 8. Ejecutar el comando pasado al contenedor (CMD)
exec "$@"
