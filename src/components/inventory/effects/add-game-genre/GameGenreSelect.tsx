import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useAppContext } from '@context/AppContext';
import type { GenreRecord } from '@shared/types/genre';
import { Combobox, Portal, Spinner, Text, useListCollection } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { ComboboxHiddenInput } from '@ui/combobox-hidden-input';

export const GameGenreSelect = () => {
    const { pb } = useAppContext();
    const [inputValue, setInputValue] = useState('');
    const inputValueDebounced = useDebounce(inputValue, 200);

    const { collection, set } = useListCollection<GenreRecord>({
        initialItems: [],
        itemToString: item => item.name,
        itemToValue: item => item.id,
    });

    const genres = useQuery({
        queryFn: () =>
            pb
                .collection('genres')
                .getList<GenreRecord>(1, 20, {
                    filter: inputValue.length > 0 ? `name ?~ "${inputValueDebounced}"` : '',
                }),
        placeholderData: keepPreviousData,
        queryKey: ['genres', inputValueDebounced],
    });

    useEffect(() => {
        set(genres.data?.items || []);
    }, [genres.data]);

    return (
        <Combobox.Root collection={collection} openOnClick required>
            <ComboboxHiddenInput name="genre_id" required />
            <Combobox.Label>Выберите добавочный жанр</Combobox.Label>
            <Combobox.Control>
                <Combobox.Input
                    placeholder="Поиск жанров"
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
                        {genres.isPending ? (
                            <Spinner />
                        ) : genres.isError ? (
                            <Text>Error: {genres.error?.message}</Text>
                        ) : (
                            <>
                                <Combobox.Empty>Жанры не найдены</Combobox.Empty>
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
