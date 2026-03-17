# ClientKosmos — Auditoría de Producto y Plan de Mejora Estratégica

**Rol:** Product Designer + UX Strategist + Tech-aware  
**Fecha:** Marzo 2026  
**Alcance:** Estrategia de producto, UX y UI basada en documentación interna y evidencia externa

---

## IDENTIDAD DE PRODUCTO

**Nombre:** ClientKosmos  
**Significado:** *Kosmos* (griego) = universo como sistema ordenado. Poner orden en el universo de tus clientes.  
**Posicionamiento:** CRM minimalista para freelancers multicliente que quieren calma, no caos.

### Taglines (seleccionar uno como base)
- "Order in your client universe."
- "Calm control over every client."
- "Bring order to your client work."
- "One calm space for all your clients."

### Asistente IA: Kosmo
El personaje de asistente pasa de "Flowy" a **Kosmo** — compañero tranquilo que pone orden cuando lo necesitas, sin interrumpir cuando no.

### Visual identity (dirección)
- Símbolo orbital: círculo principal + 2–3 "satélites" que representan clientes alrededor del centro.
- Cada órbita mapea metafóricamente a una ficha de cliente.
- Paleta verde + crema + calma productiva: se mantiene íntegramente.
- Tono de voz: igual que antes — compañero competente y tranquilo — ahora con frases tipo:
  - "Pon orden en tu kosmos de clientes."
  - "Tu client kosmos, en un solo lugar."

---

## BLOQUE 1 — Mapa de Necesidades Reales del Freelancer Multicliente

Cada necesidad combina evidencia interna (docs de ClientKosmos) con evidencia externa (blogs de productividad, CRMs para freelancers, artículos de UX).

### N1. Reducir el coste cognitivo de reconstruir contexto al cambiar de cliente

- **Interna:** `necesidad-y-justificacion.md` describe la fragmentación de herramientas como problema central: "contextos repartidos en 5 apps distintas". `contexto-proyecto-5.md` define ClientKosmos como "memoria operativa por cliente".
- **Externa:** El context switching entre 3–6 clientes/día implica reconstruir contexto constantemente (clarohq.com, dev.to). Los estudios de productividad freelance estiman que la reconstrucción de contexto consume entre 15 y 25 minutos cada vez que se cambia de cliente.

### N2. Saber qué hacer hoy cuando hay varios clientes activos

- **Interna:** `necesidad-y-justificacion.md` mapea esta necesidad a "IA contextual — plan del día". `manual-usuario-2.md` describe el Panel Hoy con métricas y acceso a planificar el día.
- **Externa:** Las guías de gestión multicliente enfatizan la planificación diaria como práctica esencial (tampoapp.com, super-productivity.com). Los CRMs para freelas destacan "calendar dashboards" para vista global (clientmanager.io).

### N3. Tener un contenedor único por cliente donde no se pierdan tareas, ideas y recursos

- **Interna:** `necesidad-y-justificacion.md` mapea esto directamente a fichas de cliente con tareas, ideas y recursos asociados. `contexto-proyecto-5.md` describe Projects como contenedor central.
- **Externa:** Los CRMs para freelancers piden "client dashboard con vista 360" en un solo lugar (clientmanager.io). Los blogs de freelancing insisten en "un sistema por cliente, no uno por herramienta" (freelance.ca).

### N4. No depender de la memoria para deadlines y follow-ups

- **Interna:** `necesidad-y-justificacion.md` identifica como problema las "fechas que se pierden, tareas mezcladas". Las tareas tienen `due_date` y prioridades (`contexto-proyecto-5.md`).
- **Externa:** El riesgo de errores y burnout por pérdida de fechas es patrón recurrente (super-productivity.com, healthyworklifespace.com). CRMs para freelancers piden "recordatorios y automatización ligera" (monday.com/blog).

### N5. Detectar qué clientes están "en riesgo" o necesitan atención urgente

- **Interna:** `necesidad-y-justificacion.md` mapea esta necesidad a "IA contextual — resumen + parte semanal". `guia-estilos-4.md` define componentes como `RiskBadge` y `ClientTimeline`.
- **Externa:** La falta de visión global sobre qué proyectos están activos o enfriándose es un dolor repetido (freelance.ca). Los CRMs quieren "client profiles con histórico e info relevante" (monday.com/blog).

### N6. Capturar ideas rápidas sin perder el flujo de trabajo actual

- **Interna:** `necesidad-y-justificacion.md` mapea a "Ideas sin límite". `contexto-proyecto-5.md` describe Ideas como captura rápida con prioridad.
- **Externa:** La productividad freelance enfatiza la "captura rápida" como hábito esencial para no perder pensamientos al hacer context switching (tampoapp.com).

