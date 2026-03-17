# Justificación Técnica de Decisiones — ClientKosmos

> Proyecto Intermodular — 2º DAM
> Autor: Samuel Ayllón
> Fecha: 2026-03-17

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

### 1.2 Inertia.js 2 + React 19 (Frontend)

**Decisión:** usar Inertia.js como puente entre Laravel y React, en lugar de una API REST tradicional.

**Justificación:**
- Inertia.js permite construir SPAs monolíticas sin necesidad de una API REST separada, eliminando toda la capa de serialización/deserialización JSON y autenticación de tokens.
- El resultado es código más sencillo: el controlador Laravel devuelve directamente `Inertia::render('pagina', $datos)` en lugar de `response()->json(...)` + fetch en el frontend.
- React 19 fue elegido por ser el framework más demandado en el mercado y por la riqueza de su ecosistema (shadcn/ui, Radix UI, etc.).

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
- Las Policies de Laravel complementan a Spatie para la autorización a nivel de recurso (solo el propietario puede modificar su cliente/tarea/idea).
- La combinación Middleware + Policy cubre todos los niveles de autorización sin redundancias.
- **Aislamiento de roles:** el rol `admin` tiene acceso exclusivo al panel de administración (`/admin/*`) y no a las rutas premium (IA contextual, recursos). Esta separación garantiza que la gestión de la plataforma y el uso de funcionalidades de usuario son responsabilidades completamente distintas.

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
- **Resultado:** 156 tests / 615 assertions pasando al 100%.

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

## 9. Arquitectura multi-cliente

**Decisión:** pivotar de una app de productividad genérica a una plataforma de gestión multi-cliente para freelancers. El modelo `Project` pasa a representar una **ficha de cliente** (no un proyecto genérico). Las notas pasan a llamarse **Ideas**. Los recursos se asocian directamente al cliente (sin el intermediario de "Cajas").

**Justificación:**
- El mercado de productividad genérica está saturado (Todoist, Notion, TickTick). Los freelancers tienen una necesidad específica desatendida: gestionar múltiples clientes con sus tareas, ideas y recursos asociados, todo en un solo lugar.
- La estructura "cliente → tareas + ideas + recursos" es más natural para el público objetivo que la estructura "proyectos genéricos + cajas sueltas".
- Eliminar las "Cajas" (modelo Box) simplifica la arquitectura: los recursos se asocian directamente al cliente via `project_id`, reduciendo una indirección innecesaria.
- El modelo freemium se vuelve más claro: free = 1 cliente, Solo = clientes ilimitados + IA + recursos.

**Cambios técnicos:**
- Eliminada la tabla `boxes` y el modelo `Box` / `BoxPolicy`
- Eliminada la tabla `voice_recordings` y el modelo `VoiceRecording`
- Eliminada la tabla `ai_conversations` y el modelo `AiConversation`
- Recursos pasan de `box_id` a `project_id` (Resources belong to Project/Client directly)
- Nuevo modelo `AiLog` para registros de acciones IA
- Rutas: `/projects` → `/clients`, rutas de ideas usan `/ideas`
- El `ProjectController` mantiene su nombre interno pero las rutas usan `/clients`

---

## 10. IA contextual — API OpenAI-compatible (Groq/GPT)

**Decisión:** integrar un sistema de IA contextual con 3 endpoints especializados en lugar de un chat conversacional genérico, usando la API de OpenAI Chat Completions con soporte configurable para distintos proveedores compatibles (OpenAI, Groq, Ollama, etc.).

**Justificación:**
- Un chat conversacional genérico (como el que tenía la versión anterior) ofrecía respuestas generalistas poco útiles. Los 3 endpoints contextuales resuelven necesidades concretas del freelancer.
- La API OpenAI Chat Completions es un estándar de facto adoptado por múltiples proveedores (Groq, Mistral, Together AI, Ollama), lo que permite cambiar de proveedor simplemente con variables de entorno, sin modificar código.
- **Groq** es el proveedor por defecto en el entorno de desarrollo: ofrece un plan gratuito generoso (14.400 req/día) y latencia mínima.
- Al no mantener historial de conversación, la arquitectura es más simple y cada llamada es independiente.

**3 endpoints:**
1. **`POST /ai/plan-day`** — Recoge las tareas pendientes del usuario (con prioridad, fecha de vencimiento y cliente) y genera un plan del día con 3-5 acciones priorizadas.
2. **`POST /ai/client-summary/{project}`** — Genera un resumen de 3-4 líneas del estado de un cliente: tareas completadas, pendientes, ideas activas.
3. **`POST /ai/client-update/{project}`** — Genera un parte semanal detallado del cliente: progreso, bloqueos, próximos pasos.

