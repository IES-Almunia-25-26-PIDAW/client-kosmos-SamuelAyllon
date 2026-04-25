import { Box, Flex, chakra } from '@chakra-ui/react';
import { Link, usePage } from '@inertiajs/react';
import { Shield, Users, ChevronsUpDown } from 'lucide-react';
import React from 'react';
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
    [key: string]: unknown;
}

const UserTrigger = chakra('button', {
    base: {
        display: 'flex',
        alignItems: 'center',
        gap: '2',
        borderRadius: 'md',
        px: '2',
        py: '1.5',
        fontSize: 'sm',
        outline: 'none',
        transitionProperty: 'background-color',
        transitionDuration: 'var(--duration-normal)',
        _hover: { bg: 'bg.subtle' },
    },
});

const AdminNavLink = chakra(Link, {
    base: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5',
        px: '3',
        py: '1.5',
        fontSize: 'sm',
        fontWeight: 'medium',
        borderRadius: 'sm',
        color: 'fg.muted',
        transitionProperty: 'colors',
        transitionDuration: 'var(--duration-normal)',
        _hover: { color: 'fg', bg: 'bg.subtle' },
    },
});

function AdminNavUser({ user }: { user: User }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <UserTrigger>
                    <UserInfo user={user} />
                    <ChevronsUpDown style={{ marginLeft: '0.25rem', width: '1rem', height: '1rem', opacity: 0.7 }} />
                </UserTrigger>
            </DropdownMenuTrigger>
            <DropdownMenuContent minW="56" borderRadius="lg" align="end">
                <UserMenuContent user={user} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

const adminNavItems = [
    { href: '/admin', label: 'Usuarios', icon: Users },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { isImpersonating, auth } = usePage<SharedProps>().props;

    return (
        <Flex minH="100vh" bg="bg" direction="column">
            {isImpersonating && <ImpersonationBanner />}

            <Box
                as="header"
                position="sticky"
                top="0"
                zIndex="sticky"
                borderBottomWidth="1px"
                borderColor="border"
                bg="bg.panel"
                shadow="sm"
            >
                <Flex h="14" alignItems="center" justifyContent="space-between" px={{ base: '4', lg: '6' }}>
                    <Flex alignItems="center" gap="2">
                        <Shield size={18} style={{ color: 'var(--ck-colors-brand-solid)' }} />
                        <Box as="span" fontWeight="semibold" color="fg">Admin</Box>
                    </Flex>

                    <Flex as="nav" display={{ base: 'none', md: 'flex' }} alignItems="center" gap="1">
                        {adminNavItems.map((item) => (
                            <AdminNavLink key={item.href} href={item.href}>
                                <item.icon size={16} />
                                {item.label}
                            </AdminNavLink>
                        ))}
                    </Flex>

                    <AdminNavUser user={auth.user} />
                </Flex>
            </Box>

            <Box as="main" flex="1">
                {children}
            </Box>
        </Flex>
    );
}
