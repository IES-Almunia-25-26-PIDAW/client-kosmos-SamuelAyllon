import { Box, Flex, Text, chakra, type BoxProps } from '@chakra-ui/react';

const ChakraButton = chakra('button');
import { Sparkles, X } from 'lucide-react';
import type { ReactNode } from 'react';
import React from 'react';

export interface KosmoBriefingProps extends Omit<BoxProps, 'content'> {
    title?: string;
    content?: ReactNode;
    actions?: React.ReactNode;
    onDismiss?: () => void;
    isDismissible?: boolean;
}

export const KosmoBriefing = React.forwardRef<HTMLDivElement, KosmoBriefingProps>(
    ({ title, content, actions, onDismiss, isDismissible = !!onDismiss, ...boxProps }, ref) => {
        const [dismissed, setDismissed] = React.useState(false);

        const handleDismiss = () => {
            setDismissed(true);
            onDismiss?.();
        };

        if (dismissed) return null;

        return (
            <Box
                ref={ref}
                borderRadius="lg"
                borderWidth="1px"
                borderColor="kosmo.emphasized"
                bg="kosmo.muted"
                p="4"
                {...boxProps}
            >
                <Flex align="start" justify="space-between" gap="3">
                    <Flex align="start" gap="3" flex="1">
                        <Sparkles
                            size={18}
                            color="var(--ck-colors-kosmo-fg)"
                            style={{ flexShrink: 0, marginTop: '2px' }}
                        />
                        <Box flex="1" minW="0">
                            {title && (
                                <Text fontSize="sm" fontWeight="medium" color="fg.DEFAULT" mb="1">
                                    {title}
                                </Text>
                            )}
                            {content && (
                                <Box fontSize="sm" color="fg.muted">
                                    {content}
                                </Box>
                            )}
                        </Box>
                    </Flex>
                    {isDismissible && (
                        <ChakraButton
                            type="button"
                            onClick={handleDismiss}
                            display="inline-flex"
                            alignItems="center"
                            justifyContent="center"
                            p="1"
                            bg="transparent"
                            border="none"
                            borderRadius="sm"
                            cursor="pointer"
                            flexShrink={0}
                            _hover={{ bg: 'kosmo.emphasized' }}
                            css={{ transition: 'background-color 200ms ease' }}
                            aria-label="Descartar"
                        >
                            <X size={14} color="var(--ck-colors-fg-muted)" />
                        </ChakraButton>
                    )}
                </Flex>
                {actions && (
                    <Flex mt="3" gap="2">
                        {actions}
                    </Flex>
                )}
            </Box>
        );
    }
);

KosmoBriefing.displayName = 'KosmoBriefing';
