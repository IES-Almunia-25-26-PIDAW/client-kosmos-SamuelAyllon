import { Box, Text, type BoxProps } from '@chakra-ui/react';
import * as React from 'react';

export interface FormFieldProps extends Omit<BoxProps, 'title'> {
    label?: string;
    required?: boolean;
    error?: string;
    description?: string;
    children: React.ReactNode;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
    ({ label, required, error, description, children, ...boxProps }, ref) => (
        <Box ref={ref} spaceY="2" {...boxProps}>
            {label && (
                <Text as="label" display="block" fontSize="sm" fontWeight="medium" color="fg">
                    {label}
                    {required && (
                        <Text as="span" color="danger.fg" ml="1">
                            *
                        </Text>
                    )}
                </Text>
            )}

            <Box>{children}</Box>

            {description && !error && (
                <Text fontSize="xs" color="fg.muted">
                    {description}
                </Text>
            )}

            {error && (
                <Text fontSize="xs" color="danger.fg">
                    {error}
                </Text>
            )}
        </Box>
    ),
);
FormField.displayName = 'FormField';

export { FormField };
