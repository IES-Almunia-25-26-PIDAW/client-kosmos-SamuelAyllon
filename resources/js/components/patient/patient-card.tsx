import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { Link } from '@inertiajs/react';
import React from 'react';
import PatientShowAction from '@/actions/App/Http/Controllers/Patient/ShowAction';
import { StatusBadge } from '@/components/ui/status-badge';
import type { Patient, PatientStatus } from '@/types';

interface PatientCardProps {
    patient: Patient;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
    const statuses: PatientStatus[] = patient.statuses ?? [];

    return (
        <Box
            as={Link}
            // @ts-expect-error — Inertia Link props are forwarded via `as`
            href={PatientShowAction.url(patient.patient_profile.id)}
            display="block"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="border"
            bg="bg.surface"
            p="4"
            shadow="sm"
            cursor="pointer"
            transition="all 200ms"
            _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
        >
            <Flex align="center" gap="3" mb="3">
                {patient.avatar_path ? (
                    <Image
                        src={patient.avatar_path}
                        alt={patient.project_name}
                        h="10"
                        w="10"
                        rounded="full"
                        objectFit="cover"
                        flexShrink={0}
                    />
                ) : (
                    <Flex
                        h="10"
                        w="10"
                        rounded="full"
                        bg="brand.subtle"
                        align="center"
                        justify="center"
                        flexShrink={0}
                        color="brand.fg"
                        fontWeight="semibold"
                        fontSize="sm"
                    >
                        {patient.project_name?.substring(0, 2).toUpperCase() ?? '?'}
                    </Flex>
                )}
                <Box flex="1" minW="0">
                    <Text fontSize="sm" fontWeight="medium" color="fg" truncate>
                        {patient.project_name}
                    </Text>
                    {patient.brand_tone && (
                        <Text fontSize="xs" color="fg.subtle" truncate>
                            {patient.brand_tone}
                        </Text>
                    )}
                </Box>
            </Flex>

            {statuses.length > 0 && (
                <Flex wrap="wrap" gap="1.5">
                    {statuses.map((s) => (
                        <StatusBadge key={s} status={s} variant="subtle" />
                    ))}
                </Flex>
            )}

            {patient.next_deadline && (
                <Text fontSize="xs" color="fg.muted" mt="2">
                    Próxima sesión:{' '}
                    {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(
                        new Date(patient.next_deadline),
                    )}
                </Text>
            )}
        </Box>
    );
};

PatientCard.displayName = 'PatientCard';
