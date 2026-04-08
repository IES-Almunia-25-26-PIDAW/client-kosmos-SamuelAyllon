import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Shield, Users, ChevronsUpDown } from 'lucide-react';
import { ImpersonationBanner } from '@/components/admin/impersonation-banner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import type { User } from '@/types';

interface AdminLayoutProps {
    children: React.ReactNode;
}

interface SharedProps {
    auth: { user: User };
    isImpersonating: boolean;
}

function AdminNavUser({ user }: { user: User }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-[var(--radius-md)] px-2 py-1.5 text-sm hover:bg-[var(--color-surface-alt)] transition-colors outline-none">
                    <UserInfo user={user} />
                    <ChevronsUpDown className="ml-1 size-4 text-[var(--color-text-secondary)]" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-56 rounded-lg" align="end" side="bottom">
                <UserMenuContent user={user} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

const adminNavItems = [
    { href: '/admin/users', label: 'Usuarios', icon: Users },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { isImpersonating, auth } = usePage<SharedProps>().props;

    return (
        <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
            {isImpersonating && <ImpersonationBanner />}

            {/* Admin navbar */}
            <header className="sticky top-0 z-[var(--z-sticky)] border-b border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
                <div className="flex h-14 items-center justify-between px-4 lg:px-6">
                    <div className="flex items-center gap-2">
                        <Shield size={18} className="text-[var(--color-primary)]" />
                        <span className="font-semibold text-[var(--color-text)]">Admin</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-1">
                        {adminNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-[var(--radius-sm)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-alt)] transition-colors"
                            >
                                <item.icon size={16} />
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <AdminNavUser user={auth.user} />
                </div>
            </header>

            {/* Content */}
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
