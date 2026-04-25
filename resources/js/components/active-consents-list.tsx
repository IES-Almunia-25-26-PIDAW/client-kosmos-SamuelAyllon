import { Badge, Box, Flex, Stack, Text } from '@chakra-ui/react';
import { router } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type ConsentStatus = 'signed' | 'revoked' | 'expired';

export type ConsentFormSummary = {
    id: number;
    consent_type: string | null;
    template_version: string | null;
    status: ConsentStatus;
    signed_at: string | null;
    expires_at: string | null;
};

const CONSENT_LABELS: Record<string, string> = {
    privacy_policy: 'Política de privacidad',
    terms_of_service: 'Términos del servicio',
    health_data: 'Tratamiento de datos de salud',
    recording_global: 'Grabación y transcripción automatizada',
};

const STATUS_LABELS: Record<ConsentStatus, { label: string; palette: string }> = {
    signed: { label: 'Firmado', palette: 'green' },
    revoked: { label: 'Revocado', palette: 'red' },
    expired: { label: 'Expirado', palette: 'yellow' },
};

function formatDate(value: string | null): string {
    if (value === null) {
        return '—';
    }
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) {
        return '—';
    }
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function ActiveConsentsList({ consentForms }: { consentForms: ConsentFormSummary[] }) {
    if (consentForms.length === 0) {
        return null;
    }

    const handleRevoke = (id: number) => {
        if (!window.confirm('¿Confirmas que quieres revocar este consentimiento? Esta acción quedará registrada.')) {
            return;
        }
        router.post(`/settings/consents/${id}/revoke`, {}, { preserveScroll: true });
    };

    return (
        <Card>
            <CardHeader>
                <Flex alignItems="center" gap="2">
                    <Box as={ShieldCheck} h="5" w="5" color="brand.solid" />
                    <CardTitle>
                        <Text as="span" fontSize="md" fontWeight="semibold">Mis consentimientos</Text>
                    </CardTitle>
                </Flex>
                <CardDescription>
                    Gestiona los consentimientos que firmaste al registrarte. Puedes revocar los que ya no quieras
                    mantener activos (excepto el consentimiento global de tratamiento de datos).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Stack gap="3">
                    {consentForms.map((consent) => {
                        const label = consent.consent_type
                            ? (CONSENT_LABELS[consent.consent_type] ?? consent.consent_type)
                            : 'Consentimiento';
                        const status = STATUS_LABELS[consent.status];
                        const canRevoke = consent.status === 'signed' && consent.consent_type !== 'health_data';

                        return (
                            <Flex
                                key={consent.id}
                                gap="3"
                                p="3"
                                borderRadius="md"
                                borderWidth="1px"
                                borderColor="border"
                                bg="bg.surface"
                                alignItems={{ base: 'stretch', sm: 'center' }}
                                justifyContent="space-between"
                                flexDirection={{ base: 'column', sm: 'row' }}
                            >
                                <Stack gap="0.5" flex="1">
                                    <Flex gap="2" alignItems="center" flexWrap="wrap">
                                        <Text fontSize="sm" fontWeight="semibold" color="fg">
                                            {label}
                                        </Text>
                                        <Badge colorPalette={status.palette} variant="subtle">
                                            {status.label}
                                        </Badge>
                                        {consent.template_version && (
                                            <Text fontSize="xs" color="fg.muted">
                                                v{consent.template_version}
                                            </Text>
                                        )}
                                    </Flex>
                                    <Text fontSize="xs" color="fg.muted">
                                        Firmado: {formatDate(consent.signed_at)}
                                        {consent.expires_at && ` · Caduca: ${formatDate(consent.expires_at)}`}
                                    </Text>
                                </Stack>
                                {canRevoke && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleRevoke(consent.id)}
                                    >
                                        Revocar
                                    </Button>
                                )}
                            </Flex>
                        );
                    })}
                </Stack>
            </CardContent>
        </Card>
    );
}
