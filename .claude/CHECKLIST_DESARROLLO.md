# FLOWLY - DEVELOPMENT & DEPLOYMENT CHECKLIST

Use este checklist mientras desarrolla y antes de hacer deploy.

---

## 📋 ANTES DE EMPEZAR

### Setup Inicial
- [ ] Proyecto Laravel creado con `laravel new flowly`
- [ ] Dependencias instaladas: `composer install && npm install`
- [ ] `.env` configurado (APP_NAME=Flowly, DB_CONNECTION=sqlite)
- [ ] `php artisan key:generate` ejecutado
- [ ] `database/database.sqlite` creado
- [ ] `php artisan migrate:fresh --seed` ejecutado
- [ ] Puedo acceder a http://localhost:8000
- [ ] Login funciona con admin@flowly.test / password

### Verificaciones Previas
- [ ] `php artisan serve` funciona
- [ ] `npm run dev` funciona (sin errores)
- [ ] Rutas accesibles: GET /dashboard, GET /pricing, GET /login
- [ ] Base de datos con 3 usuarios (admin, premium, free)

---

## 💻 DURANTE EL DESARROLLO

### Para Cada Nueva Feature

#### 1. Antes de Escribir Código
- [ ] Crear rama de feature: `git checkout -b feature/mi-feature`
- [ ] Escribir User Story: "Como... quiero... para..."
- [ ] Validar requisitos con el equipo/mentor

#### 2. Migrations & Modelos
- [ ] Crear migration: `php artisan make:migration`
- [ ] Definir campos y relaciones
- [ ] Crear modelo: `php artisan make:model`
- [ ] Definir relaciones
- [ ] Crear factory si es necesario
- [ ] `php artisan migrate` - ejecutar migration
- [ ] `php artisan tinker` - verificar modelo

#### 3. Backend
- [ ] Crear controlador: `php artisan make:controller`
- [ ] Crear Form Request: `php artisan make:request`
- [ ] Validación en FormRequest (authorize + rules)
- [ ] Lógica en controlador (CRUD, business logic)
- [ ] Eager loading con `with()` para evitar N+1
- [ ] Retornar respuestas apropiadas (redirect, inertia)
- [ ] Registrar rutas en `routes/web.php`

#### 4. Autorización
- [ ] Decidir quién puede acceder (middleware de rol)
- [ ] Implementar `authorize()` en FormRequest
- [ ] Implementar `authorize()` en controlador si es complejo
- [ ] Verificar ownership: `$model->user_id === auth()->id()`
- [ ] Testar con roles: free, premium, admin

#### 5. Frontend (React)
- [ ] Crear componente en `resources/js/Components/`
- [ ] Crear página en `resources/js/Pages/`
- [ ] Pasar props desde controlador via Inertia
- [ ] Validación en cliente (opcional, backend es obligatorio)
- [ ] Estilos con Tailwind o CSS modules
- [ ] Testing en navegador

#### 6. Testing
- [ ] Crear test: `php artisan make:test MiFeatureTest`
- [ ] Test de acceso (guest, wrong role, authorized)
- [ ] Test de validación (válido, inválido, límites)
- [ ] Test de creación, actualización, eliminación
- [ ] `php artisan test --filter=MiFeature` - ejecutar tests
- [ ] Tests verdes antes de hacer commit

#### 7. Documentación
- [ ] Comentar código complejo
- [ ] Actualizar README si es necesario
- [ ] Documentar nuevas rutas si agregaste
- [ ] Actualizar QUICK_REFERENCE si es feature importante

#### 8. Commit & Push
- [ ] `git add .`
- [ ] `git commit -m "feat: descripción clara"`
- [ ] `git push origin feature/mi-feature`

### Verificaciones Regulares

**Cada hora:**
- [ ] `npm run dev` sin errores
- [ ] `php artisan serve` sin errores

**Cada día:**
- [ ] `php artisan test` - todos verdes
- [ ] `php artisan tinker` - verificar datos
- [ ] Navegar por la app manualmente
- [ ] `git status` - archivos sin commitear

**Cada feature completada:**
- [ ] Tests pasan: `php artisan test --coverage`
- [ ] Sin warnings/errors en consola
- [ ] Sin warnings en browser console
- [ ] Código formateado
- [ ] Documentación actualizada

---

## 🔍 BEFORE COMMITTING CODE

### Code Review Personal
- [ ] Código limpio y legible
- [ ] Sin comentarios obvios
- [ ] Sin `console.log()` de debug
- [ ] Sin `dd()` o `dump()` en el código
- [ ] Sin archivos temporales o IDE files
- [ ] Sin credenciales o API keys

### Validación de Negocio
- [ ] Lógica correcta según requisitos
- [ ] Validaciones en servidor (no confiar en frontend)
- [ ] Autorización validada (ownership, role, permission)
- [ ] Límites respetados (free_user: 5 tareas)
- [ ] Errores manejados apropiadamente

