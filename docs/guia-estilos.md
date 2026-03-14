# Flowly Reducido — Guía de Estilos y Design System

> Referencia completa y prescriptiva del sistema de diseño de Flowly Reducido.
> Este documento define **qué usar, cuándo usarlo y cuándo NO**.
> Cada token, componente y patrón está verificado contra WCAG 2.2 AA.

---

## 1. Identidad Visual

### Concepto: Calma Productiva

Flowly transmite **calma productiva**: una estética natural y orgánica (tonos verdes y crema) que evita la agresividad visual de las apps de productividad típicas. La paleta evoca tranquilidad y enfoque.

### Principios de Diseño

Estos 5 principios guían TODA decisión visual en Flowly. Ante cualquier duda de diseño, vuelve a ellos:

1. **Una acción por pantalla** — cada vista tiene un propósito principal claro; el resto es secundario o está oculto.
2. **El espacio vacío es intencional** — el whitespace dirige la atención, no es espacio desperdiciado.
3. **Revelar complejidad solo bajo demanda** — progressive disclosure: los detalles aparecen al interactuar, no al cargar.
4. **El color comunica función, no decora** — el verde primario solo aparece en acciones importantes; el color de warning solo en deadlines cercanos.
5. **Menos opciones = decisiones más rápidas** — Hick's Law: cada opción extra añade carga cognitiva.

### Voz del Producto

Flowly habla como un **compañero competente y tranquilo**: no es un coach motivacional, no es un robot. Sabe qué necesitas y te lo dice sin rodeos.

| Contexto | ❌ Genérico | ✅ Flowly |
|----------|------------|----------|
| Empty state (sin clientes) | "No hay datos" | "Aquí vivirán tus clientes. Añade el primero y Flowly recordará todo por ti." |
| Botón de IA | "Generar" | "Preparar update" |
| Tarea completada | "Completada" | "Hecho ✓" |
| Panel Hoy vacío | "Sin tareas para hoy" | "Día limpio. Buen momento para revisar notas o descansar." |
| Error de formulario | "Campo requerido" | "¿Cómo se llama tu cliente?" |
| Upgrade modal (2º cliente) | "Mejora tu plan" | "Para gestionar varios clientes a la vez, pasa a Solo." |
| Upgrade modal (IA) | "Feature premium" | "La IA freelancer está en el plan Solo." |

### Logo
- Archivo: `resources/js/assets/logo.png`
- Uso: sidebar (compacto y expandido), landing page, pantallas de autenticación
- Tamaño mínimo: 32×32px

---

## 2. Paleta de Colores

### Modo Claro

| Token | Valor Hex | Nombre | Uso | Contraste verificado |
|-------|-----------|--------|-----|---------------------|
| **Primary** | `#3A5A40` | Verde bosque | Botones principales, acciones clave | 6.41:1 vs Background ✅, 7.73:1 vs blanco ✅ |
| **Background** | `#E9EDC9` | Crema pálido | Fondo de toda la app | — |
| **Card** | `#DAD7CD` | Beige cálido | Tarjetas, superficies elevadas | 8.77:1 vs Foreground ✅ |
| **Muted** | `#CAD2C5` | Gris verdoso | Secciones secundarias, fondos suaves | 8.14:1 vs Foreground ✅ |
| **Foreground** | `#333333` | Gris oscuro | Texto principal | 10.48:1 vs Background ✅ |
| **Ring** | `#6B8F5E` | Verde medio | Anillos de foco (focus) | 3.05:1 vs Background ✅ |
| **Warning** | `#8B6914` | Ámbar oscuro | Deadlines cercanos, clientes en riesgo | 3.53:1 vs Card ✅, 4.22:1 vs Background ✅ |
| **AI Surface** | `#D8E2C5` | Verde crema | Fondo exclusivo de outputs de IA | 9.39:1 vs Foreground ✅ |
| **Destructive** | `oklch(0.577 0.245 27.325)` | Rojo | Solo para eliminar entidades | — |
| **Border** | `oklch(0.922 0.016 155.826)` | Verde grisáceo | Bordes de componentes | — |
| **Accent** | `oklch(0.967 0.001 286.375)` | Gris neutro | Hover/selección en listas | — |

