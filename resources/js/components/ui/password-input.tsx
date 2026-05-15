import { Box, IconButton } from '@chakra-ui/react';
import type { InputProps } from '@chakra-ui/react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';
import { Input } from './input';

type PasswordInputProps = Omit<InputProps, 'type'>;

function PasswordInput({ ...inputProps }: PasswordInputProps) {
    const [visible, setVisible] = useState(false);

    return (
        <Box position="relative">
            <Box
                as={Lock}
                aria-hidden="true"
                position="absolute"
                left="4"
                top="50%"
                transform="translateY(-50%)"
                h="4"
                w="4"
                color="fg.muted"
                opacity={0.6}
                zIndex={1}
                pointerEvents="none"
            />
            <Input
                type={visible ? 'text' : 'password'}
                pl="10"
                {...inputProps}
            />
            <IconButton
                aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                size="sm"
                variant="ghost"
                position="absolute"
                right="1"
                top="50%"
                transform="translateY(-50%)"
                zIndex={1}
                tabIndex={-1}
                onClick={() => setVisible((v) => !v)}
                color="fg.muted"
                _hover={{ bg: 'bg.muted' }}
            >
                {visible ? <EyeOff size={16} /> : <Eye size={16} />}
            </IconButton>
        </Box>
    );
}

export { PasswordInput };
