import { Checkbox as ChakraCheckbox } from '@chakra-ui/react';
import * as React from 'react';

type RootProps = React.ComponentProps<typeof ChakraCheckbox.Root>;

function Checkbox({ children, ...props }: RootProps) {
    return (
        <ChakraCheckbox.Root
            data-slot="checkbox"
            size="sm"
            colorPalette="brand"
            {...props}
        >
            <ChakraCheckbox.HiddenInput />
            <ChakraCheckbox.Control
                data-slot="checkbox-control"
                borderColor="border.emphasized"
                borderWidth="2px"
                bg="bg"
                rounded="sm"
                transition="all 0.15s"
                _hover={{ borderColor: 'brand.solid' }}
                _checked={{
                    bg: 'brand.solid',
                    borderColor: 'brand.solid',
                    color: 'brand.contrast',
                }}
                _invalid={{ borderColor: 'danger.solid' }}
                _disabled={{ cursor: 'not-allowed', opacity: 0.5 }}
            >
                <ChakraCheckbox.Indicator />
            </ChakraCheckbox.Control>
            {children != null && (
                <ChakraCheckbox.Label data-slot="checkbox-label">
                    {children}
                </ChakraCheckbox.Label>
            )}
        </ChakraCheckbox.Root>
    );
}

export { Checkbox };
