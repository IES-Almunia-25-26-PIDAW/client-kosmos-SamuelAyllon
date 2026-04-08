export type User = {
    id: number;
    name: string;
    email: string;
    role: 'professional' | 'admin';
    practice_name: string | null;
    specialty: string | null;
    city: string | null;
    avatar_path: string | null;
    default_rate: number | null;
    default_session_duration: number;
    nif: string | null;
    fiscal_address: string | null;
    invoice_prefix: string;
    invoice_counter: number;
    invoice_footer_text: string | null;
    rgpd_template: string | null;
    data_retention_months: number;
    privacy_policy_url: string | null;
    email_verified_at: string | null;
    tutorial_completed_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
