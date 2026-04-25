import {
    Skeleton as ChakraSkeleton,
    type SkeletonProps,
} from '@chakra-ui/react';

function Skeleton(props: SkeletonProps) {
    return <ChakraSkeleton data-slot="skeleton" rounded="md" {...props} />;
}

export { Skeleton };
