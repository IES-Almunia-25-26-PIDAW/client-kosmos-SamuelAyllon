# Google OAuth — Uso de cuentas de test (modo "Testing")

> Documento justificativo del estado actual del cliente OAuth de Google en producción.
>
> **Fecha:** 2026-05-17
> **Estado:** Cliente OAuth en modo **Testing** (no verificado / no publicado).
> **Aplicación afectada:** ClientKosmos (`https://clientkosmos.up.railway.app`).

---

## 1. Resumen ejecutivo

La aplicación ClientKosmos integra **inicio de sesión con Google** (OAuth 2.0) y, en el caso de los pacientes que se registran con Google, **vinculación con Google Calendar** para sincronizar las citas.

A día de hoy el cliente OAuth de Google está configurado en **modo "Testing"**, es decir, **solo las direcciones de correo añadidas explícitamente como _test users_ en la consola de Google Cloud pueden iniciar sesión**. Cualquier otro usuario que intente acceder con Google verá la pantalla *"Acceso bloqueado: ClientKosmos no ha completado el proceso de verificación de Google"*.

Esta limitación **no es una decisión de diseño**, sino una consecuencia directa de los requisitos de verificación de Google que el dominio actual de despliegue no puede cumplir. Este documento justifica por qué y deja constancia del plan de salida.

---

## 2. Por qué no se ha publicado el cliente OAuth

Para que Google permita publicar la app en modo **"In production"** (acceso abierto a cualquier cuenta de Google), exige una serie de validaciones en la pantalla de consentimiento OAuth. Tras dos intentos de verificación, Google ha respondido con los siguientes bloqueos:

> 1. *The website of your home page URL "https://clientkosmos.up.railway.app" is not registered to you.*
>    *Verify ownership of your home page.*
>
> 2. *Your home page URL "https://clientkosmos.up.railway.app" does not include a link to your privacy policy.*
>    *Make sure your home page includes a link to your privacy policy.*

El **punto 2 ya está resuelto** en el código: el footer de la home (`resources/js/pages/welcome.tsx`) enlaza explícitamente a `/privacy` y `/terms`, ambas rutas públicas servidas por el backend (`routes/web.php`).

El **punto 1 es bloqueante y no se puede resolver desde código**, por la razón técnica que se explica en la siguiente sección.

---

## 3. Por qué el dominio actual no puede verificarse

El despliegue de producción vive en **`https://clientkosmos.up.railway.app`**, un subdominio gratuito proporcionado por Railway.

La verificación de dominio que exige Google se realiza en **Google Search Console** mediante uno de estos métodos:

- Registro DNS TXT en el dominio.
- Subida de un archivo HTML en la raíz del sitio.
- Etiqueta `<meta>` en el `<head>` del HTML servido en la raíz.
- Verificación a través de Google Analytics o Google Tag Manager.

Todos estos métodos requieren **demostrar propiedad sobre el apex domain** (`up.railway.app`). Ese dominio es propiedad de **Railway Corporation**, no del propietario de la aplicación, por lo que:

- No se puede crear el registro DNS TXT (no se tiene acceso al panel DNS de Railway).
- Aunque Search Console permite reclamar subdominios individuales, requiere que primero se haya validado el apex o, en su defecto, que el subdominio se valide vía meta-tag/HTML — lo cual Google **rechaza** explícitamente para subdominios compartidos de plataformas PaaS (Railway, Vercel, Netlify, Fly.io, etc.) en el contexto de verificación de OAuth en producción.

**Conclusión técnica:** mientras la app esté servida desde `*.up.railway.app`, Google nunca aceptará la verificación, y por tanto el cliente OAuth no puede salir de modo *Testing*.

---

## 4. Decisión adoptada

Dado que:

- El proyecto es **académico** (Proyecto Intermodular 2º DAM).
- La adquisición y mantenimiento de un dominio propio (~10–15 €/año) y la posterior verificación con Google requieren tiempos administrativos que **exceden el alcance de la entrega**.
- El flujo OAuth con Google funciona correctamente para los evaluadores y testers añadidos a la lista blanca.

Se ha tomado la decisión de:

1. **Mantener el cliente OAuth en modo Testing.**
2. **Añadir como _test users_** las cuentas de Google de los evaluadores y de los pacientes/profesionales de prueba que deban acceder.
3. **Documentar este estado** (este archivo) para que cualquier revisor entienda que:
   - El uso de cuentas de test **no es una limitación del producto**, sino del entorno de despliegue.
   - El código está preparado para funcionar en producción sin cambios: solo requiere cambiar el origen autorizado y el redirect URI en la consola de Google una vez se disponga de dominio propio.

---

## 5. Plan de salida (cuando se adquiera dominio propio)

Pasos para activar el modo producción de OAuth sin tocar código:

1. **Adquirir un dominio** (p. ej. `clientkosmos.com`).
2. En **Railway → Service Settings → Custom Domain**, asociar el dominio y configurar los registros DNS que indique Railway (CNAME o A).
3. En **Google Search Console**, añadir el dominio como propiedad y verificarlo vía DNS TXT.
4. En **Google Cloud Console → APIs & Services → Credentials**:
   - Editar el OAuth Client.
   - Actualizar *Authorized JavaScript origins* y *Authorized redirect URIs* al nuevo dominio.
5. En **OAuth consent screen**:
   - Actualizar *Application home page*, *Privacy policy URL* y *Terms of service URL* al nuevo dominio.
   - Solicitar verificación → Google la aprobará al detectar el dominio verificado en Search Console.
6. En la app, actualizar:
   - `APP_URL` en variables de entorno de Railway.
   - `GOOGLE_REDIRECT_URI` (si está parametrizado por env) al nuevo dominio.
7. Una vez aprobada la verificación, **publicar** el cliente OAuth.

Tras estos pasos, **cualquier cuenta de Google** podrá iniciar sesión sin estar en la lista blanca y sin la pantalla de advertencia.

---

## 6. Evidencias

- Pantalla *"Acceso bloqueado"* visible para cuentas no añadidas como _test user_.
- Respuesta del equipo de verificación de Google citada en la sección 2.
- Enlaces a privacy/terms ya presentes en el footer de la home (commit que añade los enlaces de Legal en `welcome.tsx`).
- Rutas públicas servidas: `GET /privacy` y `GET /terms` en `routes/web.php`.

---

## 7. Referencias

- [Google — OAuth API verification FAQs](https://support.google.com/cloud/answer/9110914)
- [Google Search Console — Verificar la propiedad del sitio](https://support.google.com/webmasters/answer/9008080)
- [Railway — Custom Domains](https://docs.railway.com/guides/public-networking#custom-domains)
- ADR-0028 — Monetización: app gratuita con anuncios + modo sin anuncios premium.
