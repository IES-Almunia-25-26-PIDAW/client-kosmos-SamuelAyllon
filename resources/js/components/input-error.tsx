import { chakra } from '@chakra-ui/react';
import * as React from 'react';

type Props = {
    message?: string;
    id?: string;
    className?: string;
};

export default function InputError({ message, id, className }: Props) {
    const uid = React.useId();
    if (!message) {
        return null;
    }

    return (
        <chakra.p
            id={id ?? uid}
            role="alert"
            fontSize="sm"
            color="danger.fg"
            className={className}
        >
            {message}
        </chakra.p>
    );
}
