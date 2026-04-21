import { Box, Drawer, Portal } from '@chakra-ui/react';
import { XIcon } from 'lucide-react';
import * as React from 'react';

type SheetSide = 'top' | 'right' | 'bottom' | 'left';

const SIDE_TO_PLACEMENT = {
    top: 'top',
    right: 'end',
    bottom: 'bottom',
    left: 'start',
} as const;

type SheetRootProps = Omit<
    React.ComponentProps<typeof Drawer.Root>,
    'onOpenChange'
> & {
    onOpenChange?: (open: boolean) => void;
};

function Sheet({ onOpenChange, ...props }: SheetRootProps) {
    return (
        <Drawer.Root
            onOpenChange={
                onOpenChange
                    ? (details) => onOpenChange(details.open)
                    : undefined
            }
            {...props}
        />
    );
}

function SheetTrigger(props: React.ComponentProps<typeof Drawer.Trigger>) {
    return <Drawer.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(props: React.ComponentProps<typeof Drawer.CloseTrigger>) {
    return <Drawer.CloseTrigger data-slot="sheet-close" {...props} />;
}

function SheetPortal(props: React.ComponentProps<typeof Portal>) {
    return <Portal {...props} />;
}

function SheetOverlay(props: React.ComponentProps<typeof Drawer.Backdrop>) {
    return (
        <Drawer.Backdrop
            data-slot="sheet-overlay"
            bg="blackAlpha.800"
            zIndex="overlay"
            {...props}
        />
    );
}

type SheetContentProps = React.ComponentProps<typeof Drawer.Content> & {
    side?: SheetSide;
};

function SheetContent({
    children,
    side = 'right',
    style,
    ...props
}: SheetContentProps) {
    const placement = SIDE_TO_PLACEMENT[side];

    const sideStyles: React.CSSProperties =
        side === 'left' || side === 'right'
            ? {
                  height: '100%',
                  width: '75%',
                  maxWidth: '24rem',
              }
            : {
                  width: '100%',
                  height: 'auto',
              };

    return (
        <Portal>
            <Drawer.Backdrop
                bg="blackAlpha.800"
                zIndex="overlay"
            />
            <Drawer.Positioner zIndex="modal">
                <Drawer.Content
                    data-slot="sheet-content"
                    bg="bg.surface"
                    color="fg"
                    display="flex"
                    flexDirection="column"
                    gap="4"
                    shadow="lg"
                    style={{ ...sideStyles, ...style }}
                    data-placement={placement}
                    {...props}
                >
                    {children}
                    <Drawer.CloseTrigger
                        position="absolute"
                        top="4"
                        right="4"
                        borderRadius="sm"
                        opacity={0.7}
                        transition="opacity"
                        _hover={{ opacity: 1 }}
                        _focus={{
                            outline: 'none',
                            boxShadow: 'outline',
                        }}
                    >
                        <XIcon style={{ width: '1rem', height: '1rem' }} />
                        <Box as="span" srOnly>Close</Box>
                    </Drawer.CloseTrigger>
                </Drawer.Content>
            </Drawer.Positioner>
        </Portal>
    );
}

function SheetHeader(props: React.ComponentProps<typeof Drawer.Header>) {
    return (
        <Drawer.Header
            data-slot="sheet-header"
            display="flex"
            flexDirection="column"
            gap="1.5"
            p="4"
            {...props}
        />
    );
}

function SheetFooter(props: React.ComponentProps<typeof Drawer.Footer>) {
    return (
        <Drawer.Footer
            data-slot="sheet-footer"
            display="flex"
            flexDirection="column"
            gap="2"
            mt="auto"
            p="4"
            {...props}
        />
    );
}

function SheetTitle(props: React.ComponentProps<typeof Drawer.Title>) {
    return (
        <Drawer.Title
            data-slot="sheet-title"
            color="fg"
            fontWeight="semibold"
            {...props}
        />
    );
}

function SheetDescription(
    props: React.ComponentProps<typeof Drawer.Description>,
) {
    return (
        <Drawer.Description
            data-slot="sheet-description"
            color="fg.muted"
            fontSize="sm"
            {...props}
        />
    );
}

export {
    Sheet,
    SheetTrigger,
    SheetClose,
    SheetPortal,
    SheetOverlay,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
};
