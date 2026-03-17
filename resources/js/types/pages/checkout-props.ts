import type { Subscription } from '../models/subscription';

export interface CheckoutPlan {
    key: string;
    name: string;
    price: number;
    description: string;
}

export interface CheckoutProps {
    alreadyPremium: boolean;
    plans?: CheckoutPlan[];
    subscription?: Subscription;
}
