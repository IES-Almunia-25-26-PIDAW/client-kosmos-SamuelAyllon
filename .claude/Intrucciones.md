\#\# Adaptación del modelo a psicólogos autónomos en colaboración

Este documento define cómo debe trabajar el modelo (Claude) cuando adapte el diagrama E/R y el flujo de trabajo de la aplicación.    
El objetivo es pasar de un modelo “clínica \+ empleados” a un modelo de \*\*psicólogos autónomos que colaboran entre iguales mediante contratos mercantiles\*\*.

\---

\#\# 1\. Objetivo y alcance

Claude debe:

\- Eliminar cualquier rastro de jerarquía \*\*jefe‑empleado\*\* del modelo.  
\- Mantener y reforzar:  
  \- Gestión de pacientes.  
  \- Colaboración y derivaciones entre profesionales independientes.  
  \- Responsabilidad clara sobre cada caso.  
  \- Gestión de consentimientos, documentos clínicos, facturación y comunicación.  
\- Entregar siempre:  
  \- Un diagrama E/R en formato \`erDiagram\` (Mermaid).  
  \- Un diagrama de flujo de trabajo en formato \`flowchart TD\` (Mermaid).  
  \- Una explicación breve y estructurada de los cambios.

\---

\#\# 2\. Principios de diseño del dominio

\#\#\# 2.1 Relación entre profesionales

\- Todos los profesionales son \*\*autónomos e independientes\*\*.  
\- No existe relación laboral ni estructura de empleados.  
\- Las relaciones entre profesionales se modelan como:  
  \- \*\*Contratos de colaboración mercantil\*\*.  
  \- \*\*Derivaciones de casos\*\*.  
  \- \*\*Participación conjunta en un mismo paciente/caso (co‑terapia, sustituciones)\*\*.

\#\#\# 2.2 Relación paciente‑profesional

\- La relación central es \*\*Paciente ↔ Profesional\*\*, no Paciente ↔ Clínica.  
\- Un paciente puede tener varios profesionales, pero:  
  \- Debe haber siempre un \*\*profesional responsable principal\*\* por caso o por paciente.  
\- El acceso a la información del paciente se controla por:  
  \- Consentimientos.  
  \- Alcance del contrato de colaboración.  
  \- Asignaciones de caso (no por jerarquía).

\#\#\# 2.3 Espacio de trabajo / red

\- El concepto de “clínica” se interpreta como:  
  \- \*\*Espacio de trabajo compartido\*\*, o  
  \- \*\*Marca / red de colaboración\*\*, o  
  \- \*\*Infraestructura común (plataforma)\*\*.  
\- Nunca se usa para representar un empleador o un jefe.  
\- Puede agrupar:  
  \- Profesionales.  
  \- Servicios.  
  \- Configuración compartida (branding, políticas, etc.) \[web:18\]\[web:22\].

\---

\#\# 3\. Reglas para el diagrama E/R

\#\#\# 3.1 Eliminación de jerarquía laboral

Claude debe:

\- Revisar el modelo actual y:  
  \- Eliminar o reinterpretar cualquier campo que implique jerarquía laboral, por ejemplo:  
    \- \`owner\_id\` si implica “dueño de empleados”.  
    \- Tablas tipo \`CLINIC\_USER\` usadas como plantilla de empleados.  
  \- Evitar términos como:  
    \- \`employee\`, \`manager\`, \`supervisor\`, \`HR\`, \`payroll\`.  
\- Los roles que se mantengan (ej. \`role\` en una tabla de membresía) deben expresar:  
  \- Responsabilidades funcionales (p.e. “member”, “billing\_manager”) pero \*\*no subordinación laboral\*\*.

\#\#\# 3.2 Renombrado de entidades y campos

\- Proponer nombres que refuercen el modelo de colaboración entre iguales:  
  \- \`CLINICS\` → \`WORKSPACES\`.  
  \- \`CLINIC\_USER\` → \`WORKSPACE\_MEMBERS\`.  
  \- \`AGREEMENTS\` (si mezcla acuerdos con pacientes y otros usos) → dividir si hace falta en:  
    \- \`COLLABORATION\_AGREEMENTS\` (entre profesionales).  
    \- \`PATIENT\_AGREEMENTS\` o usar \`CONSENT\_FORMS\` para lo clínico.  
\- Cambiar campos ambiguos:  
  \- \`owner\_id\` → \`creator\_id\` (sin implicar relación laboral).  
  \- \`clinic\_id\` → \`workspace\_id\` si aplica.

\#\#\# 3.3 Nuevas entidades recomendadas

Claude debe considerar añadir (o reforzar si ya existen implícitamente):

\- \`PROFESSIONAL\_PROFILES\`  
  \- Vinculados a \`USERS\`.  
  \- Con campos como licencia, número de colegiado, especialidades, estado de verificación.  
\- \`COLLABORATION\_AGREEMENTS\`  
  \- Relación N:M entre profesionales (p.ej. \`professional\_a\_id\`, \`professional\_b\_id\`).  
  \- Opcionalmente asociados a un \`workspace\_id\`.  
  \- Con campos:  
    \- \`start\_date\`, \`end\_date\`, \`status\`, \`terms\` (puede ser \`json\`).  
\- \`CASE\_ASSIGNMENTS\` / \`CARE\_RELATIONS\`  
  \- Tabla que vincula:  
    \- \`patient\_id\`, \`professional\_id\`, \`workspace\_id\` (opcional), \`is\_primary\`, \`status\`, \`role\`.  
  \- Sirve para:  
    \- Marcar quién es responsable principal.  
    \- Registrar profesionales adicionales en el mismo caso.  
\- \`REFERRALS\`  
  \- Para derivaciones:  
    \- \`from\_professional\_id\`, \`to\_professional\_id\`, \`patient\_id\`, \`status\`, \`reason\`, \`created\_at\`.

\#\#\# 3.4 Buenas prácticas de modelado

\- Mantener el modelo \*\*simple pero extensible\*\* \[web:26\]:  
  \- Evitar complejidad innecesaria.  
  \- Priorizar relaciones claras y normalizadas.  
\- Asegurar integridad referencial:  
  \- Claves foráneas consistentes para pacientes, profesionales, citas y facturas.  
\- Asegurar que el modelo pueda evolucionar:  
  \- Facilitar la futura introducción de:  
    \- Nuevos tipos de acuerdos.  
    \- Nuevas modalidades de servicio.  
    \- Nuevas reglas de acceso.

\---

\#\# 4\. Reglas para el flujo de trabajo (flowchart)

\#\#\# 4.1 Flujos para profesionales autónomos

Claude debe modelar el flujo de un profesional autónomo aproximadamente así:

\- Registro/Login.  
\- Creación de perfil profesional (datos, licencia, especialidades).  
\- Opcional: creación o unión a un workspace/red de colaboración.  
\- Configuración de:  
  \- Servicios.  
  \- Agenda / disponibilidades.  
\- Gestión de pacientes:  
  \- Altas directas.  
  \- Aceptación de derivaciones.  
\- Gestión de citas:  
  \- Creación, modificación, cancelación.  
  \- Modalidades (online/presencial).  
\- Gestión de sesión:  
  \- Inicio/fin.  
  \- Notas, documentos, consentimientos, grabaciones.  
\- Facturación:  
  \- Generación de facturas.  
  \- Seguimiento de estado de cobro.

En ningún momento debe aparecer:  
\- Aprobación por parte de un jefe.  
\- Validación de horarios por un supervisor.  
\- Flujos de “gestión de empleados”.

\#\#\# 4.2 Flujos de colaboración entre profesionales

El diagrama debe representar, de forma clara y lineal:

\- Invitación a colaborar:  
  \- Un profesional invita a otro a un workspace o a firmar un acuerdo concreto.

