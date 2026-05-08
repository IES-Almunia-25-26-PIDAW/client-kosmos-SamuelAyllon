import { Heading, Stack, Text } from '@chakra-ui/react';
import { Head } from '@inertiajs/react';
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
            <Stack id="main-content" tabIndex={-1} gap="6" px={{ base: '6', lg: '8' }} pt={{ base: '8', lg: '10' }} pb="10" maxW="4xl" mx="auto" w="full">
                <Stack gap="1">
                    <Heading as="h1" fontSize="3xl" fontWeight="bold" color="fg">
                        Editar servicio
                    </Heading>
                    <Text fontSize="sm" color="fg.muted">
                        Actualiza los datos de "{consultation.name}".
                    </Text>
                </Stack>

                <FormOfferedConsultations
                    initial={consultation}
                    submitUrl={OfferedConsultationsUpdateAction.url({ offered_consultation: consultation.id })}
                    method="put"
                    submitLabel="Guardar cambios"
                    onCancelHref={OfferedConsultationsIndexAction.url()}
                />
            </Stack>
        </>
    );
}

OfferedConsultationsEdit.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