### Testing
- [ ] `php artisan test` - todos los tests verdes
- [ ] Tests cubren happy path
- [ ] Tests cubren error paths
- [ ] `php artisan test --coverage` - cobertura adecuada
- [ ] Sin errores de deprecation

### Performance
- [ ] Queries optimizadas con eager loading
- [ ] No hay N+1 queries (verificar con Laravel Debugbar)
- [ ] Sin loops ineficientes en vistas
- [ ] Assets compilados (npm run build)

### Security
- [ ] authorize() implementado
- [ ] CSRF tokens en formularios
- [ ] Validación de entrada
- [ ] No hay inyección SQL
- [ ] Passwords hasheados (bcrypt)
- [ ] No guardar tokens en BD plano

### Git Commit
- [ ] Commit message descriptivo: `feat:`, `fix:`, `docs:`
- [ ] Commit atómico (una cosa por commit)
- [ ] No mezclar features en un commit
- [ ] Revisar diff antes de commit: `git diff`

---

## 🧪 TESTING CHECKLIST

### Unit Tests (Opcional)
- [ ] Métodos de modelo probados
- [ ] Cálculos verificados
- [ ] Validaciones de logica testadas

### Feature Tests (Obligatorio)
- [ ] Test de lista (GET)
- [ ] Test de creación (POST) - válido e inválido
- [ ] Test de actualización (PUT) - válido e inválido
- [ ] Test de eliminación (DELETE)
- [ ] Test de autorización (guest, wrong role, owner)
- [ ] Test de límites (free_user: 5 tareas)

### Manual Testing
- [ ] Probar en Chrome
- [ ] Probar en Firefox
- [ ] Probar responsive (mobile, tablet, desktop)
- [ ] Probar con diferentes roles (free, premium, admin)
- [ ] Probar flujos críticos de inicio a fin

---

## 🚀 ANTES DE HACER DEPLOY A PRODUCCIÓN

### Final Verification
- [ ] `php artisan test` - TODOS los tests pasan
- [ ] `php artisan test --coverage` - cobertura > 80%
- [ ] `npm run build` - assets compilados sin errores
- [ ] `php artisan optimize:clear` - caché limpiado
- [ ] `php artisan config:cache` - config cacheada

### Database
- [ ] Migrations numeradas correctamente
- [ ] Seeders funcionan: `php artisan migrate:fresh --seed`
- [ ] Backups de BD en producción (si existe)
- [ ] Plan de rollback si falla migration

### Configuración
- [ ] `.env` configurado para producción
- [ ] `APP_DEBUG=false` en .env production
- [ ] `APP_ENV=production`
- [ ] Todas las variables requeridas en .env
- [ ] OPENAI_API_KEY configurado (si usas IA)
- [ ] Logs configurados en `storage/logs`

### Seguridad
- [ ] No hay credenciales en repositorio
- [ ] `.gitignore` incluye .env, node_modules, storage/
- [ ] CSRF protección habilitada
- [ ] Rate limiting habilitado
- [ ] Headers de seguridad configurados

### Performance
- [ ] Assets minificados (npm run build)
- [ ] Caché configurado
- [ ] Base de datos indexada
- [ ] Queries optimizadas
- [ ] No hay N+1 queries

### Documentation
- [ ] README.md actualizado
- [ ] Documentación técnica actualizada
- [ ] Changelog incluido
- [ ] Instrucciones de deploy claras
- [ ] Troubleshooting actualizado

### Monitoring
- [ ] Error logging configurado
- [ ] Uptime monitoring
- [ ] Performance monitoring
- [ ] Security monitoring
- [ ] Backup automático

### Team Communication
- [ ] Team informado del deploy
- [ ] Release notes preparadas
- [ ] Documentación compartida
- [ ] Runbook de emergencia preparado

---

## 📊 ESTADÍSTICAS ANTES DE COMPLETAR

```bash
# Tests
php artisan test                    # ✓ Todos verdes
php artisan test --coverage         # ✓ > 80%

# Code Quality
php artisan route:list              # ✓ Todas las rutas visibles
php artisan tinker                  # ✓ Modelos accesibles

# Assets
npm run build                       # ✓ Sin errores
npm run dev                         # ✓ HMR funcionando

# Database
php artisan migrate:fresh --seed    # ✓ Sin errores
php artisan tinker                  # ✓ Datos de prueba OK
```

---

## 🎯 FEATURE COMPLETENESS CHECKLIST

Para cada feature (Task, Idea, Project, Box, Resource, Voice, AI):

### Modelo
- [ ] Migration creada
- [ ] Modelo creado con relaciones
- [ ] Scopes definidos si necesario
- [ ] Métodos helper implementados
- [ ] Casting de atributos si necesario
- [ ] Soft deletes si aplica

### CRUD Backend
- [ ] Index (listar)
- [ ] Show (detalle)
- [ ] Store (crear)
- [ ] Update (actualizar)
- [ ] Destroy (eliminar)
- [ ] Lógica de negocio correcta

### Validación
- [ ] Form Request creado
- [ ] authorize() implementado
- [ ] rules() completos
- [ ] messages() en español
- [ ] Límites respetados (free_user: 5 tareas)

