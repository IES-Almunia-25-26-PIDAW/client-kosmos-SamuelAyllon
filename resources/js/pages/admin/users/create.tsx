import { Box, chakra, Field, Flex, Heading, Icon, Stack, Text } from '@chakra-ui/react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, AtSign, KeyRound, User as UserIcon, UserPlus } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import DashboardIndexAction from '@/actions/App/Http/Controllers/Admin/DashboardIndexAction';
import StoreAction from '@/actions/App/Http/Controllers/Admin/Users/StoreAction';
import { Button } from '@/components/ui/button';
import { IconInput } from '@/components/ui/icon-input';
import AdminLayout from '@/layouts/admin-layout';

const ChakraLink = chakra(Link);

export default function AdminUserCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(StoreAction.url());
    };

    return (
        <>
            <Head title="Nuevo profesional — Admin — ClientKosmos" />

            <Stack gap="6" p={{ base: '6', lg: '8' }} maxW="2xl" mx="auto" w="full">
                <Box>
                    <ChakraLink
                        href={DashboardIndexAction.url()}
                        display="inline-flex"
                        alignItems="center"
                        gap="2"
                        fontSize="sm"
                        color="fg.muted"
                        _hover={{ color: 'fg' }}
                        mb="4"
                        transition="colors"
                    >
                        <ArrowLeft size={16} />
                        Volver a usuarios
                    </ChakraLink>
                    <Flex alignItems="center" gap="3">
                        <Flex
                            alignItems="center"
                            justifyContent="center"
                            w="11"
                            h="11"
                            borderRadius="lg"
                            bg="brand.subtle"
                            color="brand.solid"
                            borderWidth="1px"
                            borderColor="brand.emphasized"
                        >
                            <Icon as={UserPlus} boxSize="5" />
                        </Flex>
                        <Box>
                            <Heading as="h1" fontSize="2xl" color="fg" lineHeight="1.2">
                                Nuevo profesional
                            </Heading>
                            <Text mt="1" fontSize="sm" color="fg.muted">
                                Crea una cuenta de profesional. El usuario podrá actualizar sus datos desde los ajustes.
                            </Text>
                        </Box>
                    </Flex>
                </Box>

                <chakra.form
                    onSubmit={handleSubmit}
                    display="flex"
                    flexDirection="column"
                    gap="4"
                    minW="0"
                >
                    <Stack
                        gap="3.5"
                        borderWidth="1px"
                        borderColor="border"
                        borderRadius="md"
                        bg="bg.muted/40"
                        p="4"
                        minW="0"
                    >
                        <Field.Root invalid={!!errors.name} required minW="0">
                            <Field.Label>
                                Nombre completo <Field.RequiredIndicator />
                            </Field.Label>
                            <IconInput
                                id="name"
                                icon={UserIcon}
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Ej. Marta García López"
                                h="10"
                                autoFocus
                            />
                            <Field.ErrorText>{errors.name}</Field.ErrorText>
                        </Field.Root>

                        <Field.Root invalid={!!errors.email} required minW="0">
                            <Field.Label>
                                Correo electrónico <Field.RequiredIndicator />
                            </Field.Label>
                            <IconInput
                                id="email"
                                icon={AtSign}
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="marta@clinica.com"
                                h="10"
                                autoComplete="email"
                            />
                            <Field.ErrorText>{errors.email}</Field.ErrorText>
                        </Field.Root>

                        <Field.Root invalid={!!errors.password} required minW="0">
                            <Field.Label>
                                Contraseña inicial <Field.RequiredIndicator />
                            </Field.Label>
                            <IconInput
                                id="password"
                                icon={KeyRound}
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Mínimo 8 caracteres"
                                h="10"
                                autoComplete="new-password"
                            />
                            {errors.password ? (
                                <Field.ErrorText>{errors.password}</Field.ErrorText>
                            ) : (
                                <Field.HelperText>
                                    El profesional podrá cambiarla después desde sus ajustes.
                                </Field.HelperText>
                            )}
                        </Field.Root>
                    </Stack>

                    <Flex
                        justifyContent="flex-end"
                        gap="2"
                        pt="1"
                    >
                        <ChakraLink href={DashboardIndexAction.url()}>
                            <Button type="button" variant="outline" disabled={processing}>
                                Cancelar
                            </Button>
                        </ChakraLink>
                        <Button type="submit" variant="default" disabled={processing} loading={processing}>
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
