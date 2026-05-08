import { Badge, Box, Flex, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import OfferedConsultationsEditAction from '@/actions/App/Http/Controllers/OfferedConsultations/EditAction';
import OfferedConsultationsIndexAction from '@/actions/App/Http/Controllers/OfferedConsultations/IndexAction';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { MODALITY_LABELS, type OfferedConsultation } from '@/types/offered-consultation';

interface Props {
    consultation: OfferedConsultation;
}

export default function OfferedConsultationsShow({ consultation }: Props) {
    return (
        <>
            <Head title={`${consultation.name} — ClientKosmos`} />
            <Stack id="main-content" tabIndex={-1} gap="6" px={{ base: '6', lg: '8' }} pt={{ base: '8', lg: '10' }} pb="10" maxW="3xl" mx="auto" w="full">
                <Button asChild variant="ghost" size="sm" alignSelf="start">
                    <Link href={OfferedConsultationsIndexAction.url()}>
                        <Box as={ArrowLeft} w="3.5" h="3.5" aria-hidden />
                        <Text fontSize="xs" fontWeight="extrabold" textTransform="uppercase">Volver a servicios</Text>
                    </Link>
                </Button>

                <Flex align="center" gap="4" justify="space-between" flexWrap="wrap">
                    <HStack gap="3">
                        <Box w="5" h="5" borderRadius="full" bg={consultation.color ?? 'gray.400'} />
                        <Heading as="h1" fontSize="3xl" fontWeight="bold" color="fg">
                            {consultation.name}
                        </Heading>
                        <Badge variant="subtle" colorPalette={consultation.is_active ? 'green' : 'gray'}>
                            {consultation.is_active ? 'Activo' : 'Inactivo'}
                        </Badge>
                    </HStack>
                    <Button asChild variant="primary" size="md">
                        <Link href={OfferedConsultationsEditAction.url({ offered_consultation: consultation.id })}>
                            Editar
                        </Link>
                    </Button>
                </Flex>

                <Stack gap="4" bg="bg.surface" borderRadius="2xl" borderWidth="1px" borderColor="border" p="6">
                    {consultation.description && (
                        <Detail label="Descripción">
                            <Text color="fg" lineHeight="tall">{consultation.description}</Text>
                        </Detail>
                    )}
                    <Detail label="Modalidad">{MODALITY_LABELS[consultation.modality]}</Detail>
                    <Detail label="Duración">{consultation.duration_minutes} min</Detail>
                    <Detail label="Precio">{consultation.price ? `${Number(consultation.price).toFixed(2)} €` : 'No definido'}</Detail>
                    <Detail label="Citas asociadas">{consultation.appointments_count ?? 0}</Detail>
                </Stack>
            </Stack>
        </>
    );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
    return (
        <Stack gap="0.5">
            <Text fontSize="2xs" fontWeight="semibold" color="fg.subtle" textTransform="uppercase" letterSpacing="wider">
                {label}
            </Text>
            <Box fontSize="sm" color="fg">{children}</Box>
        </Stack>
    );
}

OfferedConsultationsShow.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
