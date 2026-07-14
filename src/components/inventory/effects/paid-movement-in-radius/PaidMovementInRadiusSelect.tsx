import { useAppAuthContext } from '@context/AppContext';
import { Portal, Select, useListCollection } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { RecordIdString } from '@shared/types/pocketbase';

interface PaidMovementInRadiusSelectProps {
    effectId: RecordIdString;
}

export const PaidMovementInRadiusSelect = ({ effectId }: PaidMovementInRadiusSelectProps) => {
    const { pb } = useAppAuthContext();

    const { collection, set: setCollection } = useListCollection<CellView>({
        initialItems: [],
        itemToString: item => item.name,
        itemToValue: item => item.id,
    });

    const cells = useQuery({
        queryFn: () => getEffectView(pb.authStore.token, effectId),
        queryKey: ['paid-movement-in-radius', effectId],
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        setCollection(cells.data?.data || []);
    }, [cells.data]);

    return (
        <Select.Root collection={collection} name="cell_id" required>
            <Select.HiddenSelect />
            <Select.Label>Выберите клетку</Select.Label>
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder="Выберите клетку" />
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

type CellView = { id: RecordIdString; name: string };

type GetEffectViewSuccess = { success: true; data: CellView[]; message?: string; error?: never };

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
