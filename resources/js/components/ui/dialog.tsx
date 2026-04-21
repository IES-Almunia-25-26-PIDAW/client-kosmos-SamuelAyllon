import { Box, Dialog as ChakraDialog, Flex, Portal } from '@chakra-ui/react';
import { XIcon } from 'lucide-react';
import * as React from 'react';

type DialogRootProps = Omit<
    React.ComponentProps<typeof ChakraDialog.Root>,
    'onOpenChange'
> & {
    onOpenChange?: (open: boolean) => void;
};

function Dialog({ onOpenChange, ...props }: DialogRootProps) {
    return (
        <ChakraDialog.Root
            data-slot="dialog"
            onOpenChange={
                onOpenChange
                    ? (details) => onOpenChange(details.open)
                    : undefined
            }
            {...props}
        />
    );
}

function DialogTrigger(
    props: React.ComponentProps<typeof ChakraDialog.Trigger>,
) {
    return <ChakraDialog.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal(props: React.ComponentProps<typeof Portal>) {
    return <Portal {...props} />;
}

function DialogClose(
    props: React.ComponentProps<typeof ChakraDialog.CloseTrigger>,
) {
    return (
        <ChakraDialog.CloseTrigger data-slot="dialog-close" {...props} />
    );
}

function DialogOverlay(
    props: React.ComponentProps<typeof ChakraDialog.Backdrop>,
) {
    return (
        <ChakraDialog.Backdrop
            data-slot="dialog-overlay"
            bg="blackAlpha.800"
            zIndex="overlay"
            {...props}
        />
    );
}

type DialogContentProps = React.ComponentProps<
    typeof ChakraDialog.Content
> & {
    showCloseButton?: boolean;
};

function DialogContent({
    children,
    showCloseButton = true,
    ...props
}: DialogContentProps) {
    return (
        <Portal>
            <ChakraDialog.Backdrop
                bg="blackAlpha.800"
                zIndex="overlay"
            />
            <ChakraDialog.Positioner zIndex="modal">
                <ChakraDialog.Content
                    data-slot="dialog-content"
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
                    maxWidth={{ base: 'calc(100% - 2rem)', sm: 'lg' }}
                    {...props}
                >
                    {children}
                    {showCloseButton && (
                        <ChakraDialog.CloseTrigger
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
                            <XIcon
                                style={{ width: '1rem', height: '1rem' }}
                            />
                            <Box as="span" srOnly>Close</Box>
                        </ChakraDialog.CloseTrigger>
                    )}
                </ChakraDialog.Content>
            </ChakraDialog.Positioner>
        </Portal>
    );
}

function DialogHeader(props: React.ComponentProps<typeof Box>) {
    return (
        <Box
            data-slot="dialog-header"
            display="flex"
            flexDirection="column"
            gap="2"
            textAlign={{ base: 'center', sm: 'left' }}
            {...props}
        />
    );
}

function DialogFooter(props: React.ComponentProps<typeof Flex>) {
    return (
        <Flex
            data-slot="dialog-footer"
            flexDirection={{ base: 'column-reverse', sm: 'row' }}
            justifyContent={{ sm: 'flex-end' }}
            gap="2"
            {...props}
        />
    );
}

function DialogTitle(
    props: React.ComponentProps<typeof ChakraDialog.Title>,
) {
    return (
        <ChakraDialog.Title
            data-slot="dialog-title"
            fontSize="lg"
            fontWeight="semibold"
            lineHeight="none"
            color="fg"
            {...props}
        />
    );
}

function DialogDescription(
    props: React.ComponentProps<typeof ChakraDialog.Description>,
) {
    return (
        <ChakraDialog.Description
            data-slot="dialog-description"
            color="fg.muted"
            fontSize="sm"
            {...props}
        />
    );
}

export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
};
