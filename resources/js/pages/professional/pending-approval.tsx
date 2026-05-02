import { Box, Flex, Heading, Icon, Stack, Text } from '@chakra-ui/react';
import { Head, Link } from '@inertiajs/react';
import { Clock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';

interface Props {
    email: string;
}

export default function PendingApproval({ email }: Props) {
    return (
        <AuthLayout
            title="Cuenta en revisión"
            description="Estamos comprobando tus credenciales profesionales"
        >
            <Head title="Cuenta pendiente de aprobación" />

            <Stack gap="6" textAlign="center">
                <Flex
                    alignSelf="center"
                    boxSize="14"
                    borderRadius="full"
                    bg="brand.subtle"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Icon as={Clock} boxSize="6" color="brand.fg" />
                </Flex>

                <Stack gap="3">
                    <Heading as="h2" fontSize="lg" fontWeight="semibold" color="fg">
                        Su cuenta será verificada por el admin en menos de 24h
                    </Heading>
                    <Text fontSize="sm" color="fg.muted">
                        Le avisaremos por correo en cuanto su perfil esté aprobado
                        y pueda empezar a trabajar.
                    </Text>
                </Stack>

                <Flex
                    alignItems="center"
                    gap="2"
                    bg="bg.subtle"
                    borderWidth="1px"
                    borderColor="border"
                    borderRadius="md"
                    px="3"
                    py="2.5"
                    fontSize="xs"
                    color="fg.muted"
                >
                    <Icon as={Mail} boxSize="4" />
                    <Text truncate>{email}</Text>
                </Flex>

                <Box>
                    <Button asChild variant="outline" size="sm">
                        <Link href={logout().url} method="post" as="button">
                            Cerrar sesión
                        </Link>
                    </Button>
                </Box>
            </Stack>
        </AuthLayout>
    );
}
