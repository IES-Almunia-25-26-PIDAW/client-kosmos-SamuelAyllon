<?php

namespace App\Http\Controllers\Ai;

use App\Models\AiLog;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientSummaryAction extends AiAction
{
    public function __invoke(Request $request, Project $project): JsonResponse
    {
        $this->authorizeProject($request, $project);

        $pendingTasks = $project->tasks()->where('status', 'pending')
            ->orderBy('due_date')
            ->limit(10)
            ->get(['name', 'priority', 'due_date']);

        $completedCount = $project->tasks()->where('status', 'completed')->count();
        $pendingCount   = $project->tasks()->where('status', 'pending')->count();

        $ideas = $project->ideas()
            ->where('status', 'active')
            ->limit(5)
            ->get(['name', 'description']);

        $brandTone    = $project->brand_tone ?? 'No especificado';
        $serviceScope = $project->service_scope ?? 'No especificado';
        $clientNotes  = $project->client_notes ?? 'Sin notas';

        $prompt = <<<PROMPT
        Eres un asistente para profesionales de servicios. Resume el estado de este cliente en 3-4 líneas.

        Cliente: {$project->name}
        Descripción: {$project->description}
        Estado: {$project->status}
        Enfoque profesional: {$brandTone}
        Caso o servicio: {$serviceScope}
        Acuerdos y notas: {$clientNotes}
        Tareas completadas: {$completedCount}
        Tareas pendientes: {$pendingCount}

        Interpreta "Enfoque profesional" como el método o estilo de trabajo del profesional con este cliente. Interpreta "Caso o servicio" como la descripción del problema o servicio prestado. Interpreta "Acuerdos y notas" como decisiones y compromisos clave.
        PROMPT;

        if ($pendingTasks->isNotEmpty()) {
            $taskList = $pendingTasks->map(fn($t) => "- [{$t->priority}] {$t->name}" . ($t->due_date ? " (vence: {$t->due_date})" : ''))->implode("\n");
            $prompt .= "\n\nTareas pendientes:\n{$taskList}";
        }

        if ($ideas->isNotEmpty()) {
            $ideaList = $ideas->map(fn($i) => "- {$i->name}")->implode("\n");
            $prompt .= "\n\nNotas activas:\n{$ideaList}";
        }

        $prompt .= "\n\nResponde en español, de forma concisa y profesional. No uses encabezados.";

        $inputContext = [
            'project_id'      => $project->id,
            'pending_count'   => $pendingCount,
            'completed_count' => $completedCount,
        ];

        $output = $this->callAi($prompt);

        AiLog::create([
            'user_id'       => $request->user()->id,
            'project_id'    => $project->id,
            'action_type'   => 'summary',
            'input_context' => $inputContext,
            'output_text'   => $output,
        ]);

        return response()->json(['output' => $output]);
    }
}
