import type { Subscription } from '../models/subscription';

export interface Plan {
    key: string;
    name: string;
    price: number;
    features: string[];
}

export interface SubscriptionProps {
    subscription: Subscription | null;
    plans: Plan[];
}
