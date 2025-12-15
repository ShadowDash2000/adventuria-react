import { DiceFactory, type DiceFactoryItem, type DiceType } from './dices';
import type { CellRecord } from '@shared/types/cell';
import { useAppAuthContext } from '@context/AppContext';
import { useBoardInnerContext } from '@components/board';
import { AudioKey, useAudioPlayer } from '@shared/hook/useAudio';
import { type RefObject, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { AudioPresetRecord } from '@shared/types/audio-preset';
import { BoardHelper, type CellPosition } from '@components/board/BoardHelper';
import { invalidateAllActions, invalidateUser } from '@shared/queryClient';
import { performFadeOut } from '@components/actions/roll-dice/dices/roll';
import { useRollDiceStore } from '@components/actions/roll-dice/useRollDiceStore';
import { usePlayer } from '@components/board/players/usePlayer';

type MoveEvent = {
    steps: number;
    total_steps: number;
    prev_total_steps: number;
    current_cell: CellRecord;
    laps: number;
};

type RollDiceResultData = {
    roll: number;
    dice_rolls: Array<{ type: DiceType; roll: number }>;
    path: Array<MoveEvent>;
};

type RollDiceResult =
    | { success: true; data: RollDiceResultData; error?: never }
    | { success: false; error: string; data?: never };

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
        console.log(error || (await res.text()) || 'Failed to roll dice');
        return null;
    }
    return (await res.json()) as RollDiceResult;
};

const FADEOUT_DURATION = 3;
const DEFAULT_ANIMATION_DURATION = 10;

export const useRollDice = (diceSceneRef: RefObject<HTMLDivElement | null>) => {
    const { pb, user } = useAppAuthContext();
    const { rows, cols } = useBoardInnerContext();
    const { play } = useAudioPlayer(AudioKey.music);
    const { addPaths, setMoveTime } = usePlayer(user.id);

    const isRolling = useRollDiceStore(state => state.isRolling);
    const setIsRolling = useRollDiceStore(state => state.setIsRolling);

    const [dices, setDices] = useState<DiceFactoryItem[] | null>(null);
    const [pendingRolls, setPendingRolls] = useState<number[] | null>(null);
    const [animationDuration, setAnimationDuration] = useState<number>(DEFAULT_ANIMATION_DURATION);

    const audioPreset = useQuery({
        queryFn: async () => {
            return pb
                .collection('audio_presets')
                .getFirstListItem<AudioPresetRecord>('slug = "roll-dice"', { expand: 'audio' });
        },
        refetchOnWindowFocus: false,
        queryKey: ['roll-dice-audio-preset'],
    });

    const roll = async () => {
        if (isRolling) return;
        setIsRolling(true);

        const res = await diceRollRequest(pb.authStore.token);
        if (!res || !res.success) {
            setIsRolling(false);
            return;
        }

        const newDices: DiceFactoryItem[] = [];
        const rollValues: number[] = [];

        for (const [i, diceRoll] of res.data.dice_rolls.entries()) {
            newDices.push(DiceFactory.create(diceRoll.type, { key: `${diceRoll.type}-${i}` }));
            rollValues.push(diceRoll.roll);
        }

        let duration = DEFAULT_ANIMATION_DURATION;
        if (audioPreset.isSuccess && audioPreset.data.expand?.audio?.length) {
            const randIndex = Math.floor(Math.random() * audioPreset.data.expand.audio.length);
            const randAudio = audioPreset.data.expand.audio[randIndex];
            duration = randAudio.duration;

            const audioUrl = pb.files.getURL(randAudio, randAudio.audio);
            await play(audioUrl);
        }

        setAnimationDuration(duration);
        setDices(newDices);
        setPendingRolls(rollValues);

        const paths: CellPosition[] = [];
        for (const move of res.data.path) {
            paths.push(
                ...BoardHelper.createPath(rows, cols, move.prev_total_steps, move.total_steps),
            );
        }

        addPaths(paths);
        setMoveTime(duration / paths.length);
        setTimeout(() => {
            if (diceSceneRef.current) {
                performFadeOut(diceSceneRef.current, FADEOUT_DURATION);
            }
            setTimeout(async () => {
                setDices(null);
                setPendingRolls(null);
                setIsRolling(false);
                await invalidateAllActions();
                await invalidateUser();
            }, FADEOUT_DURATION * 1000);
        }, duration * 1000);
    };

    useEffect(() => {
        if (!dices || !pendingRolls) return;

        const durationDifference = 1;
        let curDuration = animationDuration - (dices.length - 1) * durationDifference;

        dices.forEach((dice, i) => {
            dice.ref.current?.roll(pendingRolls[i], curDuration);
            curDuration += durationDifference;
        });

        setPendingRolls(null);
    }, [dices, pendingRolls, animationDuration]);

    return { roll, isRolling, dices, canRoll: audioPreset.isSuccess && !isRolling };
};
