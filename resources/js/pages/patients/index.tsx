import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { UserPlus, Search } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { PatientCard } from '@/components/patient/patient-card';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Patient, PatientStatus } from '@/types';

interface Props {
    patients: Patient[];
}

const filterLabels: { key: PatientStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'pending', label: 'Pendiente de cobro' },
    { key: 'overdue', label: 'Cobro vencido' },
    { key: 'noConsent', label: 'Sin consentimiento' },
    { key: 'openDeal', label: 'Acuerdo pendiente' },
];

export default function PatientsIndex({ patients }: Props) {
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState<PatientStatus | 'all'>('all');

    const filtered = patients.filter((p) => {
        const matchesSearch = p.project_name.toLowerCase().includes(search.toLowerCase())
            || (p.brand_tone ?? '').toLowerCase().includes(search.toLowerCase());

        const matchesFilter = activeFilter === 'all'
            || p.statuses.includes(activeFilter as PatientStatus)
            || (activeFilter === 'pending' && p.payment_status === 'pending')
            || (activeFilter === 'overdue' && p.payment_status === 'overdue');

        return matchesSearch && matchesFilter;
    });

    return (
        <AppLayout>
            <Head title="Pacientes — ClientKosmos" />

            <div className="flex flex-col gap-6 p-6 lg:p-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-display-2xl text-[var(--color-text)]">Pacientes</h1>
                    <Button variant="primary" onClick={() => router.visit('/patients/create')}>
                        <UserPlus size={16} className="mr-2" />
                        Añadir paciente
                    </Button>
                </div>

                {/* Search & filters */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar paciente…"
                            className="pl-9 h-10"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {filterLabels.map((f) => (
                            <button
                                key={f.key}
                                onClick={() => setActiveFilter(f.key)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-[var(--duration-normal)] ${
                                    activeFilter === f.key
                                        ? 'bg-[var(--color-primary)] text-[var(--color-primary-fg)]'
                                        : 'bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {filtered.length === 0 ? (
                    <EmptyState
                        icon={UserPlus}
                        title={patients.length === 0 ? 'Tu consulta empieza aquí' : 'Sin resultados'}
                        description={
                            patients.length === 0
                                ? 'Añade tu primer paciente para comenzar a gestionar tus sesiones.'
                                : 'Prueba con otro término de búsqueda o cambia el filtro activo.'
                        }
                        action={patients.length === 0 ? {
                            label: 'Añadir paciente',
                            onClick: () => router.visit('/patients/create'),
                        } : undefined}
                    />
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((patient) => (
                            <PatientCard key={patient.id} patient={patient} />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
