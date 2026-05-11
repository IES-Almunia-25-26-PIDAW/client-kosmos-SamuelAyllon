---
adr: "0024"
title: "Pipeline de transcripción: VAD client-side, filtro server-side y refactor a MediaRecorder continuo"
date: 2026-05-08
status: "Parcialmente aceptado — fases 1 y 2 implementadas; fase 3 pendiente"
---

# ADR-0024 — Pipeline de transcripción: VAD client-side, filtro server-side y refactor a `MediaRecorder` continuo

## Contexto

La transcripción en vivo (Groq Whisper-large-v3-turbo, `language=es`) generaba segmentos espurios cada ~15 s con texto del tipo "Gracias.", "Subtítulos por la comunidad de Amara.org", "¡Suscríbete!" — alucinaciones clásicas del modelo cuando recibe audio en silencio o de muy bajo SNR. El pipeline original tenía cuatro debilidades concurrentes:

1. Sin VAD client-side: cada slice de 15 s se enviaba siempre, hablen o no.
2. Filtro server-side mínimo (`text === ''`); Whisper rara vez devuelve vacío en silencio — devuelve alucinaciones.
3. Llamada a Groq sin `temperature=0` ni `prompt` de dominio → mayor entropía → más alucinación.
4. `new MediaRecorder()` por slice: el primer ~100-300 ms de cada WebM/Opus contiene preroll sin contenido útil, y se pierden palabras a caballo entre slices.

Adicionalmente, no había telemetría que indicase si el profesional había compartido audio de la pestaña o si había caído al fallback de micrófono.

## Decisión

**Fase 1 (implementada) — backend hardening**
- Pasar `temperature=0` y `prompt` clínico ("Conversación clínica entre profesional sanitario y paciente, en español de España. Vocabulario médico habitual.") en cada llamada a Groq Whisper.
- `TranscribeChunkJob::isHallucination()`: lista negra de patrones (`gracias`, `muchas gracias`, `gracias por (ver|escuchar)`, `subtítulos? (por|realizad|creados?)`, `amara.org`, `^suscríb`, `^subtitulado por`) más descarte de strings solo-puntuación. Trabaja sobre el texto normalizado (lower + sin puntuación).
- Los descartes se loguean a `info` y **no** se persiste segmento ni se emite `TranscriptionSegmentCreated` (la UI no recibe el ruido).

**Fase 2 (implementada) — VAD client-side y telemetría**
- Hooks `use-professional-tab-recorder` y `use-audio-chunks`: durante cada slice, un `AnalyserNode` muestrea RMS cada 100 ms. Si ninguna muestra supera `silenceRmsThreshold` (default `0.012`), el blob no se sube y se incrementa `chunksSkippedSilent`. Si `AudioContext` no está disponible (jsdom en tests), el VAD se desactiva grácilmente y se sube todo (compat).
- Telemetría de fuente: `audioSource: 'tab' | 'microphone' | null` expuesta en el state del hook, más `console.info` cuando se cae al micrófono.

**Fase 3 (pendiente, requiere PR aparte) — `MediaRecorder` continuo con `start(timeslice)`**
- Reemplazar el patrón "un `MediaRecorder` nuevo por slice" por un único `MediaRecorder` que se inicia una vez con `recorder.start(chunkDurationMs)` y emite blobs vía `ondataavailable` periódicamente.
- Elimina los headers/preroll Opus duplicados al inicio de cada slice.
- Evita pérdida de palabras a caballo entre slices.
- No se aplica en este ADR porque cambia de forma significativa la lógica de offsets (`started_at_ms`/`ended_at_ms`) y el ciclo de vida del recorder, requiere actualizar los tests vitest, y conviene validar el resultado visual primero con Fases 1+2 en producción.

## Consecuencias

**Positivas**
- "Gracias." y similares dejan de aparecer en la transcripción en vivo aunque el modelo siga alucinando — el filtro server-side los corta antes de emitir el evento.
- Coste Groq reducido: los slices silenciosos no llegan a la API (VAD client-side).
- Trazabilidad: número de slices descartados visible en el state del hook + log estructurado en backend.
- `temperature=0` mejora reproducibilidad de la transcripción para casos de soporte.

**Negativas / seguimiento**
- El `silenceRmsThreshold` por defecto (0.012) está calibrado a ojo. Si entornos clínicos muy silenciosos se quedan sin transcripción, exponer el umbral por configuración o ajustarlo tras observación en producción.
- La lista negra de alucinaciones es estática; nuevos patrones pueden requerir actualización.
- Fase 3 sigue abierta: hasta que se haga, persiste la pérdida fronteriza entre slices y el preroll Opus. Crear ADR-0025 cuando se aborde (ver nota: el número 0025 está tomado por otra decisión — asignar el siguiente libre).
