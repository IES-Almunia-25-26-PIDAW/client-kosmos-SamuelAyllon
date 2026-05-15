import { Box, Container, Flex, Heading, Icon, Separator, Stack, Text } from '@chakra-ui/react';
import { Head } from '@inertiajs/react';
import { Briefcase } from 'lucide-react';
import type { ReactNode } from 'react';
import OfferedConsultationsIndexAction from '@/actions/App/Http/Controllers/OfferedConsultations/IndexAction';
import OfferedConsultationsStoreAction from '@/actions/App/Http/Controllers/OfferedConsultations/StoreAction';
import { FormOfferedConsultations } from '@/components/professional/forms/form-offered-consultations';
import AppLayout from '@/layouts/app-layout';

export default function OfferedConsultationsCreate() {
    return (
        <>
            <Head title="Nuevo servicio — ClientKosmos" />

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
                                    Nuevo servicio
                                </Heading>
                                <Text fontSize="xs" color="fg.muted" mt="0.5">
                                    Define las características del servicio que ofreces
                                </Text>
                            </Box>
                        </Stack>
                        <Separator mt="4" borderColor="border.subtle" />
                    </Box>

                    <FormOfferedConsultations
                        submitUrl={OfferedConsultationsStoreAction.url()}
                        method="post"
                        submitLabel="Crear servicio"
                        onCancelHref={OfferedConsultationsIndexAction.url()}
                    />
                </Stack>
            </Container>
        </>
    );
}

OfferedConsultationsCreate.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
