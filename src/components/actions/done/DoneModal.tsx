import { ButtonGroup, CloseButton, Dialog, Flex, Portal, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { Content } from '@tiptap/react';
import { useAppContext } from '@context/AppContext';
import { LuNotebookPen } from 'react-icons/lu';
import { ActionTextEditor } from '@components/profile/ActionTextEditor';
import { invalidateAllActions, invalidateUser } from '@shared/queryClient';
import { Button } from '@theme/button';

export const DoneModal = () => {
    const { pb, availableActions } = useAppContext();
    const [content, setContent] = useState<Content | undefined>(null);
    const [actionType, setActionType] = useState<string>('');
    const [openConfirm, setOpenConfirm] = useState(false);
    const [titleConfirm, setTitleConfirm] = useState('');

    const handleDone = async (actionType: string) => {
        const res = await doneRequest(pb.authStore.token, actionType, content);

        if (!res.success) return;

        await invalidateAllActions();
        await invalidateUser();
    };

    return (
        <Dialog.Root lazyMount size="xl">
            <Dialog.Trigger asChild>
                <Button colorPalette="green">
                    <LuNotebookPen />
                    Завершить
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop></Dialog.Backdrop>
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>I tried so hard... И дропнул кал!</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Flex direction="column" w="full" align="center" gap={4}>
                                <VStack w="full" h="20vw">
                                    <ActionTextEditor
                                        placeholder="Введите комментарий..."
                                        content={content}
                                        setContent={setContent}
                                    />
                                </VStack>
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
                                                setTitleConfirm(
                                                    'Вы уверены, что хотите рерольнуть?',
                                                );
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
                                                setTitleConfirm(
                                                    'Вы уверены, что хотите завершить?',
                                                );
                                                setOpenConfirm(true);
                                            }}
                                        >
                                            Завершить
                                        </Button>
                                    )}
                                </ButtonGroup>
                            </Flex>
                            <Dialog.Root
                                lazyMount
                                unmountOnExit
                                open={openConfirm}
                                onOpenChange={e => setOpenConfirm(e.open)}
                            >
                                <Dialog.Trigger asChild></Dialog.Trigger>
                                <Portal>
                                    <Dialog.Backdrop></Dialog.Backdrop>
                                    <Dialog.Positioner>
                                        <Dialog.Content>
                                            <Dialog.Header>
                                                <Dialog.Title>{titleConfirm}</Dialog.Title>
                                            </Dialog.Header>
                                            <Dialog.Body>
                                                <ButtonGroup>
                                                    <Button
                                                        colorPalette="red"
                                                        onClick={() => setOpenConfirm(false)}
                                                    >
                                                        Отмена
                                                    </Button>
                                                    <Button
                                                        colorPalette="green"
                                                        onClick={() => handleDone(actionType)}
                                                    >
                                                        Подтвердить
                                                    </Button>
                                                </ButtonGroup>
                                            </Dialog.Body>
                                            <Dialog.CloseTrigger asChild>
                                                <CloseButton size="sm" />
                                            </Dialog.CloseTrigger>
                                        </Dialog.Content>
                                    </Dialog.Positioner>
                                </Portal>
                            </Dialog.Root>
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

type DoneSuccess = { success: true; error?: never };

type DoneError = { success: false; error: string };

type DoneResult = DoneSuccess | DoneError;

const doneRequest = async (authToken: string, actionType: string, comment?: Content) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/${actionType}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: comment || '' }),
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
