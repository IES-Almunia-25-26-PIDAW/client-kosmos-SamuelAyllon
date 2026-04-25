# Runbook de demo — ClientKosmos MVP

> **Uso:** ensayo end-to-end del flujo mínimo paciente + profesional antes de la defensa (S3.8 del roadmap).
> **Entorno:** local con `php artisan serve` + `npm run dev` + `php artisan reverb:start` + `php artisan queue:work`.
> **Navegadores:** Chrome (perfil A — profesional) y Chrome (perfil B — paciente). No usar Firefox/Safari por la captura de audio de pestaña.

---

## 0. Preparación del entorno

```bash
# Terminal 1 — backend
php artisan serve

# Terminal 2 — Vite dev server
npm run dev

# Terminal 3 — colas (jobs IA, emails)
php artisan queue:work --tries=3

# Terminal 4 — Reverb (broadcasting transcripción en vivo)
php artisan reverb:start

# Terminal 5 — Mailpit (capturar emails enviados)
mailpit  # o leer desde storage/logs/laravel.log si MAIL_MAILER=log
```

**Reset DB y semillas demo:**

```bash
php artisan migrate:fresh --seed
```

Credenciales tras `seed`:

| Rol | Email | Password |
|-----|-------|----------|
| Profesional | natalia@clientkosmos.test | `password` |
| Admin | admin@clientkosmos.test | `password` |
| Paciente | crear nuevo en `/register` durante el ensayo |

**Pre-check Google Meet:**

- Confirmar que la cuenta de Google del profesional está conectada en **Ajustes → Perfil → Conectar Google** (scopes Calendar Events).
- Si no está conectada, conéctala antes de empezar — sin esto la creación de la cita falla.

---

## 1. Guión del ensayo (≈ 12 minutos)

### Acto 1 — Registro del paciente (perfil B, Chrome incógnito)

1. Abrir `/register`.
2. Rellenar nombre, email (`paciente.demo@example.com` o cualquiera que recibas en Mailpit), password (`Demo123!`).
3. Marcar las **4 casillas RGPD**:
   - [ ] Política de privacidad
   - [ ] Términos del servicio
   - [ ] Tratamiento de datos de salud
   - [ ] Grabación y transcripción IA
4. Verificar que el botón **Registrarse** está deshabilitado hasta marcar las 4. Marcar y enviar.
5. Verificar email (Mailpit → click en enlace de verificación).
6. **Check:** en BD `consent_forms` debe haber 4 filas con `status=signed` y `signed_ip` rellena.

### Acto 2 — Reserva de cita (perfil B)

7. Login como paciente. Ir a **Profesionales** → seleccionar a *Natalia*.
8. Elegir slot disponible (configura en Acto 0.5 si hace falta) → confirmar reserva.
9. **Check 1:** la cita aparece en home del paciente con estado `confirmed`.
10. **Check 2:** en `appointments` la fila tiene `meeting_url` (Google Meet) y `external_calendar_event_id` rellenos.
11. **Check 3:** ambos (paciente y profesional) deben recibir invitación de Google Calendar.

### Acto 3 — Ventana de unión (perfiles A y B)

12. Manipular `starts_at` para que la cita esté **a 9 minutos** de ahora:
    ```bash
    php artisan tinker --execute="App\Models\Appointment::latest()->first()->update(['starts_at' => now()->addMinutes(9), 'ends_at' => now()->addMinutes(59)])"
    ```
13. **Perfil B (paciente):** ir a sala de espera. Verificar:
    - Botón "Unirse a la llamada" **habilitado**.
    - Mensaje informativo de grabación visible.
14. **Perfil A (profesional):** dashboard → cita de hoy → "Iniciar sesión". Botón habilitado.

> **Edge case opcional:** retroceder 11 min (`addMinutes(11)`), refrescar — el botón debe quedar deshabilitado con countdown.

### Acto 4 — Videollamada con grabación (perfiles A y B)

15. **Perfil A:** click "Iniciar sesión" → se abre Google Meet en pestaña nueva.
16. **Perfil B:** click "Unirse a la llamada" → se abre Google Meet en pestaña nueva.
17. Aceptar permisos en Meet (cámara/micro). Confirmar que ambos se ven y escuchan.
18. **Perfil A:** volver a la pestaña de ClientKosmos (sala). Click **"Comenzar grabación"**.
19. Diálogo del navegador: seleccionar pestaña de Google Meet + marcar **"Compartir audio de la pestaña"** + Compartir.
20. Hablar desde ambos perfiles unos 30 segundos (al menos 2 chunks de 15 s).
21. **Check:** en el panel lateral del profesional aparecen segmentos de transcripción en vivo, contador de "segmentos transcritos" sube. Indicador rojo "Grabando" visible.
22. **Perfil A:** click **"Finalizar sesión"**.
23. **Check 1:** el paciente es redirigido a `patient/appointments/{id}/post-session`.
24. **Check 2:** en BD `session_recordings.transcription` no está vacía.
25. **Check 3:** `SummarizeSessionJob` aparece encolado (terminal 3) y a los <30 s `ai_summary` se rellena.

