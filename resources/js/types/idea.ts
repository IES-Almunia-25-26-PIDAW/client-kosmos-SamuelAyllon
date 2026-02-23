export interface Idea {
    id: number;
    title: string;
    description: string | null;
    status: 'active' | 'resolved';
    created_at: string;
    updated_at: string;
}