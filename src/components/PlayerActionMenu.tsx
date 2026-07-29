import { useAppContext } from '@context/AppContext';
import { ActionFactory } from './actions/action-factory';
import { Flex, For, Spinner, Text } from '@chakra-ui/react';
import { MotionBox } from '@shared/components/MotionBox';

export const PlayerActionMenu = () => {
    const {
        availableActions,
        isAvailableActionsPending,
        isAvailableActionsError,
        availableActionsError,
    } = useAppContext();
    const actions = ActionFactory.getAvailableActions(availableActions);

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
            {(isAvailableActionsPending && <Spinner />) ||
                (isAvailableActionsError && <Text>{availableActionsError.message}</Text>) || (
                    <For each={actions}>
                        {(action, key) => (
                            <MotionBox key={key} whileHover={{ scale: 1.1 }}>
                                {action.buttonNode()}
                            </MotionBox>
                        )}
                    </For>
                )}
        </Flex>
    );
};
