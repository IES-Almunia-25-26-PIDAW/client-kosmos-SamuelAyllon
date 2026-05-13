import { Button, chakra, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import type { FormEvent, ReactNode } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { FieldLabel } from '@/components/ui/field-label';
import { Spinner } from '@/components/ui/spinner';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import { store as patientConsentsStore } from '@/routes/auth/google/patient-consents';

const CONSENTS = [
    { field: 'consent_privacy_policy' as const, label: 'He leído y acepto la política de privacidad.' },
    { field: 'consent_terms_of_service' as const, label: 'He leído y acepto los términos del servicio.' },
    {
        field: 'consent_health_data' as const,
        label: 'Consiento el tratamiento de mis datos de salud para la finalidad terapéutica indicada. (RGPD Art. 9.2.h)',
    },
    {
        field: 'consent_recording_global' as const,
        label: 'Autorizo la grabación de audio de mis sesiones y su procesamiento automatizado por la IA de ClientKosmos para generar resúmenes clínicos destinados exclusivamente a mi profesional. (RGPD Art. 22)',
    },
];

type Props = { name: string; email: string };

export default function GooglePatientConsents() {
    const { name, email } = usePage<Props>().props;

    const { data, setData, post, processing, errors } = useForm({
        consent_privacy_policy: false,
        consent_terms_of_service: false,
        consent_health_data: false,
        consent_recording_global: false,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post(patientConsentsStore.url());
    }

    const allChecked = CONSENTS.every(({ field }) => data[field]);
    const hasErrors = CONSENTS.some(({ field }) => errors[field]);
    const firstName = name.split(' ')[0] ?? name;

    return (
        <>
            <Head title="Completar registro" />

            <Stack gap="5">
                <Stack gap="1">
                    <Heading
                        as="h1"
                        fontFamily="heading"
                        fontWeight="extrabold"
                        fontSize={{ base: '2xl', md: '3xl' }}
                        letterSpacing="-0.025em"
                        color="fg"
                    >
                        Casi listo, {firstName}
                    </Heading>
                    <Text fontSize="sm" color="fg.muted">
                        Vas a registrarte como paciente con la cuenta{' '}
                        <chakra.span fontWeight="semibold" color="fg">
                            {email}
                        </chakra.span>
                        . Acepta los consentimientos obligatorios para continuar.
                    </Text>
                </Stack>

                <chakra.form onSubmit={submit} display="flex" flexDirection="column" gap="4">
                    <Stack gap="1">
                        <FieldLabel as="p">Consentimientos obligatorios</FieldLabel>
                        <Text fontSize="xs" color="fg.muted">
                            Debes aceptar todos los puntos para continuar.
                        </Text>
                    </Stack>

                    <Stack gap="3">
                        {CONSENTS.map(({ field, label }) => {
                            const checked = data[field] as boolean;
                            return (
                                <Flex
                                    as="label"
                                    key={field}
                                    cursor="pointer"
                                    alignItems="center"
                                    gap="3"
                                    p="4"
                                    borderRadius="xl"
                                    borderWidth="2px"
                                    borderColor={checked ? 'brand.solid' : 'border'}
                                    bg={checked ? 'brand.subtle' : 'bg.subtle'}
                                    transition="all 0.2s"
                                    _hover={{
                                        borderColor: checked ? 'brand.solid' : 'brand.emphasized',
                                        bg: checked ? 'brand.subtle' : 'bg.muted',
                                    }}
                                >
                                    <Checkbox
                                        name={field}
                                        size="sm"
                                        checked={checked}
                                        onCheckedChange={(e) => setData(field, !!e.checked)}
                                        flexShrink={0}
                                        aria-invalid={hasErrors}
                                    />
                                    <Text
                                        fontSize="sm"
                                        color={checked ? 'fg' : 'fg.muted'}
                                        lineHeight="tall"
                                        fontWeight={checked ? 'medium' : 'normal'}
                                    >
                                        {label}
                                    </Text>
                                </Flex>
                            );
                        })}
                    </Stack>

                    {hasErrors && (
                        <chakra.p fontSize="xs" color="danger.fg" role="alert">
                            Debes aceptar todos los consentimientos obligatorios para registrarte.
                        </chakra.p>
                    )}

                    <Button
                        type="submit"
                        disabled={!allChecked || processing}
                        w="full"
                        h="14"
                        borderRadius="full"
                        fontSize="lg"
                        fontWeight="bold"
                        color="rgba(255,255,255,0.97)"
                        variant="plain"
                        style={{
                            background:
                                'linear-gradient(176.70deg, rgb(95, 207, 192) 58.675%, rgba(0, 97, 86, 0.41) 141.22%)',
                            boxShadow:
                                '0px 10px 15px -3px rgba(0,97,86,0.1), 0px 4px 6px -4px rgba(0,97,86,0.1)',
                        }}
                    >
                        {processing ? <Spinner /> : 'Crear mi cuenta'}
                    </Button>
                </chakra.form>
            </Stack>
        </>
    );
}

GooglePatientConsents.layout = (page: ReactNode) => <AuthSplitLayout>{page}</AuthSplitLayout>;
