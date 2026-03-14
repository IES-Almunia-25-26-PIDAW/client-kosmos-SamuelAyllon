export interface AiLog {
    id: number;
    user_id: number;
    project_id: number | null;
    action_type: 'summary' | 'update' | 'plan_day';
    input_context: Record<string, unknown> | null;
    output_text: string;
    created_at: string;
}
