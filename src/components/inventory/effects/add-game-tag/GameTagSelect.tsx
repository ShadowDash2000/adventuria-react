import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useAppContext } from '@context/AppContext';
import type { TagRecord } from '@shared/types/tag';
import { Combobox, Portal, Text, useListCollection } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { LuLoader } from 'react-icons/lu';
import { useDebounce } from '@uidotdev/usehooks';
import { ComboboxHiddenInput } from '@ui/combobox-hidden-input';

export const GameTagSelect = () => {
    const { pb } = useAppContext();
    const [inputValue, setInputValue] = useState('');
    const inputValueDebounced = useDebounce(inputValue, 200);

    const { collection, set } = useListCollection<TagRecord>({
        initialItems: [],
        itemToString: item => item.name,
        itemToValue: item => item.id,
    });

    const tags = useQuery({
        queryFn: () =>
            pb
                .collection('tags')
                .getList<TagRecord>(1, 20, {
                    filter: inputValue.length > 0 ? `name ?~ "${inputValueDebounced}"` : '',
                }),
        placeholderData: keepPreviousData,
        queryKey: ['tags', inputValueDebounced],
    });

    useEffect(() => {
        set(tags.data?.items || []);
    }, [tags.data]);

    return (
        <Combobox.Root collection={collection} openOnClick required>
            <ComboboxHiddenInput name="tag_id" required />
            <Combobox.Label>Выберите добавочный тег</Combobox.Label>
            <Combobox.Control>
                <Combobox.Input
                    placeholder="Поиск тегов"
                    onChange={e => setInputValue(e.target.value)}
                />
                <Combobox.IndicatorGroup>
                    <Combobox.ClearTrigger />
                    <Combobox.Trigger />
                </Combobox.IndicatorGroup>
            </Combobox.Control>
            <Portal>
                <Combobox.Positioner>
                    <Combobox.Content>
                        {tags.isPending ? (
                            <LuLoader />
                        ) : tags.isError ? (
                            <Text>Error: {tags.error?.message}</Text>
                        ) : (
                            <>
                                <Combobox.Empty>Теги не найдены</Combobox.Empty>
                                {collection.items.map(item => (
                                    <Combobox.Item item={item} key={item.id}>
                                        {item.name}
                                        <Combobox.ItemIndicator />
                                    </Combobox.Item>
                                ))}
                            </>
                        )}
                    </Combobox.Content>
                </Combobox.Positioner>
            </Portal>
        </Combobox.Root>
    );
};
