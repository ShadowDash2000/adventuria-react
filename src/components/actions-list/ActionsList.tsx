import { Box, Flex, For, Spinner, Text } from '@chakra-ui/react';
import type { ClientResponseError } from 'pocketbase';
import { useInView } from 'react-intersection-observer';
import { PlayerAction } from './PlayerAction';
import { useActionsListContext } from './ActionsListContext';

export const ActionsList = () => {
    const { pages, error, isPending, isError, isFetchingNextPage, fetchNextPage } =
        useActionsListContext();

    const { ref: bottomRef } = useInView({
        onChange: inView => {
            if (inView) void fetchNextPage();
        },
        trackVisibility: true,
        delay: 100,
    });

    if (isPending) {
        return null;
    }

    if (isError) {
        return (
            <Flex justify="center">
                <Text>Error: {(error as ClientResponseError).message}</Text>
            </Flex>
        );
    }

    return (
        <>
            <For each={pages}>
                {list => list.items.map(action => <PlayerAction key={action.id} action={action} />)}
            </For>
            <div ref={bottomRef} style={{ height: '10px' }} />
            <Box minH="32px" display="flex" alignItems="center" justifyContent="center">
                {isFetchingNextPage ? <Spinner /> : null}
            </Box>
        </>
    );
};
