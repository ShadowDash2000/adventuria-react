import { useQuery } from '@tanstack/react-query';
import { useAppAuthContext } from '@context/AppContext';
import { Portal, Select, useListCollection } from '@chakra-ui/react';
import { useEffect } from 'react';
import type { RecordIdString } from '@shared/types/pocketbase';

interface ChooseActivitySelectProps {
    effectId: RecordIdString;
}

export const ChooseActivitySelect = ({ effectId }: ChooseActivitySelectProps) => {
    const { pb } = useAppAuthContext();

    const { collection, set: setCollection } = useListCollection<ActivityView>({
        initialItems: [],
        itemToString: item => item.name,
        itemToValue: item => item.id,
    });

    const activities = useQuery({
        queryFn: () => getEffectView(pb.authStore.token, effectId),
        queryKey: ['choose-activity', effectId],
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        setCollection(activities.data?.data || []);
    }, [activities.data]);

    return (
        <Select.Root collection={collection} name="activity_id" required>
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

type ActivityView = { id: RecordIdString; name: string };

type GetEffectViewSuccess = {
    success: true;
    data: ActivityView[];
    message?: string;
    error?: never;
};

type GetEffectViewError = { success: false; data: never; message: string; error: string };

type GetEffectViewResult = GetEffectViewSuccess | GetEffectViewError;

const getEffectView = async (authToken: string, effectId: RecordIdString) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/effect-view`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ effect_id: effectId }),
    });

    return (await res.json()) as GetEffectViewResult;
};
