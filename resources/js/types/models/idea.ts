export interface Idea {
    id: number;
    project_id: number | null;
    name: string;
    description: string | null;
    priority: 'low' | 'medium' | 'high';
    status: 'active' | 'resolved';
    source: 'manual' | 'voice' | 'ai_suggestion';
    created_at: string;
    updated_at: string;
}
