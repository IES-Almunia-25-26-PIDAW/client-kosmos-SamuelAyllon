import { Heading, Stack, Text } from '@chakra-ui/react';
import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import OfferedConsultationsIndexAction from '@/actions/App/Http/Controllers/OfferedConsultations/IndexAction';
import OfferedConsultationsStoreAction from '@/actions/App/Http/Controllers/OfferedConsultations/StoreAction';
import { FormOfferedConsultations } from '@/components/professional/forms/form-offered-consultations';
import AppLayout from '@/layouts/app-layout';

export default function OfferedConsultationsCreate() {
    return (
        <>
            <Head title="Nuevo servicio — ClientKosmos" />
            <Stack id="main-content" tabIndex={-1} gap="6" px={{ base: '6', lg: '8' }} pt={{ base: '8', lg: '10' }} pb="10" maxW="4xl" mx="auto" w="full">
                <Stack gap="1">
                    <Heading as="h1" fontSize="3xl" fontWeight="bold" color="fg">
                        Nuevo servicio
                    </Heading>
                    <Text fontSize="sm" color="fg.muted">
                        Define las características del servicio que ofreces.
                    </Text>
                </Stack>

                <FormOfferedConsultations
                    submitUrl={OfferedConsultationsStoreAction.url()}
                    method="post"
                    submitLabel="Crear servicio"
                    onCancelHref={OfferedConsultationsIndexAction.url()}
                />
            </Stack>
        </>
    );
}

OfferedConsultationsCreate.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