> **⚠️ Cambio vs. versión anterior:** Ring pasa de `#A1B285` a `#6B8F5E`. El anterior tenía ratio de 1.89:1 contra Background — **fallaba WCAG 2.2** para indicadores de foco (mínimo 3:1).

### Modo Oscuro

| Token | Valor Hex | Nombre | Uso |
|-------|-----------|--------|-----|
| **Primary** | `#6b9b73` | Verde claro | Botones, acciones clave (5.27:1 vs Background ✅) |
| **Background** | `#1a1e1b` | Negro verdoso | Fondo de toda la app |
| **Card** | `#242924` | Oscuro con tinte verde | Tarjetas (14.81:1 vs Foreground ✅) |
| **Muted** | `#2e342f` | Gris oscuro verdoso | Secciones secundarias |
| **Foreground** | `#ffffff` | Blanco | Texto principal |
| **Ring** | `#6b9b73` | Verde claro | Anillos de foco (5.27:1 vs Background ✅) |
| **Warning** | `#D4A017` | Ámbar claro | Deadlines cercanos (6.24:1 vs Card ✅) |
| **AI Surface** | `#1E2A1F` | Verde oscuro profundo | Fondo de outputs IA (14.93:1 vs Foreground ✅) |

### Tokens de Sidebar

El sidebar hereda de la paleta principal pero se puede ajustar independientemente:
- `--sidebar-background`, `--sidebar-foreground`
- `--sidebar-primary`, `--sidebar-accent`, `--sidebar-border`, `--sidebar-ring`

### Reglas de Uso del Color

