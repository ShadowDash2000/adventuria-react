import {
    Card,
    HStack,
    Text,
    VStack,
    DataList,
    Stack,
    IconButton,
    Separator,
    Box,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { type ActionRecord } from '@shared/types/action';
import type { RecordIdString } from '@shared/types/pocketbase';
import type { CardColorPaletteVariants } from '@theme/card';
import { useAppContext } from '@context/AppContext';
import { formatDateLocalized, resolveRelativeImageUrlsFromHtml } from '@shared/helpers/helper';
import { ActionStatusFactory } from '@components/actions-statuses/action-status-factory';
import { PlayerAvatar } from '../PlayerAvatar';
import { InfoTip } from '@ui/toggle-tip';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { Button } from '@theme/button';
import { PlayerActionReview } from '@components/profile/PlayerActionReview';
import { useCellsStore } from '@components/board/useCellsStore';
import { LinkButtons } from '@components/activities/LinkButtons';
import { UsedItems } from './UsedItems';
import { handleApiResponse } from '@shared/helpers/api';
import { Cover } from '@components/activities/Cover';
import { Events } from '@components/actions-list/Events';
import { PlayerProfileLink } from '@components/profile/Link';

type ActionProps = { action: ActionRecord };

export const PlayerAction = ({ action }: ActionProps) => {
    const { pb, isAuth, playerId } = useAppContext();
    const openCellInfo = useCellsStore(state => state.openCellInfo);
    const actionStatus = ActionStatusFactory.get(action.status);

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [comment, setComment] = useState<string>('');
    const [score, setScore] = useState<number>(action.expand?.review?.score ?? 0);
    const [draft, setDraft] = useState<string>('');
    const activity = action.expand?.activity;
    const canEdit = isAuth && action.player === playerId && action.expand?.review;

    useEffect(() => {
        const comment = action.expand?.review?.comment
            ? resolveRelativeImageUrlsFromHtml(
                  action.expand.review.comment,
                  import.meta.env.VITE_PB_URL || '',
              )
            : '';
        setComment(comment);
        setDraft(comment);
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

        const res = await updateActionRequest(pb.authStore.token, action.id, draft, score);

        if (!handleApiResponse(res)) {
            setSaving(false);
            return;
        }

        setComment(draft);
        setIsEditing(false);
        setSaving(false);
    };

    return (
        <Card.Root
            variant="solid"
            colorPalette={actionStatus.color() as CardColorPaletteVariants}
            w="100%"
        >
            <Card.Body pb={0}>
                <Stack
                    h="full"
                    align={{ base: 'flex-start', mdDown: 'center' }}
                    direction={{ base: 'row', mdDown: 'column' }}
                >
                    <VStack minW="15%" maxW={{ base: '20%', mdDown: 'full' }} flexShrink={0}>
                        {activity && (
                            <>
                                <LinkButtons
                                    activityType={activity.type}
                                    steamAppId={activity.steam_app_id}
                                    hltbId={activity.hltb_id}
                                    slug={activity.slug}
                                    justify="center"
                                    size="sm"
                                    gap={2}
                                />
                                <Cover
                                    variant="action"
                                    coverUrl={activity.cover}
                                    coverAltUrl={activity.cover_alt}
                                    w={220}
                                />
                                <Text>{activity.name}</Text>
                                {activity.hltb_campaign_time > 0 && (
                                    <Text>Время прохождения: {activity.hltb_campaign_time} ч.</Text>
                                )}
                            </>
                        )}
                        {activity && action.player_events.length > 0 && (
                            <Separator w="full" borderColor="border.inverted" />
                        )}
                        <Events playerEvents={action.player_events} />
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
                                {action.expand?.review && score > 0 && (
                                    <DataList.Item key="score">
                                        <DataList.ItemLabel>Оценка</DataList.ItemLabel>
                                        <DataList.ItemValue>{score}/10</DataList.ItemValue>
                                    </DataList.Item>
                                )}
                            </DataList.Root>
                            {action.state?.used_items && (
                                <HStack>
                                    <UsedItems ids={action.state.used_items.map(val => val.id)} />
                                </HStack>
                            )}
                        </VStack>
                        <Card.Description as="div" w="full">
                            {action.expand?.review && (
                                <PlayerActionReview
                                    isEditing={isEditing}
                                    comment={comment}
                                    score={score}
                                    setScore={setScore}
                                    draft={draft}
                                    setDraft={setDraft}
                                />
                            )}
                        </Card.Description>
                    </VStack>
                    <Box position="absolute" right="5%">
                        <PlayerProfileLink playerName={action.expand!.player.name}>
                            <VStack>
                                <PlayerAvatar
                                    avatarUrl={action.expand!.player.avatar}
                                    color={action.expand!.player.color}
                                />
                                <Text>{action.expand?.player.name}</Text>
                            </VStack>
                        </PlayerProfileLink>
                    </Box>
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

    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/update-review`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
        body: formData,
    });

    return (await res.json()) as UpdateActionResult;
};
