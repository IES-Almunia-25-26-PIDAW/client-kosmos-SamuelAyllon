---
name: chakra-ui-v3
description: Guía para Claude al generar código con **Chakra UI v3**.
globs: "*.tsx"
---


## Objetivo

- Usar Chakra UI v3 correctamente.
- Evitar APIs obsoletas de v2.
- Priorizar componentes compuestos y patrones actuales.
- Mantener el código claro, accesible y consistente.

## Reglas generales

1. No usar patrones de v2 cuando exista equivalente en v3.
2. No asumir imports antiguos.
3. Usar composición de componentes en lugar de props heredadas.
4. Preferir `toaster.create()` para notificaciones.
5. Usar `asChild` cuando aplique.
6. Respetar los nombres nuevos de props y tokens.

---

## Dependencias

### Evitar / eliminar

- `@emotion/styled`
- `framer-motion`
- `@chakra-ui/icons`
- `@chakra-ui/hooks`
- `@chakra-ui/next-js`

### Sustituciones

- Iconos: `lucide-react` o `react-icons`
- Hooks: `react-use` o `usehooks-ts`
- Next.js: usa `asChild` en lugar de `@chakra-ui/next-js`

---

## Imports correctos

### Desde `@chakra-ui/react`

Usa para componentes base y layout:

- `Alert`
- `Avatar`
- `Button`
- `Card`
- `Field`
- `Table`
- `Input`
- `NativeSelect`
- `Tabs`
- `Textarea`
- `Separator`
- `useDisclosure`
- `Box`
- `Flex`
- `Stack`
- `HStack`
- `VStack`
- `Text`
- `Heading`
- `Icon`

### Desde `components/ui` o imports relativos

Usa wrappers locales del proyecto cuando existan:

- `Provider`
- `Toaster`
- `ColorModeProvider`
- `Tooltip`
- `PasswordInput`

---

## Migraciones clave

### Toast

```tsx
import { toaster } from "./components/ui/toaster"

toaster.create({
  title: "Title",
  type: "error",
  meta: { closable: true },
  placement: "top-end",
})
```

- `useToast()` ya no se usa.
- `status` → `type`
- `isClosable` → `meta.closable`
- `top-right` → `top-end`

---

### Dialog (antes Modal)

```tsx
<Dialog.Root open={isOpen} onOpenChange={onOpenChange} placement="center">
  <Dialog.Backdrop />
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Title</Dialog.Title>
    </Dialog.Header>
    <Dialog.Body>Content</Dialog.Body>
  </Dialog.Content>
</Dialog.Root>
```

- `Modal` → `Dialog`
- `isOpen` → `open`
- `onClose` suele pasar a `onOpenChange`
- `isCentered` → `placement="center"`

---

### Botones con iconos

```tsx
<Button>
  <Mail /> Email <ChevronRight />
</Button>
```

- No usar `leftIcon` ni `rightIcon`.
- Los iconos van como children.

---

### Alert

```tsx
<Alert.Root borderStartWidth="4px" borderStartColor="colorPalette.solid">
  <Alert.Indicator />
  <Alert.Content>
    <Alert.Title>Title</Alert.Title>
    <Alert.Description>Description</Alert.Description>
  </Alert.Content>
</Alert.Root>
```

- Usar estructura compuesta.
- Evitar la forma antigua con `AlertIcon`, `AlertTitle`, `AlertDescription`.

---

### Tooltip

```tsx
import { Tooltip } from "./components/ui/tooltip"

<Tooltip content="Content" showArrow positioning={{ placement: "top" }}>
  <Button>Hover me</Button>
</Tooltip>
```

- `label` → `content`
- `hasArrow` → `showArrow`
- `placement` va dentro de `positioning`

---

### Input con validación

```tsx
<Field.Root invalid>
  <Field.Label>Email</Field.Label>
  <Input />
  <Field.ErrorText>This field is required</Field.ErrorText>
</Field.Root>
```

- `isInvalid` → `invalid`
- La validación debe envolver el input con `Field.Root`

---

### Table

