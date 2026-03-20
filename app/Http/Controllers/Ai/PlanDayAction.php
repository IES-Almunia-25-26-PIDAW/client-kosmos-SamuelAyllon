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
            ->with('project:id,name')
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
                $line .= " (cliente: {$t->project->name})";
            }
            if ($t->due_date) {
                $line .= " — vence: {$t->due_date}";
            }
            return $line;
        })->implode("\n");

        $today = now()->format('Y-m-d');

        $prompt = <<<PROMPT
        Eres un asistente de productividad para freelancers. Hoy es {$today}.

        Estas son las tareas pendientes del usuario:
        {$taskLines}

        Genera un plan del día con 3 a 5 acciones concretas priorizadas. Para cada acción indica:
        1. Qué hacer (nombre de la tarea)
        2. Por qué es prioritaria (brevemente)

        Responde en español, con formato limpio y conciso. Usa viñetas.
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
