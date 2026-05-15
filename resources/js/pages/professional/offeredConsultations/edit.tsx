import { Box, Container, Flex, Heading, Icon, Separator, Stack, Text } from '@chakra-ui/react';
import { Head } from '@inertiajs/react';
import { Briefcase } from 'lucide-react';
import type { ReactNode } from 'react';
import OfferedConsultationsIndexAction from '@/actions/App/Http/Controllers/OfferedConsultations/IndexAction';
import OfferedConsultationsUpdateAction from '@/actions/App/Http/Controllers/OfferedConsultations/UpdateAction';
import { FormOfferedConsultations } from '@/components/professional/forms/form-offered-consultations';
import AppLayout from '@/layouts/app-layout';
import type { OfferedConsultation } from '@/types/offered-consultation';

interface Props {
    consultation: OfferedConsultation;
}

export default function OfferedConsultationsEdit({ consultation }: Props) {
    return (
        <>
            <Head title={`Editar ${consultation.name} — ClientKosmos`} />

            <Container maxW="2xl" px={{ base: '4', md: '6', lg: '8' }} py={{ base: '6', lg: '8' }}>
                <Stack gap="5">
                    <Box>
                        <Stack gap="3" direction="row" alignItems="center">
                            <Flex
                                flexShrink="0"
                                alignItems="center"
                                justifyContent="center"
                                boxSize="10"
                                borderRadius="full"
                                bg="brand.solid"
                            >
                                <Icon as={Briefcase} boxSize="5" color="white" />
                            </Flex>
                            <Box minW="0" flex="1">
                                <Heading as="h1" fontSize="xl" fontWeight="semibold" color="fg" lineHeight="1.2">
                                    Editar servicio
                                </Heading>
                                <Text fontSize="xs" color="fg.muted" mt="0.5" truncate>
                                    Actualiza los datos de "{consultation.name}"
                                </Text>
                            </Box>
                        </Stack>
                        <Separator mt="4" borderColor="border.subtle" />
                    </Box>

                    <FormOfferedConsultations
                        initial={consultation}
                        submitUrl={OfferedConsultationsUpdateAction.url({ offered_consultation: consultation.id })}
                        method="put"
                        submitLabel="Guardar cambios"
                        onCancelHref={OfferedConsultationsIndexAction.url()}
                    />
                </Stack>
            </Container>
        </>
    );
}

OfferedConsultationsEdit.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
