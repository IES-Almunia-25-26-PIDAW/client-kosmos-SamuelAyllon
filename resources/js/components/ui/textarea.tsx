import { Textarea as ChakraTextarea, type TextareaProps } from '@chakra-ui/react';
import * as React from 'react';
import { useFormFieldIds } from '@/components/form-field';

type Props = TextareaProps & {
    id?: string;
    'aria-invalid'?: React.AriaAttributes['aria-invalid'];
    'aria-describedby'?: string;
    'aria-required'?: React.AriaAttributes['aria-required'];
};

function Textarea({
    id,
    'aria-invalid': ariaInvalid,
    'aria-describedby': ariaDescribedby,
    'aria-required': ariaRequired,
    ...props
}: Props) {
    const fieldCtx = useFormFieldIds();

    return (
        <ChakraTextarea
            data-slot="textarea"
            size="sm"
            variant="outline"
            bg="transparent"
            borderColor="border"
            color="fg"
            minH="16"
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
}

export { Textarea };
