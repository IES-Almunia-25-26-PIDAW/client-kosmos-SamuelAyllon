# ============================================================
# Stage 1: Build de assets frontend (Node.js + Vite)
# ============================================================
FROM node:20-alpine AS frontend

WORKDIR /app

# Instalar dependencias npm primero (aprovecha cache de Docker)
COPY package*.json ./
RUN npm ci

# Copiar código fuente necesario para el build
COPY vite.config.ts tsconfig.json ./
COPY resources/ resources/
COPY public/ public/
# Vite necesita APP_NAME del entorno; usamos el ejemplo
COPY .env.example .env

RUN npm run build

# ============================================================
# Stage 2: Aplicación PHP (servidor final)
# ============================================================
FROM php:8.2-cli-alpine

# Dependencias del sistema
RUN apk add --no-cache \
    bash \
    curl \
    unzip \
    sqlite \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    libzip-dev \
    icu-dev

# Extensiones PHP necesarias para Laravel
RUN docker-php-ext-install \
    pdo \
    pdo_sqlite \
    mbstring \
    xml \
    bcmath \
    zip \
    intl \
    opcache

# Instalar Composer desde su imagen oficial
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Instalar dependencias PHP de producción
# --no-scripts: evita que artisan se ejecute durante build (sin .env aún)
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-interaction \
    --optimize-autoloader

# Copiar todo el código de la aplicación
COPY . .

# Sobrescribir con los assets compilados del stage 1
COPY --from=frontend /app/public/build public/build/

# Preparar directorios de runtime con permisos correctos
RUN mkdir -p \
        database \
        storage/framework/sessions \
        storage/framework/views \
        storage/framework/cache/data \
        storage/logs \
        bootstrap/cache \
    && touch database/database.sqlite \
    && chmod -R 775 storage database bootstrap/cache

# Copiar y dar permisos al entrypoint
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
