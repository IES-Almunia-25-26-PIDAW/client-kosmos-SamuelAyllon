import { Box, Flex, Grid, Heading, Stack, Text, chakra } from '@chakra-ui/react';
import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

const ChakraLink = chakra(Link);

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <Grid minH="100dvh" templateColumns={{ base: '1fr', lg: '1fr 1fr' }}>
            <Flex
                position="relative"
                display={{ base: 'none', lg: 'flex' }}
                direction="column"
                justifyContent="space-between"
                bg="#111b12"
                p="10"
                color="white"
            >
                <ChakraLink href={home()} display="flex" flexDirection="column" gap="0.5">
                    <Text
                        fontSize="xs"
                        fontWeight="bold"
                        letterSpacing="0.25em"
                        textTransform="uppercase"
                        color="white"
                    >
                        ClientKosmos
                    </Text>
                    <Text
                        fontSize="10px"
                        letterSpacing="0.2em"
                        textTransform="uppercase"
                        color="whiteAlpha.500"
                    >
                        Therapeutic Harmony
                    </Text>
                </ChakraLink>

                <Stack gap="5">
                    <Heading
                        as="h2"
                        fontSize="2.6rem"
                        fontWeight="bold"
                        lineHeight="1.15"
                        color="white"
                    >
                        A digital sanctuary for your{' '}
                        <Box as="span" color="emerald.400">
                            clinical mastery.
                        </Box>
                    </Heading>
                    <Text maxW="xs" fontSize="sm" lineHeight="relaxed" color="whiteAlpha.600">
                        Transition from the noise of administration to the clarity of therapy.
                        Designed for practitioners who value deep focus and human connection.
                    </Text>
                </Stack>

                <Box />
            </Flex>

            <Flex alignItems="center" justifyContent="center" p="8">
                <Stack w="full" maxW="sm" gap="8">
                    <Stack gap="1.5">
                        <Heading as="h1" fontSize="2xl" fontWeight="bold" letterSpacing="tight">
                            {title}
                        </Heading>
                        {description && (
                            <Text fontSize="sm" color="fg.muted">
                                {description}
                            </Text>
                        )}
                    </Stack>

                    {children}
                </Stack>
            </Flex>
        </Grid>
    );
}
