import { chakra } from '@chakra-ui/react';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';

const StyledRoot = chakra(NavigationMenuPrimitive.Root, {
    base: {
        position: 'relative',
        display: 'flex',
        maxW: 'max-content',
        flex: '1',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const StyledList = chakra(NavigationMenuPrimitive.List, {
    base: {
        display: 'flex',
        flex: '1',
        listStyle: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1',
    },
});

const StyledItem = chakra(NavigationMenuPrimitive.Item, {
    base: { position: 'relative' },
});

const triggerBaseStyle = {
    display: 'inline-flex',
    height: '9',
    width: 'max-content',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'md',
    bg: 'transparent',
    color: 'fg',
    px: '4',
    py: '2',
    fontSize: 'sm',
    fontWeight: 'medium',
    outline: 'none',
    transitionProperty: 'color, background-color, box-shadow',
    _hover: { bg: 'bg.muted', color: 'fg' },
    _focus: { bg: 'bg.muted', color: 'fg' },
    _disabled: { pointerEvents: 'none', opacity: 0.5 },
    '&[data-state="open"]': { bg: 'bg.muted' },
    '&[data-active="true"]': { bg: 'bg.muted' },
    _focusVisible: {
        boxShadow: '0 0 0 3px var(--chakra-colors-brand-focusRing, rgba(99, 102, 241, 0.3))',
    },
} as const;

const StyledTrigger = chakra(NavigationMenuPrimitive.Trigger, {
    base: triggerBaseStyle,
});

const StyledContent = chakra(NavigationMenuPrimitive.Content, {
    base: {
        top: '0',
        left: '0',
        width: '100%',
        p: '2',
        pr: '2.5',
        md: { position: 'absolute', width: 'auto' },
    },
});

const StyledLink = chakra(NavigationMenuPrimitive.Link, {
    base: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1',
        borderRadius: 'sm',
        p: '2',
        fontSize: 'sm',
        color: 'fg',
        outline: 'none',
        transitionProperty: 'color, background-color, box-shadow',
        _hover: { bg: 'bg.muted', color: 'fg' },
        _focus: { bg: 'bg.muted', color: 'fg' },
        '&[data-active="true"]': { bg: 'bg.muted' },
        '& svg': { width: '4', height: '4', color: 'fg.muted' },
    },
});

const StyledIndicator = chakra(NavigationMenuPrimitive.Indicator, {
    base: {
        top: '100%',
        zIndex: 1,
        display: 'flex',
        height: '1.5',
        alignItems: 'flex-end',
        justifyContent: 'center',
        overflow: 'hidden',
    },
});

const StyledViewport = chakra(NavigationMenuPrimitive.Viewport, {
    base: {
        position: 'relative',
        mt: '1.5',
        height: 'var(--radix-navigation-menu-viewport-height)',
        width: '100%',
        overflow: 'hidden',
        borderRadius: 'md',
        borderWidth: '1px',
        borderColor: 'border.subtle',
        bg: 'bg.surface',
        color: 'fg',
        shadow: 'md',
        md: { width: 'var(--radix-navigation-menu-viewport-width)' },
    },
});

function NavigationMenu({
    children,
    viewport = true,
    ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
    viewport?: boolean;
}) {
    return (
        <StyledRoot
            data-slot="navigation-menu"
            data-viewport={viewport}
            {...props}
        >
            {children}
            {viewport && <NavigationMenuViewport />}
        </StyledRoot>
    );
}

function NavigationMenuList(
    props: React.ComponentProps<typeof NavigationMenuPrimitive.List>,
) {
    return <StyledList data-slot="navigation-menu-list" {...props} />;
}

function NavigationMenuItem(
    props: React.ComponentProps<typeof NavigationMenuPrimitive.Item>,
) {
    return <StyledItem data-slot="navigation-menu-item" {...props} />;
}

const navigationMenuTriggerStyle = () => triggerBaseStyle;

function NavigationMenuTrigger({
    children,
    ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
    return (
        <StyledTrigger data-slot="navigation-menu-trigger" {...props}>
            {children}{' '}
            <ChevronDownIcon
                aria-hidden="true"
                style={{
                    position: 'relative',
                    top: '1px',
                    marginLeft: '0.25rem',
                    width: '0.75rem',
                    height: '0.75rem',
                    transition: 'transform 300ms',
                }}
            />
        </StyledTrigger>
    );
}

function NavigationMenuContent(
    props: React.ComponentProps<typeof NavigationMenuPrimitive.Content>,
) {
    return <StyledContent data-slot="navigation-menu-content" {...props} />;
}

function NavigationMenuViewport(
    props: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>,
) {
    return (
        <div
            style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                isolation: 'isolate',
                zIndex: 50,
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <StyledViewport
                data-slot="navigation-menu-viewport"
                {...props}
            />
        </div>
    );
}

function NavigationMenuLink(
    props: React.ComponentProps<typeof NavigationMenuPrimitive.Link>,
) {
    return <StyledLink data-slot="navigation-menu-link" {...props} />;
}

function NavigationMenuIndicator(
    props: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>,
) {
    return (
        <StyledIndicator data-slot="navigation-menu-indicator" {...props}>
            <div
                style={{
                    position: 'relative',
                    top: '60%',
                    height: '0.5rem',
                    width: '0.5rem',
                    transform: 'rotate(45deg)',
                    borderTopLeftRadius: '0.125rem',
                    background: 'var(--chakra-colors-border, currentColor)',
                    boxShadow: 'var(--chakra-shadows-md)',
                }}
            />
        </StyledIndicator>
    );
}

export {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle,
};
