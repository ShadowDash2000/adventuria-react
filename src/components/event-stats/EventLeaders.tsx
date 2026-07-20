import { Box, HStack, Icon, Spinner, type StackProps, Text, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { PlayerAvatar } from '@components/PlayerAvatar';
import { FaCrown } from 'react-icons/fa6';
import { useAppContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';
import { pbCollections, playerProgressSchema, playerSchema } from '@shared/pbSchema';
import { dotExpand, joinExpand } from '@shared/pbExpand';
import type { PlayerProgressRecord } from '@shared/types/player_progress';

const CROWN_COLORS = ['yellow.400', 'gray.300', 'orange.400'];

const PLAYER_SIZES = { first: 28, other: 20 };

export const EventLeaders = ({ ...props }: StackProps) => {
    const { pb } = useAppContext();

    const playersProgress = useQuery({
        queryFn: () =>
            pb
                .collection(pbCollections.playersProgress)
                .getFullList<PlayerProgressRecord>({
                    sort: `-${playerProgressSchema.points}`,
                    perPage: 3,
                    expand: playerProgressSchema.player,
                    fields: joinExpand(
                        playerProgressSchema.id,
                        dotExpand('expand', playerProgressSchema.player, playerSchema.id),
                        dotExpand('expand', playerProgressSchema.player, 'collectionName'),
                        dotExpand('expand', playerProgressSchema.player, playerSchema.name),
                        dotExpand('expand', playerProgressSchema.player, playerSchema.avatar),
                        dotExpand('expand', playerProgressSchema.player, playerSchema.color),
                    ),
                }),
        queryKey: [...queryKeys.playersProgress, 'event-leaders'],
        refetchOnWindowFocus: false,
    });

    if (playersProgress.isPending) {
        return <Spinner />;
    }

    if (playersProgress.isError) {
        return <Text>Error: {playersProgress.error?.message}</Text>;
    }

    const firstPlace = playersProgress.data[0];
    const secondAndThird = playersProgress.data.slice(1, 3);

    return (
        <VStack gap={6} align="center" {...props}>
            {firstPlace && (
                <VStack gap={3}>
                    <Box position="relative" pt={4}>
                        <Icon
                            as={FaCrown}
                            color={CROWN_COLORS[0]}
                            boxSize={8}
                            position="absolute"
                            top={0}
                            left="50%"
                            transform="translate(-50%, -60%)"
                        />
                        <PlayerAvatar
                            player={firstPlace.expand!.player}
                            w={PLAYER_SIZES.first}
                            h={PLAYER_SIZES.first}
                        />
                    </Box>
                    <Link to={`/profile/${firstPlace.expand!.player.name}`}>
                        <Text fontWeight={600} fontSize="lg">
                            {firstPlace.expand!.player.name}
                        </Text>
                    </Link>
                </VStack>
            )}

            <HStack gap={8} align="start" justify="center">
                {secondAndThird.map((playerProgress, index) => (
                    <VStack key={playerProgress.id} gap={3}>
                        <Box position="relative" pt={4}>
                            <Icon
                                as={FaCrown}
                                color={CROWN_COLORS[index + 1]}
                                boxSize={7}
                                position="absolute"
                                top="0"
                                left="50%"
                                transform="translate(-50%, -60%)"
                            />
                            <PlayerAvatar
                                player={playerProgress.expand!.player}
                                w={PLAYER_SIZES.other}
                                h={PLAYER_SIZES.other}
                            />
                        </Box>
                        <Link to={`/profile/${playerProgress.expand!.player.name}`}>
                            <Text fontWeight={600} fontSize="lg">
                                {playerProgress.expand!.player.name}
                            </Text>
                        </Link>
                    </VStack>
                ))}
            </HStack>
        </VStack>
    );
};
