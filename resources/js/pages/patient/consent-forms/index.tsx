import { Badge, Box, Flex, Heading, Stack, Text, chakra } from '@chakra-ui/react';
import { Head, router } from '@inertiajs/react';
import { CheckCircle2, Clock, FileText } from 'lucide-react';
import type { ReactNode } from 'react';
import SignAction from '@/actions/App/Http/Controllers/Portal/ConsentForm/SignAction';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

const ChakraForm = chakra('form');

interface ConsentFormRow {
    id: number;
    consent_type: string;
    status: 'pending' | 'signed' | 'expired';
    signed_at: string | null;
    expires_at: string | null;
    created_at: string;
}

interface Props {
    consentForms: ConsentFormRow[];
}

const STATUS_CONFIG: Record<string, { label: string; palette: string; icon: typeof FileText }> = {
    pending: { label: 'Pendiente de firma', palette: 'yellow', icon: Clock },
    signed: { label: 'Firmado', palette: 'green', icon: CheckCircle2 },
    expired: { label: 'Caducado', palette: 'red', icon: FileText },
};

const CONSENT_TYPE_LABELS: Record<string, string> = {
    gdpr: 'Protección de datos (RGPD)',
    treatment: 'Consentimiento de tratamiento',
    recording: 'Consentimiento de grabación',
    minor: 'Consentimiento menores de edad',
};

const formatDate = (iso: string): string =>
    new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(iso));

export default function PatientConsentFormsIndex({ consentForms }: Props) {
    const handleSign = (id: number) => {
        router.post(SignAction.url(id));
    };

    return (
        <>
            <Head title="Acuerdos — ClientKosmos" />

            <Stack
                id="main-content"
                tabIndex={-1}
                gap="8"
                pt={{ base: '10', lg: '14' }}
                px={{ base: '6', lg: '8' }}
                pb="10"
                maxW="5xl"
                mx="auto"
                w="full"
            >
                <Stack gap="1">
                    <Heading as="h1" fontSize="4xl" fontWeight="bold" color="fg" letterSpacing="-0.48px">
                        Acuerdos y consentimientos
                    </Heading>
                    <Text fontSize="md" color="fg.muted">
                        {consentForms.length === 0
                            ? 'No tienes consentimientos pendientes.'
                            : `${consentForms.length} documento${consentForms.length === 1 ? '' : 's'}`}
                    </Text>
                </Stack>

                {consentForms.length === 0 ? (
                    <Box
                        borderRadius="2xl"
                        borderWidth="1px"
                        borderColor="border"
                        bg="bg.surface"
                        p="12"
                        textAlign="center"
                    >
                        <Box as={FileText} w="10" h="10" mx="auto" mb="3" color="fg.subtle" aria-hidden />
                        <Text fontSize="sm" color="fg.muted">
                            Cuando tu profesional envíe un formulario de consentimiento aparecerá aquí.
                        </Text>
                    </Box>
                ) : (
                    <Stack gap="4" role="list">
                        {consentForms.map((form) => {
                            const cfg = STATUS_CONFIG[form.status] ?? STATUS_CONFIG.pending;
                            const typeLabel = CONSENT_TYPE_LABELS[form.consent_type] ?? form.consent_type;
                            const isPending = form.status === 'pending';

                            return (
                                <Flex
                                    key={form.id}
                                    role="listitem"
                                    bg="bg.surface"
                                    borderRadius="2xl"
                                    borderWidth="1px"
                                    borderColor={isPending ? 'warning.emphasized' : 'border'}
                                    boxShadow="sm"
                                    p="6"
                                    gap="4"
                                    alignItems={{ base: 'stretch', md: 'center' }}
                                    flexDirection={{ base: 'column', md: 'row' }}
                                    justifyContent="space-between"
                                >
                                    <Flex gap="4" alignItems="flex-start" flex="1" minW={0}>
                                        <Box
                                            w="10"
                                            h="10"
                                            borderRadius="xl"
                                            bg={isPending ? 'warning.subtle' : 'bg.surfaceAlt'}
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            flexShrink={0}
                                        >
                                            <Box
                                                as={cfg.icon}
                                                w="5"
                                                h="5"
                                                color={isPending ? 'warning.fg' : 'fg.muted'}
                                                aria-hidden
                                            />
                                        </Box>

                                        <Stack gap="1" minW={0}>
                                            <Flex alignItems="center" gap="2" flexWrap="wrap">
                                                <Heading as="h2" fontSize="md" fontWeight="semibold" color="fg">
                                                    {typeLabel}
                                                </Heading>
                                                <Badge
                                                    variant="subtle"
                                                    colorPalette={cfg.palette}
                                                    borderRadius="full"
                                                    px="2.5"
                                                    py="0.5"
                                                    fontSize="2xs"
                                                    fontWeight="semibold"
                                                    textTransform="uppercase"
                                                    letterSpacing="wider"
                                                >
                                                    {cfg.label}
                                                </Badge>
                                            </Flex>

                                            <Flex gap="4" flexWrap="wrap" color="fg.muted" fontSize="xs">
                                                <Text>Enviado el {formatDate(form.created_at)}</Text>
                                                {form.signed_at && (
                                                    <Text>Firmado el {formatDate(form.signed_at)}</Text>
                                                )}
                                                {form.expires_at && (
                                                    <Text>Expira el {formatDate(form.expires_at)}</Text>
                                                )}
                                            </Flex>
                                        </Stack>
                                    </Flex>

                                    {isPending && (
                                        <ChakraForm
                                            method="post"
                                            action={SignAction.url(form.id)}
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                handleSign(form.id);
                                            }}
                                        >
                                            <Button type="submit" variant="primary" size="sm">
                                                Firmar ahora
                                            </Button>
                                        </ChakraForm>
                                    )}
                                </Flex>
                            );
                        })}
                    </Stack>
                )}
            </Stack>
        </>
    );
}

PatientConsentFormsIndex.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
