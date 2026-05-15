import { Avatar, Badge, Box, Flex, Text, chakra } from '@chakra-ui/react';
import { Link, router } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
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

const MenuButton = chakra('button', {
    base: {
        display: 'flex',
        alignItems: 'center',
        gap: '2',
        w: 'full',
        cursor: 'pointer',
        textAlign: 'left',
        bg: 'transparent',
        border: 'none',
    },
});

const ROLE_LABEL_FALLBACK = 'Usuario';
const ROLE_PALETTE_FALLBACK = 'gray';

const ROLE_LABEL: Record<User['role'], string> = {
    professional: 'Profesional',
    patient: 'Paciente',
    admin: 'Admin',
};

const ROLE_PALETTE: Record<User['role'], string> = {
    professional: 'brand',
    patient: 'green',
    admin: 'red',
};

type Props = {
    user: User;
};

export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
        router.post(logout().url);
    };

    return (
        <>
            <DropdownMenuLabel p="0" fontWeight="normal">
                <Flex
                    alignItems="center"
                    gap="3"
                    px="3"
                    py="3"
                    borderRadius="sm"
                    mx="1"
                    mt="1"
                >
                    <Avatar.Root size="md" flexShrink={0} colorPalette="brand" variant="solid">
                        <Avatar.Image src={user.avatar_path ?? undefined} alt={user.name} />
                        <Avatar.Fallback name={user.name} />
                    </Avatar.Root>
                    <Box flex="1" minW="0">
                        <Text fontWeight="semibold" fontSize="sm" truncate m="0">
                            {user.name}
                        </Text>
                        <Text fontSize="xs" color="fg.muted" truncate m="0">
                            {user.email}
                        </Text>
                        <Badge
                            size="xs"
                            colorPalette={ROLE_PALETTE[user.role] ?? ROLE_PALETTE_FALLBACK}
                            variant="solid"
                            mt="1.5"
                        >
                            {ROLE_LABEL[user.role] ?? ROLE_LABEL_FALLBACK}
                        </Badge>
                    </Box>
                </Flex>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <MenuLink href={edit()} prefetch onClick={cleanup}>
                        <Settings size={16} />
                        Configuración
                    </MenuLink>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuItem variant="destructive" asChild>
                <MenuButton
                    type="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut size={16} />
                    Cerrar sesión
                </MenuButton>
            </DropdownMenuItem>
        </>
    );
}
