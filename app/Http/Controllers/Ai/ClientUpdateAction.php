<?php

namespace App\Http\Controllers\Ai;

use App\Models\AiLog;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientUpdateAction extends AiAction
{
    public function __invoke(Request $request, Project $project): JsonResponse
    {
        $this->authorizeProject($request, $project);

        $recentCompleted = $project->tasks()
            ->where('status', 'completed')
            ->orderByDesc('completed_at')
            ->limit(5)
            ->get(['name', 'completed_at']);

        $pendingTasks = $project->tasks()
            ->where('status', 'pending')
            ->orderBy('due_date')
            ->limit(5)
            ->get(['name', 'priority', 'due_date']);

        $recentIdeas = $project->ideas()
            ->orderByDesc('created_at')
            ->limit(3)
            ->get(['name', 'description']);

        $serviceScope = $project->service_scope ?? 'No especificado';
        $clientNotes  = $project->client_notes ?? 'Sin notas';

        $prompt = "Eres un asistente para profesionales de servicios. Genera un parte semanal profesional sobre el caso \"{$project->name}\".\n\n";
        $prompt .= "Caso o servicio: {$serviceScope}\n";
        $prompt .= "Acuerdos y notas: {$clientNotes}\n\n";

        if ($recentCompleted->isNotEmpty()) {
            $completedList = $recentCompleted->map(fn($t) => "- {$t->name}")->implode("\n");
            $prompt .= "Tareas completadas recientemente:\n{$completedList}\n\n";
        }

        if ($pendingTasks->isNotEmpty()) {
            $pendingList = $pendingTasks->map(fn($t) => "- {$t->name}" . ($t->due_date ? " (previsto: {$t->due_date})" : ''))->implode("\n");
            $prompt .= "Próximas tareas:\n{$pendingList}\n\n";
        }

        if ($recentIdeas->isNotEmpty()) {
            $ideasList = $recentIdeas->map(fn($n) => "- {$n->name}")->implode("\n");
            $prompt .= "Ideas recientes:\n{$ideasList}\n\n";
        }

        $prompt .= "Genera un parte breve (máx. 150 palabras) sobre la evolución del caso, profesional y cercano, en español. Incluye estado actual, avances y próximos pasos. No pongas asunto de email.";

        $inputContext = [
            'project_id'       => $project->id,
            'completed_count'  => $recentCompleted->count(),
            'pending_count'    => $pendingTasks->count(),
        ];

        $output = $this->callAi($prompt);

        AiLog::create([
            'user_id'       => $request->user()->id,
            'project_id'    => $project->id,
            'action_type'   => 'update',
            'input_context' => $inputContext,
            'output_text'   => $output,
        ]);

        return response()->json(['output' => $output]);
    }
}
