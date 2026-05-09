import { Input as ChakraInput, type InputProps } from '@chakra-ui/react';
import * as React from 'react';
import { useFormFieldIds } from '@/components/form-field';

type Props = InputProps & {
    type?: React.HTMLInputTypeAttribute;
};

const Input = React.forwardRef<HTMLInputElement, Props>(function Input(
    {
        type,
        id,
        'aria-invalid': ariaInvalid,
        'aria-describedby': ariaDescribedby,
        'aria-required': ariaRequired,
        ...props
    },
    ref,
) {
    const fieldCtx = useFormFieldIds();

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
            id={id ?? fieldCtx?.inputId}
            aria-invalid={ariaInvalid ?? (fieldCtx?.hasError ? true : undefined)}
            aria-describedby={
                ariaDescribedby ??
                (fieldCtx?.hasError
                    ? fieldCtx.errorId
                    : fieldCtx?.hasDescription
                      ? fieldCtx.descId
                      : undefined)
            }
            aria-required={ariaRequired ?? (fieldCtx?.required ? true : undefined)}
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
