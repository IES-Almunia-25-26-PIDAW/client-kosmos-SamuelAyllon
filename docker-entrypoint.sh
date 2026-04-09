#!/bin/bash
# ==============================================================================
# docker-entrypoint.sh — Script de arranque de ClientKosmos
# ==============================================================================
# Este script se ejecuta cada vez que el contenedor arranca, ANTES de levantar
# el servidor Laravel. Prepara todo lo necesario para que la app funcione.
#
# Pasos:
#   1. Crea el archivo .env si no existe
#   2. Mete las variables del docker-compose en el .env
#   3. Genera APP_KEY si no se pasó ninguna
#   4. Registra los paquetes de Laravel
#   5. Espera a que MySQL esté lista
#   6. Ejecuta las migraciones (y seeders si es la primera vez)
#   7. Cachea la configuración (solo en producción)
#   8. Arranca el servidor
# ==============================================================================

# Si cualquier comando falla, el script se para.
# -e   → para al primer error
# -u   → trata variables no definidas como error
# -o pipefail → un fallo en cualquier parte de un pipe se propaga como error
set -euo pipefail

echo "==> Iniciando ClientKosmos..."

# ──────────────────────────────────────────────────────────────────────────────
# PASO 1: Crear el .env
# ──────────────────────────────────────────────────────────────────────────────
# Laravel necesita un archivo .env con su configuración.
# Si no existe, copiamos el .env.example como base.
if [ ! -f /app/.env ]; then
    echo "==> Copiando .env.example -> .env"
    cp /app/.env.example /app/.env
fi

# ──────────────────────────────────────────────────────────────────────────────
# PASO 2: Volcar las variables del docker-compose al .env
# ──────────────────────────────────────────────────────────────────────────────
# Las variables que pusiste en docker-compose.yml llegan aquí como variables
# del sistema. Las escribimos en el .env para que Laravel las lea.
env_vars=(
    APP_NAME APP_ENV APP_DEBUG APP_KEY APP_URL
    DB_CONNECTION DB_HOST DB_PORT DB_DATABASE DB_USERNAME DB_PASSWORD DB_SSL_CA
    SESSION_DRIVER CACHE_STORE QUEUE_CONNECTION LOG_CHANNEL
    MAIL_MAILER MAIL_HOST MAIL_PORT MAIL_USERNAME MAIL_PASSWORD MAIL_FROM_ADDRESS MAIL_FROM_NAME
    GROQ_API_KEY GROQ_BASE_URL GROQ_MODEL
)
for var in "${env_vars[@]}"; do
    if [ -n "${!var+set}" ]; then
        val="${!var}"
        # Si APP_KEY está vacía, la dejamos para que el paso 3 genere una nueva
        if [ "$var" = "APP_KEY" ] && [ -z "$val" ]; then
            continue
        fi
        if grep -q "^${var}=" /app/.env; then
            # La variable ya existe en el .env → la sobreescribimos
            sed -i "s|^${var}=.*|${var}=${val}|" /app/.env
        else
            # No existe → la añadimos al final
            echo "${var}=${val}" >> /app/.env
        fi
    fi
done

# ──────────────────────────────────────────────────────────────────────────────
# PASO 3: Generar APP_KEY si no hay ninguna
# ──────────────────────────────────────────────────────────────────────────────
# APP_KEY es la clave que usa Laravel para cifrar sesiones y cookies.
# Si no la pasaste en el .env del host, la generamos y la exportamos como
# variable de entorno del sistema. Esto es necesario porque:
#   - key:generate --force escribe en /app/.env
#   - Pero config:cache (paso 7) lee de las env vars del sistema, que tienen
#     prioridad sobre el archivo .env
#   - Sin el export, la env var APP_KEY sigue vacía → 500 en cada petición
#
# IMPORTANTE: La clave generada se pierde al recrear el contenedor.
# Para persistirla, cópiala al .env del host:
#   docker compose exec app php artisan key:generate --show
if [ -z "${APP_KEY:-}" ]; then
    echo "==> No hay APP_KEY. Generando una nueva..."
    php /app/artisan key:generate --force
    # Leer la clave que key:generate acaba de escribir en .env y exportarla
    APP_KEY=$(grep "^APP_KEY=" /app/.env | cut -d '=' -f2-)
    export APP_KEY
    echo "==> APP_KEY generada: $APP_KEY"
    echo "    ⚠️  Copia este valor a tu .env del host para persistirla entre reinicios"
fi

# ──────────────────────────────────────────────────────────────────────────────
# PASO 4: Registrar paquetes de Laravel
# ──────────────────────────────────────────────────────────────────────────────
# Al instalar con composer usamos --no-scripts, así que ahora registramos
# manualmente los paquetes (Inertia, Fortify, etc.) para que Laravel los reconozca.
echo "==> Descubriendo paquetes Laravel..."
php /app/artisan package:discover --ansi

