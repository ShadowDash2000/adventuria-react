import type { IsoDateString, RecordIdString } from '@shared/types/pocketbase';
import type { ClientResponseError } from 'pocketbase';
import type { JSX } from 'react';
import { Carousel, For, Heading, HStack, IconButton, Text, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { Tooltip } from '@ui/tooltip';
import { Cover } from '@components/activities/Cover';
import { PlayerAvatar } from '@components/PlayerAvatar';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { ToggleTip } from '@ui/toggle-tip';
import { formatDateLocalized } from '@shared/helpers/helper';
import {
    completedActivitiesQueryOptions,
    type PlayerStatus,
} from '@shared/query/requests/completed-activities';

const MAX_PLAYERS = 6;

interface LatestCompletedActivitiesProps {
    cellId: RecordIdString;
}

export const LatestCompletedActivities = ({ cellId }: LatestCompletedActivitiesProps) => {
    const completedActivities = useQuery({
        ...completedActivitiesQueryOptions(cellId),
        refetchOnWindowFocus: false,
    });

    if (completedActivities.isPending) {
        return null;
    }

    if (completedActivities.isError) {
        const e = completedActivities.error as ClientResponseError;
        return <Text>Error: {e.message}</Text>;
    }

    if (completedActivities.data.length === 0) {
        return null;
    }

    return (
        <>
            <Heading as="h3" size="xl">
                Последние события
            </Heading>
            <Carousel.Root
                w="full"
                slideCount={completedActivities.data.length}
                autoplay={{ delay: 10000 }}
                allowMouseDrag
                loop
                slidesPerPage={completedActivities.data.length === 1 ? 1 : 2}
            >
                <Carousel.ItemGroup>
                    {completedActivities.data.map((activity, index) => (
                        <Carousel.Item key={activity.id} index={index} position="relative">
                            <Tooltip content={activity.name} openDelay={100}>
                                <Cover
                                    coverUrl={activity.cover}
                                    coverAltUrl={activity.cover_alt}
                                    width="full"
                                    minH="150px"
                                    maxH="300px"
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
                                <HStack key={`${playerStatus.player.id}_${index}`}>
                                    <VStack>
                                        <PlayerAvatar
                                            avatarUrl={playerStatus.player.avatar}
                                            color={playerStatus.player.color}
                                        />
                                        <PlayerStatus status={playerStatus.status} />
                                    </VStack>
                                    <Text color="white">
                                        {formatDateLocalized(playerStatus.date)}
                                    </Text>
                                </HStack>
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
        >
            <For each={players}>
                {(playerStatus, index) => (
                    <Tooltip
                        key={`${playerStatus.player.id}_${index}`}
                        content={formatActionDate(playerStatus.date)}
                        openDelay={100}
                    >
                        <VStack userSelect="none">
                            <PlayerAvatar
                                avatarUrl={playerStatus.player.avatar}
                                color={playerStatus.player.color}
                            />
                            <PlayerStatus status={playerStatus.status} />
                        </VStack>
                    </Tooltip>
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

function formatActionDate(date: IsoDateString) {
    return formatDateLocalized(date, { hour: undefined, minute: undefined });
}
