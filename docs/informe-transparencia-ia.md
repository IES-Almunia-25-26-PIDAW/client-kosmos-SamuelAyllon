# Informe de Transparencia y Uso de Inteligencia Artificial

**Proyecto:** ClientKosmos  
**Autor:** Samuel Ayllón Sevilla  
**Curso:** 2.º DAM — Proyecto Intermodular  
**Fecha:** Mayo 2026  
**Versión:** 1.0

---

## 1. Declaración general

El presente documento certifica que durante el desarrollo del proyecto **ClientKosmos** se han utilizado herramientas de inteligencia artificial generativa como asistente técnico. Su función ha sido la de **copiloto de desarrollo**: acelerar tareas de codificación repetitivas, detectar errores, sugerir refactorizaciones y apoyar la redacción técnica.

Las siguientes responsabilidades recaen en su totalidad en el autor del proyecto:

- El **diseño de la arquitectura** del sistema (patrón MVC + Action, capas de dominio, modelo de datos relacional).
- Todas las **decisiones de negocio y lógica de dominio** (flujo de citas, RGPD, facturación, transcripción, permisos).
- La **selección del stack tecnológico** y su justificación mediante ADRs.
- La **revisión, validación y aprobación** de todo el código generado o sugerido por IA antes de su integración.
- La **autoría legal y académica** del proyecto en su totalidad.

Ningún fragmento de código, configuración o documentación ha sido incorporado al proyecto sin revisión y comprensión explícita por parte del autor.

---

## 2. Desglose de uso en desarrollo de código

| Herramienta | Uso específico | Método de validación |
|-------------|---------------|----------------------|
| **Claude Code (Opus 4.7 / Sonnet 4.6)** | Generación de controladores de acción única, Form Requests, migrations y seeders a partir de especificaciones dadas por el autor | Revisión manual línea a línea, ejecución de `php artisan test` y validación con Larastan nivel 7 |
| **Claude Code** | Implementación de `TranscribeChunkJob`, `AggregateTranscriptionListener` y `SummarizeSessionJob` siguiendo el diseño arquitectónico previo del autor | Pruebas de integración con Pest 3; validación de cifrado en disco y purga de chunks |
| **Claude Code** | Migración progresiva de Tailwind CSS → Chakra UI v3 en 57 páginas y componentes React | Inspección visual en navegador (light/dark), revisión de accesibilidad con teclado y lectura de código componente a componente |
| **Claude Code** | Configuración del Dockerfile multi-etapa (deps → frontend → FrankenPHP) y pipeline de despliegue en Railway | Prueba de `docker compose up --build` en local; verificación del healthcheck `/up` en producción |
| **Claude Code** | Scaffolding de Vitest 2 + Testing Library: configuración, helpers `renderWithChakra`, 18 tests de componentes y hooks | Ejecución de `npm run test` y revisión de cada caso de prueba para confirmar que cubre el requisito declarado |
| **Claude Code** | Detección y corrección de bugs: bug de `type="submit"` en botones Chakra dentro de formularios Inertia v2; alucinaciones de Whisper; extensiones PHP faltantes en build frontend | Reproducción manual del bug antes y después del fix; confirmación en navegador y suite de tests |
| **Claude Code** | Generación de tests Pest para módulos de auditoría RGPD (`TranscriptionAccessLogTest`, `ConsentRevokeTest`, `FinalizeAndNotifyTest`) | Ejecución de la suite completa (509 tests, 1 887 aserciones); revisión de cada aserción para confirmar que testea el comportamiento real |
| **Claude Code** | Migración del despliegue de VPS + Traefik a **Railway**, Dockerfile multi-etapa con FrankenPHP, y diagnóstico de problemas específicos de la plataforma (egreso SMTP bloqueado, almacenamiento no compartido entre servicios) | Verificación del healthcheck `/up` en producción, pruebas de envío de email de verificación y de subida/descarga de PDFs entre web y worker |
| **Claude Code** | Implementación del transport HTTP de **Brevo** para sustituir SMTP (bloqueado por Railway) y migración del disco de Laravel a **Cloudflare R2** (compatible S3) | Test manual de envío de email transaccional desde producción; comprobación de lectura/escritura cruzada entre servicios web y worker |
| **Claude Code** | Cumplimiento de los requisitos de verificación OAuth de Google: páginas públicas `/privacy` y `/terms`, enlaces en el footer de la home y redacción del documento justificativo del uso de cuentas de test | Revisión del documento `google-oauth-test-users-justification.md`; comprobación del flujo OAuth con cuentas autorizadas |
| **Claude Code** | Vista de **papelera de usuarios** (soft-deleted) en el panel de administración con restauración, borrado físico y liberación de `email` / `google_id` al hacer soft-delete | Pruebas manuales del flujo borrar → restaurar y borrar → re-registrar con el mismo email/Google ID |
| **Laravel Boost MCP** | Consulta de documentación versionada de Laravel 12, lectura de schema de base de datos y acceso a logs de error durante el desarrollo | Los resultados se contrastaron con la documentación oficial de Laravel antes de aplicar sugerencias |
| **Chakra UI MCP** | Consulta de ejemplos, props y recetas de componentes Chakra UI v3 (`Dialog`, `Select`, `Tabs`, `Badge`, etc.) | Comparación con la documentación oficial de Chakra v3; ajuste a los tokens semánticos definidos en `chakra-system.ts` |

