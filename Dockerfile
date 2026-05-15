# ==============================================================================
# Dockerfile de ClientKosmos (Laravel + React) — FrankenPHP
# ==============================================================================
# Multi-stage:
#   1. deps     → librerías PHP (Composer)
#   2. frontend → React/TS compilado (Node + Vite)
#   3. final    → imagen ejecutable basada en FrankenPHP (Caddy + PHP 8.4)
#
# El servidor de aplicación es FrankenPHP. Traefik se encarga de TLS por
# delante; FrankenPHP escucha HTTP plano en :8000 (ver docker/Caddyfile).
#
# Para arrancar el proyecto (desarrollo): docker compose up --build
# ==============================================================================


# ==============================================================================
# ETAPA 1: Composer
# ==============================================================================
FROM php:8.4-cli-alpine AS deps

RUN apk add --no-cache unzip
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./

RUN composer install \
    --no-scripts \
    --no-dev \
    --no-interaction \
    --optimize-autoloader


# ==============================================================================
# ETAPA 2: Frontend (Vite + React)
# ==============================================================================
FROM node:20-alpine AS frontend

# PHP necesario porque Vite invoca artisan durante el build (Wayfinder)
RUN apk add --no-cache php84 php84-tokenizer php84-mbstring php84-xml \
    php84-phar php84-openssl php84-dom php84-xmlwriter php84-ctype \
    php84-pdo php84-pdo_sqlite php84-fileinfo php84-session \
    && ln -sf /usr/bin/php84 /usr/bin/php

WORKDIR /app

COPY --from=deps /app/vendor vendor/

COPY package.json package-lock.json ./
RUN npm ci

COPY vite.config.ts tsconfig.json components.json ./
COPY resources/ resources/
COPY public/ public/
COPY artisan ./
COPY bootstrap/ bootstrap/
COPY config/ config/
COPY routes/ routes/
COPY app/ app/
COPY database/ database/

RUN mkdir -p bootstrap/cache storage/framework/sessions storage/framework/views \
    storage/framework/cache/data storage/logs \
    && chmod -R 775 bootstrap/cache storage

COPY .env.example .env

RUN npm run build


# ==============================================================================
# ETAPA 3: Imagen final — FrankenPHP
# ==============================================================================
# dunglas/frankenphp ya trae Caddy embebido + PHP 8.4 + install-php-extensions.
# La imagen base alpine pesa ~70 MB; con extensiones + app debería quedar < 200 MB.
FROM dunglas/frankenphp:1-php8.4-alpine

# Instalamos extensiones PHP de runtime usando install-php-extensions (helper
# que ya viene en la imagen FrankenPHP). Usa apk virtual deps internamente y
# las purga al terminar — no quedan headers *-dev en la capa final.
RUN install-php-extensions \
        pdo_mysql \
        intl \
        zip \
        bcmath \
        opcache \
        pcntl

# curl es necesario para el HEALTHCHECK. bash facilita el entrypoint.
RUN apk add --no-cache bash curl

WORKDIR /app

# vendor (PHP sin dev) desde etapa 1
COPY --from=deps /app/vendor vendor/

# Código de la aplicación. .dockerignore filtra lo que no debe entrar.
COPY . .

# Frontend compilado desde etapa 2
COPY --from=frontend /app/public/build public/build/

# Configuración de Caddy/FrankenPHP
COPY docker/Caddyfile /etc/caddy/Caddyfile

# Permisos para storage y bootstrap/cache
RUN mkdir -p \
        storage/framework/sessions \
        storage/framework/views \
        storage/framework/cache/data \
        storage/logs \
        bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

# Entrypoint (migraciones, caches, etc.)
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# /up es el healthcheck integrado en Laravel 11+.
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/up || exit 1

EXPOSE 8000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["frankenphp", "run", "--config", "/etc/caddy/Caddyfile"]
