import {
    Badge as ChakraBadge,
    type BadgeProps as ChakraBadgeProps,
} from '@chakra-ui/react';

type LegacyVariant = 'default' | 'secondary' | 'destructive' | 'outline';

const VARIANT_MAP: Record<
    LegacyVariant,
    Pick<ChakraBadgeProps, 'variant' | 'colorPalette'>
> = {
    default: { variant: 'solid', colorPalette: 'brand' },
    secondary: { variant: 'subtle', colorPalette: 'gray' },
    destructive: { variant: 'solid', colorPalette: 'danger' },
    outline: { variant: 'outline', colorPalette: 'gray' },
};

type BadgeProps = Omit<ChakraBadgeProps, 'variant' | 'colorPalette'> & {
    variant?: LegacyVariant;
};

function Badge({ variant = 'default', ...props }: BadgeProps) {
    const mapped = VARIANT_MAP[variant];
    return (
        <ChakraBadge
            data-slot="badge"
            rounded="md"
            px="2"
            py="0.5"
            fontSize="xs"
            fontWeight="medium"
            {...mapped}
            {...props}
        />
    );
}

export { Badge };
