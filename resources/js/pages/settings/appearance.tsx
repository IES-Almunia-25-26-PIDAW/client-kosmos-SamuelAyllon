import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { Head } from '@inertiajs/react';
import { Palette } from 'lucide-react';
import type { ReactNode } from 'react';
import AppearanceTabs from '@/components/appearance-tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Ajustes de apariencia', href: editAppearance().url },
];

export default function Appearance() {
    return (
        <>
            <Head title="Ajustes de apariencia" />

            <Heading as="h1" srOnly>Ajustes de Apariencia</Heading>

            <SettingsLayout>
                <Card>
                    <CardHeader>
                        <Flex alignItems="center" gap="2">
                            <Box as={Palette} h="5" w="5" color="brand.solid" />
                            <CardTitle>
                                <Text as="span" fontSize="md" fontWeight="semibold">Tema de la aplicación</Text>
                            </CardTitle>
                        </Flex>
                        <CardDescription>
                            Personaliza la apariencia de tu cuenta
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Stack gap="4">
                            <Text fontSize="sm" color="fg.muted">
                                Selecciona el tema que prefieras para la interfaz. El tema del sistema se adaptará automáticamente a la configuración de tu dispositivo.
                            </Text>
                            <AppearanceTabs />
                        </Stack>
                    </CardContent>
                </Card>
            </SettingsLayout>
        </>
    );
}

Appearance.layout = (page: ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
