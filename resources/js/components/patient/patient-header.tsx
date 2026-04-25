import { Box, Flex, Heading, Image } from '@chakra-ui/react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';
import React from 'react';
import { StatusBadge } from '@/components/ui/status-badge';
import type { Patient, PatientStatus } from '@/types';

interface PatientHeaderProps {
    patient: Patient;
}

const PatientHeader: React.FC<PatientHeaderProps> = ({ patient }) => {
    const statuses: PatientStatus[] = patient.statuses ?? [];

    return (
        <Box
            position="sticky"
            top="0"
            zIndex="sticky"
            borderBottomWidth="1px"
            borderColor="border.subtle"
            bg="bg.surface"
            shadow="sm"
        >
            <Flex
                h="73px"
                px={{ base: '4', lg: '8' }}
                align="center"
                justify="space-between"
                gap="3"
            >
                <Flex align="center" gap="3" flex="1" minW="0">
                    <Box
                        as={Link}
                        // @ts-expect-error — Inertia Link props forwarded via `as`
                        href="/patients"
                        p="1.5"
                        borderRadius="sm"
                        transition="background-color 200ms"
                        _hover={{ bg: 'bg.surfaceAlt' }}
                        aria-label="Volver a pacientes"
                        display="inline-flex"
                    >
                        <ArrowLeft size={18} color="var(--ck-colors-fg-muted)" />
                    </Box>

                    {patient.avatar_path ? (
                        <Image
                            src={patient.avatar_path}
                            alt={patient.project_name}
                            h="9"
                            w="9"
                            rounded="full"
                            objectFit="cover"
                            flexShrink={0}
                        />
                    ) : (
                        <Flex
                            h="9"
                            w="9"
                            rounded="full"
                            bg="brand.subtle"
                            align="center"
                            justify="center"
                            flexShrink={0}
                            color="brand.fg"
                            fontSize="sm"
                            fontWeight="semibold"
                        >
                            {patient.project_name.substring(0, 2).toUpperCase()}
                        </Flex>
                    )}

                    <Box flex="1" minW="0">
                        <Heading as="h1" fontSize="sm" fontWeight="medium" color="fg" truncate>
                            {patient.project_name}
                        </Heading>
                        {statuses.length > 0 && (
                            <Flex gap="1" mt="0.5" overflowX="auto">
                                {statuses.map((s) => (
                                    <StatusBadge key={s} status={s} variant="subtle" />
                                ))}
                            </Flex>
                        )}
                    </Box>
                </Flex>

                <Flex align="center" gap="2" flexShrink={0}>
                    <Box
                        as={Link}
                        // @ts-expect-error — Inertia Link props forwarded via `as`
                        href={`/patients/${patient.id}/edit`}
                        p="1.5"
                        borderRadius="sm"
                        transition="background-color 200ms"
                        _hover={{ bg: 'bg.surfaceAlt' }}
                        aria-label="Editar paciente"
                        display="inline-flex"
                    >
                        <Edit size={16} color="var(--ck-colors-fg-muted)" />
                    </Box>
                </Flex>
            </Flex>
        </Box>
    );
};

PatientHeader.displayName = 'PatientHeader';

export { PatientHeader };
