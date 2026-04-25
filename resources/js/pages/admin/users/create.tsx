import { Box, Flex, Heading, Stack, Text, chakra } from '@chakra-ui/react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, UserPlus } from 'lucide-react';
import type { ReactNode } from 'react';
import IndexAction from '@/actions/App/Http/Controllers/Admin/Users/IndexAction';
import StoreAction from '@/actions/App/Http/Controllers/Admin/Users/StoreAction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';

const ChakraLink = chakra(Link);

export default function AdminUserCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(StoreAction.url());
    };

    return (
        <>
            <Head title="Nuevo profesional — Admin — ClientKosmos" />

            <Stack gap="6" p={{ base: '6', lg: '8' }} maxW="2xl">
                <Box>
                    <ChakraLink
                        href={IndexAction.url()}
                        display="inline-flex"
                        alignItems="center"
                        gap="2"
                        fontSize="sm"
                        color="fg.muted"
                        _hover={{ color: 'fg' }}
                        mb="4"
                    >
                        <ArrowLeft size={16} />
                        Volver a usuarios
                    </ChakraLink>
                    <Heading as="h1" fontSize="3xl" color="fg" display="flex" alignItems="center" gap="3">
                        <UserPlus size={26} />
                        Nuevo profesional
                    </Heading>
                    <Text mt="1" fontSize="md" color="fg.muted">
                        Crea una cuenta de profesional. El usuario podrá actualizar sus datos desde los ajustes.
                    </Text>
                </Box>

                <chakra.form
                    onSubmit={handleSubmit}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor="border"
                    bg="bg.surface"
                    p="6"
                    boxShadow="sm"
                    display="flex"
                    flexDirection="column"
                    gap="5"
                >
                    <Stack gap="1.5">
                        <Label htmlFor="name">Nombre completo</Label>
                        <Input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Ej. Marta García López"
                        />
                        {errors.name && (
                            <Text fontSize="xs" color="fg.error">{errors.name}</Text>
                        )}
                    </Stack>

                    <Stack gap="1.5">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="marta@clinica.com"
                        />
                        {errors.email && (
                            <Text fontSize="xs" color="fg.error">{errors.email}</Text>
                        )}
                    </Stack>

                    <Stack gap="1.5">
                        <Label htmlFor="password">Contraseña inicial</Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Mínimo 8 caracteres"
                        />
                        {errors.password && (
                            <Text fontSize="xs" color="fg.error">{errors.password}</Text>
                        )}
                    </Stack>

                    <Flex alignItems="center" justifyContent="flex-end" gap="3" pt="2" borderTopWidth="1px" borderColor="border.subtle">
                        <ChakraLink href={IndexAction.url()}>
                            <Button type="button" variant="secondary">
                                Cancelar
                            </Button>
                        </ChakraLink>
                        <Button type="submit" variant="primary" loading={processing}>
                            <UserPlus size={15} />
                            Crear profesional
                        </Button>
                    </Flex>
                </chakra.form>
            </Stack>
        </>
    );
}

AdminUserCreate.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;
