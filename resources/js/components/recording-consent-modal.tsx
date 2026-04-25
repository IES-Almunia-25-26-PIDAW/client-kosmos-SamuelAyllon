import { Button, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import axios from '@/lib/axios';

interface Props {
    appointmentId: number;
    open: boolean;
    onAccepted: () => void;
    onDeclined: () => void;
}

export function RecordingConsentModal({ appointmentId, open, onAccepted, onDeclined }: Props) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAccept = async () => {
        setSubmitting(true);
        setError(null);
        try {
            await axios.post(`/patient/appointments/${appointmentId}/recording-consent`);
            onAccepted();
        } catch {
            setError('No se pudo registrar el consentimiento. Inténtalo de nuevo.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} closeOnInteractOutside={false} closeOnEscape={false}>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Consentimiento de transcripción</DialogTitle>
                    <DialogDescription>
                        Antes de empezar la sesión, necesitamos tu permiso para transcribir el audio.
                    </DialogDescription>
                </DialogHeader>

                <Stack gap="3" fontSize="sm" color="fg.muted">
                    <Text>
                        Para que tu profesional pueda apoyarse en un resumen automático tras la sesión, transcribimos el audio a texto en tiempo real usando un servicio externo de IA (Groq Whisper).
                    </Text>
                    <Text>
                        El audio se procesa en fragmentos de pocos segundos y se descarta inmediatamente después de transcribir; <strong>no se almacena ninguna grabación de audio</strong>. La transcripción y el resumen quedan asociados a tu historia clínica con el profesional.
                    </Text>
                    <Text>
                        Puedes rechazarlo: la videoconsulta funcionará igual, pero sin transcripción ni resumen automático. Tu consentimiento es revocable contactando con tu profesional.
                    </Text>
                </Stack>

                {error && (
                    <Text fontSize="sm" color="danger.fg" role="alert">
                        {error}
                    </Text>
                )}

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onDeclined}
                        disabled={submitting}
                    >
                        No, continuar sin transcripción
                    </Button>
                    <Button
                        type="button"
                        colorPalette="brand"
                        onClick={handleAccept}
                        loading={submitting}
                    >
                        Sí, autorizo la transcripción
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
