import type { Subscription } from '../models/subscription';
import type { Task } from '../models/task';

export interface DashboardProject {
    id: number;
    name: string;
    color: string | null;
    next_deadline: string | null;
    pending_tasks_count: number;
    overdue_tasks_count: number;
    upcoming_tasks_count: number;
}

export interface DashboardProps {
    todayTasks: Task[];
    activeProjects: DashboardProject[];
    atRiskProjects: DashboardProject[];
    subscription: Subscription | null;
}
