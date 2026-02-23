export interface Subscription {
    plan: 'free' | 'premium_monthly' | 'premium_yearly' | null;
    expires_at: string | null;
}