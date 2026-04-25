import { Flex, Icon, Text } from '@chakra-ui/react';
import { router } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ImpersonationBanner() {
    const stop = () => {
        router.delete('/admin/impersonate');
    };

    return (
        <Flex
            position="sticky"
            top="0"
            zIndex="calc(var(--z-toast) - 1)"
            alignItems="center"
            justifyContent="space-between"
            gap="3"
            bg="warning"
            px="4"
            py="2"
        >
            <Flex alignItems="center" gap="2">
                <Icon as={AlertTriangle} boxSize="4" color="warning.fg" flexShrink={0} />
                <Text fontSize="sm" fontWeight="medium" color="warning.fg">
                    Estás viendo la cuenta de otro usuario. Lo que hagas afectará a sus datos reales.
                </Text>
            </Flex>
            <Button variant="secondary" size="sm" onClick={stop} flexShrink={0} fontSize="xs">
                Terminar impersonación
            </Button>
        </Flex>
    );
}
