import { Flex, type FlexProps } from '@chakra-ui/react';
import * as React from 'react';
import { KosmoIcon } from './kosmo-icon';

export interface KosmoChipProps extends Omit<FlexProps, 'children'> {
  children: React.ReactNode;
}

const KosmoChip = React.forwardRef<HTMLDivElement, KosmoChipProps>(
  ({ children, ...props }, ref) => (
    <Flex
      ref={ref}
      as="span"
      display="inline-flex"
      alignItems="center"
      gap="1.5"
      px="2.5"
      py="1"
      borderRadius="full"
      bg="kosmo.muted"
      color="kosmo.fg"
      fontSize="xs"
      fontWeight="medium"
      borderWidth="1px"
      borderColor="kosmo.emphasized"
      {...props}
    >
      <KosmoIcon size={14} />
      {children}
    </Flex>
  )
);
KosmoChip.displayName = 'KosmoChip';

export { KosmoChip };
