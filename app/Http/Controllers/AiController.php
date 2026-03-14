<?php

namespace App\Http\Controllers;

use App\Models\AiLog;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiController extends Controller
{
    /**
     * Planifica el día: recoge tareas pendientes y genera 3-5 acciones priorizadas.
     */
    public function planDay(Request $request): JsonResponse
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

    /**
     * Resumen del cliente: genera un resumen de 3-4 líneas del estado del proyecto.
     */
    public function clientSummary(Request $request, Project $project): JsonResponse
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

        $prompt = <<<PROMPT
        Eres un asistente para freelancers. Resume el estado de este cliente en 3-4 líneas.

        Cliente: {$project->name}
        Descripción: {$project->description}
        Estado: {$project->status}
        Tareas completadas: {$completedCount}
        Tareas pendientes: {$pendingCount}
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

    /**
     * Update del cliente: genera texto profesional listo para email/Slack.
     */
    public function clientUpdate(Request $request, Project $project): JsonResponse
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

        $recentNotes = $project->ideas()
            ->orderByDesc('created_at')
            ->limit(3)
            ->get(['name', 'description']);

        $prompt = "Eres un asistente para freelancers. Genera un update profesional para enviar al cliente \"{$project->name}\" por email o Slack.\n\n";

        if ($recentCompleted->isNotEmpty()) {
            $completedList = $recentCompleted->map(fn($t) => "- {$t->name}")->implode("\n");
            $prompt .= "Tareas completadas recientemente:\n{$completedList}\n\n";
        }

        if ($pendingTasks->isNotEmpty()) {
            $pendingList = $pendingTasks->map(fn($t) => "- {$t->name}" . ($t->due_date ? " (previsto: {$t->due_date})" : ''))->implode("\n");
            $prompt .= "Próximas tareas:\n{$pendingList}\n\n";
        }

        if ($recentNotes->isNotEmpty()) {
            $notesList = $recentNotes->map(fn($n) => "- {$n->name}")->implode("\n");
            $prompt .= "Notas recientes:\n{$notesList}\n\n";
        }

        $prompt .= "Genera un texto breve (máx. 150 palabras), profesional y cercano, en español. Incluye saludo y despedida. No pongas asunto de email.";

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

    /**
     * Llama a la API de OpenAI y devuelve el texto generado.
     */
    private function callAi(string $prompt): string
    {
        $config = config('services.openai');

        $httpOptions = [];
        if (!empty($config['ca_bundle'])) {
            $httpOptions['verify'] = $config['ca_bundle'];
        }

        $response = Http::withOptions($httpOptions)
            ->withToken($config['key'])
            ->timeout(30)
            ->post(rtrim($config['base_url'], '/') . '/chat/completions', [
                'model'    => config('services.openai.model', 'gpt-3.5-turbo'),
                'messages' => [
                    ['role' => 'system', 'content' => 'Eres un asistente conciso y profesional para freelancers que gestionan clientes. Respondes siempre en español.'],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'max_tokens'  => 500,
                'temperature' => 0.7,
            ]);

        if ($response->failed()) {
            Log::error('OpenAI API call failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            return 'Lo siento, no he podido generar la respuesta en este momento. Inténtalo de nuevo más tarde.';
        }

        return $response->json('choices.0.message.content', 'No se ha podido generar una respuesta.');
    }

    /**
     * Verifica que el usuario es dueño del proyecto.
     */
    private function authorizeProject(Request $request, Project $project): void
    {
        abort_unless($project->user_id === $request->user()->id, 403);
    }
}
