# ClientKosmos – Guía de Estilos UI/UX (Unificada)

> Sistema de diseño para ClientKosmos, combinando “calma productiva” + tokens productivos y componentes listos para implementar.  
> Objetivo: que cualquier nueva pantalla mantenga coherencia visual, claridad y foco.

---

## 1. Principios de diseño

- **Calma productiva**: interfaz limpia, sin ruido visual, con 1–2 focos de color por pantalla.
- Propósito y claridad: color para significado, tamaño para jerarquía, espacio para agrupar contenido.
- Contexto siempre visible: cliente actual, vista, estado y acciones clave siempre a la vista.
- Consistencia: mismos tokens de color, tipografía, espaciado y componentes en toda la app (web + móvil).
- Accesibilidad: cumplir al menos WCAG AA (4.5:1 texto normal, 3:1 texto grande), nunca depender solo del color para indicar estado.
- Voz: cercana y profesional, en segunda persona (“tus clientes”, “tu día”), mensajes orientados a la acción y sin dramatismo.

---

## 2. Sistema de color

### 2.1. Colores primitivos

```txt
color.white      = #FDFCF9
color.black      = #050608

color.teal-50    = #E9F3F2
color.teal-100   = #C6E2DE
color.teal-400   = #2F8890
color.teal-600   = #17616B

color.sand-50    = #F8F1E7
color.sand-200   = #E2C9A6
color.brown-600  = #5C4630

gray.100         = #F3F4F6
gray.300         = #D1D5DB
gray.600         = #4B5563
gray.900         = #111827
```

> Los valores pueden ajustarse ligeramente para garantizar contraste AA (4.5:1).

### 2.2. Tokens semánticos – Light

```txt
bg.body        = #F7F6F2      // fondo general neutro y calmado
bg.surface     = #FFFFFF      // tarjetas, paneles principales
bg.surfaceAlt  = #F0EFEB      // superficies secundarias

border.subtle  = #E2E0DB
border.strong  = #C8C5BD

text.default   = #1A1816
text.secondary = #5C5A55
text.muted     = #8A8882
text.on-primary= #FFFFFF
```

Primario y acentos:

```txt
primary.default = #0E7C83
primary.hover   = #0A5E63
primary.active  = #084A4E
primary.soft    = #E6F5F6
primary.muted   = #B3DDE0
```

IA (Kosmo):

```txt
ai.surface = color.teal-100   // bloques IA / panel Kosmo
ai.border  = color.teal-400
```

Semánticos:

```txt
success.main = #2D8A4E
success.bg   = #E8F5EC
success.text = #1B5E33

warning.main = #C17A1A
warning.bg   = #FEF3E0
warning.text = #7A4D0E

danger.main  = #C13B4A
danger.bg    = #FDECEE
danger.text  = #8B1D2C

info.main    = #2B7AB5
info.bg      = #E8F1FA
info.text    = #1A4F7A
```

**Reglas de uso de color**

- ~70 % fondos neutros (bg.*, surface.*), ~25 % texto/bordes, ~5 % acentos.
- Máximo un color de acento “protagonista” por pantalla.
- Colores semánticos solo cuando haya un estado que comunicar (alertas, validaciones, estados de tareas).
- Nunca usar color solo como decoración: siempre acompañado por texto o icono.


### 2.3. Tokens semánticos – Dark

```css
[data-theme="dark"] {
  /* Fondos */
  --color-bg: #141311;
  --color-surface: #1C1B18;
  --color-surface-alt: #222120;
  --color-border: #333230;
  --color-border-strong: #4A4946;

  /* Texto */
  --color-text: #E5E4E2;
  --color-text-secondary: #A3A29E;
  --color-text-muted: #6B6A67;
  --color-text-on-primary: #FFFFFF;

  /* Primario */
  --color-primary: #3DA8B0;
  --color-primary-hover: #2B8F97;
  --color-primary-active: #1F7A82;
  --color-primary-soft: rgba(61, 168, 176, 0.12);
  --color-primary-muted: rgba(61, 168, 176, 0.25);

  /* Semánticos */
  --color-success: #5CB87A;
  --color-success-soft: rgba(92, 184, 122, 0.12);
  --color-success-text: #7DD49A;

  --color-warning: #E09A3A;
  --color-warning-soft: rgba(224, 154, 58, 0.12);
  --color-warning-text: #F0B058;

  --color-error: #E06070;
  --color-error-soft: rgba(224, 96, 112, 0.12);
  --color-error-text: #F08090;

  --color-info: #5A9FD4;
  --color-info-soft: rgba(90, 159, 212, 0.12);
  --color-info-text: #7AB5E0;
}
```