### N7. Mantener una interfaz simple que no abrume (simplicidad sobre ultra-configuración)

- **Interna:** `necesidad-y-justificacion.md` define como diferenciador la "simplicidad deliberada". `guia-estilos-4.md` establece "Calma productiva", "una acción por pantalla", "menos opciones".
- **Externa:** Las guías de diseño SaaS minimal muestran que reducir ruido mejora conversión y retención (eduwik.com, muffingroup.com). Los CRMs ligeros para freelas enfatizan "fácil de usar, extensión del negocio" (xgenious.com).

### N8. Que la IA sirva como asistente contextual silencioso, no como gimmick

- **Interna:** `necesidad-y-justificacion.md` define "IA con contexto real" como diferenciador. `guia-estilos-4.md` describe la voz como "compañero competente y tranquilo". La IA usa datos reales del freelancer (tareas, clientes, ideas).
- **Externa:** Las tendencias de IA en productividad enfatizan "calm AI" que actúa como asistente silencioso, no como feature ruidosa (dribbble.com/shots/21947771). El paradigma emergente es IA que empuja al usuario solo cuando hay información relevante.

### N9. Entender el valor del producto rápidamente al empezar (time-to-value bajo)

- **Interna:** `decisiones-tecnicas-3.md` describe un tutorial interactivo con spotlight y asistente "Kosmo". `manual-usuario-2.md` muestra el flujo: Registro → Tutorial → Panel Hoy → Crear cliente.
- **Externa:** Los SaaS minimal enfatizan enfocar en UVP y CTA desde la primera interacción (eduwik.com). Los freelancers abandonan herramientas que requieren mucho setup (xgenious.com).

### N10. Escalar de freelancer a mini-equipo sin cambiar de herramienta (futuro)

- **Interna:** `necesidad-y-justificacion.md` menciona escalabilidad como valor futuro. El modelo freemium ya tiene base para esto (Free → Solo, posible Team).
- **Externa:** CRMs para freelancers piden "escalabilidad light" (monday.com/blog). **Nota:** Esta necesidad es real pero está fuera del scope actual. La marco como hipótesis futura que requeriría validación.

---

## BLOQUE 2 — Tabla ClientKosmos vs Necesidades

| # | Necesidad | Cobertura | Comentario / Evidencia |
|---|-----------|-----------|------------------------|
| N1 | Reducir coste de reconstruir contexto al cambiar de cliente | **Parcial** | La ficha de cliente con tareas+ideas+recursos existe y es el core del producto. Sin embargo, al entrar a una ficha el freelancer debe navegar entre pestañas para reconstruir el contexto. No hay un "resumen rápido" visible al aterrizar. La IA contextual (`clientSummary`) puede cubrir esto, pero es Solo y requiere acción manual del usuario. |
| N2 | Saber qué hacer hoy con varios clientes | **Parcial** | El Panel Hoy existe y muestra métricas + acceso a planificar el día. Pero muestra contadores (clientes activos, tareas pendientes, ideas, tareas vencidas) que son KPIs estáticos. El `planDay` de IA es el verdadero diferenciador aquí, pero es Solo y se activa manualmente. Un usuario Free ve un dashboard con números, no un plan accionable. |
| N3 | Contenedor único por cliente | **Bien cubierto** | Las fichas de cliente (Projects) son el corazón de ClientKosmos. Cada cliente tiene tareas, ideas y recursos asociados. Esto está bien diseñado y es el diferenciador principal frente a herramientas genéricas. |
| N4 | No depender de la memoria para deadlines y follow-ups | **Parcial** | Las tareas tienen `due_date` y prioridad. Hay "tareas vencidas" como métrica en el Panel Hoy. Pero no hay sistema de notificaciones/recordatorios. El freelancer depende de entrar al app para saber qué está vencido. No hay email de resumen semanal ni push notifications. |
| N5 | Detectar clientes en riesgo | **Parcial** | El design system define `RiskBadge` y `ClientTimeline`. La IA `clientUpdate` genera "partes semanales" por cliente. Pero la detección de riesgo depende de que el usuario invoque la IA manualmente. No hay alertas proactivas ni indicadores de riesgo en la lista de clientes sin usar IA (Solo). |
| N6 | Capturar ideas rápido | **Bien cubierto** | Ideas sin límite, con prioridad, asociadas a cliente. Flujo de captura rápida bien definido. No hay restricción de plan (incluso Free tiene ideas ilimitadas). |
| N7 | Interfaz simple que no abrume | **Bien cubierto** | La guía de estilos implementa "Calma productiva" con rigor: whitespace intencional, un foco por pantalla, progressive disclosure, paleta verde-crema. El design system con shadcn/ui + Tailwind está bien documentado. |
| N8 | IA como asistente contextual silencioso | **Parcial** | La IA es contextual (usa datos reales) y tiene 3 endpoints claros (`planDay`, `clientSummary`, `clientUpdate`). El tono está bien definido. Pero la IA está detrás de botones manuales, no es proactiva. El concepto de "asistente silencioso" no se materializa del todo: requiere que el usuario sepa que existe, vaya al lugar correcto y la invoque. |
| N9 | Time-to-value bajo | **Parcial** | Hay tutorial con spotlight y Kosmo como asistente. Pero el tutorial muestra funcionalidades sueltas sin conectar con la narrativa "memoria operativa por cliente". El usuario Free solo puede tener 1 cliente, lo que limita experimentar el valor multi-cliente sin pagar. El empty state del Panel Hoy con 0 clientes no comunica la propuesta de valor. |
| N10 | Escalar a mini-equipo | **No cubierto** | Fuera de scope actual. Marcado como hipótesis futura. |

