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

export default function Privacy() {
    return (
        <>
            <Head title="Política de privacidad — ClientKosmos" />

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
                            <Heading as="h1" size="2xl">Política de privacidad</Heading>
                            <Text color="fg.muted" fontSize="sm">Última actualización: {LAST_UPDATED}</Text>
                        </Stack>

                        <Section title="1. Quiénes somos">
                            <Text>
                                ClientKosmos ({APP_DOMAIN}) es una aplicación web gratuita para profesionales
                                autónomos del sector servicios (psicología, coaching, fisioterapia, asesoría, etc.)
                                que les permite gestionar pacientes/clientes, agenda, videoconsulta, facturación y
                                comunicación. El responsable del tratamiento es el titular del proyecto, contactable
                                en{' '}
                                <ChakraLink href={`mailto:${CONTACT_EMAIL}`} color="primary">
                                    {CONTACT_EMAIL}
                                </ChakraLink>
                                .
                            </Text>
                        </Section>

                        <Section title="2. Datos que tratamos">
                            <List.Root gap="2">
                                <List.Item><strong>Cuenta:</strong> nombre, correo electrónico, contraseña cifrada con bcrypt, rol (profesional / paciente / administrador).</List.Item>
                                <List.Item><strong>Perfil profesional:</strong> especialidad, datos fiscales para facturación, foto opcional.</List.Item>
                                <List.Item><strong>Datos clínicos / de cliente:</strong> únicamente los que el profesional introduce sobre sus pacientes (notas, citas, documentos, formularios de consentimiento). El paciente acepta este tratamiento al aceptar la invitación del profesional.</List.Item>
                                <List.Item><strong>Transcripciones de videoconsulta:</strong> generadas con OpenAI Whisper sólo si el profesional y el paciente lo activan explícitamente. No se almacena el audio original.</List.Item>
                                <List.Item><strong>Datos de pago:</strong> procesados íntegramente por Stripe; ClientKosmos no almacena números de tarjeta.</List.Item>
                                <List.Item><strong>Metadatos técnicos:</strong> IP, agente de usuario, logs de acceso para seguridad y auditoría (Spatie ActivityLog).</List.Item>
                            </List.Root>
                        </Section>

                        <Section title="3. Datos de Google que tratamos">
                            <Text>
                                Si inicias sesión o registras tu cuenta con Google, la aplicación recibe únicamente:
                            </Text>
                            <List.Root gap="2">
                                <List.Item><strong>Perfil básico</strong> (nombre, foto y dirección de correo verificada) — para crear o vincular tu cuenta.</List.Item>
                                <List.Item><strong>Google Calendar y Google Meet</strong> (sólo si concedes el permiso): para crear el evento de la cita, generar el enlace de Meet y, al finalizar o cancelar la cita, eliminar el evento de tu calendario.</List.Item>
                            </List.Root>
                            <Text>
                                <strong>Uso limitado:</strong> el uso que ClientKosmos hace de la información recibida
                                de las APIs de Google se ajusta a la{' '}
                                <ChakraLink
                                    href="https://developers.google.com/terms/api-services-user-data-policy"
                                    color="primary"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Google API Services User Data Policy
                                </ChakraLink>
                                , incluidos los requisitos de Limited Use. <strong>No</strong> compartimos estos
                                datos con terceros, <strong>no</strong> los usamos para publicidad, <strong>no</strong>{' '}
                                entrenamos modelos de IA con ellos y <strong>no</strong> los leemos humanamente salvo
                                para soporte técnico bajo tu autorización expresa.
                            </Text>
                            <Text>
                                Puedes revocar el acceso en cualquier momento desde{' '}
                                <ChakraLink
                                    href="https://myaccount.google.com/permissions"
                                    color="primary"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    myaccount.google.com/permissions
                                </ChakraLink>
                                .
                            </Text>
                        </Section>

                        <Section title="4. Finalidades y base legal">
                            <List.Root gap="2">
                                <List.Item><strong>Prestación del servicio</strong> (art. 6.1.b RGPD — ejecución del contrato).</List.Item>
                                <List.Item><strong>Tratamiento de datos de salud</strong> (art. 9.2.h RGPD — finalidad sanitaria, bajo consentimiento explícito del paciente y secreto profesional).</List.Item>
                                <List.Item><strong>Facturación y obligaciones fiscales</strong> (art. 6.1.c RGPD).</List.Item>
                                <List.Item><strong>Seguridad, prevención de fraude y auditoría</strong> (art. 6.1.f RGPD — interés legítimo).</List.Item>
                                <List.Item><strong>Publicidad integrada</strong> en la versión gratuita: anuncios contextuales no personalizados; los usuarios pueden activar el modo sin anuncios mediante pago opcional.</List.Item>
                            </List.Root>
                        </Section>

                        <Section title="5. Cesión a terceros (encargados del tratamiento)">
                            <List.Root gap="2">
                                <List.Item><strong>Railway</strong> — hosting de aplicación y base de datos (UE / EEUU con SCCs).</List.Item>
                                <List.Item><strong>Cloudflare R2</strong> — almacenamiento de documentos y adjuntos.</List.Item>
                                <List.Item><strong>Google LLC</strong> — autenticación OAuth, Calendar y Meet.</List.Item>
                                <List.Item><strong>Stripe</strong> — procesamiento de pagos.</List.Item>
                                <List.Item><strong>OpenAI</strong> — transcripción Whisper y asistente Kosmo (sólo cuando lo activas).</List.Item>
                                <List.Item><strong>Groq</strong> — inferencia LLM del asistente Kosmo.</List.Item>
                                <List.Item><strong>SMTP Gmail</strong> — envío de correos transaccionales.</List.Item>
                            </List.Root>
                        </Section>

                        <Section title="6. Conservación de los datos">
                            <Text>
                                Mantenemos los datos mientras tu cuenta esté activa. Al solicitar la baja, los datos
                                de cuenta se borran de forma lógica (soft delete) y se eliminan definitivamente a los
                                30 días, salvo facturas y registros contables que se conservan durante los plazos
                                legales aplicables (hasta 6 años).
                            </Text>
                        </Section>

                        <Section title="7. Tus derechos">
                            <Text>
                                Tienes derecho a acceder, rectificar, suprimir, oponerte, limitar el tratamiento y
                                portar tus datos. Puedes ejercerlos escribiendo a{' '}
                                <ChakraLink href={`mailto:${CONTACT_EMAIL}`} color="primary">{CONTACT_EMAIL}</ChakraLink>
                                . También puedes reclamar ante la Agencia Española de Protección de Datos
                                (www.aepd.es).
                            </Text>
                            <Text>
                                Para eliminar específicamente los datos obtenidos de Google, revoca el permiso en
                                myaccount.google.com/permissions y borra tu cuenta desde los ajustes de la aplicación,
                                o solicítalo por correo.
                            </Text>
                        </Section>

                        <Section title="8. Cambios en esta política">
                            <Text>
                                Cualquier cambio sustancial se anunciará en la propia aplicación con al menos 15 días
                                de antelación.
                            </Text>
                        </Section>

                        <HStack justify="space-between" pt="4">
                            <ChakraLink asChild color="primary">
                                <Link href="/">← Volver al inicio</Link>
                            </ChakraLink>
                            <ChakraLink asChild color="primary">
                                <Link href="/terms">Términos del servicio →</Link>
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
