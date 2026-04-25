import { Box, Flex, Stack, Text, chakra } from '@chakra-ui/react';

const ChakraButton = chakra('button');
const ChakraInput = chakra('input');
import { Form } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Check, Copy, ScanLine } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { useAppearance } from '@/hooks/use-appearance';
import { useClipboard } from '@/hooks/use-clipboard';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import { confirm } from '@/routes/two-factor';
import AlertError from './alert-error';
import { Spinner } from './ui/spinner';

function GridScanIcon() {
    return (
        <Box
            mb="3"
            borderRadius="full"
            borderWidth="1px"
            borderColor="border"
            bg="card"
            p="0.5"
            shadow="sm"
        >
            <Box
                position="relative"
                overflow="hidden"
                borderRadius="full"
                borderWidth="1px"
                borderColor="border"
                bg="bg.muted"
                p="2.5"
            >
                <Box position="absolute" inset="0" display="grid" gridTemplateColumns="repeat(5, 1fr)" opacity={0.5}>
                    {Array.from({ length: 5 }, (_, i) => (
                        <Box
                            key={`col-${i + 1}`}
                            borderRightWidth="1px"
                            borderColor="border"
                            _last={{ borderRightWidth: 0 }}
                        />
                    ))}
                </Box>
                <Box position="absolute" inset="0" display="grid" gridTemplateRows="repeat(5, 1fr)" opacity={0.5}>
                    {Array.from({ length: 5 }, (_, i) => (
                        <Box
                            key={`row-${i + 1}`}
                            borderBottomWidth="1px"
                            borderColor="border"
                            _last={{ borderBottomWidth: 0 }}
                        />
                    ))}
                </Box>
                <ScanLine
                    size={24}
                    style={{ position: 'relative', zIndex: 20, color: 'var(--ck-colors-fg)' }}
                />
            </Box>
        </Box>
    );
}

function TwoFactorSetupStep({
    qrCodeSvg,
    manualSetupKey,
    buttonText,
    onNextStep,
    errors,
}: {
    qrCodeSvg: string | null;
    manualSetupKey: string | null;
    buttonText: string;
    onNextStep: () => void;
    errors: string[];
}) {
    const { resolvedAppearance } = useAppearance();
    const [copiedText, copy] = useClipboard();
    const IconComponent = copiedText === manualSetupKey ? Check : Copy;

    return (
        <>
            {errors?.length ? (
                <AlertError errors={errors} />
            ) : (
                <>
                    <Flex mx="auto" maxW="md" overflow="hidden">
                        <Box
                            mx="auto"
                            aspectRatio="1"
                            w="64"
                            borderRadius="lg"
                            borderWidth="1px"
                            borderColor="border"
                        >
                            <Flex
                                zIndex="10"
                                h="full"
                                w="full"
                                alignItems="center"
                                justifyContent="center"
                                p="5"
                            >
                                {qrCodeSvg ? (
                                    <Box
                                        aspectRatio="1"
                                        w="full"
                                        borderRadius="lg"
                                        bg="white"
                                        p="2"
                                        css={{ '& svg': { width: '100%', height: '100%' } }}
                                        dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
                                        style={{
                                            filter:
                                                resolvedAppearance === 'dark'
                                                    ? 'invert(1) brightness(1.5)'
                                                    : undefined,
                                        }}
                                    />
                                ) : (
                                    <Spinner />
                                )}
                            </Flex>
                        </Box>
                    </Flex>

                    <Flex w="full" gap="5">
                        <Button w="full" onClick={onNextStep}>
                            {buttonText}
                        </Button>
                    </Flex>

                    <Flex position="relative" w="full" alignItems="center" justifyContent="center">
                        <Box position="absolute" inset="0" top="50%" h="px" w="full" bg="border" />
                        <Text as="span" position="relative" bg="card" px="2" py="1">
                            or, enter the code manually
                        </Text>
                    </Flex>

                    <Flex w="full" gap="2">
                        <Flex
                            w="full"
                            alignItems="stretch"
                            overflow="hidden"
                            borderRadius="xl"
                            borderWidth="1px"
                            borderColor="border"
                        >
                            {!manualSetupKey ? (
                                <Flex h="full" w="full" alignItems="center" justifyContent="center" bg="bg.muted" p="3">
                                    <Spinner />
                                </Flex>
                            ) : (
                                <>
                                    <ChakraInput
                                        type="text"
                                        readOnly
                                        value={manualSetupKey}
                                        h="full"
                                        w="full"
                                        bg="bg"
                                        p="3"
                                        color="fg"
                                        outline="none"
                                    />
                                    <ChakraButton
                                        type="button"
                                        onClick={() => copy(manualSetupKey)}
                                        borderLeftWidth="1px"
                                        borderColor="border"
                                        px="3"
                                        bg="transparent"
                                        cursor="pointer"
                                        _hover={{ bg: 'bg.muted' }}
                                    >
                                        <IconComponent size={16} />
                                    </ChakraButton>
                                </>
                            )}
                        </Flex>
                    </Flex>
                </>
            )}
        </>
    );
}