---

## BLOQUE 3 — Lista Priorizada de Cambios

### P1. Convertir el Panel Hoy en un verdadero "centro de mando diario"

**Qué cambiar (Producto + UX):**  
Reestructurar el Panel Hoy para que al abrir ClientKosmos cada mañana, el freelancer sepa inmediatamente qué hacer hoy, con qué clientes, y cuáles necesitan atención urgente.

Cambios concretos:
- Reemplazar los contadores estáticos por contenido accionable agrupado por cliente.
- Sección principal: "Tu día" — lista de tareas con due_date = hoy o vencidas, agrupadas por cliente con su color, ordenadas por prioridad. Cada tarea completable inline (checkbox).
- Sección secundaria: "Clientes que necesitan atención" — mostrar clientes con tareas vencidas o sin actividad reciente. Usar el `RiskBadge` que ya existe en la guía de estilos.
- Mover el botón de "Planificar mi día" (IA `planDay`) a posición prominente para usuarios Solo, con un CTA claro: "¿No sabes por dónde empezar? Deja que Kosmo te sugiera un plan."
- Para usuarios Free: mostrar la agrupación por cliente de tareas de hoy como valor base, y el `planDay` como preview bloqueado que muestre qué haría la IA.

**Necesidad que ataca:** N2, N5, N1.  
**Impacto:** Alto — es la primera pantalla que ve el usuario cada día.  
**Esfuerzo:** Medio — los datos ya existen. Es reordenar y repriorizar componentes en el `DashboardController` y la página React de Dashboard.

**Encaje con arquitectura:**  
El `DashboardController` ya pasa métricas al frontend vía Inertia. Se necesita ampliar la query para incluir tareas de hoy/vencidas agrupadas por `project_id` con su relación `project`. No requiere nuevos modelos ni migraciones.

---

### P2. Hacer visible el resumen de contexto al aterrizar en una ficha de cliente

**Qué cambiar (UX + UI):**  
Al entrar a la ficha de un cliente, mostrar arriba un bloque "estado actual" compacto que permita reconstruir contexto en 5 segundos sin navegar pestañas.

Cambios concretos:
- Añadir un "header de contexto" que muestre: número de tareas pendientes, próxima fecha de entrega, número de ideas activas, último cambio significativo.
- Para Solo: integrar un mini-resumen generado por `clientSummary` colapsado por defecto, expandible. CTA sutil: "Ver resumen Kosmo de este cliente".
- El bloque debe ser compacto (1-2 líneas + badges) siguiendo progressive disclosure.

**Necesidad que ataca:** N1, N3.  
**Impacto:** Alto — reduce directamente el context switching que es el problema central.  
**Esfuerzo:** Bajo-Medio — los datos son queries simples sobre relaciones existentes.

---

### P3. Hacer la IA contextual más visible y menos dependiente de acción manual

**Qué cambiar (UX + Copy):**  
Reposicionar a Kosmo como "compañero silencioso que sugiere" en los momentos correctos, en vez de un botón que el usuario tiene que buscar.

Cambios concretos:
- **En el Panel Hoy:** si hay tareas vencidas o clientes sin actividad reciente, mostrar un banner sutil: "Tienes 3 tareas vencidas en 2 clientes. ¿Quieres que Kosmo te ayude a reorganizar el día?"
- **En la ficha de cliente:** si el cliente tiene más de 5 tareas pendientes o alguna vencida: "Hay movimiento aquí. ¿Resumen rápido de Kosmo?"
- **Copy de la IA:** mantener la voz de compañero competente y tranquilo:
  - Sí: "Tienes varias entregas esta semana. ¿Te preparo un plan?"
  - No: "¡Cuidado! Tienes tareas vencidas. ¡Actúa ya!"
