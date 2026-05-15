import { Box, Flex, Grid, Stack, Text } from '@chakra-ui/react';
import { Form } from '@inertiajs/react';
import { Eye, EyeOff, LockKeyhole, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { regenerateRecoveryCodes } from '@/routes/two-factor';
import AlertError from './alert-error';

type Props = {
    recoveryCodesList: string[];
    fetchRecoveryCodes: () => Promise<void>;
    errors: string[];
};

export default function TwoFactorRecoveryCodes({
    recoveryCodesList,
    fetchRecoveryCodes,
    errors,
}: Props) {
    const [codesAreVisible, setCodesAreVisible] = useState<boolean>(false);
    const codesSectionRef = useRef<HTMLDivElement | null>(null);
    const canRegenerateCodes = recoveryCodesList.length > 0 && codesAreVisible;

    const toggleCodesVisibility = useCallback(async () => {
        if (!codesAreVisible && !recoveryCodesList.length) {
            await fetchRecoveryCodes();
        }

        setCodesAreVisible(!codesAreVisible);

        if (!codesAreVisible) {
            setTimeout(() => {
                codesSectionRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            });
        }
    }, [codesAreVisible, recoveryCodesList.length, fetchRecoveryCodes]);

    useEffect(() => {
        if (!recoveryCodesList.length) {
            fetchRecoveryCodes();
        }
    }, [recoveryCodesList.length, fetchRecoveryCodes]);

    const RecoveryCodeIconComponent = codesAreVisible ? EyeOff : Eye;

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Flex gap="3" alignItems="center">
                        <LockKeyhole size={16} aria-hidden="true" />
                        2FA Recovery Codes
                    </Flex>
                </CardTitle>
                <CardDescription>
                    Recovery codes let you regain access if you lose your 2FA
                    device. Store them in a secure password manager.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Flex
                    direction={{ base: 'column', sm: 'row' }}
                    align={{ base: 'stretch', sm: 'center' }}
                    justify="space-between"
                    gap="3"
                    userSelect="none"
                >
                    <Button
                        onClick={toggleCodesVisibility}
                        w="fit-content"
                        aria-expanded={codesAreVisible}
                        aria-controls="recovery-codes-section"
                    >
                        <RecoveryCodeIconComponent
                            size={16}
                            aria-hidden="true"
                        />
                        {codesAreVisible ? 'Hide' : 'View'} Recovery Codes
                    </Button>

                    {canRegenerateCodes && (
                        <Form
                            {...regenerateRecoveryCodes.form()}
                            options={{ preserveScroll: true }}
                            onSuccess={fetchRecoveryCodes}
                        >
                            {({ processing }) => (
                                <Button
                                    variant="secondary"
                                    type="submit"
                                    disabled={processing}
                                    aria-describedby="regenerate-warning"
                                >
                                    <RefreshCw size={16} /> Regenerate Codes
                                </Button>
                            )}
                        </Form>
                    )}
                </Flex>
                <Box
                    id="recovery-codes-section"
                    position="relative"
                    overflow="hidden"
                    height={codesAreVisible ? 'auto' : '0'}
                    opacity={codesAreVisible ? 1 : 0}
                    css={{ transition: 'all 300ms ease' }}
                    aria-hidden={!codesAreVisible}
                >
                    <Stack gap="3" mt="3">
                        {errors?.length ? (
                            <AlertError errors={errors} />
                        ) : (
                            <>
                                <Grid
                                    ref={codesSectionRef}
                                    gap="1"
                                    borderRadius="lg"
                                    bg="bg.muted"
                                    p="4"
                                    fontFamily="mono"
                                    fontSize="sm"
                                    role="list"
                                    aria-label="Recovery codes"
                                >
                                    {recoveryCodesList.length ? (
                                        recoveryCodesList.map((code, index) => (
                                            <Box
                                                key={index}
                                                role="listitem"
                                                userSelect="text"
                                            >
                                                {code}
                                            </Box>
                                        ))
                                    ) : (
                                        <Stack gap="2" aria-label="Loading recovery codes">
                                            {Array.from({ length: 8 }, (_, index) => (
                                                <Box
                                                    key={index}
                                                    h="4"
                                                    borderRadius="sm"
                                                    bg="fg.muted/20"
                                                    css={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
                                                    aria-hidden="true"
                                                />
                                            ))}
                                        </Stack>
                                    )}
                                </Grid>

                                <Text fontSize="xs" color="fg.muted" userSelect="none">
                                    <Box as="span" id="regenerate-warning">
                                        Each recovery code can be used once to
                                        access your account and will be removed
                                        after use. If you need more, click{' '}
                                        <Box as="span" fontWeight="bold">
                                            Regenerate Codes
                                        </Box>{' '}
                                        above.
                                    </Box>
                                </Text>
                            </>
                        )}
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}
