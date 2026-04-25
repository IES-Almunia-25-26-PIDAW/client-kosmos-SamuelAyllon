import { Input as ChakraInput, type InputProps } from '@chakra-ui/react';
import * as React from 'react';

type Props = InputProps & {
    type?: React.HTMLInputTypeAttribute;
};

const Input = React.forwardRef<HTMLInputElement, Props>(function Input({ type, ...props }, ref) {
    return (
        <ChakraInput
            ref={ref}
            type={type}
            data-slot="input"
            size="sm"
            variant="outline"
            bg="transparent"
            borderColor="border"
            color="fg"
            _placeholder={{ color: 'fg.subtle' }}
            _focusVisible={{
                borderColor: 'brand.solid',
                boxShadow: '0 0 0 3px var(--ck-colors-brand-muted)',
            }}
            _invalid={{
                borderColor: 'danger.solid',
                boxShadow: '0 0 0 3px var(--ck-colors-danger-muted)',
            }}
            _disabled={{ cursor: 'not-allowed', opacity: 0.5 }}
            {...props}
        />
    );
});

export { Input };
