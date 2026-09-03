import { For, HStack, Image, Spinner, Text, VStack } from '@chakra-ui/react';
import { useAppAuthContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { invalidateGameState, queryKeys } from '@shared/queryClient';
import { ItemInfo } from '@components/actions/roll-wheel/items-wheel/ItemInfo';
import { useEffect, useRef, useState } from 'react';
import {
    WheelOFortune,
    type WheelOFortuneHandle,
} from '@components/actions/roll-wheel/WheelOFortune';
import { useWheel, type SpinResult } from '@components/actions/roll-wheel/useWheel';
import { SliderDebounced } from '@ui/slider-debounced';
import { AudioKey, useAudioPlayer } from '@shared/hook/useAudio';
import { Button } from '@theme/button';
import { Flex } from '@theme/flex';
import type { RecordIdString } from '@shared/types/pocketbase';

export const Content = () => {
    const { pb } = useAppAuthContext();
    const wheelRef = useRef<WheelOFortuneHandle>(null);
    const { volume, setVolume } = useAudioPlayer(AudioKey.music);
    const [wasSpinned, setWasSpinned] = useState(false);

    const wheelView = useQuery({
        queryFn: async () => {
            const res = await getWheelView(pb.authStore.token);

            if (!res.success) {
                throw new Error(res.message);
            }

            return res;
        },
        queryKey: [...queryKeys.activityWheel],
        refetchOnWindowFocus: false,
    });

    const audioPresetFilter = wheelView.data?.data?.audio_preset_id
        ? { audioPresetId: wheelView.data.data.audio_preset_id }
        : { audioPresetSlug: 'roll-items' };

    const { spinning, handleSpin, currentItemIndex, setCurrentItemIndex, audioPreset } = useWheel({
        wheelRef,
        enabled: wheelView.isSuccess,
        spinRequest: () => rollItemOnCellRequest(pb.authStore.token),
        onSpinComplete: async () => {
            await invalidateGameState();
        },
        ...audioPresetFilter,
    });

    useEffect(() => {
        if (spinning) {
            setWasSpinned(true);
        }
    }, [spinning]);

    if (wheelView.isPending || audioPreset.isPending) return <Spinner />;
    if (wheelView.isError) return <Text color="red.500">{wheelView.error.message}</Text>;
    if (audioPreset.isError)
        return <Text color="red.500">Error: {audioPreset.error?.message}</Text>;

    const wheelItems = wheelView.data
        ? wheelView.data.data.items.map(item => ({
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
                <ItemInfo item={wheelView.data.data.items[currentItemIndex]} />
            </Flex>
            <VStack gap={3} justify="center">
                <WheelOFortune ref={wheelRef} items={wheelItems} />
                <VStack w="full" gap={3} justify="center">
                    <Button disabled={spinning || wasSpinned} onClick={handleSpin}>
                        Крутить
                    </Button>
                    <SliderDebounced
                        w="full"
                        value={volume}
                        setValue={val => setVolume(val)}
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

const rollItemOnCellRequest = async (authToken: string) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/roll-item-on-cell`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
    });

    return (await res.json()) as SpinResult;
};

type ItemView = {
    id: RecordIdString;
    collectionName: string;
    name: string;
    icon: string;
    description: string;
    type: string;
};

type GetWheelViewData = { items: ItemView[]; audio_preset_id?: string };

type GetWheelViewSuccess = {
    success: true;
    data: GetWheelViewData;
    message?: string;
    error?: never;
};

type GetWheelViewError = { success: false; data: never; message: string; error: string };

type GetWheelViewResult = GetWheelViewSuccess | GetWheelViewError;

const getWheelView = async (authToken: string) => {
    const res = await fetch(
        `${import.meta.env.VITE_PB_URL}/api/action-view?action=roll_item_on_cell`,
        { method: 'GET', headers: { Authorization: `Bearer ${authToken}` } },
    );

    return (await res.json()) as GetWheelViewResult;
};