> En modo oscuro se mantiene la misma semántica: se cambia la intensidad, no el rol.

---

## 3. Tipografía

### 3.1. Familias

```txt
Display:  General Sans, system-ui, -apple-system, sans-serif
Body:     Inter, system-ui, -apple-system, sans-serif
Mono:     JetBrains Mono, "Courier New", monospace
```

Import sugerido:

```css
@import url('https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
```


### 3.2. Escala tipográfica

Base: `16px`, ratio 1.25.


| Token | Tamaño | Peso | Line height | Fuente | Uso |
| :-- | :-- | :-- | :-- | :-- | :-- |
| display-xl | 3rem | 700 | 1.15 | General Sans | Hero / claims principales |
| display | 2.25rem | 700 | 1.2 | General Sans | Títulos de página |
| heading-1 | 1.75rem | 600 | 1.25 | General Sans | Secciones principales |
| heading-2 | 1.375rem | 600 | 1.3 | General Sans | Subsecciones |
| heading-3 | 1.125rem | 600 | 1.35 | General Sans | Cards, bloques IA |
| body-lg | 1.125rem | 400 | 1.6 | Inter | Texto destacado |
| body | 1rem | 400 | 1.6 | Inter | Texto principal |
| body-sm | 0.875rem | 400 | 1.5 | Inter | Texto secundario |
| caption | 0.75rem | 500 | 1.5 | Inter | Metadatos, timestamps |
| code | 0.875rem | 400 | 1.6 | JetBrains Mono | Fragmentos técnicos |

Mapeo con nombres de la app:

```txt
text.display → display-xl
text.h1      → heading-1
text.h2      → heading-2
text.h3      → heading-3
text.body    → body
text.caption → caption
```

**Reglas tipográficas**

- Máximo 3 tamaños por pantalla (título, subtítulo, cuerpo).
- Alineación siempre a la izquierda; evitar texto justificado.
- Contenedores de texto: `max-width: 65ch` (45–75 caracteres por línea).
- Mayúsculas sostenidas solo en pequeñas etiquetas (badges/chips), con `letter-spacing: 0.05em`.
- Peso: 400 para cuerpo, 500 para énfasis sutil, 600 para headings, 700 solo en display.

---

## 4. Espaciado, layout y grid

### 4.1. Escala de espaciado

Base: 4 px.

```txt
space.1   = 4px   (0.25rem)
space.2   = 8px   (0.5rem)
space.3   = 12px  (0.75rem)
space.4   = 16px  (1rem)
space.5   = 20px  (1.25rem)
space.6   = 24px  (1.5rem)
space.8   = 32px  (2rem)
space.10  = 40px  (2.5rem)
space.12  = 48px  (3rem)
space.16  = 64px  (4rem)
space.20  = 80px  (5rem)
space.24  = 96px  (6rem)
```

**Usos típicos**

- Padding interno de botones e inputs: space.2–space.3.
- Gap entre elementos dentro de una tarjeta: space.3–space.4.
- Separación entre tarjetas: ≥ padding interno de la tarjeta (si padding = 20px, gap ≥ 20px).
- Separación entre secciones: space.8–space.16 según jerarquía.


### 4.2. Layout y grid

**Layout general**

- Contenido centrado, `max-width: 1200px`.
- Dashboard / ficha de cliente:
    - Columna izquierda: navegación / contexto.
    - Columna central: tareas, ideas y contenido principal.
    - Columna derecha (opcional): IA contextual (Kosmo), detalles.

**Grid responsive**


| Viewport | Columnas | Gutter | Margen lateral |
| :-- | :-- | :-- | :-- |
| Mobile (<640px) | 4 | 16px | 16px |
| Tablet (640–1024) | 8 | 24px | 32px |
| Desktop (>1024) | 12 | 24px | max(48px, auto) |

Patrones:

