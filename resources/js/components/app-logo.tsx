import { Flex, chakra } from '@chakra-ui/react';
import logo from '@/assets/logo.svg';

export default function AppLogo() {
    return (
        <Flex alignItems="center" justifyContent="center" w="full" minW="0">
            <chakra.img
                src={logo}
                alt="ClientKosmos"
                objectFit="contain"
                maxW="full"
                w={{ base: '16', md: '20' }}
                h={{ base: '16', md: '20' }}
                css={{
                    transition: 'width 200ms linear, height 200ms linear',
                    '[data-collapsible=icon] &': {
                        width: '2.25rem',
                        height: '2.25rem',
                    },
                }}
            />
        </Flex>
    );
}
