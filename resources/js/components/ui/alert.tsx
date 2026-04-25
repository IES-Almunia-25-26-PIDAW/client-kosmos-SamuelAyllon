import { Alert as ChakraAlert } from '@chakra-ui/react';
import * as React from 'react';

type LegacyVariant = 'default' | 'destructive';

const STATUS_MAP: Record<LegacyVariant, 'info' | 'error'> = {
    default: 'info',
    destructive: 'error',
};

type AlertProps = Omit<
    React.ComponentProps<typeof ChakraAlert.Root>,
    'status' | 'variant'
> & {
    variant?: LegacyVariant;
};

function Alert({ variant = 'default', children, ...props }: AlertProps) {
    return (
        <ChakraAlert.Root
            data-slot="alert"
            status={STATUS_MAP[variant]}
            variant="subtle"
            rounded="lg"
            borderWidth="1px"
            alignItems="flex-start"
            {...props}
        >
            {children}
        </ChakraAlert.Root>
    );
}

function AlertTitle(
    props: React.ComponentProps<typeof ChakraAlert.Title>,
) {
    return (
        <ChakraAlert.Title
            data-slot="alert-title"
            fontWeight="medium"
            lineClamp={1}
            {...props}
        />
    );
}

function AlertDescription(
    props: React.ComponentProps<typeof ChakraAlert.Description>,
) {
    return (
        <ChakraAlert.Description
            data-slot="alert-description"
            color="fg.muted"
            fontSize="sm"
            {...props}
        />
    );
}

export { Alert, AlertTitle, AlertDescription };
