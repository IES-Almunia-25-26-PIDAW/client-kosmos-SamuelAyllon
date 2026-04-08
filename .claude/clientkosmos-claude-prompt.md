# PROMPT — Claude Code (VS Code) · Adaptación ClientKosmos para Natalia (Psicóloga Autónoma)

---

## CONTEXTO DE ESTE PROMPT

Este prompt incorpora las conclusiones de un análisis competitivo previo frente a eHolo, Insight, Doctoralia PRO y PsicoSmart. La conclusión central es:

> **ClientKosmos no debe competir en número de módulos, sino en profundidad de flujo operativo clínico.** El valor diferencial es que Natalia cambie de paciente sin perder contexto, con el cobro encarrilado y la documentación legal bajo control — todo desde el mismo espacio.

Los competidores fallan así:
- **eHolo**: automatización financiera solo en Premium, no como base universal.
- **Insight**: demasiado orientado a ERP clínico; exceso de complejidad para autónomas.
- **Doctoralia PRO**: fuerte en captación/agenda, débil como workspace documental y operativo.
- **PsicoSmart**: encaje erróneo — es plataforma de tests para RRHH, no consulta clínica freelance.

La oportunidad de ClientKosmos está en ser el **"workspace operativo de consulta"**: contexto instantáneo, cobro sin fricciones y legal sin burocracia manual.

---

## FASE 0 — Lectura obligatoria antes de hacer nada

Lee estos archivos en este orden y **no propongas cambios hasta haberlos leído todos**:

1. `docs/contexto-proyecto.md` — estado actual, arquitectura, modelos
2. `docs/clientkosmos-style-guide.md` — design system y tokens
3. `docs/manual-usuario.md` — flujo de usuario actual
4. `docs/necesidad-y-justificacion.md` — público objetivo actual
5. `docs/decisiones-tecnicas.md` — decisiones técnicas tomadas
6. `routes/web.php` — todas las rutas
7. `app/Http/Controllers/Ai/PlanDayAction.php` — prompt de planificar día
8. `app/Http/Controllers/Ai/ClientSummaryAction.php` — prompt de resumen cliente
9. `app/Http/Controllers/Ai/ClientUpdateAction.php` — prompt de parte semanal
10. Los componentes React que renderizan la ficha de cliente (busca en `resources/js/Pages/Project/`)
11. El componente del tutorial / chatbot (`resources/js/Components/` — busca "tutorial" o "chatbot")
12. La landing page (`resources/js/Pages/Welcome.tsx` o similar)
13. Los nudges de Kosmo (busca "nudge" en `resources/js/`)
14. Los empty states de cada sección (busca strings como "No tienes", "No hay", "Empieza" en `resources/js/`)
15. Los placeholders de inputs y textareas en la ficha de cliente y formularios de creación de proyecto

---

## USER PERSONA — Natalia, Psicóloga Multitarea Hiper-Organizada

**Rol:** Psicóloga autónoma (freelance).
**Experiencia:** Consolidada. Gestiona 6+ pacientes activos simultáneamente.
**Modelo de negocio:** Cobro mixto — por sesión/hora y por bono/proyecto terapéutico.
**Entorno:** Híbrido. Usa móvil y PC de forma equilibrada e intensiva.

**Comportamiento:** Es extremadamente organizada. No necesita que le digan qué hacer. Su problema es el **flujo de trabajo**, no la memoria. Usa WhatsApp + Gmail + Google Drive + Doctoralia — todo fragmentado. Esa dispersión es su principal fuente de estrés operativo.

### Pain points por orden de severidad

| # | Pain Point | Detalle |
|---|---|---|
| 1 | **Facturación** | Retrasa 1-2 días por fricción administrativa. Quiere facturación recurrente automática por paciente. |
| 2 | **Burocracia RGPD** | Gestionar consentimientos informados y docs de protección de datos a mano le quita energía. |
| 3 | **Seguimiento de cobros** | Necesita saber quién ha pagado sin revisión manual diaria. |
| 4 | **Cambio de contexto** | Tarda 1-5 min al cambiar de paciente buscando acuerdos, archivos y decisiones previas. |
| 5 | **Captura en tiempo real** | Anotar durante la sesión sin que el sistema sea un obstáculo cognitivo. |
| 6 | **Marketing/divulgación** | Deseo secundario; no es prioritario pero agradecido como módulo ligero. |

### Escenario crítico — 5 minutos entre sesiones

Natalia acaba una sesión intensa. En el tiempo hasta la siguiente necesita hacer **tres cosas**:
1. Apuntar una nota clave de la sesión que acaba de terminar.
2. Localizar el contexto del siguiente paciente: acuerdos activos, archivos y última decisión tomada.
3. Verificar si el paciente anterior ha pagado su factura pendiente.

> Con herramientas separadas, estos 5 minutos se convierten en una carrera de obstáculos digital. ClientKosmos debe resolverlo desde una sola pantalla.

---

## ENCAJE CON CLIENTKOSMOS — Mapa de campos existentes

