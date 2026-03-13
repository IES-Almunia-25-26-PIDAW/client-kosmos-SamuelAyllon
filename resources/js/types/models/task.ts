export interface Task {
    id: number;
    name: string;
    description: string | null;
    status: 'pending' | 'completed';
    priority: 'low' | 'medium' | 'high';
    due_date: string | null;
    completed_at: string | null;
    project: { id: number; name: string; color: string | null } | null;
    created_at: string;
    updated_at: string;
}