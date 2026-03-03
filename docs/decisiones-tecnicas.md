# Justificación Técnica de Decisiones — Flowly

> Proyecto Intermodular — 2º DAM
> Autor: Samuel Ayllón
> Fecha: 2026-02-24

---

## 1. Stack tecnológico

### 1.1 Laravel 12 (Backend)

**Decisión:** usar Laravel como framework PHP en su versión más reciente.

**Justificación:**
- Es el framework PHP más utilizado en el mercado laboral (según el índice de popularidad de Packagist y encuestas de JetBrains).
- Proporciona todas las herramientas necesarias de forma integrada: ORM (Eloquent), autenticación, migraciones, testing, colas, etc.
- Su arquitectura MVC facilita la separación de responsabilidades.
- Compatible con el ecosistema de paquetes de Composer, lo que aceleró el desarrollo con librerías como Spatie Permission y Fortify.

**Alternativas descartadas:** Symfony (mayor curva de aprendizaje y más verboso para proyectos pequeños), Slim/Lumen (demasiado minimalistas para las necesidades del proyecto).

---

### 1.2 Inertia.js 2 + React 18 (Frontend)

**Decisión:** usar Inertia.js como puente entre Laravel y React, en lugar de una API REST tradicional.

**Justificación:**
- Inertia.js permite construir SPAs monolíticas sin necesidad de una API REST separada, eliminando toda la capa de serialización/deserialización JSON y autenticación de tokens.
- El resultado es código más sencillo: el controlador Laravel devuelve directamente `Inertia::render('pagina', $datos)` en lugar de `response()->json(...)` + fetch en el frontend.
- React 18 fue elegido sobre Vue/Svelte por ser el framework más demandado en el mercado y por la riqueza de su ecosistema (shadcn/ui, Radix UI, etc.).

**Alternativas descartadas:** API REST + React independiente (mayor complejidad, requiere gestión de tokens JWT, CORS, etc.); Livewire (menos control sobre el frontend y menor transferibilidad de conocimientos).

---

### 1.3 TypeScript (tipado estático)

**Decisión:** usar TypeScript en todo el frontend en lugar de JavaScript plano.

**Justificación:**
- El tipado estático detecta errores en tiempo de compilación que en JavaScript solo aparecen en ejecución.
- Los tipos están organizados en subcarpetas (`models/`, `pages/`, `admin/`, `shared/`) para reflejar la estructura de la aplicación y facilitar la búsqueda.
- Mejora significativa de la experiencia de desarrollo con autocompletado e IntelliSense.

---

### 1.4 SQLite → TiDB Cloud Serverless (Base de datos)

**Decisión inicial:** SQLite para desarrollo local (sin configuración adicional).
**Decisión de despliegue:** TiDB Cloud Serverless (MySQL-compatible) para producción y demostración.

**Justificación SQLite en desarrollo:**
- Cero configuración: el archivo de base de datos se crea automáticamente.
- Ideal para desarrollo rápido y ejecución de tests con `RefreshDatabase`.
- Laravel abstrae completamente el motor a través de Eloquent y el Schema Builder.

**Justificación TiDB Cloud para despliegue:**
- Plan gratuito Serverless sin tarjeta de crédito, ideal para un proyecto académico.
- 100% compatible con MySQL 8.0, lo que garantiza que las migraciones de Laravel funcionan sin cambios.
- Conexión segura SSL incluida sin gestionar un servidor propio.
- Las migraciones no requirieron ninguna modificación al cambiar de driver, lo que demuestra la portabilidad del Schema Builder de Laravel.

---

### 1.5 TiDB Cloud vs. otras opciones gratuitas

| Opción | Ventaja | Inconveniente |
|--------|---------|---------------|
| **TiDB Cloud Serverless** | MySQL-compatible, SSL nativo, sin tarjeta | Latencia ligeramente mayor que local |
| PlanetScale | Similar a TiDB, muy popular | Eliminó el plan gratuito en 2024 |
| Railway (MySQL) | Sencillo de configurar | Requiere tarjeta de crédito |
| Supabase (PostgreSQL) | Muy completo | Requeriría cambiar el driver a `pgsql` |

---

## 2. Autenticación — Laravel Fortify

**Decisión:** usar Fortify en lugar de Laravel Breeze o Jetstream.

**Justificación:**
- Fortify proporciona la lógica de autenticación (registro, login, reset de contraseña, verificación de email, 2FA) sin imponer ninguna capa de UI.
- Esto permite construir el frontend con total libertad en React + shadcn/ui, sin que el scaffolding del paquete "pelee" con nuestros componentes.
- Breeze y Jetstream generan código de vistas que hay que sobrescribir; Fortify no genera nada visual.

---

## 3. Control de acceso — Spatie Permission