### ✅ Encaja bien (renombrar labels, no lógica)

| Campo interno (BD) | Label actual (supuesto genérico) | Label correcto para Natalia | Notas |
|---|---|---|---|
| `brand_tone` | "Tono de marca" | "Enfoque terapéutico" | Ej.: "Cognitivo-conductual", "Sistémico" |
| `service_scope` | "Alcance del servicio" | "Motivo de consulta" | Descripción del problema terapéutico |
| `next_deadline` | "Próximo deadline" | "Próxima sesión" | Fecha/hora de la siguiente cita |
| `client_notes` | "Notas del cliente" | "Acuerdos terapéuticos" | Decisiones y compromisos de cada sesión |
| `project_name` (o equivalente) | "Nombre del proyecto" | "Nombre del paciente / caso" | Confirmar cómo se llama este campo en la UI |

> **Regla absoluta: No toques las columnas de base de datos.** `brand_tone`, `service_scope`, etc. son nombres internos genéricos y deben quedarse así. Los labels son **responsabilidad exclusiva de la capa de presentación**.

### ⚠️ Encaja parcialmente (adaptar el output de Kosmo, no la lógica)

- **`planificar_dia`**: Natalia ya sabe qué hacer. El valor real para ella es la **reubicación de contexto rápida** — quién es el siguiente paciente, qué acordamos, qué falta. Adaptar el system prompt para que el output priorice ese briefing en lugar de un plan de tareas genérico.
- **`resumen_cliente`**: Es el feature más valioso para Natalia. El system prompt debe interpretar `brand_tone` como enfoque terapéutico y `service_scope` como motivo de consulta al construir el briefing pre-sesión.
- **`parte_semanal`**: Útil como resumen de evolución. Adaptar lenguaje de "proyecto" a "caso clínico" en el output.
- **`ideas`**: Puede funcionar como captura rápida post-sesión. El empty state y el nudge deben sugerirlo explícitamente como espacio de notas de sesión.
- **`recursos`** (adjuntos/links por cliente): Hoy guarda enlaces. Para Natalia es el repositorio de consentimientos RGPD en Drive, historial de informes y documentación legal. El label y el placeholder deben reflejar eso.

### ❌ NO existe — NO inventar (documentar como GAP)

