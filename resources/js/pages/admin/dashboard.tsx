import { Head, Link } from '@inertiajs/react';
import { Users, UserCheck, Brain, Calendar, Euro, TrendingUp } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { KPICard } from '@/components/patient/kpi-card';

interface AdminStats {
    total_users: number;
    active_users: number;
    total_patients: number;
    total_sessions: number;
    total_revenue: number;
    pending_amount: number;
}

interface RecentUser {
    id: number;
    name: string;
    email: string;
    role: string;
    patients_count: number;
    sessions_count: number;
    created_at: string;
}

interface Props {
    stats: AdminStats;
    recentUsers: {
        data: RecentUser[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

const formatDate = (d: string) =>
    new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d));

export default function AdminDashboard({ stats, recentUsers }: Props) {
    return (
        <AdminLayout>
            <Head title="Admin Dashboard — ClientKosmos" />

            <div className="flex flex-col gap-8 p-6 lg:p-8">
                <div>
                    <h1 className="text-display-2xl text-[var(--color-text)]">Panel de administración</h1>
                    <p className="mt-1 text-body-md text-[var(--color-text-secondary)]">
                        Vista global de la plataforma ClientKosmos
                    </p>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                    <KPICard label="Profesionales" value={stats.total_users} icon={Users} />
                    <KPICard label="Con pacientes activos" value={stats.active_users} icon={UserCheck} />
                    <KPICard label="Total pacientes" value={stats.total_patients} icon={Brain} />
                    <KPICard label="Total sesiones" value={stats.total_sessions} icon={Calendar} />
                    <KPICard label="Facturado total" value={`€${Number(stats.total_revenue).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`} icon={Euro} />
                    <KPICard label="Pendiente de cobro" value={`€${Number(stats.pending_amount).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`} icon={TrendingUp} />
                </div>

                {/* Recent users table */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-display-lg text-[var(--color-text)]">Últimos profesionales</h2>
                        <Link href="/admin/users" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
                            Ver todos →
                        </Link>
                    </div>
                    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-[var(--shadow-sm)]">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-alt)]">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Usuario</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Pacientes</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Sesiones</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Alta</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border-subtle)]">
                                {recentUsers.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-[var(--color-surface-alt)] transition-colors">
                                        <td className="px-4 py-3">
                                            <Link href={`/admin/users/${user.id}`} className="font-medium text-[var(--color-primary)] hover:underline">
                                                {user.name}
                                            </Link>
                                            <p className="text-xs text-[var(--color-text-secondary)]">{user.email}</p>
                                        </td>
                                        <td className="px-4 py-3 text-center text-[var(--color-text)]">{user.patients_count}</td>
                                        <td className="px-4 py-3 text-center text-[var(--color-text)]">{user.sessions_count}</td>
                                        <td className="px-4 py-3 text-[var(--color-text-secondary)]">{formatDate(user.created_at)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
