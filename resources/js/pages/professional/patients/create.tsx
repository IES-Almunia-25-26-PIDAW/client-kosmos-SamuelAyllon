import { Box, chakra, Container, Flex, Heading, Icon, Separator, Stack, Text } from '@chakra-ui/react';
import { Head, useForm } from '@inertiajs/react';
import { UserPlus } from 'lucide-react';
import type { ReactNode } from 'react';
import PatientStoreAction from '@/actions/App/Http/Controllers/Patient/StoreAction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { patientSchema } from '@/lib/schemas/patient.schema';
import { validateOrSetErrors } from '@/lib/validation';

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
    const { data, setData, post, processing, errors, setError } = useForm<FormData>({
        project_name: '',
        email: '',
        phone: '',
        brand_tone: '',
        service_scope: '',
        next_deadline: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !validateOrSetErrors(patientSchema, data, (errs) =>
                Object.entries(errs).forEach(([k, v]) =>
                    setError(k as keyof typeof data & string, v),
                ),
            )
        )
            return;
        post(PatientStoreAction.url());
    };

    return (
        <>
            <Head title="Nuevo paciente — ClientKosmos" />

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
                                <Icon as={UserPlus} boxSize="5" color="white" />
                            </Flex>
                            <Box minW="0" flex="1">
                                <Heading as="h1" fontSize="xl" fontWeight="semibold" color="fg" lineHeight="1.2">
                                    Nuevo paciente
                                </Heading>
                                <Text fontSize="xs" color="fg.muted" mt="0.5">
                                    Añade los datos básicos. Podrás completarlos más adelante.
                                </Text>
                            </Box>
                        </Stack>
                        <Separator mt="4" borderColor="border.subtle" />
                    </Box>

                    <chakra.form onSubmit={submit} display="flex" flexDirection="column" gap="4" minW="0">
                        <Stack
                            gap="3.5"
                            borderWidth="1px"
                            borderColor="border"
                            borderRadius="md"
                            bg="bg.muted/40"
                            p="3.5"
                            minW="0"
                        >
                            <Stack gap="1.5" minW="0">
                                <Label htmlFor="project_name">
                                    Nombre <Box as="span" color="danger.solid">*</Box>
                                </Label>
                                <Input
                                    id="project_name"
                                    value={data.project_name}
                                    onChange={(e) => setData('project_name', e.target.value)}
                                    placeholder="Nombre completo o alias"
                                    h="10"
                                    width="auto"
                                    required
                                    autoFocus
                                />
                                {errors.project_name && (
                                    <Text fontSize="xs" color="danger.solid">{errors.project_name}</Text>
                                )}
                            </Stack>

                            <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap="3">
                                <Stack gap="1.5" minW="0">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="email@ejemplo.com"
                                        h="10"
                                        width="auto"
                                    />
                                    {errors.email && (
                                        <Text fontSize="xs" color="danger.solid">{errors.email}</Text>
                                    )}
                                </Stack>
                                <Stack gap="1.5" minW="0">
                                    <Label htmlFor="phone">Teléfono</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+34 600 000 000"
                                        h="10"
                                        width="auto"
                                    />
                                </Stack>
                            </Box>

                            <Stack gap="1.5" minW="0">
                                <Label htmlFor="service_scope">Motivo de consulta</Label>
                                <Textarea
                                    id="service_scope"
                                    value={data.service_scope}
                                    onChange={(e) => setData('service_scope', e.target.value)}
                                    placeholder="Describe brevemente el motivo de consulta o el objetivo terapéutico"
                                    minH="80px"
                                    resize="vertical"
                                    width="auto"
                                />
                            </Stack>

                            <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap="3">
                                <Stack gap="1.5" minW="0">
                                    <Label htmlFor="brand_tone">Enfoque terapéutico</Label>
                                    <Input
                                        id="brand_tone"
                                        value={data.brand_tone}
                                        onChange={(e) => setData('brand_tone', e.target.value)}
                                        placeholder="TCC, EMDR, Humanista…"
                                        h="10"
                                        width="auto"
                                    />
                                </Stack>
                                <Stack gap="1.5" minW="0">
                                    <Label htmlFor="next_deadline">Próxima sesión</Label>
                                    <Input
                                        id="next_deadline"
                                        type="date"
                                        value={data.next_deadline}
                                        onChange={(e) => setData('next_deadline', e.target.value)}
                                        h="10"
                                        width="auto"
                                    />
                                </Stack>
                            </Box>
                        </Stack>

                        <Flex justifyContent="flex-end" gap="2" pt="1">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                                disabled={processing}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" variant="default" loading={processing}>
                                Crear paciente
                            </Button>
                        </Flex>
                    </chakra.form>
                </Stack>
            </Container>
        </>
    );
}

PatientCreate.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