# ──────────────────────────────────────────────────────────────────────────────
# PASO 5: Esperar a que MySQL esté lista
# ──────────────────────────────────────────────────────────────────────────────
# Aunque docker-compose espera a que MySQL pase el healthcheck, a veces
# necesita unos segundos más. Este bucle intenta conectar hasta 30 veces.
#
# Validamos que las variables de conexión están definidas antes de usarlas.
# Sin ellas el contenedor no puede funcionar, así que fallamos rápido con
# un mensaje claro en lugar de dejar que bash explote con "unbound variable".
if [ -z "${DB_HOST:-}" ] || [ -z "${DB_PORT:-}" ] || [ -z "${DB_USERNAME:-}" ] || [ -z "${DB_PASSWORD:-}" ]; then
    echo "==> ERROR: Faltan variables de entorno de base de datos."
    echo "    Asegúrate de pasar DB_HOST, DB_PORT, DB_USERNAME y DB_PASSWORD al contenedor."
    echo "    Usa el archivo deploy/docker-compose.yml para levantarlo correctamente."
    exit 1
fi

echo "==> Esperando a que la base de datos esté disponible..."
max_retries=30
retry=0
until mysqladmin ping -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USERNAME" -p"$DB_PASSWORD" --ssl=0 --silent 2>/dev/null || [ $retry -ge $max_retries ]; do
    retry=$((retry + 1))
    echo "    Intento $retry/$max_retries — esperando..."
    sleep 2
done

if [ $retry -ge $max_retries ]; then
    echo "==> ERROR: La base de datos no respondio tras $max_retries intentos."
    echo "    Comprueba que el servicio 'db' esté activo y que DB_HOST/DB_PORT son correctos."
    echo "    Intentando continuar de todos modos (puede fallar en migraciones)..."
fi

# ──────────────────────────────────────────────────────────────────────────────
# PASO 6: Migraciones y seeders
# ──────────────────────────────────────────────────────────────────────────────
# Limpiamos cachés viejas para evitar problemas con la nueva configuración.
# cache:clear puede fallar si la tabla 'cache' aún no existe (primer arranque),
# por eso usamos || true para ignorar ese error.
echo "==> Limpiando cachés..."
php /app/artisan config:clear
php /app/artisan cache:clear 2>/dev/null || true
php /app/artisan route:clear

# Crea el enlace simbólico public/storage → storage/app/public
# para que los archivos subidos sean accesibles por URL
php /app/artisan storage:link --force 2>/dev/null || true

# Ejecuta las migraciones: crea o actualiza las tablas de la base de datos
echo "==> Ejecutando migraciones..."
php /app/artisan migrate --force

# Ejecutamos los seeders (datos de prueba) solo si la base de datos está vacía.
# Usamos el cliente mysql directamente para evitar que tinker falle en producción.
USER_COUNT=$(mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USERNAME" -p"$DB_PASSWORD" --ssl=0 -sN -e "SELECT COUNT(*) FROM users;" "$DB_DATABASE" 2>/dev/null || echo "0")
USER_COUNT="${USER_COUNT:-0}"
if [ "${USER_COUNT}" = "0" ]; then
    echo "==> Primera instalación. Ejecutando seeders..."
    php /app/artisan db:seed --force
else
    echo "==> Ya hay datos (${USER_COUNT} usuarios). Saltando seeders."
fi

# ──────────────────────────────────────────────────────────────────────────────
# PASO 7: Cachear en producción
# ──────────────────────────────────────────────────────────────────────────────
# En producción guardamos en caché la configuración, rutas y vistas compiladas
# para que la app responda más rápido.
if [ "$APP_ENV" = "production" ]; then
    echo "==> Cacheando configuración para producción..."
    php /app/artisan config:cache
    php /app/artisan route:cache
    php /app/artisan view:cache
fi

# ──────────────────────────────────────────────────────────────────────────────
# Todo listo
# ──────────────────────────────────────────────────────────────────────────────
echo "==> ClientKosmos listo en http://localhost:8000"
echo ""
echo "    Usuarios de prueba:"
echo "    admin@clientkosmos.test    / password  (admin)"
echo "    natalia@clientkosmos.test  / password  (professional)"
echo ""

# ──────────────────────────────────────────────────────────────────────────────
# PASO 8: Arrancar el servidor (CMD del Dockerfile)
# ──────────────────────────────────────────────────────────────────────────────
# "exec" reemplaza este script por el proceso PHP.
# Así PHP recibe las señales de Docker (por ejemplo, para parar limpiamente).
exec "$@"