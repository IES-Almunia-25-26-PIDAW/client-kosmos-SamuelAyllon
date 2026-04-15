Asume el rol de arquitecto de software y especialista en bases de datos. Ayúdame a adaptar un proyecto de software llamado ClientKosmos centrado en psicólogos autónomos que colaboran entre sí mediante contratos mercantiles de colaboración, eliminando por completo cualquier referencia o implicación de relación laboral jefe‑empleado.

La estructura de mi proyecto actual es esta:

Diagrama E/R  
erDiagram  
    USERS {  
        bigint id PK  
        string name  
        string email UK  
        string password  
    }

    CLINICS {  
        bigint id PK  
        bigint owner\_id FK  
        string name  
        string slug UK  
    }

    CLINIC\_USER {  
        bigint id PK  
        bigint clinic\_id FK  
        bigint user\_id FK  
        enum role  
        boolean can\_view\_all\_patients  
    }

    PATIENT\_PROFILES {  
        bigint id PK  
        bigint user\_id FK  
        bigint clinic\_id FK  
        bigint professional\_id FK  
        enum status  
        boolean is\_active  
    }

    PATIENT\_PROFESSIONAL {  
        bigint id PK  
        bigint patient\_id FK  
        bigint professional\_id FK  
        bigint clinic\_id FK  
        boolean is\_primary  
        enum status  
    }

    SERVICES {  
        bigint id PK  
        bigint clinic\_id FK  
        string name  
        decimal price  
        int duration\_minutes  
    }

    AVAILABILITIES {  
        bigint id PK  
        bigint professional\_id FK  
        bigint clinic\_id FK  
        tinyint day\_of\_week  
        time start\_time  
        time end\_time  
    }

    APPOINTMENTS {  
        bigint id PK  
        bigint clinic\_id FK  
        bigint patient\_id FK  
        bigint professional\_id FK  
        bigint service\_id FK  
        bigint cancelled\_by FK  
        datetime starts\_at  
        datetime ends\_at  
        enum status  
        enum modality  
    }

    SESSION\_RECORDINGS {  
        bigint id PK  
        bigint appointment\_id FK  
        text transcription  
        text ai\_summary  
        enum transcription\_status  
    }

    NOTES {  
        bigint id PK  
        bigint patient\_id FK  
        bigint user\_id FK  
        bigint appointment\_id FK  
        enum type  
    }

    AGREEMENTS {  
        bigint id PK  
        bigint patient\_id FK  
        bigint user\_id FK  
        bigint appointment\_id FK  
        boolean is\_completed  
    }

    CONSENT\_FORMS {  
        bigint id PK  
        bigint patient\_id FK  
        bigint user\_id FK  
        enum status  
        datetime signed\_at  
    }

    DOCUMENTS {  
        bigint id PK  
        bigint patient\_id FK  
        bigint user\_id FK  
        bigint clinic\_id FK  
        enum category  
        enum storage\_type  
    }

    KOSMO\_BRIEFINGS {  
        bigint id PK  
        bigint user\_id FK  
        bigint patient\_id FK  
        bigint appointment\_id FK  
        enum type  
        json content  
    }

    INVOICES {  
        bigint id PK  
        bigint clinic\_id FK  
        bigint patient\_id FK  
        bigint professional\_id FK  
        string invoice\_number UK  
        enum status  
        decimal total  
    }

    INVOICE\_ITEMS {  
        bigint id PK  
        bigint invoice\_id FK  
        bigint appointment\_id FK  
        decimal unit\_price  
        decimal total  
    }

    MESSAGES {  
        bigint id PK  
        bigint clinic\_id FK  
        bigint sender\_id FK  
        bigint receiver\_id FK  
        string related\_type  
        bigint related\_id  
        datetime read\_at  
    }

    USERS ||--o{ CLINICS : "owns (owner\_id)"  
    USERS ||--o{ CLINIC\_USER : "membership"  
    CLINICS ||--o{ CLINIC\_USER : "members"

    USERS ||--o{ PATIENT\_PROFILES : "patient user\_id"  
    USERS ||--o{ PATIENT\_PROFILES : "professional\_id"  
    CLINICS ||--o{ PATIENT\_PROFILES : "clinic\_id"

    USERS ||--o{ PATIENT\_PROFESSIONAL : "patient\_id"  
    USERS ||--o{ PATIENT\_PROFESSIONAL : "professional\_id"  
    CLINICS ||--o{ PATIENT\_PROFESSIONAL : "clinic\_id"

    CLINICS ||--o{ SERVICES : "has"  
    USERS ||--o{ AVAILABILITIES : "professional\_id"  
    CLINICS ||--o{ AVAILABILITIES : "clinic\_id"

    CLINICS ||--o{ APPOINTMENTS : "clinic\_id"  
    USERS ||--o{ APPOINTMENTS : "patient\_id"  
    USERS ||--o{ APPOINTMENTS : "professional\_id"  
    USERS ||--o{ APPOINTMENTS : "cancelled\_by"  
    SERVICES ||--o{ APPOINTMENTS : "service\_id"

    APPOINTMENTS ||--o| SESSION\_RECORDINGS : "recording"  
    APPOINTMENTS ||--o{ NOTES : "appointment\_id"  
    APPOINTMENTS ||--o{ AGREEMENTS : "appointment\_id"  
    APPOINTMENTS ||--o{ INVOICE\_ITEMS : "appointment\_id"  
    APPOINTMENTS ||--o{ KOSMO\_BRIEFINGS : "appointment\_id"

    PATIENT\_PROFILES ||--o{ NOTES : "patient\_id"  
    PATIENT\_PROFILES ||--o{ AGREEMENTS : "patient\_id"  
    PATIENT\_PROFILES ||--o{ CONSENT\_FORMS : "patient\_id"  
    PATIENT\_PROFILES ||--o{ DOCUMENTS : "patient\_id"  
    PATIENT\_PROFILES ||--o{ KOSMO\_BRIEFINGS : "patient\_id"

    USERS ||--o{ NOTES : "author user\_id"  
    USERS ||--o{ AGREEMENTS : "author user\_id"  
    USERS ||--o{ CONSENT\_FORMS : "creator user\_id"  
    USERS ||--o{ DOCUMENTS : "uploader user\_id"  
    USERS ||--o{ KOSMO\_BRIEFINGS : "target user\_id"

    CLINICS ||--o{ INVOICES : "clinic\_id"  
    USERS ||--o{ INVOICES : "patient\_id"  
    USERS ||--o{ INVOICES : "professional\_id"  
    INVOICES ||--o{ INVOICE\_ITEMS : "items"

    CLINICS ||--o{ MESSAGES : "clinic\_id"  
    USERS ||--o{ MESSAGES : "sender\_id"  
    USERS ||--o{ MESSAGES : "receiver\_id"

Diagrama de flujo de trabajo  
flowchart TD  
    A\[Registro/Login \+ rol\] \--\> B{Rol}  
    B \--\>|professional| C\[Onboarding \+ clínica actual\]  
    B \--\>|admin| Z\[Panel admin usuarios/clínicas\]  
    B \--\>|patient| P\[Portal paciente\]

    C \--\> D\[Crear paciente: users \+ patient\_profiles\]  
    D \--\> E\[Configurar agenda: services \+ availabilities\]  
    E \--\> F\[Crear cita: appointments\]  
    F \--\> G\[Sesión: start/end call\]  
    G \--\> H\[Transcripción/resumen: session\_recordings \+ kosmo\_briefings\]  
    G \--\> I\[Notas/acuerdos/docs/consent\]  
    G \--\> J\[Generar factura: invoices \+ invoice\_items\]  
    J \--\> K\[Enviar/descargar PDF y seguimiento estado\]  
    C \--\> L\[Mensajería interna: messages\]

    P \--\> P1\[Ver citas/facturas/documentos/consentimientos\]  
    P \--\> P2\[Firmar consentimiento\]  
    P \--\> P3\[Cancelar/entrar a videollamada\]  
    P \--\> P4\[Mensajes y perfil\]

Mis objetivos ahora son:

1\. Borrar completamente la jerarquía previa “jefe‑empleado”:  
   \- No debe aparecer en ningún lado la idea de empleador, empleado, jefe, recurso humano, nómina, etc.  
   \- La relación entre profesionales debe ser \*\*entre iguales\*\*, no jerárquica.  
   \- La única relación estable es entre profesionales autónomos y un paciente, y entre profesionales que colaboran mediante contrato mercantil.  
   \- Cualquier referencia a “clínica” debe reinterpretarse como un \*\*espacio de trabajo compartido\*\* o \*\*red de colaboración\*\*, no como un negocio que contrata a trabajadores.

2\. Reenfocar el modelo al negocio real:  
   \- Mi cliente es una psicóloga autónoma que trabaja con otros psicólogos autónomos.  
   \- Colaboran mediante contratos mercantiles de colaboración (no laborales).  
   \- Se pasan clientes entre ellos: derivaciones, sustituciones, co‑terapia, etc., siempre con trazabilidad clara de quién es el responsable y quién participa en cada caso.  
   \- El freelancer puede tener varios pacientes y gestionar sus propias citas, servicios, notas, documentos, consentimientos y facturas.  
   \- No hay empleados de clínica, solo profesionales autónomos que colaboran entre sí.

3\. Requisitos funcionales clave:  
   \- Gestión de perfil profesional (licencia, especialidades, etc.).  
   \- Gestión de pacientes propios y derivados por otros profesionales.  
   \- Definición de servicios y agenda de disponibilidad.  
   \- Creación y gestión de citas, con distintas modalidades (online/presencial).  
   \- Registro de sesiones con transcripción, resumen y notas.  
   \- Gestión de consentimientos firmados por el paciente.  
   \- Gestión de documentos del paciente (informes, historias clínicas, etc.).  
   \- Gestión de derivaciones y colaboraciones entre profesionales (sin jerarquía).  
   \- Generación de facturas y seguimiento de su estado.  
   \- Mensajería interna entre profesionales y entre profesional‑paciente.

4\. Cambios de enfoque que quiero aplicar:  
   \- Eliminar cualquier implicación de poder de mando: no hay “owner” que gestione a otros profesionales, solo hay profesionales que colaboran libremente.  
   \- Reinterpretar “CLINICS” como:  
     \- Una marca compartida, o  
     \- Un espacio físico compartido, o  
     \- Una red de colaboración, pero \*\*sin relación jerárquica\*\*.  
   \- Eliminar campos y tablas que impliquen supervisión laboral, control de recursos humanos o roles de administrador de empleados.  
   \- Reflejar explícitamente:  
     \- Contratos mercantiles de colaboración entre profesionales.  
     \- Relación directa paciente‑profesional.  
     \- Relación profesional‑profesional (derivaciones, colaboraciones, co‑terapia).  
   \- Permitir que un paciente tenga varios profesionales implicados, pero con un responsable principal claro.  
   \- Limitar el acceso a datos entre profesionales según el acuerdo de colaboración, no por jerarquía.

5\. Tareas que quiero que realices:  
   \- Proporciona una versión \*\*limpia y mejorada del diagrama E/R\*\* adaptado a este modelo de colaboración entre iguales (sin jefe‑empleado), en formato Mermaid \`erDiagram\`:  
     \- Elimina o reinterpreta cualquier entidad o campo que implique relación laboral jerárquica.  
     \- Renombra tablas si es necesario (por ejemplo, \`CLINICS\` puede pasar a \`WORKSPACES\` o \`COLLABORATION\_NETWORKS\`).  
     \- Añade las entidades que hagan falta para modelar:  
       \- Contratos de colaboración mercantil.  
       \- Derivaciones de pacientes.  
       \- Asignaciones de casos entre profesionales.  
   \- Proporciona una versión \*\*limpia y mejorada del diagrama de flujo de trabajo\*\* en Mermaid \`flowchart TD\` que refleje:  
     \- El flujo de un profesional autónomo (sin jerarquía).  
     \- El flujo de colaboración entre profesionales iguales (invitación, contrato, derivación, co‑trabajo).  
     \- El flujo de un paciente (visualización, firma, cancelación, videollamada, mensajería).  
   \- Explica brevemente:  
     \- Qué conceptos relacionados con la jerarquía jefe‑empleado has eliminado o reinterpretado.  
     \- Qué nuevas entidades y relaciones has introducido para modelar la colaboración entre iguales.  
     \- Qué reglas de negocio o supuestos has asumido para alinear el modelo con el de psicólogos autónomos que colaboran mediante contratos mercantiles.  
