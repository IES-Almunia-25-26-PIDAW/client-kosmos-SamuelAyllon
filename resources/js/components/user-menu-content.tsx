import { Flex, chakra } from '@chakra-ui/react';
import { Link, router } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import type { User } from '@/types';

const MenuLink = chakra(Link, {
    base: {
        display: 'block',
        w: 'full',
        cursor: 'pointer',
    },
});

type Props = {
    user: User;
};

export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel p="0" fontWeight="normal">
                <Flex alignItems="center" gap="2" px="1" py="1.5" textAlign="left" fontSize="sm">
                    <UserInfo user={user} showEmail={true} />
                </Flex>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <MenuLink href={edit()} prefetch onClick={cleanup}>
                        <Settings style={{ marginRight: '0.5rem' }} />
                        Settings
                    </MenuLink>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <MenuLink
                    href={logout()}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut style={{ marginRight: '0.5rem' }} />
                    Log out
                </MenuLink>
            </DropdownMenuItem>
        </>
    );
}
