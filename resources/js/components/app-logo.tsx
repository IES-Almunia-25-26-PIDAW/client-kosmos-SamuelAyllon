import { Flex } from '@chakra-ui/react';
import logo from '@/assets/logo.svg';

export default function AppLogo() {
    return (
        <Flex alignItems="center" justifyContent="center">
            <img
                src={logo}
                alt="ClientKosmos"
                style={{ width: '5rem', height: '5rem', objectFit: 'contain' }}
            />
        </Flex>
    );
}
