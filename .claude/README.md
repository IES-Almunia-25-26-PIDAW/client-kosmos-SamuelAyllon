# Flowly

> **Plataforma de Productividad Personal - Tu Centro de Mando Integrado**

[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat-square&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=flat-square&logo=php)](https://www.php.net)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=flat-square)]()

---

## 📑 Tabla de Contenidos

- [Acerca de](#acerca-de)
- [Features](#features)
- [Requisitos](#requisitos)
- [Instalación Rápida](#instalación-rápida)
- [Credenciales de Prueba](#credenciales-de-prueba)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Comandos Útiles](#comandos-útiles)
- [Roles y Permisos](#roles-y-permisos)
- [API de Referencia](#api-de-referencia)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Contribución](#contribución)
- [Licencia](#licencia)

---

## 🎯 Acerca de

**Flowly** es una plataforma web de productividad personal que actúa como tu **centro de mando integrado** para gestionar:

- 📝 **Tareas** - Gestor completo con prioridades y fechas de vencimiento
- 💡 **Ideas** - Captura rápida de inspiraciones y pensamientos
- 📊 **Proyectos** - Organiza tareas en proyectos (feature premium)
- 📚 **Cajas de Conocimiento** - Centraliza recursos y referencias
- 🎙️ **Entrada de Voz** - Crea tareas e ideas hablando
- 🤖 **Asistente IA** - Sugerencias inteligentes y análisis de productividad

### Modelo Freemium

| Plan | Precio | Tareas | Ideas | Proyectos | Voz | IA |
|------|--------|--------|-------|-----------|-----|-----|
| **Free** | $0 | 5 máx | ✅ | ❌ | ❌ | ❌ |
| **Premium Monthly** | $9.99 | ∞ | ✅ | ✅ | ✅ | ✅ |
| **Premium Yearly** | $99.99 | ∞ | ✅ | ✅ | ✅ | ✅ |

---

## ✨ Features

### Core (Todos los Usuarios)
- ✅ Autenticación segura (registro, login, 2FA)
- ✅ Gestor de ideas sin límite
- ✅ Gestor de tareas (5 para free, ilimitadas para premium)
- ✅ Dashboard personal con estadísticas
- ✅ Filtros y búsqueda
- ✅ Soft deletes (recuperar datos eliminados)

### Premium Features
- ✅ Proyectos con jerarquía de tareas
- ✅ Cajas de conocimiento (categorías de recursos)
- ✅ Almacenamiento de referencias y URLs
- ✅ Transcripción de voz (OpenAI Whisper)
- ✅ Asistente IA avanzado con sugerencias
- ✅ Análisis de productividad personalizado

### Admin Features
- ✅ Dashboard con estadísticas globales
- ✅ Gestión de usuarios y roles
- ✅ Historial completo de pagos
- ✅ Control de suscripciones
- ✅ Ingresos y análisis de negocio

---

## 🔧 Requisitos

### Sistema
```
PHP 8.2+
Composer
Node.js 18+
npm o yarn
Git
SQLite (incluido con PHP)
```

### Opcionales (Recomendado)
```
OpenAI API Key (para Whisper + IA)
```

### Verificar Requisitos
```bash
php --version
composer --version
node --version
npm --version
```

---

## 🚀 Instalación Rápida

### 1. Clonar el Repositorio
```bash
git clone <tu-repo-url>
cd flowly
```

### 2. Instalar Dependencias
```bash
composer install
npm install
```

### 3. Configurar Entorno
```bash
cp .env.example .env
php artisan key:generate
```

### 4. Base de Datos
```bash
# Crear archivo SQLite
touch database/database.sqlite

# Ejecutar migraciones + seeders
php artisan migrate:fresh --seed
```

### 5. Variables de Entorno (Opcional)
```env
# En .env
APP_NAME=Flowly
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# OpenAI (para Whisper y IA)
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
```

### 6. Iniciar Servidor
```bash
# Terminal 1: Laravel
php artisan serve

# Terminal 2: Frontend (Vite)
npm run dev
```

### 7. Acceder
```
http://localhost:8000
```

---

## 👤 Credenciales de Prueba

Después de ejecutar `php artisan migrate:fresh --seed`:

```
┌─────────────────┬───────────────────────┬──────────┐
│ Rol             │ Email                 │ Password │
├─────────────────┼───────────────────────┼──────────┤
│ Admin           │ admin@flowly.test     │ password │
│ Premium User    │ premium@flowly.test   │ password │
│ Free User       │ free@flowly.test      │ password │
└─────────────────┴───────────────────────┴──────────┘
```

---

## 📚 Stack Tecnológico

### Backend
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **Laravel** | 12 | Framework principal |
| **Eloquent** | (Laravel 12) | ORM de base de datos |
| **Laravel Fortify** | 1.x | Autenticación |
| **Spatie Permission** | 6.x | Roles y permisos |
| **Pest** | 2.x | Testing |

### Frontend
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **React** | 18+ | UI interactiva |
| **Inertia.js** | 2.x | Puente Laravel ↔ React |
| **Vite** | 5+ | Bundler y dev server |
| **Tailwind CSS** | 3.x | Estilos (opcional) |

### Base de Datos
| Tecnología | Uso |
|-----------|-----|
| **SQLite** | Base de datos local |
| **PHP 8.2+** | Runtime |

### Integraciones Externas (Opcional)
```
OpenAI Whisper API → Transcripción de audio
OpenAI GPT-3.5 Turbo → Asistente IA
```

---

## 📁 Estructura del Proyecto

```
flowly/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── DashboardController.php
│   │   │   ├── TaskController.php
│   │   │   ├── IdeaController.php
│   │   │   ├── ProjectController.php
│   │   │   ├── BoxController.php
│   │   │   ├── ResourceController.php
│   │   │   ├── SubscriptionController.php
│   │   │   ├── CheckoutController.php
│   │   │   └── Admin/
│   │   │       ├── AdminDashboardController.php
│   │   │       ├── AdminUserController.php
│   │   │       ├── AdminPaymentController.php
│   │   │       └── AdminSubscriptionController.php
│   │   ├── Middleware/
│   │   │   └── HandleInertiaRequests.php  ← comparte is_admin, is_premium
│   │   └── Requests/
│   │       ├── StoreTaskRequest.php / UpdateTaskRequest.php
│   │       ├── StoreIdeaRequest.php / UpdateIdeaRequest.php
│   │       └── ...
│   ├── Models/
│   │   ├── User.php, Task.php, Idea.php, Project.php
│   │   ├── Subscription.php, Payment.php
│   │   ├── Box.php, Resource.php
│   │   └── AiConversation.php, VoiceRecording.php
│   └── Policies/
│       └── TaskPolicy.php, IdeaPolicy.php, ...
├── database/
│   ├── migrations/
│   ├── factories/
│   └── seeders/  ← RoleSeeder + UserSeeder
├── resources/
│   └── js/
│       ├── pages/                    ← minúsculas (convención del proyecto)
│       │   ├── dashboard.tsx         ✅ implementada
│       │   ├── tasks/index.tsx       ⚠️ skeleton
│       │   ├── ideas/                ⚠️ placeholder
│       │   ├── projects/             ⚠️ placeholder
│       │   ├── boxes/                ⚠️ placeholder
│       │   ├── subscription/         ⚠️ placeholder
│       │   ├── checkout/             ⚠️ placeholder
│       │   └── admin/                ✅ todas implementadas
│       │       ├── dashboard.tsx
│       │       ├── users/index.tsx + show.tsx
│       │       ├── payments/index.tsx
│       │       └── subscriptions/index.tsx
│       ├── components/
│       │   ├── ui/               ← shadcn/ui primitives
│       │   ├── app-sidebar.tsx   ← navegación por rol
│       │   └── nav-main.tsx
│       ├── layouts/
│       ├── types/
│       │   ├── models/           ← Task, Idea, Subscription, Payment, Role
│       │   ├── shared/           ← PaginatedData<T>
│       │   ├── pages/            ← DashboardProps, TasksProps
│       │   ├── admin/            ← AdminDashboardProps, AdminUsersIndexProps, ...
│       │   └── index.ts          ← barrel (7 líneas)
│       └── routes/               ← Wayfinder (rutas tipadas)
├── routes/
│   └── web.php
├── tests/
│   └── Feature/  ← 143 tests Pest
├── .env.example
└── composer.json
```

---

## 💻 Comandos Útiles

### Desarrollo
```bash
# Iniciar servidor
php artisan serve

# Compilar assets (watch)
npm run dev

# Compilar para producción
npm run build

# Acceder a la consola interactiva
php artisan tinker
```

### Base de Datos
```bash
# Ejecutar migraciones
php artisan migrate

# Ejecutar con seeders
php artisan migrate:fresh --seed

# Revertir migraciones
php artisan migrate:rollback

# Resetear BD completamente
php artisan migrate:refresh

# Ejecutar seeder específico
php artisan db:seed --class=UserSeeder
```

### Testing
```bash
# Ejecutar todos los tests
php artisan test

# Tests específicos
php artisan test --filter=TaskControllerTest

# Tests con coverage
php artisan test --coverage

# Ver rutas
php artisan route:list

# Ver config
php artisan config:cache
```

### Roles y Permisos (Spatie)
```bash
# Desde tinker
php artisan tinker

>>> $user = App\Models\User::find(1)
>>> $user->assignRole('admin')
>>> $user->hasRole('admin')
>>> $user->getRoleNames()
>>> $user->removeRole('free_user')
>>> $user->syncRoles('premium_user')
```

### Limpiar Caché
```bash
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan optimize:clear
```

---

## 🔐 Roles y Permisos

### Tres Roles Implementados

#### 1. **admin** → Acceso Total
```
✅ Ver dashboard admin
✅ Gestionar usuarios
✅ Ver pagos y suscripciones
✅ Acceso a todas las features
✅ Sin límites de tareas
```

#### 2. **premium_user** → Acceso Premium
```
✅ Crear tareas ilimitadas
✅ Crear proyectos
✅ Crear cajas de conocimiento
✅ Usar entrada de voz
✅ Usar asistente IA
✅ Ver sus estadísticas
```

#### 3. **free_user** → Acceso Limitado
```
✅ Crear ideas ilimitadas
✅ Crear máximo 5 tareas activas
❌ Sin proyectos
❌ Sin entrada de voz
❌ Sin asistente IA
❌ Sin cajas de conocimiento
```

### Protecciones Implementadas

| Aspecto | Protección | Validación |
|--------|-----------|-----------|
| **Límite de Tareas** | Free: 5 máx | StoreTaskRequest |
| **Acceso a Proyectos** | Premium only | Middleware `role:premium_user` |
| **Ownership Check** | Solo owner edita | FormRequest `authorize()` |
| **Admin Protegido** | Solo admin accede | Middleware `role:admin` |

---

## 🔗 API de Referencia

### Rutas Públicas
```
GET  /                    Landing page
GET  /pricing             Página de precios
GET  /login               Formulario de login
POST /login               Procesar login (Fortify)
GET  /register            Formulario de registro
POST /register            Procesar registro (Fortify)
```

### Rutas Autenticadas (Todos)
```
GET  /dashboard           Dashboard personal
GET  /tasks               Listar mis tareas
POST /tasks               Crear tarea
PUT  /tasks/{id}          Actualizar tarea
DELETE /tasks/{id}        Eliminar tarea
GET  /ideas               Listar mis ideas
POST /ideas               Crear idea
GET  /subscription        Ver suscripción actual
GET  /checkout            Formulario de pago
POST /checkout            Procesar pago simulado
```

### Rutas Premium (premium_user + admin)
```
GET  /projects            Listar proyectos
POST /projects            Crear proyecto
GET  /boxes               Listar cajas
POST /boxes               Crear caja
GET  /resources           Listar recursos
POST /voice/transcribe    Transcribir audio (Whisper)
GET  /ai-chats            Historial de chat IA
POST /ai-chats            Enviar mensaje a IA
```

### Rutas Admin (admin only)
```
GET  /admin/dashboard     Dashboard admin
GET  /admin/users         Listar usuarios
PUT  /admin/users/{id}    Cambiar rol de usuario
DELETE /admin/users/{id}  Eliminar usuario
GET  /admin/payments      Listar pagos
GET  /admin/subscriptions Listar suscripciones
```

---

## 🧪 Testing

### Ejecutar Tests
```bash
# Todos los tests
php artisan test

# Tests de Feature
php artisan test tests/Feature

# Test específico
php artisan test tests/Feature/TaskControllerTest

# Con output verboso
php artisan test --verbose

# Con coverage
php artisan test --coverage
```

### Tests Incluidos
```
✅ 50+ tests de Feature
✅ Cobertura de CRUD completo
✅ Tests de autorización
✅ Tests de validación
✅ Tests de límites (free vs premium)
✅ Tests de flujos críticos
```

### Ver Cobertura
```bash
php artisan test --coverage --min=80
```

---

## ⚙️ Configuración Importante

### .env - Variables Esenciales
```env
# App
APP_NAME=Flowly
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

# Mail (Fortify)
MAIL_DRIVER=log

# OpenAI (Opcional)
OPENAI_API_KEY=sk-xxxxxxxxxxxxx

# Session
SESSION_DRIVER=database
```

### Configurar Laravel Fortify
```php
// config/fortify.php
'features' => [
    Features::registration(),
    Features::resetPasswords(),
    Features::emailVerification(),
    Features::updateProfileInformation(),
    Features::updatePasswords(),
    Features::twoFactorAuthentication(['confirmPassword' => true]),
],
```

### Configurar Spatie Permission
```php
// config/permission.php
'default' => 'eloquent',
'providers' => [
    'database' => true,  // Usar BD para roles
],
```

---

## 🐛 Troubleshooting

### Error: "No such file or directory" en database.sqlite
```bash
touch database/database.sqlite
php artisan migrate
```

### Error: "Spatie\Permission\Exceptions\RoleDoesNotExist"
```bash
php artisan migrate
php artisan db:seed --class=RoleSeeder
```

### Error: "Class not found"
```bash
composer dump-autoload
php artisan cache:clear
```

### Error: "SQLSTATE[HY000]: General error"
```bash
php artisan migrate:fresh --seed
# O resetear completamente
rm database/database.sqlite
touch database/database.sqlite
php artisan migrate --seed
```

### Frontend no ve cambios en JavaScript
```bash
# Reiniciar Vite
npm run dev

# O compilar manualmente
npm run build

# Limpiar caché (Ctrl+Shift+R en navegador)
```

### OpenAI API: Error 401
```
Verificar que OPENAI_API_KEY está en .env
Las llamadas DEBEN ser desde backend (VoiceController, AiAssistantController)
NO llamar directamente desde frontend
```

---

## 📖 Documentación Adicional

Para información más detallada, ver:

- 📄 **[1_CONTROLHUB_DescripcionTecnica.md](docs/1_CONTROLHUB_DescripcionTecnica.md)** - Descripción técnica completa
- 🛠️ **[11_README_GuiaInstalacion.md](docs/11_README_GuiaInstalacion.md)** - Guía detallada de instalación
- 🧪 **[8_CONTROLHUB_Tests_Pest.php](docs/8_CONTROLHUB_Tests_Pest.php)** - Tests completos
- 🎓 **[9_CONTROLHUB_PromptMaestro.md](docs/9_CONTROLHUB_PromptMaestro.md)** - Metodología de mentoría

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. **Fork** el repositorio
2. **Crea una rama** para tu feature: `git checkout -b feature/mi-feature`
3. **Commit** tus cambios: `git commit -m 'feat: agregar nueva feature'`
4. **Escribe tests** para tu código
5. **Push** a la rama: `git push origin feature/mi-feature`
6. **Abre un Pull Request**

### Estándares de Código
```
✅ PSR-12 para PHP
✅ ES6+ para JavaScript
✅ Tests antes de merge
✅ Documentación actualizada
✅ Commits descriptivos
```

---

## 📋 Checklist Pre-Deploy

- [ ] Todos los tests pasan: `php artisan test`
- [ ] No hay warnings: `php artisan tinker`
- [ ] BD actualizada: `php artisan migrate`
- [ ] Assets compilados: `npm run build`
- [ ] .env configurado correctamente
- [ ] OpenAI API key (si usas features de voz/IA)
- [ ] Logs limpios en `storage/logs/`
- [ ] Cache limpiado: `php artisan optimize:clear`

---

## 📞 Soporte

### Documentación
- Leer archivos en `/docs`
- Revisar tests en `/tests`
- Consultar código comentado

### Debugging
```bash
php artisan tinker
>>> App\Models\User::all()
>>> App\Models\Task::where('user_id', 1)->get()
>>> Auth::user()
```

### Reportar Bugs
1. Describir el problema claramente
2. Pasos para reproducir
3. Versión de PHP/Laravel/Node
4. Archivos de log relevantes

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Ver [LICENSE](LICENSE) para más detalles.

```
MIT License (Código libre para uso educativo y comercial)
```

---

## 👨‍💻 Autor

**Proyecto de Aprendizaje - 2º DAM**

Desarrollado como proyecto intermodular para aprender:
- ✅ Laravel y Eloquent
- ✅ React e Inertia.js
- ✅ Testing con Pest
- ✅ Arquitectura de aplicaciones
- ✅ Gestión de permisos y roles
- ✅ Integración con APIs externas

---

## 🚀 Próximos Pasos

**Estado actual (Feb 2026):**
- ✅ Backend 100% — 143/143 tests pasando
- ✅ Admin panel completo (5 vistas)
- ✅ Dashboard usuario (free/premium)
- ⚠️ Vistas usuario pendientes: tasks/create, ideas/*, projects/*, boxes/*

**Para continuar:**
1. `php artisan migrate:fresh --seed` + `php artisan serve` + `npm run dev`
2. Login con `admin@flowly.test / password`
3. Siguientes vistas a implementar: `tasks/create.tsx`, `ideas/index.tsx`

---

## ✨ ¡Gracias por usar Flowly!

**¿Necesitas ayuda?** Revisa la documentación o abre un issue.

**¿Te gusta el proyecto?** ⭐ Déjanos una estrella en GitHub!

---

<div align="center">

**Hecho con ❤️ para productividad personal**

[⬆ Volver al inicio](#flowly)

</div>
