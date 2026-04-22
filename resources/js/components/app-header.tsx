import { Box, Flex, chakra } from '@chakra-ui/react';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Menu, Search } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { toUrl } from '@/lib/utils';
import { dashboard } from '@/routes/professional';
import type { BreadcrumbItem, NavItem } from '@/types';
import AppLogo from './app-logo';
import logo from '@/assets/logo.png';

const ChakraLink = chakra(Link);

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const rightNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppHeader({ breadcrumbs = [] }: Props) {
    const page = usePage();
    const { auth } = page.props;
    const getInitials = useInitials();
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <>
            <Box borderBottomWidth="1px" borderColor="sidebar.border">
                <Flex mx="auto" h="16" alignItems="center" px="4" maxW={{ md: '7xl' }}>

                    {/* Mobile menu */}
                    <Box display={{ base: 'block', lg: 'none' }}>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" mr="2" h="34px" w="34px">
                                    <Menu size={20} />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" bg="sidebar.DEFAULT" color="sidebar.fg">
                                <SheetTitle srOnly>Navigation Menu</SheetTitle>
                                <SheetHeader display="flex" justifyContent="center" alignItems="center">
                                    <img
                                        src={logo}
                                        alt="ClientKosmos"
                                        style={{ height: '1.5rem', width: 'auto', objectFit: 'contain' }}
                                    />
                                </SheetHeader>
                                <Flex direction="column" flex="1" gap="4" p="4" h="full">
                                    <Flex direction="column" justify="space-between" h="full" fontSize="sm">
                                        <Flex direction="column" gap="4">
                                            {mainNavItems.map((item) => (
                                                <ChakraLink
                                                    key={item.title}
                                                    href={item.href}
                                                    display="flex"
                                                    alignItems="center"
                                                    gap="2"
                                                    fontWeight="medium"
                                                    color="sidebar.fg"
                                                >
                                                    {item.icon && <item.icon size={20} />}
                                                    <span>{item.title}</span>
                                                </ChakraLink>
                                            ))}
                                        </Flex>
                                        <Flex direction="column" gap="4">
                                            {rightNavItems.map((item) => (
                                                <chakra.a
                                                    key={item.title}
                                                    href={toUrl(item.href)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    display="flex"
                                                    alignItems="center"
                                                    gap="2"
                                                    fontWeight="medium"
                                                    color="sidebar.fg"
                                                >
                                                    {item.icon && <item.icon size={20} />}
                                                    <span>{item.title}</span>
                                                </chakra.a>
                                            ))}
                                        </Flex>
                                    </Flex>
                                </Flex>
                            </SheetContent>
                        </Sheet>
                    </Box>

                    {/* Logo */}
                    <ChakraLink href={dashboard()} prefetch display="flex" alignItems="center" gap="2">
                        <AppLogo />
                    </ChakraLink>

                    {/* Desktop navigation */}
                    <Box display={{ base: 'none', lg: 'flex' }} ml="6" h="full" alignItems="center" gap="6">
                        <NavigationMenu>
                            <NavigationMenuList>
                                {mainNavItems.map((item, index) => (
                                    <NavigationMenuItem key={index}>
                                        <Box position="relative" display="flex" h="16" alignItems="center">
                                            <ChakraLink
                                                href={item.href}
                                                display="inline-flex"
                                                h="9"
                                                alignItems="center"
                                                justifyContent="center"
                                                borderRadius="md"
                                                bg="transparent"
                                                color="fg.DEFAULT"
                                                px="3"
                                                py="2"
                                                fontSize="sm"
                                                fontWeight="medium"
                                                cursor="pointer"
                                                _hover={{ bg: 'transparent' }}
                                                _focusVisible={{
                                                    outline: 'none',
                                                    boxShadow: '0 0 0 3px var(--ck-colors-brand-focusRing)',
                                                }}
                                            >
                                                {item.icon && (
                                                    <item.icon size={16} style={{ marginRight: '0.5rem' }} />
                                                )}
                                                {item.title}
                                            </ChakraLink>
                                            {isCurrentUrl(item.href) && (
                                                <Box
                                                    position="absolute"
                                                    bottom={0}
                                                    left={0}
                                                    h="0.5"
                                                    w="full"
                                                    bg="fg.DEFAULT"
                                                    style={{ transform: 'translateY(1px)' }}
                                                />
                                            )}
                                        </Box>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </Box>

                    {/* Right actions */}
                    <Flex ml="auto" alignItems="center" gap="2">
                        <Flex position="relative" alignItems="center" gap="1">
                            <Button variant="ghost" size="icon" h="9" w="9" cursor="pointer">
                                <Search size={20} style={{ opacity: 0.8 }} />
                            </Button>
                            <Flex display={{ base: 'none', lg: 'flex' }} ml="1" gap="1">
                                {rightNavItems.map((item) => (
                                    <TooltipProvider key={item.title} delayDuration={0}>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <chakra.a
                                                    href={toUrl(item.href)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    display="inline-flex"
                                                    h="9"
                                                    w="9"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    borderRadius="md"
                                                    bg="transparent"
                                                    color="fg.DEFAULT"
                                                    fontSize="sm"
                                                    fontWeight="medium"
                                                    css={{ transition: 'background-color var(--duration-normal)' }}
                                                    _hover={{ bg: 'sidebar.accent', color: 'sidebar.accentFg' }}
                                                    _focusVisible={{
                                                        outline: '2px solid',
                                                        outlineColor: 'sidebar.ring',
                                                        outlineOffset: '2px',
                                                    }}
                                                >
                                                    <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', borderWidth: 0 }}>
                                                        {item.title}
                                                    </span>
                                                    {item.icon && <item.icon size={20} style={{ opacity: 0.8 }} />}
                                                </chakra.a>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{item.title}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ))}
                            </Flex>
                        </Flex>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" w="10" h="10" borderRadius="full" p="1">
                                    <Avatar w="8" h="8" overflow="hidden" borderRadius="full">
                                        <AvatarImage alt={auth.user.name} />
                                        <AvatarFallback bg="bg.muted" color="fg.DEFAULT">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent w="56" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </Flex>
                </Flex>
            </Box>

            {breadcrumbs.length > 1 && (
                <Flex w="full" borderBottomWidth="1px" borderColor="sidebar.border">
                    <Flex
                        mx="auto"
                        h="12"
                        w="full"
                        alignItems="center"
                        justifyContent="start"
                        px="4"
                        maxW={{ md: '7xl' }}
                        color="fg.subtle"
                    >
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </Flex>
                </Flex>
            )}
        </>
    );
}
