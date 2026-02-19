import { For, HStack, Image, Spinner, Text, VStack } from '@chakra-ui/react';
import { useAppAuthContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import type { ActivityRecord } from '@shared/types/activity';
import { ActivityInfo } from './ActivityInfo';
import { useEffect, useRef, useState } from 'react';
import { WheelOFortune, type WheelOFortuneHandle } from '../WheelOFortune';
import { useWheel, type SpinResult } from '../useWheel';
import { SliderDebounced } from '@ui/slider-debounced';
import { AudioKey, useAudioPlayer } from '@shared/hook/useAudio';
import { Button } from '@theme/button';
import { Flex } from '@theme/flex';
import { queryKeys } from '@shared/queryClient';

export const ActivitiesWheelContent = () => {
    const { pb } = useAppAuthContext();
    const wheelRef = useRef<WheelOFortuneHandle>(null);
    const { volume, setVolume, setVolumeImmediate } = useAudioPlayer(AudioKey.music);
    const [wasSpinned, setWasSpinned] = useState(false);

    const wheelVariants = useQuery({
        queryFn: () => getWheelVariants(pb.authStore.token),
        queryKey: [...queryKeys.activityWheel],
        refetchOnWindowFocus: false,
    });

    const audioPresetFilter = wheelVariants.data?.data?.audio_preset_id
        ? { audioPresetId: wheelVariants.data.data.audio_preset_id }
        : { audioPresetSlug: 'roll-wheel' };

    const { spinning, handleSpin, currentItemIndex, setCurrentItemIndex, audioPreset } = useWheel({
        wheelRef,
        enabled: wheelVariants.isSuccess,
        spinRequest: () => rollWheelRequest(pb.authStore.token),
        ...audioPresetFilter,
    });

    useEffect(() => {
        if (spinning) {
            setWasSpinned(true);
        }
    }, [spinning]);

    if (wheelVariants.isPending || audioPreset.isPending) return <Spinner />;
    if (wheelVariants.isError) return <Text>Error: {wheelVariants.error?.message}</Text>;
    if (audioPreset.isError) return <Text>Error: {audioPreset.error?.message}</Text>;

    const wheelItems = wheelVariants.data
        ? wheelVariants.data.data.items.map(activity => ({
              key: activity.id,
              image: activity.cover || pb.files.getURL(activity, activity.cover_alt),
              title: activity.name,
          }))
        : [];
    const currentActivity = wheelVariants.data.data.items[currentItemIndex];

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
                {currentActivity && <ActivityInfo activity={currentActivity} />}
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
    if (!res.ok) {
        const error = await res
            .json()
            .then(res => res.error)
            .catch(() => '');
        const text = await res.text().catch(() => '');
        throw new Error(error || text || `Failed to roll wheel`);
    }

    return (await res.json()) as SpinResult;
};

type GetWheelVariantsData = { items: ActivityRecord[]; audio_preset_id?: string };

type GetWheelVariantsSuccess = { success: true; data: GetWheelVariantsData; error?: never };

type GetWheelVariantsError = { success: false; data: never; error: string };

type GetWheelVariantsResult = GetWheelVariantsSuccess | GetWheelVariantsError;

const getWheelVariants = async (authToken: string) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/action-variants?action=rollWheel`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!res.ok) {
        const error = await res
            .json()
            .then(res => res.error)
            .catch(() => '');
        const text = await res.text().catch(() => '');
        throw new Error(error || text || `Failed to get wheel variants`);
    }

    return (await res.json()) as GetWheelVariantsResult;
};