- Facturación automática por paciente (Pain #1 — `payments` es para suscripciones de plataforma, no para cobros al paciente)
- Seguimiento de cobros por paciente (estado "Pagado / Pendiente / Vencido" por sesión)
- Generación o firma electrónica de consentimientos RGPD
- Vista "Antes de empezar" — cockpit pre-sesión con contexto consolidado
- Vista "Al terminar" — acción rápida post-sesión: nota + cobro + siguiente acuerdo
- Estados inteligentes del paciente ("Falta consentimiento", "Pendiente de cobro", "Hay acuerdo sin cerrar")
- Integración con Doctoralia, Gmail, Google Drive

---

## QUÉ QUIERO QUE HAGAS

Después de leer **todo el código**, genera un **plan de adaptación paso a paso** con las reglas siguientes.

### Reglas de análisis

1. **Cada cambio debe referenciar el archivo exacto, la línea o bloque exacto y el cambio concreto.** No quiero "busca el componente que renderiza X" — quiero "en `resources/js/Pages/Project/Show.tsx`, línea 47, el label dice `Tono de marca`, cámbialo a `Enfoque terapéutico`".

2. **Clasifica cada cambio:**
   - `BLOQUEANTE`: sin este cambio Natalia ve algo que no entiende o Kosmo genera output inútil/incoherente con datos clínicos.
   - `NECESARIO`: la app funciona pero la experiencia es confusa o poco profesional para una psicóloga.
   - `RECOMENDADO`: buena práctica (extraer constantes, mejorar placeholder, documentar).

3. **Prioridad absoluta — System prompts de Kosmo son BLOQUEANTES.** Si el prompt de `resumen_cliente` dice que el usuario es un "freelancer creativo" o asume proyectos de diseño/marketing, el output será incoherente cuando los datos contengan terminología clínica (`brand_tone: "Cognitivo-conductual"`, `service_scope: "Trastorno de ansiedad generalizada"`). Adapta **todos** los system prompts para que:
   - Interpreten el usuario como profesional de la salud mental (sin hardcodear "psicólogo" — usar lenguaje neutro como "profesional de servicios").
   - Traten `brand_tone` como estilo/enfoque profesional.
   - Traten `service_scope` como descripción del caso o servicio prestado.
   - Traten `client_notes` como registro de acuerdos o decisiones clave.
   - Traten `ideas` como notas de seguimiento o captura de sesión.
   - El output de `planificar_dia` priorice el **briefing de cambio de contexto** por encima de la lista de tareas.

4. **Renombrar labels en la capa de presentación.** Aplica el mapa de campos de la sección anterior. Si un label aparece en más de dos componentes, crea o actualiza el archivo de constantes (`resources/js/config/labels.ts` o el equivalente existente). Si solo aparece en un sitio, cámbialo inline. Usa tu criterio de ingeniero senior.

5. **Adaptar empty states y nudges.** Los empty states deben hablar el idioma de Natalia. Reglas:
   - Sección de notas/ideas vacía → no "No tienes ideas aún", sino algo como "Aquí irán tus notas de sesión y observaciones clave."
   - Sección de recursos vacía → no "No has añadido recursos", sino "Guarda aquí los consentimientos RGPD, informes y documentos del paciente."
   - Nudge post-onboarding → orientado a registrar el primer paciente, no el primer proyecto de diseño.

6. **Adaptar el tutorial/chatbot de onboarding.** Si el tutorial asume terminología de diseño, marketing o proyectos creativos, adapta el script de pasos para que Natalia entienda cada sección desde el primer uso. Términos clave a revisar: "proyecto" → puede quedar, pero el subtexto debe ser agnóstico; "cliente" → correcto; "tono de marca" → "enfoque terapéutico"; cualquier ejemplo con "logotipo", "campaña", "entregable" → eliminar o generalizar.

7. **Adaptar la landing page.** Revisa los claims, el copywriting de beneficios y los CTAs. Si la propuesta de valor describe explícitamente "diseñadores", "creativos" o "agencias", debe generalizarse a "profesionales de servicios" o mantenerse suficientemente agnóstico. No inventes una landing nueva — solo señala los strings que rompen la coherencia para Natalia.

8. **No toques la lógica de negocio.** Límites de plan free, policies, checkout, roles — todo es agnóstico al dominio.

9. **No inventes features que no existen.** Si Natalia necesita algo que CK no tiene, documéntalo en la sección GAPS. No propongas migraciones, modelos ni endpoints nuevos a menos que yo lo pida explícitamente.

10. **Busca lo que yo no haya mencionado.** Si encuentras un texto hardcodeado que dice "diseñador", un placeholder que asume proyectos creativos, un mensaje de error con terminología inadecuada, o un ejemplo en el tutorial que menciona una industria concreta — inclúyelo. Eso es exactamente el ruido que destruye la credibilidad del producto para Natalia.

11. **Si algo que asumo que existe en realidad no está implementado**, dímelo explícitamente. No inventes la implementación. Ejemplo: "El label `Tono de marca` en la ficha de cliente no está en el frontend todavía — el campo existe en BD pero no se renderiza en el componente Show.tsx."

12. **Después de cada grupo lógico de cambios**, indica qué comando ejecutar para validar (`php artisan test`, `npm run build`, verificación manual específica en ruta X).

---

## FORMATO DE SALIDA

```
## CAMBIO [N] — [Descripción breve] [BLOQUEANTE / NECESARIO / RECOMENDADO]

**Archivo:** `ruta/exacta/al/archivo.tsx`
**Línea/Bloque:** [número de línea o descripción del bloque]
**Estado actual:** [qué dice ahora el código]
**Cambio:** [qué debe decir / cómo debe quedar]
**Razón:** [por qué es necesario para Natalia — una línea]
```

---

## SECCIONES OBLIGATORIAS AL FINAL

### GAPS
Lista las features que Natalia necesita y ClientKosmos **no tiene**. Para cada gap incluye:
- Descripción del gap
- Pain point de Natalia que resuelve (del 1 al 6)
- Severidad para la experiencia actual (Alta / Media / Baja)
- Nota de alcance mínimo si se quisiera implementar en el futuro

Los gaps que ya están identificados (no necesitas redescubrirlos, pero sí confirmarlos si existen en el código):
- **Facturación recurrente automática por paciente** — Pain #1, Alta
- **Seguimiento de cobros por paciente** (estado Pagado/Pendiente/Vencido) — Pain #3, Alta
- **Generación y firma electrónica de consentimientos RGPD** — Pain #2, Alta
- **Vista "Antes de empezar"** — cockpit pre-sesión: acuerdos activos + estado de cobro + archivos recientes del siguiente paciente — Pain #4, Media (parcialmente cubierto por `resumen_cliente`)
- **Vista "Al terminar"** — acciones rápidas post-sesión: nota + verificar cobro + dejar siguiente acuerdo — Pain #4 y #5, Media
- **Estados inteligentes del paciente** — badges automáticos: "Falta consentimiento", "Pendiente de cobro", "Acuerdo sin cerrar" — Pain #3 y #4, Media

### VALIDACIÓN
Checklist de tests y verificaciones manuales para confirmar que todos los cambios funcionan.

### RESUMEN
```
BLOQUEANTES:  X cambios
NECESARIOS:   X cambios
RECOMENDADOS: X cambios
TOTAL:        X cambios
GAPS:         X features no implementadas
```

---

## IMPORTANTE

**No empieces a hacer cambios. Solo genera el plan.** Yo lo revisaré cambio a cambio y te indicaré qué ejecutar y en qué orden.

Si tienes dudas sobre la intención de un cambio concreto antes de generarlo, pregúntame. Prefiero que pares y preguntes a que asumas y generes trabajo que luego hay que revertir.
