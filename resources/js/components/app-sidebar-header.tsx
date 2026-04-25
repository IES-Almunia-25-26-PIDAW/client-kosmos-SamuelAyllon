import { Flex, chakra } from '@chakra-ui/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

const HeaderRoot = chakra('header', {
    base: {
        display: 'flex',
        h: '16',
        flexShrink: 0,
        alignItems: 'center',
        gap: '2',
        borderBottomWidth: '1px',
        borderColor: 'sidebar.border/50',
        px: { base: '6', md: '4' },
        transitionProperty: 'width, height',
        transitionTimingFunction: 'linear',
        '[data-collapsible=icon] &': { h: '12' },
    },
});

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <HeaderRoot>
            <Flex alignItems="center" gap="2">
                <SidebarTrigger ml="-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </Flex>
        </HeaderRoot>
    );
}
