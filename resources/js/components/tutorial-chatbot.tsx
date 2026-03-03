import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type TutorialStep = {
    id: number;
    botMessage: string;
    target?: string; // data-tutorial selector
    icon: string;
    position?: 'right' | 'bottom' | 'left' | 'top';
};

// Pasos para usuarios FREE — promociona Premium
const freeUserSteps: TutorialStep[] = [
    {
        id: 1,
        botMessage: '¡Hola! Soy Flowy, tu asistente personal. Te voy a enseñar cómo usar Flowly para organizar tu productividad. ¿Empezamos?',
        icon: '👋',
    },
    {
        id: 2,
        botMessage: 'Este es el Dashboard, tu centro de control. Aquí verás un resumen de tu actividad: tareas pendientes e ideas activas.',
        target: 'dashboard',
        icon: '📊',
        position: 'right',
    },
    {
        id: 3,
        botMessage: 'En Tareas puedes organizar lo que necesitas hacer. Con el plan gratuito puedes tener hasta 5 tareas pendientes a la vez.',
        target: 'tasks',
        icon: '✅',
        position: 'right',
    },
    {
        id: 4,
        botMessage: 'Las Ideas son perfectas para capturar inspiración al vuelo. ¡Sin límites! Guarda aquí todo lo que se te ocurra.',
        target: 'ideas',
        icon: '💡',
        position: 'right',
    },
    {
        id: 5,
        botMessage: '¿Quieres más? Con Premium tendrás: tareas ilimitadas, Proyectos para organizar trabajo grande, Cajas para guardar recursos, ¡y dictado por voz!',
        target: 'subscription',
        icon: '⭐',
        position: 'right',
    },
    {
        id: 6,
        botMessage: '¡Eso es todo! Explora Flowly y cuando estés listo, considera Premium para desbloquear todo el potencial. ¡Buena suerte!',
        icon: '🎉',
    },
];

