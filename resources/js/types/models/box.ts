import type { Resource } from './resource';

export interface Box {
    id: number;
    name: string;
    description: string | null;
    category: string | null;
    resources_count?: number;
    resources?: Resource[];
    created_at: string;
    updated_at: string;
}
