import type { AdminUser } from './admin-user';

export interface AdminUserDashboardData {
    active_tasks: number;
    completed_this_month: number;
    total_ideas: number;
    total_projects: number;
    is_premium: boolean;
}

export interface AdminUserShowProps {
    user: AdminUser;
    dashboardData: AdminUserDashboardData;
}
