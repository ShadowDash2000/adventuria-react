import type { RecordIdString } from '@shared/types/pocketbase';
import type { ClientResponseError } from 'pocketbase';
import type { JSX } from 'react';
import { Carousel, For, Heading, HStack, IconButton, Text, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';
import { Tooltip } from '@ui/tooltip';
import { Cover } from '@components/activities/Cover';
import { PlayerAvatar } from '@components/PlayerAvatar';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { ToggleTip } from '@ui/toggle-tip';

const MAX_PLAYERS = 6;

interface LatestCompletedActivitiesProps {
    cellId: RecordIdString;
}

export const LatestCompletedActivities = ({ cellId }: LatestCompletedActivitiesProps) => {
    const completedActivities = useQuery({
        queryFn: () => getCompletedActivities(cellId),
        queryKey: [...queryKeys.latestCompletedActivities(cellId)],
        refetchOnWindowFocus: false,
    });

    if (completedActivities.isPending) {
        return null;
    }

    if (completedActivities.isError) {
        const e = completedActivities.error as ClientResponseError;
        return <Text>Error: {e.message}</Text>;
    }

    if (completedActivities.data.data.length === 0) {
        return null;
    }

    return (
        <>
            <Heading as="h3" size="xl">
                Последние события
            </Heading>
            <Carousel.Root
                slideCount={completedActivities.data.data.length}
                autoplay={{ delay: 10000 }}
                allowMouseDrag
                loop
                slidesPerPage={2}
            >
                <Carousel.ItemGroup>
                    {completedActivities.data.data.map((activity, index) => (
                        <Carousel.Item key={activity.id} index={index} position="relative">
                            <Tooltip content={activity.name} openDelay={100}>
                                <Cover
                                    activity={activity}
                                    width="full"
                                    minH="150px"
                                    aspectRatio="2/3"
                                    objectFit="cover"
                                    filter="brightness(0.5)"
                                />
                            </Tooltip>
                            {activity.players.length <= MAX_PLAYERS ? (
                                <PlayersList players={activity.players} />
                            ) : (
                                <PlayersListButton players={activity.players} />
                            )}
                        </Carousel.Item>
                    ))}
                </Carousel.ItemGroup>
                <Carousel.Control justifyContent="center" gap="4">
                    <Carousel.PrevTrigger asChild>
                        <IconButton size="xs" variant="ghost">
                            <LuChevronLeft />
                        </IconButton>
                    </Carousel.PrevTrigger>

                    <Carousel.Indicators />

                    <Carousel.NextTrigger asChild>
                        <IconButton size="xs" variant="ghost">
                            <LuChevronRight />
                        </IconButton>
                    </Carousel.NextTrigger>
                </Carousel.Control>
            </Carousel.Root>
        </>
    );
};

type GetCompletedActivitiesData = CompletedActivity[];

type CompletedActivity = {
    collectionName: string;
    id: RecordIdString;
    name: string;
    cover: string;
    cover_alt: string;
    players: PlayerStatus[];
};

type PlayerStatus = { player: Player; status: string };

type Player = {
    collectionName: string;
    id: RecordIdString;
    name: string;
    avatar: string;
    color: string;
};

type GetCompletedActivitiesSuccess = {
    success: true;
    data: GetCompletedActivitiesData;
    message?: string;
    error?: never;
};

type GetCompletedActivitiesError = { success: false; data: never; message: string; error: string };

type GetCompletedActivitiesResult = GetCompletedActivitiesSuccess | GetCompletedActivitiesError;

const getCompletedActivities = async (cellId: string) => {
    const res = await fetch(
        `${import.meta.env.VITE_PB_URL}/api/completed-activities?cellId=${cellId}`,
        { method: 'GET' },
    );

    return (await res.json()) as GetCompletedActivitiesResult;
};

interface PlayersListButtonProps {
    players: PlayerStatus[];
}

const PlayersListButton = ({ players }: PlayersListButtonProps) => {
    return (
        <VStack position="absolute" h="full" justifyContent="center" top={0} left={0} right={0}>
            <ToggleTip
                lazyMount
                unmountOnExit
                positioning={{ placement: 'top' }}
                contentProps={{ bg: 'black' }}
                content={
                    <VStack
                        p={2}
                        gap={4}
                        align="stretch"
                        overflowY="scroll"
                        scrollbarColor="white transparent"
                    >
                        <For each={players}>
                            {(playerStatus, index) => (
                                <VStack key={`${playerStatus.player.id}_${index}`}>
                                    <PlayerAvatar player={playerStatus.player} />
                                    <PlayerStatus status={playerStatus.status} />
                                </VStack>
                            )}
                        </For>
                    </VStack>
                }
            >
                <IconButton size="xl" transform="translateY(-45%)">
                    {players.length}
                </IconButton>
            </ToggleTip>
        </VStack>
    );
};

interface PlayersListProps {
    players: PlayerStatus[];
}

const PlayersList = ({ players }: PlayersListProps) => {
    return (
        <HStack
            position="absolute"
            top={0}
            left={0}
            right={0}
            padding={2}
            flexWrap="wrap"
            justifyContent="center"
            pointerEvents="none"
        >
            <For each={players}>
                {(playerStatus, index) => (
                    <VStack key={`${playerStatus.player.id}_${index}`}>
                        <PlayerAvatar player={playerStatus.player} />
                        <PlayerStatus status={playerStatus.status} />
                    </VStack>
                )}
            </For>
        </HStack>
    );
};

interface PlayerStatusProps {
    status: string;
}

const statusText: Record<string, JSX.Element> = {
    done: <Text color="fg.success">Завершил</Text>,
    drop: <Text color="fg.error">Дроп</Text>,
};

const PlayerStatus = ({ status }: PlayerStatusProps) => {
    const text = statusText[status];

    return <>{text || <Text>{status}</Text>}</>;
};
