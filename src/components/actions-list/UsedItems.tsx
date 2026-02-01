import type { ActionRecord } from '@shared/types/action';
import type { ItemRecord } from '@shared/types/item';
import { For, Spinner, Text } from '@chakra-ui/react';
import { useAppContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';
import { ItemIcon } from '@components/items/ItemIcon';

interface UsedItemsProps {
    action: ActionRecord;
}

export const UsedItems = ({ action }: UsedItemsProps) => {
    const { pb } = useAppContext();

    const items = useQuery({
        queryFn: () => pb.collection('items').getFullList<ItemRecord>(),
        enabled: !!action.used_items && !!action.used_items.length,
        queryKey: [...queryKeys.items, 'used-items'],
        refetchOnWindowFocus: false,
    });

    if (!items.isEnabled) return null;
    if (items.isPending) return <Spinner />;
    if (items.isError) return <Text>Не удалось получить список использованных предметов.</Text>;

    const itemsMap = new Map(items.data.map(item => [item.id, item]));
    const itemsList = action.used_items.map(id => itemsMap.get(id)!);

    return (
        <For each={itemsList}>
            {(item, index) => <ItemIcon item={item} key={index} w={14} h={14} />}
        </For>
    );
};
