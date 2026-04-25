import { Box, Heading as ChakraHeading, Text } from '@chakra-ui/react';

export default function Heading({
    title,
    description,
    variant = 'default',
}: {
    title: string;
    description?: string;
    variant?: 'default' | 'small';
}) {
    const isSmall = variant === 'small';

    return (
        <Box as="header" mb={isSmall ? undefined : '8'} spaceY={isSmall ? undefined : '0.5'}>
            <ChakraHeading
                as="h2"
                mb={isSmall ? '0.5' : undefined}
                fontSize={isSmall ? 'md' : '2xl'}
                fontWeight={isSmall ? 'medium' : 'extrabold'}
                lineHeight={isSmall ? undefined : '1.2'}
                letterSpacing={isSmall ? undefined : 'tight'}
            >
                {title}
            </ChakraHeading>
            {description && (
                <Text fontSize="sm" color="fg.muted">
                    {description}
                </Text>
            )}
        </Box>
    );
}