```tsx
<Table.Root variant="line">
  <Table.Header>
    <Table.Row>
      <Table.ColumnHeader>Header</Table.ColumnHeader>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Cell</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
```

- Usar subcomponentes de `Table`
- No usar `Thead`, `Tbody`, `Tr`, `Th`, `Td` al estilo antiguo

---

### Tabs

```tsx
<Tabs.Root defaultValue="one" colorPalette="orange">
  <Tabs.List>
    <Tabs.Trigger value="one">One</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="one">Content</Tabs.Content>
</Tabs.Root>
```

- `Tabs.Root` es la base
- `colorScheme` → `colorPalette`

---

### Menu

```tsx
<Menu.Root>
  <Menu.Trigger asChild>
    <Button>Actions</Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item value="download">Download</Menu.Item>
  </Menu.Content>
</Menu.Root>
```

- Usar `Menu.Root`, `Menu.Trigger`, `Menu.Content`
- Preferir `asChild` en el trigger

---

### Popover

```tsx
<Popover.Root positioning={{ placement: "bottom-end" }}>
  <Popover.Trigger asChild>
    <Button>Click</Button>
  </Popover.Trigger>
  <Popover.Content>
    <PopoverArrow />
    <Popover.Body>Content</Popover.Body>
  </Popover.Content>
</Popover.Root>
```

- `PopoverTrigger` → `Popover.Trigger`
- `PopoverContent` → `Popover.Content`

---

### NativeSelect

```tsx
<NativeSelect.Root size="sm">
  <NativeSelect.Field placeholder="Select option">
    <option value="1">Option 1</option>
  </NativeSelect.Field>
  <NativeSelect.Indicator />
</NativeSelect.Root>
```

- Preferir `NativeSelect` para selects nativos
- Mantener la estructura compuesta

---

## Cambios de nombres de props

### Boolean props

- `isOpen` → `open`
- `isDisabled` → `disabled`
- `isInvalid` → `invalid`
- `isRequired` → `required`
- `isActive` → `data-active`
- `isLoading` → `loading`
- `isChecked` → `checked`
- `isIndeterminate` → `indeterminate`

### Style props

- `colorScheme` → `colorPalette`
- `spacing` → `gap`
- `noOfLines` → `lineClamp`
- `truncated` → `truncate`
- `thickness` → `borderWidth`
- `speed` → `animationDuration`

### Component-specific

- `Divider` → `Separator`
- `Modal` → `Dialog`
- `Collapse` → `Collapsible`
- `Tags` → `Badge`
- `useToast` → `toaster.create()`

---

## Sistema de estilos

### Estilos anidados

```tsx
<Box css={{ "& svg": { color: "red.500" } }} />
```

- En v3, el selector anidado debe incluir `&`.

### Gradientes

```tsx
<Box bgGradient="to-r" gradientFrom="red.200" gradientTo="pink.500" />
```

- Separar dirección y colores del gradiente.

### Theme / tokens

```tsx
const system = useChakra()
const gray400 = system.token("colors.gray.400")
```

- Usar `useChakra()` y `token()`
- No usar acceso antiguo a `theme.colors`

---

## Reglas de composición

1. Usar componentes compuestos cuando el patrón lo pida.
2. Mantener accesibilidad: labels, errors, titles y triggers deben estar bien colocados.
3. Usar `asChild` para envolver botones, enlaces o triggers.
4. No mezclar patrones v2 y v3 en el mismo archivo.
5. Si existe wrapper local, preferirlo.
6. Si hay duda, elegir la API compuesta de v3.

---

## Checklist antes de responder

- ¿Los imports son correctos?
- ¿No se usan APIs v2?
- ¿`isOpen` pasó a `open`?
- ¿`colorScheme` pasó a `colorPalette`?
- ¿Se usa `Field` para validación?
- ¿Se usa `toaster.create()`?
- ¿Se usa `asChild` cuando toca?
- ¿Los estilos anidados usan `&`?
- ¿El componente sigue el patrón de Chakra v3?

---

## Prioridad

1. Correctitud de Chakra v3.
2. Legibilidad.
3. Accesibilidad.
4. Consistencia con el proyecto.
5. Menor cantidad de código innecesario.
