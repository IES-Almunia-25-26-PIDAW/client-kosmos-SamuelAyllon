import {
    Box,
    Container,
    Heading,
    HStack,
    Link as ChakraLink,
    List,
    Separator,
    Stack,
    Text,
    chakra,
} from '@chakra-ui/react';
import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import logo from '@/assets/logo.svg';

const LAST_UPDATED = '17 de mayo de 2026';
const CONTACT_EMAIL = 'samuelayllonsevilla1@gmail.com';
const APP_DOMAIN = 'clientkosmos.up.railway.app';

export default function Terms() {
    return (
        <>
            <Head title="Términos del servicio — ClientKosmos" />

            <Box minH="100vh" bg="bg" color="fg">
                <chakra.header
                    borderBottomWidth="1px"
                    bg="bg/80"
                    backdropFilter="blur(12px)"
                    position="sticky"
                    top="0"
                    zIndex="10"
                >
                    <Container maxW="3xl" py="4">
                        <Link href="/">
                            <HStack gap="2">
                                <chakra.img src={logo} alt="ClientKosmos" h="7" w="auto" />
                                <Text fontWeight="bold">ClientKosmos</Text>
                            </HStack>
                        </Link>
                    </Container>
                </chakra.header>

                <Container maxW="3xl" py={{ base: '10', md: '16' }}>
                    <Stack gap="8">
                        <Stack gap="2">
                            <Heading as="h1" size="2xl">Términos del servicio</Heading>
                            <Text color="fg.muted" fontSize="sm">Última actualización: {LAST_UPDATED}</Text>
                        </Stack>

                        <Section title="1. Aceptación">
                            <Text>
                                Al crear una cuenta en ClientKosmos ({APP_DOMAIN}) aceptas estos términos. Si no
                                estás de acuerdo, no utilices el servicio.
                            </Text>
                        </Section>

                        <Section title="2. Descripción del servicio">
                            <Text>
                                ClientKosmos es una aplicación web gratuita pensada para profesionales autónomos
                                del sector servicios (psicología, coaching, fisioterapia, asesoría, etc.). Incluye
                                gestión de pacientes/clientes, agenda, videoconsulta con Google Meet, facturación
                                con Stripe, asistente Kosmo basado en IA y comunicación por mensajería.
                            </Text>
                            <Text>
                                La aplicación se financia con publicidad integrada no personalizada. Puedes activar
                                un modo sin anuncios mediante un pago opcional gestionado por Stripe.
                            </Text>
                        </Section>

                        <Section title="3. Cuenta y responsabilidad del profesional">
                            <List.Root gap="2">
                                <List.Item>Eres responsable de la veracidad de los datos que introduces y de mantener segura tu contraseña.</List.Item>
                                <List.Item>Como profesional, eres responsable del tratamiento de los datos de tus pacientes/clientes. ClientKosmos actúa como encargado del tratamiento conforme al RGPD.</List.Item>
                                <List.Item>Debes cumplir el secreto profesional aplicable a tu actividad y obtener el consentimiento adecuado de tus pacientes/clientes antes de introducir sus datos.</List.Item>
                                <List.Item>El uso de la videoconsulta y la transcripción Whisper requiere consentimiento explícito de todos los participantes.</List.Item>
                            </List.Root>
                        </Section>

                        <Section title="4. Uso aceptable">
                            <Text>Está prohibido:</Text>
                            <List.Root gap="2">
                                <List.Item>Usar la aplicación para fines ilegales, fraudulentos o que infrinjan derechos de terceros.</List.Item>
                                <List.Item>Intentar acceder a cuentas ajenas, vulnerar la seguridad o realizar ingeniería inversa del servicio.</List.Item>
                                <List.Item>Enviar spam, malware o contenido ofensivo a través de la mensajería o las notificaciones.</List.Item>
                                <List.Item>Eludir o desactivar la publicidad sin haber contratado el modo sin anuncios.</List.Item>
                            </List.Root>
                        </Section>

                        <Section title="5. Integraciones de terceros">
                            <Text>
                                ClientKosmos integra Google (OAuth, Calendar, Meet), Stripe (pagos), OpenAI
                                (Whisper, Kosmo), Groq (LLM) y Cloudflare R2 (almacenamiento). Al utilizar estas
                                funciones aceptas también las condiciones de los respectivos proveedores. El uso de
                                datos de Google se rige por la{' '}
                                <ChakraLink
                                    href="https://developers.google.com/terms/api-services-user-data-policy"
                                    color="primary"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Google API Services User Data Policy
                                </ChakraLink>
                                , incluidos los requisitos de Limited Use.
                            </Text>
                        </Section>

                        <Section title="6. Pagos">
                            <Text>
                                Las funciones gratuitas no requieren pago. El modo sin anuncios y la facturación
                                profesional ↔ paciente se procesan mediante Stripe. ClientKosmos no almacena
                                datos de tarjeta. Los reembolsos se gestionan caso por caso escribiendo a{' '}
                                <ChakraLink href={`mailto:${CONTACT_EMAIL}`} color="primary">
                                    {CONTACT_EMAIL}
                                </ChakraLink>
                                .
                            </Text>
                        </Section>

                        <Section title="7. Disponibilidad y limitación de responsabilidad">
                            <Text>
                                El servicio se presta «tal cual» y sin garantía de disponibilidad ininterrumpida.
                                En la máxima medida permitida por la ley, ClientKosmos no responde por daños
                                indirectos, lucro cesante ni pérdida de datos derivados del uso del servicio. Se
                                recomienda al profesional mantener copias de seguridad propias de la información
                                crítica.
                            </Text>
                        </Section>

                        <Section title="8. Suspensión y baja">
                            <Text>
                                Podemos suspender o cancelar cuentas que incumplan estos términos. Tú puedes darte
                                de baja en cualquier momento desde los ajustes de la aplicación o solicitándolo por
                                correo. Aplica lo descrito en la{' '}
                                <ChakraLink asChild color="primary">
                                    <Link href="/privacy">Política de privacidad</Link>
                                </ChakraLink>{' '}
                                respecto a la conservación de datos tras la baja.
                            </Text>
                        </Section>

                        <Section title="9. Modificaciones">
                            <Text>
                                Podemos actualizar estos términos. Los cambios sustanciales se anunciarán en la
                                aplicación con al menos 15 días de antelación.
                            </Text>
                        </Section>

                        <Section title="10. Ley aplicable y jurisdicción">
                            <Text>
                                Estos términos se rigen por la legislación española. Para cualquier controversia,
                                las partes se someten a los juzgados y tribunales del domicilio del titular del
                                proyecto, sin perjuicio de los derechos reconocidos al consumidor por la normativa
                                aplicable.
                            </Text>
                        </Section>

                        <HStack justify="space-between" pt="4">
                            <ChakraLink asChild color="primary">
                                <Link href="/">← Volver al inicio</Link>
                            </ChakraLink>
                            <ChakraLink asChild color="primary">
                                <Link href="/privacy">Política de privacidad →</Link>
                            </ChakraLink>
                        </HStack>
                    </Stack>
                </Container>
            </Box>
        </>
    );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <Stack gap="3">
            <Heading as="h2" size="lg">{title}</Heading>
            <Stack gap="3" color="fg" lineHeight="relaxed">
                {children}
            </Stack>
            <Separator mt="4" />
        </Stack>
    );
}
