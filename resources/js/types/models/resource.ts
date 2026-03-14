export interface Resource {
    id: number;
    project_id: number;
    name: string;
    description: string | null;
    url: string | null;
    type: 'link' | 'document' | 'video' | 'image' | 'other';
    project?: { id: number; name: string; color: string | null };
    created_at: string;
    updated_at: string;
}
