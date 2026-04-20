# Pilar 1 · Documentación Obligatoria

Activar cuando la tarea introduzca cambios arquitectónicos, nuevas dependencias, nuevos endpoints o nuevos flujos de IA.

## Artefactos vivos

| Archivo | Mantenedor | Actualizar cuando... |
|---------|-----------|----------------------|
| `docs/decision-log.md` | Todo contribuidor | Se toma una decisión arquitectónica, se añade dependencia, se acepta excepción a estos estándares |
| `docs/ai-usage-declaration.md` | Todo contribuidor | Se usa IA (Claude Code, Copilot, etc.) para producir o revisar código en un PR |
| `README.md` (sección Arquitectura) | Lead Architect | Cambia el stack, se añade un servicio al `docker-compose`, cambia el diagrama C4 |

## Formato ADR (Nygard ligero)

Cada entrada en `docs/decision-log.md` debe seguir:

```markdown
## ADR-XXXX — <título corto>

- **Fecha:** YYYY-MM-DD
- **Estado:** Propuesto | Aceptado | Reemplazado por ADR-YYYY | Rechazado
- **Contexto:** problema/fuerzas en juego.
- **Decisión:** qué se eligió.
- **Consecuencias:** positivas, negativas, seguimiento necesario.
```

Numeración secuencial (`0001`, `0002`…). Nunca reescribir un ADR aceptado — marcarlo "Reemplazado" y crear uno nuevo.

## Declaración de uso de IA

Formato mínimo por PR en `docs/ai-usage-declaration.md`:

```markdown
### PR #<n> — <título>

- **Fecha:** YYYY-MM-DD
- **Herramientas:** Claude Code (modelo X), Laravel Boost MCP, Chakra MCP, ...
- **Alcance IA:** generación de código | revisión | refactor | tests | docs
- **Revisión humana:** nombre del revisor + profundidad (línea-a-línea / funcional)
- **Prompt(s) relevantes:** resumen de las instrucciones clave
```

## README profesional

Debe contener al menos:

1. Propósito del proyecto y público objetivo.
2. Stack tecnológico (versiones) — enlazar `composer.json` y `package.json`.
3. Setup local (con y sin Docker).
4. Scripts (`composer run dev`, `npm run dev`, `php artisan test`).
5. **Diagrama de arquitectura** en Mermaid (C4 nivel 2 — Containers) embebido.
6. Enlaces a `docs/decision-log.md`, `docs/ai-usage-declaration.md` y `.claude/`.
7. Guía de contribución (Conventional Commits, gates CI).

## Comentarios en código

- **PHP:** PHPDoc obligatorio en métodos `public` de Models, Controllers, Actions, Services. Incluir `@param`, `@return`, `@throws` y, cuando aplique, array shapes.
- **TypeScript/React:** JSDoc en hooks (`use*`), utilidades de `resources/js/lib/` y tipos exportados.
- Inline comments solo para invariantes sutiles o workarounds (el "por qué", nunca el "qué").

## Reglas de la IA

- Antes de generar documentación nueva, comprobar si el archivo ya existe y extenderlo.
- Nunca crear `README.md` alternativos, duplicados ni `*.md` sueltos sin petición explícita.
- Si el cambio amerita ADR y el usuario no lo menciona, **proponerlo** antes de implementar.
