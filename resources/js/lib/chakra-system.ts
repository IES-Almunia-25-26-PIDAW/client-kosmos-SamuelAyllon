import {
    createSystem,
    defaultConfig,
    defineConfig,
} from '@chakra-ui/react';

const semanticPalette = (base: string) => ({
    solid: { value: `var(--color-${base})` },
    contrast: { value: `var(--color-${base}-fg)` },
    fg: { value: `var(--color-${base}-fg)` },
    muted: { value: `var(--color-${base}-subtle)` },
    subtle: { value: `var(--color-${base}-subtle)` },
    emphasized: { value: `var(--color-${base})` },
    focusRing: { value: `var(--color-${base})` },
});

const config = defineConfig({
    preflight: false,
    cssVarsPrefix: 'ck',
    globalCss: {
        'html, body': {
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-sans)',
        },
    },
    theme: {
        tokens: {
            fonts: {
                body: { value: 'var(--font-sans)' },
                heading: { value: 'var(--font-heading)' },
                mono: { value: 'var(--font-mono)' },
            },
            radii: {
                sm: { value: 'var(--radius-sm)' },
                md: { value: 'var(--radius-md)' },
                lg: { value: 'var(--radius-lg)' },
                xl: { value: 'var(--radius-xl)' },
                full: { value: 'var(--radius-full)' },
            },
            shadows: {
                sm: { value: 'var(--shadow-sm)' },
                md: { value: 'var(--shadow-md)' },
                lg: { value: 'var(--shadow-lg)' },
            },
            zIndex: {
                base: { value: 0 },
                dropdown: { value: 100 },
                sticky: { value: 200 },
                overlay: { value: 300 },
                modal: { value: 400 },
                toast: { value: 500 },
            },
            durations: {
                fast: { value: '100ms' },
                normal: { value: '200ms' },
                slow: { value: '350ms' },
            },
            easings: {
                standard: { value: 'cubic-bezier(0.4, 0.0, 0.2, 1)' },
                enter: { value: 'cubic-bezier(0.0, 0.0, 0.2, 1)' },
                exit: { value: 'cubic-bezier(0.4, 0.0, 1, 1)' },
            },
        },
        semanticTokens: {
            colors: {
                brand: semanticPalette('primary'),
                success: semanticPalette('success'),
                danger: semanticPalette('error'),
                warning: semanticPalette('warning'),
                info: semanticPalette('info'),
                indigo: semanticPalette('indigo'),
                orange: semanticPalette('orange'),
                kosmo: {
                    solid: { value: 'var(--color-kosmo)' },
                    contrast: { value: 'var(--color-primary-fg)' },
                    fg: { value: 'var(--color-kosmo)' },
                    muted: { value: 'var(--color-kosmo-surface)' },
                    subtle: { value: 'var(--color-kosmo-surface)' },
                    emphasized: { value: 'var(--color-kosmo-border)' },
                    focusRing: { value: 'var(--color-kosmo)' },
                },

                bg: {
                    DEFAULT: { value: 'var(--color-bg)' },
                    surface: { value: 'var(--color-surface)' },
                    surfaceAlt: { value: 'var(--color-surface-alt)' },
                    muted: { value: 'var(--muted)' },
                    subtle: { value: 'var(--color-surface-alt)' },
                },
                fg: {
                    DEFAULT: { value: 'var(--color-text)' },
                    muted: { value: 'var(--color-text-secondary)' },
                    subtle: { value: 'var(--color-text-muted)' },
                },
                border: {
                    DEFAULT: { value: 'var(--color-border)' },
                    subtle: { value: 'var(--color-border-subtle)' },
                    strong: { value: 'var(--border-strong)' },
                },
                sidebar: {
                    DEFAULT: { value: 'var(--sidebar)' },
                    fg: { value: 'var(--sidebar-foreground)' },
                    primary: { value: 'var(--sidebar-primary)' },
                    primaryFg: { value: 'var(--sidebar-primary-foreground)' },
                    accent: { value: 'var(--sidebar-accent)' },
                    accentFg: { value: 'var(--sidebar-accent-foreground)' },
                    border: { value: 'var(--sidebar-border)' },
                    ring: { value: 'var(--sidebar-ring)' },
                },
                card: {
                    DEFAULT: { value: 'var(--card)' },
                    fg: { value: 'var(--card-foreground)' },
                },
                popover: {
                    DEFAULT: { value: 'var(--popover)' },
                    fg: { value: 'var(--popover-foreground)' },
                },
            },
        },
    },
});

export const system = createSystem(defaultConfig, config);
