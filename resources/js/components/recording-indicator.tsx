import { Box, HStack, Text } from '@chakra-ui/react';

export function RecordingIndicator() {
    return (
        <HStack gap="1.5" alignItems="center">
            <Box
                w="2.5"
                h="2.5"
                borderRadius="full"
                bg="danger.solid"
                animation="pulse 1s ease-in-out infinite"
            />
            <Text
                fontSize="xs"
                fontWeight="semibold"
                color="danger.fg"
                letterSpacing="wider"
                textTransform="uppercase"
            >
                Grabando
            </Text>
        </HStack>
    );
}
