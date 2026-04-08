<?php

namespace App\Http\Controllers\Ai;

use App\Models\AiLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlanDayAction extends AiAction
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();

        $tasks = $user->tasks()
            ->where('status', 'pending')
            ->with('project:id,name,service_scope')
            ->orderByRaw("CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END")
            ->orderBy('due_date')
            ->limit(20)
            ->get(['id', 'name', 'priority', 'due_date', 'project_id']);

        if ($tasks->isEmpty()) {
            return response()->json([
                'output' => "¡No tienes tareas pendientes! Disfruta del día o crea nuevas tareas para tus clientes.",
            ]);
        }

        $taskLines = $tasks->map(function ($t) {
            $line = "- [{$t->priority}] {$t->name}";
            if ($t->project) {
                $line .= " (cliente: {$t->project->name}";
                if ($t->project->service_scope) {
                    $line .= " | servicio: {$t->project->service_scope}";
                }
                $line .= ")";
            }
            if ($t->due_date) {
                $line .= " — vence: {$t->due_date}";
            }
            return $line;
        })->implode("\n");

        $today = now()->format('Y-m-d');

        $prompt = <<<PROMPT
        Eres un asistente de productividad para profesionales de servicios. Hoy es {$today}.

        El usuario gestiona varios casos o clientes de forma simultánea. Tu objetivo principal es facilitar el cambio de contexto entre ellos: quién es el siguiente, qué se acordó, qué queda pendiente.

        Estas son las tareas pendientes del usuario:
        {$taskLines}

        Genera un plan del día con 3 a 5 bloques priorizados. Para cada bloque indica:
        1. Cliente/caso al que pertenece y contexto breve (enfoque, situación actual)
        2. Qué hacer concretamente
        3. Por qué es prioritario hoy

        Agrupa las acciones por cliente cuando sea posible. Responde en español, con formato limpio y conciso. Usa viñetas.
        PROMPT;

        $inputContext = ['tasks_count' => $tasks->count(), 'date' => $today];

        $output = $this->callAi($prompt);

        AiLog::create([
            'user_id'       => $user->id,
            'project_id'    => null,
            'action_type'   => 'plan_day',
            'input_context' => $inputContext,
            'output_text'   => $output,
        ]);

        return response()->json(['output' => $output]);
    }
}
