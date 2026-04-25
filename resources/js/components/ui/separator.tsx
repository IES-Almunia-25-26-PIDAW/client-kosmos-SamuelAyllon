import {
    Separator as ChakraSeparator,
    type SeparatorProps,
} from '@chakra-ui/react';

type Props = Omit<SeparatorProps, 'orientation'> & {
    orientation?: 'horizontal' | 'vertical';
    decorative?: boolean;
};

function Separator({
    orientation = 'horizontal',
    decorative = true,
    ...props
}: Props) {
    return (
        <ChakraSeparator
            data-slot="separator-root"
            orientation={orientation}
            aria-hidden={decorative ? true : undefined}
            role={decorative ? 'none' : 'separator'}
            borderColor="border"
            {...props}
        />
    );
}

export { Separator };
