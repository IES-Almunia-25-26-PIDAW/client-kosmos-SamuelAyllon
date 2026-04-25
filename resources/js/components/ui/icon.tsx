import { Icon as ChakraIcon, type IconProps as ChakraIconProps } from '@chakra-ui/react';
import type { LucideIcon } from 'lucide-react';

interface IconProps extends Omit<ChakraIconProps, 'as'> {
    iconNode?: LucideIcon | null;
}

export function Icon({ iconNode: IconComponent, ...props }: IconProps) {
    if (!IconComponent) {
        return null;
    }

    return <ChakraIcon as={IconComponent} {...props} />;
}
