import { Box, Flex, Heading, Image, Text, chakra } from '@chakra-ui/react';
import { Link } from '@inertiajs/react';
import logo from '@/assets/logo.svg';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

const ChakraLink = chakra(Link);

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <Flex
            minH="100svh"
            direction="column"
            alignItems="center"
            justifyContent="center"
            gap="6"
            bg="bg"
            p={{ base: '6', md: '10' }}
        >
            <Box w="full" maxW="sm">
                <Flex direction="column" gap="8">
                    <Flex direction="column" alignItems="center" gap="4">
                        <ChakraLink
                            href={home()}
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            gap="2"
                            fontWeight="medium"
                        >
                            <Flex
                                mb="1"
                                h="9"
                                w="9"
                                alignItems="center"
                                justifyContent="center"
                                borderRadius="md"
                            >
                                <Image src={logo} alt="ClientKosmos" boxSize="9" objectFit="contain" />
                            </Flex>
                            <Box as="span" srOnly>{title}</Box>
                        </ChakraLink>

                        <Flex direction="column" gap="2" textAlign="center">
                            <Heading as="h1" fontSize="xl" fontWeight="medium">
                                {title}
                            </Heading>
                            <Text textAlign="center" fontSize="sm" color="fg.muted">
                                {description}
                            </Text>
                        </Flex>
                    </Flex>
                    {children}
                </Flex>
            </Box>
        </Flex>
    );
}
