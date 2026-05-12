import { Box, Text } from '@chakra-ui/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    const getInitials = useInitials();

    return (
        <>
            <Avatar flexShrink={0}>
                <AvatarImage src={user.avatar_path ?? undefined} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
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
                <Text truncate fontWeight="medium" maxW="full">
                    {user.name}
                </Text>
                {showEmail && (
                    <Text truncate fontSize="xs" color="fg.muted" maxW="full">
                        {user.email}
                    </Text>
                )}
            </Box>
        </>
    );
}