- **Outputs de IA:** mantener el `AiOutputCard` con AI Surface. Añadir indicador sutil "Kosmo · generado por IA".
- Solo para usuarios Solo (respetando el modelo freemium).

**Necesidad que ataca:** N8, N2, N5.  
**Impacto:** Alto — convierte un diferenciador "oculto" en uno perceptible.  
**Esfuerzo:** Medio — lógica condicional en frontend, nuevos micro-componentes React. No requiere cambios en endpoints de IA.

---

### P4. Mejorar el onboarding para comunicar "memoria operativa por cliente"

**Qué cambiar (UX + Copy):**  
Ajustar el tutorial y los empty states para que el usuario entienda en los primeros 2 minutos que ClientKosmos es "el lugar donde vive todo lo de cada cliente", no "otra app de tareas".

Cambios concretos:
- **Mensaje de bienvenida de Kosmo:** "En ClientKosmos, cada cliente tiene su espacio. Tareas, ideas, recursos y contexto: todo en un solo lugar. Vamos a crear tu primer cliente."
- **Empty state del Panel Hoy (sin clientes):** "Aquí verás tu plan del día, organizado por cliente. Empieza creando tu primer cliente." + CTA "Crear mi primer cliente".
- **Empty state de lista de clientes:** "Cada cliente tiene su ficha con todo lo que necesitas: tareas, ideas, recursos. Nada se pierde entre apps." + CTA.
- **Progresión del tutorial:** (1) Crear cliente → (2) Añadir una tarea a ese cliente → (3) Añadir una idea → (4) Ver cómo el Panel Hoy agrupa todo por cliente.
- **Para Solo en el onboarding:** paso extra que muestre la IA: "Cuando tengas varias tareas, Kosmo puede sugerirte un plan para el día."

**Necesidad que ataca:** N9, N7, N3.  
**Impacto:** Alto — define la primera impresión y el frame mental del usuario.  
**Esfuerzo:** Bajo — cambios de copy en componentes existentes del tutorial y empty states.

---

### P5. Añadir señales de riesgo/atención en la lista de clientes (sin IA)

**Qué cambiar (UI + Producto):**  
Mostrar indicadores visuales en la lista de clientes que permitan ver de un vistazo qué necesitan atención.

Cambios concretos:
- En cada `ClientCard`, añadir badges condicionales:
  - Badge rojo si tiene tareas vencidas (con número).
  - Badge ámbar si tiene tareas con due_date en próximas 48h.
  - Indicador gris sutil si no ha habido actividad en X días (hipótesis: validar umbral con usuarios).
- Usar colores funcionales del design system (error/warning/muted).
- Ordenar la lista por defecto poniendo primero los clientes que necesitan atención. **Hipótesis:** este ordenamiento requeriría validación.

**Necesidad que ataca:** N5, N1.  
**Impacto:** Medio-Alto — resuelve un problema diario con poco overhead visual.  
**Esfuerzo:** Bajo — el `RiskBadge` ya existe en el design system.

---

### P6. Reforzar el copy del producto para anclar el diferenciador "por cliente"

**Qué cambiar (Copy):**  
Ajustar el microcopy a lo largo del producto para que constantemente refuerce que la organización es "por cliente".

Cambios concretos:
- Término consistente "Clientes" en toda la navegación visible (el modelo interno `Project` no cambia).
- CTAs de creación: "Nuevo cliente", "Añadir tarea para [nombre del cliente]".
- Confirmaciones: "Tarea añadida a [ClienteName]" en vez de "Tarea creada exitosamente".
- IA outputs: los resúmenes de Kosmo siempre nombran al cliente: "Resumen de Acme Corp · Kosmo".
- **Landing page — propuesta de copy:**
  - H1: "Order in your client universe."
  - Sub: "ClientKosmos organiza clientes, tareas, ideas y resúmenes IA en un solo espacio tranquilo, para freelancers multicliente."
  - Evitar copys genéricos como "Gestiona tu trabajo de freelancer" que suenan a Todoist.

**Necesidad que ataca:** N3, N9, N7.  
**Impacto:** Medio — el copy coherente construye el modelo mental correcto.  
**Esfuerzo:** Bajo — revisión de strings en componentes React.

---

### P7. Mejorar la experiencia Free para que demuestre el valor multi-cliente

**Qué cambiar (Producto + UX):**  
Ajustar el plan Free para que el usuario pueda experimentar la propuesta de valor multi-cliente antes de pagar.

