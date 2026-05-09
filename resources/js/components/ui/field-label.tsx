import { chakra, type HTMLChakraProps } from '@chakra-ui/react';

type Props = HTMLChakraProps<'span'>;

function FieldLabel({ children, ...props }: Props) {
    return (
        <chakra.span
            fontSize="11px"
            fontWeight="semibold"
            letterSpacing="widest"
            textTransform="uppercase"
            color="fg.muted"
            {...props}
        >
            {children}
        </chakra.span>
    );
}

export { FieldLabel };
