import {
    Button as ChakraButton,
    type ButtonProps as ChakraButtonProps,
} from '@chakra-ui/react';

type LegacyVariant =
    | 'default'
    | 'primary'
    | 'destructive'
    | 'outline'
    | 'outline-destructive'
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
    'outline-destructive': { variant: 'outline', colorPalette: 'red' },
    secondary: { variant: 'subtle', colorPalette: 'gray' },
    ghost: { variant: 'ghost', colorPalette: 'gray' },
    link: { variant: 'plain', colorPalette: 'brand' },
};

type SizeMapEntry = {
    size: ChakraButtonProps['size'];
    extraProps?: Partial<ChakraButtonProps>;
};

const SIZE_MAP: Record<LegacySize, SizeMapEntry> = {
    default: { size: 'sm' },
    sm: { size: 'xs' },
    md: { size: 'sm' },
    lg: { size: 'md' },
    icon: { size: 'sm', extraProps: { aspectRatio: '1', p: '0' } },
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
            {...mappedSize.extraProps}
            {...props}
        >
            {children}
        </ChakraButton>
    );
}

export { Button };
