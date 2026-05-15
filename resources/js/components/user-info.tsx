import { Avatar, Box, Text } from '@chakra-ui/react';
import type { User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    return (
        <>
            <Avatar.Root size="sm" flexShrink={0} colorPalette="brand" variant="solid">
                <Avatar.Image src={user.avatar_path ?? undefined} alt={user.name} />
                <Avatar.Fallback name={user.name} />
            </Avatar.Root>
            <Box
                display="flex"
                flexDirection="column"
                flex="1"
                minW="0"
                textAlign="left"
                fontSize="sm"
                lineHeight="tight"
                css={{ '[data-collapsible=icon] &': { display: 'none' } }}
            >
                <Text truncate fontWeight="medium" maxW="full" m="0">
                    {user.name}
                </Text>
                {showEmail && (
                    <Text truncate fontSize="xs" color="fg.muted" maxW="full" m="0">
                        {user.email}
                    </Text>
                )}
            </Box>
        </>
    );
}
