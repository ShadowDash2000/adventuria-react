import { useQuery } from '@tanstack/react-query';
import { useAppAuthContext } from '@context/AppContext';
import { Portal, Select, useListCollection } from '@chakra-ui/react';
import { useEffect } from 'react';
import type { ActionRecord } from '@shared/types/action';
import { queryKeys } from '@shared/queryClient';
import type { GameRecord } from '@shared/types/game';

export const ChooseGameSelect = () => {
    const { pb, user } = useAppAuthContext();

    const { collection, set: setCollection } = useListCollection<GameRecord>({
        initialItems: [],
        itemToString: item => item.name,
        itemToValue: item => item.id,
    });

    const latestAction = useQuery({
        queryFn: () =>
            pb
                .collection('actions')
                .getFirstListItem<ActionRecord>(`user = "${user.id}"`, { sort: '-created' }),
        queryKey: [...queryKeys.latestAction, 'choose-game'],
        refetchOnWindowFocus: false,
    });

    const games = useQuery({
        queryFn: () =>
            pb
                .collection('games')
                .getFullList<GameRecord>({
                    filter: latestAction.data!.items_list.map(id => `id="${id}"`).join('||'),
                }),
        enabled: latestAction.isSuccess,
        queryKey: [...queryKeys.games, latestAction.data],
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        setCollection(games.data || []);
    }, [games.data]);

    return (
        <Select.Root collection={collection} name="game_id" required>
            <Select.HiddenSelect />
            <Select.Label>Выберите игру</Select.Label>
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder="Выберите игру" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content>
                        {collection.items.map(item => (
                            <Select.Item item={item} key={item.id}>
                                {item.name}
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
};
