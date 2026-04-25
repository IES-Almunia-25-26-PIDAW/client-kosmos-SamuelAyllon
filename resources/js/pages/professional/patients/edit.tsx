import { Box, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { Head, useForm } from '@inertiajs/react';
import type { ReactNode } from 'react';
import PatientUpdateAction from '@/actions/App/Http/Controllers/Patient/UpdateAction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { Patient } from '@/types';

interface Props {
    patient: Patient;
}

export default function PatientEdit({ patient }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        project_name: patient.project_name,
        email: patient.email ?? '',
        phone: patient.phone ?? '',
        brand_tone: patient.brand_tone ?? '',
        service_scope: patient.service_scope ?? '',
        next_deadline: patient.next_deadline ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(PatientUpdateAction.url(patient.id));
    };

    return (
        <>
            <Head title={`Editar ${patient.project_name} — ClientKosmos`} />

            <Stack gap="6" p={{ base: '6', lg: '8' }} maxW="2xl">
                <Box>
                    <Heading as="h1" fontSize="3xl" fontWeight="bold" color="fg">
                        Editar paciente
                    </Heading>
                    <Text mt="1" fontSize="md" color="fg.muted">
                        {patient.project_name}
                    </Text>
                </Box>

                <Box as="form" onSubmit={submit}>
                    <Stack gap="5">
                        <Stack
                            gap="5"
                            borderRadius="lg"
                            borderWidth="1px"
                            borderColor="border"
                            bg="bg.surface"
                            p="6"
                            boxShadow="sm"
                        >
                            <Stack gap="1.5">
                                <Label htmlFor="project_name">
                                    Nombre del paciente <Box as="span" color="danger.solid">*</Box>
                                </Label>
                                <Input
                                    id="project_name"
                                    value={data.project_name}
                                    onChange={(e) => setData('project_name', e.target.value)}
                                    h="10"
                                    required
                                />
                                {errors.project_name && (
                                    <Text fontSize="xs" color="danger.solid">{errors.project_name}</Text>
                                )}
                            </Stack>

                            <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap="4">
                                <Stack gap="1.5">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} h="10" />
                                </Stack>
                                <Stack gap="1.5">
                                    <Label htmlFor="phone">Teléfono</Label>
                                    <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} h="10" />
                                </Stack>
                            </Grid>

                            <Stack gap="1.5">
                                <Label htmlFor="service_scope">Motivo de consulta</Label>
                                <Textarea
                                    id="service_scope"
                                    value={data.service_scope}
                                    onChange={(e) => setData('service_scope', e.target.value)}
                                    minH="80px"
                                    resize="vertical"
                                />
                            </Stack>

                            <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap="4">
                                <Stack gap="1.5">
                                    <Label htmlFor="brand_tone">Enfoque terapéutico</Label>
                                    <Input id="brand_tone" value={data.brand_tone} onChange={(e) => setData('brand_tone', e.target.value)} h="10" />
                                </Stack>
                                <Stack gap="1.5">
                                    <Label htmlFor="next_deadline">Próxima sesión</Label>
                                    <Input id="next_deadline" type="date" value={data.next_deadline} onChange={(e) => setData('next_deadline', e.target.value)} h="10" />
                                </Stack>
                            </Grid>
                        </Stack>

                        <Flex gap="3">
                            <Button type="button" variant="secondary" onClick={() => window.history.back()} disabled={processing}>
                                Cancelar
                            </Button>
                            <Button type="submit" variant="primary" loading={processing}>
                                Guardar cambios
                            </Button>
                        </Flex>
                    </Stack>
                </Box>
            </Stack>
        </>
    );
}

PatientEdit.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