- Sidebar + contenido: 3 + 9 columnas en desktop.
- 2 columnas equilibradas: 6 + 6.
- 3 tarjetas: 4 + 4 + 4 (máximo 4 por fila en desktop).
- En móvil y tablet las columnas se apilan por orden de importancia:

1. Contenido principal.
2. Navegación secundaria.
3. IA contextual.


### 4.3. Breakpoints

```txt
sm  = 640px
md  = 768px
lg  = 1024px
xl  = 1280px
2xl = 1536px
```

Estrategia:

- Mobile-first: estilos base para móvil, se amplían con `min-width`.
- Ajustar tipografías display a tamaños algo menores en mobile.
- Targets interactivos mínimo 40–44 px de alto en mobile.

---

## 5. Componentes UI

### 5.1. Botones

**Variantes**


| Variante | Fondo | Texto | Borde | Uso |
| :-- | :-- | :-- | :-- | :-- |
| primary | primary.default | text.on-primary | none | Acción principal |
| secondary | transparente | primary.default | border.subtle | Acciones secundarias |
| ghost | transparente | text.secondary | none | Acciones terciarias |
| danger | danger.main | \#FFFFFF | none | Acciones destructivas |

**Tamaños**


| Tamaño | Height | Padding X | Font | Border radius |
| :-- | :-- | :-- | :-- | :-- |
| sm | 32px | space.3 | body-sm | md (~10px) |
| md | 40px | space.4 | body | md (~10px) |
| lg | 48px | space.6 | body-lg | md (~10px) |

**Estados (primary)**

- Default: fondo `primary.default`, texto `text.on-primary`, sombra xs.
- Hover: fondo `primary.hover`, sombra sm, ligera elevación (`translateY(-1–2px)`).
- Active: fondo `primary.active`, sombra xs.
- Focus-visible: sin outline, ring 2 px `primary.muted` sobre `bg.body`.
- Disabled: `opacity: 0.5`, sin interacción.

**Texto**

- Siempre verbo + objeto (“Crear cliente”, “Guardar cambios”).
- Máximo 2–3 palabras.
- Nunca “Click aquí”.


### 5.2. Inputs y formularios

**Campo de texto**

- Height: 40 px (md), 32 px (sm), 48 px (lg).
- Padding: `0 space.3`.
- Fondo: `bg.surface`.
- Borde: `1px solid border.subtle`.
- Border-radius: md (~10 px).
- Placeholder: `text.muted`.

Estados:

- Focus: borde `primary.default`, ring 2 px `primary.muted`.
- Error: borde `danger.main`, mensaje en `danger.text`.
- Disabled: `opacity: 0.6`, sin sombra ni ring.

**Labels y mensajes**

- Label: `body-sm`, peso 500, `text.default`, margin-bottom `space.1`.
- Helper text: `caption`, `text.secondary`, margin-top `space.1`.
- Error message: `caption`, `danger.text`, margin-top `space.1`.

Estructura:

```txt
Label *
┌─────────────────────────────┐
│  Placeholder / valor        │
└─────────────────────────────┘
Helper text o mensaje de error
```

**Mensajes de error**

- Estructura: qué ha pasado + cómo solucionarlo.
    - Bien: “Añade una fecha límite para esta tarea.”
    - Mal: “Fecha inválida.”


### 5.3. Tarjetas (cards)

**Estilos base**

- Fondo: `bg.surface`.
- Borde: `1px solid border.subtle`.
- Border-radius: lg (~16 px).
- Padding: `space.5` (20 px) interno.
- Sombra: `shadow-sm` por defecto.

**Estructura**

- Header: `heading-3`, `text.default`, margin-bottom `space.3`.
- Meta: `caption`, `text.muted` (estado, fecha, etiquetas).
- Body: `body`, `text.secondary`.
- Footer: margin-top `space.4`, borde-top `1px solid border.subtle`.

**Interactividad**

- `card-interactive:hover`: `transform: translateY(-2px)` + `shadow-md`.

**Estados**

- Riesgo: borde `warning.main`, pequeño badge “Riesgo”.
- Atrasada: badge con color `danger` o `warning` según modelo.
- Completada: reducir contraste (`text.muted`) + icono de check en `success.main`.


### 5.4. IA contextual (Kosmo)

