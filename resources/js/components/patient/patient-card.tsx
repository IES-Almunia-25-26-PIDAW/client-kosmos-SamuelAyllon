import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { Link } from '@inertiajs/react';
import React from 'react';
import PatientShowAction from '@/actions/App/Http/Controllers/Patient/ShowAction';
import type { Patient } from '@/types';

interface PatientCardProps {
    patient: Patient;
}

const initials = (name: string | null | undefined): string => {
    if (!name) {
        return '?';
    }
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
};

export const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
    const displayName = patient.name ?? patient.project_name ?? '—';
    const subtitle = patient.consultation_reason ?? patient.therapeutic_approach ?? null;
    const lastSessionAt = patient.last_session_at ?? null;

    return (
        <Box
            as={Link}
            // @ts-expect-error — Inertia Link props are forwarded via `as`
            href={PatientShowAction.url(patient.id)}
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
                        alt={displayName}
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
                        {initials(displayName)}
                    </Flex>
                )}
                <Box flex="1" minW="0">
                    <Text fontSize="sm" fontWeight="medium" color="fg" truncate>
                        {displayName}
                    </Text>
                    {subtitle && (
                        <Text fontSize="xs" color="fg.subtle" truncate>
                            {subtitle}
                        </Text>
                    )}
                </Box>
            </Flex>

            {lastSessionAt && (
                <Text fontSize="xs" color="fg.muted" mt="2">
                    Última sesión:{' '}
                    {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(
                        new Date(lastSessionAt),
                    )}
                </Text>
            )}
        </Box>
    );
};

PatientCard.displayName = 'PatientCard';
