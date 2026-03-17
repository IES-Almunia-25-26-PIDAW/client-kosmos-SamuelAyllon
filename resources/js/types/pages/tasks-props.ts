import type { Task } from '../models/task';

export interface TasksProps {
    tasks: Task[];
    canAddTask: boolean;
    isFreeUser: boolean;
}
