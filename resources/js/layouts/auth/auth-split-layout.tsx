import { Box, Flex, Grid, Image, Text } from '@chakra-ui/react';
import logo from '@/assets/logo.svg';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({ children }: AuthLayoutProps) {
    return (
        <Grid
            templateColumns={{ base: '1fr', lg: '5fr 7fr' }}
            h="100dvh"
            overflow="hidden"
        >
            {/* Brand panel */}
            <Flex
                display={{ base: 'none', lg: 'flex' }}
                direction="column"
                alignItems="center"
                justifyContent="center"
                h="100dvh"
                position="relative"
                overflow="hidden"
                style={{
                    background: 'linear-gradient(160deg, #1A7B6E 0%, #0F4A42 60%, #0A3530 100%)',
                }}
            >
                {/* Decorative orbs */}
                <Box
                    position="absolute"
                    top="-15%"
                    right="-20%"
                    w="70%"
                    h="70%"
                    borderRadius="full"
                    bg="rgba(255,255,255,0.05)"
                    pointerEvents="none"
                />
                <Box
                    position="absolute"
                    bottom="-20%"
                    left="-25%"
                    w="65%"
                    h="65%"
                    borderRadius="full"
                    bg="rgba(255,255,255,0.04)"
                    pointerEvents="none"
                />
                <Box
                    position="absolute"
                    top="40%"
                    left="5%"
                    w="20%"
                    h="20%"
                    borderRadius="full"
                    bg="rgba(95,207,192,0.12)"
                    pointerEvents="none"
                />

                <Flex
                    direction="column"
                    alignItems="center"
                    gap="8"
                    position="relative"
                    zIndex={1}
                    px="12"
                >
                    {/* Logo circle */}
                    <Flex
                        alignItems="center"
                        justifyContent="center"
                        bg="#FCF9F4"
                        borderRadius="full"
                        w="36"
                        h="36"
                        overflow="hidden"
                        style={{
                            boxShadow: '0 32px 64px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)',
                        }}
                    >
                        <Image
                            src={logo}
                            alt="ClientKosmos"
                            w="150%"
                            flexShrink={0}
                            objectFit="cover"
                        />
                    </Flex>

                    {/* Brand text */}
                    <Flex direction="column" alignItems="center" gap="3">
                        <Text
                            fontFamily="heading"
                            fontWeight="extrabold"
                            fontSize="4xl"
                            letterSpacing="-0.03em"
                            color="white"
                            textAlign="center"
                        >
                            ClientKosmos
                        </Text>
                        <Text
                            fontSize="md"
                            color="rgba(255,255,255,0.65)"
                            textAlign="center"
                            maxW="260px"
                            lineHeight="tall"
                        >
                            La plataforma digital para psicólogos y sus pacientes
                        </Text>
                    </Flex>

                    {/* Feature pills */}
                    <Flex gap="2" flexWrap="wrap" justifyContent="center" maxW="300px">
                        {['Citas online', 'Videoconsulta', 'Notas clínicas'].map((f) => (
                            <Box
                                key={f}
                                px="3"
                                py="1"
                                borderRadius="full"
                                fontSize="xs"
                                fontWeight="semibold"
                                color="rgba(255,255,255,0.85)"
                                bg="rgba(255,255,255,0.1)"
                                borderWidth="1px"
                                borderColor="rgba(255,255,255,0.15)"
                            >
                                {f}
                            </Box>
                        ))}
                    </Flex>
                </Flex>
            </Flex>

            {/* Form panel */}
            <Flex
                direction="column"
                bg="bg"
                h="100dvh"
                overflowY="auto"
                py={{ base: '8', md: '10', lg: '12' }}
                px={{ base: '5', sm: '8', md: '10', lg: '16' }}
            >
                <Flex
                    direction="column"
                    w="full"
                    maxW="520px"
                    mx="auto"
                    my="auto"
                    gap="6"
                >
                    {children}
                </Flex>
            </Flex>
        </Grid>
    );
}
