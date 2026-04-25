import { Box, Circle, SimpleGrid, Text, chakra } from '@chakra-ui/react';
import type { LucideIcon } from 'lucide-react';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';

const TabButton = chakra('button', {
    base: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2',
        rounded: 'lg',
        borderWidth: '2px',
        borderStyle: 'solid',
        p: '4',
        transitionProperty: 'colors, background, border-color, box-shadow',
        transitionDuration: 'normal',
        transitionTimingFunction: 'standard',
        cursor: 'pointer',
        borderColor: 'transparent',
        bg: 'bg.muted',
        _hover: {
            borderColor: 'border.subtle',
            bg: 'bg.subtle',
        },
        _focusVisible: {
            outline: '2px solid',
            outlineColor: 'brand.focusRing',
            outlineOffset: '2px',
        },
        '&[data-selected="true"]': {
            borderColor: 'brand.solid',
            bg: 'brand.subtle',
            shadow: 'sm',
        },
    },
});

export default function AppearanceToggleTab({
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const tabs: {
        value: Appearance;
        icon: LucideIcon;
        label: string;
        description: string;
    }[] = [
        { value: 'light', icon: Sun, label: 'Claro', description: 'Tema luminoso' },
        { value: 'dark', icon: Moon, label: 'Oscuro', description: 'Tema oscuro' },
        { value: 'system', icon: Monitor, label: 'Sistema', description: 'Según tu dispositivo' },
    ];

    return (
        <SimpleGrid columns={3} gap="3" {...props}>
            {tabs.map(({ value, icon: Icon, label, description }) => {
                const selected = appearance === value;
                return (
                    <TabButton
                        key={value}
                        type="button"
                        onClick={() => updateAppearance(value)}
                        data-selected={selected}
                    >
                        <Circle
                            size="10"
                            bg={selected ? 'brand.solid' : 'bg.subtle'}
                            color={selected ? 'brand.contrast' : 'fg.muted'}
                            transition="colors 200ms"
                        >
                            <Icon size={20} />
                        </Circle>
                        <Box textAlign="center">
                            <Text
                                as="span"
                                display="block"
                                fontSize="sm"
                                fontWeight="medium"
                                color={selected ? 'brand.fg' : 'fg'}
                            >
                                {label}
                            </Text>
                            <Text
                                as="span"
                                display="block"
                                fontSize="xs"
                                color="fg.muted"
                            >
                                {description}
                            </Text>
                        </Box>
                    </TabButton>
                );
            })}
        </SimpleGrid>
    );
}
