import { type FC, useMemo } from 'react';
import { useAppContext } from '@context/AppContextProvider/AppContextProvider';
import { ActionFactory } from './actions/action-factory';
import { Flex, For } from '@chakra-ui/react';

export const UserMenu: FC = () => {
    const { availableActions } = useAppContext();
    const actions = useMemo(() => {
        return ActionFactory.getAvailableActions(availableActions);
    }, [availableActions]);

    return (
        <Flex position="fixed" bottom={0} zIndex={100} py={10} justify="center" align="center">
            <For each={actions}>{action => action.buttonNode()}</For>
        </Flex>
    );
};
