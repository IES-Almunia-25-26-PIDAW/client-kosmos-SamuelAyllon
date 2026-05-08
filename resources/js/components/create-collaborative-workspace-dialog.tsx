import { Field, HStack, Stack } from '@chakra-ui/react';
import { useForm } from '@inertiajs/react';
import { Plus, Users } from 'lucide-react';
import { useState, type FormEvent, type ReactNode } from 'react';
import WorkspaceStoreAction from '@/actions/App/Http/Controllers/Workspace/StoreAction';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';

interface Props {
    trigger?: ReactNode;
}

export default function CreateCollaborativeWorkspaceDialog({ trigger }: Props) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        name: '',
        description: '',
    });

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        post(WorkspaceStoreAction.url(), {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    }

    function handleOpenChange(nextOpen: boolean) {
        setOpen(nextOpen);
        if (!nextOpen) {
            reset();
            clearErrors();
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger ?? (
                    <Button variant="primary" type="button">
                        <Plus size={16} />
                        Crear workspace colaborativo
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <HStack gap="3" mb="2">
                    <Users size={20} color="var(--ck-colors-brand-fg)" />
                    <DialogTitle fontSize="lg">Nuevo workspace colaborativo</DialogTitle>
                </HStack>
                <DialogDescription fontSize="sm">
                    Crea un espacio compartido para trabajar con otros profesionales. Tu workspace personal seguirá siendo privado.
                </DialogDescription>

                <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                    <Stack gap="4">
                        <Field.Root invalid={Boolean(errors.name)} required>
                            <Field.Label>
                                Nombre
                                <Field.RequiredIndicator />
                            </Field.Label>
                            <Input
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Clínica Centro"
                                maxLength={100}
                                autoFocus
                            />
                            {errors.name && <Field.ErrorText>{errors.name}</Field.ErrorText>}
                        </Field.Root>

                        <Field.Root invalid={Boolean(errors.description)}>
                            <Field.Label>
                                Descripción
                                <Field.RequiredIndicator
                                    fallback={
                                        <Field.HelperText as="span" ml="1">
                                            (opcional)
                                        </Field.HelperText>
                                    }
                                />
                            </Field.Label>
                            <Textarea
                                name="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Espacio compartido para sesiones grupales y supervisión"
                                maxLength={500}
                                rows={3}
                            />
                            {errors.description && (
                                <Field.ErrorText>{errors.description}</Field.ErrorText>
                            )}
                        </Field.Root>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button type="submit" variant="primary" loading={processing}>
                                Crear workspace
                            </Button>
                        </DialogFooter>
                    </Stack>
                </form>
            </DialogContent>
        </Dialog>
    );
}
