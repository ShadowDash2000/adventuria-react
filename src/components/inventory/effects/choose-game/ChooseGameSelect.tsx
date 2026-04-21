import { useQuery } from '@tanstack/react-query';
import { useAppAuthContext } from '@context/AppContext';
import { Portal, Select, useListCollection } from '@chakra-ui/react';
import { useEffect } from 'react';
import { latestActionQuery, queryKeys } from '@shared/queryClient';
import type { ActivityRecord } from '@shared/types/activity';
import { activitySchema, pbCollections } from '@shared/pbSchema';

export const ChooseGameSelect = () => {
    const { pb, player } = useAppAuthContext();

    const { collection, set: setCollection } = useListCollection<ActivityRecord>({
        initialItems: [],
        itemToString: item => item.name,
        itemToValue: item => item.id,
    });

    const latestAction = useQuery(latestActionQuery(pb, player.id));

    const games = useQuery({
        queryFn: () =>
            pb
                .collection(pbCollections.activities)
                .getFullList<ActivityRecord>({
                    filter: latestAction
                        .data!.items_list.map(id => `${activitySchema.id}="${id}"`)
                        .join('||'),
                }),
        enabled: latestAction.isSuccess,
        queryKey: [...queryKeys.activities, latestAction.data],
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
