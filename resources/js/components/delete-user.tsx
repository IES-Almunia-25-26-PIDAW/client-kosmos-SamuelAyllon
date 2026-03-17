import { Form } from '@inertiajs/react';
import { Trash2, AlertTriangle, Lock } from 'lucide-react';
import { useRef } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
        <Card className="shadow-sm border-red-200 dark:border-red-900/50">
            <CardHeader className="border-b border-red-100 bg-red-50/50 pb-4 dark:border-red-900/30 dark:bg-red-900/10">
                <div className="flex items-center gap-2">
                    <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <CardTitle className="text-base font-semibold text-red-800 dark:text-red-200">Eliminar cuenta</CardTitle>
                </div>
                <CardDescription className="text-red-700/80 dark:text-red-300/80">
                    Elimina tu cuenta y todos sus datos de forma permanente
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    {/* Warning Banner */}
                    <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="font-medium text-red-800 dark:text-red-200">Advertencia</p>
                            <p className="text-sm text-red-700 dark:text-red-300">
                                Esta acción es irreversible. Una vez eliminada tu cuenta, todos los datos asociados (tareas, ideas, clientes y recursos) serán eliminados permanentemente.
                            </p>
                        </div>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="destructive"
                                data-test="delete-user-button"
                                className="gap-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                Eliminar mi cuenta
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                </div>
                                <DialogTitle className="text-lg">
                                    ¿Eliminar tu cuenta?
                                </DialogTitle>
                            </div>
                            <DialogDescription className="text-sm">
                                Una vez eliminada tu cuenta, todos los recursos y datos serán eliminados permanentemente. 
                                Introduce tu contraseña para confirmar que deseas eliminar tu cuenta definitivamente.
                            </DialogDescription>

                            <Form
                                {...ProfileController.destroy.form()}
                                options={{
                                    preserveScroll: true,
                                }}
                                onError={() => passwordInput.current?.focus()}
                                resetOnSuccess
                                className="space-y-4 mt-4"
                            >
                                {({ resetAndClearErrors, processing, errors }) => (
                                    <>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="password"
                                                className="flex items-center gap-2 text-sm font-medium"
                                            >
                                                <Lock className="h-4 w-4 text-muted-foreground" />
                                                Contraseña
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
                                        </div>

                                        <DialogFooter className="gap-2 sm:gap-0">
                                            <DialogClose asChild>
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        resetAndClearErrors()
                                                    }
                                                >
                                                    Cancelar
                                                </Button>
                                            </DialogClose>

                                            <Button
                                                variant="destructive"
                                                disabled={processing}
                                                asChild
                                            >
                                                <button
                                                    type="submit"
                                                    data-test="confirm-delete-user-button"
                                                    className="gap-2"
                                                >
                                                    {processing ? (
                                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                    Eliminar cuenta
                                                </button>
                                            </Button>
                                        </DialogFooter>
                                    </>
                                )}
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
}