### Acto 5 — Wizard de cierre (perfil A)

26. **Perfil A:** redirigido a `professional/patients/{id}/post-session`.
27. **Paso 1 — Notas y resumen IA:** verificar que la tarjeta del resumen IA muestra texto generado. Añadir nota ("Sesión inicial OK") y un acuerdo ("Practicar respiración diafragmática 5 min/día"). Pulsar Guardar en cada uno.
28. Click **Siguiente**.
29. **Paso 2 — Factura:** verificar que la tarjeta muestra número secuencial `FAC-2026-0000X`, subtotal, IVA 0%, total y la leyenda LIVA art. 20.1.3º. Registrar cobro (60 €, hoy, transferencia).
30. Click **Siguiente**.
31. **Paso 3 — Confirmar envío:** verificar que el checklist muestra factura + acuerdos + portal. Click **Confirmar y enviar**.
32. **Check 1:** mensaje verde de envío confirmado.
33. **Check 2:** en Mailpit deben llegar 3 emails al paciente:
    - "Tu factura FAC-2026-0000X de ClientKosmos"
    - "Acuerdos de tu sesión en ClientKosmos"
    - "Gracias por tu sesión — ClientKosmos"
34. **Check 3:** en BD `invoices.status = 'sent'` y `pdf_path` rellena.

### Acto 6 — Cierres (ambos perfiles)

35. **Perfil A:** click Finalizar → redirige a ficha del paciente. Verificar que la nota y el acuerdo aparecen registrados.
36. **Perfil B:** la pantalla post-session muestra mensaje motivador y countdown 15 s → redirect a dashboard del paciente.

### Acto 7 — Revocación de consentimiento (perfil B)

37. **Perfil B:** ir a **Ajustes → Perfil**.
38. Sección **"Mis consentimientos"** debe listar los 4 firmados con badge `Firmado`.
39. Click **Revocar** en "Grabación y transcripción IA" → confirmar diálogo.
40. **Check 1:** la fila pasa a badge `Revocado`, botón Revocar desaparece.
41. **Check 2:** intentar revocar "Tratamiento de datos de salud" — el botón **no debe aparecer** (no revocable desde UI).

---

## 2. Lista de verificación post-ensayo

- [ ] Los 4 consentimientos del registro se persistieron con IP y versión.
- [ ] Cita creada con `meeting_url` y `external_calendar_event_id`.
- [ ] Botón de unión respeta la ventana de 10 min.
- [ ] La grabación captura audio de la pestaña Meet (ambos hablan, ambos aparecen en transcripción aunque sin diarización).
- [ ] Resumen IA generado y mostrado en post-sesión.
- [ ] Factura con numeración secuencial y leyenda legal LIVA.
- [ ] 3 emails llegan al paciente al confirmar el wizard.
- [ ] Revocación de consentimiento funciona y se refleja en UI.
- [ ] Audio crudo borrado tras transcribir (revisar `storage/app/chunks/`).

---

## 3. Plan B si algo se rompe en demo en vivo

| Fallo | Mitigación |
|---|---|
| `getDisplayMedia` no captura audio de pestaña | Cambiar a `getUserMedia` (micro del profesional) — la transcripción sigue funcionando, perdemos voz del paciente. Avisar al tribunal. |
| Groq Whisper falla / cuota agotada | Demo en modo "audio sin IA": mostrar el flujo igual y abrir manualmente `ai_summary` con `tinker` simulando una respuesta. |
| Google Meet OAuth caduca | Fallback al enlace estático `https://meet.google.com/new` y rellenar `meeting_url` a mano por tinker. |
| Reverb cae | La transcripción sigue persistiendo en BD; perdemos solo el live update — refrescar la página al cerrar. |
| Mailpit no llega | Verificar `MAIL_MAILER=log` y `storage/logs/laravel.log` para confirmar despacho. |

---

## 4. Comandos útiles durante la demo

```bash
# ver últimos appointments
php artisan tinker --execute="App\Models\Appointment::latest()->take(3)->get(['id','status','starts_at','meeting_url'])"

# ver transcripción
php artisan tinker --execute="App\Models\SessionRecording::latest()->first()->only(['id','transcription_status','ai_summary'])"

# ver factura emitida
php artisan tinker --execute="App\Models\Invoice::latest()->first()->only(['invoice_number','status','total','pdf_path'])"

# limpiar audio crudo manualmente
php artisan audio:cleanup

# ver jobs fallidos
php artisan queue:failed
```
