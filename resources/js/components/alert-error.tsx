import { List } from '@chakra-ui/react';
import { AlertCircleIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AlertError({
    errors,
    title,
}: {
    errors: string[];
    title?: string;
}) {
    return (
        <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>{title || 'Something went wrong.'}</AlertTitle>
            <AlertDescription>
                <List.Root as="ul" listStyleType="disc" listStylePosition="inside" fontSize="sm">
                    {Array.from(new Set(errors)).map((error, index) => (
                        <List.Item key={index}>{error}</List.Item>
                    ))}
                </List.Root>
            </AlertDescription>
        </Alert>
    );
}
