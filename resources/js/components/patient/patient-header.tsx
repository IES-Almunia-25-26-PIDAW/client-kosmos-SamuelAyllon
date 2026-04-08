import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import type { Patient, PatientStatus } from '@/types';

interface PatientHeaderProps {
    patient: Patient;
    className?: string;
}

const PatientHeader: React.FC<PatientHeaderProps> = ({ patient, className = '' }) => {
    const statuses: PatientStatus[] = patient.statuses ?? [];

    return (
        <div className={`sticky top-0 z-[var(--z-sticky)] border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] ${className}`}>
            <div className="h-[73px] px-4 lg:px-8 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Link
                        href="/patients"
                        className="p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-alt)] transition-colors"
                        aria-label="Volver a pacientes"
                    >
                        <ArrowLeft size={18} className="text-[var(--color-text-secondary)]" />
                    </Link>

                    {patient.avatar_path ? (
                        <img src={patient.avatar_path} alt={patient.project_name} className="h-9 w-9 rounded-full object-cover shrink-0" />
                    ) : (
                        <div className="h-9 w-9 rounded-full bg-[var(--color-primary-subtle)] flex items-center justify-center shrink-0 text-[var(--color-primary)] text-sm font-semibold">
                            {patient.project_name.substring(0, 2).toUpperCase()}
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <h1 className="text-label text-[var(--color-text)] truncate">{patient.project_name}</h1>
                        {statuses.length > 0 && (
                            <div className="flex gap-1 mt-0.5 overflow-x-auto">
                                {statuses.map((s) => (
                                    <StatusBadge key={s} status={s} variant="subtle" />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/patients/${patient.id}/edit`} className="p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-alt)] transition-colors" aria-label="Editar paciente">
                        <Edit size={16} className="text-[var(--color-text-secondary)]" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

PatientHeader.displayName = 'PatientHeader';

export { PatientHeader };