### Autorización
- [ ] Middleware en rutas
- [ ] authorize() en FormRequest
- [ ] Ownership check si aplica
- [ ] Tests de acceso

### Frontend
- [ ] Página de lista
- [ ] Página de detalle
- [ ] Formulario de creación
- [ ] Formulario de edición
- [ ] Confirmar eliminación
- [ ] Feedback (mensajes de éxito/error)
- [ ] Estilos responsivos

### Testing
- [ ] Test de lista
- [ ] Test de creación válida
- [ ] Test de creación inválida
- [ ] Test de actualización
- [ ] Test de eliminación
- [ ] Test de autorización

### Documentación
- [ ] Rutas documentadas
- [ ] API de referencia actualizada
- [ ] Ejemplos de uso
- [ ] Posibles errores documentados

---

## 🔄 DESPUÉS DE DEPLOY

### Post-Deploy Verification
- [ ] Sistema en línea
- [ ] Login funciona
- [ ] Puedo crear tareas
- [ ] Puedo crear ideas
- [ ] Puedo hacer upgrade a premium
- [ ] Dashboard muestra datos
- [ ] Admin panel accesible
- [ ] Logs limpios (sin errores)

### Monitoring
- [ ] Errores en logs
- [ ] Performance metrics
- [ ] User feedback
- [ ] Database health
- [ ] API integrations (OpenAI si aplica)

### Rollback Plan (Si falla)
- [ ] Identificar el problema
- [ ] Revertir último commit
- [ ] Revisar logs de error
- [ ] Arreglar problema
- [ ] Deploy nuevamente

---

## 📅 CHECKLIST DIARIO

**Mañana (Start of Day):**
- [ ] `git pull origin main`
- [ ] `composer install`
- [ ] `npm install`
- [ ] `php artisan migrate`
- [ ] Revisar cambios nuevos

**Final del Día (End of Day):**
- [ ] Commits pushed
- [ ] Tests verdes
- [ ] Código comentado
- [ ] Documentación actualizada
- [ ] Issues actualizados

---

## 🚀 DEPLOYMENT FINAL

### Semana de Deployment
- [ ] Feature freeze (no nuevas features)
- [ ] Code review completo
- [ ] Testing exhaustivo
- [ ] Documentation review
- [ ] Staging testing
- [ ] Load testing si es necesario

### Día de Deployment
- [ ] Backup de BD
- [ ] Equipo en línea (caso algo falle)
- [ ] Runbook listo
- [ ] Rollback plan listo
- [ ] Deploy a horario bajo tráfico
- [ ] Monitoreo en tiempo real

### Post Deployment (2 horas)
- [ ] Verificar sistema
- [ ] Revisar logs
- [ ] Confirmar funcionalidad
- [ ] Recopilar feedback

### Semana Post Deployment
- [ ] Monitoreo activo
- [ ] Bug fixes si hay
- [ ] Feedback de usuarios
- [ ] Documentar lecciones aprendidas

---

## ✅ COMPLETITUD DEL PROYECTO

```
✓ Migraciones (13 tablas)
✓ Modelos de datos definidos (10 modelos)
✓ Seeders (RoleSeeder + UserSeeder)
✓ Rutas protegidas por rol y auth
✓ Controladores implementados (features + admin)
✓ Form Requests con validación en español
✓ Policies (Task, Idea, Project, Box, Resource)
✓ Autorización por rol (Spatie Permission)
✓ Límites respetados (free: 5 tareas pending)
✓ Tests: 180/180 pasando (692 assertions) ← Mar 2026
✓ Documentación actualizada (.claude/ + docs/)
✓ Dashboard implementado con datos reales (free/premium/admin) + tutorial chatbot
✓ Vistas admin con UI profesional: Badge shadcn, AlertDialog, iconos lucide, estados vacíos
✓ Types TypeScript organizados en subcarpetas
✓ Todas las vistas de usuario implementadas con UI real
✓ Landing page completa (hero, features, pricing, footer)
✓ Integración OpenAI Whisper (voz a texto, solo premium)
✓ Asistente IA conversacional (Groq/OpenAI-compatible, solo premium)
✓ Tutorial interactivo para nuevos usuarios (spotlight + chatbot Flowy)
✓ Docker multi-stage (Dockerfile + docker-compose + entrypoint)
✓ Task due_date obligatorio + auto-asignación de proyecto desde projects/show
```

---

## 📞 SI ALGO SALE MAL

1. **Revisar logs:** `storage/logs/laravel.log`
2. **Usar tinker:** `php artisan tinker`
3. **Comprobar BD:** `php artisan tinker` → `App\Models\User::all()`
4. **Resetear todo:** `php artisan migrate:fresh --seed`
5. **Limpiar caché:** `php artisan optimize:clear`
6. **Contactar mentor:** Con error exacto + código + logs

---

**Imprime esto. Úsalo todos los días. Te ahorrará horas de debugging. ✓**

**Última actualización:** Marzo 2026 (sesión 8)
**Versión:** 1.6 Flowly
