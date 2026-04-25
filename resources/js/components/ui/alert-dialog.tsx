import {
    Box,
    Dialog as ChakraDialog,
    Flex,
    Portal,
} from '@chakra-ui/react';
import * as React from 'react';

import { Button } from '@/components/ui/button';

type AlertDialogSize = 'default' | 'sm';

type AlertDialogRootProps = Omit<
    React.ComponentProps<typeof ChakraDialog.Root>,
    'onOpenChange' | 'role'
> & {
    onOpenChange?: (open: boolean) => void;
};

function AlertDialog({ onOpenChange, ...props }: AlertDialogRootProps) {
    return (
        <ChakraDialog.Root
            role="alertdialog"
            data-slot="alert-dialog"
            onOpenChange={
                onOpenChange
                    ? (details) => onOpenChange(details.open)
                    : undefined
            }
            {...props}
        />
    );
}

function AlertDialogTrigger(
    props: React.ComponentProps<typeof ChakraDialog.Trigger>,
) {
    return (
        <ChakraDialog.Trigger data-slot="alert-dialog-trigger" {...props} />
    );
}

function AlertDialogPortal(props: React.ComponentProps<typeof Portal>) {
    return <Portal {...props} />;
}

function AlertDialogOverlay(
    props: React.ComponentProps<typeof ChakraDialog.Backdrop>,
) {
    return (
        <ChakraDialog.Backdrop
            data-slot="alert-dialog-overlay"
            bg="blackAlpha.700"
            zIndex="overlay"
            {...props}
        />
    );
}

type AlertDialogContentProps = React.ComponentProps<
    typeof ChakraDialog.Content
> & {
    size?: AlertDialogSize;
};

function AlertDialogContent({
    children,
    size = 'default',
    ...props
}: AlertDialogContentProps) {
    return (
        <Portal>
            <ChakraDialog.Backdrop
                bg="blackAlpha.700"
                zIndex="overlay"
            />
            <ChakraDialog.Positioner zIndex="modal">
                <ChakraDialog.Content
                    data-slot="alert-dialog-content"
                    data-size={size}
                    bg="bg.surface"
                    color="fg"
                    borderWidth="1px"
                    borderColor="border.subtle"
                    borderRadius="lg"
                    shadow="lg"
                    p="6"
                    gap="4"
                    display="grid"
                    width="calc(100% - 2rem)"
                    maxWidth={
                        size === 'sm'
                            ? 'xs'
                            : { base: 'calc(100% - 2rem)', sm: 'lg' }
                    }
                    {...props}
                >
                    {children}
                </ChakraDialog.Content>
            </ChakraDialog.Positioner>
        </Portal>
    );
}

function AlertDialogHeader(props: React.ComponentProps<typeof Box>) {
    return (
        <Box
            data-slot="alert-dialog-header"
            display="grid"
            gridTemplateRows="auto 1fr"
            placeItems={{ base: 'center', sm: 'start' }}
            gap="1.5"
            textAlign={{ base: 'center', sm: 'left' }}
            {...props}
        />
    );
}

function AlertDialogFooter(props: React.ComponentProps<typeof Flex>) {
    return (
        <Flex
            data-slot="alert-dialog-footer"
            flexDirection={{ base: 'column-reverse', sm: 'row' }}
            justifyContent={{ sm: 'flex-end' }}
            gap="2"
            {...props}
        />
    );
}

function AlertDialogTitle(
    props: React.ComponentProps<typeof ChakraDialog.Title>,
) {
    return (
        <ChakraDialog.Title
            data-slot="alert-dialog-title"
            fontSize="lg"
            fontWeight="semibold"
            color="fg"
            {...props}
        />
    );
}

function AlertDialogDescription(
    props: React.ComponentProps<typeof ChakraDialog.Description>,
) {
    return (
        <ChakraDialog.Description
            data-slot="alert-dialog-description"
            fontSize="sm"
            color="fg.muted"
            {...props}
        />
    );
}

function AlertDialogMedia(props: React.ComponentProps<typeof Box>) {
    return (
        <Box
            data-slot="alert-dialog-media"
            display="inline-flex"
            boxSize="16"
            alignItems="center"
            justifyContent="center"
            borderRadius="md"
            bg="bg.muted"
            mb="2"
            css={{
                "& svg:not([class*='size-'])": {
                    width: '2rem',
                    height: '2rem',
                },
            }}
            {...props}
        />
    );
}

type AlertDialogActionProps = Omit<React.ComponentProps<typeof Button>, 'asChild'>;

function AlertDialogAction({
    variant = 'default',
    size = 'default',
    ...props
}: AlertDialogActionProps) {
    return (
        <ChakraDialog.ActionTrigger asChild>
            <Button data-slot="alert-dialog-action" variant={variant} size={size} {...props} />
        </ChakraDialog.ActionTrigger>
    );
}

type AlertDialogCancelProps = Omit<React.ComponentProps<typeof Button>, 'asChild'>;

function AlertDialogCancel({
    variant = 'outline',
    size = 'default',
    ...props
}: AlertDialogCancelProps) {
    return (
        <ChakraDialog.CloseTrigger asChild>
            <Button data-slot="alert-dialog-cancel" variant={variant} size={size} {...props} />
        </ChakraDialog.CloseTrigger>
    );
}

export {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogOverlay,
    AlertDialogPortal,
    AlertDialogTitle,
    AlertDialogTrigger,
};
