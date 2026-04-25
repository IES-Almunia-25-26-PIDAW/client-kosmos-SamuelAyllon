import { chakra } from '@chakra-ui/react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import * as React from 'react';

const StyledTrigger = chakra(SelectPrimitive.Trigger, {
    base: {
        display: 'flex',
        height: '9',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2',
        borderWidth: '1px',
        borderColor: 'border',
        borderRadius: 'md',
        bg: 'transparent',
        color: 'fg',
        px: '3',
        py: '2',
        fontSize: 'sm',
        shadow: 'xs',
        outline: 'none',
        transitionProperty: 'color, box-shadow',
        _placeholder: { color: 'fg.muted' },
        _disabled: { cursor: 'not-allowed', opacity: 0.5 },
        _focusVisible: {
            borderColor: 'brand.solid',
            boxShadow: '0 0 0 3px var(--chakra-colors-brand-focusRing, rgba(99, 102, 241, 0.3))',
        },
        '&[aria-invalid="true"]': {
            borderColor: 'danger.solid',
        },
        '& svg': {
            pointerEvents: 'none',
            flexShrink: 0,
            width: '4',
            height: '4',
            color: 'fg.muted',
        },
    },
});

const StyledContent = chakra(SelectPrimitive.Content, {
    base: {
        position: 'relative',
        zIndex: 'dropdown',
        maxHeight: '24rem',
        minWidth: '8rem',
        overflow: 'hidden',
        borderWidth: '1px',
        borderColor: 'border.subtle',
        borderRadius: 'md',
        bg: 'bg.surface',
        color: 'fg',
        shadow: 'md',
    },
});

const StyledViewport = chakra(SelectPrimitive.Viewport, {
    base: {
        p: '1',
    },
});

const StyledLabel = chakra(SelectPrimitive.Label, {
    base: {
        px: '2',
        py: '1.5',
        fontSize: 'sm',
        fontWeight: 'medium',
        color: 'fg.muted',
    },
});

const StyledItem = chakra(SelectPrimitive.Item, {
    base: {
        position: 'relative',
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        gap: '2',
        borderRadius: 'sm',
        py: '1.5',
        pr: '8',
        pl: '2',
        fontSize: 'sm',
        cursor: 'default',
        userSelect: 'none',
        outline: 'none',
        color: 'fg',
        _focus: {
            bg: 'bg.muted',
            color: 'fg',
        },
        '&[data-disabled]': {
            pointerEvents: 'none',
            opacity: 0.5,
        },
        '& svg': {
            pointerEvents: 'none',
            flexShrink: 0,
            width: '4',
            height: '4',
        },
    },
});

const StyledSeparator = chakra(SelectPrimitive.Separator, {
    base: {
        pointerEvents: 'none',
        mx: '-1',
        my: '1',
        height: '1px',
        bg: 'border.subtle',
    },
});

const StyledScrollButton = chakra('div', {
    base: {
        display: 'flex',
        cursor: 'default',
        alignItems: 'center',
        justifyContent: 'center',
        py: '1',
        color: 'fg.muted',
    },
});

function Select(props: React.ComponentProps<typeof SelectPrimitive.Root>) {
    return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup(
    props: React.ComponentProps<typeof SelectPrimitive.Group>,
) {
    return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue(
    props: React.ComponentProps<typeof SelectPrimitive.Value>,
) {
    return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
    children,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
    return (
        <StyledTrigger data-slot="select-trigger" {...props}>
            {children}
            <SelectPrimitive.Icon asChild>
                <ChevronDownIcon
                    style={{
                        width: '1rem',
                        height: '1rem',
                        opacity: 0.5,
                    }}
                />
            </SelectPrimitive.Icon>
        </StyledTrigger>
    );
}

function SelectContent({
    children,
    position = 'popper',
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
    return (
        <SelectPrimitive.Portal>
            <StyledContent
                data-slot="select-content"
                position={position}
                {...props}
            >
                <SelectScrollUpButton />
                <StyledViewport>{children}</StyledViewport>
                <SelectScrollDownButton />
            </StyledContent>
        </SelectPrimitive.Portal>
    );
}

function SelectLabel(
    props: React.ComponentProps<typeof SelectPrimitive.Label>,
) {
    return <StyledLabel data-slot="select-label" {...props} />;
}

function SelectItem({
    children,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
    return (
        <StyledItem data-slot="select-item" {...props}>
            <span
                style={{
                    position: 'absolute',
                    right: '0.5rem',
                    display: 'flex',
                    width: '0.875rem',
                    height: '0.875rem',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <SelectPrimitive.ItemIndicator>
                    <CheckIcon
                        style={{ width: '1rem', height: '1rem' }}
                    />
                </SelectPrimitive.ItemIndicator>
            </span>
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </StyledItem>
    );
}

function SelectSeparator(
    props: React.ComponentProps<typeof SelectPrimitive.Separator>,
) {
    return (
        <StyledSeparator data-slot="select-separator" {...props} />
    );
}

function SelectScrollUpButton(
    props: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>,
) {
    return (
        <SelectPrimitive.ScrollUpButton
            data-slot="select-scroll-up-button"
            asChild
            {...props}
        >
            <StyledScrollButton>
                <ChevronUpIcon
                    style={{ width: '1rem', height: '1rem' }}
                />
            </StyledScrollButton>
        </SelectPrimitive.ScrollUpButton>
    );
}

function SelectScrollDownButton(
    props: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>,
) {
    return (
        <SelectPrimitive.ScrollDownButton
            data-slot="select-scroll-down-button"
            asChild
            {...props}
        >
            <StyledScrollButton>
                <ChevronDownIcon
                    style={{ width: '1rem', height: '1rem' }}
                />
            </StyledScrollButton>
        </SelectPrimitive.ScrollDownButton>
    );
}

export {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
};
