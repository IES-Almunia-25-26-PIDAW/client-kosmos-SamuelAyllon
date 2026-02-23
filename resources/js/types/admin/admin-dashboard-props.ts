import { AdminStats } from './admin-stats';
import { RecentPayment } from '../models/payment';
import { User } from '../models/user';

export interface AdminDashboardProps {
    stats: AdminStats;
    recentPayments: RecentPayment[];
    recentUsers: User[];
}
