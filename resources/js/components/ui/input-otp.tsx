import { Box, chakra } from '@chakra-ui/react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { Minus } from 'lucide-react';
import * as React from 'react';

const StyledOTPInput = chakra(OTPInput, {
    base: {
        '&:disabled': { cursor: 'not-allowed' },
    },
});

const InputOTP = React.forwardRef<
    React.ElementRef<typeof OTPInput>,
    React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ containerClassName, ...props }, ref) => (
    <StyledOTPInput
        ref={ref}
        containerClassName={
            'input-otp-container ' + (containerClassName ?? '')
        }
        {...props}
    />
));
InputOTP.displayName = 'InputOTP';

const InputOTPGroup = React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
>((props, ref) => (
    <Box
        ref={ref}
        display="flex"
        alignItems="center"
        {...props}
    />
));
InputOTPGroup.displayName = 'InputOTPGroup';

const InputOTPSlot = React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'> & { index: number }
>(({ index, ...props }, ref) => {
    const inputOTPContext = React.useContext(OTPInputContext);
    const slot = inputOTPContext?.slots[index];
    const char = slot?.char;
    const hasFakeCaret = slot?.hasFakeCaret;
    const isActive = slot?.isActive;

    return (
        <Box
            ref={ref}
            data-slot="input-otp-slot"
            data-active={isActive ? 'true' : undefined}
            position="relative"
            display="flex"
            h="9"
            w="9"
            alignItems="center"
            justifyContent="center"
            borderTopWidth="1px"
            borderBottomWidth="1px"
            borderRightWidth="1px"
            borderColor="border"
            color="fg"
            fontSize="sm"
            shadow="sm"
            transition="all"
            _first={{
                borderLeftWidth: '1px',
                borderTopLeftRadius: 'md',
                borderBottomLeftRadius: 'md',
            }}
            _last={{
                borderTopRightRadius: 'md',
                borderBottomRightRadius: 'md',
            }}
            css={
                isActive
                    ? {
                          zIndex: 10,
                          outline: '1px solid var(--chakra-colors-brand-solid)',
                      }
                    : undefined
            }
            {...props}
        >
            {char}
            {hasFakeCaret && (
                <Box
                    pointerEvents="none"
                    position="absolute"
                    inset="0"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Box
                        h="4"
                        w="px"
                        bg="fg"
                        animation="caret-blink 1s infinite"
                    />
                </Box>
            )}
        </Box>
    );
});
InputOTPSlot.displayName = 'InputOTPSlot';

const InputOTPSeparator = React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
>((props, ref) => (
    <div ref={ref} role="separator" {...props}>
        <Minus />
    </div>
));
InputOTPSeparator.displayName = 'InputOTPSeparator';

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
