import {Task} from './task';
import {Idea} from './idea';
import {Subscription} from './subscription';

export interface DashboardProps {
    pendingTasks: Task[];
    activeIdeas: Idea[];
    activeProjects: { id: number; name: string; color: string }[];
    subscription: Subscription | null;
}