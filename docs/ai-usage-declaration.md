# Declaración de Uso de IA

Registro transparente del uso de herramientas de IA en el desarrollo de ClientKosmos. Cada PR asistido por IA debe añadir una entrada. Formato definido en [`.claude/documentation.md`](../.claude/documentation.md).

## Herramientas en uso

| Herramienta | Propósito | Ámbito |
|-------------|-----------|--------|
| Claude Code (Opus 4.7) | Orquestación de desarrollo, generación/refactor/revisión de código, docs | Todo el proyecto |
| Laravel Boost MCP | Búsqueda de documentación versionada, acceso a schema y logs | Backend Laravel |
| Chakra UI MCP | Consulta de tokens, recetas y componentes Chakra | Frontend (UI) |

## Principios

1. **Revisión humana obligatoria** de todo output de IA antes de merge.
2. **Sin datos sensibles en prompts.** Ningún secreto, dato personal real o información confidencial se envía a la IA.
3. **Trazabilidad:** cada PR asistido documenta alcance IA vs. humano.
4. **Responsabilidad:** el autor del PR firma el código — la IA es asistente, no autor legal.

---

## Entradas

### Kick-off — Adopción de estándares Kosmos

- **Fecha:** 2026-04-20
- **Herramientas:** Claude Code (Opus 4.7), Laravel Boost MCP
- **Alcance IA:** generación inicial de `CLAUDE.md`, `.claude/*.md`, `docs/decision-log.md`, este archivo
- **Revisión humana:** pendiente — Samuel Ayllón revisará y ajustará
- **Prompt(s) relevantes:** "Actúa como un Lead Software Architect y QA Manager… configura el sistema de instrucciones de la IA para cumplir Criterios de Excelencia (Docs, Clean Code/DB, Escudo, DevOps, Frontend/A11y + Protocolo de Ejecución)"
- **Relación con ADR:** ADR-0001
