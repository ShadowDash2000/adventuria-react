import type { SeasonRecord } from '@shared/types/season';
import { useQuery } from '@tanstack/react-query';
import { pbCollections, seasonsSchema } from '@shared/pbSchema';
import { queryKeys } from '@shared/queryClient';
import { useAppContext } from '@context/AppContext';
import { Portal, Select, Spinner, Text, useListCollection } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { EventSeasonStats } from '@components/event-stats/EventSeasonStats';

export const EventStatsContent = () => {
    const { pb } = useAppContext();
    const [currentSeasonId, setCurrentSeasonId] = useState<string | null>(null);
    const { collection, set: setCollection } = useListCollection<SeasonRecord>({
        initialItems: [],
        itemToString: item => item.name,
        itemToValue: item => item.id,
    });

    const seasons = useQuery({
        queryFn: () =>
            pb
                .collection(pbCollections.seasons)
                .getFullList<SeasonRecord>({ sort: `-${seasonsSchema.seasonDateStart}` }),
        queryKey: [...queryKeys.seasons, 'event-stats'],
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (seasons.data) {
            setCurrentSeasonId(seasons.data[0].id);
            setCollection(seasons.data);
        }
    }, [seasons.data]);

    if (seasons.isPending) {
        return <Spinner />;
    }

    if (seasons.isError) {
        return <Text>Error: {seasons.error.message}</Text>;
    }

    if (!currentSeasonId) {
        return null;
    }

    return (
        <>
            <Select.Root
                collection={collection}
                defaultValue={[currentSeasonId]}
                onValueChange={e => setCurrentSeasonId(e.value[0])}
            >
                <Select.HiddenSelect />
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder="Сезон" />
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
            <EventSeasonStats w="full" mb={4} seasonId={currentSeasonId} />
        </>
    );
};
