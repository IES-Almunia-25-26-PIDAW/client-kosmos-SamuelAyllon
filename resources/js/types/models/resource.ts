export interface Resource {
    id: number;
    box_id: number;
    name: string;
    description: string | null;
    url: string | null;
    type: 'link' | 'document' | 'video' | 'image' | 'other';
    box?: { id: number; name: string };
    created_at: string;
    updated_at: string;
}
