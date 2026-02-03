import { For, HStack, Image, Spinner, Text, VStack } from '@chakra-ui/react';
import { useAppAuthContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import type { ItemRecord } from '@shared/types/item';
import { invalidateUser } from '@shared/queryClient';
import { WheelItemInfo } from './WheeItemInfo';
import { useRef } from 'react';
import { WheelOFortune, type WheelOFortuneHandle } from '../WheelOFortune';
import { useWheel, type SpinResult } from '../useWheel';
import { SliderDebounced } from '@ui/slider-debounced';
import { AudioKey, useAudioPlayer } from '@shared/hook/useAudio';
import { Button } from '@theme/button';
import { Flex } from '@theme/flex';

export const ItemsWheelContent = () => {
    const { pb, user } = useAppAuthContext();
    const wheelRef = useRef<WheelOFortuneHandle>(null);
    const { volume, setVolume, setVolumeImmediate } = useAudioPlayer(AudioKey.music);

    const items = useQuery({
        queryFn: () =>
            pb.collection('items').getFullList<ItemRecord>({ filter: `isRollable = true` }),
        refetchOnWindowFocus: false,
        queryKey: ['items'],
    });

    const { spinning, handleSpin, currentItemIndex, setCurrentItemIndex, audioPreset } = useWheel({
        wheelRef,
        spinRequest: () => rollWheelRequest(pb.authStore.token),
        audioPresetSlug: 'roll-items',
        onSpinComplete: async () => {
            await invalidateUser();
        },
    });

    if (items.isPending || audioPreset.isPending) return <Spinner />;
    if (items.isError) return <Text>Error: {items.error?.message}</Text>;
    if (audioPreset.isError) return <Text>Error: {audioPreset.error?.message}</Text>;

    const wheelItems = items.data
        ? items.data.map(item => ({
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
                <WheelItemInfo item={items.data[currentItemIndex]} />
            </Flex>
            <VStack gap={3} justify="center">
                <WheelOFortune ref={wheelRef} items={wheelItems} />
                <VStack w="full" gap={3} justify="center">
                    <Button disabled={spinning || user.itemWheelsCount === 0} onClick={handleSpin}>
                        {`Крутить (x${user.itemWheelsCount})`}
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
    if (!res.ok) {
        const error = await res
            .json()
            .then(res => res.error)
            .catch(() => '');
        const text = await res.text().catch(() => '');
        throw new Error(error || text || `Failed to roll item`);
    }

    return (await res.json()) as SpinResult;
};
