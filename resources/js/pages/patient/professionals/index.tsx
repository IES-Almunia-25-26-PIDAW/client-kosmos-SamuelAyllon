import { Badge, Box, Flex, Grid, Heading, Stack, Text, chakra } from '@chakra-ui/react';
import { Head } from '@inertiajs/react';
import { BadgeCheck, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import AppLayout from '@/layouts/app-layout';

const ChakraImg = chakra('img');

interface Professional {
    id: number;
    name: string;
    avatar_path: string | null;
    specialties: string[];
    bio: string | null;
    collegiate_number: string | null;
    is_verified: boolean;
}

interface Props {
    professionals: Professional[];
}

const SPECIALTY_LABELS: Record<string, string> = {
    clinical: 'Clínica',
    cognitive_behavioral: 'Cognitivo-conductual',
    child: 'Infantil',
    couples: 'Parejas',
    trauma: 'Trauma',
    systemic: 'Sistémica',
};

const formatSpecialty = (key: string): string =>
    SPECIALTY_LABELS[key] ?? key.replace(/_/g, ' ');

const getInitials = (name: string): string =>
    name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase();

export default function PortalProfessionalsIndex({ professionals }: Props) {
    const count = professionals.length;

    return (
        <>
            <Head title="Profesionales — ClientKosmos" />

            <Stack
                id="main-content"
                tabIndex={-1}
                gap="8"
                pt={{ base: '10', lg: '14' }}
                px={{ base: '6', lg: '8' }}
                pb="10"
                maxW="6xl"
                mx="auto"
                w="full"
            >
                <Stack gap="2">
                    <Heading
                        as="h1"
                        fontSize="4xl"
                        fontWeight="bold"
                        color="fg"
                        letterSpacing="-0.48px"
                    >
                        Encuentra tu profesional
                    </Heading>
                    <Text fontSize="md" color="fg.muted">
                        {count === 0
                            ? 'Aún no hay profesionales verificados disponibles.'
                            : count === 1
                              ? '1 profesional verificado disponible'
                              : `${count} profesionales verificados disponibles`}
                    </Text>
                </Stack>

                {professionals.length === 0 ? (
                    <Box
                        borderRadius="2xl"
                        borderWidth="1px"
                        borderColor="border"
                        bg="bg.surface"
                        p="12"
                        textAlign="center"
                    >
                        <Box as={Users} w="10" h="10" mx="auto" mb="3" color="fg.subtle" aria-hidden={true} />
                        <Text fontSize="sm" color="fg.muted">
                            No hay profesionales verificados en este momento. Vuelve a consultar más tarde.
                        </Text>
                    </Box>
                ) : (
                    <Grid
                        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                        gap="6"
                    >
                        {professionals.map((professional) => (
                            <Stack
                                key={professional.id}
                                gap="4"
                                bg="bg.surface"
                                borderRadius="2xl"
                                boxShadow="0px 7px 23.5px -2px rgba(12,29,42,0.19)"
                                p="6"
                                h="full"
                            >
                                <Flex alignItems="center" gap="4">
                                    <Box
                                        w="14"
                                        h="14"
                                        borderRadius="full"
                                        overflow="hidden"
                                        flexShrink={0}
                                        position="relative"
                                    >
                                        {professional.avatar_path ? (
                                            <ChakraImg
                                                src={professional.avatar_path}
                                                alt=""
                                                w="full"
                                                h="full"
                                                objectFit="cover"
                                            />
                                        ) : (
                                            <Flex
                                                w="full"
                                                h="full"
                                                bg="brand.subtle"
                                                color="brand.solid"
                                                alignItems="center"
                                                justifyContent="center"
                                                fontSize="lg"
                                                fontWeight="bold"
                                            >
                                                {getInitials(professional.name)}
                                            </Flex>
                                        )}
                                    </Box>

                                    <Box minW={0} flex="1">
                                        <Heading
                                            as="h2"
                                            fontSize="lg"
                                            fontWeight="semibold"
                                            color="fg"
                                            truncate
                                        >
                                            {professional.name}
                                        </Heading>
                                        {professional.is_verified && (
                                            <Flex alignItems="center" gap="1" mt="0.5">
                                                <Box
                                                    as={BadgeCheck}
                                                    w="3.5"
                                                    h="3.5"
                                                    color="green.fg"
                                                    aria-hidden={true}
                                                />
                                                <Text
                                                    fontSize="2xs"
                                                    fontWeight="semibold"
                                                    textTransform="uppercase"
                                                    letterSpacing="wider"
                                                    color="green.fg"
                                                >
                                                    Verificado
                                                </Text>
                                            </Flex>
                                        )}
                                    </Box>
                                </Flex>

                                {professional.specialties.length > 0 && (
                                    <Flex flexWrap="wrap" gap="1.5">
                                        {professional.specialties.map((specialty) => (
                                            <Badge
                                                key={specialty}
                                                variant="subtle"
                                                colorPalette="gray"
                                                borderRadius="full"
                                                px="2.5"
                                                py="0.5"
                                                fontSize="2xs"
                                                fontWeight="semibold"
                                                textTransform="uppercase"
                                                letterSpacing="wider"
                                            >
                                                {formatSpecialty(specialty)}
                                            </Badge>
                                        ))}
                                    </Flex>
                                )}

                                {professional.bio && (
                                    <Text
                                        fontSize="sm"
                                        color="fg.muted"
                                        lineClamp={3}
                                    >
                                        {professional.bio}
                                    </Text>
                                )}

                                {professional.collegiate_number && (
                                    <Text
                                        fontSize="xs"
                                        color="fg.subtle"
                                        mt="auto"
                                    >
                                        Nº colegiado: {professional.collegiate_number}
                                    </Text>
                                )}
                            </Stack>
                        ))}
                    </Grid>
                )}
            </Stack>
        </>
    );
}

PortalProfessionalsIndex.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
