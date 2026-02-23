export interface Task {
    id: number;
    title: string;
    description: string | null;
    status: 'pending' | 'completed';
    priority: 'low' | 'medium' | 'high';
    project: {'id': number; 'name': string} | null;
    created_at: string;
    updated_at: string;
}