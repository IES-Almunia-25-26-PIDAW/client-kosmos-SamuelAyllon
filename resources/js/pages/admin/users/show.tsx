import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, UserCog, Trash2 } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { KPICard } from '@/components/patient/kpi-card';
import type { Auth } from '@/types';

interface UserDetail {
    id: number;
    name: string;
    email: string;
    role: 'professional' | 'admin';
    practice_name: string | null;
    specialty: string | null;
    city: string | null;
    patients_count: number;
    sessions_count: number;
    paid_amount: number;
    created_at: string;
}

interface Props {
    user: UserDetail;
}

export default function AdminUserShow({ user }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const { data, setData, put, processing } = useForm({ role: user.role });

    const isSelf = user.id === auth.user.id;

    const handleRoleChange = () => {
        put(`/admin/users/${user.id}/role`);
    };

    const handleDelete = () => {
        if (!confirm(`¿Eliminar a ${user.name}? Esta acción no se puede deshacer.`)) return;
        router.delete(`/admin/users/${user.id}`);
    };

    const formatDate = (d: string) =>
        new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(d));

    return (
        <AdminLayout>
            <Head title={`${user.name} — Admin — ClientKosmos`} />

            <div className="flex flex-col gap-6 p-6 lg:p-8 max-w-4xl">
                <div className="flex items-start justify-between">
                    <div>
                        <Link
                            href="/admin/users"
                            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] mb-4"
                        >
                            <ArrowLeft size={16} />
                            Volver a usuarios
                        </Link>
                        <h1 className="text-display-2xl text-[var(--color-text)]">{user.name}</h1>
                        <p className="mt-1 text-body-md text-[var(--color-text-secondary)]">{user.email}</p>
                    </div>

                    {!isSelf && (
                        <Button variant="destructive" size="sm" onClick={handleDelete}>
                            <Trash2 size={14} />
                            Eliminar usuario
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <KPICard label="Pacientes" value={user.patients_count} />
                    <KPICard label="Sesiones" value={user.sessions_count} />
                    <KPICard label="Facturado" value={`€${Number(user.paid_amount ?? 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`} />
                    <KPICard label="Alta" value={formatDate(user.created_at)} />
                </div>

                <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)] space-y-4">
                    <h2 className="text-display-lg text-[var(--color-text)]">Información</h2>
                    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {user.practice_name && (
                            <div>
                                <dt className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">Consulta</dt>
                                <dd className="text-sm text-[var(--color-text)] mt-0.5">{user.practice_name}</dd>
                            </div>
                        )}
                        {user.specialty && (
                            <div>
                                <dt className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">Especialidad</dt>
                                <dd className="text-sm text-[var(--color-text)] mt-0.5">{user.specialty}</dd>
                            </div>
                        )}
                        {user.city && (
                            <div>
                                <dt className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">Ciudad</dt>
                                <dd className="text-sm text-[var(--color-text)] mt-0.5">{user.city}</dd>
                            </div>
                        )}
                    </dl>
                </div>

                {!isSelf && (
                    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)] space-y-4">
                        <h2 className="text-display-lg text-[var(--color-text)]">Rol</h2>
                        <div className="flex items-center gap-4">
                            <select
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value as 'professional' | 'admin')}
                                className="h-10 px-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] text-base focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                            >
                                <option value="professional">Profesional</option>
                                <option value="admin">Administrador</option>
                            </select>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleRoleChange}
                                loading={processing}
                                disabled={data.role === user.role}
                            >
                                <UserCog size={14} />
                                Actualizar rol
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
