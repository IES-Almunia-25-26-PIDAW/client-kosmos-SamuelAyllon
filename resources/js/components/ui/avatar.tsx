import { Avatar as ChakraAvatar } from '@chakra-ui/react';
import * as React from 'react';

type RootProps = React.ComponentProps<typeof ChakraAvatar.Root>;
type ImageProps = React.ComponentProps<typeof ChakraAvatar.Image>;
type FallbackProps = React.ComponentProps<typeof ChakraAvatar.Fallback>;

function Avatar(props: RootProps) {
    return (
        <ChakraAvatar.Root
            data-slot="avatar"
            size="sm"
            shape="full"
            {...props}
        />
    );
}

function AvatarImage(props: ImageProps) {
    return <ChakraAvatar.Image data-slot="avatar-image" {...props} />;
}

function AvatarFallback(props: FallbackProps) {
    return (
        <ChakraAvatar.Fallback
            data-slot="avatar-fallback"
            bg="bg.muted"
            color="fg.muted"
            {...props}
        />
    );
}

export { Avatar, AvatarImage, AvatarFallback };
