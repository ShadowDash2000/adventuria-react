import { VStack } from '@chakra-ui/react';
import { EventLeaders } from '@components/event-stats/EventLeaders';
import { EventStatsButton } from '@components/event-stats/EventStatsButton';
import { useAppContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';
import type { SettingsRecord } from '@shared/types/settings';

export const EventSummary = () => {
    const { pb } = useAppContext();

    const settings = useQuery({
        queryFn: () => pb.collection('settings').getFirstListItem<SettingsRecord>(''),
        queryKey: [...queryKeys.settings, 'event-summary'],
    });

    if (settings.isPending) {
        return null;
    }

    if (settings.isError) {
        return null;
    }

    if (!settings.data.event_ended) {
        return null;
    }

    return (
        <VStack>
            <EventLeaders mt={6} />
            <EventStatsButton fontSize="xl" />
        </VStack>
    );
};
