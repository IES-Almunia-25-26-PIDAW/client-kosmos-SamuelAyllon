# Decision Log (ADR)

Registro de decisiones arquitectónicas significativas del proyecto ClientKosmos. Formato Nygard ligero. Numeración secuencial. Un ADR aceptado no se edita: si cambia, se marca como "Reemplazado por ADR-YYYY" y se crea uno nuevo.

Plantilla → ver [`.claude/documentation.md`](../.claude/documentation.md).

---

## ADR-0001 — Adopción de los estándares de excelencia Kosmos

- **Fecha:** 2026-04-20
- **Estado:** Aceptado

### Contexto

El proyecto carecía de un sistema unificado que forzara a la IA (Claude Code) y al equipo humano a mantener los criterios de calidad de un producto profesional: documentación arquitectónica, ADRs, declaración de uso de IA, 3FN estricta, testing obligatorio, seguridad (Fortify + secretos), CI/CD como gate de merge y accesibilidad WCAG 2.2 AA. Además, el frontend vive una transición activa de Tailwind v4 a Chakra UI que necesita regla explícita.

### Decisión

Se adoptan los cinco pilares definidos en `CLAUDE.md → === kosmos excellence rules ===`, materializados como archivos de contexto en `.claude/`:

- `.claude/execution-protocol.md`
- `.claude/documentation.md`
- `.claude/clean-code-db.md`
- `.claude/testing-security.md`
- `.claude/devops.md`
- `.claude/frontend-a11y.md`

Se establecen como artefactos vivos este `docs/decision-log.md` y `docs/ai-usage-declaration.md`.

### Consecuencias

**Positivas**
- La IA recibe instrucciones persistentes sin tener que repetirlas por conversación.
- Cualquier excepción (nueva dependencia, deuda técnica aceptada) queda trazada.
- Gates automáticos (Pint, Pest, Lint, Build) previenen regresiones.

**Negativas / seguimiento**
- Requiere disciplina: cada PR debe tocar `ai-usage-declaration.md` y, si hay decisión arquitectónica, añadir ADR.
- Pendiente auditar `.github/workflows/` para asegurar que el pipeline refleja los gates (→ crear ADR-0002 si falta algo).
- Pendiente inventariar componentes Tailwind restantes y trazar plan de migración a Chakra (→ ADR-0003).
