import type { RecentPayment } from '../models/payment';
import type { PaginatedData } from '../shared/pagination';

export interface PaymentSummary {
    total_completed: number;
    total_pending: number;
    total_failed: number;
}

export interface AdminPaymentsProps {
    payments: PaginatedData<RecentPayment>;
    summary: PaymentSummary;
}
