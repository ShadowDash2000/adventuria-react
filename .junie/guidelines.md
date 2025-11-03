# Project Guidelines for Junie

These guidelines summarize conventions established in recent tasks. They are intended to keep future changes consistent.

## AppContextProvider (PocketBase and Auth)

Use the app context to access the PocketBase instance and the current authenticated user.

- Import the hook:
  - `import { useAppContext } from "@context/AppContextProvider/AppContextProvider"`
- Available values:
  - `pb`: PocketBase instance.
  - `user`: current authorized user (UserRecord) or `undefined` when not authorized.
  - `isAuth`: boolean flag that indicates whether the session is valid.
  - `setUser`: setter for updating the user in context.
- Authorization header for protected endpoints:
  - For any request requiring authentication, include header `Authorization: Bearer ${pb.authStore.token}` and `Content-Type: application/json`.
- Ownership check for mutating actions:
  - Features that modify user-related data must be available only to authorized users and must verify that the resource belongs to the current user (e.g., `action.user === user.id`).
- URL:
  - To access Pocketbase endpoints, add import.meta.env.VITE_PB_URL to the URL.

Example usage:

```tsx
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";

export const Example = () => {
    const {pb, user, isAuth} = useAppContext();

    const save = async () => {
        if (!isAuth) return; // or show auth prompt

        const formData = new FormData();
        formData.append('actionId', action.id);
        formData.append('comment', draft);

        await fetch(`${import.meta.env.VITE_PB_URL}/api/protected-endpoint`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${pb.authStore.token}`,
            },
            body: formData,
        });
    };

    return null;
};
```

## Chakra UI (Components and Styling)

Adopt Chakra UI components and style props instead of raw HTML elements and inline styles.

- Prefer Chakra components instead of HTML tags:
  - Use `Box` instead of `div`, `Flex` for flex layouts, `HStack`/`VStack` for horizontal/vertical stacks, `Text`, `Button`, `Card`, `Avatar`, `Grid`, `Image`, `VisuallyHidden`, `For`, etc.
- Apply styles via component props rather than inline `style`:
  - Examples: `mb="6"`, `gap="3"`, `p="2"`, `rounded="md"`, `borderWidth="1px"`, `borderColor="gray.200"`, `color="red.500"`.
- Use theme tokens for spacing, colors, borders, and radii.

Example snippets:

```tsx
import {Box, HStack, Button, Card, Text} from "@chakra-ui/react";

<Card.Root>
  <Card.Body>
    <HStack mb="6" gap="3">{/* content */}</HStack>
    <Card.Description>
      <Box borderWidth="1px" borderColor="gray.200" rounded="md" p="2">
        {/* editor or content */}
      </Box>
      <Text color="red.500" mt="2" fontSize="xs">Error text</Text>
    </Card.Description>
  </Card.Body>
  <Card.Footer>
    <Button variant="subtle">Action</Button>
  </Card.Footer>
</Card.Root>
```

## Quick checklist

- [ ] Need PocketBase or auth? Use `useAppContext()` to get `pb`, `user`, `isAuth`.
- [ ] Calling a protected endpoint? Add `Authorization: Bearer ${pb.authStore.token}`.
- [ ] Mutating user-owned data? Ensure the current user owns the resource.
- [ ] Building UI? Use Chakra components and style props, not inline styles.