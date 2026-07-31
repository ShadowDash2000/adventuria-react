import { Card, HStack, Text, Image, VStack, DataList, Stack, IconButton } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { type ActionRecord } from '@shared/types/action';
import type { RecordIdString } from '@shared/types/pocketbase';
import { useAppContext } from '@context/AppContext';
import { formatDateLocalized } from '@shared/helpers/helper';
import { ActionStatusFactory } from '@components/actions-statuses/action-status-factory';
import { PlayerAvatar } from '../PlayerAvatar';
import { InfoTip } from '@ui/toggle-tip';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { Button } from '@theme/button';
import { PlayerActionReview } from '@components/profile/PlayerActionReview';
import { useCellsStore } from '@components/board/useCellsStore';
import { LinkButtons } from '@components/actions/roll-wheel/activities-wheel/LinkButtons';
import { UsedItems } from './UsedItems';
import { handleApiResponse } from '@shared/helpers/api';

type ActionProps = { action: ActionRecord };

export const PlayerAction = ({ action }: ActionProps) => {
    const { pb, player: authPlayer, isAuth } = useAppContext();
    const openCellInfo = useCellsStore(state => state.openCellInfo);
    const actionStatus = ActionStatusFactory.get(action.status);

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [comment, setComment] = useState<string>(action.expand?.review?.comment ?? '');
    const [score, setScore] = useState<number>(action.expand?.review?.score ?? 0);
    const [draft, setDraft] = useState<string>(action.expand?.review?.comment ?? '');
    const activity = action.expand?.activity;

    const canEdit = isAuth && authPlayer.id && action.player === authPlayer.id;

    useEffect(() => {
        setComment(action.expand?.review?.comment ?? '');
        setDraft(action.expand?.review?.comment ?? '');
    }, [action.expand?.review?.comment]);

    useEffect(() => {
        setScore(action.expand?.review?.score ?? 0);
    }, [action.expand?.review?.score]);

    useEffect(() => {
        if (isEditing) {
            setDraft(comment ?? '');
        }
    }, [isEditing, comment]);

    const handleSave = async () => {
        setSaving(true);
        setError(null);

        const res = await updateActionRequest(pb.authStore.token, action.id, draft, score);

        if (!handleApiResponse(res)) {
            setError(res.message);
            setSaving(false);
            return;
        }

        setComment(draft);
        setIsEditing(false);
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
                                <LinkButtons
                                    activity={{ ...activity }}
                                    justify="center"
                                    size="sm"
                                    gap={0}
                                />
                                <Image
                                    w={220}
                                    aspectRatio="2/3"
                                    objectFit="contain"
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
                            {actionStatus.statusNode()}
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
                                    <DataList.ItemLabel>Прошёл клеток</DataList.ItemLabel>
                                    <DataList.ItemValue>{action.cells_passed}</DataList.ItemValue>
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
                                {action.expand?.review && (
                                    <DataList.Item key="score">
                                        <DataList.ItemLabel>Оценка</DataList.ItemLabel>
                                        <DataList.ItemValue>{score}/10</DataList.ItemValue>
                                    </DataList.Item>
                                )}
                            </DataList.Root>
                            <HStack>
                                <UsedItems action={action} />
                            </HStack>
                        </VStack>
                        <Card.Description as="div" w="full">
                            <PlayerActionReview
                                isEditing={isEditing}
                                comment={comment}
                                score={score}
                                setScore={setScore}
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
                        <PlayerAvatar player={action.expand!.player!} />
                        <Text>{action.expand?.player.name}</Text>
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

type UpdateActionSuccess = { success: true; message?: string; error?: never };

type UpdateActionError = { success: false; message: string; error: string };

type UpdateActionResult = UpdateActionSuccess | UpdateActionError;

const updateActionRequest = async (
    authToken: string,
    actionId: RecordIdString,
    comment: string,
    score: number,
) => {
    const formData = new FormData();
    formData.append('action_id', actionId);
    formData.append('comment', comment);
    formData.append('score', score.toString());

    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/update-action`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
        body: formData,
    });

    return (await res.json()) as UpdateActionResult;
};
