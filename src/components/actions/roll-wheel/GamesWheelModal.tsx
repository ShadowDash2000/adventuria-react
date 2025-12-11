import { useAppAuthContext } from '@context/AppContextProvider';
import { useRef, useState } from 'react';
import type { WheelOFortuneHandle } from './WheelOFortune';
import { useQuery } from '@tanstack/react-query';
import type { ActionRecord } from '@shared/types/action';
import type { GameRecord } from '@shared/types/game';
import type { AudioPresetRecord } from '@shared/types/audio-preset';
import { LuFerrisWheel, LuLoader } from 'react-icons/lu';
import { CloseButton, Dialog, Flex as ChakraFlex, Portal, Text } from '@chakra-ui/react';
import type { RecordIdString } from '@shared/types/pocketbase';
import { WheelOFortuneContent } from './WheelOFortuneContent';
import { Button } from '@ui/button';
import { WheelGameInfo } from './WheelGameInfo';
import { Flex } from '@ui/flex';
import { SliderDebounced } from '@ui/slider-debounced';
import { AudioKey, useAudioPlayer } from '@shared/hook/useAudio';
import { invalidateAllActions } from '@shared/queryClient';

export const GamesWheelModal = () => {
    const { pb, user } = useAppAuthContext();
    const { volume, setVolume, play } = useAudioPlayer(AudioKey.music);
    const wheelOFortuneRef = useRef<WheelOFortuneHandle>(null);
    const [open, setOpen] = useState(false);
    const [spinning, setSpinning] = useState(false);
    const [wasSpinned, setWasSpinned] = useState(false);
    const [currentItemIndex, setCurrentItemIndex] = useState(0);

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

    const audioPreset = useQuery({
        queryFn: async () => {
            return pb
                .collection('audio_presets')
                .getFirstListItem<AudioPresetRecord>('slug = "roll-wheel"', {
                    expand: 'audio',
                    fields:
                        'audio,' +
                        'expand.audio.id,expand.audio.collectionName,expand.audio.audio,expand.audio.duration',
                });
        },
        refetchOnWindowFocus: false,
        queryKey: ['roll-wheel-audio-preset'],
    });

    const handleSpin = async () => {
        const ref = wheelOFortuneRef.current;
        if (!ref) return;

        const res = await rollWheelRequest(pb.authStore.token);

        if (!res.success) return;

        let duration = 10;
        if (audioPreset.isSuccess) {
            const randIndex = Math.floor(Math.random() * audioPreset.data.audio.length);
            const randAudio = audioPreset.data.expand!.audio[randIndex];
            duration = randAudio.duration;
            const audioUrl = pb.files.getURL(randAudio, randAudio.audio);
            await play(audioUrl);
        }

        ref.spin({ targetKey: res.data.winnerId, durationMs: duration * 1000 }).then(
            currentIndex => {
                setSpinning(false);
                setCurrentItemIndex(currentIndex);
            },
        );
        setSpinning(true);
        setWasSpinned(true);
    };

    const wheelItems = games.data
        ? games.data.map(game => ({ key: game.id, image: game.cover, title: game.name }))
        : [];

    if (action.isPending || games.isPending || audioPreset.isPending) return <LuLoader />;
    if (action.isError) return <Text>Error: {action.error?.message}</Text>;
    if (games.isError) return <Text>Error: {games.error?.message}</Text>;
    if (audioPreset.isError) return <Text>Error: {audioPreset.error?.message}</Text>;

    return (
        <Dialog.Root
            lazyMount
            unmountOnExit
            open={open}
            onOpenChange={async e => {
                if (!spinning) {
                    setOpen(e.open);
                } else {
                    return;
                }
                if (!e.open && wasSpinned) await invalidateAllActions();
            }}
            size="full"
        >
            <Dialog.Trigger asChild>
                <Button colorPalette="{colors.purple}" hoverColorPalette="{colors.purple.hover}">
                    <LuFerrisWheel />
                    Колесо
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop bg="blackAlpha.300" backdropFilter="blur(0.2vw)" />
                <Dialog.Positioner>
                    <Dialog.Content bg="none" boxShadow="none" mt={0}>
                        <Dialog.Body display="flex" justifyContent="space-around" p={0}>
                            <WheelOFortuneContent
                                wheelRef={wheelOFortuneRef}
                                wheelItems={wheelItems}
                                currentItemIndex={currentItemIndex}
                                setCurrentItemIndex={setCurrentItemIndex}
                                leftMenu={
                                    <Flex h="vh" minW={450} justify="center">
                                        <WheelGameInfo
                                            game={games.data[currentItemIndex]}
                                            direction="column"
                                            justifyContent="space-around"
                                            px={4}
                                        />
                                    </Flex>
                                }
                                controlsMenu={
                                    <ChakraFlex
                                        gap={3}
                                        justify="center"
                                        align="center"
                                        direction="column"
                                    >
                                        <Button
                                            disabled={spinning || wasSpinned}
                                            onClick={handleSpin}
                                            w="full"
                                        >
                                            Крутить
                                        </Button>
                                        <SliderDebounced
                                            w="full"
                                            value={volume}
                                            setValue={val => setVolume(val)}
                                            label="Громкость"
                                        />
                                    </ChakraFlex>
                                }
                            />
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

type RollWheelSuccess = { success: true; data: RollWheelResultData; error?: never };

type RollWheelError = { success: false; error: string; data?: never };

type RollWheelResult = RollWheelSuccess | RollWheelError;

type RollWheelResultData = { fillerItems: WheelItem[]; winnerId: RecordIdString };

type WheelItem = { id: RecordIdString; name: string; icon: string };

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

    return (await res.json()) as RollWheelResult;
};
