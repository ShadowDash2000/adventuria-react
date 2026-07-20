import { VStack } from '@chakra-ui/react';
import { EventLeaders } from '@components/event-stats/EventLeaders';
import { EventStatsButton } from '@components/event-stats/EventStatsButton';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';

export const EventSummary = () => {
    const isEventEnded = useQuery({
        queryFn: async () => {
            const res = await getIsEventEnded();

            if (!res.success) {
                throw new Error(res.message);
            }

            return res.data;
        },
        queryKey: [...queryKeys.isEventEnded, 'event-summary'],
    });

    if (isEventEnded.isPending) {
        return null;
    }

    if (isEventEnded.isError) {
        return null;
    }

    if (!isEventEnded.data) {
        return null;
    }

    return (
        <VStack>
            <EventLeaders mt={6} />
            <EventStatsButton fontSize="xl" />
        </VStack>
    );
};

type IsEventEndedSuccess = { success: true; data: boolean; message?: string; error?: never };

type IsEventEndedError = { success: false; data: never; message: string; error: string };

type IsEventEndedResult = IsEventEndedSuccess | IsEventEndedError;

const getIsEventEnded = async (): Promise<IsEventEndedResult> => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/event-ended`, { method: 'GET' });

    return (await res.json()) as IsEventEndedResult;
};
