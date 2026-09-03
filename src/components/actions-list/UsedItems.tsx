import type { ItemRecord } from '@shared/types/item';
import { For, Spinner, Text } from '@chakra-ui/react';
import { useAppContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';
import { ItemIcon } from '@components/items/ItemIcon';
import { pbCollections } from '@shared/pbSchema';

interface UsedItemsProps {
    ids: string[];
}

export const UsedItems = ({ ids }: UsedItemsProps) => {
    const { pb } = useAppContext();

    const items = useQuery({
        queryFn: () => pb.collection(pbCollections.items).getFullList<ItemRecord>(),
        queryKey: [...queryKeys.items, 'used-items'],
        refetchOnWindowFocus: false,
    });

    if (items.isPending) return <Spinner />;
    if (items.isError) return <Text>Не удалось получить список использованных предметов.</Text>;

    const itemsMap = new Map(items.data.map(item => [item.id, item]));
    const itemsList = ids.map(id => itemsMap.get(id)!);

    return (
        <For each={itemsList}>
            {(item, index) => (
                <ItemIcon
                    itemId={item.id}
                    description={item.description}
                    src={pb.files.getURL(item, item.icon)}
                    key={index}
                    w={14}
                    h={14}
                />
            )}
        </For>
    );
};
