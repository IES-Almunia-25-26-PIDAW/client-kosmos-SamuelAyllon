import type { PaginatedData } from '../shared/pagination';
import type { AdminUser } from './admin-user';

export interface AdminUsersIndexProps {
    users: PaginatedData<AdminUser>;
}
