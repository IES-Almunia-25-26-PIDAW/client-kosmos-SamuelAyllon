import {
    Button as ChakraButton,
    type ButtonProps as ChakraButtonProps,
} from '@chakra-ui/react';
import * as React from 'react';
import { cn } from '@/lib/utils';

type LegacyVariant =
    | 'default'
    | 'primary'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';

type LegacySize = 'default' | 'sm' | 'md' | 'lg' | 'icon';

type ChakraStylingProps = Pick<ChakraButtonProps, 'variant' | 'colorPalette'>;

const VARIANT_MAP: Record<LegacyVariant, ChakraStylingProps> = {
    default: { variant: 'solid', colorPalette: 'brand' },
    primary: { variant: 'solid', colorPalette: 'brand' },
    destructive: { variant: 'solid', colorPalette: 'red' },
    outline: { variant: 'outline', colorPalette: 'gray' },
    secondary: { variant: 'subtle', colorPalette: 'gray' },
    ghost: { variant: 'ghost', colorPalette: 'gray' },
    link: { variant: 'plain', colorPalette: 'brand' },
};

const SIZE_MAP: Record<
    LegacySize,
    { size: ChakraButtonProps['size']; extraClassName?: string }
> = {
    default: { size: 'sm' },
    sm: { size: 'xs' },
    md: { size: 'sm' },
    lg: { size: 'md' },
    icon: { size: 'sm', extraClassName: 'aspect-square p-0' },
};

type ButtonProps = Omit<
    ChakraButtonProps,
    'variant' | 'size' | 'colorPalette'
> & {
    variant?: LegacyVariant;
    size?: LegacySize;
    asChild?: boolean;
    loading?: boolean;
};

function Button({
    variant = 'default',
    size = 'default',
    className,
    loading = false,
    asChild = false,
    children,
    disabled,
    ...props
}: ButtonProps) {
    const mappedVariant = VARIANT_MAP[variant];
    const mappedSize = SIZE_MAP[size];

    return (
        <ChakraButton
            data-slot="button"
            variant={mappedVariant.variant}
            colorPalette={mappedVariant.colorPalette}
            size={mappedSize.size}
            loading={loading}
            asChild={asChild}
            disabled={disabled || loading}
            className={cn(mappedSize.extraClassName, className)}
            {...props}
        >
            {children}
        </ChakraButton>
    );
}

export { Button };
