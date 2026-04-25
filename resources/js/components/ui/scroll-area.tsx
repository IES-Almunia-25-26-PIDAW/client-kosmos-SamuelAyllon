import { Box, type BoxProps } from '@chakra-ui/react';
import * as React from 'react';

function ScrollArea({ children, ...props }: BoxProps) {
    return (
        <Box
            data-slot="scroll-area"
            position="relative"
            overflow="auto"
            _focusVisible={{
                outline: '1px solid',
                outlineColor: 'brand.solid',
                boxShadow: '0 0 0 3px var(--ck-colors-brand-muted)',
            }}
            {...props}
        >
            {children}
        </Box>
    );
}

function ScrollBar(): React.ReactElement | null {
    return null;
}

export { ScrollArea, ScrollBar };
