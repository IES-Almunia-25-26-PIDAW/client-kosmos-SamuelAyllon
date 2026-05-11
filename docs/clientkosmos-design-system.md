# ClientKosmos — Design System (versión compacta)

**Objetivo:** servir como referencia breve para IA y desarrollo, manteniendo solo lo esencial.
**Stack:** Laravel + React + Inertia.js. **IA:** Kosmo.
**Principio:** calma, confianza y claridad; un acento + neutros cálidos; accesibilidad WCAG AA.

## 1) Reglas de diseño
- Calidez visual: beige/crema, evitar blanco puro y grises fríos.
- Un solo acento principal: teal cálido para CTAs, enlaces y estados activos.
- Sin decoración innecesaria: jerarquía, espacio y tipografía hacen el trabajo.
- Texto mínimo 12px, contraste AA obligatorio, foco visible, soporte `prefers-reduced-motion`.

## 2) Tokens base
### Color
**Light**
- `--color-primary #1A7B6E`
- `--color-primary-hover #135E54`
- `--color-primary-subtle #E6F5F2`
- `--color-bg #FAF8F5`
- `--color-surface #FFFFFF`
- `--color-surface-alt #F5F2ED`
- `--color-border #E0DBD3`
- `--color-border-subtle #EBE7E0`
- `--color-text #2C2825`
- `--color-text-secondary #7A746C`
- `--color-text-muted #B5AFA7`
- Semánticos: success `#2D8044`, warning `#C48820`, error `#B83A3A`, info `#3578B2`, indigo `#6246A8`, orange `#D47020`.

**Dark**
- `--color-primary #4ABEAB`
- `--color-primary-hover #6DD0C0`
- `--color-bg #161412`
- `--color-surface #1E1C19`
- `--color-surface-alt #252320`
- `--color-border #3A3733`
- `--color-text #E5E0DA`
- Semánticos ajustados a tonos más claros para contraste.

### Tipografía
- Display: **Satoshi**
- Body: **Inter**
- Mono: **JetBrains Mono**
- Escala: 12 / 14 / 16 / 18 / 24 / 32 / 48 px
- Regla: headings en Satoshi, body en Inter, números con tabular-nums.

### Espaciado, radio, sombras, motion
- Espaciado base 4px: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96.
- Radius: sm 4, md 8, lg 12, xl 20, full 9999.
- Sombras: sm / md / lg, suaves; en dark mode usar opacidades más altas.
- Motion: fast 100ms, normal 200ms, slow 350ms.
- Z-index: base 0, dropdown 100, sticky 200, overlay 300, modal 400, toast 500.

## 3) Componentes base
### Botón
- Variantes: primary, secondary, ghost, danger.
- Tamaños: sm 32px, md 40px, lg 48px.
- Estados: hover, active, disabled, loading.
- Icon-only: siempre con `aria-label` y `title`.

### StatusBadge
- Estados: pagado, pendiente, vencido, sin consentimiento, acuerdo sin cerrar.
- Formato pill, texto siempre visible; no depender solo del color.
- Variante filled y subtle.

### Cards
- **PatientCard:** nombre, enfoque, próxima sesión, badges. Card clicable.
- **SessionCard:** fecha/hora, duración, resumen Kosmo, nota rápida.
- **KPICard:** label, valor, delta, sparkline opcional.

### Formularios
- Base: fondo surface, borde border, radio md, altura 40px.
- Focus: border primary + ring suave.
- Error: border error + role alert.
- Inputs clave: TextInput, Textarea, Select, DatePicker, FormField.
- **NoteQuickInput:** textarea expandible con autosave; modo sesión usa superficie Kosmo.

### Navegación
- **Sidebar desktop:** 240px, colapsable a 64px. Items: Hoy, Pacientes, Kosmo, Cobros, Ajustes.
- **Bottom bar móvil:** Hoy, Pacientes, Kosmo, Ajustes.
- **PatientHeader:** sticky, avatar + nombre + badges + acciones rápidas.

### Kosmo
- **KosmoIcon:** sparkles/estrella en color Kosmo.
- **KosmoChip:** etiqueta de contenido IA.
- **KosmoBriefing:** bloque destacado con resumen, acciones y borde Kosmo.
- **KosmoNudge:** sugerencia inline, dismissible.

### Estados vacíos y notificaciones
- Empty state: icono sutil, título empático, descripción breve y CTA si aplica.
- Toasts: success / warning / error / info, auto-dismiss según severidad.

## 4) Arquitectura de pantallas
### Rutas
`/` landing · `/login` · `/register` · `/onboarding` · `/dashboard` · `/patients` · `/patients/[id]` · `/patients/[id]/pre-session` · `/patients/[id]/post-session` · `/kosmo` · `/billing` · `/settings`

### Landing
- Hero: propuesta de valor + CTA.
- Pain points, funciones, diferenciación, social proof, CTA final.

### Auth + onboarding
- Login / register simples, centrados.
- Onboarding de 3 pasos: consulta, primer paciente (opcional), resumen final.

### Dashboard / Hoy
- Layout desktop 2 columnas; móvil 1 columna.
- Incluye saludo, briefing de Kosmo, agenda, alertas y KPIs.

### Pacientes
- Lista con búsqueda, filtros y grid responsive.
- Ficha de paciente: resumen, acuerdos, notas, documentos y cobros.
- Pre-session: revisar contexto en 2–3 min.
- Post-session: nota rápida, cobro y acuerdo terapéutico.

### Kosmo
- Chat lateral o pantalla completa en móvil.
- Sugerencias rápidas: planificar día, resumen semanal, parte de sesiones, recordatorios.

### Cobros
- Vista global de facturación: KPIs, filtros, tabla, export CSV.
- Actualmente marcada como gap/futura en el documento original.

### Ajustes
- Perfil, facturación, RGPD, integraciones, cuenta.

## 5) Accesibilidad mínima
- WCAG AA.
- Focus visible en todos los elementos interactivos.
- Todo input con label asociado.
- Errores con `role="alert"`.
- Badges dinámicos con `role="status"`.
- Objetivo táctil mínimo 44x44 en móvil.
- `lang="es"`.

## 6) Reglas de uso rápido para IA
- Priorizar tokens, componentes base y rutas principales.
- No repetir código JSX salvo que sea estrictamente necesario.
- Para prompts: describir solo objetivo, pantalla, componentes y reglas visuales.
- Si falta detalle, usar esta jerarquía: tokens → componente → pantalla → estado.

## 7) Snippet CSS mínimo
```css
:root {
  --font-display: 'Satoshi', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-md: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.5rem;
  --text-2xl: 2rem;
  --text-3xl: 3rem;

  --color-primary: #1A7B6E;
  --color-primary-hover: #135E54;
  --color-primary-subtle: #E6F5F2;
  --color-bg: #FAF8F5;
  --color-surface: #FFFFFF;
  --color-surface-alt: #F5F2ED;
  --color-border: #E0DBD3;
  --color-border-subtle: #EBE7E0;
  --color-text: #2C2825;
  --color-text-secondary: #7A746C;
  --color-text-muted: #B5AFA7;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;

  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 2px rgba(44, 40, 37, 0.06);
  --shadow-md: 0 4px 12px rgba(44, 40, 37, 0.10);
  --shadow-lg: 0 12px 32px rgba(44, 40, 37, 0.14);
}
```
