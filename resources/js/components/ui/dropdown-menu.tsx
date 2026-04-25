import { Box, Menu, Portal } from '@chakra-ui/react';
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';
import * as React from 'react';

function DropdownMenu(props: React.ComponentProps<typeof Menu.Root>) {
    return <Menu.Root {...props} />;
}

function DropdownMenuPortal(props: React.ComponentProps<typeof Portal>) {
    return <Portal {...props} />;
}

function DropdownMenuTrigger(props: React.ComponentProps<typeof Menu.Trigger>) {
    return <Menu.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

type DropdownMenuContentProps = React.ComponentProps<typeof Menu.Content> & {
    sideOffset?: number;
    align?: 'start' | 'center' | 'end';
};

function DropdownMenuContent({
    sideOffset = 4,
    align,
    style,
    ...props
}: DropdownMenuContentProps) {
    return (
        <Portal>
            <Menu.Positioner
                style={{
                    ['--menu-side-offset' as string]: `${sideOffset}px`,
                    ...style,
                }}
            >
                <Menu.Content
                    data-slot="dropdown-menu-content"
                    data-align={align}
                    bg="popover"
                    color="popover.fg"
                    borderWidth="1px"
                    borderColor="border"
                    borderRadius="md"
                    shadow="md"
                    minW="8rem"
                    overflow="hidden"
                    p="1"
                    zIndex="dropdown"
                    {...props}
                />
            </Menu.Positioner>
        </Portal>
    );
}

function DropdownMenuGroup(props: React.ComponentProps<typeof Menu.ItemGroup>) {
    return <Menu.ItemGroup data-slot="dropdown-menu-group" {...props} />;
}

type DropdownMenuItemProps = Omit<
    React.ComponentProps<typeof Menu.Item>,
    'value'
> & {
    value?: string;
    inset?: boolean;
    variant?: 'default' | 'destructive';
    asChild?: boolean;
};

function DropdownMenuItem({
    value,
    inset,
    variant = 'default',
    asChild,
    children,
    ...props
}: DropdownMenuItemProps) {
    const generatedId = React.useId();
    const isDestructive = variant === 'destructive';

    return (
        <Menu.Item
            value={value ?? generatedId}
            asChild={asChild}
            data-slot="dropdown-menu-item"
            data-inset={inset ? '' : undefined}
            data-variant={variant}
            position="relative"
            display="flex"
            alignItems="center"
            gap="2"
            borderRadius="sm"
            px="2"
            py="1.5"
            fontSize="sm"
            userSelect="none"
            cursor="default"
            pl={inset ? '8' : undefined}
            color={isDestructive ? 'danger.fg' : undefined}
            _focus={{
                bg: isDestructive ? 'danger.subtle' : 'bg.muted',
                color: isDestructive ? 'danger.fg' : 'fg',
                outline: 'none',
            }}
            _disabled={{
                pointerEvents: 'none',
                opacity: 0.5,
            }}
            {...props}
        >
            {children}
        </Menu.Item>
    );
}

type DropdownMenuCheckboxItemProps = Omit<
    React.ComponentProps<typeof Menu.CheckboxItem>,
    'value' | 'checked'
> & {
    value?: string;
    checked?: boolean;
};

function DropdownMenuCheckboxItem({
    value,
    checked,
    children,
    ...props
}: DropdownMenuCheckboxItemProps) {
    const generatedId = React.useId();
    return (
        <Menu.CheckboxItem
            value={value ?? generatedId}
            checked={Boolean(checked)}
            data-slot="dropdown-menu-checkbox-item"
            position="relative"
            display="flex"
            alignItems="center"
            gap="2"
            borderRadius="sm"
            py="1.5"
            pr="2"
            pl="8"
            fontSize="sm"
            userSelect="none"
            cursor="default"
            _focus={{ bg: 'bg.muted', color: 'fg', outline: 'none' }}
            {...props}
        >
            <Box
                pointerEvents="none"
                position="absolute"
                left="2"
                display="flex"
                boxSize="3.5"
                alignItems="center"
                justifyContent="center"
            >
                <Menu.ItemIndicator>
                    <CheckIcon style={{ width: '1rem', height: '1rem' }} />
                </Menu.ItemIndicator>
            </Box>
            {children}
        </Menu.CheckboxItem>
    );
}

function DropdownMenuRadioGroup(
    props: React.ComponentProps<typeof Menu.RadioItemGroup>,
) {
    return (
        <Menu.RadioItemGroup data-slot="dropdown-menu-radio-group" {...props} />
    );
}

function DropdownMenuRadioItem({
    children,
    ...props
}: React.ComponentProps<typeof Menu.RadioItem>) {
    return (
        <Menu.RadioItem
            data-slot="dropdown-menu-radio-item"
            position="relative"
            display="flex"
            alignItems="center"
            gap="2"
            borderRadius="sm"
            py="1.5"
            pr="2"
            pl="8"
            fontSize="sm"
            userSelect="none"
            cursor="default"
            _focus={{ bg: 'bg.muted', color: 'fg', outline: 'none' }}
            {...props}
        >
            <Box
                pointerEvents="none"
                position="absolute"
                left="2"
                display="flex"
                boxSize="3.5"
                alignItems="center"
                justifyContent="center"
            >
                <Menu.ItemIndicator>
                    <CircleIcon
                        style={{
                            width: '0.5rem',
                            height: '0.5rem',
                            fill: 'currentColor',
                        }}
                    />
                </Menu.ItemIndicator>
            </Box>
            {children}
        </Menu.RadioItem>
    );
}

type DropdownMenuLabelProps = React.ComponentProps<typeof Box> & {
    inset?: boolean;
};

function DropdownMenuLabel({
    inset,
    children,
    ...props
}: DropdownMenuLabelProps) {
    return (
        <Box
            data-slot="dropdown-menu-label"
            data-inset={inset ? '' : undefined}
            px="2"
            py="1.5"
            pl={inset ? '8' : undefined}
            fontSize="sm"
            fontWeight="medium"
            {...props}
        >
            {children}
        </Box>
    );
}

function DropdownMenuSeparator(
    props: React.ComponentProps<typeof Menu.Separator>,
) {
    return (
        <Menu.Separator
            data-slot="dropdown-menu-separator"
            bg="border"
            mx="-1"
            my="1"
            height="1px"
            {...props}
        />
    );
}

function DropdownMenuShortcut(props: React.ComponentProps<typeof Box>) {
    return (
        <Box
            as="span"
            data-slot="dropdown-menu-shortcut"
            color="fg.muted"
            ml="auto"
            fontSize="xs"
            letterSpacing="widest"
            {...props}
        />
    );
}

function DropdownMenuSub(props: React.ComponentProps<typeof Menu.Root>) {
    return <Menu.Root data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
    inset,
    children,
    ...props
}: React.ComponentProps<typeof Menu.TriggerItem> & { inset?: boolean }) {
    return (
        <Menu.TriggerItem
            data-slot="dropdown-menu-sub-trigger"
            data-inset={inset ? '' : undefined}
            display="flex"
            alignItems="center"
            borderRadius="sm"
            px="2"
            py="1.5"
            pl={inset ? '8' : undefined}
            fontSize="sm"
            userSelect="none"
            cursor="default"
            _focus={{ bg: 'bg.muted', color: 'fg', outline: 'none' }}
            {...props}
        >
            {children}
            <ChevronRightIcon
                style={{ marginLeft: 'auto', width: '1rem', height: '1rem' }}
            />
        </Menu.TriggerItem>
    );
}

function DropdownMenuSubContent(
    props: React.ComponentProps<typeof Menu.Content>,
) {
    return (
        <Portal>
            <Menu.Positioner>
                <Menu.Content
                    data-slot="dropdown-menu-sub-content"
                    bg="popover"
                    color="popover.fg"
                    borderWidth="1px"
                    borderColor="border"
                    borderRadius="md"
                    shadow="lg"
                    minW="8rem"
                    overflow="hidden"
                    p="1"
                    zIndex="dropdown"
                    {...props}
                />
            </Menu.Positioner>
        </Portal>
    );
}

export {
    DropdownMenu,
    DropdownMenuPortal,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
};
