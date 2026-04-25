import { Badge, Box, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { useEcho } from '@laravel/echo-react';
import { useEffect, useRef, useState } from 'react';

interface Segment {
    segment_id: number;
    speaker_user_id: number | null;
    position: number;
    started_at_ms: number;
    ended_at_ms: number;
    text: string;
}

interface Props {
    appointmentId: number;
    professionalId: number;
    patientId: number;
}

const formatOffset = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export function LiveTranscriptPanel({ appointmentId, professionalId, patientId }: Props) {
    const [segments, setSegments] = useState<Segment[]>([]);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEcho<Segment>(
        `appointment.${appointmentId}`,
        '.transcription.segment.created',
        (payload) => {
            setSegments((prev) => {
                if (prev.some((s) => s.segment_id === payload.segment_id)) return prev;
                return [...prev, payload].sort((a, b) => a.started_at_ms - b.started_at_ms);
            });
        },
    );

    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [segments]);

    return (
        <Stack
            h="100%"
            w={{ base: '100%', lg: '320px' }}
            bg="bg.surface"
            borderLeftWidth="1px"
            borderColor="border.subtle"
            gap="0"
        >
            <Box p="4" borderBottomWidth="1px" borderColor="border.subtle">
                <Flex alignItems="center" gap="2">
                    <Box w="2" h="2" borderRadius="full" bg="brand.solid" animation="pulse 1.4s ease-in-out infinite" />
                    <Heading as="h2" fontSize="sm" fontWeight="semibold" color="fg">
                        Transcripción en vivo
                    </Heading>
                </Flex>
                <Text fontSize="xs" color="fg.muted" mt="1">
                    Generada automáticamente. Revisable al finalizar.
                </Text>
            </Box>

            <Box ref={scrollRef} flex="1" overflowY="auto" p="4">
                {segments.length === 0 ? (
                    <Text fontSize="sm" color="fg.subtle" textAlign="center" mt="8">
                        Esperando audio…
                    </Text>
                ) : (
                    <Stack gap="3">
                        {segments.map((seg) => {
                            const isProfessional = seg.speaker_user_id === professionalId;
                            const isPatient = seg.speaker_user_id === patientId;
                            const speakerLabel = isProfessional ? 'Tú' : isPatient ? 'Paciente' : 'Desconocido';
                            const palette = isProfessional ? 'brand' : 'gray';
                            return (
                                <Stack key={seg.segment_id} gap="1">
                                    <Flex gap="2" alignItems="center">
                                        <Badge colorPalette={palette} size="sm" variant="subtle">
                                            {speakerLabel}
                                        </Badge>
                                        <Text fontSize="xs" color="fg.subtle">
                                            {formatOffset(seg.started_at_ms)}
                                        </Text>
                                    </Flex>
                                    <Text fontSize="sm" color="fg">
                                        {seg.text}
                                    </Text>
                                </Stack>
                            );
                        })}
                    </Stack>
                )}
            </Box>
        </Stack>
    );
}
