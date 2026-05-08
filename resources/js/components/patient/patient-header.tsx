import { Box, Flex, Heading, Image } from '@chakra-ui/react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';
import React from 'react';
import PatientEditAction from '@/actions/App/Http/Controllers/Patient/EditAction';
import PatientIndexAction from '@/actions/App/Http/Controllers/Patient/IndexAction';
import type { Patient } from '@/types';

interface PatientHeaderProps {
    patient: Patient;
}

const PatientHeader: React.FC<PatientHeaderProps> = ({ patient }) => {
    const displayName = patient.name ?? patient.project_name ?? '—';

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
                        href={PatientIndexAction.url()}
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
                            alt={displayName}
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
                            {displayName
                                .split(/\s+/)
                                .filter(Boolean)
                                .slice(0, 2)
                                .map((p) => p[0])
                                .join('')
                                .toUpperCase()}
                        </Flex>
                    )}

                    <Box flex="1" minW="0">
                        <Heading as="h1" fontSize="sm" fontWeight="medium" color="fg" truncate>
                            {displayName}
                        </Heading>
                    </Box>
                </Flex>

                <Flex align="center" gap="2" flexShrink={0}>
                    <Box
                        as={Link}
                        // @ts-expect-error — Inertia Link props forwarded via `as`
                        href={PatientEditAction.url(patient.id)}
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
