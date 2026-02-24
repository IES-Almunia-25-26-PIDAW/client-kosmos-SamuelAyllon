\```markdown

\# Flowly — Guía de Estilo Visual (Design System)

Autor: Samuel Ayllón Sevilla

Proyecto: Flowly

Fecha: 04/11/2025

Curso: 2º DAM

\---

\## 1. Contexto del proyecto

Flowly es una plataforma web de productividad personal que actúa como centro de mando integrado para gestionar tareas, ideas, proyectos, cajas de conocimiento y productividad asistida por IA.

Su objetivo es ofrecer una experiencia de productividad calmada, clara y centrada, alineada con un modelo freemium (free, premium mensual y premium anual) y un stack moderno (Laravel 12, React 18+, Inertia, SQLite, OpenAI opcional).

\*\*Principios clave:\*\*

- Productividad calmada, sin saturación visual ni funcional.
- Estética natural, orgánica y cálida.
- Enfoque en claridad mental y reducción de carga cognitiva.
- Experiencia emocionalmente positiva, tranquila y motivadora.
- Coherencia con el stack: UI limpia, moderna y fácil de implementar en React + Tailwind/shadcn.

\---

\## 2. Fundamentos de diseño

\### 2.1 Usabilidad

- Botones suaves, descriptivos y autoexplicativos.
- Navegación clara por secciones: Dashboard, Tareas, Ideas, Proyectos, Cajas, Suscripción, Admin.
- Animaciones suaves para añadir tareas o ideas, cambios de estado y feedback de acciones (sin distracciones).
- Reducción de carga cognitiva:
- Pocas acciones principales por vista.
- Jerarquía clara: título → foco principal → acciones secundarias.
- Compatibilidad con teclado (tab, enter, escape) y patrones estándar de UI web.

\### 2.2 Accesibilidad

- Contraste suficiente entre texto y fondo (objetivo WCAG AA: ratio ≥ 4.5:1 para texto normal).
- Tipografías legibles (Nunito y Open Sans) en tamaños adecuados.
- Tamaños amplios para texto y controles (mínimo 44x44 px para elementos clicables).
- Feedback visual claro: estados hover, focus-visible, pressed, disabled.
- Feedback háptico opcional en dispositivos móviles (no obligatorio a nivel web).
- Modo de “animaciones reducidas”: desactivar o simplificar animaciones si el usuario o el sistema lo indica.

\### 2.3 Diseño visual

- Estética tranquila, natural y orgánica.
- Formas redondeadas, bordes suaves, tarjetas con sombra ligera tipo papel.
- Paleta centrada en verdes suaves y tonos cálidos/beige.
- Sombras sutiles, sin efectos agresivos.
- Uso amplio de fondo claro para mantener sensación de aire y calma.
- Evitar saturación visual: priorizar espacio y simplicidad.

\### 2.4 Diseño estructural

- Web app con estructura de dashboard:
- Header/contexto de página (nombre de sección, estado del usuario, plan actual).
- Sidebar o navegación principal en escritorio.
- Contenido central para tareas, ideas, proyectos, etc.
- Diferenciación clara de vistas por rol:
- Usuario normal (free/premium).
- Admin (panel administrativo).
- Coherencia visual entre vistas: mismos patrones de tarjetas, tablas, formularios, filtros.

\### 2.5 Diseño responsivo

- Desktop-first con adaptación a tablet y móvil.
- Escritorio:
- Sidebar lateral (app-sidebar) para navegación por rol.
- Contenido central (dashboard, listados, detalles).
- Móvil:
- Navegación simplificada (menú tipo drawer, bottom bar o icono de menú en header).
- Listados verticales con tarjetas y acciones principales accesibles con el pulgar.
- Respeto a breakpoints estándar (por ejemplo, Tailwind: sm, md, lg, xl).

\---

\## 3. Paleta de color (tokens y roles)

\### 3.1 Tokens de color

\```json

{

"colors": {

"primary": "#3A5A40",

"primarySoft": "#A1B285",

"primaryAccent": "#708837",

"bgBase": "#E9EDC9",

"bgElevated": "#DAD7CD",

"bgMuted": "#CAD2C5",

"textMain": "#333333",

"textMuted": "rgba(51, 51, 51, 0.7)",

"accentWarm": "#886237",

"accentWarmStrong": "#884A37",

"borderSubtle": "rgba(51, 51, 51, 0.08)",

"shadowSoft": "rgba(0, 0, 0, 0.06)"

}

}

\```

\### 3.2 Roles y uso de color

- `primary` (`#3A5A40`):
- Botones primarios (CTA).
- Elementos clave de interacción (switches activos, toggles, links principales).
- Indicadores de progreso y estados positivos.

