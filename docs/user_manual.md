# Manual de Usuario — ClientKosmos

> Plataforma de gestión de consulta para profesionales de servicios (psicólogos, coaches, terapeutas, asesores).

---

## Tabla de Contenidos

1. [Introducción](#1-introducción)
2. [Primeros pasos](#2-primeros-pasos)
3. [Panel de control (Dashboard)](#3-panel-de-control-dashboard)
4. [Pacientes / Clientes](#4-pacientes--clientes)
5. [Notas de sesión](#5-notas-de-sesión)
6. [Acuerdos](#6-acuerdos)
7. [Pagos](#7-pagos)
8. [Documentos](#8-documentos)
9. [Formularios de consentimiento](#9-formularios-de-consentimiento)
10. [Facturación](#10-facturación)
11. [Kosmo IA](#11-kosmo-ia)
12. [Ajustes de consulta](#12-ajustes-de-consulta)
13. [Perfil y seguridad](#13-perfil-y-seguridad)
14. [Panel de administración](#14-panel-de-administración)
15. [Preguntas frecuentes](#15-preguntas-frecuentes)

---

## 1. Introducción

**ClientKosmos** es una plataforma web diseñada para que profesionales autónomos de servicios —psicólogos, coaches, terapeutas, asesores— gestionen su consulta de forma centralizada y eficiente.

### ¿Qué problema resuelve?

Muchos profesionales gestionan su consulta con una mezcla de hojas de cálculo, carpetas de correo, agendas en papel y aplicaciones sueltas. Esto genera:

- **Pérdida de contexto** entre sesiones (¿dónde lo dejamos la última vez?)
- **Documentación dispersa** (notas en un cuaderno, facturas en el correo, consentimientos en papel)
- **Falta de visión global** de la cartera de pacientes activos

ClientKosmos unifica todo en una única plataforma:

| Módulo | Qué hace |
|--------|----------|
| **Pacientes** | Ficha completa de cada paciente con historial |
| **Notas** | Registro de sesiones ligado al paciente |
| **Acuerdos** | Condiciones del servicio firmadas digitalmente |
| **Pagos** | Control de cobros y estado de facturas |
| **Documentos** | Archivos adjuntos organizados por paciente |
| **Consentimientos** | RGPD y consentimiento informado |
| **Facturación** | Vista consolidada de ingresos |
| **Kosmo IA** | Asistente inteligente con briefings diarios y chat |

---

## 2. Primeros pasos

### 2.1 Registro

1. Ve a `/register` y rellena nombre, email y contraseña.
2. Recibirás un email de verificación — haz clic en el enlace para activar tu cuenta.
3. Tras verificar el email serás redirigido al **tutorial de bienvenida**.

**Registro de paciente — consentimientos RGPD obligatorios.** Al registrarse como paciente, el formulario pide marcar 4 casillas (todas son requisito del servicio; sin las 4 no se puede completar el alta):

- Política de privacidad.
- Términos del servicio.
- Tratamiento de datos de salud con finalidad terapéutica (RGPD art. 9.2.h).
- Autorización de grabación y transcripción automatizada de las sesiones por IA para generar resúmenes destinados exclusivamente al profesional (RGPD art. 22).

Cada consentimiento se almacena con la versión del texto, la fecha, la IP y el tipo de firma. El paciente puede revocarlos en cualquier momento desde **Ajustes → Perfil → Mis consentimientos** (ver §13.1). Revocar el consentimiento de grabación no cancela el servicio pero impide la grabación de futuras sesiones.

### 2.2 Tutorial de bienvenida (Onboarding)

El tutorial te guía en 3 pasos:

1. **Datos de consulta** — Nombre de la consulta, especialidad y ciudad.
2. **Datos fiscales** — NIF/CIF, tarifa por sesión y prefijo de factura.
3. **Configuración RGPD** — Plantilla de consentimiento y política de privacidad.

> Puedes saltarte el tutorial y completarlo más tarde desde **Ajustes → Consulta**.

### 2.3 Credenciales de prueba (entorno demo)

| Rol | Email | Contraseña |
|-----|-------|:----------:|
| **Admin** | admin@clientkosmos.test | `password` |
| **Profesional** | natalia@clientkosmos.test | `password` |

---

## 3. Panel de control (Dashboard)

El dashboard es tu vista de trabajo diario. Al acceder encontrarás:

### 3.1 Métricas rápidas

| Métrica | Qué mide |
|---------|----------|
| **Pacientes activos** | Total de pacientes con estado `activo` |
| **Sesiones hoy** | Número de sesiones programadas para el día actual |
| **Pendiente de cobro** | Suma de pagos con estado `pendiente` |
| **Facturado este mes** | Total cobrado en el mes en curso |

### 3.2 Briefing diario de Kosmo

Cada mañana, Kosmo IA genera un resumen con:
- Alertas de pagos vencidos
- Pacientes con consentimiento próximo a expirar
- Recordatorios de sesiones pendientes de documentar

Haz clic en **"Marcar como leído"** para descartar el briefing del día.

### 3.3 Alertas

El sistema muestra alertas automáticas para:
- **Pagos vencidos** — pacientes con facturas sin cobrar pasada la fecha de vencimiento
- **Consentimientos** — pacientes sin formulario de consentimiento activo

---

## 4. Pacientes / Clientes

El módulo de pacientes es el corazón de ClientKosmos. Cada paciente tiene su propia ficha completa.

### 4.1 Listar pacientes

Accede desde el menú lateral → **Pacientes**. La tabla muestra:
- Nombre del paciente
- Email y teléfono
- Estado (activo / inactivo)
- Estado de pago (al día / pendiente / vencido)

### 4.2 Crear un paciente

1. Pulsa el botón **"Nuevo paciente"**.
2. Rellena los campos obligatorios:
   - **Nombre** *(obligatorio)*
   - Email y teléfono *(opcional)*
   - Especialidad / motivo de consulta
3. Guarda la ficha.

### 4.3 Ficha de paciente

La ficha de cada paciente organiza toda la información en pestañas:

| Pestaña | Contenido |
|---------|-----------|
| **Resumen** | Datos generales, estado, próxima cita |
| **Notas** | Registro de sesiones |
| **Acuerdos** | Condiciones del servicio |
| **Pagos** | Historial de cobros |
| **Documentos** | Archivos adjuntos |
| **Consentimiento** | Formularios RGPD |

### 4.4 Pre-sesión y post-sesión

Antes de cada sesión puedes acceder a la vista de **pre-sesión** con el contexto del paciente:
- Última nota registrada
- Objetivos definidos
- Alertas activas

La vista de **post-sesión** (accesible al finalizar una llamada o desde la ficha del paciente) es un **wizard de 3 pasos**:

1. **Notas y resumen IA** — muestra el resumen generado automáticamente a partir de la transcripción de la sesión (se tarda hasta 30 segundos tras finalizar la llamada). Debajo añades la nota clínica del día y los acuerdos pactados con el paciente.
2. **Factura** — revisas el borrador de factura vinculado a la cita (número secuencial, subtotal, IVA exento art. 20.1.3º LIVA, total) y registras el cobro si ya se ha realizado.
3. **Confirmar envío** — al pulsar *Confirmar y enviar*, ClientKosmos envía automáticamente al paciente:
   - La factura en PDF (y la marca como `sent`).
   - Los acuerdos de la sesión.
   - Un email de agradecimiento con enlace a su portal.

Puedes navegar entre pasos con **Atrás/Siguiente** o salir con **Guardar y salir** en cualquier momento; las notas, acuerdos y cobros se guardan de forma independiente en cada formulario.

### 4.5 Videollamada y transcripción (Google Meet)

Las sesiones se realizan sobre **Google Meet**. Al crear la cita, ClientKosmos genera automáticamente un evento en el calendario del profesional (vía Google Calendar API) e invita al paciente por email con el enlace de Meet.

**Ventana de unión (10 minutos antes):**

- El botón **"Iniciar sesión"** (profesional) y **"Unirse a la llamada"** (paciente) se habilita 10 minutos antes de la hora de inicio y permanece disponible hasta 15 minutos después del fin de la cita.
- Antes de esa ventana: botón deshabilitado con un contador regresivo (*"Disponible en HH:MM"*).
- Si el profesional no se une antes de `starts_at + 20 minutos`, la cita se marca automáticamente como `no_show`.

**Grabación desde el profesional:**

La grabación de audio para la transcripción se hace **exclusivamente desde el profesional**, no desde el paciente. Este flujo simplifica el UX del paciente y centraliza la captura en quien lidera la sesión:

1. Al pulsar *Iniciar sesión*, el profesional abre Google Meet en una nueva pestaña y vuelve a ClientKosmos.
2. En el panel lateral de la sala pulsa **"Comenzar grabación"**.
3. El navegador pide compartir una pestaña — el profesional selecciona la de Google Meet y habilita **"Compartir audio de la pestaña"**.
4. ClientKosmos troceará el audio en chunks de 15 s, los transcribe con Groq Whisper y muestra la transcripción en vivo en el panel lateral.
5. Al pulsar **"Finalizar sesión"** se dispara automáticamente la generación del resumen IA, disponible en el paso 1 del wizard de post-sesión.

**Requisitos de navegador:** Chrome, Edge u Opera de escritorio (los únicos con soporte completo para `getDisplayMedia` + audio de pestaña). Safari y Firefox funcionan parcialmente: si no es posible capturar audio de pestaña, ClientKosmos cae a capturar solo el micrófono del profesional (se pierde la voz del paciente pero la transcripción sigue funcionando).

> **Aviso al paciente.** En la sala de espera del paciente aparece un mensaje informativo recordando que la sesión será grabada y transcrita por la IA, con un enlace para revocar el consentimiento desde su perfil.

### 4.6 Archivar / reactivar un paciente

Cambia el estado de un paciente a **inactivo** para archivarlo. Los pacientes inactivos no aparecen en las listas activas pero mantienen todo su historial.

---

## 5. Notas de sesión

Las notas permiten registrar lo sucedido en cada sesión de manera estructurada y confidencial.

### 5.1 Crear una nota

1. Ve a la ficha del paciente → pestaña **Notas**.
2. Pulsa **"Nueva nota"**.
3. Escribe el contenido de la sesión (fecha, temas tratados, observaciones).
4. Guarda.

### 5.2 Editar y eliminar notas

- **Editar**: haz clic sobre el icono de lápiz junto a la nota.
- **Eliminar**: usa el icono de papelera. Esta acción es permanente.

> Solo el profesional propietario del paciente puede ver y modificar sus notas.

---

## 6. Acuerdos

Los acuerdos recogen las condiciones del servicio pactadas con el paciente (precio, frecuencia, duración de sesión, etc.).

### 6.1 Crear un acuerdo

1. En la ficha del paciente → pestaña **Acuerdos** → **"Nuevo acuerdo"**.
2. Especifica: objeto del acuerdo, importe, periodicidad y fecha de inicio.
3. Guarda.

### 6.2 Gestionar acuerdos

- Puedes tener **múltiples acuerdos** por paciente (p.ej. uno para psicoterapia individual y otro para terapia de pareja).
- Marca un acuerdo como **cerrado** cuando el proceso terapéutico haya concluido.

---

## 7. Pagos

El módulo de pagos te permite registrar y controlar los cobros de cada paciente.

### 7.1 Registrar un pago

1. Ficha del paciente → pestaña **Pagos** → **"Nuevo pago"**.
2. Rellena:
   - **Concepto** — descripción de la sesión o servicio
   - **Importe**
   - **Método de pago** (transferencia, efectivo, tarjeta, Bizum)
   - **Fecha de vencimiento**
3. El estado inicial es **pendiente**.

### 7.2 Marcar como pagado

Cuando el paciente abone la factura, cambia el estado a **pagado** e indica la fecha de cobro real.

### 7.3 Estados de pago

| Estado | Significado |
|--------|-------------|
| `pendiente` | Emitido pero no cobrado aún |
| `pagado` | Cobrado |
| `vencido` | La fecha de vencimiento ha pasado sin cobrar |

---

## 8. Documentos

Adjunta cualquier archivo relevante a la ficha del paciente: informes externos, derivaciones, evaluaciones psicológicas, etc.

### 8.1 Subir un documento

1. Ficha del paciente → pestaña **Documentos** → **"Subir documento"**.
2. Selecciona el archivo desde tu dispositivo.
3. El documento queda guardado y asociado al paciente.

### 8.2 Eliminar un documento

Usa el icono de papelera junto al documento. Esta acción es permanente.

---

## 9. Formularios de consentimiento

El consentimiento informado y el cumplimiento RGPD son obligaciones legales. ClientKosmos te ayuda a gestionarlos digitalmente.

### 9.1 Crear un consentimiento

1. Ficha del paciente → pestaña **Consentimiento** → **"Nuevo formulario"**.
2. La plantilla se rellena automáticamente con los datos de tu consulta (configurados en Ajustes).
3. Personaliza el texto si lo necesitas y guarda.

### 9.2 Estado de consentimiento

| Estado | Descripción |
|--------|-------------|
| `pendiente` | Creado pero no firmado |
| `activo` | Consentimiento válido y vigente |
| `revocado` | El paciente ha retirado el consentimiento |

### 9.3 Consentimientos globales del paciente (alta)

Además de los consentimientos específicos de consulta que el profesional puede crear, el paciente firma al registrarse 4 consentimientos globales (ver §2.1). Estos son visibles en la ficha del paciente, pestaña **Consentimiento**, y son gestionados directamente por el propio paciente desde su portal:

- El paciente puede **revocar** cualquier consentimiento salvo el de tratamiento de datos de salud (cuya revocación requiere cierre de cuenta).
- Si revoca el consentimiento de grabación, el sistema lo detecta antes de cada nuevo chunk y bloquea la transcripción automática (el estado de la `SessionRecording` pasa a `rejected_no_consent`).
- Toda revocación queda registrada en el audit log con fecha, IP y versión de la plantilla.

---

## 10. Facturación

La sección de facturación ofrece una vista consolidada de todos los pagos de tu consulta.

### 10.1 Vista general

Accede desde el menú lateral → **Facturación**. Verás:

- **Estadísticas** — total facturado, pendiente de cobro y vencido
- **Lista de pagos** — todos los pagos de todos tus pacientes

### 10.2 Filtros

Filtra por estado de pago (todos / pendiente / pagado / vencido) para revisar rápidamente los cobros atrasados.

### 10.3 Exportación *(próximamente)*

La generación automática de facturas en PDF estará disponible en futuras versiones.

---

## 11. Kosmo IA

Kosmo es el asistente inteligente de ClientKosmos, integrado con el modelo **Llama 3.3 70B** a través de la API de Groq.

> **Importante:** Kosmo requiere una `GROQ_API_KEY` configurada en el servidor. Sin ella, el módulo mostrará un aviso pero el resto de la aplicación funciona con normalidad.

### 11.1 Briefings diarios

Cada día Kosmo genera automáticamente un briefing con:
- Resumen del estado de tu cartera de pacientes
- Alertas prioritarias (pagos vencidos, consentimientos caducados)
- Sugerencias para la jornada

Los briefings se marcan como leídos automáticamente cuando los consultas.

### 11.2 Chat con Kosmo

Accede desde el menú lateral → **Kosmo**. Puedes hacer preguntas como:
- *"¿Qué pacientes tienen pagos pendientes?"*
- *"Recuérdame el último acuerdo con [paciente]"*
- *"¿Cuántas sesiones he hecho este mes?"*

Kosmo tiene acceso contextual a los datos de tu consulta y responde de forma personalizada.

### 11.3 Privacidad y seguridad

Los mensajes enviados a Kosmo se procesan por la API de Groq. **No se almacena información de identificación personal** en los servidores de Groq — los prompts están diseñados para incluir solo datos agregados y anonimizados.

---

## 12. Ajustes de consulta

Desde **Ajustes** puedes personalizar los datos de tu consulta que se usan en facturas, consentimientos y comunicaciones.

### 12.1 Datos de consulta

| Campo | Uso |
|-------|-----|
| Nombre de la consulta | Cabecera de documentos |
| Especialidad | Informativo |
| Ciudad | Pie de documentos |

### 12.2 Datos fiscales

| Campo | Uso |
|-------|-----|
| NIF / CIF | Facturas |
| Tarifa por sesión | Valor por defecto al crear pagos |
| Duración de sesión | Planificación |
| Prefijo de factura | Numeración (p.ej. `CK-2026-001`) |
| Texto pie de factura | Pie de factura |
| Dirección fiscal | Facturas |

### 12.3 Configuración RGPD

| Campo | Uso |
|-------|-----|
| Plantilla de consentimiento | Base de los formularios de consentimiento |
| Meses de retención de datos | Política de privacidad |
| URL de política de privacidad | Enlace en consentimientos |

---

## 13. Perfil y seguridad

Accede desde el menú superior → tu avatar → **Perfil** o desde **Ajustes → Perfil**.

### 13.1 Actualizar perfil

- Cambia tu nombre y dirección de email.
- Si cambias el email necesitarás verificarlo de nuevo.
- **Mis consentimientos** (solo para pacientes). Lista los consentimientos firmados al registrarte con su tipo, versión, fecha de firma y estado. El botón **Revocar** junto a cada entrada permite retirar el consentimiento (salvo el de tratamiento de datos de salud). La revocación es inmediata: si se revoca el consentimiento de grabación, cualquier sesión futura dejará de transcribirse automáticamente.

### 13.2 Cambiar contraseña

Ve a **Ajustes → Contraseña**. Introduce tu contraseña actual y la nueva (mínimo 8 caracteres).

### 13.3 Autenticación de dos factores (2FA)

Activa 2FA desde **Ajustes → Seguridad**:

1. Escanea el código QR con tu app de autenticación (Google Authenticator, Authy, etc.).
2. Introduce el código de 6 dígitos para confirmar.
3. Guarda los **códigos de recuperación** en un lugar seguro.

### 13.4 Eliminar cuenta

> ⚠️ Esta acción es irreversible. Todos tus datos (pacientes, notas, documentos) serán eliminados permanentemente.

Ve a **Ajustes → Perfil** y desplázate hasta la sección "Zona de peligro". Introduce tu contraseña para confirmar.

---

## 14. Panel de administración

El panel de administración solo es accesible para usuarios con rol **admin**.

### 14.1 Gestión de usuarios

Accede desde `/admin/users`:

- **Listar usuarios** — listado paginado de todos los profesionales registrados
- **Ver detalle** — información completa de un profesional: nombre, email, fecha de registro, número de pacientes
- **Crear usuario** — dar de alta un nuevo profesional directamente desde el panel admin
- **Cambiar rol** — asignar o cambiar el rol de un usuario (`admin` / `professional`)
- **Eliminar usuario** — eliminación suave (soft delete). Los datos quedan en la base de datos pero el usuario pierde el acceso

> Un admin no puede eliminarse a sí mismo.

---

## 15. Preguntas frecuentes

**¿Puedo tener varios profesionales usando la misma instalación?**
Sí. Cada usuario tiene sus propios pacientes, notas y configuraciones. Los datos de un profesional son completamente privados y no son accesibles por otros usuarios.

**¿Los datos de mis pacientes están seguros?**
Los datos se almacenan de forma cifrada en la base de datos. En producción se usa TiDB Cloud con conexión SSL. Las contraseñas nunca se guardan en texto plano (bcrypt).

**¿Puedo usar ClientKosmos sin conexión a internet?**
No. ClientKosmos es una aplicación web que requiere conexión. La IA (Kosmo) también requiere conexión a la API de Groq.

**¿Qué pasa si pierdo acceso a mi cuenta de 2FA?**
Usa uno de los **códigos de recuperación** que guardaste al activar el 2FA. Si no los tienes, contacta al administrador del sistema.

**¿Puedo importar datos desde otra aplicación?**
En la versión actual no hay importación automática. Los datos deben introducirse manualmente.

**¿Con qué navegadores es compatible?**
ClientKosmos funciona correctamente en las versiones actuales de Chrome, Firefox, Edge y Safari.

---

*Manual de usuario — ClientKosmos v1.0 — Abril 2026*
*Samuel Ayllón — Proyecto Intermodular 2º DAM*
