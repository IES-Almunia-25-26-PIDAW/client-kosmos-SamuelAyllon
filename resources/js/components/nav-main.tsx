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
                                    {item.icon && <item.icon />}
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
