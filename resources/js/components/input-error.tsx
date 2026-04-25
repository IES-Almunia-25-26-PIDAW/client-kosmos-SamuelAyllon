import { Text } from '@chakra-ui/react';
import type { ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Text>, 'children'> & {
    message?: string;
};

export default function InputError({ message, ...props }: Props) {
    if (!message) {
        return null;
    }

    return (
        <Text fontSize="sm" color="danger.fg" {...props}>
            {message}
        </Text>
    );
}
