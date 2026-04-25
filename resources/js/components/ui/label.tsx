import { Text, type TextProps } from '@chakra-ui/react';
import * as React from 'react';

type LabelProps = Omit<TextProps, 'as'> &
    React.LabelHTMLAttributes<HTMLLabelElement>;

function Label(props: LabelProps) {
    return (
        <Text
            as="label"
            data-slot="label"
            fontSize="sm"
            fontWeight="medium"
            lineHeight="none"
            userSelect="none"
            _disabled={{ cursor: 'not-allowed', opacity: 0.5 }}
            {...(props as TextProps)}
        />
    );
}

export { Label };
