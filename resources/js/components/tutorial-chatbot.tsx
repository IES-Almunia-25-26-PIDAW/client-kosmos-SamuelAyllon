import { Box, Flex, Text } from '@chakra-ui/react';
import { router } from '@inertiajs/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type TutorialStep = {
    id: number;
    botMessage: string;
    target?: string;
    icon: string;
    position?: 'right' | 'bottom' | 'left' | 'top';
};

const freeUserSteps: TutorialStep[] = [
    {
        id: 1,
        botMessage: '¡Hola! Soy Kosmo, tu compañero en ClientKosmos. Aquí cada cliente tiene su espacio: tareas, ideas, recursos y contexto, todo junto. Vamos a verlo.',
        icon: '👋',
    },
    {
        id: 2,
        botMessage: 'Este es el Panel «Hoy», tu centro de mando diario. Cada mañana verás qué toca para cada cliente, de un vistazo.',
        target: 'dashboard',
        icon: '📊',
        position: 'right',
    },
    {
        id: 3,
        botMessage: 'En Clientes creas fichas individuales. Cada ficha reúne tareas, notas, documentos y contexto de ese cliente. Con el plan gratuito puedes tener 1 cliente y hasta 5 tareas.',
        target: 'clients',
        icon: '👤',
        position: 'right',
    },
    {
        id: 4,
        botMessage: 'En Tareas organizas lo que necesitas hacer, siempre vinculado a un cliente. Prioridades, fechas y seguimiento.',
        target: 'tasks',
        icon: '✅',
        position: 'right',
    },
    {
        id: 5,
        botMessage: '¿Quieres más? Con el plan Solo tendrás: clientes ilimitados, IA contextual con Kosmo y recursos sin límites.',
        target: 'subscription',
        icon: '⭐',
        position: 'right',
    },
    {
        id: 6,
        botMessage: '¡Eso es todo! Empieza registrando tu primer cliente. Cuando gestiones varios casos, prueba el plan Solo para que Kosmo te ayude a organizarte.',
        icon: '🎉',
    },
];

const premiumUserSteps: TutorialStep[] = [
    {
        id: 1,
        botMessage: '¡Hola! Soy Kosmo, tu compañero en ClientKosmos. Como usuario Solo, tienes acceso completo. Cada cliente tiene su espacio con tareas, ideas y recursos.',
        icon: '👋',
    },
    {
        id: 2,
        botMessage: 'Este es el Panel «Hoy», tu centro de mando diario. Ves tareas prioritarias, clientes en riesgo y puedes pedirme que planifique tu día con IA.',
        target: 'dashboard',
        icon: '📊',
        position: 'right',
    },
    {
        id: 3,
        botMessage: 'En Clientes gestionas cada caso con ficha completa. Usa los botones de IA para que Kosmo resuma el estado o genere un parte de evolución.',
        target: 'clients',
        icon: '👤',
        position: 'right',
    },
    {
        id: 4,
        botMessage: 'En Tareas organizas todo lo que necesitas hacer, siempre vinculado a un cliente. Sin límites, con prioridades y fechas.',
        target: 'tasks',
        icon: '✅',
        position: 'right',
    },
    {
        id: 5,
        botMessage: 'Las Ideas son perfectas para capturar pensamientos sobre tus clientes. Vincúlalas para tener todo el contexto junto.',
        target: 'ideas',
        icon: '💡',
        position: 'right',
    },
    {
        id: 6,
        botMessage: '¡Eso es todo! Empieza creando clientes y cuando tengas varias tareas entre ellos, Kosmo te ayudará a organizar el día.',
        icon: '🎉',
    },
];

type TutorialChatbotProps = {
    show: boolean;
    onComplete: () => void;
    isPremium: boolean;
    userName: string;
};

type TooltipPosition = {
    top: number;
    left: number;
    arrowDirection: 'left' | 'right' | 'top' | 'bottom';
};