Cambios concretos:
- **Hipótesis (requiere validación):** Subir el límite Free de 1 a 2 clientes. Con 1 cliente, el usuario nunca experimenta el diferenciador de ClientKosmos. Con 2 puede sentir el valor y la fricción de "necesito más" para escalar a Solo.
- **Alternativa:** mantener 1 cliente pero añadir un "cliente demo/ejemplo" pre-creado con tareas e ideas de muestra que enseñe cómo se ve el Panel Hoy con 2 clientes. Este cliente se puede borrar pero no editar.
- **Upgrade prompts contextuales:**
  - Panel Hoy: "Con Solo, Kosmo puede planificarte el día analizando las tareas de todos tus clientes."
  - Ficha de cliente: "Con Solo, puedes pedir a Kosmo un resumen del estado de [nombre del cliente] en segundos."

**Necesidad que ataca:** N9, N2.  
**Impacto:** Alto — impacta directamente en conversión Free→Solo.  
**Esfuerzo:** Bajo (cliente demo) a Medio (cambiar límites, requiere ajustar middleware y tests).

---

### P8. Explorar notificaciones de resumen (futuro cercano)

**Qué cambiar (Producto):**  
Email de resumen semanal que recuerde al freelancer sus prioridades sin necesidad de abrir el app.

Cambios concretos:
- **Email semanal (Solo):** "Esta semana tienes 8 tareas pendientes en 3 clientes. 2 vencen el martes. [Ver tu kosmos →]". Datos factuales, no IA.
- **Opcional:** mini-resumen generado por Kosmo incluido en el email semanal.
- **Opt-in siempre:** alineado con la filosofía "calma productiva" — no spamear.

**Necesidad que ataca:** N4, N5.  
**Impacto:** Medio — mantiene engagement y reduce dependencia de memoria.  
**Esfuerzo:** Medio — Job de Laravel (`SendWeeklySummary`), Laravel Mailables, scheduler.

---

## RESUMEN DE GAPS Y BLOAT IDENTIFICADOS

### Gaps (funcionalidad poco explotada):

1. **Panel Hoy como centro de acción:** existe pero muestra contadores en vez de tareas agrupadas accionables.
2. **Kosmo contextual oculto:** los 3 endpoints son potentes pero dependen de que el usuario los invoque manualmente. No hay nudges contextuales.
3. **Señales de riesgo en la lista:** el design system define `RiskBadge` pero no se usa en la vista de lista donde sería más útil.
4. **Free no demuestra el valor core:** con 1 cliente, el freelancer no experimenta la organización multi-cliente que es el diferenciador de ClientKosmos.
5. **No hay recordatorios fuera del app:** depende de que el usuario entre a ClientKosmos para saber qué tiene vencido.

### Posible bloat (a vigilar):

1. **Métricas decorativas en Panel Hoy:** si los contadores no llevan a una acción, son ruido visual que contradice "Calma productiva".
2. **Tutorial que enseña funciones en vez de valor:** si el onboarding recorre features en vez de contar la historia "memoria operativa por cliente", pierde la oportunidad de anclar el modelo mental correcto.
3. **Terminología mixta proyecto/cliente:** si el frontend mezcla ambos términos, genera confusión sobre qué es ClientKosmos.

Nota: no identifico features que sobren del todo. El scope de ClientKosmos es contenido y coherente con su propuesta de valor. El riesgo no es de bloat funcional sino de **sub-explotación** de lo que ya existe.

---

## PLAN DE IMPLEMENTACIÓN PARA CLAUDE EN VS CODE

### Instrucciones generales para el agente

```
CONTEXTO DEL PROYECTO:
- Nombre del producto: ClientKosmos (antes: Flowly)
- Asistente IA en el producto: Kosmo (antes: Flowy)
- Stack: Laravel 12 + Inertia.js + React 19 + TypeScript + shadcn/ui + Tailwind
- Auth: Fortify + Spatie Permission (roles: free_user, premium_user, admin)
- BD: SQLite en dev/tests, TiDB Cloud Serverless en prod
- IA: openai-php/client via Groq (endpoints en AiController)
- Tests: Pest 3 con 156 tests / 615 asserts (TODOS deben seguir pasando)
- Modelo central: User hasMany Projects, Project hasMany Tasks/Ideas/Resources
- El modelo Project representa internamente a un "Cliente" (ficha de cliente)

REGLAS PARA TODOS LOS CAMBIOS:
1. Ejecutar tests ANTES de cualquier cambio para tener baseline.
2. Después de cada cambio, ejecutar tests para verificar que nada se rompe.
3. No cambiar nombres de modelos ni migraciones existentes (Project sigue siendo Project internamente).
4. Los cambios de copy son solo en frontend (componentes React/TSX).
5. Respetar el design system: paleta verde-crema, Nunito headings, Inter body, shadcn/ui components.
6. Respetar la filosofía "Calma productiva": whitespace intencional, un foco por pantalla, progressive disclosure.
7. Cambios de backend: seguir el patrón Inertia (datos vía props, no API REST).
```

