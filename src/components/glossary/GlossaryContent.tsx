import { useAppContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';
import type { ItemRecord } from '@shared/types/item';
import NotFound from '@components/pages/404';
import { For, Grid, GridItem, type GridProps, Spinner, Text } from '@chakra-ui/react';
import type { ClientResponseError } from 'pocketbase';
import { GlossaryItem } from './GlossaryItem';

export const GlossaryContent = ({ ...props }: GridProps) => {
    const { pb } = useAppContext();

    const items = useQuery({
        queryFn: () =>
            pb.collection('items').getFullList<ItemRecord>({ filter: 'type != "neutral"' }),
        queryKey: [...queryKeys.items, 'glossary'],
        refetchOnWindowFocus: false,
    });

    if (items.isPending) {
        return <Spinner />;
    }

    if (items.isError) {
        const e = items.error as ClientResponseError;
        if (e.status === 404) return <NotFound />;

        return <Text>Error: {e.message}</Text>;
    }

    return (
        <Grid {...props}>
            <For each={items.data}>
                {item => (
                    <GridItem key={item.id}>
                        <GlossaryItem item={item} />
                    </GridItem>
                )}
            </For>
        </Grid>
    );
};
