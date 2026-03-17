import type { Payment } from '../models/payment';
import type { Role } from '../models/role';
import type { Subscription } from '../models/subscription';

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
    tasks_count?: number;
    ideas_count?: number;
    projects_count?: number;
    subscription?: Subscription | null;
    roles?: Role[];
    payments?: Payment[];
}

export type RecentUser = Pick<AdminUser, 'id' | 'name' | 'email' | 'created_at'>;
