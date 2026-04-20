import {
    createSystem,
    defaultConfig,
    defineConfig,
} from '@chakra-ui/react';

const config = defineConfig({
    preflight: false,
    cssVarsPrefix: 'ck',
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
        },
        semanticTokens: {
            colors: {
                brand: {
                    solid: { value: 'var(--color-primary)' },
                    contrast: { value: 'var(--color-primary-fg)' },
                    fg: { value: 'var(--color-primary-fg)' },
                    muted: { value: 'var(--color-primary-subtle)' },
                    subtle: { value: 'var(--color-primary-subtle)' },
                    emphasized: { value: 'var(--color-primary-hover)' },
                    focusRing: { value: 'var(--color-primary)' },
                },
            },
        },
    },
});

export const system = createSystem(defaultConfig, config);
