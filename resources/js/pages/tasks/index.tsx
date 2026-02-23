import { Link, router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Props } from '../../types/props';
import { Task } from '../../types/task';

export default function TasksIndex({ tasks, canAddTask, isFreeUser }: Props) {
    return (
        <AppLayout>
            <Head title="Tareas" />

            {/* Botón crear — solo si canAddTask es true */}
            { canAddTask && <Link href="/tasks/create">Nueva tarea</Link> }

            {/* Lista de tareas */}
            { tasks.map((task: Task) => (
                <div key={ task.id }>
                    <span>{ task.title }</span>

                    {/* Completar o reabrir según status */}
                    { task.status === 'pending'
                        ? <button onClick={() => router.patch(`/tasks/${task.id}/complete`)}>Completar</button>
                        : <button onClick={() => router.patch(`/tasks/${task.id}/reopen`)}>Reabrir</button>
                    }

                    {/* Eliminar */}
                    <button onClick={() => router.delete(`/tasks/${task.id}`)}>Eliminar</button>
                </div>
            ))}
        </AppLayout>
    );
}
