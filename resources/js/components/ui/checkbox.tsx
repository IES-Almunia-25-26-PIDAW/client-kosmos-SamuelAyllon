import { Checkbox as ChakraCheckbox } from '@chakra-ui/react';
import * as React from 'react';

type RootProps = React.ComponentProps<typeof ChakraCheckbox.Root>;

function Checkbox(props: RootProps) {
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
                borderColor="border"
                rounded="sm"
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
        </ChakraCheckbox.Root>
    );
}

export { Checkbox };
