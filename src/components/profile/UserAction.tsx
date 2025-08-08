import {Button, Card, HStack, Box, Text} from "@chakra-ui/react";
import {LuPencil} from "react-icons/lu";
import HTMLReactParser from "html-react-parser";
import {FC, useEffect, useState} from "react";
import {Avatar} from "../Avatar";
import {ActionRecord} from "@shared/types/action";
import {useCollectionOneFilter} from "@context/CollectionOneFilterContext";
import {UserRecord} from "@shared/types/user";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";

type ActionProps = {
    action: ActionRecord;
}

export const UserAction: FC<ActionProps> = ({action}) => {
    const {data: profileUser} = useCollectionOneFilter<UserRecord>();
    const {pb, user: authUser, isAuth} = useAppContext();

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [comment, setComment] = useState<string>(action.comment);
    const [draft, setDraft] = useState<string>(comment);

    const canEdit = Boolean(isAuth && authUser?.id && (action.user === authUser.id));

    useEffect(() => {
        if (isEditing) {
            setDraft(comment ?? "");
        }
    }, [isEditing, comment]);

    const editor = useEditor({
        extensions: [StarterKit],
        content: draft,
        editable: isEditing,
        onUpdate: ({editor}) => {
            setDraft(editor.getHTML());
        },
    }, [isEditing]);

    const handleSave = async () => {
        setSaving(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('actionId', action.id);
            formData.append('comment', draft);

            const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/update-action`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${pb.authStore.token}`,
                },
                body: formData,
            });
            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(text || `Failed to update action`);
            }
            setComment(draft);
            setIsEditing(false);
        } catch (e: any) {
            setError(e?.message ?? "Unknown error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card.Root>
            <Card.Body>
                <HStack mb="6" gap="3">
                    <Avatar user={profileUser}/>
                </HStack>
                <Card.Description>
                    {isEditing ? (
                        <Box borderWidth="1px" borderColor="gray.200" rounded="md" p="2">
                            <EditorContent editor={editor}/>
                        </Box>
                    ) : (
                        HTMLReactParser(comment)
                    )}
                    {!!error && (
                        <Text color="red.500" mt="2" fontSize="xs">
                            {error}
                        </Text>
                    )}
                </Card.Description>
            </Card.Body>
            <Card.Footer>
                {isEditing ? (
                    <HStack gap="3">
                        <Button onClick={handleSave} variant="solid" loading={saving} disabled={saving}>
                            Сохранить
                        </Button>
                        <Button variant="subtle" onClick={() => setIsEditing(false)} disabled={saving}>
                            Отмена
                        </Button>
                    </HStack>
                ) : (
                    canEdit ? (
                        <Button variant="subtle" onClick={() => setIsEditing(true)}>
                            <LuPencil/>
                            Изменить
                        </Button>
                    ) : null
                )}
            </Card.Footer>
        </Card.Root>
    )
}