**Decisión:** usar `spatie/laravel-permission` para la gestión de roles y permisos.

**Justificación:**
- Es el paquete de autorización más descargado del ecosistema Laravel (>20M descargas en Packagist).
- Permite asignar roles (`admin`, `premium_user`, `free_user`) y aplicarlos como middleware directamente en rutas: `role:premium_user`, `role:admin`.
- Las Policies de Laravel complementan a Spatie para la autorización a nivel de recurso (solo el propietario puede modificar su tarea).
- La combinación Middleware + Policy cubre todos los niveles de autorización sin redundancias.
- **Aislamiento de roles:** el rol `admin` tiene acceso exclusivo al panel de administración (`/admin/*`) y no a las rutas premium (`/projects`, `/boxes`, `/resources`). Esta separación garantiza que la gestión de la plataforma y el uso de funcionalidades de usuario son responsabilidades completamente distintas.

---

## 4. Sistema de pagos — simulado intencionadamente

**Decisión:** implementar un sistema de pagos simulado (80% éxito / 20% fallo) en lugar de integrar una pasarela real como Stripe.

**Justificación:**
- El objetivo del proyecto es demostrar la lógica de negocio (cambio de plan, actualización de rol, registro de pagos), no la integración con un tercero.
- Una integración real con Stripe requeriría credenciales, webhooks y un dominio público HTTPS, lo que está fuera del alcance de un proyecto académico.
- El diseño del modelo `Payment` y el controlador `CheckoutController` están preparados para sustituir `Payment::process()` por una llamada real a Stripe/Redsys con mínimos cambios.

---

## 5. UI Components — shadcn/ui

**Decisión:** usar shadcn/ui como librería de componentes en lugar de MUI, Ant Design o Chakra UI.

**Justificación:**
- shadcn/ui no es una dependencia: los componentes se copian directamente al proyecto y se pueden modificar sin restricciones.
- Está construido sobre Radix UI (accesible por defecto) y Tailwind CSS, lo que garantiza consistencia con el resto del frontend.
- El resultado es un diseño limpio, moderno y totalmente adaptable sin "vendor lock-in" de estilos.

---

## 6. Testing — Pest PHP

**Decisión:** usar Pest en lugar de PHPUnit directamente.

**Justificación:**
- Pest proporciona una API más expresiva y legible que PHPUnit, con funciones globales como `it()`, `test()`, `beforeEach()`.
- Es totalmente compatible con PHPUnit (corre sobre él), por lo que no sacrifica funcionalidad.
- El trait `RefreshDatabase` garantiza que cada test parte de una base de datos limpia, haciendo los tests independientes entre sí.
- **Resultado:** 143 tests / 551 assertions pasando al 100%.

---

## 7. Contenedorización — Docker multi-stage

**Decisión:** usar un Dockerfile multi-stage en lugar de un único stage.

**Justificación:**
- El stage `builder` (Node.js) compila los assets de frontend (Vite/React) y los descarta del stage final, reduciendo el tamaño de la imagen de producción.
- El stage final solo contiene PHP-FPM, Nginx y los archivos de la aplicación compilados.
- El `docker-entrypoint.sh` ejecuta automáticamente `migrate --force` y `db:seed` al arrancar, garantizando que la BD esté siempre en el estado correcto sin intervención manual.

---

## 8. Estrategia de ramas Git

**Decisión:** desarrollo sobre rama `main` única, sin feature branches.

**Justificación:**
- Este proyecto es desarrollado íntegramente por **una sola persona**. El propósito de las ramas paralelas (feature branches, Gitflow) es permitir que varios desarrolladores trabajen simultáneamente en distintas funcionalidades sin interferirse.
- Con un único desarrollador, mantener ramas separadas añade fricción (merge, conflictos, cambios de contexto) sin ningún beneficio real.
- En proyectos reales con equipo, se aplicaría Gitflow o GitHub Flow con pull requests y revisión de código. Esta misma decisión quedaría documentada en el `CONTRIBUTING.md` del proyecto.
- El historial de commits refleja el progreso del desarrollo de forma clara y cronológica.

---

## 9. Estructura de tipos TypeScript

**Decisión:** organizar los tipos en subcarpetas temáticas (`models/`, `pages/`, `admin/`, `shared/`) en lugar de un único archivo `types.ts`.

**Justificación:**
- Un solo archivo de tipos crece hasta ser inmanejable en proyectos medianos/grandes.
- La estructura refleja la arquitectura de la aplicación: los tipos de modelos (`Task`, `Project`, etc.) están separados de los tipos de props de páginas y de los tipos de admin.
- El archivo `types/index.ts` actúa como barrel de re-exportaciones, por lo que el resto del código solo necesita `import { Task } from '@/types'`.
