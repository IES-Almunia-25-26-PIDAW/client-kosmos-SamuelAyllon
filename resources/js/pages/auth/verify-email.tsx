import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { Form, Head } from '@inertiajs/react';
import { CheckCircle2, LogOut, Mail, MailCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

const layoutTitle = 'Verifica tu email';
const layoutDescription = 'Por favor verifica tu dirección de correo electrónico haciendo clic en el enlace que te enviamos.';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            <Head title="Verificar email" />

            {status === 'verification-link-sent' && (
                <Flex
                    alignItems="center"
                    gap="3"
                    borderRadius="xl"
                    borderWidth="2px"
                    borderColor="success.subtle"
                    bg="success.subtle"
                    px="4"
                    py="3"
                    mb="6"
                >
                    <Flex h="8" w="8" alignItems="center" justifyContent="center" borderRadius="lg" bg="success.subtle">
                        <Box as={CheckCircle2} h="4" w="4" color="success.fg" />
                    </Flex>
                    <Text fontSize="sm" fontWeight="medium" color="success.fg">
                        Se ha enviado un nuevo enlace de verificación a tu email.
                    </Text>
                </Flex>
            )}

            <Flex direction="column" alignItems="center" gap="4" py="4" mb="4">
                <Flex h="16" w="16" borderRadius="2xl" bg="brand.subtle" alignItems="center" justifyContent="center">
                    <Box as={MailCheck} h="8" w="8" color="brand.solid" />
                </Flex>
            </Flex>

            <Form action={send.url()} method="post" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
                {({ processing }) => (
                    <Stack gap="6">
                        <Button
                            disabled={processing}
                            variant="outline"
                            w="full"
                            h="11"
                            fontSize="md"
                            fontWeight="semibold"
                            borderRadius="xl"
                            borderWidth="2px"
                        >
                            {processing ? <Spinner /> : <Box as={Mail} h="4" w="4" mr="2" />}
                            Reenviar email de verificación
                        </Button>

                        <TextLink href={logout()}>
                            <Flex alignItems="center" justifyContent="center" gap="2" fontSize="sm" color="fg.muted" _hover={{ color: 'fg' }}>
                                <Box as={LogOut} h="4" w="4" />
                                <Text as="span">Cerrar sesión</Text>
                            </Flex>
                        </TextLink>
                    </Stack>
                )}
            </Form>
        </>
    );
}

VerifyEmail.layout = (page: ReactNode) => (
    <AuthLayout title={layoutTitle} description={layoutDescription}>{page}</AuthLayout>
);
