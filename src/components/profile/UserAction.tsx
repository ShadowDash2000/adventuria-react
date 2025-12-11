import {
    Card,
    HStack,
    Box,
    Text,
    Image,
    VStack,
    DataList,
    Stack,
    IconButton,
} from '@chakra-ui/react';
import { LuPencil } from 'react-icons/lu';
import HTMLReactParser from 'html-react-parser';
import { useEffect, useState } from 'react';
import { type ActionRecord } from '@shared/types/action';
import { useAppContext } from '@context/AppContextProvider';
import { formatDateLocalized } from '@shared/helpers/helper';
import { ActionFactory } from '../actions/action-factory';
import { Avatar } from '../Avatar';
import { ActionTextEditor } from './ActionTextEditor';
import { type HTMLContent } from '@tiptap/react';
import { InfoTip } from '@ui/toggle-tip';
import { Button } from '@ui/button';
import { CellInfo } from '../board/cells/CellInfoModal';
import { HiOutlineInformationCircle } from 'react-icons/hi';

type ActionProps = { action: ActionRecord };

export const UserAction = ({ action }: ActionProps) => {
    const { pb, user: authUser, isAuth } = useAppContext();
    const actionController = ActionFactory.get(action.type);

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [comment, setComment] = useState<string>(action.comment);
    const [draft, setDraft] = useState<string>(comment);

    const canEdit = isAuth && authUser.id && action.user === authUser.id;

    useEffect(() => {
        if (isEditing) {
            setDraft(comment ?? '');
        }
    }, [isEditing, comment]);

    const handleSave = async () => {
        setSaving(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('action_id', action.id);
            formData.append('comment', draft);

            const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/update-action`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${pb.authStore.token}` },
                body: formData,
            });
            if (!res.ok) {
                const error = await res
                    .json()
                    .then(e => e.error)
                    .catch(() => '');
                const text = await res.text().catch(() => '');
                throw new Error(error || text || `Failed to update action`);
            }
            setComment(draft);
            setIsEditing(false);
        } catch (e: any) {
            setError(e?.message ?? 'Unknown error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card.Root
            w="100%"
            bgImage="linear-gradient(rgb(13, 34, 137), rgb(6, 9, 59))"
            boxShadow="rgba(0, 0, 0, 0.3) 0 0 {spacing.1} {spacing.1} inset"
            border="{spacing.0.5} solid rgb(198, 198, 198)"
            borderRadius={12}
            _before={{
                content: '""',
                pointerEvents: 'none',
                inset: 0,
                position: 'absolute',
                border: '{spacing.1} solid white',
                borderRadius: 10,
            }}
        >
            <Card.Body pb={0}>
                <Stack
                    align={{ base: 'flex-start"', mdDown: 'center' }}
                    direction={{ base: 'row', mdDown: 'column' }}
                >
                    <VStack>
                        <Image src={action.expand?.game?.cover} />
                        <Text>{action.expand?.game?.name}</Text>
                    </VStack>
                    <VStack w="100%" align="start">
                        <VStack>
                            {actionController.statusNode()}
                            <DataList.Root orientation="horizontal">
                                <DataList.Item key="cell">
                                    <DataList.ItemLabel>Клетка</DataList.ItemLabel>
                                    <DataList.ItemValue alignItems="center">
                                        {action.expand?.cell.name}
                                        <IconButton
                                            variant="ghost"
                                            aria-label="info"
                                            size="2xs"
                                            colorPalette="gray"
                                        >
                                            <CellInfo cell={action.expand!.cell}>
                                                <HiOutlineInformationCircle />
                                            </CellInfo>
                                        </IconButton>
                                    </DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item key="dice-roll">
                                    <DataList.ItemLabel>Бросок кубика</DataList.ItemLabel>
                                    <DataList.ItemValue>{action.diceRoll}</DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item key="created">
                                    <DataList.ItemLabel>Начало действия</DataList.ItemLabel>
                                    <DataList.ItemValue alignItems="center">
                                        {formatDateLocalized(action.created)}
                                        <InfoTip lazyMount unmountOnExit>
                                            Локальное время
                                        </InfoTip>
                                    </DataList.ItemValue>
                                </DataList.Item>
                            </DataList.Root>
                        </VStack>
                        <Card.Description as="div" w="100%">
                            {isEditing ? (
                                <Box p={2} w="100%">
                                    <ActionTextEditor
                                        content={draft}
                                        setContent={content => setDraft(content as HTMLContent)}
                                        editable={isEditing}
                                    />
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
                    </VStack>
                    <VStack position="absolute" right="5%">
                        <Avatar user={action.expand?.user!} />
                        <Text>{action.expand?.user.name}</Text>
                    </VStack>
                </Stack>
            </Card.Body>
            <Card.Footer pt={5}>
                {isEditing ? (
                    <HStack gap="3">
                        <Button
                            onClick={handleSave}
                            variant="solid"
                            loading={saving}
                            disabled={saving}
                        >
                            Сохранить
                        </Button>
                        <Button
                            variant="subtle"
                            onClick={() => setIsEditing(false)}
                            disabled={saving}
                        >
                            Отмена
                        </Button>
                    </HStack>
                ) : canEdit ? (
                    <Button variant="subtle" onClick={() => setIsEditing(true)}>
                        <LuPencil />
                        Изменить
                    </Button>
                ) : null}
            </Card.Footer>
        </Card.Root>
    );
};
