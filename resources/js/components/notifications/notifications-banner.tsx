import { Box, CloseButton, Flex, Icon, Stack, Text } from '@chakra-ui/react';
import { router, usePage } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { read as markRead } from '@/routes/notifications';

type NotificationData = {
    type?: string;
    message?: string;
    [key: string]: unknown;
};

type NotificationItem = {
    id: string;
    type: string;
    data: NotificationData;
    read_at: string | null;
    created_at: string;
};

type NotificationsShare = {
    unread_count: number;
    recent: NotificationItem[];
};

type PageProps = {
    notifications?: NotificationsShare;
};

const TYPE_PROFESSIONAL_APPROVED = 'professional_approved';

export function NotificationsBanner() {
    const { notifications } = usePage<PageProps>().props;

    const banner = notifications?.recent?.find(
        (n) => n.read_at === null && n.data?.type === TYPE_PROFESSIONAL_APPROVED,
    );

    if (!banner) {
        return null;
    }

    const dismiss = () => {
        router.post(
            markRead.url(banner.id),
            {},
            { preserveScroll: true, only: ['notifications', 'flash'] },
        );
    };

    return (
        <Box
            role="status"
            aria-live="polite"
            data-testid="notification-banner-professional-approved"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="success.emphasized"
            bg="success.subtle"
            px="4"
            py="3"
        >
            <Flex alignItems="flex-start" gap="3">
                <Icon as={CheckCircle2} boxSize="5" color="success.fg" mt="0.5" />
                <Stack gap="0.5" flex="1" minW="0">
                    <Text fontSize="sm" fontWeight="semibold" color="fg">
                        ¡Tu cuenta ha sido aprobada!
                    </Text>
                    <Text fontSize="sm" color="fg.muted">
                        {banner.data?.message ??
                            'Ya puedes empezar a trabajar en Kosmos.'}
                    </Text>
                </Stack>
                <CloseButton
                    size="sm"
                    aria-label="Marcar como leída"
                    onClick={dismiss}
                />
            </Flex>
        </Box>
    );
}
