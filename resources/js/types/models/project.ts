import type { Idea } from './idea';
import type { Resource } from './resource';
import type { Task } from './task';

export interface KeyLink {
    label: string;
    url: string;
}

export interface Project {
    id: number;
    name: string;
    description: string | null;
    status: 'inactive' | 'active' | 'completed';
    color: string | null;
    brand_tone: string | null;
    service_scope: string | null;
    key_links: KeyLink[] | null;
    next_deadline: string | null;
    client_notes: string | null;
    tasks_count?: number;
    pending_tasks_count?: number;
    tasks?: Task[];
    ideas?: Idea[];
    resources?: Resource[];
    created_at: string;
    updated_at: string;
}
