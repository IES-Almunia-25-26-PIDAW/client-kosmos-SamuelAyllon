# ClientKosmos — Design System v1.0

> **Workspace operativo de consulta** para profesionales autónomos de servicios.
> "Entra en cada sesión con el contexto listo, sal con el cobro encaminado y mantén todo lo legal bajo control."

**Stack:** Laravel + React + Inertia.js
**IA integrada:** Kosmo
**Fecha:** Abril 2026

---

## Tabla de contenidos

1. [Design Tokens](#1-design-tokens)
2. [Componentes Base](#2-componentes-base)
3. [Arquitectura de Pantallas](#3-arquitectura-de-pantallas)
4. [Flujos de Navegación](#4-flujos-de-navegación)
5. [Contenido por Pantalla (detallado)](#5-contenido-por-pantalla-detallado)
6. [Tokens CSS Finales](#6-tokens-css-finales)

---

# 1. Design Tokens

## 1.1 Principios de diseño visual

ClientKosmos transmite **calma, confianza y claridad** sin caer en estética clínica fría. El entorno visual es cálido, profesional y humano — un espacio donde una psicóloga se siente acompañada, no evaluada.

- **Restraint:** un acento + neutros. Cada color codifica significado.
- **Accesibilidad:** WCAG AA obligatorio (4.5:1 body, 3:1 texto grande).
- **Calidez:** superficies beige/crema, nunca blanco puro ni gris frío.
- **Sin decoración gratuita:** la tipografía, el espacio y la jerarquía hacen el trabajo.

---

## 1.2 Paleta de color

### Filosofía

El acento primario parte de un **teal/verde azulado cálido** — evoca equilibrio y serenidad sin ser médico-clínico. Los neutros son cálidos (beige, arena) para crear un entorno acogedor. Los semánticos son reconocibles universalmente.

### Light Mode

| Rol | Token CSS | Hex | Uso |
|---|---|---|---|
| **Primary** | `--color-primary` | `#1A7B6E` | CTAs, enlaces, elementos interactivos activos |
| **Primary hover** | `--color-primary-hover` | `#135E54` | Hover sobre elementos primarios |
| **Primary subtle** | `--color-primary-subtle` | `#E6F5F2` | Fondos suaves de acento (badges, highlights) |
| **Primary foreground** | `--color-primary-fg` | `#FFFFFF` | Texto sobre fondo primary |
| **Background** | `--color-bg` | `#FAF8F5` | Fondo principal de la app |
| **Surface** | `--color-surface` | `#FFFFFF` | Cards, paneles, modales |
| **Surface alt** | `--color-surface-alt` | `#F5F2ED` | Superficies secundarias, sidebars |
| **Border** | `--color-border` | `#E0DBD3` | Bordes de cards, separadores |
| **Border subtle** | `--color-border-subtle` | `#EBE7E0` | Separadores suaves internos |
| **Text** | `--color-text` | `#2C2825` | Texto principal body |
| **Text secondary** | `--color-text-secondary` | `#7A746C` | Texto secundario, metadata |
| **Text muted** | `--color-text-muted` | `#B5AFA7` | Placeholders, texto terciario |
| **Success** | `--color-success` | `#2D8044` | Confirmaciones, estado "Pagado" |
| **Success subtle** | `--color-success-subtle` | `#E8F5EC` | Fondo badges de éxito |
| **Success fg** | `--color-success-fg` | `#1B5E2E` | Texto sobre fondo success subtle |
| **Warning** | `--color-warning` | `#C48820` | Alertas no críticas, estado "Pendiente" |
| **Warning subtle** | `--color-warning-subtle` | `#FEF5E0` | Fondo badges warning |
| **Warning fg** | `--color-warning-fg` | `#8A5E10` | Texto sobre fondo warning subtle |
| **Error** | `--color-error` | `#B83A3A` | Errores, estado "Vencido" |
| **Error subtle** | `--color-error-subtle` | `#FCEAEA` | Fondo badges error |
| **Error fg** | `--color-error-fg` | `#8C2020` | Texto sobre fondo error subtle |
| **Info** | `--color-info` | `#3578B2` | Información contextual |
| **Info subtle** | `--color-info-subtle` | `#E6F0FA` | Fondo badges info |
| **Info fg** | `--color-info-fg` | `#1E5280` | Texto sobre fondo info subtle |
| **Indigo** | `--color-indigo` | `#6246A8` | Estado "Sin consentimiento" |
| **Indigo subtle** | `--color-indigo-subtle` | `#F0ECF8` | Fondo badge indigo |
| **Indigo fg** | `--color-indigo-fg` | `#4A3280` | Texto sobre fondo indigo subtle |
| **Orange** | `--color-orange` | `#D47020` | Estado "Acuerdo sin cerrar" |
| **Orange subtle** | `--color-orange-subtle` | `#FEF0E0` | Fondo badge naranja |
| **Orange fg** | `--color-orange-fg` | `#9A4E10` | Texto sobre fondo orange subtle |
| **Kosmo** | `--color-kosmo` | `#1A7B6E` | Elementos de IA Kosmo (igual que primary) |
| **Kosmo surface** | `--color-kosmo-surface` | `#ECF7F5` | Fondo de briefings/nudges de Kosmo |
| **Kosmo border** | `--color-kosmo-border` | `#C2E4DE` | Borde de superficies Kosmo |

### Dark Mode

| Rol | Token CSS | Hex | Uso |
|---|---|---|---|
| **Primary** | `--color-primary` | `#4ABEAB` | CTAs, enlaces |
| **Primary hover** | `--color-primary-hover` | `#6DD0C0` | Hover |
| **Primary subtle** | `--color-primary-subtle` | `#1A2E2B` | Fondos suaves acento |
| **Primary foreground** | `--color-primary-fg` | `#111A18` | Texto sobre primary |
| **Background** | `--color-bg` | `#161412` | Fondo principal |
| **Surface** | `--color-surface` | `#1E1C19` | Cards, paneles |
| **Surface alt** | `--color-surface-alt` | `#252320` | Superficies secundarias |
| **Border** | `--color-border` | `#3A3733` | Bordes |
| **Border subtle** | `--color-border-subtle` | `#2E2C28` | Separadores suaves |
| **Text** | `--color-text` | `#E5E0DA` | Texto principal |
| **Text secondary** | `--color-text-secondary` | `#9A958D` | Texto secundario |
| **Text muted** | `--color-text-muted` | `#5E5A54` | Placeholders |
| **Success** | `--color-success` | `#5CB86E` | Pagado |
| **Success subtle** | `--color-success-subtle` | `#1A2E1E` | Fondo badge |
| **Success fg** | `--color-success-fg` | `#7CD48A` | Texto badge |
| **Warning** | `--color-warning` | `#E0A840` | Pendiente |
| **Warning subtle** | `--color-warning-subtle` | `#2E2518` | Fondo badge |
| **Warning fg** | `--color-warning-fg` | `#F0C060` | Texto badge |
| **Error** | `--color-error` | `#E06060` | Vencido |
| **Error subtle** | `--color-error-subtle` | `#2E1A1A` | Fondo badge |
| **Error fg** | `--color-error-fg` | `#F08080` | Texto badge |
| **Info** | `--color-info` | `#5A9ED6` | Info |
| **Info subtle** | `--color-info-subtle` | `#1A2530` | Fondo badge |
| **Info fg** | `--color-info-fg` | `#80B8E8` | Texto badge |
| **Indigo** | `--color-indigo` | `#9A7ED6` | Sin consentimiento |
| **Indigo subtle** | `--color-indigo-subtle` | `#231E30` | Fondo badge |
| **Indigo fg** | `--color-indigo-fg` | `#B8A0E8` | Texto badge |
| **Orange** | `--color-orange` | `#E89850` | Acuerdo sin cerrar |
| **Orange subtle** | `--color-orange-subtle` | `#2E2018` | Fondo badge |
| **Orange fg** | `--color-orange-fg` | `#F0B070` | Texto badge |
| **Kosmo** | `--color-kosmo` | `#4ABEAB` | IA Kosmo |
| **Kosmo surface** | `--color-kosmo-surface` | `#1A2825` | Fondo briefings Kosmo |
| **Kosmo border** | `--color-kosmo-border` | `#2A4A42` | Borde Kosmo |

### Badges de estado de paciente — Mapa de colores

| Estado | Token semántico | Filled (light) | Subtle bg (light) | Subtle text (light) |
|---|---|---|---|---|
| Pagado | `success` | `#2D8044` bg + blanco text | `#E8F5EC` bg | `#1B5E2E` text |
| Pendiente | `warning` | `#C48820` bg + blanco text | `#FEF5E0` bg | `#8A5E10` text |
| Vencido | `error` | `#B83A3A` bg + blanco text | `#FCEAEA` bg | `#8C2020` text |
| Sin consentimiento | `indigo` | `#6246A8` bg + blanco text | `#F0ECF8` bg | `#4A3280` text |
| Acuerdo sin cerrar | `orange` | `#D47020` bg + blanco text | `#FEF0E0` bg | `#9A4E10` text |

---

## 1.3 Tipografía

### Fuentes

| Rol | Familia | Carga | Pesos |
|---|---|---|---|
| **Display** (headings, labels grandes) | **Satoshi** | Fontshare CDN / `@fontsource/satoshi` | Medium (500), Bold (700), Black (900) |
| **Body** (cuerpo, inputs, metadata) | **Inter** | Google Fonts / `@fontsource/inter` | Regular (400), Medium (500), SemiBold (600), Bold (700) |
| **Mono** (código, IDs) | **JetBrains Mono** | Google Fonts | Regular (400) |

```html
<!-- CDN Satoshi (Fontshare) -->
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@500,700,900&display=swap" rel="stylesheet">

<!-- CDN Inter (Google Fonts) -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

<!-- CDN JetBrains Mono -->
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
```

### Escala tipográfica

| Token CSS | Alias | Tamaño | Line-height | Letter-spacing | Fuente | Uso |
|---|---|---|---|---|---|---|
| `--text-xs` | xs | 12px | 16px (1.33) | +0.02em | Inter 400 | Captions, micro-labels |
| `--text-sm` | sm | 14px | 20px (1.43) | +0.01em | Inter 400/500 | Body secundario, badges, metadata |
| `--text-md` | md | 16px | 24px (1.5) | 0 | Inter 400 | Body principal, inputs |
| `--text-lg` | lg | 18px | 28px (1.56) | -0.01em | Inter 500 / Satoshi 500 | Subtítulos, labels destacados |
| `--text-xl` | xl | 24px | 32px (1.33) | -0.02em | Satoshi 700 | Títulos de sección |
| `--text-2xl` | 2xl | 32px | 40px (1.25) | -0.025em | Satoshi 700 | Títulos de página |
| `--text-3xl` | 3xl | 48px | 56px (1.17) | -0.03em | Satoshi 900 | Display / hero |

### Tokens CSS de tipografía

```css
--font-display: 'Satoshi', sans-serif;
--font-body: 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', monospace;

--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-md: 1rem;         /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.5rem;       /* 24px */
--text-2xl: 2rem;        /* 32px */
--text-3xl: 3rem;        /* 48px */

--leading-xs: 1rem;      /* 16px */
--leading-sm: 1.25rem;   /* 20px */
--leading-md: 1.5rem;    /* 24px */
--leading-lg: 1.75rem;   /* 28px */
--leading-xl: 2rem;      /* 32px */
--leading-2xl: 2.5rem;   /* 40px */
--leading-3xl: 3.5rem;   /* 56px */

--tracking-tight: -0.03em;
--tracking-snug: -0.02em;
--tracking-normal: 0;
--tracking-wide: 0.01em;
--tracking-wider: 0.02em;
```

### Reglas tipográficas

- Nunca usar texto por debajo de 12px.
- Los headings siempre usan Satoshi; el body siempre usa Inter.
- Números en tablas y KPIs: `font-variant-numeric: tabular-nums lining-nums;`
- No usar itálica de Satoshi (no disponible en todos los pesos). Usar Inter italic cuando sea necesario.
- Max 66 caracteres por línea en body (45-75 rango aceptable).

---

## 1.4 Espaciado

Base de **4px**. Escala:

| Token CSS | Valor | Rem | Uso típico |
|---|---|---|---|
| `--space-1` | 4px | 0.25rem | Separación mínima interna |
| `--space-2` | 8px | 0.5rem | Padding interno inputs, entre iconos y texto |
| `--space-3` | 12px | 0.75rem | Gaps en badges, padding compacto |
| `--space-4` | 16px | 1rem | Padding standard de cards, gap entre elementos |
| `--space-5` | 20px | 1.25rem | Espaciado entre secciones compactas |
| `--space-6` | 24px | 1.5rem | Padding amplio de cards, margen entre grupos |
| `--space-8` | 32px | 2rem | Separación entre secciones |
| `--space-10` | 40px | 2.5rem | Margen de contenedor principal |
| `--space-12` | 48px | 3rem | Espaciado entre secciones grandes |
| `--space-16` | 64px | 4rem | Padding de página |
| `--space-20` | 80px | 5rem | Separación de bloques hero |
| `--space-24` | 96px | 6rem | Margen superior/inferior de secciones landing |

---

## 1.5 Border Radius

| Token CSS | Valor | Uso |
|---|---|---|
| `--radius-sm` | 4px | Badges, chips pequeños |
| `--radius-md` | 8px | Inputs, botones, cards internas |
| `--radius-lg` | 12px | Cards principales, modales |
| `--radius-xl` | 20px | Cards destacadas, panels flotantes |
| `--radius-full` | 9999px | Avatares, pills, badges circulares |

---

## 1.6 Sombras

| Token CSS | Valor | Uso |
|---|---|---|
| `--shadow-sm` | `0 1px 2px 0 rgba(44, 40, 37, 0.06)` | Cards en reposo, inputs focus |
| `--shadow-md` | `0 4px 12px -2px rgba(44, 40, 37, 0.10), 0 2px 4px -2px rgba(44, 40, 37, 0.06)` | Cards hover, dropdowns |
| `--shadow-lg` | `0 12px 32px -4px rgba(44, 40, 37, 0.14), 0 4px 12px -4px rgba(44, 40, 37, 0.08)` | Modales, panels flotantes |

> En dark mode, las sombras usan `rgba(0, 0, 0, ...)` con opacidades +0.10 mayores.

---

## 1.7 Z-index

| Token CSS | Valor | Uso |
|---|---|---|
| `--z-base` | 0 | Contenido base |
| `--z-dropdown` | 100 | Selects, menús desplegables |
| `--z-sticky` | 200 | Headers sticky, sidebar fija |
| `--z-overlay` | 300 | Overlays, backdrops |
| `--z-modal` | 400 | Modales, dialogs |
| `--z-toast` | 500 | Toasts, notificaciones |

---

## 1.8 Duración de animaciones

| Token CSS | Valor | Uso |
|---|---|---|
| `--duration-fast` | 100ms | Hover de botones, toggle switches |
| `--duration-normal` | 200ms | Transiciones de color, scale, opacity |
| `--duration-slow` | 350ms | Abrir/cerrar panels, sidebar, modales |
| `--easing-standard` | `cubic-bezier(0.4, 0.0, 0.2, 1)` | Easing general (Material standard) |
| `--easing-enter` | `cubic-bezier(0.0, 0.0, 0.2, 1)` | Elementos que entran |
| `--easing-exit` | `cubic-bezier(0.4, 0.0, 1, 1)` | Elementos que salen |

### Regla: `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

# 2. Componentes Base

Para cada componente: descripción, variantes, estados, tokens aplicados, notas de accesibilidad y código JSX de ejemplo.

---

## 2.1 Botones

### Descripción

Elemento interactivo principal. Cuatro variantes de jerarquía, tres tamaños. Siempre usan fuente **Inter Medium/SemiBold** con `border-radius: var(--radius-md)`.

### Variantes

| Variante | Fondo | Texto | Borde | Uso |
|---|---|---|---|---|
| **Primary** | `--color-primary` | `--color-primary-fg` | ninguno | CTA principal: "Guardar nota", "Registrar cobro" |
| **Secondary** | `transparent` | `--color-primary` | `--color-border` | Acciones secundarias: "Cancelar", "Ver historial" |
| **Ghost** | `transparent` | `--color-text-secondary` | ninguno | Acciones terciarias: "Más opciones", filtros |
| **Danger** | `--color-error` | `#FFFFFF` | ninguno | Acciones destructivas: "Eliminar paciente" |

### Tamaños

| Tamaño | Padding | Altura | Font size | Icono |
|---|---|---|---|---|
| **sm** | `6px 12px` | 32px | `--text-sm` (14px) | 16px |
| **md** | `8px 16px` | 40px | `--text-md` (16px) | 20px |
| **lg** | `12px 24px` | 48px | `--text-lg` (18px) | 24px |

### Estados

| Estado | Cambio visual |
|---|---|
| Default | Según variante |
| Hover | Primary: `--color-primary-hover`; Secondary: fondo `--color-primary-subtle`; Ghost: fondo `--color-surface-alt` |
| Active | Scale 0.98, brightness -5% |
| Disabled | Opacity 0.5, cursor not-allowed |
| Loading | Texto oculto, spinner inline centrado (16px), botón no clickeable |

### Accesibilidad

- `role="button"` implícito en `<button>`.
- Loading: `aria-busy="true"`, `aria-disabled="true"`.
- Disabled: `aria-disabled="true"` (preferir sobre `disabled` nativo para mantener foco).
- Contraste mínimo 4.5:1 entre texto y fondo.

### Código JSX

```jsx
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = {
  primary: 'bg-[var(--color-primary)] text-[var(--color-primary-fg)] hover:bg-[var(--color-primary-hover)]',
  secondary: 'border border-[var(--color-border)] text-[var(--color-primary)] hover:bg-[var(--color-primary-subtle)]',
  ghost: 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)]',
  danger: 'bg-[var(--color-error)] text-white hover:bg-[var(--color-error)]/90',
};

const buttonSizes = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-base gap-2',
  lg: 'h-12 px-6 text-lg gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  className,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-[var(--radius-md)]',
        'transition-colors duration-[var(--duration-normal)] ease-[var(--easing-standard)]',
        'active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]',
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
      ) : (
        children
      )}
    </button>
  );
}
```

### Botón icon-only

```jsx
export function IconButton({ icon: Icon, label, variant = 'ghost', size = 'md', ...props }) {
  const iconSizes = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-[var(--radius-md)]',
        'transition-colors duration-[var(--duration-normal)]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]',
        buttonVariants[variant],
        iconSizes[size],
      )}
      aria-label={label} /* OBLIGATORIO */
      title={label}      /* Tooltip nativo */
      {...props}
    >
      <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
    </button>
  );
}
```

> **Regla:** Todo botón icon-only debe tener `aria-label` y `title` (tooltip) obligatorio.

---

## 2.2 Badges de estado de paciente

### Descripción

Indicador visual de estado crítico del paciente. Aparecen en PatientCard, ficha de paciente y listas. Son el componente más importante del sistema — permiten a Natalia identificar al instante qué necesita atención.

### Variantes

| Estado | Label | Variante Filled | Variante Subtle |
|---|---|---|---|
| Pagado | "Pagado" | bg `--color-success`, text blanco | bg `--color-success-subtle`, text `--color-success-fg` |
| Pendiente | "Pendiente" | bg `--color-warning`, text blanco | bg `--color-warning-subtle`, text `--color-warning-fg` |
| Vencido | "Vencido" | bg `--color-error`, text blanco | bg `--color-error-subtle`, text `--color-error-fg` |
| Sin consentimiento | "Falta consentimiento" | bg `--color-indigo`, text blanco | bg `--color-indigo-subtle`, text `--color-indigo-fg` |
| Acuerdo sin cerrar | "Acuerdo pendiente" | bg `--color-orange`, text blanco | bg `--color-orange-subtle`, text `--color-orange-fg` |

### Estilo base

- Font: Inter Medium, `--text-xs` (12px)
- Padding: `2px 8px` (sm) / `4px 12px` (md)
- Border radius: `--radius-full` (pill)
- Subtle variant: fondo al 15% de opacidad del color semántico, texto al tono oscuro
- Sin borde

### Accesibilidad

- Incluir `role="status"` en badges que cambian dinámicamente.
- No depender solo del color: siempre incluir texto descriptivo.
- Contraste mínimo 4.5:1 en todas las variantes.

### Código JSX

```jsx
const badgeStyles = {
  paid:       { filled: 'bg-[var(--color-success)] text-white', subtle: 'bg-[var(--color-success-subtle)] text-[var(--color-success-fg)]' },
  pending:    { filled: 'bg-[var(--color-warning)] text-white', subtle: 'bg-[var(--color-warning-subtle)] text-[var(--color-warning-fg)]' },
  overdue:    { filled: 'bg-[var(--color-error)] text-white', subtle: 'bg-[var(--color-error-subtle)] text-[var(--color-error-fg)]' },
  noConsent:  { filled: 'bg-[var(--color-indigo)] text-white', subtle: 'bg-[var(--color-indigo-subtle)] text-[var(--color-indigo-fg)]' },
  openDeal:   { filled: 'bg-[var(--color-orange)] text-white', subtle: 'bg-[var(--color-orange-subtle)] text-[var(--color-orange-fg)]' },
};

const badgeLabels = {
  paid: 'Pagado',
  pending: 'Pendiente',
  overdue: 'Vencido',
  noConsent: 'Falta consentimiento',
  openDeal: 'Acuerdo pendiente',
};

export function StatusBadge({ status, variant = 'subtle', className }) {
  return (
    <span
      role="status"
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full',
        'font-medium text-xs leading-4',
        'font-[var(--font-body)]',
        badgeStyles[status][variant],
        className
      )}
    >
      {badgeLabels[status]}
    </span>
  );
}
```

---

## 2.3 Cards

### 2.3.1 PatientCard

Tarjeta de paciente en la lista `/patients`. Muestra información clave de un vistazo.

**Contenido:**
- Avatar (40px, `--radius-full`) o iniciales sobre fondo `--color-primary-subtle`
- Nombre del paciente (Satoshi Bold, `--text-lg`)
- Enfoque terapéutico (`brand_tone`) — Inter, `--text-sm`, `--color-text-secondary`
- Próxima sesión (`next_deadline`) — Inter, `--text-sm`
- Badges de estado (1-3 badges, variante subtle)

**Estilo:**
- Fondo: `--color-surface`
- Borde: `--color-border-subtle`
- Padding: `--space-4` (16px)
- Border radius: `--radius-lg` (12px)
- Sombra: `--shadow-sm`
- Hover: `--shadow-md`, borde `--color-border`
- Transición: `var(--duration-normal) var(--easing-standard)`

```jsx
export function PatientCard({ patient }) {
  return (
    <Link
      href={`/patients/${patient.id}`}
      className={cn(
        'block p-4 bg-[var(--color-surface)] border border-[var(--color-border-subtle)]',
        'rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]',
        'hover:shadow-[var(--shadow-md)] hover:border-[var(--color-border)]',
        'transition-all duration-[var(--duration-normal)] ease-[var(--easing-standard)]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]'
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar name={patient.project_name} src={patient.avatar} size={40} />
        <div className="flex-1 min-w-0">
          <h3 className="font-[var(--font-display)] font-bold text-lg text-[var(--color-text)] truncate">
            {patient.project_name}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
            {patient.brand_tone}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Próxima sesión: {formatDate(patient.next_deadline)}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {patient.statuses.map(status => (
              <StatusBadge key={status} status={status} variant="subtle" />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
```

### Accesibilidad PatientCard
- Toda la card es un enlace (`<Link>`).
- `focus-visible` outline visible.
- Nombre legible para screen readers: la card debe contener texto accesible.

---

### 2.3.2 SessionCard

Tarjeta de sesión en la ficha de paciente (historial de sesiones).

**Contenido:**
- Fecha y hora (Inter SemiBold, `--text-sm`)
- Duración (badge ghost, ej. "50 min")
- Resumen IA de Kosmo (Inter, `--text-sm`, `--color-text-secondary`, max 2 líneas)
- Nota rápida (si existe): icono de nota + preview truncado
- Indicador Kosmo si el resumen es IA-generado

**Estilo:**
- Fondo: `--color-surface`
- Borde inferior: `--color-border-subtle` (separador entre sesiones)
- Padding: `--space-4`
- Sin border-radius (stacked list)

```jsx
export function SessionCard({ session }) {
  return (
    <div className="p-4 border-b border-[var(--color-border-subtle)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-[var(--color-text)]">
            {formatDateTime(session.date)}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)]">
            {session.duration} min
          </span>
        </div>
      </div>
      {session.ai_summary && (
        <div className="flex items-start gap-2 mt-2 p-2 rounded-[var(--radius-md)] bg-[var(--color-kosmo-surface)]">
          <KosmoIcon size={16} className="text-[var(--color-kosmo)] mt-0.5 shrink-0" />
          <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
            {session.ai_summary}
          </p>
        </div>
      )}
      {session.note && (
        <p className="text-sm text-[var(--color-text-secondary)] mt-2 line-clamp-1">
          📝 {session.note}
        </p>
      )}
    </div>
  );
}
```

---

### 2.3.3 KPI Card

Tarjeta de métrica en el dashboard.

**Contenido:**
- Label (Inter Medium, `--text-sm`, `--color-text-secondary`)
- Valor grande (Satoshi Bold, `--text-2xl` o `--text-xl`)
- Delta con flecha (verde subida, rojo bajada, gris neutro)
- Sparkline opcional (SVG, 64x24px, color `--color-primary` al 60%)

**Estilo:**
- Fondo: `--color-surface`
- Borde: `--color-border-subtle`
- Padding: `--space-6`
- Border radius: `--radius-lg`
- `font-variant-numeric: tabular-nums lining-nums` en el valor

```jsx
export function KPICard({ label, value, delta, sparklineData }) {
  const deltaColor = delta > 0
    ? 'text-[var(--color-success)]'
    : delta < 0
    ? 'text-[var(--color-error)]'
    : 'text-[var(--color-text-muted)]';

  return (
    <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
      <p className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</p>
      <div className="flex items-end justify-between mt-1">
        <p className="font-[var(--font-display)] font-bold text-2xl text-[var(--color-text)]"
           style={{ fontVariantNumeric: 'tabular-nums lining-nums' }}>
          {value}
        </p>
        {sparklineData && <Sparkline data={sparklineData} />}
      </div>
      {delta !== undefined && (
        <p className={cn('text-sm mt-1 flex items-center gap-1', deltaColor)}>
          {delta > 0 ? '↑' : delta < 0 ? '↓' : '→'} {Math.abs(delta)}%
        </p>
      )}
    </div>
  );
}
```

---

## 2.4 Inputs y formularios

### Estilo base de inputs

| Propiedad | Valor |
|---|---|
| Font | Inter Regular, `--text-md` |
| Altura | 40px (md), 32px (sm) |
| Padding | `8px 12px` |
| Fondo | `--color-surface` |
| Borde | 1px solid `--color-border` |
| Border radius | `--radius-md` |
| Placeholder color | `--color-text-muted` |

### Estados de inputs

| Estado | Cambio visual |
|---|---|
| Default | Borde `--color-border` |
| Focus | Borde `--color-primary`, ring 2px `--color-primary` al 20%, `--shadow-sm` |
| Error | Borde `--color-error`, ring 2px `--color-error` al 15% |
| Disabled | Opacity 0.5, cursor not-allowed, fondo `--color-surface-alt` |

### Label + Error message

```jsx
export function FormField({ label, error, children, required }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[var(--color-text)]">
        {label}
        {required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-[var(--color-error)] flex items-center gap-1" role="alert">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}
```

### Input de texto

```jsx
export function TextInput({ className, error, ...props }) {
  return (
    <input
      className={cn(
        'w-full h-10 px-3 bg-[var(--color-surface)] border rounded-[var(--radius-md)]',
        'text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]',
        'font-[var(--font-body)] text-base',
        'transition-[border-color,box-shadow] duration-[var(--duration-normal)]',
        'focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--color-surface-alt)]',
        error
          ? 'border-[var(--color-error)] ring-2 ring-[var(--color-error)]/15'
          : 'border-[var(--color-border)]',
        className
      )}
      {...props}
    />
  );
}
```

### Textarea

Igual que TextInput pero con `min-height: 80px`, `resize: vertical`.

### Select

Usa el mismo estilo base con icono chevron-down a la derecha (16px, `--color-text-secondary`). Dropdown con `--shadow-md`, z-index `--z-dropdown`.

### DatePicker

Input que abre un calendario flotante. Icono de calendario (16px) a la izquierda. Formato: `DD/MM/AAAA`. El calendario flotante usa `--shadow-lg`, z-index `--z-dropdown`.

### NoteQuickInput (componente crítico)

Textarea expandible para captura rápida de notas de sesión. Guardado automático (debounce 1.5s).

**Comportamiento:**
1. **Modo reposo:** altura 40px, placeholder "Escribe una nota rápida…", parece un input.
2. **On focus:** se expande a min 120px, aparece contador de caracteres y badge "Guardado auto."
3. **Modo sesión:** fondo `--color-kosmo-surface`, borde `--color-kosmo-border`, placeholder "Notas de sesión en curso…"
4. **Guardado:** indicador sutil "Guardado ✓" con fade-out a los 2s.

```jsx
export function NoteQuickInput({ value, onChange, sessionMode = false, saving = false }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={cn(
      'relative rounded-[var(--radius-md)] border transition-all duration-[var(--duration-normal)]',
      sessionMode
        ? 'bg-[var(--color-kosmo-surface)] border-[var(--color-kosmo-border)]'
        : 'bg-[var(--color-surface)] border-[var(--color-border)]',
      focused && 'ring-2 ring-[var(--color-primary)]/20 border-[var(--color-primary)]'
    )}>
      <textarea
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={sessionMode ? 'Notas de sesión en curso…' : 'Escribe una nota rápida…'}
        className={cn(
          'w-full px-3 py-2 bg-transparent resize-y',
          'text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]',
          'font-[var(--font-body)] text-base leading-6',
          'focus:outline-none',
          focused ? 'min-h-[120px]' : 'min-h-[40px]'
        )}
      />
      {focused && (
        <div className="flex items-center justify-between px-3 py-1.5 border-t border-[var(--color-border-subtle)]">
          <span className="text-xs text-[var(--color-text-muted)]">
            {value.length} caracteres
          </span>
          {saving ? (
            <span className="text-xs text-[var(--color-text-muted)]">Guardando…</span>
          ) : (
            <span className="text-xs text-[var(--color-success)]">Guardado ✓</span>
          )}
        </div>
      )}
    </div>
  );
}
```

### Accesibilidad de formularios

- Todo input debe tener `<label>` asociado (con `htmlFor`).
- Errores: `role="alert"`, referenciados por `aria-describedby` en el input.
- Grupos de radio/checkbox: `<fieldset>` + `<legend>`.
- Autofocus solo en el primer campo del formulario principal.

---

## 2.5 Navegación

### 2.5.1 Sidebar Desktop

Barra lateral fija a la izquierda. 240px de ancho (colapsable a 64px).

**Contenido (top to bottom):**
1. Logo ClientKosmos (Satoshi Bold, `--text-lg`, icono + texto o solo icono si colapsada)
2. Separador sutil
3. Nav items con iconos (Lucide 20px):
   - **Hoy** (icono: `CalendarToday`) → `/dashboard`
   - **Pacientes** (icono: `Users`) → `/patients`
   - **Kosmo** (icono: `Sparkles`) → `/kosmo`
   - **Cobros** (icono: `Receipt`) → `/billing`
4. Separador inferior
5. **Ajustes** (icono: `Settings`) → `/settings`
6. Avatar de usuario (32px, `--radius-full`) + nombre truncado

**Estilo nav items:**
- Default: texto `--color-text-secondary`, fondo transparente
- Hover: fondo `--color-surface-alt`
- Active (ruta actual): fondo `--color-primary-subtle`, texto `--color-primary`, borde izquierdo 3px `--color-primary`
- Padding: `8px 12px`, border-radius `--radius-md`
- Gap entre icono y texto: `--space-3` (12px)

**Notificación Kosmo:** Dot rojo (8px) sobre el icono de Kosmo cuando hay briefings pendientes.

```jsx
export function Sidebar({ currentPath }) {
  const navItems = [
    { label: 'Hoy', icon: CalendarToday, href: '/dashboard' },
    { label: 'Pacientes', icon: Users, href: '/patients' },
    { label: 'Kosmo', icon: Sparkles, href: '/kosmo', hasBadge: true },
    { label: 'Cobros', icon: Receipt, href: '/billing' },
  ];

  return (
    <nav className="fixed left-0 top-0 h-screen w-60 bg-[var(--color-surface-alt)] border-r border-[var(--color-border-subtle)] flex flex-col z-[var(--z-sticky)]"
         aria-label="Navegación principal">
      {/* Logo */}
      <div className="p-4">
        <span className="font-[var(--font-display)] font-bold text-lg text-[var(--color-text)]">
          ClientKosmos
        </span>
      </div>

      {/* Nav items */}
      <div className="flex-1 px-2 space-y-1">
        {navItems.map(item => (
          <NavItem
            key={item.href}
            {...item}
            active={currentPath.startsWith(item.href)}
          />
        ))}
      </div>

      {/* Bottom */}
      <div className="p-2 border-t border-[var(--color-border-subtle)]">
        <NavItem label="Ajustes" icon={Settings} href="/settings" active={currentPath === '/settings'} />
        <UserAvatar />
      </div>
    </nav>
  );
}
```

### 2.5.2 Bottom Bar Móvil

Barra inferior fija en móvil. 4 items centrados.

| Item | Icono | Label | Ruta |
|---|---|---|---|
| Hoy | `CalendarToday` | Hoy | `/dashboard` |
| Pacientes | `Users` | Pacientes | `/patients` |
| Kosmo | `Sparkles` | Kosmo | `/kosmo` |
| Ajustes | `Settings` | Ajustes | `/settings` |

**Estilo:**
- Fondo: `--color-surface`, borde superior `--color-border-subtle`
- Altura: 64px + safe area bottom
- Iconos: 24px. Labels: `--text-xs` (12px)
- Activo: icono y texto `--color-primary`
- Inactivo: `--color-text-muted`

```jsx
export function BottomBar({ currentPath }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--color-surface)] border-t border-[var(--color-border-subtle)] z-[var(--z-sticky)] pb-[env(safe-area-inset-bottom)] md:hidden"
         aria-label="Navegación principal">
      <div className="flex items-center justify-around h-16">
        {mobileNavItems.map(item => (
          <Link key={item.href} href={item.href}
            className={cn(
              'flex flex-col items-center gap-0.5 py-1 px-3',
              currentPath.startsWith(item.href) ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'
            )}>
            <item.icon size={24} />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
```

### 2.5.3 Header de ficha de paciente

Header sticky dentro de la ficha `/patients/[id]`.

**Contenido:**
- Botón back (← volver a lista)
- Avatar (48px) + Nombre del paciente (Satoshi Bold, `--text-xl`)
- Badges de estado (inline, max 3 visibles)
- Acciones rápidas: botón "Nueva nota" (Secondary sm), botón "Registrar cobro" (Primary sm)

**Estilo:**
- Fondo: `--color-surface` con backdrop-blur
- Borde inferior: `--color-border-subtle`
- Padding: `--space-4`
- Sticky top: 0, z-index `--z-sticky`

```jsx
export function PatientHeader({ patient }) {
  return (
    <header className="sticky top-0 z-[var(--z-sticky)] bg-[var(--color-surface)]/95 backdrop-blur-sm border-b border-[var(--color-border-subtle)] px-4 py-3">
      <div className="flex items-center gap-3">
        <Link href="/patients" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
          <ArrowLeft size={20} />
        </Link>
        <Avatar name={patient.project_name} src={patient.avatar} size={48} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-[var(--font-display)] font-bold text-xl text-[var(--color-text)] truncate">
              {patient.project_name}
            </h1>
            <div className="flex gap-1 shrink-0">
              {patient.statuses.map(s => <StatusBadge key={s} status={s} variant="subtle" />)}
            </div>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">{patient.brand_tone}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="secondary" size="sm">Nueva nota</Button>
          <Button variant="primary" size="sm">Registrar cobro</Button>
        </div>
      </div>
    </header>
  );
}
```

---

## 2.6 Kosmo AI

### 2.6.1 Icono de Kosmo

Icono propio: estrella/sparkles estilizada en `--color-kosmo`. Se usa en todos los elementos IA.

```jsx
export function KosmoIcon({ size = 20, className }) {
  return <Sparkles size={size} className={cn('text-[var(--color-kosmo)]', className)} />;
}
```

### 2.6.2 Bubble/Chip de Kosmo

Chip inline que indica contenido generado por IA.

```jsx
export function KosmoChip({ children }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--color-kosmo-surface)] text-[var(--color-kosmo)] text-xs font-medium border border-[var(--color-kosmo-border)]">
      <KosmoIcon size={12} />
      {children || 'Kosmo'}
    </span>
  );
}
```

### 2.6.3 Superficie de briefing

Bloque de contenido generado por Kosmo. Aparece en pre-session y dashboard.

**Estilo:**
- Fondo: `--color-kosmo-surface`
- Borde: 1px `--color-kosmo-border`
- Border radius: `--radius-lg`
- Padding: `--space-4`
- Icono Kosmo en la esquina superior izquierda

```jsx
export function KosmoBriefing({ title, content, actions }) {
  return (
    <div className="p-4 bg-[var(--color-kosmo-surface)] border border-[var(--color-kosmo-border)] rounded-[var(--radius-lg)]">
      <div className="flex items-center gap-2 mb-3">
        <KosmoIcon size={20} />
        <h3 className="font-[var(--font-display)] font-bold text-sm text-[var(--color-text)]">
          {title}
        </h3>
        <KosmoChip />
      </div>
      <div className="text-sm text-[var(--color-text-secondary)] space-y-2 leading-relaxed">
        {content}
      </div>
      {actions && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-[var(--color-kosmo-border)]">
          {actions}
        </div>
      )}
    </div>
  );
}
```

### 2.6.4 Nudge inline

Sugerencia no intrusiva de Kosmo. Dismissible, sin modal. Aparece dentro del flujo.

```jsx
export function KosmoNudge({ message, onDismiss, action }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-[var(--color-kosmo-surface)] border border-[var(--color-kosmo-border)] rounded-[var(--radius-md)]"
         role="status">
      <KosmoIcon size={16} className="shrink-0" />
      <p className="flex-1 text-sm text-[var(--color-text-secondary)]">{message}</p>
      {action && (
        <Button variant="ghost" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
      <button
        onClick={onDismiss}
        aria-label="Cerrar sugerencia"
        className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] p-1"
      >
        <X size={14} />
      </button>
    </div>
  );
}
```

---

## 2.7 Empty States

### Principios

- Tono empático y profesional, nunca robótico.
- Siempre ofrecer una acción si la sección es accionable.
- Icono ilustrativo sutil (Lucide, 48px, `--color-text-muted` al 40%).

### Textos por sección

| Sección | Icono | Título | Descripción | CTA |
|---|---|---|---|---|
| **Notas / Ideas** (`ideas`) | `FileText` | "Sin notas todavía" | "Aquí irán tus notas de sesión y observaciones clave." | "Escribir primera nota" |
| **Recursos / Docs** (`recursos`) | `FolderOpen` | "Sin documentos" | "Guarda aquí los consentimientos RGPD, informes y documentos del paciente." | "Subir documento" |
| **Lista de pacientes** | `UserPlus` | "Tu consulta empieza aquí" | "Añade tu primer paciente para comenzar a gestionar tus sesiones." | "Añadir paciente" |
| **Historial de sesiones** | `Calendar` | "Sin sesiones registradas" | "Las sesiones aparecerán aquí conforme las vayas completando." | — |
| **Cobros** | `Receipt` | "Sin cobros registrados" | "Aquí verás el historial de pagos de este paciente." | "Registrar cobro" |
| **Kosmo sin datos** | `Sparkles` | "Kosmo está aprendiendo" | "Cuando tengas más sesiones, Kosmo generará briefings y resúmenes para ti." | — |

```jsx
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-[var(--color-surface-alt)] flex items-center justify-center mb-4">
        <Icon size={24} className="text-[var(--color-text-muted)]" />
      </div>
      <h3 className="font-[var(--font-display)] font-bold text-base text-[var(--color-text)]">
        {title}
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] mt-1 max-w-xs">
        {description}
      </p>
      {action && (
        <Button variant="primary" size="sm" className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
```

---

## 2.8 Toasts / Notificaciones

### Posición

- **Desktop:** bottom-right, 16px del borde
- **Móvil:** top, 8px del borde, ancho completo con padding

### Variantes

| Variante | Icono | Color fondo | Color borde | Color icono |
|---|---|---|---|---|
| Success | `CheckCircle` | `--color-success-subtle` | `--color-success` al 30% | `--color-success` |
| Warning | `AlertTriangle` | `--color-warning-subtle` | `--color-warning` al 30% | `--color-warning` |
| Error | `XCircle` | `--color-error-subtle` | `--color-error` al 30% | `--color-error` |
| Info | `Info` | `--color-info-subtle` | `--color-info` al 30% | `--color-info` |

### Comportamiento

- Auto-dismiss: 5s (success/info), 8s (warning), persistente (error, requiere dismiss manual)
- Animación entrada: slide-up + fade-in, `--duration-normal`
- Animación salida: slide-down + fade-out, `--duration-normal`
- Stacking: max 3 visibles, nuevos empujan antiguos
- Z-index: `--z-toast`

```jsx
export function Toast({ variant, message, onDismiss }) {
  const styles = {
    success: { icon: CheckCircle, bg: 'bg-[var(--color-success-subtle)]', border: 'border-[var(--color-success)]/30', iconColor: 'text-[var(--color-success)]' },
    warning: { icon: AlertTriangle, bg: 'bg-[var(--color-warning-subtle)]', border: 'border-[var(--color-warning)]/30', iconColor: 'text-[var(--color-warning)]' },
    error: { icon: XCircle, bg: 'bg-[var(--color-error-subtle)]', border: 'border-[var(--color-error)]/30', iconColor: 'text-[var(--color-error)]' },
    info: { icon: InfoIcon, bg: 'bg-[var(--color-info-subtle)]', border: 'border-[var(--color-info)]/30', iconColor: 'text-[var(--color-info)]' },
  };

  const s = styles[variant];
  const Icon = s.icon;

  return (
    <div className={cn(
      'flex items-center gap-3 p-4 rounded-[var(--radius-lg)] border shadow-[var(--shadow-md)]',
      'animate-in slide-in-from-bottom-2 fade-in duration-[var(--duration-normal)]',
      s.bg, s.border
    )} role="alert">
      <Icon size={20} className={s.iconColor} />
      <p className="flex-1 text-sm text-[var(--color-text)]">{message}</p>
      <button onClick={onDismiss} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]" aria-label="Cerrar">
        <X size={16} />
      </button>
    </div>
  );
}
```

---

# 3. Arquitectura de Pantallas

## Mapa general de rutas

```
/                           → Landing page
/login                      → Login
/register                   → Registro
/onboarding                 → Wizard post-registro (3 pasos)
/dashboard                  → Dashboard / Hoy
/patients                   → Lista de pacientes
/patients/[id]              → Ficha de paciente
/patients/[id]/pre-session  → Vista "Antes de empezar"
/patients/[id]/post-session → Vista "Al terminar"
/kosmo                      → Panel IA (o sidebar /kosmo)
/billing                    → Cobros (GAP — pantalla futura)
/settings                   → Ajustes de cuenta
```

---

## 3.1 Autenticación

### 3.1.1 Login (`/login`)

**Propósito:** Acceso de usuario existente.

**Contenido:**
- Logo ClientKosmos centrado (Satoshi Bold, `--text-2xl`)
- Subtítulo: "Tu consulta, en orden" (`--text-md`, `--color-text-secondary`)
- Formulario:
  - Email (input text, placeholder "tu@email.com")
  - Contraseña (input password, placeholder "Contraseña")
  - Checkbox "Recordarme"
  - Botón "Entrar" (Primary, lg, full-width)
- Link "¿Olvidaste tu contraseña?" (Ghost, `--text-sm`)
- Separador "o"
- Botón "Crear cuenta" (Secondary, lg, full-width)

**Layout:** Card centrada vertical y horizontal, max-width 400px. Fondo `--color-bg`.

**Componentes:** TextInput, Button, FormField.

---

### 3.1.2 Registro (`/register`)

**Propósito:** Creación de cuenta nueva.

**Contenido:**
- Logo + título "Crea tu cuenta"
- Formulario:
  - Nombre completo
  - Email
  - Contraseña (con indicador de fuerza)
  - Confirmación de contraseña
  - Checkbox aceptar términos y política RGPD
  - Botón "Crear cuenta" (Primary, lg, full-width)
- Link "¿Ya tienes cuenta? Inicia sesión"

**Layout:** Igual que login.

---

### 3.1.3 Onboarding Wizard (`/onboarding`)

**Propósito:** Configuración inicial post-registro. 3 pasos.

**Paso 1 — "Sobre tu consulta"**
- Nombre de la consulta o nombre profesional
- Especialidad (Select: Psicología clínica, Neuropsicología, Psicología infantil, Otra…)
- Ciudad

**Paso 2 — "Tu primer paciente"**
- Nombre del paciente (`project_name`)
- Motivo de consulta (`service_scope`)
- Enfoque terapéutico (`brand_tone`)
- Fecha próxima sesión (`next_deadline`)

**Paso 3 — "Ya casi"**
- Resumen de lo configurado
- CTA: "Ir a mi consulta" → redirige a `/dashboard`
- Texto motivacional: "Todo listo. Kosmo te acompañará en cada sesión."

**Layout:**
- Card centrada, max-width 520px
- Progress bar de 3 pasos en la parte superior (step dots + barra)
- Botones "Anterior" (Secondary) y "Siguiente" (Primary) en footer
- Step 2 es omitible: "Lo haré después" (link Ghost)

**Componentes:** TextInput, Select, DatePicker, Button, Progress.

---

## 3.2 Core App

### 3.2.1 Dashboard / Hoy (`/dashboard`)

**Propósito:** Cockpit diario. De un vistazo, Natalia sabe qué tiene por delante y qué necesita atención.

**Layout (desktop — 2 columnas: 2/3 + 1/3):**

**Columna principal (izquierda):**
1. **Saludo + fecha:** "Buenos días, Natalia" (Satoshi Bold, `--text-2xl`) + fecha actual (`--text-md`, `--color-text-secondary`)
2. **Briefing de Kosmo** (KosmoBriefing): resumen del día — sesiones programadas, pendientes, alertas
3. **Agenda del día:** lista cronológica de sesiones programadas
   - Cada item: hora + PatientCard compacto (nombre, enfoque, badges)
   - CTA en cada sesión: "Preparar sesión" → `/patients/[id]/pre-session`
   - Sesión actual/próxima destacada con borde `--color-primary`

**Columna lateral (derecha):**
1. **Alertas activas** (lista):
   - Pacientes con cobro pendiente/vencido (badge + nombre + acción)
   - Pacientes sin consentimiento RGPD (badge + nombre + acción)
   - Cada alerta es clickeable → ficha del paciente
2. **KPI Cards** (2x2 grid):
   - Sesiones esta semana
   - Cobros pendientes (€)
   - Pacientes activos
   - Tasa de cobro (%)

**Layout (móvil — 1 columna):**
1. Saludo + fecha
2. Briefing Kosmo (colapsable)
3. Agenda del día (scroll vertical)
4. Alertas activas (scroll horizontal de cards)
5. KPIs (2 columnas, cards más compactas)

**Componentes:** KosmoBriefing, PatientCard (variante compacta), KPICard, StatusBadge, Button.

---

### 3.2.2 Lista de Pacientes (`/patients`)

**Propósito:** Ver y gestionar todos los pacientes activos. Buscar, filtrar, acceder a fichas.

**Contenido:**
1. **Header de página:**
   - Título "Pacientes" (Satoshi Bold, `--text-2xl`)
   - Botón "Añadir paciente" (Primary, md) → abre modal/slide-over
2. **Barra de filtros:**
   - Búsqueda (TextInput con icono Search, placeholder "Buscar paciente…")
   - Filtros por estado: chips toggleables (Todos, Pendiente de cobro, Sin consentimiento, etc.)
   - Toggle vista: grid / lista
3. **Grid de pacientes:** PatientCards en grid responsive
   - Desktop: 3 columnas
   - Tablet: 2 columnas
   - Móvil: 1 columna
4. **Empty state** si no hay pacientes (ver sección 2.7)

**Componentes:** PatientCard, TextInput, StatusBadge (como filtro), Button, EmptyState.

---

### 3.2.3 Ficha de Paciente (`/patients/[id]`)

**Propósito:** Pantalla más importante del producto. Contexto completo del paciente en una sola vista.

**Layout (desktop):**

**Header sticky:** PatientHeader (avatar, nombre, badges, acciones rápidas)

**Contenido con pestañas/secciones (tabs horizontales):**

#### Tab "Resumen"
- **Datos principales:**
  - Nombre del paciente (`project_name`)
  - Motivo de consulta (`service_scope`)
  - Enfoque terapéutico (`brand_tone`)
  - Próxima sesión (`next_deadline`) con countdown
- **Último briefing de Kosmo** (KosmoBriefing)
- **Últimas 3 sesiones** (SessionCards)
- **Acuerdos terapéuticos activos** (`client_notes`): lista de bullets editables
- **Acceso rápido:** botones "Preparar sesión" y "Al terminar"

#### Tab "Acuerdos" (`client_notes`)
- Lista editable de acuerdos terapéuticos
- Cada acuerdo: texto + fecha de creación + checkbox de completado
- Botón "Añadir acuerdo"
- Ordenados por fecha, más recientes arriba

#### Tab "Notas / Ideas" (`ideas`)
- NoteQuickInput arriba para nueva nota
- Lista cronológica inversa de notas existentes
- Cada nota: texto + fecha + badge si fue generada por Kosmo
- Empty state si vacío

#### Tab "Documentos" (`recursos/adjuntos`)
- Lista de archivos: nombre, tipo, fecha de subida, tamaño
- Badge "RGPD" en documentos de consentimiento
- Botón "Subir documento"
- Drag & drop zone (dotted border, `--color-border`, icono Upload)
- Empty state si vacío

#### Tab "Cobros"
- Tabla de cobros del paciente:
  - Fecha | Concepto | Importe | Estado (badge) | Acciones
- Botón "Registrar cobro"
- Resumen: total cobrado, total pendiente

**Layout (móvil):**
- Header compacto (nombre + badges, acciones en menú "...")
- Tabs como scroll horizontal
- Contenido apilado en 1 columna

**Componentes:** PatientHeader, Tabs, KosmoBriefing, SessionCard, NoteQuickInput, StatusBadge, Button, EmptyState, FileUpload.

---

### 3.2.4 Vista "Antes de empezar" (`/patients/[id]/pre-session`)

**Propósito:** Cockpit pre-sesión. Natalia revisa todo el contexto relevante en 2-3 minutos antes de que entre el paciente.

**Layout (1 columna centrada, max-width 680px):**

1. **Header:** "Antes de empezar con [Nombre]" (Satoshi Bold, `--text-xl`)
2. **Briefing de Kosmo** (KosmoBriefing, prominente):
   - Resumen de la última sesión
   - Acuerdos pendientes
   - Puntos clave a retomar
   - Estado emocional detectado en notas previas (si aplica)
3. **Estado de cobro:** badge grande + texto
   - Si pendiente/vencido: CTA "Resolver cobro" (Warning/Danger)
   - Si pagado: texto verde confirmación
4. **Últimos acuerdos terapéuticos** (`client_notes`): lista de 3-5 más recientes
5. **Última nota** (`ideas`): preview de la nota más reciente
6. **CTA principal:** "Empezar sesión" (Primary, lg, full-width) → navega de vuelta a ficha o abre NoteQuickInput en modo sesión

**Componentes:** KosmoBriefing, StatusBadge, Button, NoteQuickInput.

---

### 3.2.5 Vista "Al terminar" (`/patients/[id]/post-session`)

**Propósito:** 3 acciones post-sesión. Rápido, sin fricción. Natalia tiene 5 minutos antes del siguiente paciente.

**Layout (1 columna centrada, max-width 680px):**

**Header:** "Sesión con [Nombre] — Cierre rápido" (Satoshi Bold, `--text-xl`)

**3 bloques secuenciales:**

**Bloque 1 — Nota de sesión:**
- NoteQuickInput (modo sesión) — guardado automático
- Placeholder: "¿Qué ha pasado en esta sesión? Observaciones, temas tratados…"
- Nudge Kosmo: "Kosmo puede generar un resumen después. Apunta lo esencial."

**Bloque 2 — Cobro:**
- Estado actual del cobro (badge)
- Si no hay cobro registrado: Formulario inline
  - Importe (input numérico, pre-filled con tarifa habitual)
  - Método de pago (Select: Efectivo, Bizum, Transferencia, Tarjeta)
  - Botón "Registrar cobro" (Primary, md)
- Si ya está pagado: confirmación visual

**Bloque 3 — Acuerdo terapéutico:**
- TextInput: "¿Qué habéis acordado para la próxima sesión?"
- Placeholder: "Ej: Practicar técnica de respiración 10 min/día"
- Botón "Guardar acuerdo" (Secondary, md)

**Footer:**
- Botón "Listo, volver al dashboard" (Primary, lg, full-width)
- Texto: "Todo se guarda automáticamente. Puedes volver a editar desde la ficha."

**Componentes:** NoteQuickInput, StatusBadge, TextInput, Select, Button, KosmoNudge.

---

### 3.2.6 Kosmo (`/kosmo` o panel lateral)

**Propósito:** Interfaz de chat/comandos con la IA Kosmo. Acceso a planificar el día, resúmenes semanales, preguntas sobre pacientes.

**Layout (panel lateral 400px o pantalla completa en móvil):**

1. **Header:** icono Kosmo + "Kosmo" (Satoshi Bold, `--text-xl`)
2. **Sugerencias rápidas** (chips clickeables):
   - "Planificar mi día"
   - "Resumen semanal"
   - "Parte de sesiones"
   - "Recordatorios pendientes"
3. **Chat:** historial de conversación
   - Mensajes de usuario: alineados derecha, fondo `--color-primary-subtle`
   - Mensajes de Kosmo: alineados izquierda, fondo `--color-kosmo-surface`, icono Kosmo
   - Typing indicator: 3 dots animados
4. **Input de mensaje:** TextInput + botón enviar (icono SendHorizontal)

**Funcionalidades accesibles desde Kosmo:**
- **Planificar día:** genera agenda con briefings por paciente
- **Resumen semanal:** genera parte con sesiones, cobros, acuerdos
- **Consulta sobre paciente:** "¿Qué acordamos con [Nombre] la última vez?"
- **Recordatorios:** "¿Quién tiene cobro pendiente?"

**Componentes:** KosmoIcon, KosmoChip, TextInput, Button, KosmoBriefing.

---

## 3.3 Finanzas

### 3.3.1 Cobros (`/billing`) — GAP documentado

> **Estado:** Pantalla futura. Especificación para desarrollo posterior.

**Propósito:** Vista global de facturación. Natalia ve al instante cuánto ha cobrado, qué falta, y puede actuar.

**Layout (desktop):**

1. **Header:** "Cobros" (Satoshi Bold, `--text-2xl`) + botón "Registrar cobro" (Primary, md)
2. **KPI Cards** (4 en fila):
   - Total cobrado (mes actual)
   - Pendiente de cobro
   - Cobros vencidos (> 30 días)
   - Tasa de cobro
3. **Filtros:** rango de fechas, estado (Todos, Pagado, Pendiente, Vencido), paciente
4. **Tabla de cobros:**
   - Columnas: Paciente | Fecha | Concepto | Importe | Estado (badge) | Método | Acciones
   - Ordenable por columna
   - Paginada (20 por página)
   - Acción por fila: "Marcar pagado", "Enviar recordatorio", "Ver ficha"
5. **Export:** botón "Exportar CSV" (Ghost, sm)

**Componentes:** KPICard, StatusBadge, Table, Button, Select, DatePicker.

---

## 3.4 Ajustes

### 3.4.1 Ajustes de cuenta (`/settings`)

**Propósito:** Gestión del perfil profesional, plan, preferencias.

**Secciones (tabs verticales en desktop, acordeón en móvil):**

1. **Perfil:**
   - Nombre, email, foto/avatar
   - Nombre de consulta, especialidad, ciudad
   - Tarifa por defecto (€/sesión)
   - Duración de sesión estándar (50 min por defecto)

2. **Facturación:**
   - Datos fiscales (NIF, dirección fiscal)
   - Numeración de facturas
   - Texto personalizable en facturas

3. **RGPD:**
   - Plantilla de consentimiento informado (editable)
   - Período de retención de datos
   - Enlace política de privacidad

4. **Integraciones:**
   - Google Calendar (conectar/desconectar)
   - Pasarela de pago (futura)

5. **Cuenta:**
   - Cambiar contraseña
   - Plan actual
   - Eliminar cuenta

**Componentes:** TextInput, Textarea, Select, Button, FileUpload, Toggle.

---

## 3.5 Landing

### 3.5.1 Landing Page (`/`)

**Propósito:** Convertir visitantes en registros. Transmitir la propuesta de valor de ClientKosmos.

**Secciones (top to bottom):**

1. **Header/Nav:**
   - Logo ClientKosmos (izquierda)
   - Links: Funciones, Precios, Contacto
   - Botones: "Iniciar sesión" (Ghost), "Prueba gratis" (Primary)

2. **Hero:**
   - Título: "Entra en cada sesión con el contexto listo" (Satoshi Black, `--text-3xl`)
   - Subtítulo: "Sal con el cobro encaminado y mantén todo lo legal bajo control." (`--text-lg`, `--color-text-secondary`)
   - CTA: "Empieza gratis" (Primary, lg)
   - Visual: mockup/screenshot de la ficha de paciente

3. **Pain points:**
   - "¿Te suena?" + 3 cards con problemas:
     - "5 minutos entre paciente y paciente, sin contexto"
     - "Facturas por hacer al final del mes"
     - "Consentimientos RGPD desperdigados"

4. **Funciones (3-4 bloques):**
   - **Contexto instantáneo:** briefing IA antes de cada sesión
   - **Cobro sin fricción:** registra el cobro en 10 segundos
   - **RGPD centralizado:** consentimientos y docs en un solo sitio
   - **Kosmo, tu asistente:** resúmenes, partes, recordatorios

5. **Diferenciación:**
   - Tabla comparativa sutil vs. competidores (sin nombrarlos):
     - "Sin módulos que no necesitas"
     - "Features core sin premium-gating"
     - "Hecho para tu día a día, no para captación de pacientes"

6. **Social proof:** testimonial o quote (cuando esté disponible)

7. **CTA final:**
   - "Tu consulta merece orden sin esfuerzo"
   - Botón "Crea tu cuenta gratis" (Primary, lg)

8. **Footer:**
   - Logo, links legales (Privacidad, Términos, RGPD), contacto, © 2026

**Componentes:** Button, Card (genérica).

---

# 4. Flujos de Navegación

## 4.1 Flujo de Onboarding

```
/register
  → Formulario de registro
  → Submit
  ↓
/onboarding (paso 1)
  → "Sobre tu consulta" (nombre, especialidad, ciudad)
  → Siguiente
  ↓
/onboarding (paso 2)
  → "Tu primer paciente" (nombre, motivo, enfoque, próxima sesión)
  → Siguiente (o "Lo haré después")
  ↓
/onboarding (paso 3)
  → Resumen + CTA "Ir a mi consulta"
  ↓
/dashboard
  → Dashboard con primer paciente (si se creó) o empty state
  → Kosmo: nudge "Añade tu primer paciente" (si se saltó paso 2)
```

**Decisión clave:** El paso 2 es omitible para reducir fricción, pero se incentiva completarlo. Si se omite, el dashboard muestra empty state y Kosmo sugiere añadir un paciente.

---

## 4.2 Flujo de Sesión (el más crítico)

```
/dashboard
  → Natalia ve la agenda del día
  → Click "Preparar sesión" en el paciente siguiente
  ↓
/patients/[id]/pre-session
  → Lee el briefing de Kosmo (2-3 min)
  → Revisa acuerdos pendientes
  → Verifica estado de cobro
  → Click "Empezar sesión"
  ↓
[SESIÓN EN CURSO — fuera de la app]
  → Opcionalmente: NoteQuickInput abierto en segundo plano
  ↓
/patients/[id]/post-session
  → Bloque 1: escribe nota rápida (guardado auto)
  → Bloque 2: registra cobro (si aplica)
  → Bloque 3: deja acuerdo para próxima sesión
  → Click "Listo, volver al dashboard"
  ↓
/dashboard
  → Dashboard actualizado, siguiente paciente destacado
  → Ciclo se repite
```

**Tiempo target:** Pre-session < 3 min, Post-session < 2 min. Total overhead por paciente: ~5 min.

---

## 4.3 Flujo de Cobro

```
Desde ficha de paciente (/patients/[id]):
  → Tab "Cobros" o botón "Registrar cobro" en header
  ↓
Formulario inline o modal:
  → Importe (pre-filled con tarifa habitual)
  → Método de pago
  → Fecha (pre-filled con hoy)
  → Submit
  ↓
Confirmación:
  → Toast "Cobro registrado ✓" (success)
  → Badge del paciente actualizado a "Pagado"
  → Registro visible en tab "Cobros" y en /billing

Alternativa desde post-session:
  → Bloque 2 del cierre rápido incluye el mismo formulario inline
  → Misma confirmación
```

---

## 4.4 Flujo de Kosmo

```
Trigger 1 — Dashboard (/dashboard):
  → Briefing diario auto-generado
  → Natalia lee el resumen
  → Clicks opcionales en acciones sugeridas

Trigger 2 — Pre-session (/patients/[id]/pre-session):
  → Briefing contextual del paciente
  → Contenido: resumen última sesión, acuerdos, puntos clave
  → No requiere acción, solo lectura

Trigger 3 — Nudge inline (cualquier pantalla):
  → Kosmo detecta algo que necesita atención
  → Ejemplo: "Llevas 2 sesiones sin registrar cobro de María"
  → Nudge dismissible con acción directa

Trigger 4 — Chat directo (/kosmo):
  → Natalia abre el panel de Kosmo
  → Escribe pregunta o selecciona sugerencia rápida
  → Kosmo responde con datos estructurados
  → Acciones inline si aplica ("Ver ficha", "Registrar cobro")
```

---

## 4.5 Flujo de Cambio de Paciente (escenario crítico)

**Contexto:** Natalia termina una sesión y tiene 5 minutos antes de la siguiente. Este flujo debe ser fluido y rápido.

```
Sesión con Paciente A termina
  ↓
/patients/[A]/post-session
  → Nota rápida (30s - 1min)
  → Registrar cobro (15s si pre-filled)
  → Dejar acuerdo (30s)
  → Click "Listo, volver al dashboard" (1 transición)
  ↓
/dashboard
  → Siguiente paciente (B) destacado con borde primary
  → Click "Preparar sesión" (1 click)
  ↓
/patients/[B]/pre-session
  → Briefing de Kosmo ya cargado
  → Lectura 1-2 min
  → Ready
```

**Claves de diseño para este flujo:**
- **0 scroll innecesario:** todo el contenido clave above the fold
- **Pre-fill agresivo:** importe, fecha, método de pago recordado
- **Guardado automático:** notas se guardan sin botón, sin confirmación
- **1 click entre vistas:** no hay modales intermedios ni confirmaciones innecesarias
- **Dashboard como hub:** siempre vuelve al dashboard entre pacientes
- **Siguiente paciente prominente:** borde primary + posición destacada en agenda

---

# 5. Contenido por Pantalla (detallado)

## 5.1 Dashboard / Hoy (`/dashboard`)

### Layout Desktop

```
┌─────────────────────────────────────────────────────────┐
│ SIDEBAR (240px)  │            MAIN CONTENT              │
│                  │                                       │
│  ClientKosmos    │  ┌─ Saludo + fecha ────────────────┐  │
│                  │  │ Buenos días, Natalia        08/04 │  │
│  ● Hoy          │  └─────────────────────────────────┘  │
│  ○ Pacientes     │                                       │
│  ○ Kosmo         │  ┌─ Briefing Kosmo ───────┐ ┌─ Alertas ──┐
│  ○ Cobros        │  │ ✦ Hoy tienes 4        │ │ ⚠ María:    │
│                  │  │   sesiones. Ana tiene  │ │   cobro     │
│  ─────           │  │   cobro pendiente     │ │   vencido   │
│  ○ Ajustes       │  │   desde hace 15 días. │ │ 🟣 Pedro:   │
│                  │  └───────────────────────┘ │   falta     │
│  [Avatar]        │                            │   consent.  │
│                  │  ┌─ Agenda del día ────────┐ └────────────┘
│                  │  │ 09:00 Ana García   [→]  │              │
│                  │  │ 10:00 Pedro López  [→]  │ ┌─ KPIs ──┐ │
│                  │  │ 11:00 María Ruiz   [→]  │ │ 4 ses.  │ │
│                  │  │ 12:30 Laura Torres [→]  │ │ €120 pend│ │
│                  │  └───────────────────────┘ │ │ 6 activos│ │
│                  │                            │ │ 85% tasa │ │
│                  │                            │ └──────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Textos y labels

| Elemento | Texto | Token tipográfico |
|---|---|---|
| Saludo | "Buenos días, [Nombre]" / "Buenas tardes, [Nombre]" (según hora) | Satoshi Bold, `--text-2xl` |
| Fecha | "Miércoles, 8 de abril de 2026" | Inter Regular, `--text-md`, `--color-text-secondary` |
| Briefing título | "Tu día de un vistazo" | Satoshi Bold, `--text-sm` |
| Sección agenda | "Agenda de hoy" | Satoshi Bold, `--text-lg` |
| Sección alertas | "Necesita atención" | Satoshi Bold, `--text-lg` |
| Sección KPIs | "Esta semana" | Satoshi Bold, `--text-lg` |
| CTA agenda item | "Preparar sesión" | Inter Medium, `--text-sm`, `--color-primary` |
| Sin sesiones hoy | "No hay sesiones programadas para hoy. ¡Disfruta el descanso!" | Ver EmptyState |

### Datos de Kosmo

Kosmo genera el briefing diario con:
- Número de sesiones del día
- Alertas activas (cobros, consentimientos)
- Recordatorio de acuerdos importantes
- Si hay sesiones difíciles (basado en notas previas): nota empática

El briefing se muestra en el componente `KosmoBriefing` en la columna principal, justo debajo del saludo.

### Priorización de acciones

1. **Preparar siguiente sesión** — acción primaria, botón Primary en la sesión más próxima
2. **Resolver alertas** — cada alerta tiene link directo a la ficha del paciente
3. **Ver KPIs** — informativo, sin acción directa

### Móvil

- Saludo + fecha: stack vertical
- Briefing Kosmo: colapsable (expandido por defecto)
- Agenda: lista full-width, sesión próxima arriba
- Alertas: scroll horizontal de mini-cards
- KPIs: grid 2x2 compacto
- Bottom bar con 4 items

---

## 5.2 Ficha de Paciente (`/patients/[id]`)

### Layout Desktop

```
┌─────────────────────────────────────────────────────────┐
│ SIDEBAR │                                                │
│         │  ┌─ Patient Header (sticky) ─────────────────┐ │
│         │  │ ← │ 🧑 Ana García │ Pagado │ Preparar │ Cobro │
│         │  └────────────────────────────────────────────┘ │
│         │                                                │
│         │  [ Resumen | Acuerdos | Notas | Documentos | Cobros ]
│         │                                                │
│         │  ┌─ TAB RESUMEN ─────────────────────────────┐ │
│         │  │                                            │ │
│         │  │ ┌─ Datos principales ──┐ ┌─ Briefing ──┐  │ │
│         │  │ │ Motivo: Ansiedad    │ │ ✦ Kosmo:    │  │ │
│         │  │ │ Enfoque: TCC        │ │   En la     │  │ │
│         │  │ │ Próxima: 10/04 10:00│ │   última    │  │ │
│         │  │ └─────────────────────┘ │   sesión... │  │ │
│         │  │                         └─────────────┘  │ │
│         │  │ ┌─ Acuerdos activos ─────────────────┐   │ │
│         │  │ │ ☐ Practicar respiración 10 min/día │   │ │
│         │  │ │ ☑ Llevar diario de emociones       │   │ │
│         │  │ └────────────────────────────────────┘   │ │
│         │  │                                          │ │
│         │  │ ┌─ Últimas sesiones ──────────────────┐  │ │
│         │  │ │ 05/04 — 50 min — "Trabajamos..."   │  │ │
│         │  │ │ 01/04 — 50 min — "Revisamos..."    │  │ │
│         │  │ └────────────────────────────────────┘  │ │
│         │  │                                          │ │
│         │  │ [ Preparar sesión ]  [ Al terminar ]     │ │
│         │  └──────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Textos y labels

| Elemento | Label mostrado | Campo BD |
|---|---|---|
| Nombre | (se muestra como H1) | `project_name` |
| Motivo | "Motivo de consulta" | `service_scope` |
| Enfoque | "Enfoque terapéutico" | `brand_tone` |
| Próxima sesión | "Próxima sesión" | `next_deadline` |
| Acuerdos | "Acuerdos terapéuticos" | `client_notes` |
| Notas | "Notas de sesión" | `ideas` |
| Documentos | "Documentos" | `recursos/adjuntos` |

| Placeholder / Empty | Texto |
|---|---|
| Input nota | "Escribe una nota rápida…" |
| Input acuerdo | "Nuevo acuerdo terapéutico…" |
| Notas vacías | "Aquí irán tus notas de sesión y observaciones clave." |
| Docs vacíos | "Guarda aquí los consentimientos RGPD, informes y documentos del paciente." |
| Sin sesiones | "Las sesiones aparecerán aquí conforme las vayas completando." |

### Datos de Kosmo

En tab Resumen, Kosmo muestra:
- Briefing contextual: resumen de la evolución del paciente
- Últimos puntos clave de notas
- Acuerdos que se van cumpliendo vs. pendientes

Ubicación: componente `KosmoBriefing` en la parte derecha de la sección de datos principales (desktop) o debajo de datos principales (móvil).

### Priorización de acciones

1. **Preparar sesión** (Primary) — solo si `next_deadline` es hoy o mañana
2. **Registrar cobro** (Primary sm en header) — siempre visible
3. **Nueva nota** (Secondary sm en header) — siempre visible
4. **Subir documento** — dentro del tab Documentos
5. **Editar datos** — icono lápiz discreto junto a cada campo editable

### Móvil

- Header compacto: nombre + badges. Acciones en menú "..." (3 dots)
- Tabs: scroll horizontal (Resumen, Acuerdos, Notas, Docs, Cobros)
- Tab Resumen: todo en 1 columna, briefing Kosmo colapsable
- Botones "Preparar sesión" y "Al terminar": sticky bottom bar dentro del tab Resumen

---

## 5.3 Vista "Antes de empezar" (`/patients/[id]/pre-session`)

### Layout Desktop

```
┌──────────────────────────────────────────────┐
│ SIDEBAR │                                     │
│         │  ← Volver a ficha                   │
│         │                                     │
│         │  Antes de empezar con Ana García     │
│         │  ════════════════════════════════     │
│         │                                     │
│         │  ┌─ BRIEFING KOSMO ──────────────┐  │
│         │  │ ✦ Resumen para tu sesión      │  │
│         │  │                               │  │
│         │  │ En la última sesión (05/04),   │  │
│         │  │ Ana comentó avances con la     │  │
│         │  │ técnica de respiración pero    │  │
│         │  │ sigue con dificultad para      │  │
│         │  │ dormir. Acordasteis que        │  │
│         │  │ practicaría 10 min/día.        │  │
│         │  │                               │  │
│         │  │ Puntos clave:                 │  │
│         │  │ • Revisar ejercicio de resp.   │  │
│         │  │ • Preguntar por sueño         │  │
│         │  │ • Valorar añadir relajación   │  │
│         │  └──────────────────────────────┘  │
│         │                                     │
│         │  ┌─ Estado de cobro ─────────────┐  │
│         │  │ ✅ Pagado — Última sesión      │  │
│         │  └──────────────────────────────┘  │
│         │  (si pendiente: ⚠ Pendiente desde  │
│         │   01/04 — [Resolver cobro])         │
│         │                                     │
│         │  ┌─ Acuerdos activos ────────────┐  │
│         │  │ ☐ Practicar respiración 10min │  │
│         │  │ ☑ Llevar diario de emociones  │  │
│         │  │ ☐ Reducir cafeína por tarde   │  │
│         │  └──────────────────────────────┘  │
│         │                                     │
│         │  ┌─ Última nota ─────────────────┐  │
│         │  │ 05/04: "Buena actitud.        │  │
│         │  │ Menciona problemas con el     │  │
│         │  │ sueño desde hace 2 semanas.   │  │
│         │  │ Posible relación con estrés   │  │
│         │  │ laboral."                     │  │
│         │  └──────────────────────────────┘  │
│         │                                     │
│         │  ┌──────────────────────────────┐  │
│         │  │    [ Empezar sesión ]  ████   │  │
│         │  └──────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

### Textos y labels

| Elemento | Texto |
|---|---|
| Título | "Antes de empezar con [Nombre]" |
| Briefing título | "Resumen para tu sesión" |
| Sección cobro (pagado) | "Cobro al día" + icono check verde |
| Sección cobro (pendiente) | "Cobro pendiente desde [fecha]" + badge warning |
| Sección cobro (vencido) | "Cobro vencido — [días] días" + badge error + CTA "Resolver cobro" |
| Sección acuerdos | "Acuerdos activos" |
| Sección nota | "Última nota" |
| CTA principal | "Empezar sesión" |
| Botón back | "← Volver a ficha" |

### Datos de Kosmo

Kosmo genera el briefing con los siguientes datos (procesamiento automático):
- **Resumen narrativo** de la última sesión (basado en `ideas` del paciente)
- **Acuerdos pendientes** (de `client_notes`, no completados)
- **Puntos clave a retomar** (extraídos de notas recientes)
- **Alerta de cobro** (si hay cobro pendiente/vencido)

El briefing se presenta como texto estructurado con bullets, no como chat.

### Priorización de acciones

1. **Leer briefing** — primer elemento visual, el más prominente
2. **Resolver cobro** (solo si hay pendiente) — CTA warning/danger
3. **Empezar sesión** — CTA primario al final, full-width

### Móvil

- Layout idéntico (1 columna), max-width adaptado a pantalla
- Briefing Kosmo: expandido por defecto
- CTA "Empezar sesión": sticky en bottom
- Todo el contenido above the fold excepto la última nota (requiere scroll mínimo)

---

# 6. Tokens CSS Finales

Bloque completo listo para copiar en un archivo CSS.

```css
/* =========================================
   ClientKosmos Design System — CSS Tokens
   ========================================= */

/* --- Fonts --- */
@import url('https://api.fontshare.com/v2/css?f[]=satoshi@500,700,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&display=swap');

/* =========================================
   Light Mode (default)
   ========================================= */
:root {
  /* --- Fonts --- */
  --font-display: 'Satoshi', 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* --- Typography Scale --- */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-md: 1rem;         /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.5rem;       /* 24px */
  --text-2xl: 2rem;        /* 32px */
  --text-3xl: 3rem;        /* 48px */

  /* --- Line Heights --- */
  --leading-xs: 1rem;      /* 16px */
  --leading-sm: 1.25rem;   /* 20px */
  --leading-md: 1.5rem;    /* 24px */
  --leading-lg: 1.75rem;   /* 28px */
  --leading-xl: 2rem;      /* 32px */
  --leading-2xl: 2.5rem;   /* 40px */
  --leading-3xl: 3.5rem;   /* 56px */

  /* --- Letter Spacing --- */
  --tracking-tight: -0.03em;
  --tracking-snug: -0.02em;
  --tracking-normal: 0em;
  --tracking-wide: 0.01em;
  --tracking-wider: 0.02em;

  /* --- Colors: Core --- */
  --color-primary: #1A7B6E;
  --color-primary-hover: #135E54;
  --color-primary-subtle: #E6F5F2;
  --color-primary-fg: #FFFFFF;

  /* --- Colors: Surfaces --- */
  --color-bg: #FAF8F5;
  --color-surface: #FFFFFF;
  --color-surface-alt: #F5F2ED;

  /* --- Colors: Borders --- */
  --color-border: #E0DBD3;
  --color-border-subtle: #EBE7E0;

  /* --- Colors: Text --- */
  --color-text: #2C2825;
  --color-text-secondary: #7A746C;
  --color-text-muted: #B5AFA7;

  /* --- Colors: Semantic — Success --- */
  --color-success: #2D8044;
  --color-success-subtle: #E8F5EC;
  --color-success-fg: #1B5E2E;

  /* --- Colors: Semantic — Warning --- */
  --color-warning: #C48820;
  --color-warning-subtle: #FEF5E0;
  --color-warning-fg: #8A5E10;

  /* --- Colors: Semantic — Error --- */
  --color-error: #B83A3A;
  --color-error-subtle: #FCEAEA;
  --color-error-fg: #8C2020;

  /* --- Colors: Semantic — Info --- */
  --color-info: #3578B2;
  --color-info-subtle: #E6F0FA;
  --color-info-fg: #1E5280;

  /* --- Colors: Semantic — Indigo (Sin consentimiento) --- */
  --color-indigo: #6246A8;
  --color-indigo-subtle: #F0ECF8;
  --color-indigo-fg: #4A3280;

  /* --- Colors: Semantic — Orange (Acuerdo sin cerrar) --- */
  --color-orange: #D47020;
  --color-orange-subtle: #FEF0E0;
  --color-orange-fg: #9A4E10;

  /* --- Colors: Kosmo AI --- */
  --color-kosmo: #1A7B6E;
  --color-kosmo-surface: #ECF7F5;
  --color-kosmo-border: #C2E4DE;

  /* --- Spacing (4px base) --- */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */

  /* --- Border Radius --- */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 20px;
  --radius-full: 9999px;

  /* --- Shadows --- */
  --shadow-sm: 0 1px 2px 0 rgba(44, 40, 37, 0.06);
  --shadow-md: 0 4px 12px -2px rgba(44, 40, 37, 0.10), 0 2px 4px -2px rgba(44, 40, 37, 0.06);
  --shadow-lg: 0 12px 32px -4px rgba(44, 40, 37, 0.14), 0 4px 12px -4px rgba(44, 40, 37, 0.08);

  /* --- Z-Index --- */
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-modal: 400;
  --z-toast: 500;

  /* --- Animation --- */
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 350ms;
  --easing-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
  --easing-enter: cubic-bezier(0.0, 0.0, 0.2, 1);
  --easing-exit: cubic-bezier(0.4, 0.0, 1, 1);
}

/* =========================================
   Dark Mode
   ========================================= */
[data-theme="dark"] {
  /* --- Colors: Core --- */
  --color-primary: #4ABEAB;
  --color-primary-hover: #6DD0C0;
  --color-primary-subtle: #1A2E2B;
  --color-primary-fg: #111A18;

  /* --- Colors: Surfaces --- */
  --color-bg: #161412;
  --color-surface: #1E1C19;
  --color-surface-alt: #252320;

  /* --- Colors: Borders --- */
  --color-border: #3A3733;
  --color-border-subtle: #2E2C28;

  /* --- Colors: Text --- */
  --color-text: #E5E0DA;
  --color-text-secondary: #9A958D;
  --color-text-muted: #5E5A54;

  /* --- Colors: Semantic — Success --- */
  --color-success: #5CB86E;
  --color-success-subtle: #1A2E1E;
  --color-success-fg: #7CD48A;

  /* --- Colors: Semantic — Warning --- */
  --color-warning: #E0A840;
  --color-warning-subtle: #2E2518;
  --color-warning-fg: #F0C060;

  /* --- Colors: Semantic — Error --- */
  --color-error: #E06060;
  --color-error-subtle: #2E1A1A;
  --color-error-fg: #F08080;

  /* --- Colors: Semantic — Info --- */
  --color-info: #5A9ED6;
  --color-info-subtle: #1A2530;
  --color-info-fg: #80B8E8;

  /* --- Colors: Semantic — Indigo --- */
  --color-indigo: #9A7ED6;
  --color-indigo-subtle: #231E30;
  --color-indigo-fg: #B8A0E8;

  /* --- Colors: Semantic — Orange --- */
  --color-orange: #E89850;
  --color-orange-subtle: #2E2018;
  --color-orange-fg: #F0B070;

  /* --- Colors: Kosmo AI --- */
  --color-kosmo: #4ABEAB;
  --color-kosmo-surface: #1A2825;
  --color-kosmo-border: #2A4A42;

  /* --- Shadows (dark mode — stronger opacity) --- */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.16);
  --shadow-md: 0 4px 12px -2px rgba(0, 0, 0, 0.24), 0 2px 4px -2px rgba(0, 0, 0, 0.16);
  --shadow-lg: 0 12px 32px -4px rgba(0, 0, 0, 0.32), 0 4px 12px -4px rgba(0, 0, 0, 0.20);
}

/* =========================================
   Accessibility: Reduced Motion
   ========================================= */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* =========================================
   Base Typography Classes
   ========================================= */
.text-display-3xl {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  line-height: var(--leading-3xl);
  letter-spacing: var(--tracking-tight);
  font-weight: 900;
}

.text-display-2xl {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  line-height: var(--leading-2xl);
  letter-spacing: var(--tracking-snug);
  font-weight: 700;
}

.text-display-xl {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  line-height: var(--leading-xl);
  letter-spacing: var(--tracking-snug);
  font-weight: 700;
}

.text-display-lg {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  line-height: var(--leading-lg);
  letter-spacing: -0.01em;
  font-weight: 700;
}

.text-body-lg {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  line-height: var(--leading-lg);
  letter-spacing: -0.01em;
  font-weight: 400;
}

.text-body-md {
  font-family: var(--font-body);
  font-size: var(--text-md);
  line-height: var(--leading-md);
  letter-spacing: var(--tracking-normal);
  font-weight: 400;
}

.text-body-sm {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  letter-spacing: var(--tracking-wide);
  font-weight: 400;
}

.text-caption {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  line-height: var(--leading-xs);
  letter-spacing: var(--tracking-wider);
  font-weight: 400;
}

.text-label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  letter-spacing: var(--tracking-wide);
  font-weight: 500;
}

.text-kpi {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  line-height: var(--leading-2xl);
  letter-spacing: var(--tracking-snug);
  font-weight: 700;
  font-variant-numeric: tabular-nums lining-nums;
}

.text-mono {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  letter-spacing: var(--tracking-normal);
  font-weight: 400;
}
```

---

# Apéndice A — Mapeo de campos BD → UI

| Campo interno (BD) | Label visible en UI | Dónde se muestra |
|---|---|---|
| `project_name` | Nombre del paciente / caso | Header ficha, PatientCard, listas |
| `brand_tone` | Enfoque terapéutico | Ficha resumen, PatientCard |
| `service_scope` | Motivo de consulta | Ficha resumen, pre-session |
| `next_deadline` | Próxima sesión | Ficha, PatientCard, dashboard |
| `client_notes` | Acuerdos terapéuticos | Tab Acuerdos, pre-session, post-session |
| `ideas` | Notas de sesión | Tab Notas, post-session |
| `recursos/adjuntos` | Documentos (RGPD, informes, docs legales) | Tab Documentos |

---

# Apéndice B — Iconos (Lucide React)

El sistema usa **Lucide React** como librería de iconos. Tamaño base: 20px en desktop, 24px en bottom bar móvil.

| Concepto | Icono Lucide | Uso |
|---|---|---|
| Dashboard / Hoy | `CalendarDays` | Nav sidebar, bottom bar |
| Pacientes | `Users` | Nav sidebar, bottom bar |
| Kosmo IA | `Sparkles` | Nav, chips, briefings |
| Cobros | `Receipt` | Nav sidebar |
| Ajustes | `Settings` | Nav sidebar, bottom bar |
| Nueva nota | `PenLine` | Acciones rápidas |
| Registrar cobro | `BadgeEuro` | Acciones rápidas |
| Subir documento | `Upload` | Tab documentos |
| Buscar | `Search` | Barra de búsqueda |
| Volver | `ArrowLeft` | Headers internos |
| Cerrar | `X` | Modales, toasts, nudges |
| Alerta | `AlertTriangle` | Warnings |
| Check | `CheckCircle` | Success, completados |
| Error | `XCircle` | Errores |
| Info | `Info` | Información |
| Calendario | `Calendar` | DatePicker, sesiones |
| Más opciones | `MoreHorizontal` | Menús contextuales |
| Enviar | `SendHorizontal` | Chat Kosmo |

---

# Apéndice C — Breakpoints Responsive

| Token | Valor | Uso |
|---|---|---|
| `sm` | 640px | Móvil grande |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop (sidebar visible) |
| `xl` | 1280px | Desktop amplio |
| `2xl` | 1536px | Pantalla grande |

**Reglas:**
- `< md` (768px): bottom bar, sin sidebar, layout 1 columna
- `>= lg` (1024px): sidebar visible, layout multi-columna
- Sidebar colapsa a iconos en `md-lg` (768-1024px)

---

# Apéndice D — Principios de Accesibilidad

1. **WCAG AA obligatorio:** contraste 4.5:1 body, 3:1 texto grande (18px+)
2. **Focus visible:** todos los elementos interactivos tienen `focus-visible` outline de 2px `--color-primary`
3. **Navegación por teclado:** Tab order lógico, sin trampas de foco
4. **Screen readers:** `aria-label` en icon-only buttons, `role="alert"` en errores, `role="status"` en badges dinámicos
5. **Color no es único canal:** badges siempre tienen texto, no solo color
6. **Reduced motion:** todas las animaciones respetan `prefers-reduced-motion`
7. **Target size:** elementos clickeables mínimo 44x44px en móvil
8. **Idioma:** `lang="es"` en `<html>`

---

*ClientKosmos Design System v1.0 — Abril 2026*
*Documento generado para el equipo de desarrollo y diseño.*
