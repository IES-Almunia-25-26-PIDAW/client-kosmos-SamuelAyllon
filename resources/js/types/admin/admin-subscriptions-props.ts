import type { Subscription } from '../models/subscription';
import type { PaginatedData } from '../shared/pagination';

export interface SubscriptionWithUser extends Subscription {
    user: { id: number; name: string; email: string };
}

export interface SubscriptionSummary {
    free: number;
    premium_monthly: number;
    premium_yearly: number;
    expired: number;
    cancelled: number;
}

export interface AdminSubscriptionsProps {
    subscriptions: PaginatedData<SubscriptionWithUser>;
    summary: SubscriptionSummary;
}
