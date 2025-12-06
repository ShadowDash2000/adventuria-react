import { type FC, useCallback, useEffect, useRef, useState } from 'react';
import { DiceFactory, type DiceFactoryItem, DiceType } from './dices';
import { Flex, For, Portal } from '@chakra-ui/react';
import { Button } from '@ui/button';
import { useAppContext } from '@context/AppContextProvider/AppContextProvider';
import type { CellRecord } from '@shared/types/cell';
import { performFadeOut } from './dices/roll';
import { useQuery } from '@tanstack/react-query';
import type { AudioPresetRecord } from '@shared/types/audio-preset';
import { LuDices } from 'react-icons/lu';

const FADEOUT_DURATION = 3;

export const RollDiceButton: FC = () => {
    const { pb, audioActions, refetchActions, user } = useAppContext();
    const [dices, setDices] = useState<DiceFactoryItem[] | null>(null);
    const [rolls, setRolls] = useState<number[] | null>(null);
    const [path, setPath] = useState<Array<MoveEvent> | null>(null);
    const [isRolling, setIsRolling] = useState<boolean>(false);
    const diceSceneRef = useRef<HTMLDivElement>(null);

    const roll = useCallback(async () => {
        const res = await diceRollRequest(pb.authStore.token);

        if (!res.success) return;

        const dices = [];
        const rolls = [];
        for (const [i, diceRoll] of res.data.dice_rolls.entries()) {
            dices.push(DiceFactory.create(diceRoll.type, { key: `${diceRoll.type}-${i}` }));
            rolls.push(diceRoll.roll);
        }

        setDices(dices);
        setRolls(rolls);
        setPath(res.data.path);
    }, []);

    const audioPreset = useQuery({
        queryFn: async () => {
            return pb
                .collection('audio_presets')
                .getFirstListItem<AudioPresetRecord>('slug = "roll-dice"', {
                    expand: 'audio',
                    fields:
                        'audio,' +
                        'expand.audio.id,expand.audio.collectionName,expand.audio.audio,expand.audio.duration',
                });
        },
        refetchOnWindowFocus: false,
        queryKey: ['roll-dice-audio-preset'],
    });

    useEffect(() => {
        if (!dices || !rolls || !path) return;

        let duration = 10;
        if (audioPreset.isSuccess) {
            const randIndex = Math.floor(Math.random() * audioPreset.data.audio.length);
            const randAudio = audioPreset.data.expand!.audio[randIndex];
            duration = randAudio.duration;
            const audioUrl = pb.files.getURL(randAudio, randAudio.audio);
            audioActions.play(audioUrl);
        }

        const durationDifference = 1;
        let curDuration = duration - (dices.length - 1) * durationDifference;

        for (const [i, dice] of dices.entries()) {
            dice.ref.current?.roll(rolls[i], curDuration);
            curDuration += durationDifference;
        }

        for (const move of path) {
            document.dispatchEvent(
                new CustomEvent(`player.move.${user!.id}`, {
                    detail: {
                        prevCellsPassed: move.prev_total_steps,
                        cellsPassed: move.total_steps,
                        pathTime: duration,
                    },
                }),
            );
        }

        setTimeout(() => {
            if (diceSceneRef.current) {
                performFadeOut(diceSceneRef.current, FADEOUT_DURATION);
            }
            setTimeout(() => refetchActions(), FADEOUT_DURATION * 1000);
        }, duration * 1000);
    }, [dices, rolls, path]);

    return (
        <>
            <Button
                colorPalette="{colors.purple}"
                hoverColorPalette="{colors.purple.hover}"
                disabled={!audioPreset.isSuccess || isRolling}
                onClick={async () => {
                    try {
                        await roll();
                        setIsRolling(true);
                    } catch (e: any) {
                        console.log(e?.message ?? 'Unknown error');
                    }
                }}
            >
                <LuDices />
                Бросить кубики
            </Button>
            <Portal>
                <Flex ref={diceSceneRef} position="fixed" gap="{spacing.40}" top={0} zIndex={100}>
                    {dices ? <For each={dices}>{dice => dice.element}</For> : null}
                </Flex>
            </Portal>
        </>
    );
};

type RollDiceSuccess = { success: true; data: RollDiceResultData; error?: never };

type RollDiceError = { success: false; error: string; data?: never };

type RollDiceResult = RollDiceSuccess | RollDiceError;

type RollDiceResultData = {
    roll: number;
    dice_rolls: Array<{ type: DiceType; roll: number }>;
    path: Array<MoveEvent>;
};

type MoveEvent = {
    steps: number;
    total_steps: number;
    prev_total_steps: number;
    current_cell: CellRecord;
    laps: number;
};

const diceRollRequest = async (authToken: string) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/roll`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!res.ok) {
        const error = await res
            .json()
            .then(res => res.error)
            .catch(() => '');
        const text = await res.text().catch(() => '');
        throw new Error(error || text || `Failed to roll dice`);
    }

    return (await res.json()) as RollDiceResult;
};
