import { Box, HStack, Text } from '@chakra-ui/react';

export function RecordingIndicator() {
    return (
        <HStack gap="1.5" alignItems="center">
            <Box
                w="2.5"
                h="2.5"
                borderRadius="full"
                bg="red.500"
                animation="pulse 1s ease-in-out infinite"
            />
            <Text
                fontSize="xs"
                fontWeight="semibold"
                color="red.400"
                letterSpacing="wider"
                textTransform="uppercase"
            >
                Grabando
            </Text>
        </HStack>
    );
}
