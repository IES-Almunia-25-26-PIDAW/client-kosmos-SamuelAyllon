export type PatientStatus = 'paid' | 'pending' | 'overdue' | 'noConsent' | 'openDeal';

export type Patient = {
    id: number;
    user_id: number;
    project_name: string;
    brand_tone: string | null;
    service_scope: string | null;
    next_deadline: string | null;
    email: string | null;
    phone: string | null;
    avatar_path: string | null;
    is_active: boolean;
    payment_status: 'paid' | 'pending' | 'overdue';
    has_valid_consent: boolean;
    has_open_agreement: boolean;
    statuses: PatientStatus[];
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    sessions?: ConsultingSessionType[];
    notes?: Note[];
    agreements?: Agreement[];
    payments?: Payment[];
    documents?: Document[];
    consent_forms?: ConsentForm[];
};

export type ConsultingSessionType = {
    id: number;
    patient_id: number;
    user_id: number;
    scheduled_at: string;
    started_at: string | null;
    ended_at: string | null;
    duration_minutes: number | null;
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    ai_summary: string | null;
    ai_summary_generated: boolean;
    created_at: string;
    updated_at: string;
};

export type Note = {
    id: number;
    patient_id: number;
    user_id: number;
    consulting_session_id: number | null;
    content: string;
    type: 'quick_note' | 'session_note' | 'observation' | 'followup';
    is_ai_generated: boolean;
    created_at: string;
    updated_at: string;
};

export type Agreement = {
    id: number;
    patient_id: number;
    user_id: number;
    consulting_session_id: number | null;
    content: string;
    is_completed: boolean;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
};

export type Payment = {
    id: number;
    patient_id: number;
    user_id: number;
    consulting_session_id: number | null;
    amount: number;
    concept: string | null;
    payment_method: 'cash' | 'bizum' | 'transfer' | 'card' | null;
    status: 'pending' | 'paid' | 'overdue' | 'claimed';
    due_date: string;
    paid_at: string | null;
    invoice_number: string | null;
    invoice_sent_at: string | null;
    reminder_count: number;
    last_reminder_at: string | null;
    created_at: string;
    updated_at: string;
    patient?: Pick<Patient, 'id' | 'project_name'>;
};

export type Document = {
    id: number;
    patient_id: number;
    user_id: number;
    name: string;
    file_path: string;
    mime_type: string | null;
    file_size: number | null;
    category: 'rgpd_consent' | 'informed_consent' | 'report' | 'invoice' | 'other';
    is_rgpd: boolean;
    expires_at: string | null;
    created_at: string;
    updated_at: string;
};

export type ConsentForm = {
    id: number;
    patient_id: number;
    user_id: number;
    template_version: string;
    content_snapshot: string;
    status: 'pending' | 'signed' | 'expired' | 'revoked';
    signed_at: string | null;
    signature_data: string | null;
    signed_ip: string | null;
    expires_at: string | null;
    created_at: string;
    updated_at: string;
};

export type KosmoBriefing = {
    id: number;
    user_id: number;
    patient_id: number | null;
    consulting_session_id: number | null;
    type: 'daily' | 'pre_session' | 'post_session' | 'weekly' | 'nudge';
    content: Record<string, unknown>;
    is_read: boolean;
    for_date: string | null;
    created_at: string;
    updated_at: string;
};
