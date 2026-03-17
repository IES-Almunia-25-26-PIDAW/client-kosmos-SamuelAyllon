import type { RecentPayment } from '../models/payment';
import type { User } from '../models/user';
import type { AdminStats } from './admin-stats';

export interface AdminDashboardProps {
    stats: AdminStats;
    recentPayments: RecentPayment[];
    recentUsers: User[];
}
