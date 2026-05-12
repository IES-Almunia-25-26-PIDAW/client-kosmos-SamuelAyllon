---
adr: "0003"
title: "Corrección sistémica: type=\"submit\" obligatorio en Button dentro de formularios Inertia v2"
date: 2026-04-20
status: Aceptado
---

# ADR-0003 — Corrección sistémica: `type="submit"` obligatorio en `Button` dentro de formularios Inertia v2

## Contexto

Durante la validación visual (Fase 3a) se detectó que múltiples formularios no respondían al botón de envío. El componente `Button` delega en `ChakraButton` de Chakra UI v3, el cual establece `type="button"` por defecto (comportamiento intencional de Chakra para prevenir envíos accidentales). El patrón anterior con shadcn/Radix no tenía este comportamiento; los botones sin `type` explícito dentro de un `<form>` heredaban el default HTML (`type="submit"`). La migración a Chakra UI rompió silenciosamente todos los botones de envío que no declaraban `type` explícitamente.

Un segundo patrón problemático: `<Button asChild><button type="submit">` — Chakra mezcla sus props sobre el hijo y sobreescribe `type="submit"` con `type="button"`.

## Decisión

1. Todo `<Button>` que actúe como envío de formulario debe llevar **`type="submit"` explícito**.
2. Eliminar el patrón `<Button asChild><button type="submit">` — usar `<Button type="submit">` directamente.
3. Los botones que cancelan o cierran dentro de un `<form>` deben llevar **`type="button"` explícito** para no enviar el formulario accidentalmente.

Archivos corregidos en esta sesión:

| Archivo | Botón | Fix |
|---------|-------|-----|
| [`resources/js/components/delete-user.tsx`](../../resources/js/components/delete-user.tsx) | Eliminar cuenta | `asChild` → `type="submit"` + `loading` prop |
| [`resources/js/components/delete-user.tsx`](../../resources/js/components/delete-user.tsx) | Cancelar | añadido `type="button"` |
| [`resources/js/pages/auth/confirm-password.tsx`](../../resources/js/pages/auth/confirm-password.tsx) | Confirmar contraseña | añadido `type="submit"` |
| [`resources/js/pages/auth/forgot-password.tsx`](../../resources/js/pages/auth/forgot-password.tsx) | Enviar enlace | añadido `type="submit"` |
| [`resources/js/pages/settings/password.tsx`](../../resources/js/pages/settings/password.tsx) | Guardar contraseña | añadido `type="submit"` |
| [`resources/js/pages/settings/profile.tsx`](../../resources/js/pages/settings/profile.tsx) | Guardar perfil | añadido `type="submit"` |

## Consecuencias

**Positivas**
- Todos los flujos de autenticación y configuración vuelven a funcionar correctamente.
- Regla explícita documentada para futuros desarrolladores: cualquier `Button` de envío dentro de `<Form>` de Inertia requiere `type="submit"`.

**Negativas / seguimiento**
- Pendiente auditar los formularios en páginas de pacientes, citas y admin que usan `useForm` de Inertia (patrón nativo `<form onSubmit>`). Ese patrón no está afectado por el bug de Chakra, pero debe verificarse si alguno usa `<Button>` sin tipo dentro de un `<form>` HTML estándar.
