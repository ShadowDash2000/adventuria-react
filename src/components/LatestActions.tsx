import { useCollectionListInfinite } from '@context/CollectionListInfiniteContext';
import type { ActionRecord } from '@shared/types/action';
import { UserAction } from './profile/UserAction';
import { Flex, For, Heading } from '@chakra-ui/react';
import { useInView } from 'react-intersection-observer';

export const LatestActions = () => {
    const {
        data: actions,
        isFetching,
        hasNextPage,
        fetchNextPage,
    } = useCollectionListInfinite<ActionRecord>();

    const { ref: bottomRef } = useInView({
        onChange: async inView => {
            if (inView && hasNextPage && !isFetching) {
                await fetchNextPage();
            }
        },
        trackVisibility: true,
        delay: 100,
    });

    return (
        <Flex direction="column" gap={5} align="center">
            <Heading size="2xl">Последние ходы</Heading>
            <For each={actions.pages}>
                {list => list.items.map(action => <UserAction key={action.id} action={action} />)}
            </For>
            <div ref={bottomRef}></div>
        </Flex>
    );
};
