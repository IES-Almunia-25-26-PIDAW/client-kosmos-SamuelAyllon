import { Flex, Grid, Image } from '@chakra-ui/react';
import logo from '@/assets/logo.svg';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({ children }: AuthLayoutProps) {
    return (
        <Grid templateColumns={{ base: '1fr', lg: '5fr 7fr' }}>
            <Flex
                display={{ base: 'none', lg: 'flex' }}
                alignItems="center"
                justifyContent="center"
                bg="#00BFA9"
                position="sticky"
                top="0"
                h="100dvh"
                alignSelf="flex-start"
            >
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    bg="#FCF9F4"
                    borderRadius="full"
                    w="72"
                    h="72"
                    overflow="hidden"
                >
                    <Image
                        src={logo}
                        alt="ClientKosmos"
                        w="140%"
                        flexShrink={0}
                        objectFit="cover"
                    />
                </Flex>
            </Flex>

            <Flex
                alignItems="center"
                justifyContent="center"
                bg="white"
                minH="100dvh"
                py={{ base: '8', lg: '16' }}
                px={{ base: '8', md: '12', lg: '24' }}
            >
                <Flex direction="column" w="full" maxW="448px" gap="6">
                    {children}
                </Flex>
            </Flex>
        </Grid>
    );
}
