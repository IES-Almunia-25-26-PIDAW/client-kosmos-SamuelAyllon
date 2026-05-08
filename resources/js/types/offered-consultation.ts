export type ConsultationModality = 'in_person' | 'video_call' | 'both';

export interface OfferedConsultation {
    id: number;
    name: string;
    description: string | null;
    duration_minutes: number;
    price: string | null;
    color: string | null;
    is_active: boolean;
    modality: ConsultationModality;
    updated_at?: string | null;
    created_at?: string | null;
    appointments_count?: number;
}

export interface OfferedConsultationFormData {
    name: string;
    description: string;
    duration_minutes: number;
    price: string;
    color: string;
    is_active: boolean;
    modality: ConsultationModality;
}

export const MODALITY_LABELS: Record<ConsultationModality, string> = {
    in_person: 'Presencial',
    video_call: 'Online',
    both: 'Online y presencial',
};

export const DEFAULT_CONSULTATION: OfferedConsultationFormData = {
    name: '',
    description: '',
    duration_minutes: 50,
    price: '',
    color: '#6366f1',
    is_active: true,
    modality: 'both',
};
