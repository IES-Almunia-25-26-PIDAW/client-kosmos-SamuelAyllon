<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAiChatRequest;
use App\Models\AiConversation;
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
            $client = OpenAI::client(config('services.openai.key'));

            $response = $client->chat()->create([
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => $this->getSystemPrompt($user),
                    ],
                    ...$history,
                ],
                'max_tokens' => 1000,
                'temperature' => 0.7,
            ]);

            $assistantMessage = trim($response->choices[0]->message->content);
            $tokensUsed = $response->usage->totalTokens ?? null;

            // Guardar respuesta del asistente
            $assistantMsg = AiConversation::addAssistantMessage($user, $assistantMessage, [
                'tokens_used' => $tokensUsed,
                'model' => 'gpt-3.5-turbo',
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
        return <<<PROMPT
Eres un asistente de productividad personal llamado Flowly AI. Tu objetivo es ayudar a los usuarios a:

1. **Organizar sus ideas**: Ayúdales a estructurar pensamientos, hacer brainstorming y desarrollar conceptos.

2. **Priorizar tareas**: Sugiere cómo ordenar tareas por importancia y urgencia usando la matriz de Eisenhower u otras técnicas.

3. **Planificar su jornada**: Ayuda a crear rutinas productivas, distribuir el tiempo y establecer objetivos diarios realistas.

4. **Mejorar su productividad**: Ofrece consejos sobre gestión del tiempo, técnicas como Pomodoro, y cómo evitar la procrastinación.

5. **Gestionar proyectos**: Asiste en la descomposición de proyectos grandes en tareas manejables.

Contexto del usuario:
- Nombre: {$user->name}
- Es usuario premium de Flowly, una plataforma de productividad personal.

Directrices:
- Responde siempre en español.
- Sé conciso pero útil. No uses más de 3-4 párrafos por respuesta.
- Usa emojis moderadamente para hacer la conversación más amigable.
- Si el usuario pide ayuda con algo fuera de productividad, amablemente redirige la conversación.
- Puedes sugerir crear tareas, ideas o proyectos en Flowly cuando sea relevante.
PROMPT;
    }
}
