import { DiceFactory, type DiceFactoryItem, type DiceType } from './dices';
import { useAppAuthContext } from '@context/AppContext';
import { useBoardInnerContext } from '@components/board';
import { AudioKey, useAudioPlayer } from '@shared/hook/useAudio';
import { type RefObject, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { AudioPresetRecord } from '@shared/types/audio-preset';
import { BoardHelper, type CellPosition } from '@components/board/BoardHelper';
import { invalidateAllActions, invalidatePlayerProgressAuth } from '@shared/queryClient';
import { performFadeOut } from '@components/actions/roll-dice/dices/roll';
import { useRollDiceStore } from '@components/actions/roll-dice/useRollDiceStore';
import { usePlayer } from '@components/board/players/usePlayer';
import { audioPresetSchema, pbCollections } from '@shared/pbSchema';
import type { RecordIdString } from '@shared/types/pocketbase';
import { handleApiResponse } from '@shared/helpers/api';

type Move = {
    type: string;
    world_id: RecordIdString;
    world_slug: string;
    cell_local_order: number;
    cell_global_order: number;
    total_steps: number;
    prev_total_steps: number;
};

type RollDiceResultData = {
    roll: number;
    dice_rolls: Array<{ type: DiceType; roll: number }>;
    moves: Array<Move>;
};

type RollDiceResult =
    | { success: true; data: RollDiceResultData; message?: string; error?: never }
    | { success: false; message: string; error: string; data?: never };

const diceRollRequest = async (authToken: string) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/roll`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
    });

    return (await res.json()) as RollDiceResult;
};

const FADEOUT_DURATION = 3;
const DEFAULT_ANIMATION_DURATION = 10;

export const useRollDice = (diceSceneRef: RefObject<HTMLDivElement | null>) => {
    const { pb, player } = useAppAuthContext();
    const { worldsById } = useBoardInnerContext();
    const { play } = useAudioPlayer(AudioKey.music);
    const { addPaths, setMoveTime } = usePlayer(player.id);

    const [isPending, setIsPending] = useState(false);
    const isRolling = useRollDiceStore(state => state.isRolling);
    const setIsRolling = useRollDiceStore(state => state.setIsRolling);

    const [dices, setDices] = useState<DiceFactoryItem[] | null>(null);
    const [pendingRolls, setPendingRolls] = useState<number[] | null>(null);
    const [animationDuration, setAnimationDuration] = useState<number>(DEFAULT_ANIMATION_DURATION);

    const audioPreset = useQuery({
        queryFn: async () => {
            return pb
                .collection(pbCollections.audioPresets)
                .getFirstListItem<AudioPresetRecord>(`${audioPresetSchema.slug} = "roll-dice"`, {
                    expand: 'audio',
                });
        },
        refetchOnWindowFocus: false,
        queryKey: ['roll-dice-audio-preset'],
    });

    const roll = async () => {
        if (isRolling) return;
        setIsRolling(true);
        setIsPending(true);

        const res = await diceRollRequest(pb.authStore.token);

        if (!handleApiResponse(res)) {
            setIsRolling(false);
            setIsPending(false);
            return;
        }

        setIsPending(false);

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

        for (const move of res.data.moves) {
            const world = worldsById.get(move.world_id);
            if (!world?.cellsCount) continue;

            if (move.type === 'path') {
                const path = BoardHelper.createPath(world, move.prev_total_steps, move.total_steps);
                paths.push(...path);
                continue;
            }

            paths.push(BoardHelper.getCoords(world, move.cell_global_order));
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
                await invalidatePlayerProgressAuth();
                if (diceSceneRef.current) {
                    diceSceneRef.current.style.opacity = '1';
                }
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

    return { roll, isRolling, dices, canRoll: audioPreset.isSuccess && !isRolling, isPending };
};
