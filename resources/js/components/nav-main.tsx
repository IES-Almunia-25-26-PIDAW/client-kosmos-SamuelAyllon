import { Box } from '@chakra-ui/react';
import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

// Mapeo de href a identificador de tutorial
const getTutorialId = (href: NavItem['href']): string | undefined => {
    const hrefString = typeof href === 'string' ? href : href.url;
    const mapping: Record<string, string> = {
        '/dashboard': 'dashboard',
        '/clients': 'clients',
        '/tasks': 'tasks',
        '/ideas': 'ideas',
        '/subscription': 'subscription',
    };
    return mapping[hrefString];
};

export function NavMain({ items = [], label = 'Menú' }: { items: NavItem[]; label?: string }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup px="2" py="0">
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const tutorialId = getTutorialId(item.href);
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isCurrentUrl(item.href)}
                                tooltip={{ children: item.title }}
                            >
                                <Link
                                    href={item.href}
                                    prefetch
                                    {...(tutorialId && { 'data-tutorial': tutorialId })}
                                >
                                    {item.icon && item.highlight ? (
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            w="5"
                                            h="5"
                                            borderRadius="sm"
                                            bg="kosmo.muted"
                                            color="kosmo.fg"
                                            flexShrink={0}
                                            css={{ '[data-collapsible=icon] &': { width: '1.125rem', height: '1.125rem' } }}
                                        >
                                            <item.icon size={13} />
                                        </Box>
                                    ) : (
                                        item.icon && <item.icon />
                                    )}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
