import { Box, Flex, Heading, Stack, Text, chakra } from '@chakra-ui/react';
import { Link } from '@inertiajs/react';
import { Lock, Palette, Settings, Shield, User } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { show } from '@/routes/two-factor';
import { edit as editPassword } from '@/routes/user-password';
import type { NavItem } from '@/types';

const ChakraLink = chakra(Link);

const sidebarNavItems: NavItem[] = [
    { title: 'Perfil', href: edit(), icon: User },
    { title: 'Contraseña', href: editPassword(), icon: Lock },
    { title: 'Autenticación 2FA', href: show(), icon: Shield },
    { title: 'Apariencia', href: editAppearance(), icon: Palette },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentUrl } = useCurrentUrl();

    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <Box px={{ base: '4', md: '6' }} py="6">
            <Flex mb="8" alignItems="center" gap="3">
                <Flex h="12" w="12" alignItems="center" justifyContent="center" borderRadius="xl" bg="brand.subtle">
                    <Box as={Settings} h="6" w="6" color="brand.solid" />
                </Flex>
                <Box>
                    <Heading as="h1" fontSize="2xl" fontWeight="bold" letterSpacing="tight">
                        Ajustes
                    </Heading>
                    <Text fontSize="sm" color="fg.muted">
                        Gestiona tu perfil y configuración de cuenta
                    </Text>
                </Box>
            </Flex>

            <Flex direction={{ base: 'column', lg: 'row' }} gap={{ lg: '8' }}>
                <Box as="aside" w={{ base: 'full', lg: '56' }} flexShrink={0}>
                    <Flex
                        as="nav"
                        direction={{ base: 'row', lg: 'column' }}
                        gap="1"
                        overflowX={{ base: 'auto', lg: 'visible' }}
                        pb={{ base: '2', lg: '0' }}
                        aria-label="Ajustes"
                    >
                        {sidebarNavItems.map((item, index) => {
                            const active = isCurrentUrl(item.href);
                            return (
                                <Button
                                    key={`${toUrl(item.href)}-${index}`}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    w="full"
                                    justifyContent="flex-start"
                                    gap="2"
                                    whiteSpace="nowrap"
                                    bg={active ? 'brand.subtle' : undefined}
                                    color={active ? 'brand.solid' : undefined}
                                    _hover={active ? { bg: 'brand.subtle', color: 'brand.solid' } : undefined}
                                >
                                    <ChakraLink href={item.href} display="flex" alignItems="center" gap="2">
                                        {item.icon && <Box as={item.icon} h="4" w="4" />}
                                        {item.title}
                                    </ChakraLink>
                                </Button>
                            );
                        })}
                    </Flex>
                </Box>

                <Box display={{ lg: 'none' }}>
                    <Separator />
                </Box>

                <Box flex="1" minW={0}>
                    <Stack as="section" maxW="2xl" gap="8">
                        {children}
                    </Stack>
                </Box>
            </Flex>
        </Box>
    );
}
