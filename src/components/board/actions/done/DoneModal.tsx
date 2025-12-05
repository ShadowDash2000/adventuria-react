import { Modal } from '@ui/modal';
import { Button } from '@ui/button';
import { ButtonGroup, Flex } from '@chakra-ui/react';
import { ActionTextEditor } from '../../../profile/ActionTextEditor';
import { useCallback, useState } from 'react';
import { Content } from '@tiptap/react';
import { useAppContext } from '@context/AppContextProvider/AppContextProvider';

export const DoneModal = () => {
    const { pb, availableActions, refetchActions } = useAppContext();
    const [content, setContent] = useState<Content | undefined>(null);
    const [actionType, setActionType] = useState<string>('');
    const [openConfirm, setOpenConfirm] = useState(false);
    const [titleConfirm, setTitleConfirm] = useState('');

    const handleDone = useCallback(
        async (actionType: string) => {
            const res = await doneRequest(pb.authStore.token, actionType, content);

            if (!res.success) return;

            await refetchActions();
        },
        [pb, content],
    );

    return (
        <Modal
            lazyMount
            title="I tried so hard... И дропнул кал!"
            trigger={<Button>Завершить</Button>}
            size="xl"
        >
            <Flex direction="column" w="100%" h="15vw" align="center" gap={4}>
                <ActionTextEditor
                    placeholder="Введите комментарий..."
                    content={content}
                    setContent={setContent}
                />
                <ButtonGroup>
                    {availableActions.includes('drop') && (
                        <Button
                            colorPalette="red"
                            onClick={() => {
                                setActionType('drop');
                                setTitleConfirm('Вы уверены, что хотите дропнуть?');
                                setOpenConfirm(true);
                            }}
                        >
                            Дроп
                        </Button>
                    )}
                    {availableActions.includes('reroll') && (
                        <Button
                            colorPalette="blue"
                            onClick={() => {
                                setActionType('reroll');
                                setTitleConfirm('Вы уверены, что хотите рерольнуть?');
                                setOpenConfirm(true);
                            }}
                        >
                            Реролл
                        </Button>
                    )}
                    {availableActions.includes('done') && (
                        <Button
                            colorPalette="green"
                            onClick={() => {
                                setActionType('done');
                                setTitleConfirm('Вы уверены, что хотите завершить?');
                                setOpenConfirm(true);
                            }}
                        >
                            Завершить
                        </Button>
                    )}
                </ButtonGroup>
            </Flex>
            <Modal
                lazyMount
                unmountOnExit
                open={openConfirm}
                onOpenChange={e => setOpenConfirm(e.open)}
                title={titleConfirm}
            >
                <ButtonGroup>
                    <Button colorPalette="red" onClick={() => setOpenConfirm(false)}>
                        Отмена
                    </Button>
                    <Button colorPalette="green" onClick={() => handleDone(actionType)}>
                        Подтвердить
                    </Button>
                </ButtonGroup>
            </Modal>
        </Modal>
    );
};

type DoneSuccess = { success: true; error?: never };

type DoneError = { success: false; error: string };

type DoneResult = DoneSuccess | DoneError;

const doneRequest = async (authToken: string, actionType: string, comment?: Content) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/${actionType}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: comment }),
    });
    if (!res.ok) {
        const error = await res
            .json()
            .then(res => res.error)
            .catch(() => '');
        const text = await res.text().catch(() => '');
        throw new Error(error || text || `Failed to perform action`);
    }

    return (await res.json()) as DoneResult;
};
