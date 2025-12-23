import { For, HStack, Image, Spinner, Text, VStack } from '@chakra-ui/react';
import { useAppAuthContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import type { ActionRecord } from '@shared/types/action';
import type { GameRecord } from '@shared/types/game';
import { WheelGameInfo } from './WheelGameInfo';
import { useEffect, useRef, useState } from 'react';
import { WheelOFortune, type WheelOFortuneHandle } from '../WheelOFortune';
import { useWheel, type SpinResult } from '../useWheel';
import { SliderDebounced } from '@ui/slider-debounced';
import { AudioKey, useAudioPlayer } from '@shared/hook/useAudio';
import { Button } from '@theme/button';
import { Flex } from '@theme/flex';

export const GamesWheelContent = () => {
    const { pb, user } = useAppAuthContext();
    const wheelRef = useRef<WheelOFortuneHandle>(null);
    const { volume, setVolume } = useAudioPlayer(AudioKey.music);
    const [wasSpinned, setWasSpinned] = useState(false);

    const action = useQuery({
        queryFn: () =>
            pb
                .collection('actions')
                .getFirstListItem<ActionRecord>(`user = "${user.id}"`, {
                    sort: '-created',
                    fields: 'items_list',
                }),
        refetchOnWindowFocus: false,
        queryKey: ['action'],
    });

    const games = useQuery({
        queryFn: () =>
            pb
                .collection('games')
                .getFullList<GameRecord>({
                    filter: action.data!.items_list.map(id => `id="${id}"`).join('||'),
                    expand: 'platforms,developers,publishers,genres,tags',
                }),
        refetchOnWindowFocus: false,
        enabled: action.isSuccess,
        queryKey: [action],
    });

    const { spinning, handleSpin, currentItemIndex, setCurrentItemIndex, audioPreset } = useWheel({
        wheelRef,
        spinRequest: () => rollWheelRequest(pb.authStore.token),
        audioPresetSlug: 'roll-wheel',
    });

    useEffect(() => {
        if (spinning) {
            setWasSpinned(true);
        }
    }, [spinning]);

    if (action.isPending || games.isPending || audioPreset.isPending) return <Spinner />;
    if (action.isError) return <Text>Error: {action.error?.message}</Text>;
    if (games.isError) return <Text>Error: {games.error?.message}</Text>;
    if (audioPreset.isError) return <Text>Error: {audioPreset.error?.message}</Text>;

    const wheelItems = games.data
        ? games.data.map(game => ({ key: game.id, image: game.cover, title: game.name }))
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
                <WheelGameInfo game={games.data[currentItemIndex]} />
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
                                data-active={currentItemIndex === index}
                                h={20}
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