### Sprint 1 — Copy y Quick Wins (Esfuerzo bajo, impacto medio-alto)

```
TAREA 1.0: REBRAND — CLIENTKOSMOS + KOSMO
Objetivo: Sustituir "Flowly" por "ClientKosmos" y "Flowy" por "Kosmo" en todo el frontend visible.

Pasos:
1. Buscar en resources/js/ todas las referencias visibles a "Flowly" y "Flowy".
2. Sustituir:
   - "Flowly" → "ClientKosmos" (nombre del producto)
   - "Flowy" → "Kosmo" (nombre del asistente IA)
   - Título del browser/app si está hardcoded → "ClientKosmos"
   - Logo text si lo hay → "ClientKosmos"
3. En config/app.php o .env, actualizar APP_NAME si está como "Flowly".
4. NO cambiar nombres de clases, rutas, tablas ni modelos internos.
5. Ejecutar tests completos.

TAREA 1.1: AUDITORÍA Y UNIFICACIÓN DE COPY "CLIENTE"
Objetivo: Reemplazar toda referencia visible a "proyecto" por "cliente" en el frontend.

Pasos:
1. Buscar en resources/js/ todos los archivos que contengan "proyecto", "project"
   en texto visible al usuario (labels, títulos, placeholders, toasts, mensajes de error).
2. Reemplazar por "cliente":
   - "Nuevo proyecto" → "Nuevo cliente"
   - "Mis proyectos" → "Mis clientes"
   - "Proyecto creado" → "Cliente creado"
   - "Añadir tarea" → "Añadir tarea para [nombre del cliente]" (donde el contexto lo permita)
3. NO cambiar nombres de componentes, rutas ni modelos internos.
4. Verificar que los tests de feature que validan mensajes flash o redirects
   no dependan de strings específicos que hayas cambiado.
5. Ejecutar tests completos.

TAREA 1.2: MEJORAR EMPTY STATES
Objetivo: Que los empty states comuniquen la propuesta de valor "memoria operativa por cliente".

Pasos:
1. Localizar componentes de empty state:
   - Panel Hoy sin clientes/tareas
   - Lista de clientes vacía
   - Ficha de cliente sin tareas
   - Ficha de cliente sin ideas
2. Para cada uno, actualizar el copy:
   - Panel Hoy vacío: "Aquí verás tu plan del día, organizado por cliente.
     Todo lo que necesitas saber para empezar la mañana."
     CTA: "Crear tu primer cliente"
   - Lista de clientes vacía: "Cada cliente tiene su espacio: tareas, ideas,
     recursos y contexto. Nada se pierde entre apps."
     CTA: "Crear cliente"
   - Sin tareas: "Las tareas de [nombre del cliente] aparecerán aquí.
     Añade la primera para empezar."
   - Sin ideas: "¿Algo que quieras explorar para [nombre del cliente]?
     Captúralo aquí antes de que se escape."
3. Respetar el patrón visual de empty states del design system
   (ilustración minimalista + micro-copy).
4. Ejecutar tests.

TAREA 1.3: AJUSTAR COPY DEL TUTORIAL/ONBOARDING
Objetivo: Que el tutorial ancle "ClientKosmos = organización por cliente" desde el primer paso.

Pasos:
1. Localizar el componente/sistema de tutorial (buscar "tutorial", "onboarding",
   "spotlight", "Kosmo" en resources/js/).
2. Ajustar los textos de cada paso del tutorial:
   - Paso de bienvenida (Kosmo): "En ClientKosmos, cada cliente tiene su espacio.
     Tareas, ideas, recursos y contexto: todo junto. Vamos a configurar tu primer cliente."
   - Paso de crear cliente: "Este es [nombre]. Aquí vivirá todo lo relacionado
     con este cliente."
   - Paso de crear tarea: "Añade lo que necesitas hacer para [nombre].
     ClientKosmos lo organiza por cliente automáticamente."
   - Paso del Panel Hoy: "Cada mañana, aquí verás qué toca para cada cliente.
     Tu plan del día, de un vistazo."
   - Si hay paso de IA (Solo): "Cuando tengas varias tareas entre clientes,
     Kosmo puede sugerirte un plan para el día."
3. Mantener el personaje Kosmo y su tono (amigable, competente, tranquilo).
4. Ejecutar tests.
```

