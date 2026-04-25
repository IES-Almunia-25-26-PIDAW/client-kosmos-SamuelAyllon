import { Box, Flex, Image, chakra } from '@chakra-ui/react';
import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';
import logo from '@/assets/logo.png';

const ChakraLink = chakra(Link);

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <Flex
            minH="100svh"
            direction="column"
            alignItems="center"
            justifyContent="center"
            gap="6"
            bg="bg.muted"
            p={{ base: '6', md: '10' }}
        >
            <Flex w="full" maxW="md" direction="column" gap="6">
                <ChakraLink
                    href={home()}
                    display="flex"
                    alignItems="center"
                    gap="2"
                    alignSelf="center"
                    fontWeight="medium"
                >
                    <Flex h="9" w="9" alignItems="center" justifyContent="center">
                        <Image src={logo} alt="ClientKosmos" boxSize="9" objectFit="contain" />
                    </Flex>
                </ChakraLink>

                <Flex direction="column" gap="6">
                    <Card borderRadius="xl">
                        <CardHeader px="10" pt="8" pb="0" textAlign="center">
                            <CardTitle fontSize="xl">{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardContent px="10" py="8">
                            <Box>{children}</Box>
                        </CardContent>
                    </Card>
                </Flex>
            </Flex>
        </Flex>
    );
}