// Pasos para usuarios PREMIUM — explica las funciones premium
const premiumUserSteps: TutorialStep[] = [
    {
        id: 1,
        botMessage: '¡Hola! Soy Flowy, tu asistente personal. Como usuario Premium, tienes acceso a todas las funciones. ¡Te las muestro!',
        icon: '👋',
    },
    {
        id: 2,
        botMessage: 'Este es el Dashboard, tu centro de control. Aquí verás un resumen completo: tareas, ideas y proyectos activos.',
        target: 'dashboard',
        icon: '📊',
        position: 'right',
    },
    {
        id: 3,
        botMessage: 'En Tareas puedes organizar todo lo que necesitas hacer. ¡Sin límites! Usa el botón "Dictar" para crear tareas con tu voz.',
        target: 'tasks',
        icon: '✅',
        position: 'right',
    },
    {
        id: 4,
        botMessage: 'Las Ideas son perfectas para capturar inspiración. También puedes dictarlas por voz. Las creadas así se marcan con origen "Voz".',
        target: 'ideas',
        icon: '💡',
        position: 'right',
    },
    {
        id: 5,
        botMessage: 'Los Proyectos te permiten agrupar tareas relacionadas. Asigna un color, ve el progreso y mantén todo organizado.',
        target: 'projects',
        icon: '📁',
        position: 'right',
    },
    {
        id: 6,
        botMessage: 'Las Cajas son colecciones de recursos: enlaces, documentos, vídeos, imágenes... Organiza todo el material de tus proyectos.',
        target: 'boxes',
        icon: '📦',
        position: 'right',
    },
    {
        id: 7,
        botMessage: 'El Asistente IA es tu copiloto de productividad. Pregúntale cómo priorizar tareas, organizar tu día o cualquier duda sobre gestión del tiempo.',
        target: 'ai-chats',
        icon: '✨',
        position: 'right',
    },
    {
        id: 8,
        botMessage: '¡Eso es todo! Tienes acceso completo a Flowly. Explora cada sección y aprovecha el dictado por voz. ¡Buena productividad!',
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

    // Seleccionar pasos según el tipo de usuario y personalizar con el nombre
    const tutorialSteps = isPremium ? premiumUserSteps : freeUserSteps;
    
    // Personalizar el mensaje de bienvenida con el nombre del usuario
    const getPersonalizedMessage = (message: string) => {
        if (currentStep === 0) {
            return message.replace('¡Hola!', `¡Hola, ${userName}!`);
        }
        return message;
    };

    const step = tutorialSteps[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === tutorialSteps.length - 1;

    // Función para encontrar y medir el elemento objetivo
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

            // Calcular posición del tooltip
            const padding = 16;
            const tooltipWidth = 320;
            const tooltipHeight = 200;

            let top = rect.top + rect.height / 2 - tooltipHeight / 2;
            let left = rect.right + padding;
            let arrowDirection: 'left' | 'right' | 'top' | 'bottom' = 'left';

            // Ajustar si se sale de la pantalla
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

    // Medir elemento cuando cambia el paso
    useEffect(() => {
        if (!isActive) return;

        measureTarget();

        // Re-medir en resize
        window.addEventListener('resize', measureTarget);
        return () => window.removeEventListener('resize', measureTarget);
    }, [isActive, measureTarget, currentStep]);

    // Efecto de escritura del bot
    useEffect(() => {
        if (!isActive) return;

        setIsTyping(true);
        setDisplayedMessage('');

        const message = getPersonalizedMessage(step.botMessage);
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

    // Renderizar en portal para estar encima de todo
    return createPortal(
        <div className="fixed inset-0 z-[9999]">
            {/* Overlay con spotlight */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                    <mask id="spotlight-mask">
                        {/* Fondo blanco = visible, negro = agujero */}
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
            </svg>

            {/* Borde brillante alrededor del elemento */}
            {targetRect && (
                <div
                    className="absolute pointer-events-none rounded-lg ring-4 ring-primary ring-offset-2 ring-offset-background animate-pulse"
                    style={{
                        top: targetRect.top - 4,
                        left: targetRect.left - 8,
                        width: targetRect.width + 16,
                        height: targetRect.height + 8,
                    }}
                />
            )}

            {/* Tooltip del chatbot */}
            <div
                ref={tooltipRef}
                className="absolute w-80 pointer-events-auto"
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
                <Card className="shadow-2xl border-2 border-primary/20 bg-card">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 pt-4 pb-2">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{step.icon}</span>
                            <span className="font-semibold text-sm">Flowy</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {currentStep + 1} / {tutorialSteps.length}
                        </span>
                    </div>

                    {/* Content */}
                    <CardContent className="pt-0 pb-4">
                        <div className="bg-muted/50 rounded-lg p-3 mb-4">
                            <p className="text-sm leading-relaxed">
                                {displayedMessage}
                                {isTyping && <span className="animate-pulse ml-0.5">|</span>}
                            </p>
                        </div>

                        {/* Progress dots */}
                        <div className="flex justify-center gap-1.5 mb-4">
                            {tutorialSteps.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                                        index === currentStep
                                            ? 'bg-primary w-4'
                                            : index < currentStep
                                            ? 'bg-primary/50'
                                            : 'bg-muted-foreground/30'
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleComplete}
                                className="text-xs text-muted-foreground hover:text-foreground"
                            >
                                Saltar
                            </Button>

                            <div className="flex gap-2">
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
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Flecha apuntando al elemento */}
                {tooltipPosition && tooltipPosition.arrowDirection === 'left' && (
                    <div
                        className="absolute w-3 h-3 bg-card border-l border-b border-primary/20 rotate-45"
                        style={{
                            top: '50%',
                            left: -6,
                            transform: 'translateY(-50%) rotate(45deg)',
                        }}
                    />
                )}
                {tooltipPosition && tooltipPosition.arrowDirection === 'right' && (
                    <div
                        className="absolute w-3 h-3 bg-card border-r border-t border-primary/20 rotate-45"
                        style={{
                            top: '50%',
                            right: -6,
                            transform: 'translateY(-50%) rotate(45deg)',
                        }}
                    />
                )}
            </div>
        </div>,
        document.body
    );
}
