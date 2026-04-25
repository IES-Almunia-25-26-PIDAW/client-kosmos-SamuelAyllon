import { Box, Circle, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import { Form } from '@inertiajs/react';
import { AlertTriangle, Lock, Trash2 } from 'lucide-react';
import { useRef } from 'react';
import ProfileActions from '@/actions/App/Http/Controllers/Settings/Profile';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <Card shadow="sm" borderColor="danger.muted">
            <CardHeader
                borderBottomWidth="1px"
                borderBottomColor="danger.muted"
                bg="danger.subtle"
                pb="4"
            >
                <HStack gap="2">
                    <Trash2 size={20} color="var(--ck-colors-danger-fg)" />
                    <CardTitle fontSize="md" fontWeight="semibold" color="danger.fg">
                        Eliminar cuenta
                    </CardTitle>
                </HStack>
                <CardDescription color="danger.fg">
                    Elimina tu cuenta y todos sus datos de forma permanente
                </CardDescription>
            </CardHeader>
            <CardContent pt="6">
                <Stack gap="4">
                    <Flex
                        role="alert"
                        align="flex-start"
                        gap="3"
                        rounded="lg"
                        borderWidth="1px"
                        borderColor="danger.muted"
                        bg="danger.subtle"
                        p="4"
                    >
                        <Box flexShrink={0} mt="0.5">
                            <AlertTriangle
                                size={20}
                                color="var(--ck-colors-danger-fg)"
                            />
                        </Box>
                        <Stack gap="1">
                            <Text fontWeight="medium" color="danger.fg">
                                Advertencia
                            </Text>
                            <Text fontSize="sm" color="danger.fg">
                                Esta acción es irreversible. Una vez eliminada tu
                                cuenta, todos los datos asociados (tareas, ideas,
                                clientes y recursos) serán eliminados permanentemente.
                            </Text>
                        </Stack>
                    </Flex>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="destructive"
                                data-test="delete-user-button"
                                type="button"
                            >
                                <Trash2 size={16} />
                                Eliminar mi cuenta
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <HStack gap="3" mb="2">
                                <Circle size="10" bg="danger.subtle">
                                    <AlertTriangle
                                        size={20}
                                        color="var(--ck-colors-danger-fg)"
                                    />
                                </Circle>
                                <DialogTitle fontSize="lg">
                                    ¿Eliminar tu cuenta?
                                </DialogTitle>
                            </HStack>
                            <DialogDescription fontSize="sm">
                                Una vez eliminada tu cuenta, todos los recursos y
                                datos serán eliminados permanentemente. Introduce tu
                                contraseña para confirmar que deseas eliminar tu
                                cuenta definitivamente.
                            </DialogDescription>

                            <Form
                                {...ProfileActions.DestroyAction.form()}
                                options={{ preserveScroll: true }}
                                onError={() => passwordInput.current?.focus()}
                                resetOnSuccess
                                style={{ marginTop: '1rem' }}
                            >
                                {({ resetAndClearErrors, processing, errors }) => (
                                    <Stack gap="4">
                                        <Stack gap="2">
                                            <Label htmlFor="password">
                                                <HStack gap="2" fontSize="sm" fontWeight="medium">
                                                    <Lock size={16} color="var(--ck-colors-fg-muted)" />
                                                    <span>Contraseña</span>
                                                </HStack>
                                            </Label>

                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                ref={passwordInput}
                                                placeholder="Tu contraseña actual"
                                                autoComplete="current-password"
                                            />

                                            <InputError message={errors.password} />
                                        </Stack>

                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        resetAndClearErrors()
                                                    }
                                                >
                                                    Cancelar
                                                </Button>
                                            </DialogClose>

                                            <Button
                                                type="submit"
                                                variant="destructive"
                                                disabled={processing}
                                                data-test="confirm-delete-user-button"
                                                loading={processing}
                                            >
                                                <Trash2 size={16} />
                                                Eliminar cuenta
                                            </Button>
                                        </DialogFooter>
                                    </Stack>
                                )}
                            </Form>
                        </DialogContent>
                    </Dialog>
                </Stack>
            </CardContent>
        </Card>
    );
}