function TwoFactorVerificationStep({
    onClose,
    onBack,
}: {
    onClose: () => void;
    onBack: () => void;
}) {
    const [code, setCode] = useState<string>('');
    const pinInputContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => {
            pinInputContainerRef.current?.querySelector('input')?.focus();
        }, 0);
    }, []);

    return (
        <Form
            {...confirm.form()}
            onSuccess={() => onClose()}
            resetOnError
            resetOnSuccess
        >
            {({
                processing,
                errors,
            }: {
                processing: boolean;
                errors?: { confirmTwoFactorAuthentication?: { code?: string } };
            }) => (
                <Box ref={pinInputContainerRef} position="relative" w="full">
                    <Stack gap="3">
                        <Stack gap="3" w="full" alignItems="center" py="2">
                            <InputOTP
                                id="otp"
                                name="code"
                                maxLength={OTP_MAX_LENGTH}
                                onChange={setCode}
                                disabled={processing}
                                pattern={REGEXP_ONLY_DIGITS}
                            >
                                <InputOTPGroup>
                                    {Array.from(
                                        { length: OTP_MAX_LENGTH },
                                        (_, index) => (
                                            <InputOTPSlot
                                                key={index}
                                                index={index}
                                            />
                                        ),
                                    )}
                                </InputOTPGroup>
                            </InputOTP>
                            <InputError
                                message={errors?.confirmTwoFactorAuthentication?.code}
                            />
                        </Stack>

                        <Flex w="full" gap="5">
                            <Button
                                type="button"
                                variant="outline"
                                flex="1"
                                onClick={onBack}
                                disabled={processing}
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                flex="1"
                                disabled={processing || code.length < OTP_MAX_LENGTH}
                            >
                                Confirm
                            </Button>
                        </Flex>
                    </Stack>
                </Box>
            )}
        </Form>
    );
}

type Props = {
    isOpen: boolean;
    onClose: () => void;
    requiresConfirmation: boolean;
    twoFactorEnabled: boolean;
    qrCodeSvg: string | null;
    manualSetupKey: string | null;
    clearSetupData: () => void;
    fetchSetupData: () => Promise<void>;
    errors: string[];
};

export default function TwoFactorSetupModal({
    isOpen,
    onClose,
    requiresConfirmation,
    twoFactorEnabled,
    qrCodeSvg,
    manualSetupKey,
    clearSetupData,
    fetchSetupData,
    errors,
}: Props) {
    const [showVerificationStep, setShowVerificationStep] =
        useState<boolean>(false);

    const modalConfig = useMemo<{
        title: string;
        description: string;
        buttonText: string;
    }>(() => {
        if (twoFactorEnabled) {
            return {
                title: 'Two-Factor Authentication Enabled',
                description:
                    'Two-factor authentication is now enabled. Scan the QR code or enter the setup key in your authenticator app.',
                buttonText: 'Close',
            };
        }

        if (showVerificationStep) {
            return {
                title: 'Verify Authentication Code',
                description:
                    'Enter the 6-digit code from your authenticator app',
                buttonText: 'Continue',
            };
        }

        return {
            title: 'Enable Two-Factor Authentication',
            description:
                'To finish enabling two-factor authentication, scan the QR code or enter the setup key in your authenticator app',
            buttonText: 'Continue',
        };
    }, [twoFactorEnabled, showVerificationStep]);

    const handleModalNextStep = useCallback(() => {
        if (requiresConfirmation) {
            setShowVerificationStep(true);
            return;
        }

        clearSetupData();
        onClose();
    }, [requiresConfirmation, clearSetupData, onClose]);

    const resetModalState = useCallback(() => {
        setShowVerificationStep(false);

        if (twoFactorEnabled) {
            clearSetupData();
        }
    }, [twoFactorEnabled, clearSetupData]);

    useEffect(() => {
        if (isOpen && !qrCodeSvg) {
            fetchSetupData();
        }
    }, [isOpen, qrCodeSvg, fetchSetupData]);

    const handleClose = useCallback(() => {
        resetModalState();
        onClose();
    }, [onClose, resetModalState]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent maxW={{ sm: 'md' }}>
                <DialogHeader>
                    <Flex direction="column" alignItems="center" justifyContent="center">
                        <GridScanIcon />
                        <DialogTitle>{modalConfig.title}</DialogTitle>
                        <DialogDescription textAlign="center">
                            {modalConfig.description}
                        </DialogDescription>
                    </Flex>
                </DialogHeader>

                <Stack alignItems="center" gap="5">
                    {showVerificationStep ? (
                        <TwoFactorVerificationStep
                            onClose={onClose}
                            onBack={() => setShowVerificationStep(false)}
                        />
                    ) : (
                        <TwoFactorSetupStep
                            qrCodeSvg={qrCodeSvg}
                            manualSetupKey={manualSetupKey}
                            buttonText={modalConfig.buttonText}
                            onNextStep={handleModalNextStep}
                            errors={errors}
                        />
                    )}
                </Stack>
            </DialogContent>
        </Dialog>
    );
}
