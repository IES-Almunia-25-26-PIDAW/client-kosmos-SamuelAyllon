import { Box, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { Head, useForm } from '@inertiajs/react';
import type { ReactNode } from 'react';
import PatientStoreAction from '@/actions/App/Http/Controllers/Patient/StoreAction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';

interface FormData {
    project_name: string;
    email: string;
    phone: string;
    brand_tone: string;
    service_scope: string;
    next_deadline: string;
    [key: string]: string;
}

export default function PatientCreate() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        project_name: '',
        email: '',
        phone: '',
        brand_tone: '',
        service_scope: '',
        next_deadline: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(PatientStoreAction.url());
    };

    return (
        <>
            <Head title="Nuevo paciente — ClientKosmos" />

            <Stack gap="6" p={{ base: '6', lg: '8' }} maxW="2xl">
                <Box>
                    <Heading as="h1" fontSize="3xl" fontWeight="bold" color="fg">
                        Nuevo paciente
                    </Heading>
                    <Text mt="1" fontSize="md" color="fg.muted">
                        Añade los datos básicos del paciente. Podrás completarlos más adelante.
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
                                    placeholder="Nombre completo o alias"
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
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="email@ejemplo.com"
                                        h="10"
                                    />
                                    {errors.email && (
                                        <Text fontSize="xs" color="danger.solid">{errors.email}</Text>
                                    )}
                                </Stack>
                                <Stack gap="1.5">
                                    <Label htmlFor="phone">Teléfono</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+34 600 000 000"
                                        h="10"
                                    />
                                </Stack>
                            </Grid>

                            <Stack gap="1.5">
                                <Label htmlFor="service_scope">Motivo de consulta</Label>
                                <Textarea
                                    id="service_scope"
                                    value={data.service_scope}
                                    onChange={(e) => setData('service_scope', e.target.value)}
                                    placeholder="Describe brevemente el motivo de consulta o el objetivo terapéutico"
                                    minH="80px"
                                    resize="vertical"
                                />
                            </Stack>

                            <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap="4">
                                <Stack gap="1.5">
                                    <Label htmlFor="brand_tone">Enfoque terapéutico</Label>
                                    <Input
                                        id="brand_tone"
                                        value={data.brand_tone}
                                        onChange={(e) => setData('brand_tone', e.target.value)}
                                        placeholder="TCC, EMDR, Humanista…"
                                        h="10"
                                    />
                                </Stack>
                                <Stack gap="1.5">
                                    <Label htmlFor="next_deadline">Próxima sesión</Label>
                                    <Input
                                        id="next_deadline"
                                        type="date"
                                        value={data.next_deadline}
                                        onChange={(e) => setData('next_deadline', e.target.value)}
                                        h="10"
                                    />
                                </Stack>
                            </Grid>
                        </Stack>

                        <Flex gap="3">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => window.history.back()}
                                disabled={processing}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" variant="primary" loading={processing}>
                                Crear paciente
                            </Button>
                        </Flex>
                    </Stack>
                </Box>
            </Stack>
        </>
    );
}

PatientCreate.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
