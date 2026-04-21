import { Box, HStack, Icon, Spinner, type StackProps, Text, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { PlayerAvatar } from '@components/PlayerAvatar';
import { FaCrown } from 'react-icons/fa6';
import { useAppContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';
import type { PlayerRecord } from '@shared/types/player';
import type { ClientResponseError } from 'pocketbase';
import { pbCollections } from '@shared/pbSchema';

const CROWN_COLORS = ['yellow.400', 'gray.300', 'orange.400'];

const PLAYER_SIZES = { first: 28, other: 20 };

export const EventLeaders = ({ ...props }: StackProps) => {
    const { pb } = useAppContext();

    const players = useQuery({
        queryFn: () =>
            pb
                .collection(pbCollections.players)
                .getFullList<PlayerRecord>({ sort: '-points', perPage: 3 }),
        queryKey: [...queryKeys.players, 'event-leaders'],
        refetchOnWindowFocus: false,
    });

    if (players.isPending) {
        return <Spinner />;
    }

    if (players.isError) {
        const e = players.error as ClientResponseError;
        return <Text>Error: {e.message}</Text>;
    }

    const firstPlace = players.data[0];
    const secondAndThird = players.data.slice(1, 3);

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
                            player={firstPlace}
                            w={PLAYER_SIZES.first}
                            h={PLAYER_SIZES.first}
                        />
                    </Box>
                    <Link to={`/profile/${firstPlace.name}`}>
                        <Text fontWeight={600} fontSize="lg">
                            {firstPlace.name}
                        </Text>
                    </Link>
                </VStack>
            )}

            <HStack gap={8} align="start" justify="center">
                {secondAndThird.map((player, index) => (
                    <VStack key={player.id} gap={3}>
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
                                player={player}
                                w={PLAYER_SIZES.other}
                                h={PLAYER_SIZES.other}
                            />
                        </Box>
                        <Link to={`/profile/${player.name}`}>
                            <Text fontWeight={600} fontSize="lg">
                                {player.name}
                            </Text>
                        </Link>
                    </VStack>
                ))}
            </HStack>
        </VStack>
    );
};
