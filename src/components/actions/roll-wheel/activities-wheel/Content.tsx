import { For, HStack, Image, Spinner, Text, VStack } from '@chakra-ui/react';
import { useAppAuthContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { ActivityInfo } from './ActivityInfo';
import { useEffect, useRef, useState } from 'react';
import { WheelOFortune, type WheelOFortuneHandle } from '../WheelOFortune';
import { useWheel, type SpinResult } from '../useWheel';
import { SliderDebounced } from '@ui/slider-debounced';
import { AudioKey, useAudioPlayer } from '@shared/hook/useAudio';
import { Button } from '@theme/button';
import { Flex } from '@theme/flex';
import { queryKeys } from '@shared/queryClient';
import type { ActivityViewDetailed } from '@components/actions/roll-wheel/activities-wheel/view';

export const Content = () => {
    const { pb } = useAppAuthContext();
    const wheelRef = useRef<WheelOFortuneHandle>(null);
    const { volume, setVolume, setVolumeImmediate } = useAudioPlayer(AudioKey.music);
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
        : { audioPresetSlug: 'roll-wheel' };

    const { spinning, handleSpin, currentItemIndex, setCurrentItemIndex, audioPreset } = useWheel({
        wheelRef,
        enabled: wheelView.isSuccess,
        spinRequest: () => rollWheelRequest(pb.authStore.token),
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
        ? wheelView.data.data.items.map(activityView => ({
              key: activityView.activity.id,
              image:
                  activityView.activity.cover ||
                  pb.files.getURL(activityView.activity, activityView.activity.cover_alt),
              title: activityView.activity.name,
          }))
        : [];
    const currentActivity = wheelView.data.data.items[currentItemIndex];

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
                {currentActivity && <ActivityInfo activityView={currentActivity} />}
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
                                data-active={currentItemIndex === index}
                                minH={20}
                                align="center"
                                gap={4}
                                cursor="pointer"
                                px={4}
                                _hover={{ bg: 'grey' }}
                                css={{ '&[data-active=true]': { bg: 'black' } }}
                                onClick={() => {
                                    setCurrentItemIndex(index);
                                }}
                            >
                                <Image
                                    src={item.image}
                                    h="full"
                                    pointerEvents="none"
                                    aspectRatio="2/3"
                                    objectFit="contain"
                                />
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
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/roll-wheel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
    });

    return (await res.json()) as SpinResult;
};

type GetWheelViewData = { items: ActivityViewDetailed[]; audio_preset_id?: string };

type GetWheelViewSuccess = {
    success: true;
    data: GetWheelViewData;
    message?: string;
    error?: never;
};

type GetWheelViewError = { success: false; data: never; message: string; error: string };

type GetWheelViewResult = GetWheelViewSuccess | GetWheelViewError;

const getWheelView = async (authToken: string) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/action-view?action=roll_wheel`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${authToken}` },
    });

    return (await res.json()) as GetWheelViewResult;
};
