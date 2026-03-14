#!/bin/bash
set -e

echo "==> Iniciando Flowly..."

# 1. Crear .env si no existe (necesario para que artisan funcione)
if [ ! -f /app/.env ]; then
    echo "==> Copiando .env.example -> .env"
    cp /app/.env.example /app/.env
fi

# 2. APP_KEY: usar la variable de entorno si existe, o generar una nueva
if [ -n "$APP_KEY" ]; then
    echo "==> Usando APP_KEY de variable de entorno"
    sed -i "s|^APP_KEY=.*|APP_KEY=$APP_KEY|" /app/.env
elif grep -q "^APP_KEY=$" /app/.env; then
    echo "==> AVISO: No se definió APP_KEY. Generando una temporal..."
    echo "==> Establece APP_KEY en docker-compose.yml para persistirla."
    php /app/artisan key:generate --force
fi

# 3. Descubrir paquetes (se omitió en composer install con --no-scripts)
echo "==> Descubriendo paquetes Laravel..."
php /app/artisan package:discover --ansi

# 4. Ejecutar migraciones y seeders
echo "==> Ejecutando migraciones y seeders..."
php /app/artisan migrate --seed --force

echo "==> Flowly listo en http://localhost:8000"
echo ""
echo "    Credenciales de prueba:"
echo "    admin@flowly.test    / password  (admin)"
echo "    premium@flowly.test  / password  (premium)"
echo "    free@flowly.test     / password  (free)"
echo ""

# 5. Ejecutar el comando pasado al contenedor (CMD)
exec "$@"