- `primarySoft` (`#A1B285`):
- Fondos suaves de secciones especiales (por ejemplo, resumen de productividad).
- Estados hover suaves de botones en escritorio.
- Chips informativos.

- `primaryAccent` (`#708837`):
- Iconos y pequeños acentos en listados y métricas.
- Badges de estado positivo (“on track”, “completado”).

- `bgBase` (`#E9EDC9`):
- Fondo general de la app en modo claro.

- `bgElevated` (`#DAD7CD`):
- Tarjetas, paneles y componentes elevados.

- `bgMuted` (`#CAD2C5`):
- Fondos para secciones secundarias, filtros, barras laterales suaves.

- `textMain` (`#333333`):
- Títulos, contenidos principales, texto en tarjetas.

- `textMuted` (`rgba(51, 51, 51, 0.7)`):
- Descripciones, subtítulos, labels secundarios, placeholder.

- `accentWarm` (`#886237`) y `accentWarmStrong` (`#884A37`):
- Resaltado de logros, etiquetas de planes premium, badges de “Premium”.
- Avisos no críticos, pequeños énfasis en métricas o banners de upgrade.

- `borderSubtle`:
- Líneas divisorias y bordes muy discretos en tablas, inputs, contenedores.

- `shadowSoft`:
- Sombra base para tarjetas y componentes sobre el fondo.

\---

\## 4. Tipografía

\### 4.1 Fuentes

- \*\*Nunito\*\*: títulos, encabezados y mensajes motivacionales.
- \*\*Open Sans\*\*: texto de párrafos, descripciones, contenido principal.
- \*\*Inter\*\*: botones, labels de formularios, chips, pequeños textos de UI.

\### 4.2 Escala tipográfica (tokens)

