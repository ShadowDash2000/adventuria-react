import { useParams } from 'react-router-dom';
import { useAppContext } from '@context/AppContext';
import { Flex, Spinner, Text } from '@chakra-ui/react';
import { PlayerProfile } from '../profile/PlayerProfile';
import { ActionsList } from '@components/actions-list/ActionsList';
import { ActionsFilter } from '@components/actions-list/ActionsFilter';
import { ActionsListProvider } from '@components/actions-list/ActionsListContext';
import { pbCollections, playerSchema } from '@shared/pbSchema';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';
import type { PlayerRecord } from '@shared/types/player';
import type { ClientResponseError } from 'pocketbase';

const Profile = () => {
    const { pb } = useAppContext();
    const login = useParams().login;

    const player = useQuery({
        queryFn: () =>
            pb
                .collection(pbCollections.players)
                .getFirstListItem<PlayerRecord>(
                    `${playerSchema.name}:lower = "${login?.toLowerCase()}"`,
                ),
        queryKey: [...queryKeys.players, 'player-profile', login],
        refetchOnWindowFocus: false,
    });

    if (player.isPending) {
        return (
            <Flex justify="center" p={6}>
                <Spinner />
            </Flex>
        );
    }

    if (player.isError) {
        const e = player.error as ClientResponseError;
        return <Text>Error: {e.message}</Text>;
    }

    return (
        <Flex w={{ base: '1280px', xlDown: 'vw' }} direction="column" gap="{spacing.5}">
            <PlayerProfile player={player.data} />
            <ActionsListProvider playerId={player.data.id}>
                <ActionsFilter />
                <ActionsList />
            </ActionsListProvider>
        </Flex>
    );
};

export default Profile;
