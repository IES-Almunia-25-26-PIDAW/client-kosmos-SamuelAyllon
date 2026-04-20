# Project Context (Kosmos)

Documentos **específicos del proyecto ClientKosmos** — fuente de verdad sobre el dominio, el esquema de datos y el stack en uso. Separados de los skill packs de terceros (`.claude/skills/`) para que las actualizaciones de esos packs no pisen contenido propio.

## Índice

| Archivo | Cuándo consultarlo |
|---------|---------------------|
| [tech-stack.md](tech-stack.md) | Antes de añadir dependencias, al onboardear o al validar versiones |
| [database-schema-full-reference.md](database-schema-full-reference.md) | Antes de crear/modificar migraciones, modelos, factories o queries complejas |
| [project-erd-and-workflow.md](project-erd-and-workflow.md) | Al diseñar flujos de negocio, endpoints nuevos o entender el dominio |

## Mantenimiento

- Cuando cambie el esquema de DB → actualizar `database-schema-full-reference.md` en la misma PR que la migración.
- Cuando cambie un flujo de negocio → actualizar `project-erd-and-workflow.md` y registrar ADR si aplica.
- Cuando se añada/suba una dependencia mayor → actualizar `tech-stack.md`.
