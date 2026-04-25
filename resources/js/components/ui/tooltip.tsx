import { Portal, Tooltip as ChakraTooltip } from '@chakra-ui/react';
import * as React from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TooltipProvider({ children, delayDuration: _ }: { children: React.ReactNode; delayDuration?: number }) {
    return <>{children}</>;
}

function Tooltip(
    props: React.ComponentProps<typeof ChakraTooltip.Root>,
) {
    return <ChakraTooltip.Root openDelay={0} {...props} />;
}

function TooltipTrigger(
    props: React.ComponentProps<typeof ChakraTooltip.Trigger>,
) {
    return <ChakraTooltip.Trigger data-slot="tooltip-trigger" {...props} />;
}

type ContentProps = React.ComponentProps<typeof ChakraTooltip.Content> & {
    sideOffset?: number;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TooltipContent({ children, sideOffset: _, side: __, align: ___, ...props }: ContentProps) {
    return (
        <Portal>
            <ChakraTooltip.Positioner>
                <ChakraTooltip.Content
                    data-slot="tooltip-content"
                    bg="brand.solid"
                    color="brand.contrast"
                    rounded="md"
                    px="3"
                    py="1.5"
                    fontSize="xs"
                    maxW="sm"
                    {...props}
                >
                    <ChakraTooltip.Arrow>
                        <ChakraTooltip.ArrowTip />
                    </ChakraTooltip.Arrow>
                    {children}
                </ChakraTooltip.Content>
            </ChakraTooltip.Positioner>
        </Portal>
    );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
