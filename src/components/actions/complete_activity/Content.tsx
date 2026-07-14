import {
    ButtonGroup,
    CloseButton,
    Dialog,
    Flex,
    Heading,
    Portal,
    Spinner,
    Text,
    VStack,
} from '@chakra-ui/react';
import { Button } from '@theme/button';
import { Content as TipTapContent } from '@tiptap/react';
import { useAppContext } from '@context/AppContext';
import { useState } from 'react';
import { handleApiResponse } from '@shared/helpers/api';
import { invalidateAllActions, invalidatePlayerProgressAuth, queryKeys } from '@shared/queryClient';
import { useQuery } from '@tanstack/react-query';
import { ActionTextEditor } from '@components/profile/ActionTextEditor';
import { ReviewRating } from '@shared/components/ReviewRating';
import { LuBatteryFull } from 'react-icons/lu';

export const Content = () => {
    const { pb, availableActions } = useAppContext();
    const [content, setContent] = useState<TipTapContent | undefined>(null);
    const [actionType, setActionType] = useState<string>('');
    const [openConfirm, setOpenConfirm] = useState(false);
    const [titleConfirm, setTitleConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [score, setScore] = useState<number>(3);

    const handleDone = async (actionType: string) => {
        const res = await doneRequest(pb.authStore.token, actionType, content ?? '', score);

        if (!handleApiResponse(res)) {
            return;
        }

        await invalidateAllActions();
        await invalidatePlayerProgressAuth();
    };

    const activityView = useQuery({
        queryFn: async () => {
            const res = await getCompleteActivityView(pb.authStore.token);

            if (!res.success) {
                throw new Error(res.message);
            }

            return res;
        },
        queryKey: [...queryKeys.completeActivityView],
        refetchOnWindowFocus: false,
    });

    if (activityView.isPending) {
        return <Spinner />;
    }

    if (activityView.isError) {
        return <Text color="red.500">{activityView.error.message}</Text>;
    }

    return (
        <>
            <Flex direction="column" w="full" align="center" gap={4}>
                <VStack w="full" h="20vw">
                    <ActionTextEditor
                        placeholder="Введите комментарий..."
                        content={content}
                        setContent={setContent}
                    />
                </VStack>
                <VStack w="full" py={4}>
                    <Heading as="h3">Оценка</Heading>
                    <ReviewRating value={score} onValueChange={e => setScore(e.value)} />
                </VStack>
                <ButtonGroup>
                    <Button
                        colorPalette="red"
                        disabled={!availableActions.includes('drop')}
                        onClick={() => {
                            setActionType('drop');
                            setTitleConfirm('Вы уверены, что хотите дропнуть?');
                            setOpenConfirm(true);
                        }}
                    >
                        Дроп
                    </Button>
                    <Button
                        colorPalette="blue"
                        disabled={!availableActions.includes('reroll')}
                        onClick={() => {
                            setActionType('reroll');
                            setTitleConfirm('Вы уверены, что хотите рерольнуть?');
                            setOpenConfirm(true);
                        }}
                    >
                        Реролл
                    </Button>
                    <Button
                        colorPalette="green"
                        disabled={!availableActions.includes('done')}
                        onClick={() => {
                            setActionType('done');
                            setTitleConfirm('Вы уверены, что хотите завершить?');
                            setOpenConfirm(true);
                        }}
                    >
                        Завершить ({activityView.data.data.done_energy_consume} <LuBatteryFull />)
                    </Button>
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
                                        disabled={loading}
                                        colorPalette="red"
                                        onClick={() => setOpenConfirm(false)}
                                    >
                                        Отмена
                                    </Button>
                                    <Button
                                        loading={loading}
                                        disabled={loading}
                                        colorPalette="green"
                                        onClick={async () => {
                                            try {
                                                setLoading(true);
                                                await handleDone(actionType);
                                            } catch (e) {
                                                console.error(e);
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}
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
        </>
    );
};

type DoneSuccess = { success: true; message?: string; error?: never };

type DoneError = { success: false; message: string; error: string };

type DoneResult = DoneSuccess | DoneError;

const doneRequest = async (
    authToken: string,
    actionType: string,
    comment: TipTapContent,
    score: number,
) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/${actionType}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: comment, score: score }),
    });

    return (await res.json()) as DoneResult;
};

type CompleteActivityViewData = { done_energy_consume: number };

type CompleteActivityViewSuccess = {
    success: true;
    data: CompleteActivityViewData;
    message?: string;
    error?: never;
};

type CompleteActivityViewError = { success: false; data: never; message: string; error: never };

type CompleteActivityViewResult = CompleteActivityViewSuccess | CompleteActivityViewError;

const getCompleteActivityView = async (authToken: string) => {
    const res = await fetch(
        `${import.meta.env.VITE_PB_URL}/api/action-view?action=complete_activity`,
        { method: 'GET', headers: { Authorization: `Bearer ${authToken}` } },
    );

    return (await res.json()) as CompleteActivityViewResult;
};
