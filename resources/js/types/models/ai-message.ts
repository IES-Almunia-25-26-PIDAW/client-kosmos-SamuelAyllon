/**
 * Mensaje de conversación con el asistente IA
 */
export interface AiMessage {
    id: number;
    role: 'user' | 'assistant';
    message: string;
    created_at: string;
}
