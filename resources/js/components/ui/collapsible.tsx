import { Collapsible as ChakraCollapsible } from '@chakra-ui/react';
import * as React from 'react';

function Collapsible(
    props: React.ComponentProps<typeof ChakraCollapsible.Root>,
) {
    return <ChakraCollapsible.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger(
    props: React.ComponentProps<typeof ChakraCollapsible.Trigger>,
) {
    return (
        <ChakraCollapsible.Trigger
            data-slot="collapsible-trigger"
            {...props}
        />
    );
}

function CollapsibleContent(
    props: React.ComponentProps<typeof ChakraCollapsible.Content>,
) {
    return (
        <ChakraCollapsible.Content
            data-slot="collapsible-content"
            {...props}
        />
    );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
