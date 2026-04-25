import { chakra } from '@chakra-ui/react';
import { useId } from 'react';

const ChakraSvg = chakra('svg');

type PlaceholderPatternProps = React.ComponentProps<typeof ChakraSvg>;

export function PlaceholderPattern(props: PlaceholderPatternProps) {
    const patternId = useId();

    return (
        <ChakraSvg fill="none" {...props}>
            <defs>
                <pattern id={patternId} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
                </pattern>
            </defs>
            <rect stroke="none" fill={`url(#${patternId})`} width="100%" height="100%"></rect>
        </ChakraSvg>
    );
}
