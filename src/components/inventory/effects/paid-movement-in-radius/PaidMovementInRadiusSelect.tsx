import { useAppAuthContext } from '@context/AppContext';
import { Portal, Select, useListCollection } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { RecordIdString } from '@shared/types/pocketbase';
import type { CellRecord } from '@shared/types/cell';

interface PaidMovementInRadiusSelectProps {
    invItemId: RecordIdString;
    effectId: RecordIdString;
}

export const PaidMovementInRadiusSelect = ({
    invItemId,
    effectId,
}: PaidMovementInRadiusSelectProps) => {
    const { pb } = useAppAuthContext();

    const { collection, set: setCollection } = useListCollection<CellRecord>({
        initialItems: [],
        itemToString: item => item.name,
        itemToValue: item => item.id,
    });

    const cells = useQuery({
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/get-item-effect-variants`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${pb.authStore.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inv_item_id: invItemId, effect_id: effectId }),
            });

            const data: CellRecord[] = await res.json();
            return data;
        },
        queryKey: ['paid-movement-in-radius', invItemId, effectId],
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        setCollection(cells.data || []);
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