### Sprint 2 — Panel Hoy (Esfuerzo medio, impacto alto)

```
TAREA 2.1: AMPLIAR DATOS DEL DASHBOARD CONTROLLER
Objetivo: Que el Panel Hoy reciba tareas de hoy/vencidas agrupadas por cliente.

Pasos:
1. Localizar el DashboardController (app/Http/Controllers/).
2. Añadir a la query de datos del dashboard:
   a) Tareas pendientes con due_date = hoy o < hoy (vencidas),
      incluyendo la relación project (nombre y color del cliente).
      Ordenar por: vencidas primero, luego por prioridad (high > medium > low).
   b) Lista de projects activos con:
      - count de tareas vencidas
      - count de tareas con due_date en próximas 48h
      - fecha de última actividad
3. Pasar estos datos como props via Inertia::render junto con los datos existentes.
4. NO eliminar los datos existentes (contadores).
5. Añadir test de feature que verifique que el dashboard devuelve la nueva estructura.
6. Ejecutar todos los tests.

TAREA 2.2: REORGANIZAR LA VISTA DEL PANEL HOY
Objetivo: Que el Panel Hoy muestre primero las tareas accionables agrupadas por cliente.

Pasos:
1. Localizar la página React del Dashboard (resources/js/Pages/Dashboard.tsx o similar).
2. Reestructurar el layout:
   a) HERO: Sección "Tu día" — tareas de hoy + vencidas, agrupadas por cliente.
      - Cada grupo tiene el nombre del cliente + color badge.
      - Cada tarea es completable inline (checkbox).
      - Si no hay tareas de hoy: "No tienes nada urgente hoy. Buen día para avanzar."
   b) SECUNDARIO: Sección "Atención" — clientes con tareas vencidas o sin actividad.
      - Usar RiskBadge para cada cliente que necesita atención.
      - Si no hay clientes en riesgo: no mostrar la sección (progressive disclosure).
   c) TERCIARIO: Los contadores actuales movidos a una fila compacta abajo o colapsados.
3. Para Solo: CTA de Kosmo en posición prominente dentro de "Tu día":
   "¿Varios clientes hoy? Kosmo puede organizarte el día."
4. Para Free: preview bloqueado:
   "Con Solo, Kosmo puede organizarte el día automáticamente."
5. Respetar: paleta, tipografía, whitespace, un foco por pantalla.
6. Ejecutar tests.
```

### Sprint 3 — Ficha de Cliente + Badges de Riesgo (Esfuerzo medio, impacto alto)

```
TAREA 3.1: HEADER DE CONTEXTO EN FICHA DE CLIENTE
Objetivo: Al entrar a un cliente, ver su estado en 5 segundos.

Pasos:
1. Localizar ProjectController@show y la página React de show de Project.
2. En el controller, añadir a los datos pasados por Inertia:
   - pending_tasks_count
   - high_priority_count
   - next_due_date (MIN de due_date de tareas pendientes)
   - active_ideas_count
   - last_activity (última tarea con updated_at más reciente)
3. Crear componente <ClientContextHeader>:
   "[3 tareas pendientes · 1 urgente · Entrega: 20 mar · 2 ideas activas]"
   Badge rojo si hay tareas vencidas.
   Texto gris: "Último cambio: [descripción] · hace 2 días"
4. Para Solo: debajo del header, colapsado:
   "Resumen Kosmo de [cliente] ▸" — al expandir invoca clientSummary.
   Si ya se generó recientemente, mostrar el último resultado cacheado.
5. Ejecutar tests.

TAREA 3.2: BADGES DE RIESGO EN LISTA DE CLIENTES
Objetivo: Ver de un vistazo qué clientes necesitan atención sin entrar a cada ficha.

Pasos:
1. Localizar ProjectController@index y la página de lista de Projects.
2. En el controller, añadir withCount o subqueries:
   - overdue_tasks_count: tareas pendientes con due_date < hoy
   - upcoming_tasks_count: tareas pendientes con due_date entre hoy y +48h
3. En el componente ClientCard, añadir badges condicionales:
   - overdue_tasks_count > 0: <RiskBadge variant="error"> "{n} vencidas"
   - upcoming_tasks_count > 0: <RiskBadge variant="warning"> "{n} próximas"
4. Ordenar la lista: primero clientes con vencidas, luego próximas, luego resto.
5. Ejecutar tests.
```

### Sprint 4 — Nudges de Kosmo (Esfuerzo medio, impacto alto)

