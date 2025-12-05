import { Modal } from '@ui/modal';
import { Button } from '@ui/button';
import { Flex } from '@chakra-ui/react';
import { ActionTextEditor } from '../../../profile/ActionTextEditor';

export const DoneModal = () => {
    return (
        <Modal lazyMount title="I tried so hard..." trigger={<Button>Завершить</Button>} size="xl">
            <Flex direction="column" w="100%" h="15vw">
                <ActionTextEditor placeholder="Введите комментарий..." />
            </Flex>
        </Modal>
    );
};
