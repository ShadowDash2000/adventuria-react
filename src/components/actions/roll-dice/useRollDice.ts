import { useState } from 'react';
import type { AudioPresetRecord } from '@shared/types/audio-preset';
import type { Move } from '@shared/types/move';
import { type DiceRoll, type DiceType, useRollDice as useRollDiceState } from '@components/dices';
import { useAppAuthContext } from '@context/AppContext';
import { useBoardInnerContext } from '@components/board';
import { AudioKey, useAudioPlayer } from '@shared/hook/useAudio';
import { useQuery } from '@tanstack/react-query';
import { BoardHelper, type CellPosition } from '@components/board/BoardHelper';
import { invalidateAllActions, invalidateGameState } from '@shared/query';
import { usePlayer } from '@components/board/players/usePlayer';
import { audioPresetSchema, pbCollections } from '@shared/pbSchema';
import { handleApiResponse } from '@shared/helpers/api';

const DEFAULT_ANIMATION_DURATION = 10;

export const useRollDice = () => {
    const { pb, playerId } = useAppAuthContext();
    const { worldsById } = useBoardInnerContext();
    const { play } = useAudioPlayer(AudioKey.music);
    const { addPaths, setMoveTime } = usePlayer(playerId);

    const [isPending, setIsPending] = useState(false);
    const { isRolling, setIsRolling, setPendingRoll } = useRollDiceState();

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

        let duration = DEFAULT_ANIMATION_DURATION;
        if (audioPreset.isSuccess && audioPreset.data.expand?.audio?.length) {
            const randIndex = Math.floor(Math.random() * audioPreset.data.expand.audio.length);
            const randAudio = audioPreset.data.expand.audio[randIndex];
            duration = randAudio.duration;

            const audioUrl = pb.files.getURL(randAudio, randAudio.audio);
            await play(audioUrl);
        }

        const rolls: DiceRoll[] = [];
        for (const diceRoll of res.data.dice_rolls) {
            rolls.push({ dice: diceRoll.type, value: diceRoll.roll });
        }

        setPendingRoll(rolls, duration);

        const paths: CellPosition[] = [];

        for (const move of res.data.moves) {
            const world = worldsById.get(move.world_id);
            if (!world?.cellsCount) continue;

            if (move.type === 'path') {
                const path = BoardHelper.createPath(world, move.prev_total_steps, move.total_steps);
                paths.push(...path);
                continue;
            }

            paths.push(BoardHelper.getCoords(world, move.cell_local_order));
        }

        addPaths(paths);
        setMoveTime(duration / paths.length);
        setTimeout(async () => {
            setIsRolling(false);
            await invalidateAllActions();
            await invalidateGameState();
        }, duration * 1000);
    };

    return { roll, canRoll: audioPreset.isSuccess && !isRolling, isPending };
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
