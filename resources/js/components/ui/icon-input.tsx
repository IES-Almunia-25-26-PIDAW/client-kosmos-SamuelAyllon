import { Box, type SystemStyleObject } from '@chakra-ui/react';
import type { InputProps } from '@chakra-ui/react';
import type { LucideIcon } from 'lucide-react';
import { Input } from './input';

type Props = InputProps & {
    icon: LucideIcon;
    iconLeft?: SystemStyleObject['left'];
    pl?: SystemStyleObject['paddingLeft'];
};

function IconInput({ icon: Icon, iconLeft = '3', pl = '10', ...inputProps }: Props) {
    return (
        <Box position="relative">
            <Box
                as={Icon}
                aria-hidden="true"
                position="absolute"
                left={iconLeft}
                top="50%"
                transform="translateY(-50%)"
                h="4"
                w="4"
                color="fg.muted"
                opacity={0.6}
                zIndex={1}
                pointerEvents="none"
            />
            <Input pl={pl} {...inputProps} />
        </Box>
    );
}

export { IconInput };
