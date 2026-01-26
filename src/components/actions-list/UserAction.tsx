import { Card, HStack, Text, Image, VStack, DataList, Stack, IconButton } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { type ActionRecord } from '@shared/types/action';
import type { RecordIdString } from '@shared/types/pocketbase';
import { useAppContext } from '@context/AppContext';
import { formatDateLocalized } from '@shared/helpers/helper';
import { ActionFactory } from '../actions/action-factory';
import { PlayerAvatar } from '../PlayerAvatar';
import { InfoTip } from '@ui/toggle-tip';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { Button } from '@theme/button';
import { UserActionComment } from '@components/profile/UserActionComment';
import { useCellsStore } from '@components/board/useCellsStore';
import { ActivityLinkButtons } from '@components/actions/roll-wheel/activities-wheel/ActivityLinkButtons';

type ActionProps = { action: ActionRecord };

export const UserAction = ({ action }: ActionProps) => {
    const { pb, user: authUser, isAuth } = useAppContext();
    const openCellInfo = useCellsStore(state => state.openCellInfo);
    const actionController = ActionFactory.get(action.type);

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [comment, setComment] = useState<string>(action.comment);
    const [draft, setDraft] = useState<string>(comment);
    const activity = action.expand?.activity;

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
            const ok = await updateActionRequest(pb.authStore.token, action.id, draft);
            if (ok) {
                setComment(draft);
                setIsEditing(false);
            }
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Unknown error';
            setError(message);
        }

        setSaving(false);
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
                    h="full"
                    align={{ base: 'flex-start', mdDown: 'center' }}
                    direction={{ base: 'row', mdDown: 'column' }}
                >
                    <VStack minW="15%" flexShrink={0}>
                        {activity && (
                            <>
                                <ActivityLinkButtons
                                    activity={activity}
                                    justify="center"
                                    size="sm"
                                    gap={0}
                                />
                                <Image
                                    w={220}
                                    aspectRatio="2/3"
                                    objectFit="cover"
                                    src={
                                        activity.cover ||
                                        pb.files.getURL(activity, activity.cover_alt)
                                    }
                                />
                                <Text>{activity.name}</Text>
                                {activity.hltb_campaign_time > 0 && (
                                    <Text>Время прохождения: {activity.hltb_campaign_time} ч.</Text>
                                )}
                            </>
                        )}
                    </VStack>
                    <VStack w="full" align="start">
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
                                            onClick={() => openCellInfo(action.expand!.cell.id)}
                                        >
                                            <HiOutlineInformationCircle />
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
                        <Card.Description as="div" w="full">
                            <UserActionComment
                                isEditing={isEditing}
                                comment={comment}
                                draft={draft}
                                setDraft={setDraft}
                            />
                            {!!error && (
                                <Text color="red.500" mt="2" fontSize="xs">
                                    {error}
                                </Text>
                            )}
                        </Card.Description>
                    </VStack>
                    <VStack position="absolute" right="5%">
                        <PlayerAvatar user={action.expand!.user!} />
                        <Text>{action.expand?.user.name}</Text>
                    </VStack>
                </Stack>
            </Card.Body>
            <Card.Footer pt={5} justifyContent="center">
                {isEditing ? (
                    <HStack gap="3">
                        <Button
                            colorPalette="green"
                            onClick={handleSave}
                            loading={saving}
                            disabled={saving}
                        >
                            Сохранить
                        </Button>
                        <Button
                            colorPalette="red"
                            onClick={() => setIsEditing(false)}
                            disabled={saving}
                        >
                            Отмена
                        </Button>
                    </HStack>
                ) : canEdit ? (
                    <Button colorPalette="blue" onClick={() => setIsEditing(true)}>
                        Изменить
                    </Button>
                ) : null}
            </Card.Footer>
        </Card.Root>
    );
};

const updateActionRequest = async (
    authToken: string,
    actionId: RecordIdString,
    comment: string,
) => {
    const formData = new FormData();
    formData.append('action_id', actionId);
    formData.append('comment', comment);

    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/update-action`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
        body: formData,
    });
    if (!res.ok) {
        const error = await res
            .json()
            .then(e => e.error)
            .catch(() => '');
        const text = await res.text().catch(() => '');
        console.log(error || text || `Failed to update action`);
        return false;
    }

    return true;
};
