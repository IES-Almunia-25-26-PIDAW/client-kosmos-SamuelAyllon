import { Box, chakra, Flex, type BoxProps } from '@chakra-ui/react';
import * as React from 'react';

interface FormFieldContextValue {
    inputId: string;
    errorId: string;
    descId: string;
    hasError: boolean;
    hasDescription: boolean;
    required: boolean;
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

export function useFormFieldIds(): FormFieldContextValue | null {
    return React.useContext(FormFieldContext);
}

export interface FormFieldProps extends Omit<BoxProps, 'title'> {
    label?: React.ReactNode;
    /** Slot rendered to the right of the label (e.g. a "forgot password" link). */
    labelAddon?: React.ReactNode;
    required?: boolean;
    error?: string;
    description?: string;
    children: React.ReactNode;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
    ({ label, labelAddon, required = false, error, description, children, ...boxProps }, ref) => {
        const uid = React.useId();
        const inputId = `field-${uid}`;
        const errorId = `field-err-${uid}`;
        const descId = `field-desc-${uid}`;

        const ctx: FormFieldContextValue = {
            inputId,
            errorId,
            descId,
            hasError: !!error,
            hasDescription: !!description,
            required,
        };

        const labelEl = label && (
            <chakra.label
                htmlFor={inputId}
                display="block"
                fontSize="sm"
                fontWeight="semibold"
                color="fg"
            >
                {label}
                {required && (
                    <chakra.span color="danger.fg" ml="1" aria-hidden="true">
                        *
                    </chakra.span>
                )}
                {required && (
                    <chakra.span
                        position="absolute"
                        width="1px"
                        height="1px"
                        padding="0"
                        margin="-1px"
                        overflow="hidden"
                        whiteSpace="nowrap"
                        borderWidth="0"
                        style={{ clip: 'rect(0,0,0,0)' }}
                    >
                        {' '}obligatorio
                    </chakra.span>
                )}
            </chakra.label>
        );

        return (
            <FormFieldContext.Provider value={ctx}>
                <Box ref={ref} spaceY="2" {...boxProps}>
                    {labelEl && labelAddon ? (
                        <Flex alignItems="center" justifyContent="space-between">
                            {labelEl}
                            {labelAddon}
                        </Flex>
                    ) : (
                        labelEl
                    )}

                    <Box>{children}</Box>

                    {description && !error && (
                        <chakra.p id={descId} fontSize="xs" color="fg.muted">
                            {description}
                        </chakra.p>
                    )}

                    {error && (
                        <chakra.p id={errorId} fontSize="xs" color="danger.fg" role="alert">
                            {error}
                        </chakra.p>
                    )}
                </Box>
            </FormFieldContext.Provider>
        );
    },
);
FormField.displayName = 'FormField';

export { FormField };
