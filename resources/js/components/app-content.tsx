import { chakra, type HTMLChakraProps } from '@chakra-ui/react';
import { SidebarInset } from '@/components/ui/sidebar';

const MainContent = chakra('main', {
    base: {
        mx: 'auto',
        display: 'flex',
        h: 'full',
        w: 'full',
        maxW: '7xl',
        flex: '1',
        flexDirection: 'column',
        gap: '4',
        borderRadius: 'xl',
    },
});

type Props = HTMLChakraProps<'main'> & {
    variant?: 'header' | 'sidebar';
};

export function AppContent({ variant = 'header', children, ...props }: Props) {
    if (variant === 'sidebar') {
        return <SidebarInset {...props}>{children}</SidebarInset>;
    }

    return <MainContent {...props}>{children}</MainContent>;
}