\```json

{

"typography": {

"h1": { "fontFamily": "Nunito", "fontSize": 28, "fontWeight": 800, "lineHeight": 1.3 },

"h2": { "fontFamily": "Nunito", "fontSize": 24, "fontWeight": 700, "lineHeight": 1.35 },

"h3": { "fontFamily": "Nunito", "fontSize": 20, "fontWeight": 600, "lineHeight": 1.4 },

"subtitle": { "fontFamily": "Open Sans", "fontSize": 16, "fontWeight": 600, "lineHeight": 1.4 },

"body": { "fontFamily": "Open Sans", "fontSize": 14, "fontWeight": 400, "lineHeight": 1.6 },

"bodySmall": { "fontFamily": "Open Sans", "fontSize": 13, "fontWeight": 400, "lineHeight": 1.5 },

"button": { "fontFamily": "Inter", "fontSize": 15, "fontWeight": 600, "lineHeight": 1.3, "textTransform": "none" },

"caption": { "fontFamily": "Inter", "fontSize": 12, "fontWeight": 500, "lineHeight": 1.4 }

}

}

\```

\### 4.3 Reglas de uso

- Nunito:
- H1, H2, H3 y títulos de secciones (“Dashboard”, “Tareas”, “Admin”, etc.).
- Open Sans:
- Cuerpo de texto, descripciones de features, textos en tablas, mensajes de ayuda.
- Inter:
- Botones (“Crear tarea”, “Upgrade a Premium”).
- Labels de formularios (“Título de la tarea”, “Fecha de vencimiento”).
- Chips, badges y microcopys.

Reglas generales:

- Máximo 3 niveles de jerarquía por pantalla (ej. H1 + subtítulo + body).
- Usar line-height generoso para listas y bloques de texto (1.5–1.7).
- Evitar mayúsculas completas salvo en chips o pequeños badges.

\---

\## 5. Espaciado, bordes y sombras

\### 5.1 Espaciado (tokens)

\```json

{

"spacing": {

"xs": 4,

"sm": 8,

"md": 12,

"lg": 16,

"xl": 24,

"xxl": 32

}

}

\```

Reglas:

- Entre elementos relacionados: `md` (12 px).
- Entre bloques o secciones: `lg`–`xl` (16–24 px).
- Márgenes horizontales mínimos en desktop: `lg` (16 px), más amplios en layouts muy anchos si es necesario.

\### 5.2 Bordes y radios

\```json

{

"radius": {

"sm": 6,

"md": 10,

"lg": 16,

"pill": 999

}

}

\```

- Tarjetas: `lg`.
- Inputs, select, chips: `md`.
- Botones principales y acciones importantes: `pill` (sensación suave).

\### 5.3 Sombras

\```json

{

"shadows": {

"card": "0 8px 20px rgba(0, 0, 0, 0.06)",

"floating": "0 12px 30px rgba(0, 0, 0, 0.08)"

}

}

\```

- Tarjetas y paneles: `card`.
- Botones flotantes y overlays importantes: `floating`.

\---

\## 6. Estructura de navegación y vistas

\### 6.1 Secciones principales

- Dashboard (resumen personal).
- Tareas (tasks).
- Ideas.
- Proyectos (premium).
- Cajas de conocimiento (premium).
- Recursos.
- Suscripción/Checkout.
- Panel Admin (para rol admin).

\### 6.2 Patrón general de layout (web app)

- \*\*Header / barra superior\*\*:
- Logo o nombre Flowly.
- Información de usuario (nombre, plan, avatar).
- Acciones rápidas: acceso a configuración, logout.

- \*\*Sidebar (escritorio)\*\*:
- Navegación por rol:
- Usuarios free/premium: Dashboard, Tareas, Ideas, Proyectos, Cajas, Suscripción.
- Admin: Dashboard admin, Usuarios, Pagos, Suscripciones.
- Uso de iconos + texto, resaltando la sección activa con `primary`.

- \*\*Contenido central\*\*:
- Tarjetas de estadísticas y listados.
- Tablas para admin y listados avanzados.
- Formularios para creación/edición.

- \*\*Móvil / Pantallas pequeñas\*\*:
- Navegación accesible mediante sidebar colapsable o menú superior.
- Priorizar contenido por encima de navegación persistente.

\---

\## 7. Componentes UI

\### 7.1 Botón

\*\*Props:\*\*

- `variant`: `"primary" | "secondary" | "ghost" | "destructive"`.
- `size`: `"sm" | "md" | "lg"`.
- `icon`: opcional.

\*\*Primary:\*\*

- Fondo: `primary`.
- Texto: blanco.
- Radio: `pill`.
- Padding horizontal: `spacing.lg`.
- Padding vertical: `spacing.sm`.
- Tipografía: `typography.button`.

\*\*Secondary:\*\*

- Fondo: `bgElevated`.
- Texto: `primary`.
- Borde: 1 px `borderSubtle`.

\*\*Ghost:\*\*

- Fondo: transparente.
- Texto: `primary`.
- Sin sombra, borde mínimo o inexistente.

\*\*Estados:\*\*

- Hover (desktop):
- Aclarar ligeramente el fondo o aplicar leve overlay.
- Pressed:
- Fondo algo más oscuro, sombra reducida.
- Disabled:
- Fondo `bgMuted`, texto `textMuted`, sin sombra.

\---

\### 7.2 Tarjeta (Card)

\*\*Uso:\*\*

- Tareas, ideas, proyectos, cajas, bloques de información en dashboard.

\*\*Estilo:\*\*

- Fondo: `bgElevated`.
- Sombra: `shadows.card`.
- Radio: `radius.lg`.
- Padding: `spacing.lg`.
- Borde: opcional con `borderSubtle`.

\*\*Estructura típica:\*\*

- Título (H3).
- Metadata (fecha, prioridad, estado) en `caption`.
- Descripción breve en `body`.
- Acciones (editar, completar, ver detalles).

\---

\### 7.3 Tablas (Admin y listados avanzados)

- Encabezados con tipografía `subtitle` o `bodySmall` en semibold.
- Filas alternas suavemente diferenciadas con `bgMuted` muy suave (o ninguna, según densidad).
- Líneas divisorias con `borderSubtle`.
- Iconos de acción discretos (editar, borrar, ver) alineados a la derecha.

\---

\### 7.4 Formularios

- Inputs, selects y textareas:
- Fondo blanco o `bgElevated`.
- Borde 1 px `borderSubtle`.
- Radio `md`.
- Labels:
- Tipografía `caption` o `bodySmall`.
- Color `textMain` o `textMuted`.
- Mensajes de error:
- Color derivado de `accentWarmStrong` u otro rojo coherente (si se introduce más adelante).
- Espaciado vertical entre campos: `md`–`lg`.

\---

\### 7.5 Componentes específicos de Flowly

- \*\*Dashboard personal\*\*:
- Tarjetas de resumen: tareas abiertas, ideas recientes, proyectos activos, uso del plan.
- Gráficas simples (si se aplican) con paleta verde + cálidos.

- \*\*Gestor de tareas\*\*:
- Listado por tarjetas o tabla, según densidad.
- Indicadores claros de prioridad y fecha de vencimiento.
- Diferencias visuales mínimas pero claras entre estados (pendiente, completada).

- \*\*Ideas\*\*:
- Tarjetas ligeras, quizás más “orgánicas” (chips, etiquetas de contexto).
- Posibilidad de marcar ideas como favoritas.

- \*\*Proyectos y cajas de conocimiento (premium)\*\*:
- Enfatizar con `accentWarm` y `accentWarmStrong` para destacar valor del plan premium.

- \*\*Panel Admin\*\*:
- Más denso y orientado a datos, pero manteniendo la misma paleta y tipografía.
- Uso intensivo de tablas y filtros.

\---

\## 8. Accesibilidad (reglas prácticas)

- Contraste mínimo:
- Texto principal vs fondo ≥ 4.5:1.
- Tamaño mínimo:
- 14 px para texto normal, 12 px solo para labels muy breves.
- Área clicable:
- Elementos interactivos ≥ 44x44 px.
- Focus visible:
- Outline claro de 2 px usando un tono derivado de `primarySoft`.
- Animaciones:
- Suaves, cortas, no esenciales para entender el contenido.
- Desactivables o reducidas en modo accesible.

\---

\## 9. Modo claro y oscuro

\### 9.1 Modo claro

- Fondo global: `bgBase`.
- Tarjetas y paneles: `bgElevated`.
- Texto: `textMain` / `textMuted`.
- Botones: `primary` para CTAs importantes.

\### 9.2 Modo oscuro (sugerido)

- Fondo global: gris muy oscuro suave (por ejemplo `#121212` o similar).
- Tarjetas: gris ligeramente más claro.
- Texto: blanco o gris muy claro.
- `primary` y `primaryAccent`: ajustar si es necesario para lograr buen contraste.
- Evitar negros y blancos puros; mantener sensación suave.

\---

\## 10. Uso con Claude (instrucciones sugeridas)

Ejemplo de prompt para Claude usando esta guía:

\> Usa el design system de Flowly definido en este archivo. Respeta:

\> - La paleta de colores y sus roles.

\> - Las fuentes (Nunito para títulos, Open Sans para texto, Inter para botones).

\> - Los tokens de espaciado, bordes y sombras.

\> - La estructura de app de productividad personal (dashboard + secciones: tareas, ideas, proyectos, cajas, admin).

\>

\> Genera el layout y los componentes de la pantalla `[NOMBRE\_DE\_LA\_PANTALLA]` para web (React + Tailwind/shadcn), siguiendo estos principios:

\> - Estética tranquila y natural.

\> - Poca carga cognitiva.

\> - Componentes reutilizables basados en tarjetas, botones y formularios definidos en la guía.

\---

\## 11. Resumen conceptual

Flowly ofrece una experiencia visual y emocional que combina productividad, claridad y serenidad.

Su diseño transmite equilibrio, naturaleza y fluidez, ayudando a organizar la vida digital sin estrés.

La interfaz actúa como un centro de mando integrado donde la estructura técnica (Laravel + React + Inertia) y la estética se alinean para sostener una productividad personal calmada.

\```