- Contenedor tipo card, pero:
    - Fondo: `ai.surface`.
    - Borde: `1px solid ai.border`.
    - Icono de Kosmo en una esquina (Lucide + marca propia).
- Título: `heading-3`.
- Contenido: 2–5 bullets accionables, centrados en “qué hacer ahora”.

Ejemplos de contenido:

- “Revisa hoy a estos 3 clientes en riesgo.”
- “Sugiero 2 acciones para cerrar esta oportunidad.”


### 5.5. Nudges y upgrade prompts

- Ubicación: solo donde la acción premium tiene sentido (llegar a límite de plan, uso intensivo de IA, muchos clientes).
- Estilo visual:
    - Fondo: `bg.surface`.
    - Borde: `1px solid primary.soft` (o `secondary` suave).
    - Icono sutil (p. ej. `sparkles`).
- Copy:
    - Línea 1 (beneficio): “Desbloquea clientes ilimitados.”
    - Línea 2 (contexto): “Ya has llegado al límite del plan gratuito.”
    - Botón primary: “Ver planes”.


### 5.6. Navegación, modales, toasts, tablas

**Navbar**

- Altura: 64 px.
- Fondo: `bg.surface`.
- Borde inferior: `1px solid border.subtle`.
- Links: `body-sm`, peso 500, `text.secondary`.
    - Hover: fondo `bg.surfaceAlt`, texto `text.default`.
    - Activo: texto `primary.default`.

**Modal**

- Overlay: fondo semitransparente (`rgba(0,0,0,0.4)`), `backdrop-filter: blur(4px)`.
- Modal:
    - Fondo: `bg.surface`.
    - Border-radius: xl (~24 px).
    - Padding: `space.8`.
    - Max-width: 480 px.
    - Sombra: `shadow-xl`.

**Toast / notificación**

- Card compacta:
    - Fondo: `bg.surface`.
    - Borde: `1px solid border.subtle`.
    - Border-left: 3 px del color semántico (`success.main`, `danger.main`, etc.).
    - Sombra: `shadow-lg`.
- Contenido:
    - Título: `heading-3` o `body`, en `text.default`.
    - Mensaje: `body-sm`, `text.secondary`.

**Tabla**

- `border-collapse: collapse`.
- Header:
    - `body-sm`, peso 500, `text.secondary`.
    - Padding `space.3 space.4`.
    - Borde inferior `border.strong`.
- Celdas:
    - `body-sm`, `text.default`.
    - Borde inferior `border.subtle`.
    - Hover fila: fondo `bg.surfaceAlt`.

---

## 6. Iconografía e ilustraciones

**Iconos**

- Librería: Lucide Icons.
- Tamaños: 16 px (inline), 20 px (botones/nav), 24 px (standalone).
- Grosor: stroke 1.5.
- Color: `currentColor` (hereda del texto).
- Espaciado con texto: `space.2` (8 px).

Convenciones básicas:

```txt
Añadir        → plus
Eliminar      → trash-2
Editar        → pencil
Buscar        → search
Cerrar        → x
Configuración → settings
Usuario       → user
Aviso         → alert-triangle
Éxito         → check-circle
Error         → alert-circle
Info          → info
```

**Ilustraciones**

- Usar solo en:
    - Landing.
    - Onboarding.
    - Empty states importantes.
- Estilo:
    - Simple, con acentos en `primary` y `secondary`.
    - Evitar fotografías genéricas de stock.

---

## 7. Movimiento y animación

**Principios**

1. Informativa, no decorativa.
2. Rápida y sutil (120–350 ms).
3. Respetar `prefers-reduced-motion`.

**Tokens**

```txt
duration.fast   = 120ms
duration.base   = 200ms
duration.slow   = 350ms
duration.slower = 500ms

ease.default    = cubic-bezier(0.4, 0, 0.2, 1)
ease.in         = cubic-bezier(0.4, 0, 1, 1)
ease.out        = cubic-bezier(0, 0, 0.2, 1)
ease.bounce     = cubic-bezier(0.34, 1.56, 0.64, 1)
```

Patrones:

- Hover en cards: ligera elevación + sombra (`translateY(-2px)`, `shadow-md`).
- Apertura de modales: `scale(0.95 → 1)` + fade-in.
- Apoyo a `prefers-reduced-motion`: reducir todas las duraciones a casi 0 para usuarios sensibles.

