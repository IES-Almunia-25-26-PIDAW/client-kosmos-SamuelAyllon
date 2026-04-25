import { Breadcrumb as ChakraBreadcrumb, Box } from '@chakra-ui/react';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import * as React from 'react';

function Breadcrumb(
    props: React.ComponentProps<typeof ChakraBreadcrumb.Root>,
) {
    return (
        <ChakraBreadcrumb.Root
            aria-label="breadcrumb"
            data-slot="breadcrumb"
            {...props}
        />
    );
}

function BreadcrumbList(
    props: React.ComponentProps<typeof ChakraBreadcrumb.List>,
) {
    return (
        <ChakraBreadcrumb.List
            data-slot="breadcrumb-list"
            color="fg.muted"
            fontSize="sm"
            gap={{ base: 1.5, sm: 2.5 }}
            flexWrap="wrap"
            wordBreak="break-word"
            {...props}
        />
    );
}

function BreadcrumbItem(
    props: React.ComponentProps<typeof ChakraBreadcrumb.Item>,
) {
    return (
        <ChakraBreadcrumb.Item
            data-slot="breadcrumb-item"
            display="inline-flex"
            alignItems="center"
            gap="1.5"
            {...props}
        />
    );
}

function BreadcrumbLink({
    asChild,
    ...props
}: React.ComponentProps<typeof ChakraBreadcrumb.Link> & { asChild?: boolean }) {
    return (
        <ChakraBreadcrumb.Link
            asChild={asChild}
            data-slot="breadcrumb-link"
            transition="colors"
            _hover={{ color: 'fg' }}
            {...props}
        />
    );
}

function BreadcrumbPage(
    props: React.ComponentProps<typeof ChakraBreadcrumb.CurrentLink>,
) {
    return (
        <ChakraBreadcrumb.CurrentLink
            data-slot="breadcrumb-page"
            color="fg"
            fontWeight="normal"
            {...props}
        />
    );
}

function BreadcrumbSeparator({
    children,
    ...props
}: React.ComponentProps<typeof ChakraBreadcrumb.Separator>) {
    return (
        <ChakraBreadcrumb.Separator
            data-slot="breadcrumb-separator"
            role="presentation"
            aria-hidden="true"
            css={{ '& > svg': { width: '3.5', height: '3.5' } }}
            {...props}
        >
            {children ?? <ChevronRight />}
        </ChakraBreadcrumb.Separator>
    );
}

function BreadcrumbEllipsis(
    props: React.ComponentProps<typeof ChakraBreadcrumb.Ellipsis>,
) {
    return (
        <ChakraBreadcrumb.Ellipsis
            data-slot="breadcrumb-ellipsis"
            role="presentation"
            aria-hidden="true"
            display="flex"
            boxSize="9"
            alignItems="center"
            justifyContent="center"
            {...props}
        >
            <MoreHorizontal style={{ width: '1rem', height: '1rem' }} />
            <Box as="span" srOnly>More</Box>
        </ChakraBreadcrumb.Ellipsis>
    );
}

export {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
};
