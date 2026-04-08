import { Head, Link, router, usePage } from '@inertiajs/react';
import { Users, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import type { Auth } from '@/types';

interface UserRow {
    id: number;
    name: string;
    email: string;
    role: 'professional' | 'admin';
    patients_count: number;
    sessions_count: number;
    paid_amount: number;
    created_at: string;
}

interface Props {
    users: {
        data: UserRow[];
        current_page: number;
        last_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

const formatDate = (d: string) =>
    new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d));

export default function AdminUsersIndex({ users }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;

    const deleteUser = (user: UserRow) => {
        if (!confirm(`¿Eliminar a ${user.name}? Esta acción no se puede deshacer.`)) return;
        router.delete(`/admin/users/${user.id}`);
    };

    return (
        <AdminLayout>
            <Head title="Usuarios — Admin — ClientKosmos" />

            <div className="flex flex-col gap-6 p-6 lg:p-8">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-display-2xl text-[var(--color-text)] flex items-center gap-3">
                            <Users size={28} />
                            Profesionales
                        </h1>
                        <p className="mt-1 text-body-md text-[var(--color-text-secondary)]">
                            {users.total} profesionales registrados
                        </p>
                    </div>
                    <Link href="/admin/users/create">
                        <Button variant="primary">
                            <Plus size={16} />
                            Nuevo profesional
                        </Button>
                    </Link>
                </div>

                <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-[var(--shadow-sm)]">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-alt)]">
                                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Usuario</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Pacientes</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Sesiones</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Facturado</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Alta</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border-subtle)]">
                            {users.data.map((user) => (
                                <tr key={user.id} className="hover:bg-[var(--color-surface-alt)] transition-colors">
                                    <td className="px-4 py-3">
                                        <Link href={`/admin/users/${user.id}`} className="font-medium text-[var(--color-primary)] hover:underline">
                                            {user.name}
                                        </Link>
                                        <p className="text-xs text-[var(--color-text-secondary)]">{user.email}</p>
                                    </td>
                                    <td className="px-4 py-3 text-center text-[var(--color-text)]">{user.patients_count}</td>
                                    <td className="px-4 py-3 text-center text-[var(--color-text)]">{user.sessions_count}</td>
                                    <td className="px-4 py-3 text-right text-[var(--color-text)] tabular-nums">
                                        €{Number(user.paid_amount ?? 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">{formatDate(user.created_at)}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/users/${user.id}`}>
                                                <Button variant="secondary" size="sm">
                                                    Ver
                                                </Button>
                                            </Link>
                                            {user.id !== auth.user.id && (
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => deleteUser(user)}
                                                >
                                                    <Trash2 size={13} />
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {users.last_page > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-alt)]">
                            <p className="text-xs text-[var(--color-text-secondary)]">
                                {users.total} usuarios · Página {users.current_page} de {users.last_page}
                            </p>
                            <div className="flex gap-1">
                                {users.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        className={`px-3 py-1 text-xs rounded-[var(--radius-sm)] transition-colors ${
                                            link.active
                                                ? 'bg-[var(--color-primary)] text-[var(--color-primary-fg)]'
                                                : link.url
                                                    ? 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
                                                    : 'text-[var(--color-text-muted)] cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