```
TAREA 4.1: NUDGES CONTEXTUALES DE KOSMO EN PANEL HOY Y FICHA DE CLIENTE
Objetivo: Que Kosmo aparezca como sugerencia cuando hay contexto relevante.

Pasos:
1. SOLO para usuarios con rol premium_user (Solo).
2. En el Panel Hoy, si overdue_tasks_total > 0 o clientes_con_vencidas > 1:
   Banner sutil (componente <KosmoNudge>):
   - Copy: "Tienes {n} tareas vencidas en {m} clientes.
     ¿Quieres que Kosmo te ayude a reorganizar el día?"
   - CTA: botón que invoca planDay
   - Dismissable (no vuelve hasta el día siguiente).
   - Estilo: AI Surface (fondo diferenciado del design system),
     borde primary suave, icono de Kosmo.
3. En la ficha de cliente, si pending_tasks_count > 5 o overdue > 0:
   Nudge inline sutil:
   - Copy: "Hay movimiento aquí. ¿Resumen rápido de Kosmo?"
   - CTA: invoca clientSummary
   - Solo si no se ha generado un summary en las últimas 24h.
4. Copy guidelines:
   - Tono: compañero tranquilo, no urgente.
   - NO usar "¡", NO usar "urgente", NO usar "cuidado".
   - SÍ usar: "Tienes varias cosas esta semana", "Hay movimiento aquí",
     "¿Kosmo te echa una mano con el plan?"
5. Los nudges no añaden endpoints ni lógica de IA nueva.
6. Ejecutar tests.
```

### Sprint 5 — Experiencia Free y Conversión (Esfuerzo medio, impacto alto)

```
TAREA 5.1: UPGRADE PROMPTS CONTEXTUALES
Objetivo: Que los mensajes de upgrade aparezcan donde el usuario siente el límite.

Pasos:
1. Localizar los componentes/middleware que muestran mensajes de upgrade/límite.
2. Reemplazar mensajes genéricos por contextuales:
   - Límite de clientes: "Con Solo puedes gestionar todos tus clientes
     desde un solo lugar. Sin límites."
   - Límite de tareas: "5 tareas es el máximo en Free.
     Con Solo, añade todas las que necesites para [nombre del cliente]."
   - IA bloqueada (Panel Hoy): "Con Solo, Kosmo puede planificarte el día
     analizando las tareas de todos tus clientes."
   - IA bloqueada (ficha de cliente): "Con Solo, puedes pedir a Kosmo un resumen
     del estado de [nombre del cliente] en segundos."
   - Recursos bloqueados: "Con Solo, cada cliente puede tener sus recursos
     (enlaces, docs, notas) asociados."
3. Cada prompt tiene un CTA a la página de suscripción.
4. Tono: informativo, no agresivo. Sin "¡Mejora ya!" ni urgencia artificial.
5. Ejecutar tests.

TAREA 5.2 (OPCIONAL — REQUIERE VALIDACIÓN): SUBIR LÍMITE FREE A 2 CLIENTES
Nota: Hipótesis. Implementar SOLO si se decide validar.

Si se decide proceder:
1. Localizar la constante/config que define el límite de Projects para free_user.
2. Cambiar de 1 a 2.
3. Actualizar los tests que validan este límite.
4. Actualizar el copy de la landing/pricing: "1 cliente" → "2 clientes".
5. Ejecutar todos los tests.
```

### Orden de ejecución recomendado

```
FASE 1 (Quick wins — 1-2 días):
  Sprint 1 completo (rebrand ClientKosmos/Kosmo + copy + empty states + onboarding)
  → Impacto inmediato en percepción del producto, riesgo casi nulo.

FASE 2 (Core experience — 3-5 días):
  Sprint 2 (Panel Hoy) + Sprint 3 (Ficha de cliente + badges)
  → Hacerlos secuenciales para mantener tests verdes.

FASE 3 (IA y conversión — 2-3 días):
  Sprint 4 (Nudges Kosmo) + Sprint 5 (Upgrade prompts)
  → Dependen de que los Sprints 2-3 estén terminados.

FASE 4 (Futuro cercano — cuando haya validación):
  Tarea 5.2 (Límite Free a 2 clientes) — solo si se valida la hipótesis.
  P8 del plan estratégico (Email de resumen semanal) — requiere setup de scheduler.

CHECKPOINT DESPUÉS DE CADA SPRINT:
  1. php artisan test (todos los 156+ tests deben pasar)
  2. Revisión visual en navegador (modo claro y oscuro)
  3. Verificar que el layout no rompe en mobile (si aplica)
```

---

*Documento generado como entregable de consultoría de producto. Las propuestas marcadas como "hipótesis" requieren validación con usuarios reales antes de implementar.*
