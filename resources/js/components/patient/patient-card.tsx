import React from 'react';
import { Link } from '@inertiajs/react';
import { StatusBadge } from '@/components/ui/status-badge';
import type { Patient, PatientStatus } from '@/types';

interface PatientCardProps {
    patient: Patient;
    className?: string;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient, className = '' }) => {
    const statuses: PatientStatus[] = patient.statuses ?? [];

    return (
        <Link
            href={`/patients/${patient.id}`}
            className={`block rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all duration-[var(--duration-normal)] cursor-pointer ${className}`}
        >
            <div className="flex items-center gap-3 mb-3">
                {patient.avatar_path ? (
                    <img src={patient.avatar_path} alt={patient.project_name} className="h-10 w-10 rounded-full object-cover shrink-0" />
                ) : (
                    <div className="h-10 w-10 rounded-full bg-[var(--color-primary-subtle)] flex items-center justify-center shrink-0 text-[var(--color-primary)] font-semibold text-sm">
                        {patient.project_name.substring(0, 2).toUpperCase()}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <h3 className="text-label text-[var(--color-text)] truncate">{patient.project_name}</h3>
                    {patient.brand_tone && (
                        <p className="text-xs text-[var(--color-text-muted)] truncate">{patient.brand_tone}</p>
                    )}
                </div>
            </div>

            {statuses.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {statuses.map((s) => (
                        <StatusBadge key={s} status={s} variant="subtle" />
                    ))}
                </div>
            )}

            {patient.next_deadline && (
                <p className="text-xs text-[var(--color-text-secondary)] mt-2">
                    Próxima sesión: {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(new Date(patient.next_deadline))}
                </p>
            )}
        </Link>
    );
};

PatientCard.displayName = 'PatientCard';
