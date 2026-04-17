import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Plus, Search, Trash2, Users } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import type { Auth } from '@/types';
import DashboardIndexAction from '@/actions/App/Http/Controllers/Admin/DashboardIndexAction';
import CreateAction from '@/actions/App/Http/Controllers/Admin/Users/CreateAction';
import DestroyAction from '@/actions/App/Http/Controllers/Admin/Users/DestroyAction';
import ShowAction from '@/actions/App/Http/Controllers/Admin/Users/ShowAction';

interface UserRow {
    id: number;
    name: string;
    email: string;
    patients_count: number;
    professional_appointments_count: number;
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
    filters: {
        search: string;
        role: string;
    };
}

const ROLE_FILTERS = [
    { value: 'all', label: 'Todos' },
    { value: 'professional', label: 'Profesional' },
    { value: 'patient', label: 'Paciente' },
] as const;

const formatDate = (d: string) =>
    new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d));

export default function AdminDashboard({ users, filters }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [search, setSearch] = useState(filters.search ?? '');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            router.get(
                DashboardIndexAction.url(),
                { search: search || undefined, role: filters.role !== 'all' ? filters.role : undefined },
                { preserveState: true, replace: true },
            );
        }, 350);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [search]);

    const applyRoleFilter = (role: string) => {
        router.get(
            DashboardIndexAction.url(),
            { search: search || undefined, role: role !== 'all' ? role : undefined },
            { preserveState: true, replace: true },
        );
    };

    const deleteUser = (e: React.MouseEvent, user: UserRow) => {
        e.stopPropagation();
        if (!confirm(`¿Eliminar a ${user.name}? Esta acción no se puede deshacer.`)) return;
        router.delete(DestroyAction.url({ user: user.id }));
    };

    const activeRole = filters.role ?? 'all';

    return (
        <>
            <Head title="Usuarios — Admin — ClientKosmos" />

            <div className="flex flex-col gap-6 p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-display-2xl text-[var(--color-text)] flex items-center gap-3">
                            <Users size={28} />
                            Usuarios
                        </h1>
                        <p className="mt-1 text-body-md text-[var(--color-text-secondary)]">
                            {users.total} usuarios registrados
                        </p>
                    </div>
                    <Button variant="primary" onClick={() => router.visit(CreateAction.url())}>
                        <Plus size={16} />
                        Nuevo usuario
                    </Button>
                </div>

                {/* Search + filters */}
                <div className="flex flex-col items-center gap-3">
                    <div className="relative w-full max-w-xl">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por nombre o correo…"
                            className="w-full h-10 pl-9 pr-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-[border-color,box-shadow]"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        {ROLE_FILTERS.map((f) => (
                            <button
                                key={f.value}
                                onClick={() => applyRoleFilter(f.value)}
                                className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
                                    activeRole === f.value
                                        ? 'bg-[var(--color-primary)] text-[var(--color-primary-fg)] border-[var(--color-primary)]'
                                        : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-alt)]'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
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
                            {users.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-[var(--color-text-secondary)]">
                                        No se encontraron usuarios.
                                    </td>
                                </tr>
                            )}
                            {users.data.map((user) => (
                                <tr
                                    key={user.id}
                                    onClick={() => router.visit(ShowAction.url({ user: user.id }))}
                                    className="hover:bg-[var(--color-surface-alt)] transition-colors cursor-pointer"
                                >
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-[var(--color-text)]">{user.name}</p>
                                        <p className="text-xs text-[var(--color-text-secondary)]">{user.email}</p>
                                    </td>
                                    <td className="px-4 py-3 text-center text-[var(--color-text)]">{user.patients_count}</td>
                                    <td className="px-4 py-3 text-center text-[var(--color-text)]">{user.professional_appointments_count}</td>
                                    <td className="px-4 py-3 text-right text-[var(--color-text)] tabular-nums">
                                        €{Number(user.paid_amount ?? 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">{formatDate(user.created_at)}</td>
                                    <td className="px-4 py-3 text-right">
                                        {user.id !== auth.user.id && (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={(e) => deleteUser(e, user)}
                                            >
                                                <Trash2 size={13} />
                                            </Button>
                                        )}
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
        </>
    );
}

AdminDashboard.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;
