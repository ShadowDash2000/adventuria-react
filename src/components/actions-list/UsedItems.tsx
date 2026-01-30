import type { ActionRecord } from '@shared/types/action';
import type { ItemRecord } from '@shared/types/item';
import { For, Image, Spinner, Text } from '@chakra-ui/react';
import { useAppContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { GlossaryItemDetailModal } from '@components/glossary/GlossaryItemDetailModal';
import { queryKeys } from '@shared/queryClient';

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
            {(item, index) => (
                <GlossaryItemDetailModal item={item} key={index}>
                    <Image
                        src={pb.files.getURL(item, item.icon)}
                        w={14}
                        h={14}
                        _hover={{ cursor: 'pointer' }}
                    />
                </GlossaryItemDetailModal>
            )}
        </For>
    );
};
