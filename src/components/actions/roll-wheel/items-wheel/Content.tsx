import { For, HStack, Image, Spinner, Text, VStack } from '@chakra-ui/react';
import { useAppAuthContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { invalidateGameState, invalidatePlayerProgress, queryKeys } from '@shared/queryClient';
import { ItemInfo } from './ItemInfo';
import { useRef, useState } from 'react';
import { WheelOFortune, type WheelOFortuneHandle } from '../WheelOFortune';
import { useWheel, type SpinResult } from '../useWheel';
import { SliderDebounced } from '@ui/slider-debounced';
import { AudioKey, useAudioPlayer } from '@shared/hook/useAudio';
import { Button } from '@theme/button';
import { Flex } from '@theme/flex';
import type { ItemView } from '@components/actions/roll-wheel/items-wheel/view';

export const Content = () => {
    const {
        pb,
        playerId,
        gameState,
        isGameStateSuccess,
        isGameStatePending,
        isGameStateError,
        gameStateError,
    } = useAppAuthContext();
    const [loading, setLoading] = useState(false);
    const wheelRef = useRef<WheelOFortuneHandle>(null);
    const { volume, setVolume, setVolumeImmediate } = useAudioPlayer(AudioKey.music);

    const wheelView = useQuery({
        queryFn: () => getWheelView(pb.authStore.token),
        queryKey: [...queryKeys.itemsWheel],
        refetchOnWindowFocus: false,
    });

    const { spinning, handleSpin, currentItemIndex, setCurrentItemIndex, audioPreset } = useWheel({
        wheelRef,
        spinRequest: () => rollWheelRequest(pb.authStore.token),
        audioPresetSlug: 'roll-items',
        onSpinComplete: async () => {
            await invalidateGameState();
            await invalidatePlayerProgress(playerId);
        },
    });

    if (isGameStatePending || wheelView.isPending || audioPreset.isPending) return <Spinner />;
    if (isGameStateError) return <Text>Error: {gameStateError?.message}</Text>;
    if (wheelView.isError) return <Text>Error: {wheelView.error?.message}</Text>;
    if (audioPreset.isError) return <Text>Error: {audioPreset.error?.message}</Text>;

    const wheelItems = wheelView.data
        ? wheelView.data.data.map(item => ({
              key: item.id,
              image: pb.files.getURL(item, item.icon),
              title: item.name,
          }))
        : [];

    return (
        <>
            <Flex
                variant="solid"
                flexDir="column"
                justifyContent="space-around"
                h="vh"
                w={500}
                pt={2}
                px={4}
            >
                <ItemInfo item={wheelView.data.data[currentItemIndex]} />
            </Flex>
            <VStack gap={3} justify="center">
                <WheelOFortune ref={wheelRef} items={wheelItems} />
                <VStack w="full" gap={3} justify="center">
                    <Button
                        loading={loading}
                        disabled={
                            spinning || !isGameStateSuccess || gameState.item_wheels_count === 0
                        }
                        onClick={async () => {
                            try {
                                setLoading(true);
                                await handleSpin();
                            } catch (e) {
                                console.error(e);
                            } finally {
                                setLoading(false);
                            }
                        }}
                    >
                        {`Крутить (x${gameState?.item_wheels_count})`}
                    </Button>
                    <SliderDebounced
                        w="full"
                        value={volume}
                        setValue={val => setVolume(val)}
                        onValueChangeImmediate={val => setVolumeImmediate(val)}
                        commitMode="end"
                        label="Громкость"
                        colorPalette="orange"
                    />
                </VStack>
            </VStack>
            <Flex variant="solid" h="vh" overflowY="hidden">
                <VStack
                    h="vh"
                    minW={400}
                    maxW={450}
                    gap={2}
                    py={4}
                    alignItems="stretch"
                    overflowY="scroll"
                >
                    <For each={wheelItems}>
                        {(item, index) => (
                            <HStack
                                key={item.key}
                                h={20}
                                align="center"
                                gap={4}
                                cursor="pointer"
                                px={4}
                                onClick={() => {
                                    setCurrentItemIndex(index);
                                }}
                                _hover={{ bg: 'grey' }}
                                bg={currentItemIndex === index ? 'black' : ''}
                            >
                                <Image src={item.image} h="100%" pointerEvents="none" />
                                <Text pointerEvents="none">{item.title}</Text>
                            </HStack>
                        )}
                    </For>
                </VStack>
            </Flex>
        </>
    );
};

const rollWheelRequest = async (authToken: string) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/roll-item`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
    });

    return (await res.json()) as SpinResult;
};

type GetWheelViewSuccess = { success: true; data: ItemView[]; message?: string; error?: never };

type GetWheelViewError = { success: false; data: never; message: string; error: string };

type GetWheelViewResult = GetWheelViewSuccess | GetWheelViewError;

const getWheelView = async (authToken: string) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/action-view?action=roll_item`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${authToken}` },
    });

    return (await res.json()) as GetWheelViewResult;
};