---

## 3. Desglose de uso en documentación

La IA ha asistido en las siguientes tareas documentales, **siempre bajo dirección y revisión del autor**:

**Estructura de la Memoria Técnica**  
El autor definió los apartados requeridos por el tribunal. La IA generó un borrador a partir del análisis real del repositorio (migraciones, controladores, servicios, ADRs). El autor revisó, amplió y corrigió el contenido antes de su aprobación final.

**Redacción técnica**  
Determinados párrafos de la memoria (descripción del flujo de transcripción, explicación del patrón Action, sección de problemas encontrados) fueron redactados por la IA a partir de información técnica proporcionada por el autor. Todos fueron leídos y validados antes de su inclusión.

**Coherencia y estilo**  
La IA unificó el tono formal entre secciones y detectó inconsistencias de terminología (p.ej. uso alternativo de "sesión" / "cita" / "appointment"). Las correcciones fueron revisadas y aprobadas por el autor.

**ADRs (Architecture Decision Records)**  
El autor redactó la justificación técnica de cada decisión. La IA asistió en el formateo uniforme (título, estado, contexto, decisión, consecuencias) y en la generación del índice de ADRs en `docs/adr/`.

**Declaración interna de uso de IA** (`docs/ai-usage-declaration.md`)  
El registro detallado de cada asistencia de IA por sesión de trabajo fue mantenido en tiempo real durante el desarrollo, con entradas redactadas conjuntamente por la IA y el autor en el momento de cada intervención.

---

## 4. Justificación ética y técnica

El uso de inteligencia artificial en este proyecto responde a un enfoque de **asistencia supervisada**, equivalente al uso de un IDE con autocompletado avanzado o la consulta de Stack Overflow, pero con mayor capacidad de síntesis.

En ningún caso la IA ha operado de forma autónoma sobre el repositorio sin conocimiento y aprobación del autor. El flujo de trabajo seguido ha sido sistemáticamente:

1. El autor define el problema o requisito.
2. La IA propone una solución o fragmento de código.
3. El autor revisa, comprende y modifica el resultado según los estándares del proyecto.
4. El gate de calidad automatizado (Pint, PHPStan nivel 7, Pest, ESLint, TypeScript, Vitest, Vite build) valida objetivamente el resultado antes de cualquier integración.

Este enfoque garantiza que **la comprensión técnica del sistema reside en el autor** y que el código integrado cumple los estándares de calidad definidos en el proyecto, independientemente de su origen.

La transparencia sobre el uso de IA es coherente con los principios de **honestidad académica** y con las guías de uso responsable de IA generativa en entornos educativos y profesionales. Se considera que declarar este uso de forma detallada —como se ha hecho en `docs/ai-usage-declaration.md` a lo largo de todo el desarrollo— es en sí misma una práctica de ingeniería de software responsable.

---

*Documento generado para acompañar la Memoria Técnica del Proyecto Final de DAM — ClientKosmos.*  
*Samuel Ayllón Sevilla — Mayo 2026*
