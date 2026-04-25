import { Box, Flex, chakra, type FlexProps } from '@chakra-ui/react';

const ChakraButton = chakra('button');
import { X } from 'lucide-react';
import * as React from 'react';
import { KosmoIcon } from './kosmo-icon';

export interface KosmoNudgeProps extends Omit<FlexProps, 'children'> {
  message: React.ReactNode;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const KosmoNudge = React.forwardRef<HTMLDivElement, KosmoNudgeProps>(
  ({ message, onDismiss, action, ...props }, ref) => (
    <Flex
      ref={ref}
      display="inline-flex"
      alignItems="center"
      gap="2"
      px="3"
      py="2"
      borderRadius="md"
      bg="kosmo.muted"
      borderWidth="1px"
      borderColor="kosmo.emphasized"
      fontSize="sm"
      color="fg.muted"
      {...props}
    >
      <KosmoIcon size={16} style={{ flexShrink: 0 }} />
      <Box flex="1">{message}</Box>
      {action && (
        <ChakraButton
          type="button"
          onClick={action.onClick}
          flexShrink={0}
          ml="2"
          fontWeight="medium"
          color="kosmo.fg"
          bg="transparent"
          border="none"
          cursor="pointer"
          _hover={{ textDecoration: 'underline' }}
        >
          {action.label}
        </ChakraButton>
      )}
      {onDismiss && (
        <ChakraButton
          type="button"
          onClick={onDismiss}
          flexShrink={0}
          p="0.5"
          borderRadius="sm"
          bg="transparent"
          border="none"
          cursor="pointer"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          _hover={{ bg: 'kosmo.emphasized' }}
          css={{ transition: 'background-color 200ms ease' }}
          aria-label="Dismiss"
        >
          <X size={12} />
        </ChakraButton>
      )}
    </Flex>
  )
);
KosmoNudge.displayName = 'KosmoNudge';

export { KosmoNudge };