---

## 8. Accesibilidad

**Requisitos mínimos**

- Contraste texto cuerpo: ≥ 4.5:1.
- Contraste texto grande (18 px+): ≥ 3:1.
- Elementos UI clave: ≥ 3:1.
- Tamaño mínimo de fuente: 12 px (caption).
- Target interactivo: mínimo 40–44 px de alto en mobile.
- Focus visible en todos los elementos interactivos.

**Checklist**

- [ ] Todos los elementos interactivos tienen `:focus-visible` claro.
- [ ] Imágenes con `alt` descriptivo.
- [ ] Formularios con `label` asociado a cada `input`.
- [ ] Estados de color acompañados de icono o texto (“En riesgo”, “Atrasada”).
- [ ] Navegación posible solo con teclado.
- [ ] Modales capturan el foco, se cierran con Escape y botón claro.
- [ ] `prefers-reduced-motion` desactiva animaciones no esenciales.
- [ ] Enlaces distinguibles por algo más que color (subrayado o estilo diferente).
- [ ] Estructura correcta de headings (h1 > h2 > h3, sin saltos).
- [ ] Roles ARIA usados donde la semántica HTML no basta.

---

## 9. Implementación y tokens CSS de referencia

Ejemplo de `:root` con tokens básicos:

```css
:root {
  /* Colores */
  --color-bg: #F7F6F2;
  --color-surface: #FFFFFF;
  --color-surface-alt: #F0EFEB;
  --color-border: #E2E0DB;
  --color-border-strong: #C8C5BD;

  --color-text: #1A1816;
  --color-text-secondary: #5C5A55;
  --color-text-muted: #8A8882;
  --color-text-on-primary: #FFFFFF;

  --color-primary: #0E7C83;
  --color-primary-hover: #0A5E63;
  --color-primary-active: #084A4E;
  --color-primary-soft: #E6F5F6;
  --color-primary-muted: #B3DDE0;

  --color-success: #2D8A4E;
  --color-success-soft: #E8F5EC;
  --color-success-text: #1B5E33;
  --color-warning: #C17A1A;
  --color-warning-soft: #FEF3E0;
  --color-warning-text: #7A4D0E;
  --color-danger: #C13B4A;
  --color-danger-soft: #FDECEE;
  --color-danger-text: #8B1D2C;
  --color-info: #2B7AB5;
  --color-info-soft: #E8F1FA;
  --color-info-text: #1A4F7A;

  /* IA */
  --color-ai-surface: #C6E2DE;
  --color-ai-border: #2F8890;

  /* Tipografía */
  --font-display: "General Sans", system-ui, -apple-system, sans-serif;
  --font-body: "Inter", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", "Courier New", monospace;

  --text-display-xl: 700 3rem/1.15 var(--font-display);
  --text-display:    700 2.25rem/1.2 var(--font-display);
  --text-h1:         600 1.75rem/1.25 var(--font-display);
  --text-h2:         600 1.375rem/1.3 var(--font-display);
  --text-h3:         600 1.125rem/1.35 var(--font-display);
  --text-body-lg:    400 1.125rem/1.6 var(--font-body);
  --text-body:       400 1rem/1.6 var(--font-body);
  --text-body-sm:    400 0.875rem/1.5 var(--font-body);
  --text-caption:    500 0.75rem/1.5 var(--font-body);

  /* Espaciado */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  /* Bordes */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* Sombras */
  --shadow-xs: 0 1px 2px rgba(26, 24, 22, 0.04);
  --shadow-sm: 0 2px 4px rgba(26, 24, 22, 0.06);
  --shadow-md: 0 4px 12px rgba(26, 24, 22, 0.08);
  --shadow-lg: 0 8px 24px rgba(26, 24, 22, 0.10);
  --shadow-xl: 0 16px 48px rgba(26, 24, 22, 0.12);

  /* Motion */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast: 120ms;
  --duration-base: 200ms;
  --duration-slow: 350ms;
  --duration-slower: 500ms;

  /* Z-index */
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-modal: 400;
  --z-toast: 500;
  --z-tooltip: 600;
}
```


---

