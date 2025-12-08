import { useAppContext } from '@context/AppContextProvider/AppContextProvider';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { WheelOFortuneHandle } from './WheelOFortune';
import { useQuery } from '@tanstack/react-query';
import type { AudioPresetRecord } from '@shared/types/audio-preset';
import { LuFerrisWheel, LuLoader } from 'react-icons/lu';
import { Text, Flex as ChakraFlex, IconButton } from '@chakra-ui/react';
import type { RecordIdString } from '@shared/types/pocketbase';
import { WheelOFortuneModal } from './WheelOFortuneModal';
import { Button } from '@ui/button';
import { VolumeSlider } from '../../VolumeSlider';
import type { ItemRecord } from '@shared/types/item';
import { Flex } from '@ui/flex';
import { WheelItemInfo } from './WheeItemInfo';
import { Tooltip } from '@ui/tooltip';

export const ItemsWheelModal = () => {
    const { pb, user, audioActions, refetchUser } = useAppContext();
    const wheelOFortuneRef = useRef<WheelOFortuneHandle>(null);
    const [open, setOpen] = useState(false);
    const [spinning, setSpinning] = useState(false);
    const [currentItemIndex, setCurrentItemIndex] = useState(0);

    const items = useQuery({
        queryFn: () =>
            pb
                .collection('items')
                .getFullList<ItemRecord>({ filter: `type = "buff" && isRollable = true` }),
        refetchOnWindowFocus: false,
        queryKey: ['items'],
    });

    const audioPreset = useQuery({
        queryFn: async () => {
            return pb
                .collection('audio_presets')
                .getFirstListItem<AudioPresetRecord>('slug = "roll-items"', {
                    expand: 'audio',
                    fields:
                        'audio,' +
                        'expand.audio.id,expand.audio.collectionName,expand.audio.audio,expand.audio.duration',
                });
        },
        refetchOnWindowFocus: false,
        queryKey: ['roll-items-audio-preset'],
    });

    const handleSpin = useCallback(async () => {
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
            await audioActions.play(audioUrl);
        }

        ref.spin({ targetKey: res.data.winnerId, durationMs: duration * 1000 }).then(
            async currentIndex => {
                setSpinning(false);
                setCurrentItemIndex(currentIndex);
                await refetchUser();
            },
        );
        setSpinning(true);
    }, [wheelOFortuneRef, audioPreset, audioActions]);

    const wheelItems = useMemo(
        () =>
            items.data
                ? items.data.map(item => ({
                      key: item.id,
                      image: pb.files.getURL(item, item.icon),
                      title: item.name,
                  }))
                : [],
        [items.data],
    );

    if (items.isPending || audioPreset.isPending) return <LuLoader />;
    if (items.isError) return <Text>Error: {items.error?.message}</Text>;
    if (audioPreset.isError) return <Text>Error: {audioPreset.error?.message}</Text>;

    return (
        <WheelOFortuneModal
            trigger={
                <Tooltip content="Колесо предметов">
                    <IconButton
                        disabled={user.itemWheelsCount === 0}
                        colorPalette="{colors.purple}"
                        _hover={{ bg: '{colors.purple.hover}' }}
                    >
                        <LuFerrisWheel />x{user.itemWheelsCount}
                    </IconButton>
                </Tooltip>
            }
            open={open}
            onOpenChange={async e => {
                if (!spinning) setOpen(e.open);
            }}
            wheelRef={wheelOFortuneRef}
            wheelItems={wheelItems}
            currentItemIndex={currentItemIndex}
            setCurrentItemIndex={setCurrentItemIndex}
            leftMenu={
                <Flex h="vh" minW={450} justify="center">
                    <WheelItemInfo
                        item={items.data[currentItemIndex]}
                        direction="column"
                        justifyContent="space-around"
                        px={4}
                    />
                </Flex>
            }
            controlsMenu={
                <ChakraFlex gap={3} justify="center" direction="column">
                    <Button disabled={spinning || user.itemWheelsCount === 0} onClick={handleSpin}>
                        Крутить (x{user.itemWheelsCount})
                    </Button>
                    <VolumeSlider
                        volume={audioActions.volume}
                        setVolume={val => audioActions.setVolume(val)}
                    />
                </ChakraFlex>
            }
        />
    );
};

type RollItemSuccess = { success: true; data: RollItemResultData; error?: never };

type RollItemError = { success: false; error: string; data?: never };

type RollItemResult = RollItemSuccess | RollItemError;

type RollItemResultData = { fillerItems: WheelItem[]; winnerId: RecordIdString };

type WheelItem = { id: RecordIdString; name: string; icon: string };

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

    return (await res.json()) as RollItemResult;
};
