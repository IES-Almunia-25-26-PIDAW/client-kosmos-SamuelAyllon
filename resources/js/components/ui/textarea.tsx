import {
    Textarea as ChakraTextarea,
    type TextareaProps,
} from '@chakra-ui/react';

function Textarea(props: TextareaProps) {
    return (
        <ChakraTextarea
            data-slot="textarea"
            size="sm"
            variant="outline"
            bg="transparent"
            borderColor="border"
            color="fg"
            minH="16"
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
