<?php

namespace App\Http\Controllers\Ai;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use OpenAI\Client as OpenAIClient;

abstract class AiAction extends Controller
{
    public function __construct(protected OpenAIClient $client) {}

    protected function callAi(string $prompt): string
    {
        if (empty(config('services.groq.api_key'))) {
            Log::warning('AI: GROQ_API_KEY no está configurada en .env');
            return 'La IA no está disponible: falta configurar la API key. Contacta al administrador.';
        }

        try {
            $response = $this->client->chat()->create([
                'model'       => config('services.groq.model', 'llama-3.3-70b-versatile'),
                'messages'    => [
                    ['role' => 'system', 'content' => 'Eres un asistente conciso y profesional para freelancers que gestionan clientes. Respondes siempre en español.'],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'max_tokens'  => 500,
                'temperature' => 0.7,
            ]);

            return $response->choices[0]->message->content ?? 'No se ha podido generar una respuesta.';
        } catch (\Exception $e) {
            Log::error('AI API exception: ' . $e->getMessage());

            if (str_contains($e->getMessage(), '401')) {
                return 'Error de autenticación con la IA: verifica que la API key sea válida.';
            }
            if (str_contains($e->getMessage(), '429')) {
                return 'Se ha superado el límite de peticiones a la IA. Inténtalo en unos minutos.';
            }

            return 'Error de conexión con la IA: ' . (app()->isLocal() ? $e->getMessage() : 'inténtalo de nuevo más tarde.');
        }
    }

    protected function authorizeProject(Request $request, Project $project): void
    {
        abort_unless($project->user_id === $request->user()->id, 403);
    }
}
