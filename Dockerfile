# ==============================================================================
# Dockerfile de ClientKosmos (Laravel + React)
# ==============================================================================
# Un Dockerfile "multi-stage" divide la construcción en varias etapas.
# Cada etapa hace una cosa, y la imagen final solo coge lo que necesita.
# Resultado: imagen más pequeña y limpia.
#
# Etapas:
#   1. deps     → descarga las librerías PHP (Composer)
#   2. frontend → compila el código React/TypeScript (Node + Vite)
#   3. final    → imagen que se ejecuta en producción
#
# Para arrancar el proyecto: docker compose up --build
# ==============================================================================


# ==============================================================================
# ETAPA 1: Descargar librerías PHP con Composer
# ==============================================================================
# Usamos PHP 8.4 en Alpine (Alpine = versión de Linux muy ligera)
FROM php:8.4-cli-alpine AS deps

# unzip lo necesita Composer para descomprimir los paquetes
RUN apk add --no-cache unzip

# Copiamos el ejecutable de Composer desde su imagen oficial
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Directorio de trabajo dentro del contenedor (como hacer cd /app)
WORKDIR /app

# Copiamos solo los archivos de dependencias primero.
# Así Docker usa la caché y no re-descarga todo si el código no cambia.
COPY composer.json composer.lock ./

# Instalamos las dependencias PHP sin las de desarrollo
RUN composer install \
    --no-scripts \
    --no-interaction \
    --optimize-autoloader


# ==============================================================================
# ETAPA 2: Compilar el frontend (React + Vite)
# ==============================================================================
# Node 20 en Alpine para ejecutar Vite.
# También necesitamos PHP porque Vite llama a "php artisan" durante el build.
FROM node:20-alpine AS frontend

# Instalamos PHP y algunos módulos que necesita artisan
RUN apk add --no-cache php84 php84-tokenizer php84-mbstring php84-xml \
    php84-phar php84-openssl php84-dom php84-xmlwriter php84-ctype \
    php84-pdo php84-pdo_sqlite php84-fileinfo php84-session \
    && ln -sf /usr/bin/php84 /usr/bin/php

WORKDIR /app

# Traemos las librerías PHP de la etapa anterior
COPY --from=deps /app/vendor vendor/

# Copiamos los archivos de dependencias Node y las instalamos
COPY package.json package-lock.json ./
RUN npm ci

# Copiamos la configuración de Vite y TypeScript
COPY vite.config.ts tsconfig.json components.json ./

# Copiamos el código fuente del frontend y otros archivos que necesita artisan
COPY resources/ resources/
COPY public/ public/
COPY artisan ./
COPY bootstrap/ bootstrap/
COPY config/ config/
COPY routes/ routes/
COPY app/ app/
COPY database/ database/

# Creamos carpetas que Laravel necesita para no dar error al arrancar
RUN mkdir -p bootstrap/cache storage/framework/sessions storage/framework/views \
    storage/framework/cache/data storage/logs \
    && chmod -R 775 bootstrap/cache storage

# Vite necesita el .env para leer algunas variables durante el build
COPY .env.example .env

# Compilamos el frontend: convierte React/TypeScript → JavaScript optimizado
# El resultado queda en public/build/
RUN npm run build


# ==============================================================================
# ETAPA 3: Imagen final (la que se ejecuta)
# ==============================================================================
FROM php:8.4-cli-alpine

# Instalamos las herramientas del sistema que PHP y Laravel necesitan
RUN apk add --no-cache \
    bash \
    curl \
    unzip \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    libzip-dev \
    icu-dev \
    openssl-dev \
    mysql-client

# Instalamos las extensiones PHP que usa Laravel
RUN docker-php-ext-install \
    pdo \
    pdo_mysql \
    mbstring \
    xml \
    bcmath \
    zip \
    intl \
    opcache

# Copiamos Composer por si necesitamos ejecutar comandos en el contenedor
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copiamos las librerías PHP de la etapa 1
COPY --from=deps /app/vendor vendor/

# Copiamos todo el código fuente de la aplicación
COPY . .

# Copiamos el frontend ya compilado de la etapa 2
COPY --from=frontend /app/public/build public/build/

# Creamos las carpetas de almacenamiento que Laravel necesita al arrancar
RUN mkdir -p \
        storage/framework/sessions \
        storage/framework/views \
        storage/framework/cache/data \
        storage/logs \
        bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Copiamos el script de arranque y le damos permisos de ejecución
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Indicamos que la app escucha en el puerto 8000
EXPOSE 8000

# Script que se ejecuta al arrancar el contenedor (migraciones, etc.)
ENTRYPOINT ["docker-entrypoint.sh"]
# Comando principal: levanta el servidor de Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
