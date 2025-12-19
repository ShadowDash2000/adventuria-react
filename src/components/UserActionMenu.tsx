import { useMemo } from 'react';
import { useAppContext } from '@context/AppContext';
import { ActionFactory } from './actions/action-factory';
import { Flex, For } from '@chakra-ui/react';

export const UserActionMenu = () => {
    const { availableActions } = useAppContext();
    const actions = useMemo(() => {
        return ActionFactory.getAvailableActions(availableActions);
    }, [availableActions]);

    return (
        <Flex
            position="fixed"
            left="50%"
            transform="translateX(-50%)"
            bottom={0}
            zIndex={100}
            mb={10}
            justify="center"
            align="center"
        >
            <For each={actions}>{action => action.buttonNode()}</For>
        </Flex>
    );
};
