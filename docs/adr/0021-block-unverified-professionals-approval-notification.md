---
adr: "0021"
title: Bloqueo de profesionales no verificados y notificación de aprobación
date: 2026-05-01
status: Aceptado
---

# ADR-0021 — Bloqueo de profesionales no verificados y notificación de aprobación

## Contexto

El requisito de negocio establece que un profesional, además de verificar su email, necesita aprobación manual del admin para empezar a trabajar. Auditoría previa confirmó que existían los datos (`professional_profiles.verification_status`/`verified_at`) y la UI admin para aprobar/rechazar, pero **ningún mecanismo bloqueaba el acceso** a la app de un profesional no verificado: el middleware `EnsureProfessional` solo desviaba a admins. Tampoco había notificación (correo o in-app) al aprobarse, ni tests que cubriesen el ciclo completo.

## Decisión

1. **Bloqueo en middleware:** `EnsureProfessional` redirige a `professional.pending-approval` cualquier profesional con `verification_status !== 'verified'` (o sin perfil profesional). La pantalla de pendiente queda fuera del grupo de rutas profesionales para evitar bucles.
2. **Pantalla de pendiente:** nueva ruta GET `/professional/pending-approval` (middlewares `auth`+`verified`), controlador `Professional\PendingApprovalAction`, página Inertia `professional/pending-approval.tsx` con el mensaje literal del producto: *"Su cuenta será verificada por el admin en menos de 24h, le avisaremos por correo"*.
3. **Notificación dual:** `App\Notifications\ProfessionalApprovedNotification` con canales `mail` y `database`. Se introduce la tabla `notifications` de Laravel (migración estándar) — primera vez que se usa el canal `database` en el proyecto.
4. **Disparo idempotente:** `Admin\Users\VerifyProfessionalAction` captura el estado anterior y notifica solo en la transición real `(no-verified) → verified`. Re-aprobar (ya verificado) o cambiar a `rejected/pending` no genera correo.
5. **Distribución in-app:** `HandleInertiaRequests` expone `notifications.unread_count` y `notifications.recent` (últimas 5) a todas las páginas para que cualquier layout muestre el aviso. El dashboard del profesional muestra un `Alert` Chakra con la notificación de aprobación.

## Alternativas consideradas

- **Bloqueo en `AuthenticateAction` (login):** descartado — un usuario ya autenticado se quedaría sin feedback al cambiarle el estado; el middleware aplica en cada request, sin fricción.
- **Solo correo, sin canal `database`:** descartado — el requisito menciona explícitamente "mensaje dentro de la app". El canal `database` es el coste mínimo para cubrirlo.
- **Pantalla de pendiente dentro del grupo `professional`:** descartado — habría requerido excluir la propia ruta del middleware con string-matching frágil. Sacarla del grupo es más limpio.

## Consecuencias

**Positivas**
- Cumplimiento real del requisito: profesionales no verificados no pueden operar.
- Trazabilidad: cada aprobación queda en BD (`notifications`) además del correo.
- Patrón reutilizable: `notifications.recent` queda disponible para futuros tipos (rechazo, reactivación, etc.).

**Negativas / seguimiento**
- El layout actual del profesional no tiene un centro de notificaciones; por ahora solo se muestra banner en dashboard. Pendiente decidir si añadir bell-icon global (→ posible ADR futuro).
- Correo enviado de forma síncrona (sin queue worker en local). Si se activa queue, marcar `ShouldQueue` en la notificación.
- Si en el futuro se permite a admin re-emitir el aviso (caso "el correo no llegó"), añadir endpoint explícito — el flujo actual de aprobación NO reenvía.
