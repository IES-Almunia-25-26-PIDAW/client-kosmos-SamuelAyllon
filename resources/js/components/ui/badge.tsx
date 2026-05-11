import {
    Badge as ChakraBadge,
    type BadgeProps as ChakraBadgeProps,
} from '@chakra-ui/react';

type LegacyVariant = 'default' | 'secondary' | 'destructive' | 'outline';

const LEGACY_MAP: Record<LegacyVariant, Pick<ChakraBadgeProps, 'variant' | 'colorPalette'>> = {
    default:     { variant: 'solid',   colorPalette: 'brand'  },
    secondary:   { variant: 'subtle',  colorPalette: 'gray'   },
    destructive: { variant: 'solid',   colorPalette: 'danger' },
    outline:     { variant: 'outline', colorPalette: 'gray'   },
};

const LEGACY_VARIANTS = new Set<string>(Object.keys(LEGACY_MAP));

type BadgeProps = Omit<ChakraBadgeProps, 'variant' | 'colorPalette'> & {
    variant?: LegacyVariant | ChakraBadgeProps['variant'];
};

function Badge({ variant = 'default', ...props }: BadgeProps) {
    const mapped = LEGACY_VARIANTS.has(variant as string)
        ? LEGACY_MAP[variant as LegacyVariant]
        : { variant: variant as ChakraBadgeProps['variant'] };
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
