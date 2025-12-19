import { Flex as ChakraFlex, For, Image, Text } from '@chakra-ui/react';
import { Flex } from '@ui/flex';
import { LuLoader } from 'react-icons/lu';
import { useAppAuthContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import type { ActionRecord } from '@shared/types/action';
import type { GameRecord } from '@shared/types/game';
import { WheelGameInfo } from './WheelGameInfo';
import { useEffect, useRef, useState } from 'react';
import { WheelOFortune, type WheelOFortuneHandle } from '../WheelOFortune';
import { useWheel, type SpinResult } from '../useWheel';
import { Button } from '@ui/button';
import { SliderDebounced } from '@ui/slider-debounced';
import { AudioKey, useAudioPlayer } from '@shared/hook/useAudio';

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

    if (action.isPending || games.isPending || audioPreset.isPending) return <LuLoader />;
    if (action.isError) return <Text>Error: {action.error?.message}</Text>;
    if (games.isError) return <Text>Error: {games.error?.message}</Text>;
    if (audioPreset.isError) return <Text>Error: {audioPreset.error?.message}</Text>;

    const wheelItems = games.data
        ? games.data.map(game => ({ key: game.id, image: game.cover, title: game.name }))
        : [];

    return (
        <>
            <Flex h="vh" minW={450} justify="center">
                <WheelGameInfo
                    game={games.data[currentItemIndex]}
                    direction="column"
                    justifyContent="space-around"
                    px={4}
                />
            </Flex>
            <ChakraFlex gap={3} direction="column" justify="center">
                <WheelOFortune ref={wheelRef} items={wheelItems} />
                <ChakraFlex gap={3} justify="center" direction="column">
                    <Button disabled={spinning || wasSpinned} onClick={handleSpin}>
                        Крутить
                    </Button>
                    <SliderDebounced
                        value={volume}
                        setValue={val => setVolume(val)}
                        label="Громкость"
                    />
                </ChakraFlex>
            </ChakraFlex>
            <ChakraFlex h="vh" minW={400} maxW={450} flexDir="column" overflowY="scroll">
                <Flex flexDir="column" gap={2} py={4}>
                    <For each={wheelItems}>
                        {(item, index) => (
                            <ChakraFlex
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
                            </ChakraFlex>
                        )}
                    </For>
                </Flex>
            </ChakraFlex>
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