**Primary (#3A5A40 / #6b9b73):**
- ✅ Botones de acción principal (crear cliente, completar tarea, "Preparar update")
- ✅ Títulos de sección activos
- ✅ Iconos interactivos activos
- ❌ NO para texto de cuerpo (usar Foreground)
- ❌ NO para fondos amplios (es un color de acento, no de superficie)
- ❌ NO para más de 2 elementos simultáneos en pantalla — si todo es verde, nada destaca

**Warning (#8B6914 / #D4A017):**
- ✅ Borde izquierdo de tarjeta de cliente en riesgo
- ✅ Badge "urgente" o "deadline cercano"
- ✅ Dot pulsante en panel Hoy para clientes que requieren atención
- ❌ NO como fondo completo de tarjeta
- ❌ NO para texto de cuerpo
- ❌ NO mezclado con Destructive en la misma vista

**AI Surface (#D8E2C5 / #1E2A1F):**
- ✅ Fondo de la tarjeta de output IA (resumen de cliente, update generado, plan del día)
- ✅ Combinado con borde izquierdo Primary de 4px
- ❌ NO para tarjetas normales (usar Card)
- ❌ NO para formularios

**Destructive:**
- ✅ Solo para eliminar entidades (cliente, tarea, nota)
- ❌ NO para warnings ni urgencias (usar Warning)
- ❌ NO para texto informativo

---

## 3. Tipografía

### Familias Tipográficas

| Familia | Uso | Pesos | CDN |
|---------|-----|-------|-----|
| **Nunito** | Encabezados (h1, h2, h3) | 600, 700, 800 | bunny.net |
| **Inter** | Cuerpo de texto, botones, labels, UI | 400, 500, 600 | bunny.net |

> **⚠️ Cambio vs. versión anterior:** Open Sans se elimina. Reducir de 3 familias a 2 mejora la cohesión visual y reduce requests HTTP. Inter cubre tanto body como UI; Nunito aporta la calidez en headings.

### Escala Tipográfica

| Nivel | Familia | Peso | Tamaño | Line-height | Uso |
|-------|---------|------|--------|-------------|-----|
| **Display** | Nunito | 800 | 2rem (32px) | 1.2 | Títulos de pantalla: "Hoy", "Mis Clientes" |
| **H2** | Nunito | 700 | 1.5rem (24px) | 1.3 | Secciones: "Tareas críticas", "Clientes en riesgo" |
| **H3** | Nunito | 600 | 1.25rem (20px) | 1.4 | Subsecciones: nombre de cliente en lista |
| **Body** | Inter | 400 | 1rem (16px) | 1.6 | Descripciones, resúmenes IA, notas |
| **Body strong** | Inter | 600 | 1rem (16px) | 1.6 | Énfasis en texto, labels activos |
| **UI** | Inter | 500 | 0.875rem (14px) | 1.5 | Botones, badges, metadatos de tarjeta |
| **Caption** | Inter | 400 | 0.75rem (12px) | 1.4 | Fechas, contadores, texto secundario |

### Aplicación en CSS

```css
h1, h2, h3       { font-family: 'Nunito', sans-serif; }
body, p, span     { font-family: 'Inter', sans-serif; }
button, label, input, select, .ui-text { font-family: 'Inter', sans-serif; }
```

### Carga de Fuentes

Las fuentes se cargan desde **bunny.net** (alternativa GDPR-friendly) en `resources/views/app.blade.php`:

```html
<link rel="preconnect" href="https://fonts.bunny.net">
<link href="https://fonts.bunny.net/css?family=nunito:600,700,800|inter:400,500,600" rel="stylesheet" />
```

---

## 4. Espaciado

### Sistema de 8 Puntos

Todo el espaciado se basa en múltiplos de 8px para crear ritmo vertical consistente:

| Token Tailwind | Valor | Uso |
|----------------|-------|-----|
| `gap-1` / `p-1` | 4px | Micro-separación: icono + label inline |
| `gap-2` / `p-2` | 8px | Separación mínima entre elementos relacionados |
| `gap-3` / `p-3` | 12px | Padding interno de badges y chips |
| `gap-4` / `p-4` | 16px | Padding interno de tarjetas estándar |
| `gap-6` / `p-6` | 24px | Separación entre bloques lógicos dentro de una sección |
| `gap-8` / `p-8` | 32px | Separación entre secciones principales |
| `gap-12` / `p-12` | 48px | Breathing room entre áreas grandes de pantalla |

### Reglas de Espaciado

- **Tarjetas**: siempre `p-4` (16px) o `p-6` (24px) de padding interno
- **Entre tarjetas de la misma lista**: `gap-3` (12px)
- **Entre secciones del dashboard**: `gap-8` (32px)
- **Formularios**: `space-y-4` (16px) entre campos
- **Dentro de la ficha de cliente entre bloques**: `gap-6` (24px)

### Proporción Contenido vs. Vacío

En el dashboard, el contenido (tarjetas + resúmenes) no debe ocupar más del **60% del viewport**. El 40% restante es whitespace intencional que comunica: "esto es todo lo que necesitas ver".

---

## 5. Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-lg` | `1rem` (16px) | Tarjetas grandes, modales, ficha de cliente |
| `--radius-md` | `0.625rem` (10px) | Botones, inputs, selects |
| `--radius-sm` | `0.375rem` (6px) | Badges, chips, dots de estado |

### Regla

- `rounded-lg` (16px) **solo** en tarjetas principales y modales
- `rounded-md` (10px) en **todo lo demás** interactivo
- `rounded-sm` (6px) solo en badges y chips pequeños
- **Nunca** `rounded-full` excepto en avatares y dots de estado

---

## 6. Sombras

| Clase | Uso |
|-------|-----|
| `shadow-sm` | Tarjetas en reposo (elevación sutil sobre fondo crema) |
| `shadow-md` | Tarjetas en hover o en foco |
| `shadow-lg` | Modales y overlays |
| Sin sombra | Elementos dentro de tarjetas (no anidar sombras) |

### Regla

- Máximo **un nivel de sombra** por vista. Si una tarjeta tiene `shadow-sm`, los elementos dentro NO tienen sombra.
- En modo oscuro, las sombras son menos visibles. Usar `border` como complemento para separar superficies.

---

## 7. Componentes UI

### Base: shadcn/ui

Flowly Reducido utiliza un subconjunto de shadcn/ui (basados en Radix UI + Tailwind CSS):

**Layout:** Card, Sidebar, Sheet, Breadcrumb
**Entrada:** Input, Label, Textarea, Checkbox, Select
**Feedback:** Badge, Alert, AlertDialog, Skeleton, Spinner
**Navegación:** DropdownMenu, Tooltip, Collapsible
**Overlay:** Dialog, ScrollArea, Separator

> **⚠️ Componentes eliminados de la versión anterior:** InputOTP, Toggle, ToggleGroup, NavigationMenu, Avatar. No se usan en el Flowly reducido.

### Componentes Custom — Mantenidos

| Componente | Archivo | Propósito |
|-----------|---------|-----------|
| AppSidebar | `components/app-sidebar.tsx` | Sidebar principal con 4 items + settings |
| NavMain | `components/nav-main.tsx` | Items de navegación |
| Heading | `components/heading.tsx` | Encabezado reutilizable con descripción |
| InputError | `components/input-error.tsx` | Display de errores de formulario |
| AppearanceTabs | `components/appearance-tabs.tsx` | Selector de tema |

### Componentes Custom — Nuevos

| Componente | Archivo | Propósito |
|-----------|---------|-----------|
| ClientCard | `components/client-card.tsx` | Tarjeta de cliente en lista (nombre, estado, deadline, dot color) |
| TodayPanel | `components/today-panel.tsx` | Panel con 3–5 acciones priorizadas del día |
| AiOutputCard | `components/ai-output-card.tsx` | Tarjeta con fondo AI Surface, borde izquierdo Primary, botón "Copiar" |
| ClientTimeline | `components/client-timeline.tsx` | Timeline de últimas tareas + próximos hitos dentro de ficha |
| RiskBadge | `components/risk-badge.tsx` | Badge con color Warning para clientes con deadline cercano |

### Componentes Custom — Eliminados

| Componente | Razón |
|-----------|-------|
| VoiceRecorder | Voz deja de ser feature estrella; si se implementa, se integra en formulario de tarea |
| TutorialChatbot | Se simplifica a un onboarding más básico (empty states bien diseñados + 3 tooltips) |

---

## 8. Patrones de UI

### Tarjeta de Cliente (ClientCard)

```
+----------------------------------------------+
| 🟢 Acme Corp                    ⏱ 24 mar   |
| Rediseño web · 3 tareas pendientes           |
|                          [Ver contexto →]     |
+----------------------------------------------+
```

- Dot izquierdo: verde (ok), ámbar (riesgo), rojo (atrasado)
- Nombre del cliente: H3 (Nunito 600, 20px)
- Metadata: UI (Inter 500, 14px, muted-foreground)
- Botón: solo texto + flecha, no botón con borde

### Tarjeta de Output IA (AiOutputCard)

```
+--+-------------------------------------------+
|  | Resumen generado por Flowly               |
|  |                                           |
|  | "Para Acme: estás en el rediseño web,     |
|  | se entregó el home, falta landing..."     |
|  |                                           |
|  |                      [📋 Copiar] [✏ Editar]|
+--+-------------------------------------------+
 ↑ borde izquierdo 4px Primary
   fondo: AI Surface
```

- Fondo: `--ai-surface` (diferente de Card)
- Borde izquierdo: 4px `--primary`
- Texto del output: Body (Inter 400, 16px)
- Botones: UI (Inter 500, 14px), iconos Lucide 16px

### Panel "Hoy" (TodayPanel)

```
Hoy deberías hacer esto:

┌─ 🟡 Acme Corp ──────────────────────────┐
│  □ Entregar landing page        24 mar   │
│  □ Revisar feedback mobile      25 mar   │
└──────────────────────────────────────────┘

┌─ 🟢 Beta Studio ────────────────────────┐
│  □ Enviar propuesta fase 2      26 mar   │
└──────────────────────────────────────────┘

[🤖 Planifica mi día]  ← solo Premium
```

- Máximo 5 tareas visibles. Si hay más, mostrar "y 3 más..." con link
- Agrupadas por cliente, con dot de estado
- Botón IA al final, alineado a la derecha

### Ficha de Cliente — Progressive Disclosure

**Nivel 1 — Vista inicial (sin clic):**
- Nombre, estado, próximo deadline
- 1 línea de resumen IA (si existe)
- Acciones: "Preparar update", "Editar"

**Nivel 2 — Expandido (1 clic en sección):**
- Timeline: últimas 5 tareas + próximos 3 hitos
- Tareas pendientes
- Recursos (links, briefs)
- Notas vinculadas

**Nivel 3 — Edición (2 clics):**
- Tono de marca, scope del servicio, links clave, notas generales

### Empty States

Cada empty state responde 3 preguntas:

1. **Qué** es este espacio
2. **Por qué** importa
3. **Qué hacer ahora** (CTA claro)

| Pantalla | Mensaje | CTA |
|----------|---------|-----|
| Sin clientes | "Aquí vivirán tus clientes. Añade el primero y Flowly recordará todo por ti." | "+ Añadir cliente" |
| Sin tareas | "Ninguna tarea pendiente. ¿Buen momento para planificar la semana?" | "+ Nueva tarea" |
| Sin notas | "Las notas rápidas van aquí. Vincula cada una a un cliente para no perder contexto." | "+ Nueva nota" |
| Dashboard sin datos | "Tu día empieza cuando añadas tu primer cliente y sus tareas." | "Ir a Clientes →" |

### Formularios

- **Crear tarea** — visible siempre: título + cliente (2 campos). Al expandir: fecha, prioridad, notas
- **Crear cliente** — visible siempre: nombre + color. Al expandir: servicio, tono, links, deadline
- Errores inline bajo cada campo (`InputError`)
- Botón submit con estado de carga (disabled + spinner)
- Validación server-side via Form Requests de Laravel

### Navegación Premium

- Items premium visibles pero deshabilitados para free users
- Al hacer clic en feature premium → modal de upgrade con copy específico (ver tabla en sección 1)
- Badge "Solo" en sidebar junto a items premium

---

## 9. Animaciones

### Animaciones Funcionales — MANTENER

| Animación | Duración | Easing | Uso |
|-----------|----------|--------|-----|
| `fade-in` | 300ms | ease-out | Aparición de tarjetas al cargar página |
| `fade-in-up` | 300ms | ease-out | Aparición de items de lista, staggered |
| `scale-in` | 250ms | ease-out | Aparición de modales y dialogs |
| `hover-lift` | 200ms | ease | Tarjetas al hacer hover (translateY -2px + shadow-md) |
| `shimmer` | 2s linear infinite | — | Skeleton loading mientras carga IA |
| `typewriter` | variable | — | Revelado de texto en outputs de IA |

### Variantes con Delay (para stagger en listas)

```css
.animate-fade-in-up-delay-1  /* 100ms delay */
.animate-fade-in-up-delay-2  /* 200ms delay */
.animate-fade-in-up-delay-3  /* 300ms delay */
```

Máximo 3 niveles de delay. No usar más de 300ms de delay total.

### Animaciones Decorativas — SOLO LANDING PAGE

Estas animaciones **no se usan dentro de la app** autenticada:

| Animación | Uso permitido |
|-----------|---------------|
| `float` / `float-delayed` | Solo landing page (hero) |
| `bounce-subtle` | Solo landing page |
| `glow-pulse` | Solo landing page |
| `gradient-shift` | Solo landing page |
| `orb-float-1` / `orb-float-2` | Solo landing page (hero background) |
| `shine` | Solo landing page (CTA button) |

### Microinteracción Nueva — Completar Tarea

Al completar una tarea:
1. Checkbox tick con `scale-in` (250ms)
2. Texto de la tarea hace `opacity 1 → 0.5` (200ms)
3. Tarjeta se reduce ligeramente `scale(0.98)` y hace `fade-out` (300ms, delay 500ms)
4. El contador del cliente se actualiza con un micro-bounce

### Microinteracción Nueva — Output IA Generado

Al generar un update/resumen:
1. Shimmer skeleton durante la carga
2. Al recibir: tarjeta aparece con `scale-in` + texto con efecto `typewriter`
3. Botón "Copiar" aparece con `fade-in` (200ms, delay = fin del typewriter)

### Transiciones Estandarizadas

```css
:root {
  --transition-quick:  150ms ease-out;  /* hover, toggles, tooltips */
  --transition-medium: 250ms ease-out;  /* tarjetas, expansión de secciones */
  --transition-slow:   400ms ease-out;  /* modales, cambio de pantalla */
}
```

### Regla de Oro

- Animaciones dentro de la app: **máximo 300ms** para elementos pequeños, **máximo 500ms** para modales
- Si una animación no comunica un cambio de estado (creado, completado, error, cargando), **no debería existir**
- `prefers-reduced-motion: reduce` → desactivar todas las animaciones excepto transiciones de opacidad

---

## 10. Efectos Especiales

### Glassmorphism — SOLO para outputs IA

```css
.glass         /* backdrop-blur-md + bg white/10 + border white/20 */
.glass-strong  /* backdrop-blur-xl + bg white/15 + border white/30 */
```

> **⚠️ Restricción:** Glassmorphism se usa ÚNICAMENTE en la tarjeta de output IA (`AiOutputCard`) como parte del signature visual de Flowly. No usar en tarjetas normales, modales ni sidebar.

### Glow — SOLO para CTA principal

```css
.glow-primary     /* box-shadow verde suave */
.glow-primary-lg  /* box-shadow verde más intenso */
```

Uso permitido: botón "Preparar update" y CTA de upgrade. Nada más.

### Hover Lift

```css
.hover-lift  /* translateY(-2px) + shadow-md en hover, transición 200ms */
```

Uso: todas las tarjetas interactivas (ClientCard, tarjetas del panel Hoy). No usar en botones (los botones usan `opacity` o `brightness` en hover, no lift).

---

## 11. Modo Oscuro

### Implementación
- **Detección**: `prefers-color-scheme: dark` del sistema operativo
- **Persistencia**: localStorage + cookie para SSR (evita flash)
- **Aplicación**: Clase `.dark` en `<html>`
- **Modos**: `light`, `dark`, `system`
- **Hook**: `useAppearance()` en `resources/js/hooks/use-appearance.tsx`

### Transición Anti-Flash

El fondo del body se define inline en `app.blade.php` antes de que cargue CSS:
- Claro: `#E9EDC9`
- Oscuro: `#1a1e1b`

### Regla para Nuevos Componentes

Todo componente nuevo **debe** verificarse en ambos modos antes de merge. Checklist:
- [ ] Texto legible sobre su fondo (≥4.5:1)
- [ ] Bordes visibles (si existen)
- [ ] Iconos con suficiente contraste
- [ ] Focus ring visible (≥3:1)
- [ ] AI Surface usa el token correcto para cada modo

---

## 12. Layouts

### App Layout (autenticado) — 4 Pantallas

```
+------------------+----------------------------------+
| Sidebar          | App Header (breadcrumbs)         |
| - Logo           +----------------------------------+
| - Hoy            | Content Area                     |
| - Clientes       | (max-width: 1024px, centrado)    |
| - Tareas         |                                  |
| - Notas          |                                  |
| ──────────       |                                  |
| - Ajustes        |                                  |
| - Plan           |                                  |
+------------------+----------------------------------+
```

- Sidebar: 4 items principales + separador + 2 items secundarios
- Content area: **max-width 1024px**, centrado horizontalmente con padding lateral
- Breadcrumbs: solo el nivel actual (no breadcrumb chain completa)

### Auth Layout (no autenticado)

```
+------------------------------------------+
|            Centered Card                  |
|  +------------------------------------+  |
|  |  Logo                              |  |
|  |  Form (login/register/etc)         |  |
|  +------------------------------------+  |
+------------------------------------------+
```

Fondo: Background (#E9EDC9). Sin animaciones decorativas.

### Landing Page (welcome.tsx)

- Hero con orbs animados de fondo
- Header responsive con menú móvil
- Secciones: Hero, Features, Preview interactivo, Pricing, Footer
- Aquí SÍ se usan todas las animaciones decorativas

---

## 13. Iconos

**Librería**: Lucide React v0.475

### Tamaños Estandarizados

| Contexto | Tamaño | Clase |
|----------|--------|-------|
| Dentro de botón (junto a texto) | 16px | `w-4 h-4` |
| Sidebar navigation | 20px | `w-5 h-5` |
| Stat cards / features | 24px | `w-6 h-6` |
| Empty states | 48px | `w-12 h-12` |

### Regla

- Un icono siempre acompaña texto o tiene `aria-label`. Nunca un icono solo sin contexto accesible.
- Color: `text-muted-foreground` en reposo, `text-primary` cuando es accionable o activo.

---

## 14. Responsive Design

- **Mobile-first** con breakpoints de Tailwind
- Sidebar colapsable en pantallas pequeñas (Sheet overlay)
- Grid responsive: 1 col (mobile) → 2 col (tablet) → 3 col (desktop)
- Formularios de ancho completo en mobile
- Panel "Hoy": stack vertical en mobile, sin cambios funcionales
- Ficha de cliente: timeline y recursos apilados en mobile

### Breakpoints de Referencia

| Breakpoint | Valor | Cambio |
|-----------|-------|--------|
| `sm` | 640px | Formularios pasan de full-width a max-width |
| `md` | 768px | Grid 2 columnas para tarjetas de cliente |
| `lg` | 1024px | Sidebar visible por defecto; grid 3 columnas |
| `xl` | 1280px | Content area max-width con padding lateral extra |

---

## 15. Accesibilidad

### Requisitos Obligatorios

- Contraste mínimo texto normal: **4.5:1** (WCAG 2.2 AA)
- Contraste mínimo texto grande (≥24px o ≥18.66px bold): **3:1**
- Contraste mínimo componentes UI y gráficos: **3:1**
- Focus ring visible: **3:1** contra fondo adyacente (verificado con `#6B8F5E`)

### Implementación

- ARIA labels en botones de icono y tooltips
- Roles semánticos (Radix UI los provee por defecto)
- Texto para screen readers (`sr-only`) en iconos sin label visible
- Navegación completa por teclado (Tab, Enter, Escape)
- `prefers-reduced-motion`: respetado — desactiva animaciones
- Elementos de formulario con `<label>` asociado via `htmlFor`

---

## 16. Referencia Rápida de Clases

### Colores más usados

```
bg-primary text-primary-foreground       /* Botones principales */
bg-card text-card-foreground             /* Tarjetas estándar */
bg-muted text-muted-foreground           /* Secciones secundarias, captions */
bg-destructive text-destructive-foreground /* Solo eliminar */
bg-accent text-accent-foreground         /* Hover/selección en listas */
```

### Tokens nuevos (definir en app.css)

```css
/* Modo claro */
:root {
  --warning: #8B6914;
  --warning-foreground: #ffffff;
  --ai-surface: #D8E2C5;
  --ai-border: #3A5A40 / 0.2;
  --ring: #6B8F5E;  /* ACTUALIZADO */
}

/* Modo oscuro */
.dark {
  --warning: #D4A017;
  --warning-foreground: #1a1e1b;
  --ai-surface: #1E2A1F;
  --ai-border: #6b9b73 / 0.3;
  --ring: #6b9b73;
}
```

### Espaciado común

```
p-4 / p-6          /* Padding de tarjetas */
gap-3              /* Entre tarjetas en lista */
gap-6              /* Entre bloques dentro de sección */
gap-8              /* Entre secciones principales */
space-y-4          /* Espaciado vertical en formularios */
```

### Bordes

```
rounded-lg          /* 16px - tarjetas grandes, modales */
rounded-md          /* 10px - botones, inputs */
rounded-sm          /* 6px - badges */
border border-border /* Borde estándar */
```

### Transiciones

```
transition-all duration-150 ease-out     /* --transition-quick: hover */
transition-all duration-250 ease-out     /* --transition-medium: expansión */
transition-all duration-400 ease-out     /* --transition-slow: modales */
```

---

## 17. Signature Detail: La Tarjeta de Output IA

El **elemento visual firma** de Flowly es la tarjeta que muestra los outputs de IA (resúmenes, updates, planificación). Este diseño no se consigue instalando una librería — es propio de Flowly:

- Fondo: `--ai-surface` (verde crema sutil, diferente de Card)
- Borde izquierdo: **4px sólido** en `--primary`
- Efecto: `glass` (backdrop-blur sutil)
- Texto: aparece con efecto typewriter
- Botón "Copiar": prominente, con icono 📋, feedback visual al copiar (checkmark 2s)

Cada vez que un freelancer vea esta tarjeta, debe asociarla con Flowly.

---

## 18. Checklist de Diseño por Pantalla

Antes de implementar o modificar cualquier pantalla, verificar:

- [ ] ¿Hay **una acción principal** clara? Si hay 2 botones compitiendo, uno sobra
- [ ] ¿El whitespace es **intencional**? Cada área vacía tiene propósito
- [ ] ¿El microcopy tiene **voz Flowly**? Si suena genérico, reescribirlo
- [ ] ¿El contraste cumple WCAG AA? (4.5:1 texto, 3:1 UI components, 3:1 focus)
- [ ] ¿Las animaciones son ≤300ms (elementos) o ≤500ms (modales)?
- [ ] ¿Se puede usar **sin tocar la navegación**? El dashboard es autocontenido
- [ ] ¿El empty state guía hacia la **primera acción**?
- [ ] ¿Hay **progressive disclosure**? Si veo >5 campos a la vez, algo sobra
- [ ] ¿Funciona en **modo oscuro**? Verificado visualmente
- [ ] ¿Funciona en **mobile** (≤640px)? Elementos apilados, touch targets ≥44px
