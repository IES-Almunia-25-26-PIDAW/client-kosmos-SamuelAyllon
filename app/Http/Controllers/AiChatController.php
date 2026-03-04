<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAiChatRequest;
use App\Models\AiConversation;
use App\Models\Idea;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use OpenAI;

class AiChatController extends Controller
{
    /**
     * Mostrar el chat con historial de conversación
     */
    public function index(): Response
    {
        $user = Auth::user();

        $messages = AiConversation::forUser($user)
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(fn($msg) => [
                'id' => $msg->id,
                'role' => $msg->role,
                'message' => $msg->message,
                'created_at' => $msg->created_at->toIso8601String(),
            ]);

        return Inertia::render('ai-chats/index', [
            'messages' => $messages,
        ]);
    }

    /**
     * Enviar mensaje al asistente IA y obtener respuesta
     */
    public function store(StoreAiChatRequest $request): JsonResponse
    {
        $user = Auth::user();
        $userMessage = $request->validated('message');

        // Guardar mensaje del usuario
        $userMsg = AiConversation::addUserMessage($user, $userMessage);

        // Obtener historial para contexto (últimos 20 mensajes)
        $history = AiConversation::forUser($user)
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->reverse()
            ->map(fn($msg) => [
                'role' => $msg->role,
                'content' => $msg->message,
            ])
            ->values()
            ->toArray();

        try {
            $client = OpenAI::factory()
                ->withApiKey(config('services.openai.key'))
                ->withBaseUri(config('services.openai.base_url'))
                ->make();

            $response = $client->chat()->create([
                'model' => env('OPENAI_MODEL', 'gpt-3.5-turbo'),
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => $this->getSystemPrompt($user),
                    ],
                    ...$history,
                ],
                'max_tokens' => 1500,
                'temperature' => 0.4,
            ]);

            $assistantMessage = trim($response->choices[0]->message->content);
            $tokensUsed = $response->usage->totalTokens ?? null;

            // Guardar respuesta del asistente
            $assistantMsg = AiConversation::addAssistantMessage($user, $assistantMessage, [
                'tokens_used' => $tokensUsed,
                'model' => env('OPENAI_MODEL', 'gpt-3.5-turbo'),
            ]);

            return response()->json([
                'user_message' => [
                    'id' => $userMsg->id,
                    'role' => 'user',
                    'message' => $userMsg->message,
                    'created_at' => $userMsg->created_at->toIso8601String(),
                ],
                'assistant_message' => [
                    'id' => $assistantMsg->id,
                    'role' => 'assistant',
                    'message' => $assistantMsg->message,
                    'created_at' => $assistantMsg->created_at->toIso8601String(),
                ],
            ]);
        } catch (\Throwable $e) {
            // Eliminar el mensaje del usuario si falla la API
            $userMsg->delete();

            return response()->json([
                'error' => 'Error al comunicarse con el asistente. Inténtalo de nuevo.',
            ], 422);
        }
    }

    /**
     * Limpiar historial de conversación
     */
    public function destroy(): JsonResponse
    {
        $user = Auth::user();

        AiConversation::forUser($user)->delete();

        return response()->json([
            'message' => 'Historial eliminado correctamente.',
        ]);
    }

    /**
     * Prompt del sistema para el asistente
     */
    private function getSystemPrompt($user): string
    {
        $context = $this->getUserContext($user);

        return <<<PROMPT
Eres Flowly AI, un asistente experto en productividad personal integrado en la plataforma Flowly. Tu rol es ser un coach de productividad inteligente que da consejos precisos, prácticos y personalizados.

## Tus áreas de especialización

1. **Priorización de tareas** — Matriz de Eisenhower, método ABCDE, regla 80/20 (Pareto), MoSCoW
2. **Gestión del tiempo** — Pomodoro, time-blocking, batching de tareas, ley de Parkinson
3. **Organización de ideas** — Mapas mentales, método SCAMPER, brainstorming estructurado, second brain (Zettelkasten)
4. **Planificación de proyectos** — Desglose en tareas (WBS), hitos, dependencias, estimación realista
5. **Hábitos y motivación** — Atomic Habits (hábitos atómicos), sistemas vs objetivos, gestión de energía

## Datos actuales del usuario

- **Nombre:** {$user->name}
{$context}

## Cómo debes razonar y responder

1. **Analiza la situación**: Antes de dar consejos, considera el contexto real del usuario (sus tareas pendientes, carga de trabajo, prioridades).
2. **Razona paso a paso**: Cuando el usuario pida ayuda para priorizar o planificar, explica brevemente tu razonamiento antes de dar la recomendación.
3. **Sé concreto y accionable**: En lugar de "deberías organizarte mejor", di exactamente qué hacer, en qué orden, y por qué.
4. **Referencia sus datos reales**: Si el usuario tiene tareas pendientes o proyectos, menciónalos por nombre cuando sea relevante.
5. **Estructura tus respuestas**: Usa listas, pasos numerados o categorías claras. No escribas bloques de texto sin formato.

## Directrices

- Responde siempre en español.
- Sé directo y útil. Máximo 4-5 párrafos por respuesta, pero prioriza calidad sobre brevedad.
- Usa emojis con moderación para hacer la conversación amigable.
- Si el usuario pregunta algo fuera de productividad, redirige amablemente la conversación.
- Cuando sea útil, sugiere crear tareas, ideas o proyectos en Flowly para poner en práctica tus consejos.
- Si no tienes suficiente información para dar un consejo preciso, haz preguntas clarificadoras antes de responder.
PROMPT;
    }

    /**
     * Obtener contexto real del usuario para el system prompt
     */
    private function getUserContext($user): string
    {
        $pendingTasks = Task::where('user_id', $user->id)->where('status', 'pending')->get();
        $completedThisMonth = Task::where('user_id', $user->id)
            ->where('status', 'completed')
            ->where('completed_at', '>=', now()->startOfMonth())
            ->count();
        $activeIdeas = Idea::where('user_id', $user->id)->where('status', 'active')->count();
        $activeProjects = Project::where('user_id', $user->id)->where('status', 'active')->count();

        $lines = [];
        $lines[] = "- **Tareas pendientes:** {$pendingTasks->count()}";
        $lines[] = "- **Tareas completadas este mes:** {$completedThisMonth}";
        $lines[] = "- **Ideas activas:** {$activeIdeas}";
        $lines[] = "- **Proyectos activos:** {$activeProjects}";

        // Detalle de tareas pendientes (nombre + prioridad + fecha vencimiento)
        if ($pendingTasks->isNotEmpty()) {
            $lines[] = '';
            $lines[] = '### Tareas pendientes del usuario';
            foreach ($pendingTasks as $task) {
                $priority = match ($task->priority) {
                    'high' => '🔴 Alta',
                    'medium' => '🟡 Media',
                    default => '🟢 Baja',
                };
                $due = $task->due_date ? " — vence: {$task->due_date->format('d/m/Y')}" : '';
                $lines[] = "- [{$priority}] {$task->name}{$due}";
            }
        }

        return implode("\n", $lines);
    }
}
