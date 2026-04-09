<div align="center">

# 🪐 ClientKosmos — Despliegue con Docker

### Levanta ClientKosmos en local en menos de 2 minutos sin instalar PHP ni Node

[![Docker](https://img.shields.io/badge/Docker-samue45%2Fclient--kosmos-2496ED?style=flat-square&logo=docker&logoColor=white)](https://hub.docker.com/r/samue45/client-kosmos)
[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat-square&logo=laravel&logoColor=white)](https://laravel.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](../LICENSE)

</div>

---

Este directorio contiene el `docker-compose.yml` listo para usar con la imagen publicada en Docker Hub.
No necesitas clonar el código fuente ni compilar nada — Docker descarga la imagen ya construida.

> **¿Buscas el código fuente?** Está en la raíz del repositorio junto con su propio `docker-compose.yml` para desarrollo (que construye la imagen localmente).

---

## Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows / macOS) o Docker Engine + Compose plugin (Linux)
- Conexión a internet para descargar las imágenes la primera vez (~200 MB)

---

## Inicio rápido

```bash
# 1. Descarga solo este directorio (o clona el repo completo)
git clone <repo-url>
cd client-kosmos-SamuelAyllon/deploy

# 2. Arranca los tres contenedores
docker compose up -d

# 3. Sigue los logs hasta que veas "Laravel development server started"
docker compose logs -f app
```

Abre **http://localhost:8000** en el navegador.

> El primer arranque tarda ~60 segundos mientras MySQL se inicializa y el entrypoint ejecuta las migraciones. Esto es normal.

---

## Accesos

| Servicio | URL | Descripción |
|---------|-----|-------------|
| Aplicación | http://localhost:8000 | ClientKosmos |
| Mailpit | http://localhost:8025 | Bandeja de correo de prueba |

---

## Credenciales de prueba

Creadas automáticamente por los seeders en el primer arranque:

| Rol | Email | Password |
|-----|-------|:--------:|
| **Admin** | admin@clientkosmos.test | `password` |
| **Professional** | natalia@clientkosmos.test | `password` |

---

## Configuración

Edita las variables de entorno directamente en `docker-compose.yml`:

### APP_KEY (recomendado)

Por defecto se genera automáticamente en cada nuevo contenedor, lo que invalida sesiones activas al recrearlo. Para que sea estable:

```bash
# Obtén la clave generada
docker compose exec app php artisan key:generate --show

# Cópiala en el docker-compose.yml
APP_KEY: "base64:tu_clave_aqui..."

# Recrea el contenedor con la nueva configuración
docker compose up -d app
```

### IA contextual (Kosmo) — opcional

Sin `GROQ_API_KEY` la aplicación funciona completamente, pero las funciones de IA no estarán disponibles:

```yaml
GROQ_API_KEY: "gsk_tu_clave_aqui"
```

Consigue una clave gratuita (14.400 req/día) en [console.groq.com/keys](https://console.groq.com/keys).

---

## Comandos útiles

```bash
# Ver estado de los contenedores
docker compose ps

# Ver logs en tiempo real
docker compose logs -f app

# Abrir terminal dentro del contenedor de la app
docker compose exec app bash

# Resetear la base de datos con datos de prueba
docker compose exec app php artisan migrate:fresh --seed

# Actualizar a la última versión de la imagen
docker compose pull
docker compose up -d

# Parar sin borrar datos
docker compose down

# Parar y borrar también la base de datos
docker compose down -v
```

---

## Contenedores

| Contenedor | Imagen | Puerto(s) | Descripción |
|------------|--------|-----------|-------------|
| `clientkosmos_app` | `samue45/client-kosmos:latest` | `8000` | Aplicación Laravel |
| `clientkosmos_db` | `mysql:8.0` | `3306` | Base de datos MySQL |
| `clientkosmos_mailpit` | `axllent/mailpit` | `1025`, `8025` | Servidor de correo de prueba |

### Qué hace el entrypoint al arrancar

El contenedor `app` ejecuta automáticamente estos pasos en orden:

1. Copia `.env.example` → `.env` e inyecta las variables del compose
2. Genera `APP_KEY` si está vacía
3. Espera a que MySQL esté listo (hasta 30 reintentos)
4. Ejecuta `php artisan migrate --force`
5. Ejecuta `php artisan db:seed` solo si la tabla `users` está vacía
6. Cachea configuración, rutas y vistas (`optimize`)
7. Arranca `php artisan serve --host=0.0.0.0 --port=8000`

---

## Troubleshooting

| Síntoma | Causa | Solución |
|---------|-------|----------|
| La app tarda en arrancar | MySQL inicializando por primera vez | Normal. Espera ~60 s y observa `docker compose logs -f app` |
| `Unable to connect to database` | MySQL aún no está listo | El restart policy (`on-failure`) reintentará automáticamente |
| Los correos no llegan | — | No llegan nunca: están capturados en Mailpit → http://localhost:8025 |
| Sesiones se invalidan al reiniciar | `APP_KEY` cambia en cada contenedor nuevo | Fija la `APP_KEY` (ver sección Configuración) |
| Puerto 8000 en uso | Otro proceso ocupa ese puerto | Cambia `"8000:8000"` por `"8001:8000"` en el compose |
| Puerto 3306 en uso | MySQL local instalado en el host | Cambia `"3306:3306"` por `"3307:3306"` o comenta el `ports` de db |

---

## Estructura de este directorio

```
deploy/
├── docker-compose.yml   ← Compose listo para usar con la imagen de Docker Hub
└── README.md            ← Este archivo
```

El `docker-compose.yml` de la raíz del proyecto (`../docker-compose.yml`) es diferente: construye la imagen localmente desde el `Dockerfile` y está pensado para desarrollo activo del código.

---

<div align="center">

**Samuel Ayllón** — Proyecto Intermodular 2º DAM

[Docker Hub](https://hub.docker.com/r/samue45/client-kosmos) · [Código fuente](../)

</div>
