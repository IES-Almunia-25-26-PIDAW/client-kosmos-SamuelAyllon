import { Card as ChakraCard } from '@chakra-ui/react';
import * as React from 'react';

type RootProps = React.ComponentProps<typeof ChakraCard.Root>;

function Card(props: RootProps) {
    return (
        <ChakraCard.Root
            data-slot="card"
            bg="card"
            color="card.fg"
            borderColor="border"
            rounded="xl"
            shadow="sm"
            py="6"
            gap="6"
            {...props}
        />
    );
}

function CardHeader(props: React.ComponentProps<typeof ChakraCard.Header>) {
    return (
        <ChakraCard.Header
            data-slot="card-header"
            display="flex"
            flexDirection="column"
            gap="1.5"
            px="6"
            py="0"
            {...props}
        />
    );
}

function CardTitle(props: React.ComponentProps<typeof ChakraCard.Title>) {
    return (
        <ChakraCard.Title
            data-slot="card-title"
            fontWeight="semibold"
            lineHeight="none"
            {...props}
        />
    );
}

function CardDescription(
    props: React.ComponentProps<typeof ChakraCard.Description>,
) {
    return (
        <ChakraCard.Description
            data-slot="card-description"
            color="fg.muted"
            fontSize="sm"
            {...props}
        />
    );
}

function CardContent(props: React.ComponentProps<typeof ChakraCard.Body>) {
    return (
        <ChakraCard.Body
            data-slot="card-content"
            px="6"
            py="0"
            {...props}
        />
    );
}

function CardFooter(props: React.ComponentProps<typeof ChakraCard.Footer>) {
    return (
        <ChakraCard.Footer
            data-slot="card-footer"
            display="flex"
            alignItems="center"
            px="6"
            py="0"
            {...props}
        />
    );
}

export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
};