export default function TutorialChatbot({ show, onComplete, isPremium, userName }: TutorialChatbotProps) {
    const [isActive, setIsActive] = useState(show);
    const [currentStep, setCurrentStep] = useState(0);
    const [isTyping, setIsTyping] = useState(true);
    const [displayedMessage, setDisplayedMessage] = useState('');
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const tutorialSteps = isPremium ? premiumUserSteps : freeUserSteps;

    const step = tutorialSteps[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === tutorialSteps.length - 1;

    const measureTarget = useCallback(() => {
        if (!step.target) {
            setTargetRect(null);
            setTooltipPosition(null);
            return;
        }

        const element = document.querySelector(`[data-tutorial="${step.target}"]`);
        if (element) {
            const rect = element.getBoundingClientRect();
            setTargetRect(rect);

            const padding = 16;
            const tooltipWidth = 320;
            const tooltipHeight = 200;

            let top = rect.top + rect.height / 2 - tooltipHeight / 2;
            let left = rect.right + padding;
            let arrowDirection: 'left' | 'right' | 'top' | 'bottom' = 'left';

            if (left + tooltipWidth > window.innerWidth - padding) {
                left = rect.left - tooltipWidth - padding;
                arrowDirection = 'right';
            }

            if (top < padding) {
                top = padding;
            } else if (top + tooltipHeight > window.innerHeight - padding) {
                top = window.innerHeight - tooltipHeight - padding;
            }

            setTooltipPosition({ top, left, arrowDirection });
        }
    }, [step.target]);

    useEffect(() => {
        if (!isActive) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        measureTarget();

        window.addEventListener('resize', measureTarget);
        return () => window.removeEventListener('resize', measureTarget);
    }, [isActive, measureTarget, currentStep]);

    useEffect(() => {
        if (!isActive) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsTyping(true);
         
        setDisplayedMessage('');

        const message = currentStep === 0
            ? step.botMessage.replace('¡Hola!', `¡Hola, ${userName}!`)
            : step.botMessage;
        let index = 0;

        const typingInterval = setInterval(() => {
            if (index < message.length) {
                setDisplayedMessage(message.slice(0, index + 1));
                index++;
            } else {
                setIsTyping(false);
                clearInterval(typingInterval);
            }
        }, 20);

        return () => clearInterval(typingInterval);
    }, [currentStep, isActive, step.botMessage, userName]);

    const handleNext = () => {
        if (isLastStep) {
            handleComplete();
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (!isFirstStep) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleComplete = () => {
        setIsActive(false);
        router.post('/tutorial/complete', {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => onComplete(),
        });
    };

    if (!isActive) return null;

    return createPortal(
        <Box position="fixed" inset="0" zIndex="9999">
            <Box as="svg" position="absolute" inset="0" w="full" h="full" pointerEvents="none">
                <defs>
                    <mask id="spotlight-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        {targetRect && (
                            <rect
                                x={targetRect.left - 8}
                                y={targetRect.top - 4}
                                width={targetRect.width + 16}
                                height={targetRect.height + 8}
                                rx="8"
                                fill="black"
                            />
                        )}
                    </mask>
                </defs>
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="rgba(0, 0, 0, 0.75)"
                    mask="url(#spotlight-mask)"
                />
            </Box>

            {targetRect && (
                <Box
                    position="absolute"
                    pointerEvents="none"
                    borderRadius="lg"
                    animation="pulse 2s infinite"
                    style={{
                        top: targetRect.top - 4,
                        left: targetRect.left - 8,
                        width: targetRect.width + 16,
                        height: targetRect.height + 8,
                        boxShadow: '0 0 0 2px var(--ck-colors-bg), 0 0 0 6px var(--ck-colors-brand-solid)',
                    }}
                />
            )}

            <Box
                ref={tooltipRef}
                position="absolute"
                w="80"
                pointerEvents="auto"
                style={
                    tooltipPosition
                        ? { top: tooltipPosition.top, left: tooltipPosition.left }
                        : {
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }
                }
            >
                <Card boxShadow="2xl" borderWidth="2px" borderColor="brand.muted" bg="bg.surface">
                    <Flex alignItems="center" justifyContent="space-between" px="4" pt="4" pb="2">
                        <Flex alignItems="center" gap="2">
                            <Text fontSize="2xl">{step.icon}</Text>
                            <Text fontWeight="semibold" fontSize="sm">Kosmo</Text>
                        </Flex>
                        <Text fontSize="xs" color="fg.muted">
                            {currentStep + 1} / {tutorialSteps.length}
                        </Text>
                    </Flex>

                    <CardContent style={{ paddingTop: 0, paddingBottom: '1rem' }}>
                        <Box bg="bg.muted" borderRadius="lg" p="3" mb="4">
                            <Text fontSize="sm" lineHeight="relaxed">
                                {displayedMessage}
                                {isTyping && <Box as="span" animation="pulse 1s infinite" ml="0.5">|</Box>}
                            </Text>
                        </Box>

                        <Flex justifyContent="center" gap="1.5" mb="4">
                            {tutorialSteps.map((_, index) => (
                                <Box
                                    key={index}
                                    h="1.5"
                                    w={index === currentStep ? '4' : '1.5'}
                                    borderRadius="full"
                                    transition="colors"
                                    bg={
                                        index === currentStep
                                            ? 'brand.solid'
                                            : index < currentStep
                                                ? 'brand.muted'
                                                : 'fg.subtle/30'
                                    }
                                />
                            ))}
                        </Flex>

                        <Flex alignItems="center" justifyContent="space-between">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleComplete}
                                fontSize="xs"
                                color="fg.muted"
                            >
                                Saltar
                            </Button>

                            <Flex gap="2">
                                {!isFirstStep && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handlePrevious}
                                        disabled={isTyping}
                                    >
                                        Anterior
                                    </Button>
                                )}
                                <Button
                                    size="sm"
                                    onClick={handleNext}
                                    disabled={isTyping}
                                >
                                    {isLastStep ? '¡Empezar!' : 'Siguiente'}
                                </Button>
                            </Flex>
                        </Flex>
                    </CardContent>
                </Card>

                {tooltipPosition && tooltipPosition.arrowDirection === 'left' && (
                    <Box
                        position="absolute"
                        w="3"
                        h="3"
                        bg="bg.surface"
                        borderLeftWidth="1px"
                        borderBottomWidth="1px"
                        borderColor="brand.muted"
                        style={{
                            top: '50%',
                            left: -6,
                            transform: 'translateY(-50%) rotate(45deg)',
                        }}
                    />
                )}
                {tooltipPosition && tooltipPosition.arrowDirection === 'right' && (
                    <Box
                        position="absolute"
                        w="3"
                        h="3"
                        bg="bg.surface"
                        borderRightWidth="1px"
                        borderTopWidth="1px"
                        borderColor="brand.muted"
                        style={{
                            top: '50%',
                            right: -6,
                            transform: 'translateY(-50%) rotate(45deg)',
                        }}
                    />
                )}
            </Box>
        </Box>,
        document.body
    );
}
