#!/bin/bash
set -e

echo "==> Iniciando Flowly..."

# 1. Crear .env si no existe (necesario para que artisan funcione)
if [ ! -f /app/.env ]; then
    echo "==> Copiando .env.example -> .env"
    cp /app/.env.example /app/.env
fi

# 2. Generar APP_KEY si está vacío en el .env
if grep -q "^APP_KEY=$" /app/.env; then
    echo "==> Generando APP_KEY..."
    php /app/artisan key:generate --force
fi

# 3. Descubrir paquetes (se omitió en composer install con --no-scripts)
echo "==> Descubriendo paquetes Laravel..."
php /app/artisan package:discover --ansi

# 4. Asegurar que el archivo SQLite existe (puede haberse montado vacío)
touch /app/database/database.sqlite

# 5. Ejecutar migraciones y seeders
echo "==> Ejecutando migraciones y seeders..."
php /app/artisan migrate --seed --force

echo "==> Flowly listo en http://localhost:8000"
echo ""
echo "    Credenciales de prueba:"
echo "    admin@flowly.test    / password  (admin)"
echo "    premium@flowly.test  / password  (premium)"
echo "    free@flowly.test     / password  (free)"
echo ""

# 6. Ejecutar el comando pasado al contenedor (CMD)
exec "$@"
