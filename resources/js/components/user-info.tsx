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
            <Avatar>
                <AvatarImage src={user.avatar_path ?? undefined} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <Box
                display="grid"
                flex="1"
                textAlign="left"
                fontSize="sm"
                lineHeight="tight"
            >
                <Text truncate fontWeight="medium">
                    {user.name}
                </Text>
                {showEmail && (
                    <Text truncate fontSize="xs" color="fg.muted">
                        {user.email}
                    </Text>
                )}
            </Box>
        </>
    );
}
