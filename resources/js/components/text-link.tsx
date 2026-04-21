import { chakra } from '@chakra-ui/react';
import { Link } from '@inertiajs/react';
import type { ComponentProps } from 'react';

const StyledLink = chakra(Link, {
    base: {
        color: 'fg',
        textDecoration: 'underline',
        textDecorationColor: 'border.subtle',
        textUnderlineOffset: '4px',
        transitionProperty: 'colors',
        transitionDuration: 'normal',
        transitionTimingFunction: 'standard',
        _hover: {
            textDecorationColor: 'currentColor',
        },
        _dark: {
            textDecorationColor: 'border',
        },
    },
});

type Props = ComponentProps<typeof Link>;

export default function TextLink(props: Props) {
    return <StyledLink {...props} />;
}
