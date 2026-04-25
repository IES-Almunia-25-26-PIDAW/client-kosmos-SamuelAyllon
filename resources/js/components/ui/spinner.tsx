import { Spinner as ChakraSpinner, type SpinnerProps } from '@chakra-ui/react';

function Spinner(props: SpinnerProps) {
    return (
        <ChakraSpinner
            data-slot="spinner"
            role="status"
            aria-label="Loading"
            size="sm"
            color="brand.solid"
            {...props}
        />
    );
}

export { Spinner };
