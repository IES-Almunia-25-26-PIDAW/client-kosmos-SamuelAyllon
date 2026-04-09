# Justificación de Implementación — ClientKosmos

> Documento técnico que justifica las decisiones de arquitectura, stack tecnológico y patrones de diseño adoptados en el desarrollo de ClientKosmos.

---

## Tabla de Contenidos

1. [Justificación del proyecto](#1-justificación-del-proyecto)
2. [Elección del stack tecnológico](#2-elección-del-stack-tecnológico)
3. [Arquitectura: SPA monolítica con Inertia.js](#3-arquitectura-spa-monolítica-con-inertiajs)
4. [Patrón Single-Action Controllers](#4-patrón-single-action-controllers)
5. [Autenticación y autorización](#5-autenticación-y-autorización)
6. [Modelo de datos y relaciones](#6-modelo-de-datos-y-relaciones)
7. [Integración de IA (Kosmo)](#7-integración-de-ia-kosmo)
8. [Estrategia de testing](#8-estrategia-de-testing)
9. [Despliegue con Docker](#9-despliegue-con-docker)
10. [Base de datos: SQLite en desarrollo, TiDB Cloud en producción](#10-base-de-datos-sqlite-en-desarrollo-tidb-cloud-en-producción)
11. [Decisiones de diseño UI/UX](#11-decisiones-de-diseño-uiux)

---

## 1. Justificación del proyecto

### Necesidad identificada

Los profesionales autónomos de servicios de salud y bienestar (psicólogos, coaches, terapeutas) enfrentan un problema de fragmentación operativa: gestionan pacientes en una herramienta, facturas en otra, documentación en carpetas físicas o correo electrónico, y consentimientos RGPD en papel.

Esta fragmentación genera:
- Pérdida de contexto entre sesiones
- Riesgo de incumplimiento legal (RGPD, consentimiento informado)
- Tiempo dedicado a tareas administrativas que podría usarse con pacientes

### Solución propuesta

ClientKosmos centraliza la gestión de la consulta en una única plataforma web multiusuario con:
- Ficha completa de cada paciente
- Módulos anidados (notas, acuerdos, pagos, documentos, consentimientos)
- Asistente IA contextual (Kosmo)
- Panel de administración para gestión de usuarios

---

## 2. Elección del stack tecnológico

### 2.1 Backend: Laravel 12

**Justificación:**
- Framework PHP maduro con convenciones claras (Eloquent ORM, migraciones, policies, middleware)
- Ecosistema rico: Fortify para autenticación, Spatie Permission para roles
- Excelente integración con Inertia.js mediante el paquete oficial
- PHP 8.4 aporta tipos más estrictos y mejoras de rendimiento

**Alternativas consideradas:**
- **Node.js/Express**: Descartado por mayor complejidad en gestión de autenticación robusta y ORMs menos maduros para este tipo de aplicación
- **Django**: Descartado por menor familiaridad del equipo y menor integración con el stack frontend elegido

### 2.2 Frontend: React 19 + TypeScript 5.7

**Justificación:**
- React 19 con React Compiler elimina la necesidad de `useMemo`/`useCallback` manual
- TypeScript aporta seguridad de tipos que es especialmente valiosa en una aplicación con muchos modelos de datos (Patient, Note, Payment, etc.)
- Ecosistema maduro de componentes UI (shadcn/ui)

**Alternativas consideradas:**
- **Vue.js**: Inertia también soporta Vue, pero React ofrece mayor ecosistema y comunidad
- **Livewire (HTMX)**: Descartado por menor capacidad para interfaces reactivas complejas

### 2.3 Inertia.js 2.3

**Justificación:**
- Permite construir una SPA sin necesitar una API REST separada
- El backend Laravel sigue siendo la fuente de verdad (autenticación, validación, autorización)
- Elimina la duplicación de lógica de validación en frontend y backend
- Las respuestas de Inertia incluyen props tipadas en TypeScript mediante Laravel Wayfinder

### 2.4 Tailwind CSS 4.0 + shadcn/ui

**Justificación:**
- Tailwind 4.0 con tokens CSS nativos permite un design system consistente sin librerías de CSS externas
- shadcn/ui proporciona componentes accesibles (Radix UI) con estilos customizables
- La combinación permite iteración rápida en UI manteniendo coherencia visual

### 2.5 Pest 3 (testing)

**Justificación:**
- Sintaxis expresiva y legible (`it('...', fn() => ...)`)
- Integración nativa con PHPUnit para compatibilidad con el ecosistema Laravel
- Helpers globales (`createAdmin()`, `createProfessional()`) en `Pest.php` reducen duplicación en los tests
- `RefreshDatabase` por trait para aislamiento de base de datos entre tests

---

## 3. Arquitectura: SPA monolítica con Inertia.js

### Patrón elegido

```
Browser (React SPA)  ←──Inertia──→  Laravel Controllers  ←──Eloquent──→  Database
```

### Ventajas sobre REST API + SPA separada

| Aspecto | REST API + SPA | Inertia.js (elegido) |
|---------|---------------|----------------------|
| Autenticación | JWT / OAuth complejo | Sesiones de servidor (simple) |
| Validación | Duplicada (backend + frontend) | Solo backend, errores automáticos |
| Tipos TypeScript | Generados manualmente | Generados por Wayfinder |
| Navegación | Client-side routing | Pushstate automático |
| Seguridad CSRF | Configurable | Automática |

### Flujo de petición

1. El usuario navega o envía un formulario
2. Inertia envía la petición al servidor Laravel con cabecera `X-Inertia`
3. El controlador procesa la petición (validación, lógica, BD)
4. Se retorna `Inertia::render('pagina', $props)` o `redirect()`
5. Inertia actualiza el componente React sin recargar la página completa

---

## 4. Patrón Single-Action Controllers

### Decisión

Cada acción del controlador tiene su propio archivo PHP con un único método `__invoke`:

```
app/Http/Controllers/
├── Patient/
│   ├── IndexAction.php      ← GET /patients
│   ├── CreateAction.php     ← GET /patients/create
│   ├── StoreAction.php      ← POST /patients
│   ├── ShowAction.php       ← GET /patients/{patient}
│   ├── EditAction.php       ← GET /patients/{patient}/edit
│   ├── UpdateAction.php     ← PUT /patients/{patient}
│   ├── DestroyAction.php    ← DELETE /patients/{patient}
│   ├── PreSessionAction.php ← GET /patients/{patient}/pre-session
│   └── PostSessionAction.php← GET /patients/{patient}/post-session
```

### Justificación

| Ventaja | Detalle |
|---------|---------|
| **Responsabilidad única** | Cada clase hace exactamente una cosa |
| **Testabilidad** | Los tests son más focalizados y descriptivos |
| **Mantenibilidad** | Añadir una nueva acción no afecta a otras |
| **Legibilidad de rutas** | `PatientStoreAction::class` es más explícito que `[PatientController::class, 'store']` |
| **Inyección de dependencias** | El constructor de cada acción solo inyecta lo que necesita |

### Comparación con controladores de recursos

```php
// Sin Single-Action: un archivo grande con 7+ métodos
class PatientController extends Controller
{
    public function index() { ... }
    public function store() { ... }
    // ... 5 métodos más
}

// Con Single-Action: un archivo por responsabilidad
class StoreAction extends Controller
{
    public function __invoke(StorePatientRequest $request): RedirectResponse
    {
        Patient::create([...]);
        return redirect()->route('patients.index');
    }
}
```

---

## 5. Autenticación y autorización

### 5.1 Laravel Fortify

**Justificación:**
Fortify provee toda la infraestructura de autenticación sin imponer una UI:
- Login / logout con protección de rate limiting
- Registro con verificación de email obligatoria
- Reset de contraseña por email
- Autenticación de dos factores (TOTP) con códigos de recuperación
- Confirmación de contraseña antes de acciones sensibles

### 5.2 Spatie Laravel Permission (roles)

**Dos roles en el sistema:**

| Rol | Acceso |
|-----|--------|
| `admin` | Panel de administración `/admin/*` |
| `professional` | Toda la funcionalidad de consulta (`/dashboard`, `/patients`, etc.) |

**Middleware personalizado:**

```php
// EnsureAdmin: solo admins acceden a /admin/*
class EnsureAdmin {
    public function handle($request, $next) {
        if (! $request->user()?->isAdmin()) {
            return redirect()->route('dashboard');
        }
        return $next($request);
    }
}

// EnsureProfessional: redirige admins fuera de rutas de consulta
class EnsureProfessional {
    public function handle($request, $next) {
        if ($request->user()?->isAdmin()) {
            return redirect()->route('admin.users.index');
        }
        return $next($request);
    }
}
```

### 5.3 Policies (ownership)

Las políticas de Laravel garantizan que un profesional solo puede acceder a sus propios pacientes y datos relacionados:

```php
class PatientPolicy
{
    public function view(User $user, Patient $patient): bool
    {
        return $user->id === $patient->user_id;
    }
}
```

Esta autorización por propiedad es crítica en una aplicación multiusuario con datos sensibles de salud.

---

## 6. Modelo de datos y relaciones

### Esquema de relaciones principal

```
User (professional)
  └── Patient (1:N)
       ├── Note (1:N)
       ├── Agreement (1:N)
       ├── Payment (1:N)
       ├── Document (1:N)
       └── ConsentForm (1:N)

User
  └── Payment (1:N)   ← también directamente para facturación global

User
  └── KosmoBriefing (1:N)
```

### Decisiones sobre el modelo Patient

El modelo `Patient` tiene un campo `user_id` que lo asocia al profesional propietario. Todas las consultas filtran automáticamente por `user_id` para garantizar el aislamiento de datos:

```php
// Siempre filtramos por el usuario autenticado
$patients = $request->user()->patients()->where('is_active', true)->get();
```

### Soft Deletes en User

Los usuarios eliminados usan `SoftDeletes` para preservar la integridad referencial (sus pacientes, notas y pagos históricos se mantienen en la base de datos aunque el usuario ya no esté activo).

---

## 7. Integración de IA (Kosmo)

### 7.1 Proveedor: Groq con modelo Llama 3.3 70B

**Justificación de Groq sobre OpenAI:**
- **Gratuito en desarrollo** (14.400 peticiones/día sin tarjeta de crédito)
- **API compatible con OpenAI** — se puede cambiar al SDK oficial `openai-php/client` sin modificar el código de negocio
- **Latencia ultrarrápida** (<1 segundo para modelos 70B) gracias al hardware LPU de Groq
- **Modelo Llama 3.3 70B** — capacidades de razonamiento suficientes para el caso de uso (resumen, alertas, Q&A sobre datos de consulta)

### 7.2 Singleton en el contenedor de servicios

```php
// AppServiceProvider
$this->app->singleton(Client::class, function () {
    return OpenAI::factory()
        ->withApiKey(config('services.groq.api_key'))
        ->withBaseUri(config('services.groq.base_url'))
        ->make();
});
```

El cliente se registra como singleton para reutilizar la conexión HTTP entre peticiones.

### 7.3 KosmoBriefing — briefings diarios

Los briefings se generan una vez al día y se almacenan en la tabla `kosmo_briefings`. El modelo usa `'content' => 'array'` en los casts para almacenar el JSON de manera transparente.

Ventaja: el usuario puede consultar el briefing varias veces sin consumir peticiones a la API de Groq.

---

## 8. Estrategia de testing

### 8.1 Framework: Pest 3

**Justificación:**
- Sintaxis BDD que hace los tests autoexplicativos
- Integración con PHPUnit para compatibilidad total con el ecosistema Laravel
- `beforeEach` global en `Pest.php` para configuración común (roles, Vite fake)

### 8.2 Cobertura de los 97 tests

| Módulo | Tests | Qué verifica |
|--------|-------|--------------|
| AdminController | 11 | CRUD usuarios, restricción de roles |
| AuthController | 6 | Redirecciones post-login por rol |
| Authentication | 6 | Login, logout, rate limiting, 2FA |
| EmailVerification | 6 | Flujo completo de verificación |
| PasswordConfirmation | 2 | Pantalla de confirmación |
| PasswordReset | 5 | Reset por email |
| Registration | 3 | Registro + asignación de rol |
| TwoFactorChallenge | 2 | Desafío 2FA |
| VerificationNotification | 2 | Reenvío de email |
| BillingController | 6 | Vista, estadísticas, filtros, aislamiento |
| DashboardController | 7 | Props, métricas, alertas, acceso por rol |
| KosmoController | 7 | Vista, briefings, chat, marcar leídos |
| PatientController | 15 | CRUD completo, ownership, pre/post sesión |
| SettingsController | 7 | Vista, actualización de configuración |
| PasswordUpdate | 3 | Actualización de contraseña |
| ProfileUpdate | 5 | Perfil, email, eliminación de cuenta |
| TwoFactorAuthentication | 4 | Configuración 2FA |

### 8.3 Principios de los tests

- **RefreshDatabase** en cada test para aislamiento total
- **`withoutVite()`** en el `TestCase.php` base para evitar dependencia del build de assets
- **Helpers de usuarios** (`createAdmin()`, `createProfessional()`) para reducir duplicación
- **Roles sembrados** antes de cada test mediante `RoleSeeder`

---

## 9. Despliegue con Docker

### 9.1 Multi-stage build

```dockerfile
# Stage 1: deps
FROM php:8.4-cli-alpine AS deps
# Instala Composer y dependencias PHP

# Stage 2: frontend  
FROM node:20-alpine AS frontend
# npm install + npm run build (compila assets con Vite)

# Stage 3: final (imagen mínima de producción)
FROM php:8.4-fpm-alpine AS final
# Copia vendor/ + public/build/ del stage anterior
```

**Ventaja del multi-stage:** La imagen final no contiene Node.js, Composer ni código fuente de los stages anteriores, resultando en una imagen compacta (~200 MB).

### 9.2 docker-entrypoint.sh

El entrypoint ejecuta en orden:
1. Copia `.env.example` → `.env` con variables del compose
2. Genera `APP_KEY` si está vacía
3. Espera a que MySQL esté listo (hasta 30 reintentos con `mysqladmin ping`)
4. Ejecuta `migrate --force`
5. Ejecuta `db:seed` solo si la tabla `users` está vacía (idempotente)
6. Cachea config/rutas/vistas (`php artisan optimize`)
7. Arranca `php artisan serve`

### 9.3 Docker Hub

La imagen se publica en `samue45/client-kosmos:latest`. El directorio `deploy/` contiene el `docker-compose.yml` listo para usar sin necesidad de clonar el código fuente.

---

## 10. Base de datos: SQLite en desarrollo, TiDB Cloud en producción

### Justificación de SQLite en desarrollo

- **Cero configuración** — no requiere servidor de base de datos local
- **Velocidad** — los tests en memoria (`:memory:`) son significativamente más rápidos
- **Portabilidad** — cualquier desarrollador puede ejecutar el proyecto sin instalar MySQL

```xml
<!-- phpunit.xml -->
<env name="DB_CONNECTION" value="sqlite"/>
<env name="DB_DATABASE" value=":memory:"/>
```

### Justificación de TiDB Cloud en producción

- **Compatible con MySQL 8** — migraciones y queries idénticos en ambos entornos
- **Serverless** — no hay servidores que provisionar ni gestionar
- **Alta disponibilidad** — replicación automática en múltiples zonas
- **Plan gratuito** suficiente para el proyecto académico

---

## 11. Decisiones de diseño UI/UX

### 11.1 Design system propio (no Bootstrap ni Material)

Se creó un design system documentado en `docs/clientkosmos-design-system.md` con:
- Paleta de colores basada en teal/verde azulado (transmite calma para profesionales de salud)
- Tokens CSS con modo claro/oscuro
- Tipografía legible con alta ratio de contraste (WCAG AA)
- Componentes de shadcn/ui customizados con los tokens del design system

**Justificación:** Un design system propio permite identidad visual coherente y es un requisito académico que demuestra comprensión de los principios de diseño.

### 11.2 Modo oscuro / claro

Implementado mediante un token CSS `data-appearance` en el `<html>` gestionado por el middleware `HandleAppearance`. La preferencia se persiste en una cookie del navegador.

### 11.3 Sidebar de navegación

La navegación principal usa un sidebar colapsable que mantiene su estado (`sidebar_state` en cookie) entre sesiones. Esto mejora la experiencia en pantallas pequeñas sin sacrificar accesibilidad en pantallas grandes.

---

*Justificación de Implementación — ClientKosmos v1.0 — Abril 2026*
*Samuel Ayllón — Proyecto Intermodular 2º DAM*