**Variables de entorno:**
```env
GROQ_API_KEY=gsk_...                               # clave del proveedor (Groq)
GROQ_BASE_URL=https://api.groq.com/openai/v1      # endpoint API OpenAI-compatible
GROQ_MODEL=llama-3.3-70b-versatile                 # modelo a usar
GROQ_CA_BUNDLE=C:/certs/cacert.pem                 # CA bundle para SSL (Windows)
```

**Implementación técnica:**
- `OpenAI\Client` registrado como **singleton** en `AppServiceProvider` con `OpenAI::factory()`, apuntando a Groq via `config('services.groq.*')`
- `AiController` recibe el cliente por inyección de dependencias en el constructor
- Método privado `callAi()` usa el SDK tipado (`$this->client->chat()->create(...)`)
- Cada endpoint genera un prompt específico con datos reales del usuario/cliente
- Modelo `AiLog` registra cada acción IA con `action_type`, `input_context` (JSON) y `output_text`
- No hay historial de conversación: cada llamada es stateless
- Parámetros de la API: `temperature: 0.7`, `max_tokens: 500`
- Rutas bajo middleware `role:premium_user` — funcionalidad exclusiva Solo
- Autorización adicional: cada endpoint que recibe un cliente verifica ownership via Policy
- `config/services.php` expone `services.groq.api_key`, `services.groq.base_url`, `services.groq.model` y `services.groq.ca_bundle`
- En Windows, se configura un `GuzzleClient` con `verify` apuntando al CA bundle de Mozilla para resolver errores SSL de cURL

**Paquete:** `openai-php/client` — cliente PHP oficial para la API de OpenAI, compatible con cualquier API que implemente el protocolo OpenAI.

**Alternativas descartadas:**
- Chat conversacional (diseño anterior): demasiado genérico, respuestas poco útiles para el flujo de trabajo del freelancer
- GPT-4 de OpenAI: mayor calidad pero más costoso; innecesario para este caso de uso
- Ollama local: requiere GPU significativa para respuestas rápidas

---

## 11. Estructura de tipos TypeScript

**Decisión:** organizar los tipos en subcarpetas temáticas (`models/`, `pages/`, `admin/`, `shared/`) en lugar de un único archivo `types.ts`.

**Justificación:**
- Un solo archivo de tipos crece hasta ser inmanejable en proyectos medianos/grandes.
- La estructura refleja la arquitectura de la aplicación: los tipos de modelos (`Task`, `Project`, etc.) están separados de los tipos de props de páginas y de los tipos de admin.
- El archivo `types/index.ts` actúa como barrel de re-exportaciones, por lo que el resto del código solo necesita `import { Task } from '@/types'`.

---

## 12. Tutorial interactivo para nuevos usuarios

**Decisión:** implementar un tour guiado con spotlight que aparece automáticamente la primera vez que un usuario accede al dashboard, señalando visualmente cada sección de la aplicación.

**Justificación:**
- Los usuarios nuevos en aplicaciones de productividad pueden sentirse abrumados por las múltiples funcionalidades disponibles.
- Un tour guiado que resalta visualmente cada elemento reduce la curva de aprendizaje y mejora la retención de usuarios (onboarding efectivo).
- El formato de chat con un asistente virtual ("Kosmo") es más amigable e interactivo que un manual de texto estático.
- El **spotlight** (oscurecimiento del fondo con "agujero" en el elemento activo) enfoca la atención del usuario exactamente donde debe mirar.
- El tooltip posicionado junto al elemento evita que el usuario pierda contexto mientras lee las instrucciones.
- El efecto de escritura progresiva simula una conversación real, haciendo la experiencia más personal.
- La posibilidad de "saltar" respeta a usuarios experimentados que prefieren explorar por su cuenta.
- Se persiste en BD (`tutorial_completed_at`) para no volver a mostrar el tutorial, reduciendo fricción en usos posteriores.

**Implementación técnica:**
- Migración `add_tutorial_completed_at_to_users_table` añade el campo al usuario
- `TutorialController` con ruta `POST /tutorial/complete` marca el tutorial como completado
- Componente React `tutorial-chatbot.tsx` con:
  - SVG mask para crear el efecto spotlight (agujero en el overlay)
  - Cálculo dinámico de posición del tooltip usando `getBoundingClientRect()`
  - `data-tutorial` attributes en los elementos del sidebar para identificarlos
  - Portal de React (`createPortal`) para renderizar encima de todo el DOM
  - Borde animado (`ring-4 animate-pulse`) alrededor del elemento activo
- Se muestra condicionalmente en el Dashboard basándose en `auth.user.tutorial_completed_at`

**Alternativas descartadas:**
- Shepherd.js / Driver.js (librerías de tour de terceros): añaden dependencias npm y menos control sobre el diseño
- Modal de bienvenida estático (menos interactivo, no señala elementos visualmente)
- Vídeo tutorial (mayor barrera de entrada, requiere infraestructura de hosting de vídeo)
