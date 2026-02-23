import { Task } from './task';

export interface Props {
    tasks: Task[];
    canAddTask: boolean;
    isFreeUser: boolean;
}